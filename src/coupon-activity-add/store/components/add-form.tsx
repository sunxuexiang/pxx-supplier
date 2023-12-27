import * as React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Popover, Icon} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history, QMMethod, ValidConst } from 'qmkit';
import { WmRangePicker } from 'biz';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';

const FormItem = Form.Item;
const img01 = require('../img/tips-img.png');
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

export default class StoreForm extends React.Component<any, any> {
  props;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const disableTimeList = store.state().get('disableTimeList');
    const { getFieldDecorator } = form;
    //进店赠券图片
    const tipsImg = (
      <div style={{ width: 240, height: 298 }}>
        <img src={img01} alt="" style={{ width: 240, height: 298 }} />
      </div>
    );

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

          <FormItem {...formItemLayout} label="赠券通知标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写赠券通知标题'
                },
                { min: 1, max: 10, message: '赠券通知标题不超过10个字符' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityTitle: e.target.value });
              },
              initialValue: activity.get('activityTitle')
            })(<Input style={{ width: 360 }} />)}
            <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover>
          </FormItem>

          <FormItem {...formItemLayout} label="赠券通知描述">
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写赠券通知描述'
                },
                { min: 1, max: 20, message: '赠券通知描述不超过20个字' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityDesc: e.target.value });
              },
              initialValue: activity.get('activityDesc')
            })(<Input style={{ width: 360 }} />)}
            <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover>
          </FormItem>

          <FormItem {...formItemLayout} label="起止时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      value[0]&&
                      moment()
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
                if (date &&
                  dateString &&
                  dateString[0] != '' &&
                  dateString[1] != '') {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }else{
                  store.changeFormField({
                    startTime: '',
                    endTime: ''
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') &&
                activity.get('startTime') != '' &&
                activity.get('endTime') != '' &&[
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <WmRangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DAY_FORMAT}
                placeholder={['起始时间', '结束时间']}
                disableRanges={disableTimeList.toJS()}
              />
            )}
            &nbsp;&nbsp;
            <span style={{ color: '#999' }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator('coupons', {})(
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

          <FormItem {...formItemLayout} label="优惠券总组数">
            {getFieldDecorator('receiveCount', {
              rules: [
                {
                  required: true,
                  pattern: ValidConst.noZeroNineNumber,
                  message: '请输入1-999999999的整数'
                }
              ],
              onChange: (val) => store.changeFormField({ receiveCount: val }),
              initialValue: activity.get('receiveCount')
            })(<InputNumber />)}
            <span style={{ color: '#999' }}>（1-999999999组）</span>
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
        store.save();
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
}
