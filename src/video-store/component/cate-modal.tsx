import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Tree, TreeSelect } from 'antd';
import { Relax } from 'plume2';
import { noop, Tips } from 'qmkit';
import { List, Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';
import '../style.css';
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
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;
  props: {
    relaxProps?: {
      visible: boolean;
      doAdd: Function;
      cateList: IList;
      showCateModal: Function;
      editFormData: Function;
    };
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(PicCateForm);
  }

  static relaxProps = {
    // 弹框是否显示
    visible: 'visible',
    // 添加类目
    doAdd: noop,
    // 关闭弹窗
    showCateModal: noop,
    //分类结构列表
    cateList: 'cateList',
    //填写的表单
    editFormData: noop
  };

  render() {
    const { visible } = this.props.relaxProps;
    if (!visible) {
      return null;
    }
    const WrapperForm = this.WrapperForm;
    return (
      <Modal  maskClosable={false}
        title="新增分类"
         
        visible={visible}
        onCancel={this._handleCancel}
        onOk={this._handleOk}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  /**
   * 关闭弹窗
   * @private
   */
  _handleCancel = () => {
    const { showCateModal } = this.props.relaxProps;
    showCateModal(false);
  };

  /**
   * 提交
   * @param e
   * @private
   */
  _handleOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doAdd } = this.props.relaxProps;
        doAdd();
      }
    });
  };
}

class PicCateForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  props: {
    relaxProps?: {
      cateList: IList;
      editFormData: Function;
    };
    form;
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const cateList = this._store.state().get('cateList');

    //处理分类的树形图结构数据，由于默认分类和第三级分类下不能新增分类，故不展示
    const loop = (cateList) =>
      cateList.filter((item) => item.get('isDefault') == 0).map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId').toString()}
              title={item.get('cateName')}
            >
              {item.get('children').map((item) => {
                return (
                  <TreeNode
                    key={item.get('cateId')}
                    value={item.get('cateId').toString()}
                    title={item.get('cateName')}
                  />
                );
              })}
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
      <Form>
        <FormItem className={'c-tree-select'} {...formItemLayout} label="选择上级分类" hasFeedback>
          {getFieldDecorator('cateParentId', {
            rules: [{ required: true, message: '请选择上级分类' }]
          })(
            <TreeSelect
              showSearch
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              treeDefaultExpandAll
              onChange={this._onChange}
            >
              {loop(cateList)}
            </TreeSelect>
          )}
          <Tips
            style={{ position: 'absolute' }}
            title="新增分类请先选择上级分类"
          />
        </FormItem>
        <FormItem {...formItemLayout} label="新分类名称" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, message: '请填写分类名称' },
              { max: 10, message: '最多10字符' }
            ]
          })(<Input onChange={this._changeCateName} />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _onChange = (cateId: string) => {
    const store = this._store as any;
    store.editFormData(Map({ cateParentId: cateId }));
  };

  /**
   * 填写分类名称
   */
  _changeCateName = (e) => {
    const store = this._store as any;
    store.editFormData(Map({ cateName: e.target.value }));
  };
}
