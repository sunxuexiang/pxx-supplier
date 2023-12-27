import * as React from 'react';
import {
  Form,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Button,
  Switch,
  Select,
  Input
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history } from 'qmkit';
import SelectedGoodsModal from './selected-goods-modal';
import SelectedGoodsGrid from './selected-goods-grid';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const GreyText = styled.span`
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
`;

export default class AddForm extends React.Component<any, any> {
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
    let state = store.state();
    const { getFieldDecorator } = form;

    if (state.get('loading')) {
      return null;
    }

    return (
      <Form style={{ marginTop: 20 }}>
        <FormItem {...formItemLayout} label=" 拼团人数" required>
          {getFieldDecorator('grouponNum', {
            initialValue: state.get('grouponNum'),
            rules: [
              {
                required: true,
                message: '请填写拼团人数'
              }
            ]
          })(
            <InputNumber
              min={2}
              max={20}
              precision={0}
              onChange={(val) => store.changeFormField('grouponNum', val)}
            />
          )}
          &nbsp;人团 <GreyText>请输入大于1、小于等于20的正整数</GreyText>
        </FormItem>

        <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  const nowMoment = moment(new Date()).subtract(1, 'minute');
                  if (
                    value &&
                    nowMoment.second(0) &&
                    nowMoment.second(0).unix() > value[0].unix()
                  ) {
                    callback('开始时间不能早于现在');
                  } else if (
                    value &&
                    value[0] &&
                    value[0].unix() >= value[1].unix()
                  ) {
                    callback('开始时间必须早于结束时间');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                store.changeFormField('startTime', dateString[0]);
                store.changeFormField('endTime', dateString[1]);
              }
            },
            initialValue: state.get('startTime') &&
              state.get('endTime') && [
                moment(state.get('startTime')),
                moment(state.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format={Const.TIME_FORMAT}
              placeholder={['开始时间', '结束时间']}
              showTime={{
                format: 'HH:mm:ss'
              }}
              disabledDate={(current) => {
                return current && current.isBefore(moment().startOf('day'));
              }}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="选择分类" required>
          {getFieldDecorator('grouponCateId', {
            rules: [{ required: true, message: '请选择分类' }],
            initialValue: state.get('grouponCateId')
          })(
            <Select
              getPopupContainer={() => document.getElementById('page-content')}
              style={{ width: 200 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                store.changeFormField('grouponCateId', value);
              }}
            >
              {state.get('grouponCates').map((v) => (
                <Option
                  key={v.get('grouponCateId')}
                  value={v.get('grouponCateId')}
                >
                  {v.get('grouponCateName')}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="是否自动成团" required>
          {getFieldDecorator('autoGroupon', {
            rules: [{ required: true, message: '请选择是否自动成团' }],
            initialValue: state.get('autoGroupon')
          })(
            <Switch
              defaultChecked={state.get('autoGroupon')}
              onChange={(val) => store.changeFormField('autoGroupon', val)}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="是否包邮" required>
          {getFieldDecorator('freeDelivery', {
            rules: [{ required: true, message: '请选择是否包邮' }],
            initialValue: state.get('freeDelivery')
          })(
            <Switch
              defaultChecked={state.get('freeDelivery')}
              onChange={(val) => store.changeFormField('freeDelivery', val)}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="选择商品" required={true}>
          <div>
            {!state.get('isEdit') && (
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  store.changeFormField('modalVisible', true);
                }}
              >
                添加商品
              </Button>
            )}
            &nbsp; &nbsp;
            <SelectedGoodsGrid
              selectedRows={state.get('selectedSkus')}
              isEdit={state.get('isEdit')}
              deleteSelectedSku={(skuId) => store.deleteSelectedSku(skuId)}
              changeSelectSkuInfo={store.changeSelectSkuInfo}
              form={form}
            />
            {getFieldDecorator('selectedSkus', {
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value || value.length == 0) {
                      callback(new Error('请选择商品'));
                      return;
                    }

                    callback();
                  }
                }
              ],
              initialValue: state.get('selectedSkus').toJS()
            })(<Input type="hidden" />)}
          </div>
        </FormItem>

        <Row type="flex" justify="start">
          <Col span={3} />
          <Col span={10}>
            <Button
              onClick={() => this._onSave()}
              type="primary"
              htmlType="submit"
            >
              {state.get('goodsAuditFlag') == '1' ? '去审核' : '保存'}
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.goBack()}>取消</Button>
          </Col>
        </Row>
        {state.get('modalVisible') && (
          <SelectedGoodsModal
            brands={state.get('brands')}
            cates={state.get('cates')}
            startTime={state.get('startTime')}
            endTime={state.get('endTime')}
            selectedSpuIds={Array.from(
              new Set(
                state
                  .get('selectedSkus')
                  .map((i) => i.get('goodsId'))
                  .toJS()
              )
            )}
            selectedSkus={state.get('selectedSkus')}
            onOk={(selectedSkus) => {
              store.onChooseGoods(selectedSkus);
              form.setFieldsValue({ selectedSkus: selectedSkus.toJS() });
              store.changeFormField('modalVisible', false);
            }}
            onCancel={() => store.changeFormField('modalVisible', false)}
          />
        )}
      </Form>
    );
  }

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    this.props.form.validateFields(null, (errs, values) => {
      if (!errs) {
        store.saveFunc(values);
      }
    });
  };
}
