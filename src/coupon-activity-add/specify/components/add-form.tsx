import * as React from 'react';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Spin
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import { Const, history, QMMethod, util } from 'qmkit';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';
import ChooseCustomer from './specify-customer';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

export default class SpecifyAddForm extends React.Component<any, any> {
  props;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false,
        _specify: false
      },
      joinLevel: {
        _joinLevel: null
      }
    };
  }

  componentWillReceiveProps() {
    //等级初始化
    const store = this._store as any;
    const joinLevel = store.state().getIn(['activity', 'joinLevel']) + '';
    if (this.state.joinLevel._joinLevel == joinLevel) {
      return;
    }
    const levelList =
      store.state().get('levelList') &&
      store
        .state()
        .get('levelList')
        .toJS();
    this.setState({ joinLevel: { _joinLevel: joinLevel } });
    if (joinLevel == undefined || joinLevel == null) {
      const { customerLevel } = this.state;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      this.setState({
        level: {
          _indeterminate: false,
          _checkAll: true,
          _checkedLevelList: levelIds,
          _allCustomer: true,
          _levelPropsShow: false,
          _specify: false
        }
      });
    } else {
      if (+joinLevel === 0) {
        //全店铺客户
        this._levelRadioChange(0, levelList);
        //店铺内客户全选
        this._allLevelChecked(true, levelList);
      } else if (+joinLevel === -1) {
        //全平台客户
        this._levelRadioChange(-1, levelList);
        // 自营店铺默认客户全选  //店铺内客户全选
        this._allLevelChecked(true, levelList);
      } else if (+joinLevel === -2) {
        //全平台客户
        this._levelRadioChange(-2, '');
      } else {
        util.isThirdStore()
          ? this._levelRadioChange(0, levelList)
          : this._levelRadioChange(-1, levelList);
        //勾选某些等级
        this._levelGroupChange(joinLevel.split(','), levelList);
      }
    }
  }

  render() {
    const { form } = this.props;
    let { level } = this.state;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const loading = store.state().get('loading');
    const levelList = store
      .state()
      .get('levelList')
      .toJS();
    const chooseCustomerList = activity.get('chooseCustomerList');
    const { getFieldDecorator } = form;
    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('activityName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '活动名称不超过40个字'
                },
                { min: 1, max: 40, message: '1-40字符' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, '活动名称');
                  }
                }
              ],
              onChange: (e) => {
                store.changeFormField({ activityName: e.target.value });
              },
              initialValue: activity.get('activityName')
            })(
              <Input
                placeholder="活动名称不超过40个字"
                style={{ width: 360 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="发放时间">
            <RadioGroup
              value={activity.get('sendNow') ? activity.get('sendNow') : 0}
              onChange={(e) => {
                // this.chagneTiem(e.target.value);
                store.changeFormField({ sendNow: e.target.value });
                // console.log(tiemsa, 'tiemsatiemsa')
                store.changeFormField({
                  startTime: this.changetiem()
                });
              }}
            >
              <Radio value={0}>
                {getFieldDecorator('startTime', {
                  rules: [
                    { required: true, message: '请选择发放时间' },
                    {
                      validator: (_rule, value, callback) => {
                        if (
                          value &&
                          moment()
                            .add(-5, 'minutes')
                            .second(0)
                            .unix() > moment(value).unix()
                        ) {
                          callback('发放时间不能早于现在');
                        } else if (
                          value &&
                          moment()
                            .add('months', 3)
                            .unix() <
                            moment(value)
                              .minute(0)
                              .second(0)
                              .unix()
                        ) {
                          callback('发放时间不能晚于三个月');
                        } else {
                          callback();
                        }
                      }
                    }
                  ],
                  onChange: (date, dateString) => {
                    if (date) {
                      store.changeFormField({
                        startTime: dateString + ':00'
                      });
                    }
                  },
                  initialValue: activity.get('startTime')
                    ? moment(activity.get('startTime'))
                    : null
                })(
                  <DatePicker
                    disabled={activity.get('sendNow') == 0 ? false : true}
                    getCalendarContainer={() =>
                      document.getElementById('page-content')
                    }
                    allowClear={false}
                    disabledDate={(current) => {
                      return (
                        (current && current < moment().add(-1, 'minutes')) ||
                        (current && current > moment().add(3, 'months'))
                      );
                    }}
                    format={Const.DATE_FORMAT}
                    placeholder={'发放时间'}
                    showTime={{ format: 'HH:mm' }}
                  />
                )}
              </Radio>
              <Radio
                disabled={activity.get('activityId') ? true : false}
                value={1}
              >
                立即发券
              </Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator(
              'coupons',
              {}
            )(
              <ChooseCoupons
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  store.onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) =>
                  store.changeCouponTotalCount(index, totalCount)
                }
                type={2}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="目标客户" required={true}>
            {getFieldDecorator('joinLevel', {
              // rules: [{required: true, message: '请选择目标客户'}],
            })(
              <div>
                <RadioGroup
                  value={
                    level._specify
                      ? -2
                      : level._allCustomer
                      ? -1
                      : level._allLevel
                      ? 0
                      : -2
                  }
                  onChange={(e) => {
                    this._levelRadioChange(e.target.value, levelList);
                  }}
                >
                  {/* {activity.get('sendNow') == 0 && (
                    <Radio value={-1}>全平台客户</Radio>
                  )} */}
                  {/* 商家入驻需求 隐藏店铺内客户选项 */}
                  {/* {activity.get('sendNow') == 0 && util.isThirdStore() && (
                    <Radio value={0}>店铺内客户</Radio>
                  )} */}
                  <Radio value={-2}>指定客户</Radio>
                </RadioGroup>

                {level._levelPropsShow && (
                  <div>
                    {util.isThirdStore() && (
                      <Checkbox
                        indeterminate={level._indeterminate}
                        onChange={(e) =>
                          this._allLevelChecked(e.target.checked, levelList)
                        }
                        checked={level._checkAll}
                      >
                        全部等级
                      </Checkbox>
                    )}
                    {/*<CheckboxGroup*/}
                    {/*options={this._renderCheckboxOptions(levelList)}*/}
                    {/*onChange={(value) =>*/}
                    {/*this._levelGroupChange(value, levelList)*/}
                    {/*}*/}
                    {/*value={level._checkedLevelList}*/}
                    {/*/>*/}
                  </div>
                )}

                {/* {loading && <Spin />} */}

                {!loading && level._specify && (
                  <ChooseCustomer
                    chooseCustomerList={
                      chooseCustomerList && chooseCustomerList.toJS()
                    }
                    selectedCustomerIds={
                      activity.get('chooseCustomerIds') &&
                      activity.get('chooseCustomerIds').toJS()
                    }
                    maxLength={1000}
                    onDelCustomer={async (id) => {
                      store.onDelCustomer(id);
                      form.resetFields(['joinLevel']);
                    }}
                    chooseCustomerBackFun={async (customerIds, rows) => {
                      store.chooseCustomerBackFun(customerIds, rows);
                      form.resetFields(['joinLevel']);
                    }}
                  />
                )}
              </div>
            )}
          </FormItem>

          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={async () => {
                  if (activity.get('sendNow') == 1) {
                    console.log(
                      this.changetiem(),
                      'asdasdasd',
                      activity.toJS()
                    );
                    await store.changeFormField({
                      startTime: this.changetiem()
                    });
                  }
                  this._onSave();
                }}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>返回</Button>
            </Col>
          </Row>
        </Form>
      </NumBox>
    );
  }
  // 修改发放时间
  chagneTiem = (value) => {
    const store = this._store as any;
    store.changetiemChange(value);
  };
  // 获取当前时分秒
  changetiem = () => {
    let d = new Date(),
      str = '';
    str +=
      d.getHours() + 1 <= 9
        ? '0' + (d.getHours() + 1) + ':'
        : d.getHours() + 1 + ':';
    str +=
      d.getMinutes() <= 9 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
    str += d.getSeconds() <= 9 ? '0' + d.getSeconds() : d.getSeconds();
    // console.log(str, 's')
    let itmes = {
      n: d.getFullYear() + '-',
      y:
        d.getMonth() + 1 <= 9
          ? '0' + (d.getMonth() + 1) + '-'
          : d.getMonth() + 1 + '-',
      d: d.getDate() <= 9 ? '0' + d.getDate() : d.getDate() + ' '
    };
    // console.log(str, 'strstr');
    const tiemsa = itmes.n + '' + itmes.y + '' + itmes.d + ' ' + str;
    return tiemsa;
  };

  /**
   * 保存
   */
  _onSave = async () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    // if (activity.get('sendNow') == 1) {
    //   console.log(this.changetiem(), 'asdasdasd')
    //   await store.changeFormField({
    //     startTime: this.changetiem()
    //   });
    // }
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    // 2.指定客户
    let errorsCustomer = this._validCustomers(
      activity.get('chooseCustomerIds'),
      form
    );
    form.resetFields(['time']);
    // if (!activity.activityId) {
    //强制校验创建时间

    if (
      moment()
        .add(-5, 'minutes')
        .second(0)
        .unix() >= moment(activity.get('startTime')).unix()
    ) {
      form.setFields({
        ['startTime']: {
          errors: [new Error('发放时间不能小于当前时间')]
        }
      });
      errors = true;
    }
    if (
      moment()
        .add('months', 3)
        .unix() <
      moment(activity.get('startTime'))
        .minute(0)
        .second(0)
        .unix()
    ) {
      form.setFields({
        ['startTime']: {
          errors: [new Error('发放时间不能晚于三个月')]
        }
      });
      errors = true;
    }
    console.log('activity1', this.props.form);

    // }
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      console.log('1231231');
      if (!errs && !errors && !errorsCustomer) {
        console.log('activity2', activity.toJS());
        // 3.验证通过，保存
        const { level } = this.state;
        let joinLevel = '';
        if (level._specify) {
          joinLevel = '-2';
        } else if (
          level._allCustomer &&
          (level._checkAll || util.isThirdStore())
        ) {
          joinLevel = '-1';
        } else if (level._allLevel && level._checkAll) {
          joinLevel = '0';
        } else {
          level._checkedLevelList.forEach((v) => {
            joinLevel = joinLevel + v + ',';
          });
          joinLevel = joinLevel.substring(0, joinLevel.length - 1);
        }
        // console.log(joinLevel);
        store.save(joinLevel);
      }
    });
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
  _renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };

  /**
   * 验证指定客户列表
   */
  _validCustomers = (customer, form) => {
    let errorFlag = false;
    form.resetFields(['joinLevel']);
    // 3.验证通过，保存
    const { level } = this.state;
    if (level._specify) {
      let errorObject = {};
      if (!customer || customer.size == 0) {
        errorObject['joinLevel'] = {
          value: null,
          errors: [new Error('请选择指定用户')]
        };
        errorFlag = true;
      } else if (customer.size > 1000) {
        errorObject['joinLevel'] = {
          value: null,
          errors: [new Error('最多可选1000位用户')]
        };
        errorFlag = true;
      }
      form.setFields(errorObject);
    }
    return errorFlag;
  };

  /**
   * 勾选全部等级
   * @param checked
   */
  _allLevelChecked = (checked, customerLevel) => {
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    let { level } = this.state;
    level._indeterminate = false;
    level._checkAll = checked;
    (level._checkedLevelList = checked ? levelIds : []), this.setState(level);
  };

  /**
   * 全部客户 ～ 全部等级  选择
   * @param value
   */
  _levelRadioChange = (value, customerLevel) => {
    let levelPropsShow = false;

    let { level } = this.state;

    // 自营全部等级+店铺等级
    if (
      (util.isThirdStore() && value == 0) ||
      (!util.isThirdStore() && value == -1)
    ) {
      levelPropsShow = true;
      level._specify = false;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      // 全选
      if (levelPropsShow && level._checkedLevelList.length == 0) {
        level._indeterminate = false;
        level._checkedLevelList = levelIds;
        level._checkAll = true;
      }
    } else {
      // 第三方店铺-全平台
      level._specify = false;
    }
    if (value == -1) {
      level._allCustomer = true;
      level._allLevel = false;
      level._levelPropsShow = levelPropsShow;
    } else if (value == 0) {
      level._allLevel = true;
      level._allCustomer = false;
      level._levelPropsShow = true;
      level._indeterminate = false;
      level._specify = false;
    } else if (value == -2) {
      level._specify = true;
      level._allCustomer = false;
      level._levelPropsShow = false;
      level._checkAll = false;
      level._allLevel = false;
    }
    this.props.form.resetFields('joinLevel');
    this.setState(level);
  };

  /**
   * 勾选部分等级方法
   * @param checkedList
   */
  _levelGroupChange = (checkedList, customerLevel) => {
    let { level } = this.state;
    level._indeterminate =
      !!checkedList.length && checkedList.length < customerLevel.length;
    level._checkAll = checkedList.length === customerLevel.length;
    (level._checkedLevelList = checkedList), this.setState(level);

    this.props.form.resetFields('joinLevel');
  };
}
