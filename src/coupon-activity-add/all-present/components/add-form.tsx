import * as React from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Radio,
  Row,
  Col,
  Checkbox,
  Button
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, QMMethod, ValidConst, history, util } from 'qmkit';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
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

export default class AllPresentAddForm extends React.Component<any, any> {
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
        _levelPropsShow: false
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
    const levelList = store
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
          _levelPropsShow: false
        }
      });
    } else {
      if (+joinLevel === 0) {
        //店铺内客户全选
        this._allLevelChecked(true, levelList);
      } else if (+joinLevel === -1) {
        //全平台客户
        this._levelRadioChange(-1, levelList);
      } else {
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
    const levelList = store
      .state()
      .get('levelList')
      .toJS();
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

          <FormItem {...formItemLayout} label="活动时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择活动时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      moment(new Date()).second(0) &&
                      moment(new Date())
                        .second(0)
                        .unix() > value[0].unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else if (value[0] && value[0].unix() >= value[1].unix()) {
                      callback('开始时间必须早于结束时间');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') && [
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['开始时间', '结束时间']}
                showTime={{
                  format: 'HH:mm'
                }}
                disabledDate={(current) => {
                  return current && current.isBefore(moment().startOf('day'));
                }}
              />
            )}
            <span style={{ color: '#999', marginLeft: 8 }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="赠券类型">
            {getFieldDecorator('sendType', {
              initialValue: activity.get('sendType')
                ? activity.get('sendType')
                : 0
            })(
              <RadioGroup
                onChange={(e) =>
                  store.changeFormField({ sendType: e.target.value })
                }
              >
                <Radio value={0}>普通赠券</Radio>
                <Radio value={1}>直播赠券</Radio>
              </RadioGroup>
            )}
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
                type={0}
              />
            )}
          </FormItem>

          <FormItem
            className="chooseNum"
            {...formItemLayout}
            label="每人限领次数"
            required
          >
            <RadioGroup
              value={activity.get('receiveType')}
              onChange={async (e) => {
                await store.changeFormField({ receiveType: e.target.value });
                form.validateFields(['receiveCount'], { force: true });
              }}
            >
              <Radio value={0}>不限</Radio>
              <Radio value={1}>
                {getFieldDecorator('receiveCount', {
                  rules: [
                    {
                      required: activity.get('receiveType') == 1,
                      pattern: ValidConst.noZeroNineNumber,
                      message: '请输入1-999999999的整数'
                    }
                  ],
                  onChange: (val) =>
                    store.changeFormField({ receiveCount: val }),
                  initialValue: activity.get('receiveCount')
                })(<InputNumber disabled={activity.get('receiveType') != 1} />)}
                <span style={{ color: '#999', marginLeft: 10 }}>
                  每个客户可领取的次数，每次仅限领取1张
                </span>
              </Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="目标客户" required={true}>
            {getFieldDecorator('joinLevel', {
              // rules: [{required: true, message: '请选择目标客户'}],
            })(
              <div>
                <RadioGroup
                  value={level._allCustomer ? -1 : 0}
                  onChange={(e) => {
                    this._levelRadioChange(e.target.value, levelList);
                  }}
                >
                  <Radio value={-1}>全平台客户</Radio>
                  {/* 商家入驻需求 隐藏店铺内客户选项 */}
                  {/* {util.isThirdStore() && <Radio value={0}>店铺内客户</Radio>} */}
                </RadioGroup>

                {level._levelPropsShow && (
                  <div>
                    <Checkbox
                      indeterminate={level._indeterminate}
                      onChange={(e) =>
                        this._allLevelChecked(e.target.checked, levelList)
                      }
                      checked={level._checkAll}
                    >
                      全部等级
                    </Checkbox>
                    <CheckboxGroup
                      options={this._renderCheckboxOptions(levelList)}
                      onChange={(value) =>
                        this._levelGroupChange(value, levelList)
                      }
                      value={level._checkedLevelList}
                    />
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={() => this._onSave()}
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

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    if (!activity.activityId) {
      form.resetFields(['time']);
      //强制校验创建时间
      if (
        moment().second(0) &&
        moment()
          .second(0)
          .unix() > moment(activity.get('startTime')).unix()
      ) {
        form.setFields({
          ['time']: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        errors = true;
      }
    }
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs && !errors) {
        // 3.验证通过，保存
        const { level } = this.state;
        let joinLevel = '';
        if (level._allCustomer) {
          joinLevel = '-1';
        } else if (level._checkAll) {
          joinLevel = '0';
        } else {
          level._checkedLevelList.forEach((v) => {
            joinLevel = joinLevel + v + ',';
          });
          joinLevel = joinLevel.substring(0, joinLevel.length - 1);
        }
        store.save(joinLevel);
      }
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
   * 勾选全部等级
   * @param checked
   */
  _allLevelChecked = (checked, customerLevel) => {
    this.props.form.resetFields('joinLevel');
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    this.setState({
      level: {
        _indeterminate: false,
        _checkAll: checked,
        _checkedLevelList: checked ? levelIds : [],
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * 全部客户 ～ 全部等级  选择
   * @param value
   */
  _levelRadioChange = (value, customerLevel) => {
    this.props.form.resetFields('joinLevel');
    let { level } = this.state;
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    level._allCustomer = value === -1;
    level._levelPropsShow = value === 0;
    if (value == 0 && level._checkedLevelList.length == 0) {
      level._indeterminate = false;
      level._checkAll = true;
      level._checkedLevelList = levelIds;
    }
    this.setState(level);
  };

  /**
   * 勾选部分等级方法
   * @param checkedList
   */
  _levelGroupChange = (checkedList, customerLevel) => {
    this.props.form.resetFields('joinLevel');
    this.setState({
      level: {
        _indeterminate:
          !!checkedList.length && checkedList.length < customerLevel.length,
        _checkAll: checkedList.length === customerLevel.length,
        _checkedLevelList: checkedList,
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };
}
