import * as React from 'react';
import { fromJS, List } from 'immutable';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Popconfirm,
  notification
} from 'antd';
import { Const, history, QMMethod, util } from 'qmkit';
import moment from 'moment';
import GiftLevels from '../full-gift/components/gift-levels';
import DiscountLevels from '../full-discount/components/discount-levels';
import ReductionLevels from '../full-reduction/components/reduction-levels';
import { GoodsModal, GoodsImportModal } from 'biz';
import SelectedGoodsGrid from './selected-goods-grid';

import * as webapi from '../webapi';
import * as Enum from './marketing-enum';
import { string } from 'prop-types';
import { consoleTestResultHandler } from 'tslint/lib/test';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

export default class MarketingAddForm extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    const relaxProps = props.store.state();
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //营销活动已选的商品信息
      selectedSkuIds: [],
      selectedRows: fromJS([]),
      //全部等级
      customerLevel: [],
      //选择的等级
      selectedLevelIds: [],
      //营销实体
      marketingBean: relaxProps.get('marketingBean'),
      type: relaxProps.get('type'),
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //满金额还是满数量还是订单满赠 （4：满金额，5：满数量，6：满订单，7:满订单减，8:满订单折）
      isFullCount: null,
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      saveLoading: false,
      importmodalVisible: false
    };
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const { marketingType, form, marketingId, fztype } = this.props;

    const { getFieldDecorator } = form;

    const {
      customerLevel,
      selectedRows,
      marketingBean,
      level,
      isFullCount,
      skuExists,
      saveLoading
    } = this.state;
    console.log(marketingBean.toJS(), '123123999');
    const isShowOverlap =
      (Enum.GET_MARKETING_STRING(marketingType) == '减' && isFullCount != 2) ||
      (Enum.GET_MARKETING_STRING(marketingType) == '赠' && isFullCount != 2);
    const wareHouseVOPage = JSON.parse(localStorage.getItem('warePage')) || [];
    return (
      <Form
        onSubmit={(e) => this.handleSubmit(e, isShowOverlap)}
        style={{ marginTop: 20 }}
      >
        <FormItem {...smallformItemLayout} label="活动促销名称">
          {getFieldDecorator('marketingName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请填写活动促销名称'
              },
              { min: 1, max: 40, message: '1-40字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(
                    rule,
                    value,
                    callback,
                    '活动促销名称'
                  );
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(
            <Input
              placeholder="请填写活动促销名称，不超过40字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date())
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix() > value[0].unix()
                  ) {
                    // console.log(value[0], '22222');
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                this.onBeanChange({
                  beginTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },
            initialValue: marketingBean.get('beginTime') &&
              marketingBean.get('endTime') && [
                moment(marketingBean.get('beginTime')),
                moment(marketingBean.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format={Const.DATE_FORMAT}
              placeholder={['起始时间', '结束时间']}
              showTime={{ format: 'HH:mm' }}
            />
          )}
        </FormItem>
        {isFullCount != null && (
          <FormItem
            {...formItemLayout}
            label={`满${Enum.GET_MARKETING_STRING(marketingType)}类型`}
          >
            {getFieldDecorator('subType', {
              rules: [
                {
                  required: true,
                  message: `满${Enum.GET_MARKETING_STRING(marketingType)}类型`
                }
              ],
              initialValue: isFullCount
            })(
              <RadioGroup
                onChange={(e) => this.subTypeChange(marketingType, e)}
              >
                <Radio value={1}>
                  满数量{Enum.GET_MARKETING_STRING(marketingType)}
                </Radio>
                <Radio value={0}>
                  满金额{Enum.GET_MARKETING_STRING(marketingType)}
                </Radio>
                {/* <Radio value={2}>
                  订单满{Enum.GET_MARKETING_STRING(marketingType)}
                </Radio> */}
              </RadioGroup>
            )}
          </FormItem>
        )}
        {isFullCount != null && isShowOverlap && (
          <FormItem {...formItemLayout} label="是否叠加优惠">
            {getFieldDecorator('isOverlap', {
              rules: [
                {
                  required: true,
                  message: '是否叠加优惠'
                }
              ],
              initialValue: marketingBean.get('isOverlap')
                ? marketingBean.get('isOverlap')
                : 0
            })(
              <RadioGroup
                onChange={(e) => {
                  this.onBeanChange({ isOverlap: e.target.value });
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
        )}
        {isFullCount != null && (
          <FormItem {...formItemLayout} label="是否可跨单品">
            {getFieldDecorator('isAddMarketingName', {
              // rules: [
              //   {
              //     required: true,
              //     message: '是否叠加优惠'
              //   }
              // ],
              initialValue: marketingBean.get('isAddMarketingName')
                ? marketingBean.get('isAddMarketingName')
                : 0
            })(
              <RadioGroup
                onChange={(e) =>
                  this.onBeanChange({ isAddMarketingName: e.target.value })
                }
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
        )}
        {/* 商家入驻需求 此处需隐藏并设置disable 默认值 -1（通用） */}
        <FormItem
          style={{ display: 'none' }}
          {...formItemLayout}
          required={true}
          label="适用区域"
        >
          <Col span={10}>
            {getFieldDecorator('wareId', {
              initialValue: marketingBean.get('wareId') + '',
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
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                // mode="multiple"
                placeholder="请选择适用区域"
                disabled
                onChange={(value) => {
                  this.onBeanChange({ wareId: value });

                  if (fztype && fztype == 1) {
                    this.changeWareId(value);
                  }
                  if (value != marketingBean.get('wareId')) {
                    this.changeNull();
                    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
                      let { marketingBean } = this.state;
                      const datamar = this.state.marketingBean.toJS();
                      console.log(666666);
                      // setTimeout(() => {
                      //   this.onBeanChange({
                      //     fullGiftLevelList: [
                      //       {
                      //         fullAmount: null,
                      //         fullCount: null,
                      //         fullGiftDetailList: [],
                      //         giftType: datamar.fullGiftLevelList[0].giftType,
                      //         key: datamar.fullGiftLevelList[0].key
                      //       }
                      //     ]
                      //   });
                      // });
                    }
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
        {isFullCount != null && (
          <FormItem {...formItemLayout} label="设置规则" required={true}>
            {marketingType == Enum.MARKETING_TYPE.FULL_GIFT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <GiftLevels
                  form={this.props.form}
                  wareId={Number(marketingBean.get('wareId'))}
                  fztype={fztype}
                  selectedRows={this.makeSelectedRows(null)}
                  fullGiftLevelList={
                    marketingBean.get('fullGiftLevelList') &&
                    marketingBean.get('fullGiftLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isOverlap={marketingBean.get('isOverlap')}
                  isFullCount={isFullCount}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <DiscountLevels
                  form={this.props.form}
                  fullDiscountLevelList={
                    marketingBean.get('fullDiscountLevelList') &&
                    marketingBean.get('fullDiscountLevelList').toJS()
                  }
                  // isOverlap={marketingBean.get('isOverlap')}
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <ReductionLevels
                  form={this.props.form}
                  fullReductionLevelList={
                    marketingBean.get('fullReductionLevelList') &&
                    marketingBean.get('fullReductionLevelList').toJS()
                  }
                  isOverlap={marketingBean.get('isOverlap')}
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
          </FormItem>
        )}
        {isFullCount !== 2 && (
          <FormItem {...formItemLayout} label="选择商品" required={true}>
            {getFieldDecorator(
              'goods',
              {}
            )(
              <div>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.openGoodsModal}
                >
                  添加商品
                </Button>
                &nbsp;&nbsp;
                {/* 商家入驻需求 第三方商家隐藏导入 */}
                {!util.isThirdStore() && (
                  <React.Fragment>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          importmodalVisible: true
                        });
                      }}
                    >
                      导入
                    </Button>
                    &nbsp;&nbsp;
                  </React.Fragment>
                )}
                <Popconfirm
                  title="确认后商品列表则全部清空，
                  不可恢复请谨慎操作"
                  // onCancel={() => {
                  //   if (isOnclick == 'auto') {
                  //     isOnclick = 'none';
                  //   }
                  //   this._renderConfirmMenu(id, activityType,orderCode);
                  // }}
                  onConfirm={() => {
                    // this._showConfirm(id, orderCode, activityType);
                    this.changeNull();
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                  // type="primary"
                  // icon="plus"
                  >
                    全部清空
                  </Button>
                </Popconfirm>
                &nbsp;&nbsp;
                <SelectedGoodsGrid
                  selectedRows={selectedRows}
                  skuExists={skuExists}
                  deleteSelectedSku={this.deleteSelectedSku}
                  cheBOx={this.cheBOx}
                  marketingType={marketingType}
                  purChange={this.purChange}
                />
              </div>
            )}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="目标客户" required={true}>
          {getFieldDecorator('targetCustomer', {
            // rules: [{required: true, message: '请选择目标客户'}],
          })(
            <div>
              <RadioGroup
                onChange={(e) => {
                  this.levelRadioChange(e.target.value);
                }}
                value={level._allCustomer ? -1 : 0}
              >
                <Radio value={-1}>全平台客户</Radio>
                {/* 商家入驻需求 隐藏店铺内客户选项 */}
                {/* {util.isThirdStore() && <Radio value={0}>店铺内客户</Radio>} */}
              </RadioGroup>
              {level._levelPropsShow && (
                <div>
                  <Checkbox
                    indeterminate={level._indeterminate}
                    onChange={(e) => this.allLevelChecked(e.target.checked)}
                    checked={level._checkAll}
                  >
                    全部等级
                  </Checkbox>
                  <CheckboxGroup
                    options={this.renderCheckboxOptions(customerLevel)}
                    onChange={this.levelGroupChange}
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
            <Button type="primary" htmlType="submit" loading={saveLoading}>
              {marketingBean.get('marketingId') &&
              marketingBean.get('isDraft') &&
              this.state.type != 1
                ? '发布'
                : '保存'}
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.go(-1)}>返回</Button>
            &nbsp;&nbsp;
            {this.state.type == 1 ||
            !marketingBean.get('marketingId') ||
            marketingBean.get('isDraft') ? (
              <Button
                type="primary"
                htmlType="button"
                loading={saveLoading}
                onClick={(e) => {
                  this.handleSubmit(e, isShowOverlap, 1);
                }}
              >
                {this.state.type != 1 && marketingBean.get('marketingId')
                  ? '编辑'
                  : '存为'}
                草稿
              </Button>
            ) : null}
          </Col>
        </Row>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          marketingId={marketingId}
          //商家入驻需求 wareId传''
          // wareId={Number(marketingBean.get('wareId'))}
          wareId=""
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
          needHide
          showThirdColumn={util.isThirdStore()}
        />
        <GoodsImportModal
          visible={this.state.importmodalVisible}
          onOkFun={this.importOnOk}
          wareId={Number(marketingBean.get('wareId'))}
          onCancelBackFun={() => {
            this.setState({
              importmodalVisible: false
            });
          }}
        />
      </Form>
    );
  }
  // 复制活动，切换仓库
  changeWareId = async (value) => {
    const { marketingBean } = this.state;
    const { marketingType, fztype } = this.props;
    const giftLevelList = this.props.store.state().get('giftLevelList');
    // console.log(marketingBean.toJS(), value, 'marketingId,value', marketingType);
    let datas = {
      marketingId: marketingBean.get('marketingId'),
      wareId: value
    };
    let response;
    let resgif;
    if (marketingType != 2) {
      response = await webapi.udtalGoods(datas);
    } else {
      resgif = await webapi.udtalgifGoods(datas);
      // const datamar = marketingBean.toJS();
      if (resgif.res.code != Const.SUCCESS_CODE) {
        message.error(resgif.res.message);
      } else {
        let skuid = [];
        if (resgif.res.context.goodsInfoPage?.content.length > 0) {
          resgif.res.context.goodsInfoPage.content.forEach((e) => {
            marketingBean
              .get('goodsList')
              .get('goodsInfoPage')
              .get('content')
              .toJS()
              .forEach((item) => {
                if (item.parentGoodsInfoId == e.parentGoodsInfoId) {
                  skuid.push({
                    productId: e.goodsInfoId,
                    parentGoodsInfoId: e.parentGoodsInfoId,
                    oid: item.goodsInfoId,
                    productNum: 1,
                    boundsNum: null
                  });
                }
              });
          });
          await this.onBeanChange({ goodsList: resgif.res.context });
          let list = giftLevelList.toJS().map((element) => {
            let lists = skuid.filter((item) =>
              element.fullGiftDetailList.some(
                (item1) => item1.productId == item.oid
              )
            );
            return { ...element, fullGiftDetailList: lists };
          });
          await this.onBeanChange({ fullGiftLevelList: list });
        } else {
          let list = giftLevelList.toJS().map((element) => {
            return { ...element, fullGiftDetailList: [] };
          });
          await this.onBeanChange({ fullGiftLevelList: list });
        }
      }
      response = await webapi.udtalGoods(datas);
    }

    if (response.res.code != Const.SUCCESS_CODE) {
      message.error(response.res.message);
    } else {
      const listaa = fromJS(response.res.context.goodsInfoPage?.content || []);
      const skuid = response.res.context.goodsInfoPage?.content.map(
        (value) => value.goodsInfoId
      );
      setTimeout(() => {
        this.setState({
          selectedSkuIds: skuid,
          selectedRows: listaa,
          goodsModal: {
            // _modalVisible: false,
            _selectedSkuIds: skuid,
            _selectedRows: listaa
          }
        });
      });
    }
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
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.setState({ customerLevel: levelList });

    let { marketingBean } = this.state;
    const subType = marketingBean.get('subType');
    // console.info('================ subType: ' + subType + ' ============= ');
    if (subType != undefined && subType != null) {
      this.setState({
        isFullCount:
          subType == 6 || subType == 7 || subType == 8 ? 2 : subType % 2
      });
    } else {
      this.setState({ isFullCount: 0 });
    }
    this.levelInit(marketingBean.get('joinLevel'));
    // render selectedRows
    const scopeArray = marketingBean.get('marketingScopeList');
    if (scopeArray && !scopeArray.isEmpty()) {
      const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
      this.setState({
        selectedRows: this.makeSelectedRows(scopeIds),
        selectedSkuIds: scopeIds.toJS()
      });
    }
    // this.setState({
    //   marketingBean: this.state.marketingBean.set('isOverlap', 1)
    // });
    // this.setState({
    //   marketingBean: this.state.marketingBean.set('isAddMarketingName', 0)
    // });
  };

  importOnOk = async (selectedSkuIds, selectedRows) => {
    selectedSkuIds = [...new Set(selectedSkuIds.toJS())];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    if (selectedSkuIds.length > 0) {
      this.props.form.resetFields('goods');
      const map = new Map();
      let list = [
        ...this.state.selectedRows.toJS(),
        ...selectedRows.toJS()
      ].filter(
        (item) => !map.has(item.goodsInfoId) && map.set(item.goodsInfoId, item)
      );
      this.setState({
        selectedSkuIds: [
          ...new Set([...this.state.selectedSkuIds, ...selectedSkuIds])
        ],
        selectedRows: fromJS(list),
        importmodalVisible: false
      });
    } else {
      this.setState({
        importmodalVisible: false
      });
    }
  };

  /**
   * 等级初始化
   * @param joinLevel
   */
  levelInit = (joinLevel) => {
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
        this.allLevelChecked(true);
      } else if (+joinLevel === -1) {
        //全平台客户
        this.levelRadioChange(-1);
      } else {
        //勾选某些等级
        this.levelGroupChange(joinLevel.split(','));
      }
    }
  };
  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType1 = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.REDUCTION_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.REDUCTION_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.REDUCTION_FULL_ORDER;
    }
  };
  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType2 = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_ORDER;
    }
  };
  draftBut = (e) => {
    const { form } = this.props;
  };

  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e, isShowOverlap, isType?) => {
    e.preventDefault();
    const { marketingType, form } = this.props;
    let {
      marketingBean,
      level,
      isFullCount,
      selectedSkuIds,
      selectedRows
    } = this.state;
    marketingBean = marketingBean.set('wareId', marketingBean.get('wareId'));

    let bundleSalesSkuIds = List();
    selectedRows.toJS().forEach((item, index) => {
      //为下面的多级条件校验加入因子
      // if(marketingType == Enum.MARKETING_TYPE.FULL_GIFT){

      // }
      bundleSalesSkuIds = bundleSalesSkuIds.push(
        fromJS({
          skuIds: item.goodsInfoId,
          whetherChoice: item.checked ? 1 : 0,
          purchaseNum:
            item.purchaseNum && Number(item.purchaseNum) > 0
              ? item.purchaseNum
              : null,
          perUserPurchaseNum:
            item.perUserPurchaseNum && Number(item.perUserPurchaseNum) > 0
              ? item.perUserPurchaseNum
              : null
        })
      );
    });

    let list = bundleSalesSkuIds
      .toJS()
      .filter(
        (item: any) =>
          Number(item.perUserPurchaseNum) > Number(item.purchaseNum) ||
          Number(item.perUserPurchaseNum) > 99999 ||
          Number(item.purchaseNum) > 99999
      );
    if (list.length) {
      message.error(
        '单用户限购量不能大于总限购量且数据单用户限购量或总限购量不能大于99999，请检查'
      );
      return;
    }

    const numbezzs = /^[1-9]\d*$/;
    let lists = bundleSalesSkuIds
      .toJS()
      .filter(
        (item: any) =>
          !numbezzs.test(item.purchaseNum || '1') ||
          !numbezzs.test(item.perUserPurchaseNum || '1')
      );
    if (lists.length) {
      message.error('单用户限购量和总限购量不能为小数，请检查');
      return;
    }

    // console.info(bundleSalesSkuIds.toJS());
    const bundle = [];
    bundleSalesSkuIds.toJS().forEach((element) => {
      if (element.whetherChoice) {
        bundle.push(element.whetherChoice);
      }
    });
    // for(let a in bundleSalesSkuIds.toJS()){

    // }
    // return
    if (bundle.length > 5) {
      message.error('必选商品最多可选5个。');
      return;
    }
    let levelList = fromJS([]);
    let errorObject = {};

    form.resetFields();
    let FilterisFullCount;
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelList = marketingBean.get('fullReductionLevelList');
      FilterisFullCount = this.setSubType1(isFullCount);
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelList = marketingBean.get('fullDiscountLevelList');
      FilterisFullCount = this.setSubType2(isFullCount);
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelList = marketingBean.get('fullGiftLevelList');
      FilterisFullCount = this.setSubType(isFullCount);
    }

    //判断设置规则
    marketingBean = marketingBean.set('subType', FilterisFullCount);
    if (!levelList || levelList.isEmpty()) {
      errorObject['rules'] = {
        value: null,
        errors: [new Error('请设置规则')]
      };
    } else {
      let ruleArray = List();

      if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          if (!isFullCount && +level.fullAmount <= +level.reduction) {
            errorObject[`level_rule_value_${index}`] = {
              errors: [new Error('条件金额必须大于减免金额')]
            };
            errorObject[`level_rule_reduction_${index}`] = {
              errors: [new Error('减免金额必须小于条件金额')]
            };
          }
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
        //满赠规则具体内容校验
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          //校验赠品是否为空
          if (
            !level.fullGiftDetailList ||
            level.fullGiftDetailList.length == 0
          ) {
            errorObject[`level_${index}`] = {
              value: null,
              errors: [new Error('满赠赠品不能为空')]
            };
          }
        });
      }
      //校验多级促销条件是否相同
      ruleArray
        .groupBy((item) => +(item as any).get('value'))
        .filter((value) => value.size > 1)
        .forEach((item) => {
          item.forEach((level) => {
            errorObject[`level_rule_value_${(level as any).get('index')}`] = {
              errors: [new Error('多级促销条件不可相同')]
            };
          });
        });
    }

    //判断目标等级
    if (level._allCustomer) {
      marketingBean = marketingBean.set('joinLevel', -1);
    } else {
      if (level._checkAll) {
        marketingBean = marketingBean.set('joinLevel', 0);
      } else {
        if (level._checkedLevelList.length != 0) {
          marketingBean = marketingBean.set(
            'joinLevel',
            level._checkedLevelList.join(',')
          );
        } else {
          errorObject['targetCustomer'] = {
            errors: [new Error('请选择目标客户')]
          };
        }
      }
    }

    //判断选择商品
    if (isFullCount !== 2) {
      if (selectedSkuIds.length > 0) {
        marketingBean = marketingBean.set('skuIds', fromJS(selectedSkuIds));
      } else {
        errorObject['goods'] = {
          value: null,
          errors: [new Error('请选择参加营销的商品')]
        };
      }
    }
    form.validateFieldsAndScroll((err) => {
      if (Object.keys(errorObject).length != 0) {
        form.setFields(errorObject);
        this.setState({ saveLoading: false });
      } else {
        if (!err) {
          this.setState({ saveLoading: true });
          //组装营销类型
          marketingBean = marketingBean
            .set('marketingType', marketingType)
            .set('scopeType', isFullCount == 2 ? 0 : 1)
            .set('bundleSalesSkuIds', bundleSalesSkuIds);
          //商品已经选择 + 时间已经选择 => 判断  同类型的营销活动下，商品是否重复
          if (marketingBean.get('beginTime') && marketingBean.get('endTime')) {
            webapi
              .skuExists({
                skuIds: selectedSkuIds,
                bundleSalesSkuIds: bundleSalesSkuIds,
                marketingType,
                startTime: marketingBean.get('beginTime'),
                endTime: marketingBean.get('endTime'),
                excludeId: marketingBean.get('marketingId'),
                marketingSubType: FilterisFullCount,
                isOverlap: isShowOverlap ? marketingBean.get('isOverlap') : 0,
                isAddMarketingName: marketingBean.get('isAddMarketingName')
              })
              .then(({ res }) => {
                if (res.code == Const.SUCCESS_CODE) {
                  if (res.context.length > 0) {
                    if (res.context.length == 1 && res.context[0] == 'all') {
                      this.setState({ skuExists: res.context });
                      message.error(
                        '订单满减、订单满折、订单满赠不可在同一时间存在'
                      );
                      this.setState({ saveLoading: false });
                    } else {
                      this.setState({ skuExists: res.context });
                      const errArr = [];
                      selectedRows.toJS().forEach((item) => {
                        if (res.context.includes(item.goodsInfoId)) {
                          errArr.push(item.goodsInfoName);
                        }
                      });
                      message.error(
                        <div>
                          <p>{`${res.context.length}款商品活动时间冲突，请删除后再保存`}</p>
                          {errArr.map((item) => (
                            <p>{item}</p>
                          ))}
                        </div>,
                        4
                      );
                      // message.error(
                      //   `${res.context.length}款商品活动时间冲突，请删除后再保存`
                      // );
                      this.setState({ saveLoading: false });
                    }
                  } else {
                    //草稿处理
                    if (isType == 1) {
                      this.draftSubmit(marketingBean, isShowOverlap, isType);
                      return;
                    }
                    marketingBean = marketingBean.set(
                      'isOverlap',
                      isShowOverlap ? marketingBean.get('isOverlap') : 0
                    );
                    marketingBean = marketingBean.set(
                      'isAddMarketingName',
                      marketingBean.get('isAddMarketingName')
                    );

                    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
                      // console.log(marketingBean.toJS(), '提交满赠');
                      this.props.store
                        .submitFullGift(marketingBean.toJS(), isType)
                        .then((res) => this._responseThen(res));
                    } else if (
                      marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT
                    ) {
                      marketingBean = marketingBean.set(
                        'fullDiscountLevelList',
                        marketingBean
                          .get('fullDiscountLevelList')
                          .map((item) =>
                            item.set('discount', item.get('discount') / 10)
                          )
                      );
                      this.props.store
                        .submitFullDiscount(marketingBean.toJS(), isType)
                        .then((res) => this._responseThen(res));
                    } else {
                      this.props.store
                        .submitFullReduction(marketingBean.toJS(), isType)
                        .then((res) => this._responseThen(res));
                    }
                  }
                } else {
                  message.error(res.message);
                  this.setState({ saveLoading: false });
                }
              });
          }
        }
      }
    });
  };

  /**
   * 草稿提交方法
   * @param e
   */
  draftSubmit = (marketingBean, isShowOverlap, isType?) => {
    const { marketingType, form } = this.props;
    marketingBean = marketingBean.set(
      'isOverlap',
      isShowOverlap ? marketingBean.get('isOverlap') : 0
    );
    marketingBean = marketingBean.set(
      'isAddMarketingName',
      marketingBean.get('isAddMarketingName')
    );

    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      this.props.store
        .onDraftFullGift(marketingBean.toJS(), isType)
        .then((res) => {
          if (res.res.code == Const.SUCCESS_CODE) {
            this._responseThen(res, isType);
          } else {
            message.error(res.res.message);
            this.setState({ saveLoading: false });
          }
        });
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      marketingBean = marketingBean.set(
        'fullDiscountLevelList',
        marketingBean
          .get('fullDiscountLevelList')
          .map((item) => item.set('discount', item.get('discount') / 10))
      );
      this.props.store
        .onDraftFullDiscount(marketingBean.toJS(), isType)
        .then((res) => {
          if (res.res.code == Const.SUCCESS_CODE) {
            this._responseThen(res, isType);
          } else {
            message.error(res.res.message);
            this.setState({ saveLoading: false });
          }
        });
    } else {
      this.props.store
        .onDraftFullReduction(marketingBean.toJS(), isType)
        .then((res) => {
          if (res.res.code == Const.SUCCESS_CODE) {
            this._responseThen(res, isType);
          } else {
            message.error(res.res.message);
            this.setState({ saveLoading: false });
          }
        });
    }
  };

  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.GIFT_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.GIFT_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.GIFT_FULL_ORDER;
    }
  };

  /**
   * 满系类型改变
   * @param marketingType
   * @param e
   */
  subTypeChange = (marketingType, e) => {
    const _thisRef = this;
    let levelType = '';
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelType = 'fullReductionLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelType = 'fullDiscountLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelType = 'fullGiftLevelList';
    }
    const { marketingBean, isFullCount } = this.state;
    if (levelType == '' || !marketingBean.get(levelType)) return;
    if (marketingBean.get(levelType).size > 0) {
      Confirm({
        title: '切换类型',
        content: '切换类型会清空已经设置的规则，是否继续？',
        onOk() {
          for (let i = 0; i < marketingBean.get(levelType).size; i++) {
            _thisRef.props.form.resetFields(`level_${i}`);
          }
          let beanObject = {
            [levelType]: fromJS([]),
            subType: marketingType * 2 + e.target.value
          };
          _thisRef.onBeanChange(beanObject);
          _thisRef.setState({ isFullCount: e.target.value });

          // _thisRef.setState({
          //   isFullCount: marketingType * 2 + e.target.value
          // });
        },
        onCancel() {
          _thisRef.props.form.setFieldsValue({ subType: isFullCount });
        }
      });
    }
  };

  /**
   * 勾选全部等级
   * @param checked
   */
  allLevelChecked = (checked) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
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
  levelRadioChange = (value) => {
    this.props.form.resetFields('targetCustomer');
    let { level, customerLevel } = this.state;
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
  levelGroupChange = (checkedList) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
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

  /**
   * 规则变化方法
   * @param rules
   */
  onRulesChange = (rules) => {
    // console.log(rules, 'rulesrules');

    const { marketingType } = this.props;
    this.props.form.resetFields('rules');
    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      this.onBeanChange({ fullGiftLevelList: rules });
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      this.onBeanChange({ fullDiscountLevelList: rules });
    } else {
      this.onBeanChange({ fullReductionLevelList: rules });
    }
  };

  /**
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    setTimeout(() => {
      this.setState({ marketingBean: this.state.marketingBean.merge(params) });
      console.log(
        this.state.marketingBean.toJS(),
        'marketingBeanmarketingBean'
      );
    });
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
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

  // arrayRemoveArray(Arr, cut) {
  //   let newArr = []
  //   for (let a of Arr) {
  //     if (!cut.includes(a)) {
  //       newArr.push(a)
  //     }
  //   }
  //   return newArr
  // };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    console.log(
      selectedRows,
      selectedSkuIds,
      'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
  renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    const { marketingBean } = this.state;
    const goodsList = marketingBean.get('goodsList');
    if (goodsList) {
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('goodsInfoPage')
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('goodsInfoId')));
      } else {
        selectedRows = goodsList.get('goodsInfoPage').get('content');
      }
      console.log(
        goodsList.toJS(),
        'selectedRowsselectedRows123',
        selectedRows.toJS()
      );

      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          const cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(goodsList.get('cates') || []).find(
            (s) => s.get('cateId') === cId
          );
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find(
            (s) => s.get('brandId') === bId
          );
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          goodInfo.perUserPurchaseNum =
            String(
              marketingBean
                .get('marketingScopeList')
                .toJS()
                .filter((item) => item.scopeId == goodInfo.goodsInfoId)[0]
                ?.perUserPurchaseNum
            ) || null;
          return JSON.parse(JSON.stringify(goodInfo));
        })
      );
    } else {
      return fromJS([]);
    }
  };

  purChange = (value, id, key = 'purchaseNum') => {
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e[key] = value;
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
   * 处理返回结果
   * @param response
   * @private
   */
  _responseThen = (response, isType?) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.push('/marketing-list');
    } else {
      message.error(response.res.message);
    }
    if (!isType) this.setState({ saveLoading: false });
  };
}
