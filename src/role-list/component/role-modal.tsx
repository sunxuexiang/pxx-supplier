import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { Relax, Store } from 'plume2';
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
export default class RoleModal extends React.Component<any, any> {
  _store: Store;
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }
  props: {
    relaxProps?: {
      modalVisible: boolean;
      isAdd: boolean;
      modal: Function;
      formData: IMap;
      editFormData: Function;
      images: any;
      // 修改图片
      _editImages: Function;

      // 富文本
      context: string;
      imgType: number;
      setVisible: Function;
      refEditor: Function;
      regEditor: any;
      doAdd: Function;

      // 优惠券
      activity: any;
      onChosenCoupons: Function;
      onDelCoupon: Function;
      changeCouponTotalCount: Function;
      changeFormField: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    formData: 'formData',
    modal: noop, // 关闭弹窗
    editFormData: noop, //修改from表单数据
    images: 'images', // 附件信息
    _editImages: noop,
    // 富文本
    context: 'context',
    imgType: 'imgType',
    setVisible: noop,
    refEditor: noop,
    // regEditor:"regEditor",
    activity: 'activity',
    onChosenCoupons: noop,
    onDelCoupon: noop,
    changeCouponTotalCount: noop,
    changeFormField: noop,
    doAdd: noop
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
        title={isAdd ? '新增' : '编辑'}
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
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.examine();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验一下
   */
  examine = () => {
    const { doAdd } = this.props.relaxProps;
    doAdd();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      formData: IMap;

      editFormData: Function;
    };

    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData, editFormData } = this.props.relaxProps;

    const roleName = formData.get('roleName');

    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="角色名称" hasFeedback>
          {getFieldDecorator('roleName', {
            rules: [
              { required: true, whitespace: true, message: '请输入角色名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '角色名称');
                }
              }
            ],
            initialValue: roleName,
            onChange: (e) => editFormData(Map({ roleName: e.target.value }))
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
      </Form>
    );
  }
}
