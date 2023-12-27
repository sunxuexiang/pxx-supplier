import React from 'react';
import { Modal, Form, TreeSelect, Tree } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { List } from 'immutable';
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
@Relax
export default class DownloadModal extends React.Component {
  state = {
    cateId: ''
  };

  props: {
    relaxProps?: {
      downloadVisible: boolean; // 弹框是否显示
      cateList: IList; //分类列表
      showDownloadImageModal: Function; //下载图片弹窗
    };
  };

  static relaxProps = {
    downloadVisible: 'downloadVisible',
    cateList: 'cateList',
    showDownloadImageModal: noop
  };

  _handleCancel = () => {
    const { showDownloadImageModal } = this.props.relaxProps;
    this.setState({ cateId: '' }, () => {
      showDownloadImageModal(false);
    });
  };

  _handleOk = () => {
    const { cateId } = this.state;
    const exportHref = Const.HOST + `/system/resourceReport/${cateId}`;
    // 新窗口下载
    window.open(exportHref);
  };

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _onChange = (value) => {
    this.setState({ cateId: value });
  };
  render() {
    const { cateId } = this.state;
    const { downloadVisible, cateList } = this.props.relaxProps;
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
    return (
      <Modal
        maskClosable={false}
        title="下载图片"
        visible={downloadVisible}
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
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 300 }}
              value={cateId}
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
        </Form>
      </Modal>
    );
  }
}
