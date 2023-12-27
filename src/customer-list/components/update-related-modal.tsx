import React from 'react';
import PropTypes from 'prop-types';
import { Relax, Store, IMap } from 'plume2';

import { Form, Modal, Select } from 'antd';
import { noop } from 'qmkit';

const FormItem = Form.Item;

const SelectOption = Select.Option;

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

class UpdateRelaterForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const customerLevels = this._store.state().get('customerLevels');
    const employee = this._store.state().get('employee');
    const customerInfo = this._store.state().get('updateCustomerInfo')
      ? this._store.state().get('updateCustomerInfo')
      : new Map();

    return (
      <Form>
        <FormItem {...formItemLayout} label="客户名称">
          <span>{customerInfo.get('customerName')}</span>
        </FormItem>

        <FormItem {...formItemLayout} label="客户账号">
          <span>{customerInfo.get('customerAccount')}</span>
        </FormItem>

        <FormItem {...formItemLayout} label="客户级别">
          {getFieldDecorator('customerLevelId', {
            initialValue: customerInfo.get('customerLevelId')
              ? customerInfo.get('customerLevelId').toString()
              : null,
            rules: [{ required: true, message: '请选择客户等级' }]
          })(
            <Select>
              <SelectOption value={null}>请选择</SelectOption>
              {customerLevels &&
                customerLevels.map(v => (
                  <SelectOption
                    key={v.get('storeLevelId').toString()}
                    value={v.get('storeLevelId').toString()}
                  >
                    {v.get('levelName')}
                  </SelectOption>
                ))}
            </Select>
          )}
        </FormItem>

        {customerInfo.get('myCustomer') && (
          <FormItem {...formItemLayout} label="业务员">
            {getFieldDecorator('employeeId', {
              initialValue: customerInfo.get('employeeId')
                ? customerInfo.get('employeeId').toString()
                : null,
              rules: [{ required: true, message: '请选择业务员' }]
            })(
              <Select>
                <SelectOption value={null}>请选择</SelectOption>
                {employee &&
                  employee.map(v => (
                    <SelectOption
                      key={v.get('employeeId')}
                      value={v.get('employeeId')}
                    >
                      {v.get('employeeName')}
                    </SelectOption>
                  ))}
              </Select>
            )}
          </FormItem>
        )}
      </Form>
    );
  }
}

const WrappedForm = Form.create()(UpdateRelaterForm);

@Relax
export default class UpdateRelatedModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      updatePlatformRelated: Function;
      updateRelatedModalShow: boolean;
      onShowUpdateRelatedModal: Function;
      updateCustomerInfo: IMap;
    };
  };

  static relaxProps = {
    updatePlatformRelated: noop,
    updateRelatedModalShow: 'updateRelatedModalShow',
    onShowUpdateRelatedModal: noop,
    updateCustomerInfo: 'updateCustomerInfo'
  };

  render() {
    const {
      updateRelatedModalShow,
      updateCustomerInfo
    } = this.props.relaxProps;
    return (
      <Modal  maskClosable={false}
        title="编辑客户"
        onOk={() => this._handleOK(updateCustomerInfo.get('customerId'))}
        visible={updateRelatedModalShow}
        onCancel={() => this._modalClose()}
      >
        <WrappedForm ref={form => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = updateCustomerId => {
    this._form.validateFields((err, values) => {
      if (!err) {
        const { updatePlatformRelated } = this.props.relaxProps;
        updatePlatformRelated(
          updateCustomerId,
          values['customerLevelId'],
          values['employeeId']
        );
        this._modalClose();
      }
    });
  };

  _modalClose = () => {
    const { onShowUpdateRelatedModal } = this.props.relaxProps;
    onShowUpdateRelatedModal(false, null);
    this._form.resetFields();
  };
}
