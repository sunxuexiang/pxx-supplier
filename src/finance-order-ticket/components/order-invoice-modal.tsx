import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { List } from 'immutable';

import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import AddOrderInvoiceForm from './add-order-invoice-form';

const WrapperForm = Form.create({})(AddOrderInvoiceForm);

@Relax
export default class OrderInvoiceAddModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onHide: Function;
      uuid: '';
      enableSend: boolean;
      orderInvoiceDetail: any;
      orderInvoiceForm: any;
      invoiceProjects: List<any>;
      addressInfos: List<any>;
      onSaveOrderInvoice: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    onHide: noop,
    uuid: 'uuid',
    enableSend: 'enableSend',
    orderInvoiceDetail: 'orderInvoiceDetail',
    orderInvoiceForm: 'orderInvoiceForm',
    invoiceProjects: 'invoiceProjects',
    addressInfos: 'addressInfos',
    onSaveOrderInvoice: noop
  };

  render() {
    const { visible, onHide } = this.props.relaxProps;
    if (!visible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title="新增开票记录"
        visible={visible}
        onOk={() => this._handleOk()}
        onCancel={() => onHide()}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOk() {
    const { onHide, onSaveOrderInvoice } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, value) => {
      if (!errs) {
        onSaveOrderInvoice(value);
        onHide();
      }
    });
  }
}
