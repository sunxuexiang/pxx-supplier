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
export default class TabModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(TabModalForm);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      doAdd: Function;
      editFormData: Function;
      formData: IMap;
      closeModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 添加模板
    doAdd: noop,
    // 修改模板
    editFormData: noop,
    // 模板信息
    formData: 'formData',
    // 关闭弹窗
    closeModal: noop
  };

  render() {
    const { modalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal  maskClosable={false}
        title="新增/编辑"
         
        visible={modalVisible}
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
        const { doAdd, formData } = this.props.relaxProps;
        if (formData.get('tabName')) {
          doAdd();
        }
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

class TabModalForm extends React.Component<any, any> {
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
    const tabName = formData.get('tabName');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="模板名称" hasFeedback>
          {getFieldDecorator('tabName', {
            rules: [
              { required: true, whitespace: true, message: '请输入模板名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '模板名称');
                }
              }
            ],
            initialValue: tabName,
            onChange: this._changeTabName
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改模板名称
   */
  _changeTabName = (e) => {
    const store = this._store as any;
    store.editFormData(Map({ tabName: e.target.value }));
  };
}
