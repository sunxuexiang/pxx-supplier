import React from 'react';
import { Relax } from 'plume2';
import { Form, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import { IMap } from 'typings/globalType';
import EditForm from './edit-Form';

const EditFormWrapper = Form.create()(EditForm) as any;

@Relax
export default class EditModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      visible: boolean;
      formData: IMap;
      // editFormData: Function;
      onSave: Function;
      closeModal: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    formData: 'formData',
    // editFormData: noop,
    onSave: noop,
    closeModal: noop
  };

  render() {
    const { visible, formData } = this.props.relaxProps;
    if (!visible) {
      return null;
    }
    return (
      <Modal
        title={formData.get('liveRoomId') ? '编辑直播间' : '新增直播间'}
        width={600}
        maskClosable={false}
        visible={visible}
        onCancel={this._onCancel}
        onOk={this._onOk}
      >
        <EditFormWrapper
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交表单
   */
  _onOk = () => {
    const form = this._form as WrappedFormUtils;
    // form.resetFields();
    form.validateFields(null, (errs) => {
      if (!errs) {
        //无任何表单验证错误,则提交
        const { onSave } = this.props.relaxProps;
        onSave();
      }
    });
  };

  /**
   * 关闭弹框
   */
  _onCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}
