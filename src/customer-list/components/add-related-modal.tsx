import React from 'react';
import PropTypes from 'prop-types';
import { Relax, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Form, AutoComplete, Modal, Select, Input } from 'antd';
import { noop, ValidConst, Fetch } from 'qmkit';

const FormItem = Form.Item;

const Option = AutoComplete.Option;
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

class AddRelaterForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  componentWillMount() {
    this.setState({
      customers: fromJS([])
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { customers } = this.state;
    const customerLevels = this._store.state().get('customerLevels');

    const customerAccountList = customers
      .map(this._renderOption)
      .filter(f => f)
      .toJS();

    return (
      <Form>
        <FormItem {...formItemLayout} label="客户账号">
          {getFieldDecorator('customerId', {
            rules: [
              { required: true, message: '请完整输入客户账号搜索并点击选中' }
            ]
          })(
            <AutoComplete
              size="large"
              style={{ width: '100%' }}
              dataSource={customerAccountList}
              onSelect={() => this._handleOnSelect()}
              onChange={value => this._handleSearch(value)}
              allowClear={true}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="客户级别">
          {getFieldDecorator('customerLevelId', {
            initialValue: null,
            rules: [{ required: true, message: '请选择客户级别' }]
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

        <FormItem {...formItemLayout}>
          {getFieldDecorator('customerFlag', {
            rules: [{ required: false }]
          })(<Input type="hidden" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 点击事件
   * @param value
   */
  _handleSearch = value => {
    if (ValidConst.number.test(value) && value.length == 11) {
      Fetch<TResult>(`/customer/platform/related/list/${value}`).then(
        ({ res }) => {
          if (fromJS(res).size == 0) {
            this.props.form.setFields({
              customerId: {
                value: value,
                errors: [new Error('未搜索到对应的平台客户')]
              }
            });
          }
          this.setState({ customers: fromJS(res) });
        }
      );
    }
  };

  _handleOnSelect = () => {
    this.props.form.setFieldsValue({
      customerFlag: true
    });
  };

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = item => {
    return (
      <Option key={item.get('customerId')}>
        {`${item.get('customerAccount')} ${item.get('customerName')}`}
      </Option>
    );
  };
}

const WrappedRejectForm = Form.create()(AddRelaterForm);

@Relax
export default class AddRelatedModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      addPlatformRelated: Function;
      addRelatedModalShow: boolean;
      onShowAddRelatedModal: Function;
    };
  };

  static relaxProps = {
    addPlatformRelated: noop,
    addRelatedModalShow: 'addRelatedModalShow',
    onShowAddRelatedModal: noop
  };

  render() {
    const { addRelatedModalShow } = this.props.relaxProps;
    return (
      <Modal  maskClosable={false}
        title="关联平台客户"
        onOk={() => this._handleOK()}
        visible={addRelatedModalShow}
        okText="确定"
        cancelText="取消"
        onCancel={() => this._modalClose()}
      >
        <WrappedRejectForm ref={form => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    this._form.validateFields((err, values) => {
      if (!err) {
        const { addPlatformRelated } = this.props.relaxProps;
        if (values['customerFlag']) {
          addPlatformRelated(
            values['customerId'],
            values['customerLevelId'] && +values['customerLevelId'],
            this._modalClose
          );
        } else {
          this._form.setFields({
            customerId: {
              value: values.customerId,
              errors: [new Error('请点击选中需要添加的平台客户')]
            }
          });
        }
      }
    });
  };

  _modalClose = () => {
    const { onShowAddRelatedModal } = this.props.relaxProps;
    onShowAddRelatedModal(false);
    this._form.resetFields();
    this.setState({ customers: fromJS([]) });
  };
}
