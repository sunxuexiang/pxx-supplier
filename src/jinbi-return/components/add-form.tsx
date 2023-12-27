import * as React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  message,
  Radio,
  Select
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history, QMMethod, ValidConst } from 'qmkit';
import { WmRangePicker } from 'biz';
import { fromJS } from 'immutable';
import GoodsModal from './modoul/goods-modal';

import SelectedGoodsGrid from './selected-goods-grid';

const Option = Select.Option;

const RadioGroup = Radio.Group;

const FormItem = Form.Item;
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
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      //营销活动已选的商品信息
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([]),
      wareIda: null,
      // 保存按钮 loading
      loading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const store = this._store as any;
    const activity = store
      .state()
      .get('activity')
      .toJS();

    const { selectedRows, selectedSkuIds } = this.state;
    if (nextProps.goodsInfoVOS.length > 0) {
      nextProps.goodsInfoVOS.forEach((ele) => {
        selectedSkuIds.push(ele.goodsInfoId);
      });
    }
    this.setState({
      wareIda: Number(activity.wareId),
      selectedRows:
        selectedRows.toJS().length > 0
          ? selectedRows
          : fromJS(nextProps.goodsInfoVOS),
      selectedSkuIds,
      goodsModal: {
        _selectedSkuIds: selectedSkuIds,
        _selectedRows:
          selectedRows.toJS().length > 0
            ? selectedRows
            : fromJS(nextProps.goodsInfoVOS)
      }
    });
  }

  render() {
    const { selectedRows, skuExists, wareIda, loading } = this.state;
    const { form } = this.props;
    const store = this._store as any;
    const id = store.state().getIn(['activity', 'activityId']);
    const activity = store.state().get('activity');

    const disableTimeList = store.state().get('disableTimeList');
    const { getFieldDecorator } = form;
    const wareHouseVOPage = JSON.parse(localStorage.getItem('warePage')) || [];
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

          <FormItem
            {...formItemLayout}
            required={true}
            style={{ display: 'none' }}
            label="适用区域"
          >
            <Col style={{ width: 360 }}>
              {getFieldDecorator('ckID', {
                initialValue: activity.get('wareId'),
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value && value.length > 3) {
                        callback('最多可选一个适用区域');
                        return;
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Select
                  // mode="multiple"
                  placeholder="请选择适用区域"
                  onChange={(value) => {
                    store.changeFormField({ wareId: value });
                    if (value != activity.get('wareId')) {
                      setTimeout(() => {
                        this.changeNull();
                        store.changeFormField({ skuIds: [] });
                      });
                    }
                  }}
                >
                  {wareHouseVOPage.map((cate) => {
                    return (
                      <Option
                        key={cate.wareId}
                        // disabled={cate.get('onlyPlatformFlag') == 1}
                      >
                        {cate.wareName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label="起止时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      value[0] &&
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
                if (
                  date &&
                  dateString &&
                  dateString[0] != '' &&
                  dateString[1] != ''
                ) {
                  store.changeFormField({
                    startTime: dateString[0],
                    endTime: dateString[1]
                  });
                } else {
                  store.changeFormField({
                    startTime: '',
                    endTime: ''
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') &&
                activity.get('startTime') != '' &&
                activity.get('endTime') != '' && [
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <WmRangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                isDateTime
                allowClear={false}
                format={Const.DAY_FORMAT}
                placeholder={['起始时间', '结束时间']}
                disableRanges={disableTimeList.toJS()}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="满赠类型">
            {getFieldDecorator('coinActivityFullType', {
              rules: [
                {
                  required: true,
                  message: '请选择满赠类型'
                }
              ],
              initialValue: '0'
            })(
              <RadioGroup>
                <Radio value="0">任买返</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否叠加优惠">
            {getFieldDecorator('isOverlap', {
              rules: [
                {
                  required: true,
                  message: '请选择是否叠加优惠'
                }
              ],
              onChange: (e) => {
                store.changeFormField({ isOverlap: e.target.value });
              },
              initialValue: activity.get('isOverlap')
                ? activity.get('isOverlap')
                : 1
            })(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
            <span style={{ color: 'red' }}>
              注释：选择任买返开启叠加，满1件返n数量鲸币，用户买2件则获得2n数量鲸币，以此类推
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="返还力度">
            {getFieldDecorator('coinNum', {
              rules: [
                {
                  required: true,
                  pattern: ValidConst.noZeroFourNumber,
                  message: '请输入填写1-9999.99内的鲸币'
                }
              ],
              onChange: (val) => store.changeFormField({ coinNum: val }),
              initialValue: activity.get('coinNum')
            })(<InputNumber />)}
            <span style={{ color: '#999' }}>
              （请输入填写1-9999.99内的鲸币）
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="目标客户">
            {getFieldDecorator('targetCustomers', {
              rules: [
                {
                  required: true,
                  message: '请选择目标客户'
                }
              ],
              onChange: (e) => {
                store.changeFormField({ targetCustomers: e.target.value });
              },
              initialValue: 0
            })(
              <RadioGroup>
                <Radio value={0}>全平台客户</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="指定商品" required={true}>
            {getFieldDecorator(
              'goods',
              {}
            )(
              <div>
                <div style={{ display: 'flex' }}>
                  <Button
                    type="primary"
                    icon="plus"
                    onClick={this.openGoodsModal}
                  >
                    添加指定商品
                  </Button>
                  &nbsp;&nbsp;
                  <div>至少1个指定商品</div>
                </div>
                <SelectedGoodsGrid
                  selectedRows={selectedRows}
                  skuExists={skuExists}
                  itmelist={[]}
                  deleteSelectedSku={this.deleteSelectedSku}
                  cheBOx={this.cheBOx}
                  purChange={this.purChange}
                  changeDisplay={this.changeDisplay}
                />
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
                loading={loading}
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>返回</Button>
            </Col>
          </Row>
        </Form>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          wareId={wareIda}
          // marketingId={marketingId}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </NumBox>
    );
  }

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  //  请空商品列表
  changeNull = () => {
    const listaa = fromJS([]);
    setTimeout(() => {
      this.setState({
        selectedSkuIds: [],
        selectedRows: listaa,
        goodsModal: {
          // _modalVisible: false,
          _selectedSkuIds: [],
          _selectedRows: listaa
        }
      });
    });
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS(
      [...new Set(selectedRows.toJS())].map((item) => {
        let opt: any = item;
        if (opt.displayType !== 1) {
          opt.displayType = 0;
        }
        return opt;
      })
    );
    if (selectedSkuIds.length > 0) {
      this.props.form.resetFields('goods');
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
  };
  purChange = (value, id) => {
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.purchaseNum = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  cheBOx = (id) => {
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    const { selectedRows, selectedSkuIds } = this.state;

    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    });
  };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };
  /**
   * 已添加商品修改是否显示开关
   */
  changeDisplay = (id, checked) => {
    const { selectedRows } = this.state;
    const newRows = selectedRows.toJS().map((item) => {
      if (item.goodsInfoId === id) {
        item.displayType = checked ? 0 : 1;
      }
      return item;
    });
    this.setState({ selectedRows: fromJS(newRows) });
  };
  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const { selectedSkuIds, selectedRows } = this.state;
    const activity = store.state().get('activity');
    const form = this.props.form;
    let errors = false;

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
    if (selectedSkuIds.length >= 1) {
      let list = selectedRows.toJS().map((item) => {
        return { goodsInfoId: item.goodsInfoId, displayType: item.displayType };
      });
      store.changeFormField({ skuIds: list });
    } else {
      message.error('至少添加1个指定商品');
      return false;
    }

    // 2.验证其它表单信息
    this.props.form.validateFields(null, async (errs) => {
      if (!errs && !errors) {
        // 验证通过，保存
        this.setState({ loading: true });
        await store.save();
        this.setState({ loading: false });
      }
    });
  };
}
