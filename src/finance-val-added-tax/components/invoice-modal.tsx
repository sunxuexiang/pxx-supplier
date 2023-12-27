import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { List } from 'immutable';

import { noop } from 'qmkit';
import AddForm from './add-form';

const WrapperForm = Form.create({})(AddForm);

@Relax
export default class InvoiceModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
      onSave: Function;
      customers: List<any>;
    };
  };

  static relaxProps = {
    visible: 'visible',
    customerLevel: 'customerLevel',
    customers: 'customers',
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
        title="新增增值税开票资质"
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={form => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSave(values);
      }
    });
  };
}
