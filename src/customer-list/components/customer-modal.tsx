import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, message } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create({})(EditForm);

@Relax
export default class CustomerModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      onCancel: Function;
      onSave: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
    onCancel: noop,
    onSave: noop
  };

  render() {
    const { onCancel, visible } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title="新增客户信息"
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={form => (this._form = form)} />
      </Modal>
    );
  }

  data = () => {
    const fieldsValue = this._form.getFieldsValue();
    let result = {
      customerName: fieldsValue.customerName && fieldsValue.customerName.trim(),
      provinceId: fieldsValue.area ? fieldsValue.area[0] : null,
      cityId: fieldsValue.area ? fieldsValue.area[1] : null,
      areaId: fieldsValue.area ? fieldsValue.area[2] : null,
      customerAddress:
        fieldsValue.customerAddress && fieldsValue.customerAddress.trim(),
      contactName: fieldsValue.contactName && fieldsValue.contactName.trim(),
      contactPhone: fieldsValue.contactPhone,
      customerAccount: fieldsValue.customerAccount,
      employeeId: fieldsValue.employeeId,
      customerLevelId: fieldsValue.customerLevelId
    };
    return result;
  };

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, errs => {
      //如果校验通过
      if (!errs) {
        if (!this.data().customerAddress && this.data().provinceId) {
          message.error('请填写详细地址');
          return;
        } else if (this.data().customerAddress && !this.data().provinceId) {
          message.error('请先选择所在地区');
          return;
        }
        this.props.relaxProps.onSave(this.data());
      }
    });
  };
}
