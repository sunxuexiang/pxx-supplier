import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Tree, TreeSelect } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, Tips, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styled from 'styled-components';

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

const Errorbox = styled.div`
  .has-error.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children:after,
  .has-warning.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children-icon,
  .is-validating.has-feedback .ant-form-item-children:after {
    right: -30px;
  }
`;

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(CateModalForm);
  }

  props: {
    relaxProps?: {
      modalCateVisible: boolean;
      doCateAdd: Function;
      storeCateList: IList;
      closeCateModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalCateVisible: 'modalCateVisible',
    // 添加店铺分类
    doCateAdd: noop,
    // 店铺分类信息
    storeCateList: 'storeCateList',
    // 关闭弹窗
    closeCateModal: noop
  };

  render() {
    const { modalCateVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalCateVisible) {
      return null;
    }
    return (
      <Modal  maskClosable={false}
        title="新增"
         
        visible={modalCateVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doCateAdd } = this.props.relaxProps;
        if (form.getFieldValue('cateName')) {
          const cateName = form.getFieldValue('cateName');
          const cateParentId = form.getFieldValue('cateParentId') || 0;
          const sort = form.getFieldValue('sort') || 0;
          doCateAdd(cateName, cateParentId, sort);
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeCateModal } = this.props.relaxProps;
    closeCateModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      closeCateModal: Function;
      storeCateList: IList;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let cateList = this.props.relaxProps.storeCateList;

    // 返回一级分类列表
    const loop = (cateList) =>
      cateList.filter((item) => item.get('isDefault') != 1 && item.get('cateParentId') == 0 ).map((item) => {
        return (
          <TreeNode
            key={item.get('storeCateId')}
            value={item.get('storeCateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="分类名称" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上级分类">
          {getFieldDecorator('cateParentId', {
            rules: [
              {
                required: true,
                message: '请选择上级分类'
              }
            ]
          })(
            <TreeSelect
              getPopupContainer={() => document.getElementById('root')}
              placeholder="请选择上级分类"
              notFoundContent="暂无分类"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            >
              <TreeNode key="0" value="0" title="顶级分类">
                {loop(cateList)}
              </TreeNode>
            </TreeSelect>
          )}
        </FormItem>
        <Errorbox>
          <FormItem {...formItemLayout} label="排序" hasFeedback>
            {getFieldDecorator('sort', {
              rules: [
                { required: true, message: '请填写排序' },
                {
                  pattern: ValidConst.sortNum,
                  message: '请填写0-999之间的整数'
                }
              ],
              initialValue: 0
            })(<Input style={{ width: '30%' }} placeholder="请填写排序" />)}
            <Tips title="数值越小越靠前" />
          </FormItem>
        </Errorbox>
      </Form>
    );
  }
}
