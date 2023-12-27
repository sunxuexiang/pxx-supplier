import * as React from 'react';
import { Relax } from 'plume2';

import { fromJS } from 'immutable';
import { noop, QMUpload, Const } from 'qmkit';
import {
  Modal,
  Form,
  Input,
  message,
  Tree,
  Row,
  Col,
  Button,
  Checkbox,
  Pagination
} from 'antd';
import { List } from 'immutable';

import { choosedImgCountQL, clickImgsCountQL, clickEnabledQL } from '../ql';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class PicModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cateId: any;
      expandedKeys: any;
      cateIds: List<any>;
      imgCates: List<any>;
      imageName: string;
      visible: boolean;
      imgs: List<any>;
      currentPage: number;
      total: number;
      pageSize: number;
      searchName: string;
      images: List<any>;
      choosedImgCount: number;
      clickImgsCount: number;
      clickEnabled: boolean;
      imgType: number;

      initImg: Function;
      editCateId: Function;
      editDefaultCateId: Function;
      modalVisible: Function;
      search: Function;
      saveSearchName: Function;
      editImages: Function;
      chooseImg: Function;
      beSureImages: Function;
      cleanChooseImgs: Function;
    };
  };

  static relaxProps = {
    cateId: 'cateId',
    expandedKeys: 'expandedKeys',
    cateIds: 'cateIds',
    imgCates: 'imgCates',
    imageName: 'imageName',
    visible: 'visible',
    imgs: 'imgs',
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    searchName: 'searchName',
    images: 'images',
    choosedImgCount: choosedImgCountQL,
    clickImgsCount: clickImgsCountQL,
    clickEnabled: clickEnabledQL,
    imgType: 'imgType',

    initImg: noop,
    editCateId: noop,
    editDefaultCateId: noop,
    modalVisible: noop,
    search: noop,
    saveSearchName: noop,
    editImages: noop,
    chooseImg: noop,
    beSureImages: noop,
    cleanChooseImgs: noop
  };

  constructor(props) {
    super(props);
  }

  state = {
    visible: true,
    successCount: 0, // 成功上传数量
    uploadCount: 0, // 总上传数量
    errorCount: 0, // 失败上传数量
    fileList: [] // 上传文件列表
  };

  handleCancel = () => {
    const { modalVisible, imgType } = this.props.relaxProps;
    modalVisible(0, imgType);
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };

  render() {
    const {
      expandedKeys,
      cateIds,
      imgCates,
      imageName,
      visible,
      imgs,
      currentPage,
      total,
      pageSize,
      clickImgsCount,
      choosedImgCount,
      cateId
    } = this.props.relaxProps;

    //分类列表生成树形结构
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <Modal  maskClosable={false}
        title={
          <div style={styles.title}>
            <h4>图片库</h4>
            <span style={styles.grey}>
              已选<strong style={styles.dark}>{clickImgsCount}</strong>张
              最多可选<strong style={styles.dark}>{choosedImgCount}</strong>张
            </span>
          </div>
        }
        visible={visible}
        width={880}
        onCancel={this.handleCancel}
        onOk={() => this._handleOk()}
      >
        <div>
          <Row style={styles.header}>
            <Col span={3}>
              <QMUpload
                name="uploadFile"
                onChange={this._editImages}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false
                }}
                action={
                  Const.HOST +
                  `/store/uploadStoreResource?cateId=${cateId}&resourceType=IMAGE`
                }
                multiple={true}
                disabled={cateId ? false : true}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile}
                fileList={this.state.fileList}
              >
                <Button size="large" onClick={() => this._handleUploadClick()}>
                  本地上传
                </Button>
              </QMUpload>
            </Col>
            <Col span={10}>
              <Form layout="inline">
                <FormItem>
                  <Input
                    placeholder="请输入内容"
                    value={imageName}
                    onChange={(e) => this._editSearchData(e)}
                  />
                </FormItem>
                <FormItem>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      this._search();
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    搜索
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <div style={{ height: 560, overflowY: 'scroll' }}>
                <Tree
                  className="draggable-tree"
                  defaultExpandedKeys={expandedKeys.toJS()}
                  defaultSelectedKeys={cateIds.toJS()}
                  selectedKeys={cateIds.toJS()}
                  onSelect={this._select}
                >
                  {loop(imgCates)}
                </Tree>
              </div>
            </Col>
            <Col span={1} />
            <Col span={19}>
              <div style={styles.box}>
                {(imgs || fromJS([])).map((v, k) => {
                  return (
                    <div style={styles.navItem} key={k}>
                      <div style={styles.boxItem}>
                        <Checkbox
                          className="big-check"
                          checked={v.get('checked')}
                          onChange={(e) => this._chooseImg(e, v)}
                        />
                        <img
                          src={v.get('artworkUrl')}
                          alt=""
                          width="100"
                          height="100"
                        />
                      </div>
                      <p style={styles.name}>{v.get('resourceName')}</p>
                    </div>
                  );
                })}
              </div>
            </Col>
            {(imgs || fromJS([])).size > 0 ? null : (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, 0.43)'
                }}
              >
                <span>
                  <i className="anticon anticon-frown-o" />暂无数据
                </span>
              </div>
            )}
          </Row>
          {(imgs || fromJS([])).size > 0 ? (
            <Pagination
              onChange={(pageNum) => this._toCurrentPage(pageNum)}
              current={currentPage}
              total={total}
              pageSize={pageSize}
            />
          ) : null}
        </div>
      </Modal>
    );
  }

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _select = (value) => {
    const {
      initImg,
      editCateId,
      editDefaultCateId,
      search,
      saveSearchName,
      cleanChooseImgs
    } = this.props.relaxProps;
    //记录选中的分类，以便后续的分页查询
    editCateId(value[0]);
    editDefaultCateId(value[0]);
    search('');
    saveSearchName('');
    initImg({ pageNum: 0, cateId: value[0], successCount: 0 });
    cleanChooseImgs();
  };

  /**
   * 修改搜索数据
   */
  _editSearchData = (e) => {
    const { search } = this.props.relaxProps;
    search(e.target.value);
  };

  /**
   * 查询
   */
  _search = () => {
    const {
      initImg,
      imageName,
      cateId,
      saveSearchName
    } = this.props.relaxProps;
    saveSearchName(imageName);
    initImg({ pageNum: 0, cateId: cateId, successCount: 0 });
  };

  /**
   * 分页
   * @param pageNum
   * @private
   */
  _toCurrentPage = (pageNum: number) => {
    const { initImg, cateId } = this.props.relaxProps;
    //如果选中分类，则分页要在该分类下进行
    initImg({ pageNum: pageNum - 1, cateId: cateId, successCount: 0 });
  };

  /**
   * 改变图片
   */
  _editImages = async (info) => {
    const { file } = info;
    const { initImg, cateId } = this.props.relaxProps;
    const status = file.status;
    let fileList = info.fileList;
    if (status === 'done') {
      if (
        file.response &&
        file.response.code &&
        file.response.code !== Const.SUCCESS_CODE
      ) {
        this.setState({
          errorCount: this.state.errorCount + 1
        });
      } else {
        this.setState({
          successCount: this.state.successCount + 1
        });
        message.success(`${file.name} 上传成功！`);
      }
    } else if (status === 'error') {
      this.setState({
        errorCount: this.state.errorCount + 1
      });
    }
    //仅展示上传中的文件列表
    fileList = fileList.filter((f) => f.status == 'uploading');
    this.setState({ fileList });
    if (
      this.state.successCount > 0 &&
      this.state.successCount + this.state.errorCount === this.state.uploadCount
    ) {
      await initImg({
        pageNum: 0,
        cateId,
        successCount: this.state.successCount
      });
    }
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file, fileList) => {
    const { choosedImgCount } = this.props.relaxProps;
    this.setState({
      uploadCount: fileList.length,
      errorCount: 0
    });
    if (fileList.length > choosedImgCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error(`最多一次性上传${choosedImgCount}张图片`);
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
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 点击图片
   * @param e
   * @param v
   * @private
   */
  _chooseImg = (e, v) => {
    const { chooseImg, clickEnabled, choosedImgCount } = this.props.relaxProps;
    const checked = (e.target as any).checked;
    if (clickEnabled || choosedImgCount == 1 || !checked) {
      chooseImg({ check: checked, img: v, chooseCount: choosedImgCount });
    }
  };

  /**
   * 确认选择的图片
   * @private
   */
  _handleOk = () => {
    const { beSureImages, modalVisible, imgType } = this.props.relaxProps;
    beSureImages();
    modalVisible(1, imgType);
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };

  /**
   * 清除选中的图片
   * @private
   */
  _handleUploadClick = () => {
    const { cateId, cleanChooseImgs } = this.props.relaxProps;
    if (cateId) {
      cleanChooseImgs();
    } else {
      message.error('请选择图片分类');
    }
  };
}

const styles = {
  header: {
    paddingBottom: 15,
    borderBottom: '1px solid #ddd'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '20px'
  } as any,
  navItem: {
    width: 120,
    marginBottom: 15,
    marginRight: 14
  },
  boxItem: {
    width: '120px',
    height: '120px',
    padding: '10px',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  detail: {
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  grey: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 10
  },
  dark: {
    color: '#333333'
  },
  name: {
    height: 20,
    overflow: 'hidden',
    width: '100%',
    marginTop: 5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
} as any;
