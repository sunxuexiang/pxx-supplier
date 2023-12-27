import * as React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Popover,
  Icon,
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
import * as webapi from '../webapi';
import ChooseCoupons from '../common-components/choose-coupons';
import GoodsModal from './modoul/goods-modal';

import SelectedGoodsGrid from './selected-goods-grid';
import { nextTick } from 'process';

const Option = Select.Option;

const RadioGroup = Radio.Group;

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
    const relaxProps = this._store.state();
    // console.log(relaxProps.get('activity').toJS(), '00000000000', props.fullGiftLevelList)
    // console.log(relaxProps.toJS(), 'relaxPropsrelaxPropsrelaxProps')
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
      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [], // 规则长度
      //满金额还是满数量还是订单满赠 （1：满数量赠，2：满金额赠，3：全买赠，4:任买赠）
      isFullCount: true,
      isisFullCount: false,
      wareIda: null
    };
  }
  componentWillReceiveProps(nextProps) {
    const store = this._store as any;
    const activity = store
      .state()
      .get('activity')
      .toJS();
    console.log(activity, 'akhslf');
    if (activity.couponActivityFullType == 3) {
      this.setState({
        isFullCount: false
      });
    } else if (activity.couponActivityFullType == 2) {
      this.setState({
        isFullCount: true
      });
    }
    if (
      activity.couponActivityFullType == 1 ||
      activity.couponActivityFullType == 0
    ) {
      this.setState({
        isisFullCount: true
      });
    } else {
      this.setState({
        isisFullCount: false
      });
    }

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
      },
      fullGiftLevelList: nextProps.fullGiftLevelList
        ? nextProps.fullGiftLevelList
        : [],
      couponActivityFullTypeKey: activity.couponActivityFullType
    });
  }

  render() {
    const {
      selectedRows,
      skuExists,
      fullGiftLevelList,
      isFullCount,
      isisFullCount,
      couponActivityFullTypeKey,
      wareIda
    } = this.state;
    const { form, goodsInfoVOS } = this.props;
    const store = this._store as any;
    const id = store.state().getIn(['activity', 'activityId']);
    const activity = store.state().get('activity');

    console.log(this.state.selectedSkuIds, selectedRows, '5554664');
    const lista = console.log(activity.toJS(), '*-123123123');
    const disableTimeList = store.state().get('disableTimeList');
    const { getFieldDecorator } = form;
    //进店赠券图片
    const tipsImg = (
      <div style={{ width: 240, height: 298 }}>
        <img src={img01} alt="" style={{ width: 240, height: 298 }} />
      </div>
    );
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
            {/* <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover> */}
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
            {/* <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover> */}
          </FormItem>
          {/* 商家入驻需求 此处需隐藏并设置disable 默认值 -1（通用） */}
          <FormItem
            style={{ display: 'none' }}
            {...formItemLayout}
            required={true}
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
                  disabled
                  onChange={(value) => {
                    store.changeFormField({ wareId: value });
                    if (value != activity.get('wareId')) {
                      setTimeout(() => {
                        store.onChosenCoupons([]);
                        console.log(
                          fullGiftLevelList[0].fullAmount,
                          '请选择适用区域'
                        );

                        this.changeNull();
                        store.changeFormField({ skuIds: [] });
                        store.changeFormField({ skuIds: [] });
                        store.changeFormField({ coupons: [] });
                        store.changeFormField({
                          fullGiftLevelList: [
                            {
                              key: fullGiftLevelList[0].key,
                              fullAmount: fullGiftLevelList[0].fullAmount,
                              fullCount: fullGiftLevelList[0].fullCount,
                              giftType: fullGiftLevelList[0].giftType,
                              modalVisible: fullGiftLevelList[0].modalVisible,
                              fullGiftDetailList: []
                            }
                          ]
                        });
                      });
                    }
                  }}
                >
                  <Option key={-1} value="-1">
                    通用
                  </Option>
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
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
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
          <FormItem {...formItemLayout} label="*满赠类型">
            {getFieldDecorator('couponActivityFullType', {
              rules: [
                {
                  required: true,
                  message: '请选择满赠类型'
                }
              ],
              onChange: (e) => {
                if (e.target.value == 3) {
                  this.setState({ isFullCount: false });
                  this.setState({ isisFullCount: false });
                } else if (e.target.value == 2) {
                  this.setState({ isFullCount: true });
                  this.setState({ isisFullCount: false });
                } else {
                  this.setState({ isisFullCount: true });
                }
                this.setState({
                  couponActivityFullTypeKey: e.target.value
                });
                console.log(e.target.value, '5555555');

                store.changeFormField({
                  couponActivityFullType: e.target.value
                });
              },
              initialValue: activity.get('couponActivityFullType')
                ? activity.get('couponActivityFullType')
                : 0
            })(
              <RadioGroup>
                <Radio
                  disabled={
                    id
                      ? activity.get('couponActivityFullType') != 0
                        ? true
                        : false
                      : false
                  }
                  value={0}
                >
                  全买赠
                </Radio>
                <Radio
                  disabled={
                    id
                      ? activity.get('couponActivityFullType') != 1
                        ? true
                        : false
                      : false
                  }
                  value={1}
                >
                  任买赠
                </Radio>
                <Radio
                  disabled={
                    id
                      ? activity.get('couponActivityFullType') != 2
                        ? true
                        : false
                      : false
                  }
                  value={2}
                >
                  满金额赠
                </Radio>
                <Radio
                  disabled={
                    id
                      ? activity.get('couponActivityFullType') != 3
                        ? true
                        : false
                      : false
                  }
                  value={3}
                >
                  满数量赠
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          {isisFullCount && (
            <FormItem {...formItemLayout} label="*是否叠加优惠">
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
                  : 0
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
              <span style={{ color: 'red' }}>
                {couponActivityFullTypeKey == 0
                  ? '*举例：【若选择3件商品，用户购买各2件共6件商品，则赠送两个优惠券】，谨慎开启该选项。'
                  : '*举例：【满1箱赠优惠券，用户买5件，则获得5张优惠券】，谨慎开启该选项。'}
              </span>
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="设置规则" required={true}>
            {getFieldDecorator(
              'coupons',
              {}
            )(
              <ChooseCoupons
                wareId={Number(wareIda)}
                fullGiftLevelList={fullGiftLevelList}
                isFullCount={isFullCount}
                isisFullCount={isisFullCount}
                onChangeBack={(e) => this.onRulesChange(e)}
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  // this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId, index) => {
                  this.Delcoupon(couponId, index);
                  store.onDelCoupon(couponId);
                  // this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount, key) => {
                  this.tocunto(index, totalCount, key);
                  store.changeCouponTotalCount(index, totalCount);
                }}
                type={2}
              />
            )}
            {isisFullCount == false && (
              <React.Fragment>
                <Button
                  style={{ marginTop: '10px' }}
                  onClick={this.addLevels}
                  disabled={fullGiftLevelList.length >= 5}
                >
                  添加多级促销
                </Button>
                &nbsp;&nbsp;最多可设置5级
              </React.Fragment>
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator('coupons', {})(
              <ChooseCoupons
                form={form}
                isisFullCount={isisFullCount}
                wareId={Number(wareIda)}
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
          </FormItem> */}

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
                />
              </div>
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

  tocunto(index, totalCount, keys) {
    const { fullGiftLevelList } = this.state;
    fullGiftLevelList.forEach((element) => {
      // console.log(element.key, 'element.key');

      if (element.key == keys) {
        if (element.fullGiftDetailList[index]) {
          element.fullGiftDetailList[index].totalCount = totalCount;
        }
      }
    });
    // console.log(fullGiftLevelList, 'shuaklsnfsg', index, totalCount, keys);

    this.setState({ fullGiftLevelList });
  }

  Delcoupon(couponId, index) {
    let { fullGiftLevelList } = this.state;
    fullGiftLevelList[index].fullGiftDetailList.forEach((element, indexas) => {
      if (element.couponId == couponId) {
        fullGiftLevelList[index].fullGiftDetailList.splice(indexas, 1);
      }
    });
    this.setState({ fullGiftLevelList });
  }

  onRulesChange(e) {
    const { fullGiftLevelList } = this.state;
    const store = this._store as any;
    console.log(fullGiftLevelList, '/*8984', e);
    store.changeFormField({ fullGiftLevelList: e });
  }

  /**
   * 添加多级促销
   */
  addLevels = () => {
    const { fullGiftLevelList } = this.state;
    if (fullGiftLevelList.length >= 5) return;
    fullGiftLevelList.push({
      key: this.makeRandom(),
      fullAmount: null,
      fullCount: null,
      modalVisible: false,
      giftType: 1,
      fullGiftDetailList: []
    });
    this.setState({ fullGiftLevelList: fullGiftLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

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
    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedSkuIds, selectedRows'
    );
    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
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
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
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
    console.log(id, '22222222222222');
    const { selectedRows } = this.state;
    console.log(selectedRows.toJS(), '66666666666666');
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
    console.log('99999999999999----删除', skuId);
    const { selectedRows, selectedSkuIds } = this.state;

    console.log(
      selectedRows,
      '这是什么',
      selectedSkuIds.findIndex((item) => item == skuId)
    );
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
    // selectedRows.toJS().forEach((item) => {
    //   if (selectedSkuIds.indexOf(item.goodsInfoId) == -1) {
    //     selectedSkuIds.push(item.marketingVO ? item.marketingVO.goodsInfoId : item.goodsInfoId)
    //   }
    // })

    // console.log(
    //   selectedSkuIds,
    //   selectedRows.toJS(),
    //   'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    // );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };
  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const { selectedSkuIds, fullGiftLevelList } = this.state;
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
    if (selectedSkuIds.length >= 1) {
      // activity.set(
      //   'skuIds',
      //   selectedSkuIds
      // );
      store.changeFormField({ skuIds: selectedSkuIds });
    } else {
      message.error('至少添加1个指定商品');
      return false;
    }
    console.log(
      activity.toJS(),
      'selectedSkuIdsselectedSkuIds',
      selectedSkuIds
    );
    const activety = activity.toJS();
    // 2.验证其它表单信息
    this.props.form.validateFields(null, async (errs) => {
      if (!errs && !errors) {
        let paramsExis = null;
        if (activety.activityId) {
          paramsExis = {
            skuIds: selectedSkuIds,
            activityId: activety.activityId
          };
        } else {
          paramsExis = {
            skuIds: selectedSkuIds
          };
        }
        let resal = await webapi.addCouponexists(paramsExis);
        console.log(resal, '14234234234', activity);

        if (resal.res.context.length > 0) {
          this.setState({ skuExists: resal.res.context });
          message.error('您选择的商品与其他活动关联商品重复，请删除后保存。');
          return;
        }
        // 3.验证通过，保存
        await store.save(fullGiftLevelList);
      }
    });
  };
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
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
