import React from 'react';
import { Form, Input, Select, Modal, message } from 'antd';

import { AreaSelect, ValidConst, QMMethod, Const } from 'qmkit';
import { employeeList, customerLevelList } from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;

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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

export default class CustomerInfo extends React.Component<any, any> {
  CustomerForm: any;
  _form: any;

  constructor(props) {
    super(props);
    this.CustomerForm = Form.create({})(CustomerInfoForm);
    this.state = {
      btnLoading: false
    };
  }

  render() {
    const { customerFormVisible } = this.props;

    const CustomerForm = this.CustomerForm;

    return (
      <Modal  maskClosable={false}
        title="新增会员"
        visible={customerFormVisible}
        onOk={() => this._addCustomer()}
        confirmLoading={this.state.btnLoading}
        onCancel={() => this._close()}
        okText="确认"
        cancelText="取消"
        afterClose={() => this.setState({ btnLoading: false })}
      >
        <CustomerForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  data = () => {
    const fieldsValue = this._form.getFieldsValue();

    let result = {
      customerName: fieldsValue.customerName.trim(),
      provinceId: fieldsValue.area ? fieldsValue.area[0] : null,
      cityId: fieldsValue.area ? fieldsValue.area[1] : null,
      areaId: fieldsValue.area ? fieldsValue.area[2] : null,
      customerAddress: fieldsValue.customerAddress,
      contactName: fieldsValue.contactName,
      contactPhone: fieldsValue.contactPhone,
      customerAccount: fieldsValue.customerAccount,
      employeeId: fieldsValue.employeeId,
      customerLevelId: fieldsValue.customerLevelId
    };
    return result;
  };

  _addCustomer = async () => {
    this.setState({
      btnLoading: true
    });
    this._form.validateFields(async (err) => {
      if (!err) {
        let paramData = this.data();

        // 所在地区和详细地址要么都为空，要么都不为空
        if (!paramData.provinceId && paramData.customerAddress) {
          message.error('请选择所在地区');
          this.setState({
            btnLoading: false
          });
        } else if (paramData.provinceId && !paramData.customerAddress) {
          message.error('请填写详细地址');
          this.setState({
            btnLoading: false
          });
        } else {
          const code = await this.props.addCustomer(paramData);
          if (code == Const.SUCCESS_CODE) {
            this.setState({
              btnLoading: false
            });
            this._form.resetFields();
          } else {
            this.setState({
              btnLoading: false
            });
          }
        }
      } else {
        this.setState({
          btnLoading: false
        });
      }
    });
  };

  _close = () => {
    this._form.resetFields();
    this.props.switchCustomerFormVisible(false);
  };
}

class CustomerInfoForm extends React.Component<any, any> {
  state = {
    employees: [],
    levels: [],
    confirmDirty: false
  };

  async componentDidMount() {
    const employeeListResult = await employeeList();
    const customerLevelListResult = await customerLevelList();
    this.setState({
      employees: employeeListResult.res,
      levels: customerLevelListResult.res
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div id="modalCustom">
        <Form>
          <FormItem
            {...formItemLayout}
            label="客户名称"
            required={true}
            hasFeedback={true}
          >
            {getFieldDecorator('customerName', {
              rules: [
                { required: true, message: '客户名称不能为空' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '客户名称',
                      2,
                      15
                    );
                  }
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所在地区" hasFeedback={true}>
            {getFieldDecorator('area')(
              <AreaSelect
                getPopupContainer={() => document.getElementById('modalCustom')}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="详细地址" hasFeedback={true}>
            {getFieldDecorator('customerAddress', {
              rules: [
                { min: 5, message: '详细地址长度必须为5-60个字符之间' },
                { max: 60, message: '详细地址长度必须为5-60个字符之间' }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={'联系人'} hasFeedback={true}>
            {getFieldDecorator('contactName', {
              rules: [
                { required: true, message: '请填写联系人名称' },
                { min: 2, message: '联系人名称长度必须为2-15个字符之间' },
                { max: 15, message: '联系人名称长度必须为2-15个字符之间' }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={'联系方式'}
            required={true}
            hasFeedback={true}
          >
            {getFieldDecorator('contactPhone', {
              rules: [
                { required: true, message: '请填写联系方式' },
                { pattern: ValidConst.phone, message: '请填写正确的手机号码' }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="客户级别">
            {getFieldDecorator('customerLevelId')(
              <Select
                getPopupContainer={() => document.getElementById('modalCustom')}
              >
                {this.state.levels.map((v, i) => {
                  return (
                    <Option value={`${v.customerLevelId}`} key={i}>
                      {v.customerLevelName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="业务员">
            {getFieldDecorator('employeeId', {
              rules: [{ required: true, message: '请选择业务员' }]
            })(
              <Select
                getPopupContainer={() => document.getElementById('modalCustom')}
              >
                {this.state.employees.map((v, i) => {
                  return (
                    <Option value={v.employeeId} key={i}>
                      {v.employeeName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            请以有效的客户手机号开通账号
          </FormItem>
          <FormItem {...formItemLayout} label={'账号'} hasFeedback>
            {getFieldDecorator('customerAccount', {
              rules: [
                { required: true, message: '请填写客户手机号码' },
                { pattern: ValidConst.phone, message: '请填写正确的手机号码' }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={'密码'} hasFeedback>
            {getFieldDecorator('customerPassword', {
              initialValue: '********'
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            点击确认后将会发送账号密码至客户注册账号的手机
          </FormItem>
        </Form>
      </div>
    );
  }
}
