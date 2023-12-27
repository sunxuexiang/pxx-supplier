import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import { Row, Col, Radio, AutoComplete, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, FindArea, Fetch, ValidConst, AreaSelect, QMMethod } from 'qmkit';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
const AreaSelectBox = styled.div`
  .ant-form-item-children {
    display: inline-block;
    width: 100%;
  }
`;
const Option = AutoComplete.Option;

type TResult = {
  code: string;
  message: string;
  context: any;
};

type TList = List<any>;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const formItemLayoutOne = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const formItemLayoutTwo = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

/**
 * autoComplete中选项
 * @param item
 * @returns {any}
 */
function renderOption(item) {
  return (
    <Option key={item.get('customerAccount')}>
      {item.get('customerAccount')}
    </Option>
  );
}

@Relax
class CustomerInfo extends Component<any, any> {
  props: {
    form?: any;
    // 选中的会员信息--->  客户名称 客户账号 客户等级
    selectedCustomerInfo: string;
    // 选中的收货地址
    selectedAddrId: string;
    //是否是编辑状态
    edit: boolean;
    relaxProps?: {
      customers: TList;
      addrs: TList;
      selected: string;
      consignee: any;
      // 收货地址展示方式  0：地址量小于10   1：地址量超过10条，未点击"更多"  2：地址量超过10条，已点击"更多"
      showType: number;
      //用户临时地址是否可见
      customerTempAddressVisiable: boolean;

      onEditAddress: Function;
      onSelectAddress: Function;
      onDeleteAddress: Function;
      onSelectCustomerName: Function;
      switchAddressFormVisible: Function;

      // 清除订单信息
      clearOrder: Function;
      // 收货地址超过10条，点击展示更多
      showMore: Function;
      init: Function;
      //设置临时地址
      settingTempAddress: Function;
    };
  };

  static relaxProps = {
    customers: 'customers',
    addrs: 'addrs',
    selected: 'selectedCustomerId',
    showType: 'showType',
    customerTempAddressVisiable: 'customerTempAddressVisiable',
    consignee: 'consignee',
    onEditAddress: noop,
    onSelectAddress: noop,
    onDeleteAddress: noop,
    onSelectCustomerName: noop,
    switchAddressFormVisible: noop,
    clearOrder: noop,
    showMore: noop,
    init: noop,
    //设置临时地址
    settingTempAddress: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedAddrId: '',
      //标识选中地址之后可以给验证框架赋值
      addressChoose: false,
      dataSource: []
    };
  }

  static defaultProps = {
    selectedCustomerInfo: '',
    selectedAddrId: '',
    edit: false
  };

  componentDidUpdate() {
    if (this.props.selectedCustomerInfo) {
      if (this.props.selectedAddrId != this.state.selectedAddrId) {
        this.props.form.setFieldsValue({
          chooseAddress: this.props.selectedAddrId
        });
        this.setState({
          selectedAddrId: this.props.selectedAddrId
        });
      }
    }
  }

  render() {
    const {
      customers,
      addrs,
      selected,
      showType,
      onSelectAddress,
      customerTempAddressVisiable,
      showMore,
      settingTempAddress,
      consignee
    } = this.props.relaxProps;

    const { getFieldDecorator } = this.props.form;
    const customerAccountList = (customers || fromJS([]))
      .map(renderOption)
      .filter((f) => f)
      .toJS();

    //地址数组
    let addsArray = [];
    //根据地质id是否存在来判断是否是临时地址
    if (
      consignee.get('provinceId') != null &&
      consignee.get('id') == 'tempId'
    ) {
      addsArray.push(
        consignee.get('provinceId') && consignee.get('provinceId').toString()
      );
      addsArray.push(
        consignee.get('cityId') && consignee.get('cityId').toString()
      );
      addsArray.push(
        consignee.get('areaId') && consignee.get('areaId').toString()
      );
    }

    const addressInit = {
      initialValue: addsArray.length === 0 ? null : addsArray
    };

    const phone = {
      initialValue:
        consignee.get('id') == 'tempId' ? consignee.get('phone') : null
    };

    const name = {
      initialValue:
        consignee.get('id') == 'tempId' ? consignee.get('name') : null
    };

    const detailAddress = {
      initialValue:
        consignee.get('id') == 'tempId' ? consignee.get('address') : null
    };

    return (
      <div>
        <strong style={styles.title}>客户信息: </strong>
        <Row type="flex" align="top">
          <Col span={10}>
            <FormItem {...formItemLayoutOne} label="客户账号" hasFeedback>
              {this.props.edit ? (
                <label>{this.props.selectedCustomerInfo}</label>
              ) : (
                getFieldDecorator('customerInfo', {
                  initialValue: this.props.selectedCustomerInfo,
                  rules: [{ required: true, message: '必须选择一个会员' }]
                })(
                  <AutoComplete
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={customerAccountList}
                    onSelect={(value) => this._selectCustomerName(value)}
                    onChange={(value) => this.handleSearch(value)}
                    allowClear={true}
                  />
                )
              )}
            </FormItem>
          </Col>
        </Row>

        {!selected ? null : (
          <div>
            <FormItem label="收货信息" hasFeedback {...formItemLayout}>
              {
                <Radio.Group
                  value={this.props.selectedAddrId}
                  onChange={(e: any) => {
                    const addrId = e.target.value;
                    this.props.form.setFieldsValue({
                      chooseAddress: addrId
                    });
                    onSelectAddress(addrId);
                    this.setState({
                      selectedAddrId: addrId
                    });
                  }}
                >
                  {addrs.toSeq().map(
                    (v, k) =>
                      showType === 2 || k < 10 ? (
                        <div key={k} className="addressDisplay">
                          <Radio value={v.get('deliveryAddressId')}>
                            收货人：{v.get('consigneeName')}&nbsp; 联系电话：{v.get(
                              'consigneeNumber'
                            )}&nbsp; 收货信息：{FindArea.addressInfo(
                              v.get('provinceId')
                                ? v.get('provinceId').toString()
                                : '',
                              v.get('cityId') ? v.get('cityId').toString() : '',
                              v.get('areaId') ? v.get('areaId').toString() : ''
                            )}
                            {v.get('deliveryAddress')}&nbsp;
                            {v.get('isDefaltAddress') === 1 ? '默认地址' : ''}
                          </Radio>
                        </div>
                      ) : null
                  )}
                  {showType === 1 ? (
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        showMore(2);
                      }}
                    >
                      更多
                    </a>
                  ) : (
                    ''
                  )}
                  <div className="addressDisplay">
                    <Radio value="tempId">
                      <span style={{ color: '#F56C1D' }}>
                        没有可用地址，请填写临时地址
                      </span>
                    </Radio>
                  </div>
                </Radio.Group>
              }
              <br />
            </FormItem>
            <Row>
              <Col offset={2}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('chooseAddress', {
                    initialValue: this.props.selectedAddrId,
                    rules: [
                      {
                        required: selected ? true : false,
                        message: '必须选择一个收货地址'
                      }
                    ]
                  })(<input type="hidden" />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        )}
        {customerTempAddressVisiable && (
          <Row>
            <Col span={10}>
              <Col offset={5}>
                <AreaSelectBox>
                  <FormItem label="所在地区" {...formItemLayoutTwo} hasFeedback>
                    {getFieldDecorator('consigneeAddressIds', {
                      ...addressInit,
                      rules: [{ required: true, message: '请选择省市区' }]
                    })(
                      <AreaSelect
                        onChange={(val) => {
                          this.forceUpdate();
                          settingTempAddress('tempAddress', val);
                        }}
                      />
                    )}
                  </FormItem>
                </AreaSelectBox>
                <FormItem label="详细地址" hasFeedback {...formItemLayoutTwo}>
                  {getFieldDecorator('consigneeAddress', {
                    ...detailAddress,
                    rules: [
                      { required: true, message: '请填写详细地址' },
                      { min: 5, message: '详细地址长度必须为5-60个字符之间' },
                      { max: 60, message: '详细地址长度必须为5-60个字符之间' }
                    ]
                  })(
                    <Input
                      onChange={(val) => {
                        this.forceUpdate();
                        settingTempAddress(
                          'address',
                          (val.target as any).value
                        );
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label=" 收货人" hasFeedback {...formItemLayoutTwo}>
                  {getFieldDecorator('consigneeName', {
                    ...name,
                    rules: [
                      { required: true, message: '请填写收货人' },
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorMinAndMax(
                            rule,
                            value,
                            callback,
                            '收货人',
                            2,
                            15
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(val) => {
                        this.forceUpdate();
                        settingTempAddress('name', (val.target as any).value);
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="手机号码" hasFeedback {...formItemLayoutTwo}>
                  {getFieldDecorator('consigneeDetailAddress', {
                    ...phone,
                    rules: [
                      { required: true, message: '请填写手机号码' },
                      {
                        pattern: ValidConst.phone,
                        message: '请输入正确的手机号码'
                      }
                    ]
                  })(
                    <Input
                      onChange={(val) => {
                        this.forceUpdate();
                        settingTempAddress('phone', (val.target as any).value);
                      }}
                    />
                  )}
                </FormItem>
              </Col>
            </Col>
          </Row>
        )}
      </div>
    );
  }

  timer;
  count = 0;

  /**
   * 点击事件
   * @param value
   */
  handleSearch = (value) => {
    this.count = this.count + 1;
    const lastCount = this.count;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (value) {
      this.props.relaxProps.init([
        {
          customerAccount: `${value.toString()}`
        }
      ]);
    }
    this.timer = setTimeout(() => {
      if (ValidConst.number.test(value)) {
        this.fetch(value, lastCount);
      }
    }, 300);
  };

  /**
   * 请求
   * @param value
   * @param cc
   */
  fetch = (value, lastCount) => {
    Fetch<TResult>('/customer/customerAccount/list', {
      method: 'POST',
      body: JSON.stringify({ customerAccount: value })
    }).then(({ res }) => {
      if (lastCount < this.count) {
        return;
      }
      this.props.relaxProps.init(res);
    });
  };

  /**
   * 选择展示的项
   * @param value
   * @private
   */
  _selectCustomerName = (value) => {
    if (ValidConst.number.test(value)) {
      const { onSelectCustomerName } = this.props.relaxProps;

      onSelectCustomerName(value).then(() => {
        if (this.props.selectedCustomerInfo) {
          this.props.form.setFieldsValue({
            customerInfo: this.props.selectedCustomerInfo
          });
          this.setState({
            addressChoose: !this.state.addressChoose
          });
        }
      });
    }
  };
}

const styles = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  }
};

export default CustomerInfo;
