import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Button,
  message,
  Row,
  Col,
  Tree,
  Card,
  Checkbox,
  Pagination,
  Result,
  Icon
} from 'antd';
import { Const, QMUpload, cache } from 'qmkit';
import './video-library.less';
import { getVideoCate, getVideoData, getOssToken, saveResources } from './webapi';
import moment from 'moment';
import { time } from 'console';

export default function VideoLibrary(props) {
  // 文件大小
  const [FILE_MAX_SIZE] = useState(30 * 1024 * 1024);
  // 弹窗显示
  const [videoShow, setShow] = useState(false);
  // 当前类目搜索参数
  const [videoCateParams, setVideoCateParams] = useState({
    pageNum: 0,
    pageSize: 10,
    resourceName: '',
    cateIds: [],
    resourceType: 1
  });
  // 当前搜索视频名称
  const [videoName, setVideoName] = useState('');
  // 目录数据
  const [videoCateData, setVideoCateData] = useState([]);
  // 视频列表数据
  const [videoData, setVideoData] = useState([]);
  // 总数
  const [videoCount, setVideoCount] = useState(0);
  // 最大选择数量
  const [maxCount, setCount] = useState(1);
  // 上传loading
  const [uploadLoading, setUploadLoading] = useState(false);
  // 视频上传参数
  const [uploadData, setUploadData] = useState({
    host: '',
    data: {} as any
  })
  // 显示控制
  useEffect(() => {
    if (props.videoVisible) {
      setShow(true);
      videoCateList();
    } else {
      setShow(false);
    }
  }, [props.videoVisible]);
  // 初始化视频列表数据
  useEffect(() => {
    getCateVideoData();
  }, [videoCateParams]);
  // 本地上传图片
  const uploadVideo = async (info) => {
    const { storeId, companyInfoId } = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA)
    );
    const { file } = info;
    console.warn(info);
    if (file.status === 'uploading') {
      setUploadLoading(true);
    }
    if (file.status === 'done') {
      setUploadLoading(false);
      if (info.file && info.file.xhr && info.file.xhr.status === 200) {
        const { res } = await saveResources({
          resourceType: 1,
          cateId: videoCateParams.cateIds[0],
          storeId,
          companyInfoId,
          resourceKey: uploadData.data.key,
          resourceName: info.file.name,
          artworkUrl: uploadData.data.key,
          serverType: 'aliYun'
        });
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success(`${info.file.name} 上传成功！`);
          getCateVideoData();
        } else {
          message.error(`${info.file.name} 上传失败！`);
        }
      } else {
        message.error(`${info.file.name} 上传失败！`);
      }
    }
  };

  // 检查视频时长
  const checkVideoTime = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      try {
        video.oncanplay = () => {
          console.log(video.duration);
          if (video.duration && video.duration <= 30) {
            resolve(true)
          } else {
            message.error('视频时长不能超过30秒');
            resolve(false)
          }
        }
      } catch (error) {
        message.error('视频读取失败');
        reject(false);
      }
    })
  }

  // 检查文件格式
  const checkUploadFile = (file, fileList) => {
    if (fileList.length > maxCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error('最多一次性上传一个文件');
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的格式：mp4
    if (fileName.endsWith('.mp4')) {
      if (file.size <= FILE_MAX_SIZE) {
        return new Promise<void>(async (resolve, reject) => {
          // const timeFlag = await checkVideoTime(file);
          // if (timeFlag) {
          getOssToken()
            .then(({ res }) => {
              if (res && res.code === Const.SUCCESS_CODE && res.context) {
                const data = res.context;
                setUploadData({
                  host: data.host,
                  data: {
                    key: `${moment().format('YYYYMMDDHHmmssSSSS')}.mp4`,
                    OSSAccessKeyId: data.accessid,
                    policy: data.policy,
                    signature: data.signature,
                    success_action_status: '200'
                  }
                });
                setTimeout(() => {
                  resolve(file);
                }, 10)
              } else {
                message.error(res.message || '');
                reject();
              }
            })
            .catch(() => {
              message.error('上传失败');
              reject();
            });
          // } else {
          //   reject();
          // }
        });
      } else {
        message.error('文件大小不能超过50M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  // 获取图片类目
  const videoCateList = () => {
    getVideoCate().then((data) => {
      const allCate = data.res;
      // 改变数据形态，变为层级结构(目前最多2层)
      const newDataList = allCate
        .filter((item) => item.cateParentId === 0)
        .map((data) => {
          const children = allCate.filter(
            (item) => item.cateParentId === data.cateId
          );
          if (children.length > 0) {
            data['children'] = children;
          }
          return data;
        });
      setVideoCateData(newDataList);
      console.warn(data.res[0].cateId, '-----');

      setVideoCateParams({
        ...videoCateParams,
        cateIds: data.res.length ? [data.res[0].cateId.toString()] : []
      });
    });
  };
  // 处理分类的树形图结构数据
  const renderVideoCate = (cateList) => {
    return cateList.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            key={item.cateId}
            value={item.cateId}
            title={item.cateName}
          >
            {renderVideoCate(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          key={item.cateId}
          value={item.cateId}
          title={item.cateName}
        />
      );
    });
  };
  // 获取当前视频类目数据
  const getCateVideoData = () => {
    getVideoData(videoCateParams)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取视频数据失败');
          return;
        }
        console.warn(data, '当前视频数据');
        const videoList = data.res.context.content.map((item) => {
          item['isCheck'] = false;
          return item;
        });
        setVideoData(videoList);
        setVideoCount(data.res.context.totalElements);
      })
      .catch((err) => {
        message.error('获取视频数据失败');
      });
  };
  // 切换类目
  const changeCate = (cateIds) => {
    console.warn(cateIds);
    const params = { ...videoCateParams, cateIds };
    setVideoCateParams(params);
  };
  // 选择视频
  const checkVideo = (data) => {
    const idx = videoData.findIndex((item) => {
      return item.resourceId === data.resourceId;
    });
    const list = [...videoData];
    list[idx].isCheck = !data.isCheck;
    setVideoData([...list]);
  };
  // 确认选择
  const confirmAddVideo = () => {
    const checkData = videoData.filter((el) => {
      return el.isCheck;
    });
    if (checkData.length > maxCount) {
      message.warning(`当前最多可选择${maxCount}个视频`);
      return;
    }
    setShow(false);
    props.hideModal(checkData);
  };
  return (
    <Modal
      title="视频库"
      width={880}
      visible={videoShow}
      onOk={confirmAddVideo}
      onCancel={() => {
        setShow(false);
        props.hideModal();
      }}
    >
      <div className="video-library-modal">
        {/* 视频库搜索 */}
        <div className="video-library-modal-head">
          {/* 本地上传按钮 */}
          <QMUpload
            name="file"
            onChange={uploadVideo}
            showUploadList={false}
            action={uploadData.host}
            data={uploadData.data}
            multiple={true}
            disabled={videoCateParams.cateIds[0] ? false : true}
            accept={'.mp4'}
            beforeUpload={checkUploadFile}
          >
            <Button loading={uploadLoading}>
              {uploadLoading ? '正在上传' : '商品上传'}
            </Button>
          </QMUpload>
          {/* 文件名 */}
          <Input
            style={{ marginLeft: 20 }}
            placeholder="请输视频名称"
            onChange={(e) => {
              setVideoName(e.target.value);
            }}
          />
          <Button
            style={{ marginLeft: 20 }}
            onClick={(e) => {
              e.preventDefault();
              setVideoCateParams({
                ...videoCateParams,
                resourceName: videoName
              });
            }}
            type="primary"
            icon="search"
          >
            搜索
          </Button>
        </div>
        <Row gutter={20}>
          {/* 图片类目 */}
          <Col span={4}>
            <div className="video-library-modal-list">
              <Tree
                selectedKeys={videoCateParams.cateIds}
                onSelect={changeCate}
              >
                {renderVideoCate(videoCateData)}
              </Tree>
            </div>
          </Col>
          <Col span={20}>
            {!videoData.length && (
              <Result icon={<Icon type="video-camera" />} title="暂无视频~" />
            )}
            {/* 视频列表 */}
            <div className="video-library-modal-grid">
              {videoData.map((item) => {
                return (
                  <div
                    key={item.resourceId}
                    onClick={() => {
                      checkVideo(item);
                    }}
                  >
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={item.resourceKey}
                          src={require('./img/video.png')}
                          style={{ height: 100, borderRadius: '10px 10px 0 0' }}
                        />
                      }
                      bodyStyle={{ padding: 10 }}
                      style={{ borderRadius: 10 }}
                    >
                      <Card.Meta
                        description={
                          <p className="video-desc">{item.resourceName}</p>
                        }
                      ></Card.Meta>
                      <Checkbox
                        className="video-library-check"
                        checked={item.isCheck}
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
            {videoData.length > 0 && (
              <Pagination
                onChange={(pageNum) => {
                  const cur = pageNum - 1;
                  setVideoCateParams({ ...videoCateParams, pageNum: cur });
                }}
                current={videoCateParams.pageNum + 1}
                total={videoCount}
                pageSize={videoCateParams.pageSize}
              />
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
