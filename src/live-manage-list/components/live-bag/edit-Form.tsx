import React from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';
import { IMap } from 'typings/globalType';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import CouponList from './edit_coupon_list';
import { fromJS } from 'immutable';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const formItemLayouts = {};
const RadioGroup = Radio.Group;
const CUSTOMER_REGISTER_TYPE = [
  { id: 0, name: '家用' },
  { id: 1, name: '商户' },
  { id: 2, name: '单位' }
];

@Relax
export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      liveBagFormData: IMap;
      editFormData: Function;
      images: any;
      editImages: Function;
    };
  };
  static relaxProps = {
    editImages: noop,
    liveBagFormData: 'liveBagFormData',
    editFormData: noop
    // 附件信息
  };

  render() {
    const { liveBagFormData, editFormData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="奖品名称"
              style={{ marginTop: 10 }}
            >
              {getFieldDecorator('bagName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入奖品名称'
                  }
                ],
                onChange: (e) => {
                  editFormData('bagName', e.target.value.replace(/\s/g, ''));
                },
                initialValue: liveBagFormData.get('bagName')
              })(<Input placeholder="请输入直播间名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="中奖名额：">
              {getFieldDecorator('winningNumber', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入中奖名额'
                  }
                ],
                onChange: (e) => {
                  editFormData('winningNumber', e.target.value);
                },
                initialValue: liveBagFormData.get('winningNumber')
                  ? String(liveBagFormData.get('winningNumber'))
                  : ''
              })(<Input placeholder="" suffix="个" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="开奖时间："
              style={{ marginTop: 10 }}
            >
              {getFieldDecorator('lotteryTime', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入开奖时间'
                  }
                ],
                onChange: (e) => {
                  editFormData('lotteryTime', e.target.value);
                },
                initialValue: liveBagFormData.get('lotteryTime')
                  ? String(liveBagFormData.get('lotteryTime'))
                  : ''
              })(<Input placeholder="" suffix="分钟" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="中奖用户兑奖方式"
              required={true}
              style={{ marginTop: 10 }}
            >
              <RadioGroup defaultValue={0}>
                <Radio value={0}>
                  <span>系统自动发放</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              {...formItemLayout}
              label="用户参与方式"
              required={true}
              style={{ marginTop: 10 }}
            >
              <div>
                <RadioGroup defaultValue={0}>
                  <Radio value={0}>
                    <span>评论指定内容</span>
                  </Radio>
                </RadioGroup>
                <div>
                  {getFieldDecorator('joinContent', {
                    rules: [
                      { required: true, whitespace: true, message: '请选择' }
                    ],
                    onChange: (e) => {
                      editFormData('joinContent', e.target.value);
                    },
                    initialValue: liveBagFormData.get('joinContent')
                  })(
                    <Radio.Group>
                      <Radio.Button style={{ marginRight: 10 }} value={'通过'}>
                        通过
                      </Radio.Button>
                      <Radio.Button
                        style={{ marginRight: 10 }}
                        value={'不通过'}
                      >
                        不通过
                      </Radio.Button>
                      <Radio.Button
                        style={{ marginRight: 10 }}
                        value={'打款失败'}
                      >
                        打款失败
                      </Radio.Button>
                      <Radio.Button
                        style={{ marginRight: 10 }}
                        value={'自定义内容'}
                      >
                        自定义内容
                      </Radio.Button>
                    </Radio.Group>
                  )}
                </div>
                <div>
                  {liveBagFormData.get('joinContent') == '自定义内容' ? (
                    <FormItem {...formItemLayout} style={{ marginTop: 10 }}>
                      {getFieldDecorator('joinContent_text', {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入自定义内容'
                          }
                        ],
                        onChange: (e) => {
                          editFormData('joinContent_text', e.target.value);
                        },
                        initialValue: liveBagFormData.get('joinContent_text')
                      })(
                        <div>
                          <Input placeholder="" />
                        </div>
                      )}
                    </FormItem>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              labelCol={{ xs: { span: 3 }, sm: { span: 3 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 21 } }}
              label="选择奖品"
              required={true}
              style={{ marginTop: 10 }}
            >
              <div>
                <RadioGroup defaultValue={0}>
                  <Radio value={0}>
                    <span>优惠券</span>
                  </Radio>
                </RadioGroup>
                {/* 优惠券活动和优惠券列表 */}
                <CouponList />
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  // /**
  //  * 修改表单字段
  //  */
  // _changeFormData = (key, value) => {
  //   const { editFormData } = this.props.relaxProps;
  //   editFormData({ key, value });
  // };
}
