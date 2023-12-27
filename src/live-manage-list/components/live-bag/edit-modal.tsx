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
      liveBagVisible: boolean;
      liveBagFormData: IMap;
      editFormData: Function;
      onBagSave: Function;
      closeModal: Function;
    };
  };

  static relaxProps = {
    liveBagVisible: 'liveBagVisible',
    liveBagFormData: 'liveBagFormData',
    editFormData: noop,
    onBagSave: noop,
    closeModal: noop
  };

  render() {
    const { liveBagVisible, liveBagFormData } = this.props.relaxProps;
    if (!liveBagVisible) {
      return null;
    }
    return (
      <Modal
        title={liveBagFormData.get('liveBagId') ? '编辑福袋' : '新增福袋'}
        width={1200}
        maskClosable={false}
        visible={liveBagVisible}
        onCancel={this._onCancel}
        onOk={this._onOk}
      >
        <EditFormWrapper
          ref={(form) => (this._form = form)}
          // relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交表单
   */
  _onOk = () => {
    const form = this._form as WrappedFormUtils;
    form.resetFields();
    form.validateFields(null, (errs) => {
      if (!errs) {
        //无任何表单验证错误,则提交
        const { onBagSave } = this.props.relaxProps;
        onBagSave();
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
