import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, message } from 'antd';
import { noop, AuthWrapper } from 'qmkit';
import { List } from 'immutable';
declare type IList = List<any>;

const FormItem = Form.Item;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      videoList: IList; //视频列表
      showCateModal: Function; //分类弹窗
      showUploadVideoModal: Function; //上传视频弹窗
      showMoveVideoModal: Function; //移动视频弹窗
      queryVideoPage: Function; //搜索视频分页信息
      search: Function; //模糊搜索
      currentPage: number; //分页
      videoName: string; //搜索的视频名
    };
  };

  static relaxProps = {
    videoList: 'videoList',
    showCateModal: noop,
    queryVideoPage: noop,
    showUploadVideoModal: noop,
    showMoveVideoModal: noop,
    search: noop,
    videoName: 'videoName'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_videoStore_1">
          <Button type="primary" onClick={this._upload}>
            上传视频
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_resourceCate_2">
          <Button type="primary" onClick={this._showModal}>
            新增分类
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_videoStore_1">
          <Button type="primary" onClick={this._showMoveModal}>
            移动
          </Button>
        </AuthWrapper>
        <div style={{ float: 'right' }}>
          <Form layout="inline">
            <FormItem>
              <Input
                placeholder="输入视频名称"
                value={this.props.relaxProps.videoName}
                onChange={this._editSearchData}
              />
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  this._search();
                }}
              >
                {' '}
                搜索{' '}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div style={{ clear: 'both' }} />
      </div>
    );
  }

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
    const { queryVideoPage } = this.props.relaxProps;
    queryVideoPage();
  };

  /**
   * 新增分类
   * @private
   */
  _showModal = () => {
    const { showCateModal } = this.props.relaxProps;
    showCateModal(true);
  };

  /**
   * 移动
   * @private
   */
  _showMoveModal = () => {
    const { videoList, showMoveVideoModal } = this.props.relaxProps;
    if (videoList.filter((item) => item.get('checked') == true).size < 1) {
      message.error('请先选择要移动的视频');
      return;
    }
    showMoveVideoModal(true);
  };

  /**
   * 上传视频
   * @private
   */
  _upload = () => {
    const { showUploadVideoModal } = this.props.relaxProps;
    showUploadVideoModal(true);
  };
}
