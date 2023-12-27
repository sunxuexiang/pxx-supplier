import React from 'react';
import PropTypes from 'prop-types';
import {Store} from 'plume2';
import {Form, Input, InputNumber} from 'antd';
import {ValidConst} from 'qmkit';

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

export default class EditForm extends React.Component<any, any> {
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
    /**
     * 获取getFieldDecorator
     */
    const { getFieldDecorator } = this.props.form;

    let levelName = {};
    let discountRate = {};
    let amountConditions ={};
    let orderConditions = {};
    const _state = this._store.state();

    //如果是编辑状态
    if (_state.get('edit')) {
      levelName = {
        initialValue: _state.getIn(['customerLevel', 'levelName'])
      };
      amountConditions = {
        initialValue: _state.getIn(['customerLevel', 'amountConditions'])
      };
      discountRate = {
        initialValue: _state.getIn(['customerLevel', 'discountRate'])
      };
      orderConditions = {
        initialValue: _state.getIn(['customerLevel', 'orderConditions'])
      };
    }

    return (
      <Form>

        <FormItem {...formItemLayout} label="等级名称" >
          {getFieldDecorator('levelName', {
            ...levelName,
            rules: [
              { required: true, message: '请输入等级名称' },
              { max: 10, message: '最多10字符' },
            ]
          })(<Input {...levelName} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="折扣率">
          {getFieldDecorator('discountRate', {
            ...discountRate,
            rules: [
              { required: true, message: '请输入折扣率' },
              {
                pattern: ValidConst.zeroOne,
                message: '请输入0-1（不包含0）之间的数字，精确到小数点后两位'
              }
            ]
          })(<Input {...discountRate} />)}
        </FormItem>


        <FormItem {...formItemLayout} label="升级条件">
          <span>累计支付订单</span>
          {getFieldDecorator('orderConditions', {
            ...orderConditions,
            rules: [
              {
                pattern: ValidConst.numbezz,
                message: '请输入1-999999999的整数'
              }
            ]
          })(<InputNumber  {...orderConditions}      max={99999999}  min={1}/>)} <span>笔或累计消费金额</span>

          {getFieldDecorator('amountConditions', {
            ...amountConditions,
            rules: [
              {
                pattern: ValidConst.number,
                message: '请输入1-999999999的数值'
              }
            ]
          })(<InputNumber   {...amountConditions} max={99999999}  min={1} />)}元
        </FormItem>
      </Form>
    );
  }
}
