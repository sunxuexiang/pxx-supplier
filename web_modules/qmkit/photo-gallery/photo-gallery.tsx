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
import { Tips, Const, QMUpload } from 'qmkit';
import './photo-gallery.less';
import { getImgCates, fetchImages } from './webapi';

export default function PhotoGallery(props) {
  // 已上传图片
  const [imgList, setImgList] = useState([]);
  // 图片库弹窗显示
  const [visible, setVisible] = useState(false);
  // 图片库类目
  const [cateList, setCateList] = useState([] as any);
  // 当前类目搜索参数
  const [imgCateParams, setCateParams] = useState({
    pageNum: 0,
    pageSize: 12,
    resourceName: '',
    cateIds: [],
    resourceType: 0
  });
  // 当前类目图片库总数
  const [imgCateCount, setCateCount] = useState(0);
  // 当前类目图片
  const [currentTypeImageList, setTypeImageList] = useState([]);
  // 图片大小
  const [FILE_MAX_SIZE] = useState(20 * 1024 * 1024);
  // 图片库已选择图片
  const [checkImgList, setCheckImg] = useState([]);
  // 图片库搜索内容
  const [imgName, setImgName] = useState('');
  // 翻页
  useEffect(() => {
    getCateImgData();
  }, [imgCateParams]);
  // 显示控制
  useEffect(() => {
    if (props.show) {
      imageCateList();
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [props.show]);
  // 获取图片类目
  const imageCateList = () => {
    getImgCates().then((data) => {
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
      setCateList(newDataList);
      console.warn(data.res[0].cateId, '-----');

      setCateParams({
        ...imgCateParams,
        cateIds: data.res.length ? [data.res[0].cateId.toString()] : []
      });
    });
  };
  //处理分类的树形图结构数据
  const renderGoodsCate = (cateList) => {
    return cateList.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            key={item.cateId}
            value={item.cateId}
            title={item.cateName}
          >
            {renderGoodsCate(item.children)}
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
  // 获取当前类目、搜索图片
  const getCateImgData = () => {
    fetchImages(imgCateParams).then((data) => {
      console.warn(data, '当前类目图片');
      setTypeImageList(data.res.context.content);
      setCateCount(data.res.context.totalElements);
    });
  };
  /**
   * 检查文件格式
   */
  const checkUploadFile = (file, fileList) => {
    if (fileList.length > props.maxCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error(`最多一次性上传${props.maxCount}张图片`);
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过20M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  /**
   * 清除选中的图片
   * @private
   */
  const handleUploadClick = () => {};
  // 本地上传图片
  const editImages = (info) => {
    const { file } = info;
    console.warn(info);
    if (file.status === 'done') {
      if (
        file.response &&
        file.response.code &&
        file.response.code !== Const.SUCCESS_CODE
      ) {
        message.error('上传失败');
      } else {
        message.success(`${file.name} 上传成功！`);
        getCateImgData();
      }
    }
  };
  // 选择图片
  const checkImg = (data) => {
    const idx = checkImgList.findIndex((el) => {
      return el.imageId === data.resourceId;
    });
    const list = [...checkImgList];
    if (idx === -1) {
      const imgItem = { imageId: data.resourceId, artworkUrl: data.artworkUrl };
      list.push(imgItem);
    } else {
      list.splice(idx, 1);
    }
    setCheckImg([...list]);
  };
  // 切换类目
  const changeCate = (cateIds, e) => {
    console.warn(cateIds, e);
    const params = { ...imgCateParams, cateIds };
    setCateParams(params);
  };
  // 确认添加
  const confirmAddImg = () => {
    if (imgList.length + checkImgList.length > props.maxCount) {
      message.warning(`当前最多可选择${props.maxCount}张`);
      return;
    }
    props.setImg(checkImgList);
    setVisible(false);
    setCheckImg([]);
    props.hide();
  };
  // 是否选择
  const isCheck = (item) => {
    const idx = checkImgList.findIndex((el) => {
      return item.resourceId === el.imageId;
    });

    return idx !== -1;
  };
  return (
    <div className="photo-gallery">
      <Modal
        title="图片库"
        width={880}
        visible={visible}
        onOk={confirmAddImg}
        onCancel={() => {
          setVisible(false);
          props.hide();
        }}
      >
        <div className="photo-gallery-modal">
          {/* 图片库搜索 */}
          <div className="photo-gallery-modal-head">
            {/* 本地上传按钮 */}
            <QMUpload
              name="uploadFile"
              onChange={editImages}
              showUploadList={false}
              action={
                Const.HOST +
                `/store/uploadStoreResource?cateId=${imgCateParams.cateIds[0]}&resourceType=IMAGE`
              }
              multiple={true}
              disabled={imgCateParams.cateIds[0] ? false : true}
              accept={'.jpg,.jpeg,.png,.gif'}
              beforeUpload={checkUploadFile}
            >
              <Button onClick={() => handleUploadClick()}>商品上传</Button>
            </QMUpload>
            {/* 文件名 */}
            <Input
              style={{ marginLeft: 20 }}
              placeholder="请输图片名称"
              onChange={(e) => {
                setImgName(e.target.value);
              }}
            />
            <Button
              style={{ marginLeft: 20 }}
              onClick={(e) => {
                e.preventDefault();
                setCateParams({ ...imgCateParams, resourceName: imgName });
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
              <div className="photo-cate-list">
                <Tree
                  selectedKeys={imgCateParams.cateIds}
                  onSelect={changeCate}
                >
                  {renderGoodsCate(cateList)}
                </Tree>
              </div>
            </Col>
            <Col span={19}>
              {!currentTypeImageList.length && (
                <Result icon={<Icon type="picture" />} title="暂无图片~" />
              )}
              {/* 图片列表 */}
              <div className="photo-grid">
                {currentTypeImageList.map((item) => {
                  return (
                    <div
                      className=""
                      key={item.resourceKey}
                      onClick={() => {
                        checkImg(item);
                      }}
                    >
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={item.resourceKey}
                            src={item.artworkUrl}
                            style={{ height: 100 }}
                          />
                        }
                        bodyStyle={{ padding: 10 }}
                        style={{ borderRadius: 10 }}
                      >
                        <Card.Meta
                          description={
                            <p className="img-desc">{item.resourceName}</p>
                          }
                        ></Card.Meta>
                        <Checkbox
                          className="photo-cate-img-check"
                          checked={isCheck(item)}
                          onChange={() => {
                            checkImg(item);
                          }}
                        />
                      </Card>
                    </div>
                  );
                })}
              </div>
              {currentTypeImageList.length > 0 && (
                <Pagination
                  onChange={(pageNum) => {
                    const cur = pageNum - 1;
                    setCateParams({ ...imgCateParams, pageNum: cur });
                  }}
                  current={imgCateParams.pageNum + 1}
                  total={imgCateCount}
                  pageSize={imgCateParams.pageSize}
                />
              )}
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}
PhotoGallery.defaultProps = {
  showList: true,
  maxCount: 10,
  setImg: () => {}
};
