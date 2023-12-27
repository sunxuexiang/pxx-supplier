import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input } from 'antd';
import { noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      showCateModal: Function; //分类弹窗
      showUploadImageModal: Function; //上传图片弹窗
      showDownloadImageModal: Function; //下载图片弹窗
      queryImagePage: Function; //搜索图片分页信息
      search: Function; //模糊搜索
      currentPage: number; //分页
      imageName: string; //搜索的图片名
    };
  };

  static relaxProps = {
    showCateModal: noop,
    queryImagePage: noop,
    showUploadImageModal: noop,
    search: noop,
    imageName: 'imageName',
    showDownloadImageModal: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_picturePort_1">
          <Button type="primary" onClick={this._upload}>
            上传图片
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_resourceCate_2">
          <Button type="primary" onClick={this._showModal}>
            新增分类
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_picturePort_1">
          <Button type="primary" onClick={this._download}>
            下载图片
          </Button>
        </AuthWrapper>
        <div style={{ float: 'right' }}>
          <Form layout="inline">
            <FormItem>
              <Input
                placeholder="输入图片名称"
                value={this.props.relaxProps.imageName}
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
    const { queryImagePage } = this.props.relaxProps;
    queryImagePage();
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
   * 上传图片
   * @private
   */
  _upload = () => {
    const { showUploadImageModal } = this.props.relaxProps;
    showUploadImageModal(true);
  };

  /**
   * 下载图片
   * @private
   */
  _download = () => {
    const { showDownloadImageModal } = this.props.relaxProps;
    showDownloadImageModal(true);
  };
}
