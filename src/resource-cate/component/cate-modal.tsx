import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';

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

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(CateModalForm);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean; // 弹框是否显示
      editFlag: boolean; //是否处于编辑状态
      doAdd: Function; // 添加类目
      editFormData: Function; // 修改类目
      formData: IMap; // 类目信息
      closeModal: Function; // 关闭弹窗
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    editFlag: 'editFlag',
    doAdd: noop,
    editFormData: noop,
    formData: 'formData',
    closeModal: noop
  };

  render() {
    const { editFlag, modalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal  maskClosable={false}
        title={editFlag ? '编辑' : '新增'}
         
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
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
        const { doAdd } = this.props.relaxProps;
        doAdd();
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const formData = this._store.state().get('formData');
    const cateName = formData.get('cateName');
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="分类名称" hasFeedback>
          {getFieldDecorator('cateName', {
            initialValue: cateName,
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '分类名称',
                    1,
                    10
                  );
                }
              }
            ]
          })(<Input onChange={this._changeCateName} value={cateName} />)}
        </FormItem>
        {formData.get('cateParentName') && (
          <FormItem {...formItemLayout} label="上级分类">
            {formData.get('cateParentName')}
          </FormItem>
        )}
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const store = this._store as any;
    store.editFormData(Map({ cateName: e.target.value }));
  };
}
