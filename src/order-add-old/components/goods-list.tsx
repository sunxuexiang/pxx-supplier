import React from 'react';
import { IMap, Relax } from 'plume2';
import { IList } from 'typings/globalType';
import {
  Button,
  Checkbox,
  InputNumber,
  Modal,
  Table,
  message,
  Form,
  Input,
  Select,
  Popover
} from 'antd';
import GoodsAdd from './goods-add';
import { fromJS } from 'immutable';
import { noop, ValidConst, QMFloat, QMMethod } from 'qmkit';
import GiftList from './gift-list';
import './goods-list-style.css';
// import UUID from 'uuid-js';

import styled from 'styled-components';
const TableSet = styled.div`
  @media screen and (max-width: 1440px) {
    .ant-select {
      max-width: 220px;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1680px) {
    .ant-select {
      max-width: 320px;
    }
  }
  @media screen and (min-width: 1680px) {
    .ant-select {
      max-width: 400px;
    }
  }
`;

const FormItem = Form.Item;
const Column = Table.Column;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 14 }
  },
  wrapperCol: {
    span: 22,
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    form?: any;
    edit?: boolean;
    relaxProps?: {
      goodsList: IMap;
      oldSkuIds: IList;
      newSkuIds: IList;
      oldBuyCount: IList;
      giftMarketings: IList;
      goodsIntervalPrices: IList;
      totalMoney: string;
      payTotal: string;
      discountPrice: string;
      reductionPrice: string;
      oldTradePrice: IMap;

      onChangeSpecVal: Function;
      onEnableSpecVal: Function;
      onSelectGoodList: Function;
      onDeleteSelectedGoodsList: Function;
      onEnableDeliverFee: Function;
      onChangeDeliverFee: Function;
      onChangeBuyCount: Function;
      setGiftMarketings: Function;
      onChangeMarketing: Function;
      onDelGift: Function;
      onExtraInfoChange: Function;
      onCreateOrder: Function;
      saveNewSkuIds: Function;
    };
    //当前选中的会员
    selectedCustomerId: string;
  };

  static relaxProps = {
    goodsList: 'goodsList',
    oldSkuIds: 'oldSkuIds',
    newSkuIds: 'newSkuIds',
    oldBuyCount: 'oldBuyCount',
    giftMarketings: 'giftMarketings',
    goodsIntervalPrices: ['goodsList', 'goodsIntervalPrices'],
    totalMoney: ['goodsList', 'totalMoney'],
    payTotal: ['goodsList', 'payTotal'],
    discountPrice: 'discountPrice',
    reductionPrice: 'reductionPrice',
    oldTradePrice: 'oldTradePrice',

    onChangeSpecVal: noop,
    onEnableSpecVal: noop,
    onSelectGoodList: noop,
    onDeleteSelectedGoodsList: noop,
    onEnableDeliverFee: noop,
    onChangeDeliverFee: noop,
    onChangeBuyCount: noop,
    setGiftMarketings: noop,
    onChangeMarketing: noop,
    onDelGift: noop,
    onSelectAddress: noop,
    onDeleteAddress: noop,
    saveNewSkuIds: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      //显示添加商品
      addAddressVisible: false,
      //选中的商品Ids
      selectedKeys: fromJS([]),
      //选中的商品信息
      selectedRows: fromJS([])
    };
  }

  static defaultProps = {
    selectedCustomerId: '',
    edit: false
  };

  /**
   * 开启/禁用 特价选择
   * @private
   */
  _enableSpecVal(checked: boolean) {
    const { onEnableSpecVal } = this.props.relaxProps;
    this.props.form.resetFields(['specVal']);
    onEnableSpecVal(checked);
    // this.setState({});
  }

  /**
   * 开启/禁用 运费选择
   * @private
   */
  _enableDeliverFee(checked: boolean) {
    const { onEnableDeliverFee } = this.props.relaxProps;
    this.props.form.resetFields(['deliverFee']);
    onEnableDeliverFee(checked);
    this.setState({});
  }

  componentWillReceiveProps(nextProps: any) {
    // 如果customerId被清空,则清空下面的值
    if (
      !nextProps.selectedCustomerId ||
      this.props.selectedCustomerId != nextProps.selectedCustomerId
    ) {
      this.setState({
        //显示添加商品
        addAddressVisible: false,
        //选中的商品Ids
        selectedKeys: fromJS([]),
        //选中的商品信息
        selectedRows: fromJS([])
      });
      this.props.form.resetFields();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { selectedCustomerId } = this.props;

    const {
      goodsList,
      oldSkuIds,
      newSkuIds,
      oldBuyCount,
      giftMarketings,
      discountPrice,
      reductionPrice,
      totalMoney,
      payTotal,
      oldTradePrice,

      onSelectGoodList,
      onChangeSpecVal,
      onChangeDeliverFee,
      onChangeBuyCount,
      onChangeMarketing,
      saveNewSkuIds
    } = this.props.relaxProps;
    let dataSource = goodsList.get('dataSource').toJS();
    // 已选赠品列表，会与商品列表合并后放入Table
    let giftDataSource = goodsList.get('giftDataSource').toJS();
    dataSource.forEach((val) => (val.key = val.goodsInfoId));

    const deliverFee = this._deliverFee();

    return (
      <TableSet>
        <Button
          style={{ marginBottom: 10 }}
          type="primary"
          onClick={() => {
            if (!selectedCustomerId) {
              message.error('请选择会员');
              return;
            }

            this.setState({
              addAddressVisible: true
            });
          }}
        >
          新增商品
        </Button>
        <FormItem>
          {getFieldDecorator('goodsChoose', {
            initialValue:
              dataSource && fromJS(dataSource).count() > 0
                ? fromJS(dataSource).count()
                : '',
            rules: [
              {
                required: selectedCustomerId ? true : false,
                message: '必须选择一个商品'
              }
            ]
          })(<input type="hidden" />)}
        </FormItem>
        <Table
          bordered
          rowKey={(record: any) => {
            if (record.gift) {
              return 'gift_' + record.goodsInfoId;
            }
            return 'row_' + record.goodsInfoId;
          }}
          dataSource={dataSource.concat(giftDataSource)}
          pagination={false}
        >
          <Column
            title="序号"
            key="index"
            width="61px"
            render={(_text, _record, index) => <span>{index + 1}</span>}
          />

          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            width="140px"
            key="goodsInfoNo"
          />

          <Column
            width="20%"
            title="商品名称"
            key="goodsInfoName"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return '【赠品】' + rowInfo.goodsInfoName;
              }
              return rowInfo.goodsInfoName;
            }}
          />
          <Column
            title="规格"
            width="10%"
            key="goodsSpecs"
            render={(rowInfo) => rowInfo.specText}
          />
          <Column
            title="促销"
            key="marketing"
            render={(rowInfo) => {
              if (rowInfo.gift) return '-';
              if (rowInfo.marketings == undefined) return '-';
              else
                return (
                  <Select
                    defaultValue={rowInfo.marketingId}
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    onChange={(val) => {
                      onChangeMarketing(rowInfo.goodsInfoId, val);
                    }}
                  >
                    {rowInfo.marketings.map((marketing) => {
                      // 根据促销等级信息，构建促销的展示信息
                      let marketingInfo = '';
                      switch (marketing.subType) {
                        case 0: //满金额减
                          marketingInfo = `满减：${marketing.fullReductionLevelList
                            .reduce(
                              (a, b) =>
                                `${a}，满${b.fullAmount}减${b.reduction}`,
                              ''
                            )
                            .substr(1)}`;
                          break;
                        case 1: //满数量减
                          marketingInfo = `满减：${marketing.fullReductionLevelList
                            .reduce(
                              (a, b) =>
                                `${a}，满${b.fullCount}件减${b.reduction}`,
                              ''
                            )
                            .substr(1)}`;
                          break;
                        case 2: //满金额折
                          marketingInfo = `满折：${marketing.fullDiscountLevelList
                            .reduce(
                              (a, b) =>
                                `${a}，满${b.fullAmount}享${parseFloat(
                                  (b.discount * 10).toFixed(5)
                                )}折`,
                              ''
                            )
                            .substr(1)}`;
                          break;
                        case 3: //满数量折
                          marketingInfo = `满折：${marketing.fullDiscountLevelList
                            .reduce(
                              (a, b) =>
                                `${a}，满${b.fullCount}件享${parseFloat(
                                  (b.discount * 10).toFixed(5)
                                )}折`,
                              ''
                            )
                            .substr(1)}`;
                          break;
                        case 4: //满金额赠
                          marketingInfo = `满赠：满${marketing.fullGiftLevelList
                            .reduce((a, b) => `${a}，${b.fullAmount}`, '')
                            .substr(1)}元获赠品，赠完为止`;
                          break;
                        case 5: //满数量赠
                          marketingInfo = `满赠：满${marketing.fullGiftLevelList
                            .reduce((a, b) => `${a}，${b.fullCount}`, '')
                            .substr(1)}件获赠品，赠完为止`;
                          break;
                      }
                      return (
                        <Option
                          title={marketingInfo}
                          key={marketing.marketingId}
                          value={marketing.marketingId}
                        >
                          {marketingInfo}
                        </Option>
                      );
                    })}
                  </Select>
                );
            }}
          />
          <Column
            title="会员价"
            width="110px"
            key="salePrice"
            render={(rowInfo) => {
              if (rowInfo.gift) return '￥0.00';
              const goodsIntervalPrices = this.props.relaxProps
                .goodsIntervalPrices;
              let price = '￥' + rowInfo.salePrice.toFixed(2);
              if (rowInfo.priceType === 1) {
                const buyCount = rowInfo.buyCount;
                if (buyCount == 0) {
                  const minPrice = rowInfo.intervalMinPrice;
                  const maxPrice = rowInfo.intervalMaxPrice;
                  price =
                    '￥' +
                    minPrice.toFixed(2) +
                    '-' +
                    '￥' +
                    maxPrice.toFixed(2);
                } else {
                  const prices = fromJS(rowInfo.intervalPriceIds || [])
                    .map((id) =>
                      goodsIntervalPrices
                        .filter((price) => price.get('intervalPriceId') == id)
                        .first()
                    )
                    .filter((f) => f && f.get('count') <= buyCount)
                    .maxBy((f) => f.get('count'));
                  if (prices) {
                    price = '￥' + prices.get('price').toFixed(2);
                  }
                }
              }
              return (
                <div>
                  {rowInfo.oldLevelPrice != undefined && (
                    <p style={styles.lineThrough}>
                      ￥{rowInfo.oldLevelPrice.toFixed(2)}
                    </p>
                  )}
                  <p>{price}</p>
                </div>
              );
            }}
          />

          <Column
            width="175px"
            className="centerItem"
            key="num"
            title="数量"
            render={(_text, record: any) => {
              //赠品数量显示
              if (record.gift) {
                return record.count >= record.stock
                  ? record.stock
                  : record.count;
              }
              const buySku = fromJS(
                oldBuyCount.find(
                  (sku) => fromJS(sku).get('skuId') == record.goodsInfoId
                )
              );
              return (
                <FormItem>
                  {getFieldDecorator(record.goodsInfoId + '_buyCount', {
                    initialValue:
                      record && record.buyCount
                        ? record.buyCount.toString()
                        : '0',
                    rules: [
                      { required: true, message: '必须输入采购量' },
                      {
                        pattern: ValidConst.noZeroNumber,
                        message: '采购量只能是大于0的整数'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          const priceType = record.priceType;

                          let stock = 0;
                          if (this.props.edit) {
                            if (buySku) {
                              stock = QMFloat.accAdd(
                                record.stock,
                                buySku.get('buyCount')
                              );
                            } else {
                              stock = record.stock;
                            }
                          } else {
                            stock = record.stock;
                          }
                          if (stock < value) {
                            if (this.props.edit) {
                              callback('加购量不可大于剩余库存');
                            } else {
                              callback('采购量不可大于库存量');
                            }
                            return;
                          }
                          if (priceType === 0) {
                            const maxCount = record.maxCount;
                            const count = record.count;
                            if (maxCount && maxCount < value) {
                              callback('采购量不可大于限订量');
                              return;
                            }
                            if (count && count > value) {
                              callback('采购量不可小于起定量');
                              return;
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <InputNumber
                      onChange={(val: string) => {
                        onChangeBuyCount(record.goodsInfoId, val);
                      }}
                    />
                  )}
                  <p>
                    {this.props.edit &&
                    (record.initBuyCount || (buySku && buySku.get('buyCount')))
                      ? record.initBuyCount
                        ? `已下单${record.initBuyCount}件 剩余库存${record.stock}箱`
                        : `库存: ${QMFloat.accAdd(
                            record.stock,
                            buySku.get('buyCount')
                          )} ${
                            record.priceType === 0
                              ? (record.count
                                  ? '最小起定量: ' + record.count
                                  : '') +
                                (record.maxCount
                                  ? '最大限订量: ' + record.maxCount
                                  : '')
                              : ''
                          }`
                      : `库存: ${record.stock} ${
                          record.priceType === 0
                            ? (record.count
                                ? '最小起定量: ' + record.count
                                : '') +
                              (record.maxCount
                                ? '最大限订量: ' + record.maxCount
                                : '')
                            : ''
                        }`}
                  </p>
                </FormItem>
              );
            }}
          />

          <Column
            title="小计"
            width="110px"
            key="subtotal"
            render={(_text, record: any) => {
              if (record.gift) return '￥0.00';
              const { goodsIntervalPrices } = this.props.relaxProps;
              let price = record.salePrice;
              if (
                record.priceType === 1 &&
                goodsIntervalPrices &&
                goodsIntervalPrices.count() > 0 &&
                goodsIntervalPrices.get(0) != null
              ) {
                const buyCount = record.buyCount;
                const prices = goodsIntervalPrices
                  .filter((intervalPrice) =>
                    fromJS(record.intervalPriceIds).includes(
                      intervalPrice.get('intervalPriceId')
                    )
                  )
                  .filter(
                    (intervalPrice) => intervalPrice.get('count') <= buyCount
                  )
                  .maxBy((intervalPrice) => intervalPrice.get('count'));
                if (prices) {
                  price = prices.get('price');
                }
              }
              return (
                <span>
                  ￥
                  {(price * record.buyCount
                    ? price * record.buyCount
                    : 0.0
                  ).toFixed(2)}{' '}
                </span>
              );
            }}
          />

          <Column
            title="操作"
            key="opt"
            width="61px"
            render={(_text, record: any) => (
              <a
                href="javascript:;"
                onClick={() => {
                  if (record.gift) {
                    this._delGift(fromJS(record).get('goodsInfoId'));
                  } else {
                    this._delGoodsInfo(fromJS(record).get('goodsInfoId'));
                  }
                }}
              >
                删除
              </a>
            )}
          />
        </Table>
        <div style={styles.giftBox}>
          {(giftMarketings as any).map((giftMarketing) => {
            let level = giftMarketing
              .get('fullGiftLevelList')
              .filter((level) => level.get('edit') == true)
              .last();
            return (
              <div
                key={giftMarketing.get('marketingId')}
                id={`id_${giftMarketing.get('marketingId')}`}
                style={{ marginBottom: 6 }}
              >
                <Popover
                  placement="bottomLeft"
                  trigger="click"
                  getPopupContainer={() =>
                    document.getElementById(
                      `id_${giftMarketing.get('marketingId')}`
                    )
                  }
                  content={
                    <GiftList
                      giftMarketing={giftMarketing}
                      customerId={selectedCustomerId}
                    />
                  }
                >
                  <Button>领取赠品</Button>
                </Popover>
                &nbsp;&nbsp;
                {giftMarketing.get('subType') == 5
                  ? `已满足满${level.get('fullCount')}件获赠品`
                  : `已满足满${level.get('fullAmount')}元获赠品`}
              </div>
            );
          })}
        </div>
        <div style={styles.detailBox as any}>
          <div style={styles.inputBox as any}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              className="afterNone"
            >
              <FormItem
                style={{ width: 280 }}
                {...formItemLayout}
                colon={false}
                label={
                  <Checkbox
                    checked={goodsList.get('isEnableSpecVal')}
                    disabled={selectedCustomerId ? false : true}
                    onChange={(e: any) => {
                      if (!selectedCustomerId) {
                        message.error('请选择会员');
                        return;
                      }
                      //开启或者取消特价
                      const checked = (e.target as any).checked;
                      this._enableSpecVal(checked);
                    }}
                  >
                    订单改价:￥
                  </Checkbox>
                }
              >
                {getFieldDecorator('specVal', {
                  initialValue: goodsList.get('isEnableSpecVal')
                    ? goodsList.get('specVal')
                    : '',
                  rules: [
                    {
                      required: goodsList.get('isEnableSpecVal'),
                      message: '请输入金额'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '请输入正确的金额'
                    }
                  ]
                })(
                  <Input
                    disabled={
                      selectedCustomerId
                        ? goodsList.get('isEnableSpecVal')
                          ? false
                          : true
                        : true
                    }
                    onChange={(e) => {
                      onChangeSpecVal(parseFloat((e.target as any).value || 0));
                      this.setState({});
                    }}
                    style={{ width: 80, marginLeft: 0 }}
                  />
                )}
              </FormItem>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              className="afterNone"
            >
              <FormItem
                style={{ width: 280 }}
                {...formItemLayout}
                colon={false}
                label={
                  <Checkbox
                    checked={goodsList.get('isEnableDeliverFee')}
                    disabled={selectedCustomerId ? false : true}
                    onChange={(e) => {
                      if (!selectedCustomerId) {
                        message.error('请选择会员');
                        return;
                      }
                      const checked = (e.target as any).checked;
                      this._enableDeliverFee(checked);
                    }}
                  >
                    配送费用:￥
                  </Checkbox>
                }
              >
                {getFieldDecorator('deliverFee', {
                  initialValue: goodsList.get('isEnableDeliverFee')
                    ? goodsList.get('deliverFee')
                    : '',
                  rules: [
                    {
                      required: goodsList.get('isEnableDeliverFee'),
                      message: '请输入金额'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '请输入正确的金额'
                    }
                  ]
                })(
                  <Input
                    disabled={
                      selectedCustomerId
                        ? goodsList.get('isEnableDeliverFee')
                          ? false
                          : true
                        : true
                    }
                    onChange={(e) => {
                      onChangeDeliverFee(
                        parseFloat((e.target as any).value || 0)
                      );
                      this.setState({});
                    }}
                    style={{ width: 80, marginLeft: 0 }}
                  />
                )}
              </FormItem>
            </div>
          </div>

          <div style={styles.bottomPrice}>
            <div style={styles.title}>
              <span style={styles.itemsText}>商品金额:</span>
              <span style={styles.itemsText}>满减金额:</span>
              <span style={styles.itemsText}>满折金额:</span>
              {goodsList.get('isEnableSpecVal') && (
                <span style={styles.itemsText}>订单改价:</span>
              )}
              <span style={styles.itemsText}>配送费用:</span>
              <span style={styles.itemsText}>应付总额:</span>
            </div>
            <div style={styles.priceCom}>
              <div style={styles.priceCol}>
                <span style={styles.itemsText}>￥{totalMoney}</span>
                <span style={styles.itemsText}>-￥{reductionPrice}</span>
                <span style={styles.itemsText}>-￥{discountPrice}</span>
                {goodsList.get('isEnableSpecVal') && (
                  <span style={styles.itemsText}>
                    ￥{(goodsList.get('specVal') || 0).toFixed(2)}
                  </span>
                )}
                <span style={styles.itemsText}>￥{deliverFee}</span>
                <span style={styles.itemsText}>￥{payTotal}</span>
              </div>
              {oldTradePrice.size != 0 && (
                <div style={styles.priceLine}>
                  <span style={styles.itemsText}>
                    ￥{(oldTradePrice.get('goodsPrice') || 0).toFixed(2)}
                  </span>
                  <span style={styles.itemsText}>
                    -￥
                    {(oldTradePrice.get('reduction')
                      ? oldTradePrice.getIn(['reduction', 'discounts'])
                      : 0
                    ).toFixed(2)}
                  </span>
                  <span style={styles.itemsText}>
                    -￥
                    {(oldTradePrice.get('discount')
                      ? oldTradePrice.getIn(['discount', 'discounts'])
                      : 0
                    ).toFixed(2)}
                  </span>
                  {goodsList.get('isEnableSpecVal') && (
                    <span style={styles.itemsText}>
                      ￥{(oldTradePrice.get('privilegePrice') || 0).toFixed(2)}
                    </span>
                  )}
                  <span style={styles.itemsText}>
                    ￥{(oldTradePrice.get('deliveryPrice') || 0).toFixed(2)}
                  </span>
                  <span style={styles.itemsText}>
                    ￥{(oldTradePrice.get('totalPrice') || 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {this.state.addAddressVisible && (
          <Modal
            maskClosable={false}
            title="选择商品"
            width={1100}
            visible={this.state.addAddressVisible}
            onOk={async () => {
              let selectedRows = fromJS(
                (await this['_goodsAdd'].getSelectRows()) || []
              );
              selectedRows = QMMethod.distinct(
                fromJS(dataSource),
                selectedRows,
                'goodsInfoId'
              );
              const selectedKeys = await this['_goodsAdd'].getSelectKeys();
              const newKeys = selectedKeys
                .map((key) => key.substring(4))
                .filter((key) => oldSkuIds.findIndex((o) => o == key) < 0);
              const wholeKeys = newSkuIds
                .toSet()
                .concat(newKeys.toSet())
                .toList();
              if (wholeKeys.count() > 50) {
                message.error('购买商品种类不能超过50种');
                return;
              }
              saveNewSkuIds(wholeKeys);
              const intervalPricesNew = await this[
                '_goodsAdd'
              ].getIntervalPrices();

              const { goodsIntervalPrices } = this.props.relaxProps;
              let intervalPricesOld = goodsIntervalPrices;
              //当前选中的商品
              const selectedRow = selectedRows.map((v) => {
                let buyCount = v.get('buyCount') || 1;
                //如果有最小起订量
                if (v.get('priceType') === 0 && v.get('count')) {
                  buyCount =
                    v.get('count') > v.get('stock')
                      ? v.get('stock')
                      : v.get('count');
                }
                return v.set('buyCount', buyCount);
              });
              const rowCount = selectedRows.count();
              this.props.form.setFieldsValue({
                goodsChoose: rowCount > 0 ? rowCount.toString() : ''
              });
              this.setState({
                addAddressVisible: false,
                selectedKeys: selectedKeys,
                selectedRows: selectedRows
              });
              onSelectGoodList(
                selectedRow,
                QMMethod.distinct(
                  fromJS(intervalPricesNew),
                  fromJS(intervalPricesOld),
                  'intervalPriceId'
                )
              );
            }}
            onCancel={() => {
              this.setState({ addAddressVisible: false });
            }}
            okText="确认"
            cancelText="取消"
          >
            {
              <GoodsAdd
                selectedCustomerId={selectedCustomerId}
                selectedKeys={this.state.selectedKeys}
                selectedRows={this.state.selectedRows}
                ref={(goodsAdd) => (this['_goodsAdd'] = goodsAdd)}
              />
            }
          </Modal>
        )}
      </TableSet>
    );
  }

  _deliverFee = () => {
    const { goodsList } = this.props.relaxProps;
    const deliverFee = goodsList.get('deliverFee') || 0;
    return deliverFee.toFixed(2);
  };

  _renderSpecVal = () => {
    const { goodsList } = this.props.relaxProps;
    const isEnableSpecVal = goodsList.get('isEnableSpecVal');
    const specVal = goodsList.get('specVal');

    if (!isEnableSpecVal) {
      return null;
    }

    return (
      <label style={styles.priceItem as any}>
        <span style={styles.name}>订单改价: </span>
        <strong>￥{(specVal || 0).toFixed(2)}</strong>
      </label>
    );
  };

  /**
   * 根据商品Id删除选中的赠品
   */
  _delGift(goodsInfoId) {
    this.props.relaxProps.onDelGift(goodsInfoId);
  }

  /**
   * 根据商品Id删除选中的商品
   * @param goodsInfoId
   * @returns {Promise<void>}
   * @private
   */
  async _delGoodsInfo(goodsInfoId) {
    const {
      goodsList,

      onDeleteSelectedGoodsList
    } = this.props.relaxProps;
    let { selectedRows, selectedKeys } = this.state;
    selectedKeys = selectedKeys.filter((key) => key != 'add_' + goodsInfoId);
    selectedRows = selectedRows.filter(
      (sku) => sku.get('goodsInfoId') != goodsInfoId
    );
    this.setState({
      selectedKeys: selectedKeys,
      selectedRows: selectedRows
    });
    const count = fromJS(goodsList.get('dataSource')).count();
    if (count <= 1) {
      this.props.form.setFieldsValue({
        goodsChoose: ''
      });
    } else {
      this.props.form.setFieldsValue({
        goodsChoose: QMFloat.accSubtr(count, 1)
      });
    }
    onDeleteSelectedGoodsList(goodsInfoId);
    let key = goodsInfoId + '_buyCount';
    this.props.form.resetFields([key]);
  }
}

const styles = {
  giftBox: {
    alignItems: 'center',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4,
    marginBottom: 20,
    height: 200
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 280,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 110,
    justifyContent: 'space-between'
  },
  lineThrough: {
    textDecoration: 'line-through',
    color: '#999'
  },
  bottomPrice: {
    minWidth: 300,
    maxWidth: 400,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    display: 'flex',
    flexDirection: 'column'
  },
  priceCom: {
    display: 'flex'
  },
  priceCol: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column'
  },
  priceLine: {
    marginLeft: 10,
    color: '#999',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'line-through'
  },
  itemsText: {
    paddingTop: 10
  }
} as any;
