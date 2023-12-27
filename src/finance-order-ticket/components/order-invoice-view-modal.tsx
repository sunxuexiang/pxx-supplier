import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import OrderInvoiceViewForm from './order-invoice-view-form';

@Relax
export default class OrderInvoiceViewModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      viewVisible: boolean;
      onViewShow: Function;
      onViewHide: Function;
      invoiceView: any;
    };
  };

  static relaxProps = {
    viewVisible: 'viewVisible',
    onViewShow: noop,
    onViewHide: noop,
    invoiceView: 'invoiceView'
  };

  render() {
    const WrapperForm = Form.create({})(OrderInvoiceViewForm);
    const { viewVisible, onViewHide } = this.props.relaxProps;
    if (!viewVisible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title={`订单开票详情`}
        visible={viewVisible}
        onOk={() => onViewHide()}
        onCancel={() => onViewHide()}
      >
        <WrapperForm />
      </Modal>
    );
  }
}
