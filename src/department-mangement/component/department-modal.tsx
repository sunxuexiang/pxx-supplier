import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
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
export default class DepartmentModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      formData: IMap;
      isAdd: boolean;
      doAdd: Function;
      editFormData: Function;
      modal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 类目信息
    formData: 'formData',
    //是否是新增分类操作
    isAdd: 'isAdd',
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 关闭弹窗
    modal: noop
  };

  render() {
    const { modalVisible, isAdd } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增部门' : '编辑部门'}
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
        const { doAdd, formData } = this.props.relaxProps;

        //提交
        if (formData.get('departmentName')) {
          doAdd();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;

      closeModal: Function;
      editFormData: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData } = this.props.relaxProps;
    const departmentName = formData.get('departmentName');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        {formData && formData.get('departmentParentName') ? (
          <FormItem {...formItemLayout} label="上级部门">
            {formData.get('departmentParentName')}
          </FormItem>
        ) : null}

        <FormItem {...formItemLayout} label="部门名称" hasFeedback>
          {getFieldDecorator('departmentName', {
            rules: [
              { required: true, whitespace: true, message: '请输入部门名称' },
              { max: 20, message: '最多20字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '部门名称');
                }
              }
            ],
            initialValue: departmentName,
            onChange: this._changeDepartmentName
          })(<Input placeholder="请输入部门名称" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改部门名称
   */
  _changeDepartmentName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ departmentName: e.target.value }));
  };
}
