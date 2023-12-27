import * as React from 'react';
import { Modal, Form, TreeSelect, Tree, Upload, Icon, message } from 'antd';
import { Relax } from 'plume2';
import { noop, Const, cache } from 'qmkit';
import { List } from 'immutable';
import { getOssToken, saveResources } from '../webapi';
import moment from 'moment';
import Button from 'antd/lib/button/button';
declare type IList = List<any>;

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const FILE_MAX_SIZE = 30 * 1024 * 1024;

@Relax
export default class uploadVideoModal extends React.Component<any, any> {
  state = {
    cateId: '',
    fileList: [],
    cateDisabled: false,
    uploadHost: '',
    uploadData: {} as any
  };

  props: {
    relaxProps?: {
      uploadVisible: boolean; // 弹框是否显示
      cateList: IList; //分类列表
      showUploadVideoModal: Function; //上传视频弹窗
      autoExpandVideoCate: Function; //上传成功后,自动展开上传的分类
      queryVideoPage: Function; //查询视频分页列表
    };
  };

  static relaxProps = {
    uploadVisible: 'uploadVisible',
    showUploadVideoModal: noop,
    cateList: 'cateList',
    autoExpandVideoCate: noop,
    queryVideoPage: noop
  };

  render() {
    const { uploadHost, uploadData } = this.state;
    const { uploadVisible, cateList } = this.props.relaxProps;
    if (!uploadVisible) {
      return null;
    }
    const setFileList = this._setFileList;
    const setCateDisabled = this._setCateDisabled;
    const { storeId, companyInfoId } = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA)
    );
    const cateIdCurr = this.state.cateId;
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId').toString()}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId').toString()}
            title={item.get('cateName')}
          />
        );
      });

    const props = {
      name: 'file',
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: true,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: false },
      action: uploadHost,
      data: uploadData,
      accept: '.mp4',
      beforeUpload: (file) => {
        if (!cateIdCurr) {
          message.error('请先选择分类!');
          return false;
        }
        let fileName = file.name.toLowerCase();

        if (!fileName.trim()) {
          message.error('请输入文件名');
          return false;
        }

        if (
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
            fileName
          )
        ) {
          message.error('请输入正确格式的文件名');
          return false;
        }

        if (fileName.length > 40) {
          message.error('文件名过长');
          return false;
        }

        // 支持的视频格式：jpg、jpeg、png、gif
        if (fileName.endsWith('.mp4')) {
          if (file.size <= FILE_MAX_SIZE) {
            return new Promise<void>(async (resolve, reject) => {
              // const timeFlag = await this.checkVideoTime(file);
              // if (timeFlag) {
              getOssToken()
                .then(({ res }) => {
                  if (res && res.code === Const.SUCCESS_CODE && res.context) {
                    const data = res.context;
                    this.setState(
                      {
                        uploadHost: data.host,
                        uploadData: {
                          key: `${moment().format('YYYYMMDDHHmmssSSSS')}.mp4`,
                          OSSAccessKeyId: data.accessid,
                          policy: data.policy,
                          signature: data.signature,
                          success_action_status: '200'
                        }
                      },
                      () => {
                        resolve(file);
                      }
                    );
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
            message.error('文件大小不能超过30M');
            return false;
          }
        } else {
          message.error('文件格式错误');
          return false;
        }
      },
      onChange: async (info) => {
        const status = info.file.status;
        let fileList = info.fileList;

        if (status === 'done') {
          if (info.file && info.file.xhr && info.file.xhr.status === 200) {
            const { res } = await saveResources({
              resourceType: 1,
              cateId: cateIdCurr,
              storeId,
              companyInfoId,
              resourceKey: uploadData.key,
              resourceName: info.file.name,
              artworkUrl: uploadData.key,
              serverType: 'aliYun'
            });
            if (res && res.code === Const.SUCCESS_CODE) {
              message.success(`${info.file.name} 上传成功！`);
              setCateDisabled();
            } else {
              message.error(`${info.file.name} 上传失败！`);
            }
          } else {
            message.error(`${info.file.name} 上传失败！`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }

        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter(
          (f) =>
            f.status == 'uploading' ||
            (f.status == 'done' && !f.response) ||
            (f.status == 'done' && f.response && !f.response.code)
        );

        setFileList(fileList);
      }
    };

    return (
      <Modal
        maskClosable={false}
        title="上传视频"
        visible={uploadVisible}
        cancelText="关闭"
        onCancel={this._handleCancel}
        onOk={this._handleOk}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="选择分类"
            required={true}
            hasFeedback
          >
            <TreeSelect
              showSearch
              disabled={this.state.cateDisabled}
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 300 }}
              value={this.state.cateId}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              allowClear
              treeDefaultExpandAll
              onChange={this._onChange}
            >
              {loop(cateList)}
            </TreeSelect>
          </FormItem>
          <FormItem {...formItemLayout} label="选择视频" required={true}>
            <div>
              <Upload {...props} fileList={this.state.fileList}>
                <Button>
                  <Icon type="upload" /> 点击上传视频
                </Button>
              </Upload>
            </div>
            <p style={{ lineHeight: '2em', marginTop: '15px', color: '#999' }}>
              商品视频最大30M，建议时长15s内，支持文件类型：mp4，推荐视频比例7：9
            </p>
          </FormItem>
        </Form>
      </Modal>
    );
  }

  // 检查视频时长
  checkVideoTime = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      try {
        video.oncanplay = () => {
          console.log(video.duration);
          if (video.duration && video.duration <= 30) {
            resolve(true);
          } else {
            message.error('视频时长不能超过30秒');
            resolve(false);
          }
        };
      } catch (error) {
        message.error('视频读取失败');
        reject(false);
      }
    });
  };

  /**
   * 上传成功后,分类不可编辑
   * @private
   */
  _setCateDisabled = () => {
    this.setState({ cateDisabled: true });
  };

  /**
   * 选择视频
   * @param info 上传的视频信息
   * @private
   */
  _setFileList = (fileList) => {
    this.setState({ fileList });
  };

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _onChange = (value) => {
    this.setState({ cateId: value });
  };

  /**
   * 关闭弹窗
   * @private
   */
  _handleCancel = () => {
    if (
      this.state.cateId == '' ||
      this.state.fileList.filter((file) => file.status === 'done').length <= 0
    ) {
      const { showUploadVideoModal } = this.props.relaxProps;
      showUploadVideoModal(false);
      this.setState({ cateId: '', fileList: [], cateDisabled: false });
    } else {
      this._okFunc();
    }
  };

  /**
   * 提交
   * @param e
   * @private
   */
  _handleOk = () => {
    if (this.state.cateId == '') {
      message.error('请选择分类!');
      return;
    }
    if (
      this.state.fileList.filter((file) => file.status === 'done').length <= 0
    ) {
      message.error('请选择上传视频!');
      return;
    }

    this._okFunc();
  };

  /**
   * 确定并刷新对应分类的列表
   * @private
   */
  _okFunc = () => {
    //提交
    const {
      autoExpandVideoCate,
      showUploadVideoModal,
      queryVideoPage
    } = this.props.relaxProps;
    //展开上传的分类
    autoExpandVideoCate(this.state.cateId);
    showUploadVideoModal(false);
    //刷新列表信息
    queryVideoPage();
    this.setState({ cateId: '', fileList: [], cateDisabled: false });
  };
}
