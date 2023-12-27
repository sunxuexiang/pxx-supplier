import React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';
import AppStore from '../store';
import { IList } from 'typings/globalType';
import * as webapi from '../webapi';
import { Link } from 'react-router-dom';
export declare type TSubscribeHandler = (state: IMap) => void;
// export declare type IMap = Map<string, any>;

import {
  Button,
  Checkbox,
  InputNumber,
  Modal,
  Table,
  message,
  Form,
  Input,
  Upload,
  Icon,
  Spin
} from 'antd';
import GoodsAdd from './goods-add';
import { fromJS } from 'immutable';
const Dragger = Upload.Dragger;
import { noop, ValidConst, QMFloat, QMMethod } from 'qmkit';
import { Const, Fetch, util, BreadCrumb } from 'qmkit';
import './goods-list-style.css';

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
// import UUID from 'uuid-js';

import styled from 'styled-components';
import { log } from 'console';
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
      discountPrice: number;
      couponPrice: number;
      pointsPrice: number;
      reductionPrice: number;
      oldTradePrice: IMap;

      onChangeSpecVal: Function;
      onEnableSpecVal: Function;
      onSelectGoodList: Function;
      shezhijine: Function;
      couponCodegetId: Function;
      tradeMarketingListmap: Function;
      cleatr: Function;
      clearOrder: Function;
      onDeleteSelectedGoodsList: Function;
      onEnableDeliverFee: Function;
      onChangeDeliverFee: Function;
      onChangeBuyCount: Function;
      onDelGift: Function;
      onExtraInfoChange: Function;
      onCreateOrder: Function;
      saveNewSkuIds: Function;
      selectedWareHouse: string;
      clearAddress: Function;
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
    couponPrice: 'couponPrice',
    pointsPrice: 'pointsPrice',
    reductionPrice: 'reductionPrice',
    oldTradePrice: 'oldTradePrice',
    selectedWareHouse: 'selectedWareHouse',
    onChangeSpecVal: noop,
    onEnableSpecVal: noop,
    onSelectGoodList: noop,
    onDeleteSelectedGoodsList: noop,
    onEnableDeliverFee: noop,
    onChangeDeliverFee: noop,
    shezhijine: noop,
    couponCodegetId: noop,
    tradeMarketingListmap: noop,
    cleatr: noop,
    clearOrder: noop,
    onChangeBuyCount: noop,
    onDelGift: noop,
    onSelectAddress: noop,
    onDeleteAddress: noop,
    saveNewSkuIds: noop,
    clearAddress: noop
  };
  store: AppStore;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.store = ctx['_plume$Store'];
    this.state = {
      fileName: '',
      loading: false,
      uuid: '',
      wid: '1', // 仓库id
      //显示添加商品
      addAddressVisible: false,
      // 优惠金额
      discountPrices: 0.0,
      // 优惠劵金额
      denomination: 0.0,
      // 优惠后的金额
      tradePrice: 0.0,
      // 优惠前的金额
      totalPricemoy: 0.0,
      // 赠品
      zengping: [],
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
      discountPrice,
      couponPrice,
      pointsPrice,
      reductionPrice,
      totalMoney,
      payTotal,

      onSelectGoodList,
      onChangeSpecVal,
      onChangeDeliverFee,
      onChangeBuyCount,
      saveNewSkuIds,
      selectedWareHouse
    } = this.props.relaxProps;
    const {
      discountPrices,
      tradePrice,
      totalPricemoy,
      zengping,
      denomination
    } = this.state;
    // console.log(zengping);

    let dataSource = goodsList.get('dataSource').toJS();
    // 已选赠品列表，会与商品列表合并后放入Table
    let giftDataSource = goodsList.get('giftDataSource').toJS();
    dataSource.forEach((val) => (val.key = val.goodsInfoId));

    const deliverFee = this._deliverFee();

    const { fileName, loading, err } = this.state;
    return (
      <TableSet>
        {/* {!this.props.edit && (
          <Button
            style={{ marginBottom: 10 }}
            type="primary"
            onClick={() => {
              if (!selectedCustomerId) {
                message.error('请选择会员');
                return;
              }
              if (!selectedWareHouse) {
                message.error('请选择仓库');
                return;
              }

              this.setState({
                addAddressVisible: true
              });
            }}
          >
            新增商品
          </Button>
        )} */}
        {!this.props.edit && (
          <div>
            <Button
              type="primary"
              icon="download"
              style={{ marginBottom: 20 }}
              onClick={this.toDownTempl}
            >
              下载商品导入模板
            </Button>
            {/* <Link to="/goods_import">表格批量导入</Link> */}
            {/* <Dragger
                    name="file"
                    multiple={false}
                    showUploadList={false}
                    accept=".xls,.xlsx"
                    headers={header}
                    action={Const.HOST + '/trade/importGoodsInfos'}
                    onChange={this.changeImage}
                  >
                    选择文件上传
                  </Dragger> */}
            <Spin spinning={this.state.loading}>
              <div className="steps-content" style={styles.centeraa}>
                <Dragger
                  name="file"
                  multiple={false}
                  showUploadList={false}
                  accept=".xls,.xlsx"
                  headers={header}
                  action={
                    Const.HOST +
                    `/trade/importGoodsInfos/${sessionStorage.getItem(
                      'wareId'
                    )}/${this.store.get('selectedCustomerId')}`
                  }
                  // action={
                  //   Const.HOST + `/trade/importGoodsInfos/${this.state.wid}`
                  // }
                  onChange={this.changeImage}
                >
                  <div style={styles.content}>
                    <p
                      className="ant-upload-hint"
                      style={{ fontSize: 14, color: 'black' }}
                    >
                      {' '}
                      <Icon type="upload" />
                      批量导入商品选择文件上传
                    </p>
                  </div>
                </Dragger>
                <div style={styles.tip}>{fileName}</div>
                {err ? (
                  <div style={styles.tip}>
                    <span style={styles.error}>导入失败！</span>
                    您可以<a onClick={this.toExcel}>下载错误表格</a>
                    ，查看错误原因，修改后重新导入。
                  </div>
                ) : null}
                <p style={styles.grey}>
                  请选择 .xlsx或
                  .xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条商品修改数据。
                </p>
              </div>
            </Spin>
          </div>
        )}

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
          // dataSource={dataSource}
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
            // dataIndex="goodsInfoNo"
            width="140px"
            key="erpGoodsInfoNo"
            render={(rowInfo) => {
              if (rowInfo.erpGoodsInfoNo) {
                return rowInfo.erpGoodsInfoNo;
              }
              return (
                <p
                  style={{
                    color: '#F56C1D'
                  }}
                >
                  赠品
                </p>
              );
            }}
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
            width="12%"
            key="goodsSubtitle"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return rowInfo.goodsSubtitle;
              }
              return rowInfo.goodsSubtitle;
            }}
          />
          <Column
            title={this.props.edit ? '单价' : '会员价'}
            width="110px"
            key="salePrice"
            render={(rowInfo) => {
              if (rowInfo.gift) return '￥0.00';
              if (this.props.edit) return rowInfo.levelPrice;
              // if (this.props.edit) return rowInfo.levelPrice.toFixed(2);
              const goodsIntervalPrices =
                this.props.relaxProps.goodsIntervalPrices;
              let price = '￥' + rowInfo.salePrice;
              // let price = '￥' + rowInfo.salePrice.toFixed(2);
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
                  <p>{price}</p>
                </div>
              );
            }}
          />

          <Column
            width="120px"
            className="centerItem"
            key="num"
            title="数量"
            render={(_text, record: any) => {
              //赠品数量显示
              // console.log(record.num, '...........,,,,,,,,,,,,,,,,,,,,,,,,,,');
              if (record.gift) {
                return record.num;
              }
              const buySku = fromJS(
                oldBuyCount.find(
                  (sku) => fromJS(sku).get('skuId') == record.goodsInfoId
                )
              );
              return (
                <FormItem>
                  {getFieldDecorator(record.goodsInfoId + '_buyCount', {
                    initialValue: record.num ? record.num : 1,
                    rules: [
                      { required: true, message: '必须输入采购量' },
                      {
                        pattern: ValidConst.noZeroNumber,
                        message: '采购量只能是大于0的整数'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          // console.log(value);

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
                    // <InputNumber
                    //   disabled={this.props.edit}
                    //   onChange={(val: string) => {
                    //     console.log(val, record.goodsInfoId);
                    //     onChangeBuyCount(record.goodsInfoId, val);
                    //   }}
                    // />
                    <p>数量：{record.buyCount}</p>
                  )}
                  {record.stockpace != 1 ? (
                    <p>
                      {this.props.edit &&
                      (record.initBuyCount ||
                        (buySku && buySku.get('buyCount')))
                        ? null
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
                  ) : (
                    ''
                  )}
                </FormItem>
              );
            }}
          />
          <Column
            title="促销活动"
            width="20%"
            key="goodsId"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return rowInfo.titlen;
              }
              return rowInfo.titlen;
            }}
          />

          <Column
            title="小计"
            width="110px"
            key="subtotal"
            render={(_text, record: any) => {
              if (record.gift) return '￥0.00';
              if (this.props.edit)
                return (record.buyCount * record.levelPrice).toFixed(2);
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

          {/* {!this.props.edit && (
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
          )} */}
        </Table>
        <div
          style={{
            paddingLeft: 5,
            marginTop: 20,
            fontSize: 15
          }}
        >
          下面是赠品：
        </div>
        <Table
          bordered
          rowKey={(record: any) => {
            if (record.gift) {
              return 'gift_' + record.goodsInfoId;
            }
            return 'row_' + record.goodsInfoId;
          }}
          dataSource={zengping}
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
            // dataIndex="goodsInfoNo"
            width="140px"
            key="erpGoodsInfoNo"
            render={(rowInfo) => {
              if (rowInfo.erpGoodsInfoNo) {
                return rowInfo.erpGoodsInfoNo;
              }
              return (
                <p
                  style={{
                    color: '#F56C1D'
                  }}
                >
                  赠品
                </p>
              );
            }}
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
          {/* <Column
            title="规格"
            width="12%"
            key="goodsSubtitle"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return rowInfo.goodsSubtitle;
              }
              return rowInfo.goodsSubtitle;
            }}
          /> */}
          <Column
            title={this.props.edit ? '单价' : '会员价'}
            width="110px"
            key="salePrice"
            render={(rowInfo) => {
              let price = '￥' + rowInfo.marketPrice.toFixed(2);
              return (
                <div>
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
              return <p>数量：{record.buyCount}</p>;
              //  return <p>数量：{record.buyCount}</p>
            }}
          />
          <Column
            title="单位"
            width="12%"
            key="goodsUnit"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return rowInfo.goodsUnit;
              }
              return rowInfo.goodsUnit;
            }}
          />

          <Column
            title="小计"
            width="110px"
            key="subtotal"
            render={(_text, record: any) => {
              return <span>￥0.00</span>;
            }}
          />

          {/* {!this.props.edit && (
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
          )} */}
        </Table>
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
                    ? (goodsList.get('specVal') || 0).toFixed(2)
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
                      message.error('该功能关闭');
                      return;
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
              {reductionPrice != 0 && (
                <span style={styles.itemsText}>满减金额:</span>
              )}
              {discountPrice != 0 && (
                <span style={styles.itemsText}>满折金额:</span>
              )}
              {couponPrice != 0 && (
                <span style={styles.itemsText}>优惠券:</span>
              )}
              {pointsPrice != 0 && (
                <span style={styles.itemsText}>积分抵扣:</span>
              )}
              {goodsList.get('isEnableSpecVal') && (
                <span style={styles.itemsText}>订单改价:</span>
              )}
              <span style={styles.itemsText}>促销金额:</span>
              <span style={styles.itemsText}>优惠劵金额:</span>
              <span style={styles.itemsText}>配送费用:</span>
              <span style={styles.itemsText}>应付总额:</span>
            </div>
            <div style={styles.priceCom}>
              <div style={styles.priceCol}>
                <span style={styles.itemsText}>￥{totalPricemoy}</span>
                {reductionPrice != 0 && (
                  <span style={styles.itemsText}>
                    -￥{reductionPrice.toFixed(2)}
                  </span>
                )}
                {discountPrice != 0 && (
                  <span style={styles.itemsText}>
                    -￥{discountPrice.toFixed(2)}
                  </span>
                )}
                {couponPrice != 0 && (
                  <span style={styles.itemsText}>
                    -￥{couponPrice.toFixed(2)}
                  </span>
                )}
                {pointsPrice != 0 && (
                  <span style={styles.itemsText}>
                    -￥{pointsPrice.toFixed(2)}
                  </span>
                )}
                {goodsList.get('isEnableSpecVal') && (
                  <span style={styles.itemsText}>
                    ￥{(goodsList.get('specVal') || 0).toFixed(2)}
                  </span>
                )}
                <span style={styles.itemsText}>-￥{discountPrices}</span>
                <span style={styles.itemsText}>-￥{denomination}</span>
                <span style={styles.itemsText}>￥{deliverFee}</span>
                {/* payTotal */}
                <span style={styles.itemsText}>
                  ￥{(Number(tradePrice) + Number(deliverFee)).toFixed(2)}
                </span>
              </div>
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
              console.log(selectedRows.toJS());

              selectedRows = QMMethod.distinct(
                fromJS(dataSource),
                selectedRows,
                'goodsInfoId'
              );

              const selectedKeys = await this['_goodsAdd'].getSelectKeys();
              console.log(selectedKeys.toJS());

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

              // return
              saveNewSkuIds(wholeKeys);
              const intervalPricesNew = await this[
                '_goodsAdd'
              ].getIntervalPrices();
              console.log(intervalPricesNew.toJS());

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
              console.log(selectedKeys);
              console.log(selectedRow);

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
                selectedWareHouse={selectedWareHouse}
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
  // 下载模板
  toDownTempl() {
    const token = (window as any).token;
    if (token) {
      const base64 = new util.Base64();
      let result = JSON.stringify({ token: token });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref =
        Const.HOST + `/goods/goodsBatchImport/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  }
  changeImage = async (info) => {
    const wareHouse = await this.props.relaxProps.clearAddress();

    if (!wareHouse) {
      message.error('请选择仓库');
      return;
    }
    let wid = wareHouse.toJS();
    this.setState({
      wid: wid.wareId
    });

    const {
      goodsList,
      selectedWareHouse,
      shezhijine,
      couponCodegetId,
      tradeMarketingListmap,
      cleatr,
      clearOrder
    } = this.props.relaxProps;
    // goodsList.set('dataSource', fromJS([]))
    // console.log(goodsList.get('dataSource').toJS());

    const status = info.file.status;
    const { zengping } = this.state;
    let { selectedCustomerId } = this.props;
    let loading = true;
    let err = false;
    if (!selectedCustomerId) {
      message.error('请选择会员');
      return;
    }
    if (!selectedWareHouse) {
      message.error('请选择仓库');
      return;
    }
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = [];
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;

        let isImport = false;
        this.setState({ isImport });
        const importGoodsInfosList = [];
        const goodsInfoIds = [];
        info.file.response.context.importGoodsInfoList.forEach((element) => {
          console.log(element);
          if (element.goodsStatus == 0) {
            const obje = {
              buyCount: element.buyCount,
              goodsInfoId: element.goodsInfoId,
              stock: element.stock
            };
            importGoodsInfosList.push(obje);
            goodsInfoIds.push(element.goodsInfoId);
          }
        });
        // console.log(importGoodsInfosList);
        // console.log(goodsInfoIds);
        console.log(isImport, '---------', info.file.response.context);
        if (goodsList.get('dataSource').toJS().length > 1) {
          loading = false;
          this.setState({ loading, err });
          message.error('购买商品种类不能重复导入为了您的优惠劵考虑');
          return;
        }

        const { res: goodsDiscount } = (await webapi.discountPrefinfo({
          customerId: this.store.get('selectedCustomerId'),
          goodsInfoIds: goodsInfoIds,
          wareId: sessionStorage.getItem('wareId'),
          importGoodsInfosList: importGoodsInfosList
        })) as any;
        console.log(goodsDiscount.context);
        const arr = goodsDiscount.context;
        this.setState({
          // 优惠
          discountPrices: arr.discountPrice.toFixed(2),
          denomination: arr.couponCode
            ? arr.couponCode.denomination.toFixed(2)
            : '0.00',
          // 优惠后的金额
          tradePrice: arr.tradePrice.toFixed(2),
          // tradePricelijsg:  arr.tradePrice.toFixed(2),
          totalPricemoy: arr.totalPrice.toFixed(2),
          zengping: []
        });
        const arrgif = [];
        const datalist =
          JSON.stringify(goodsDiscount.context.storeMarketingMap) != '{}' &&
          goodsDiscount.context.storeMarketingMap
            ? goodsDiscount.context.storeMarketingMap[123457929]
            : [];
        const stause = goodsDiscount.context.goodsMarketings;
        // const arrId = stause.map(v => v.marketingId);
        // console.log(ext);

        info.file.response.context.importGoodsInfoList.forEach((e, index) => {
          e.buyCount = e.num ? e.num : 1;
          e.num = e.num ? e.num : 1;
          e.levelPrice = e.levelPrice ? e.levelPrice : '0';
          e.salePrice = e.salePrice ? e.salePrice : '0';
          e.stock = e.stock + '' ? e.stock : 1 + '';
          e.actictiy = [];
          if (stause) {
            stause.forEach((gooitem) => {
              // console.log(e);
              // console.log(gooitem);
              if (e.goodsInfoId == gooitem.goodsInfoId) {
                datalist.forEach((activityItem) => {
                  console.log(activityItem);

                  if (gooitem.marketingId == activityItem.marketingId) {
                    let title = '';
                    // 满赠
                    if (activityItem.marketingType === 2) {
                      activityItem.fullGiftLevelList.map((level, index) => {
                        if (index === 0) {
                          title += '满';
                        } else {
                          title += '，';
                        }
                        // 满金额
                        if (activityItem.subType === 4) {
                          title += level.fullAmount + '元';
                        } else if (activityItem.subType === 5) {
                          // 满数量
                          title += level.fullCount + '件';
                        } else if (activityItem.subType === 6) {
                          //  满订单
                          title += level.fullCount + '件';
                        }
                      });
                      title += '获赠品，赠完为止';
                    } else if (activityItem.marketingType === 0) {
                      if (activityItem.fullReductionLevelList) {
                        activityItem.fullReductionLevelList.map(
                          (level, index) => {
                            if (index === 0) {
                              title += '满';
                            } else {
                              title += '，';
                            }
                            // 满金额
                            if (activityItem.subType === 0) {
                              title += level.fullAmount + '元';
                            } else if (activityItem.subType === 1) {
                              // 满数量
                              title += level.fullCount + '件';
                            }
                            title += '减' + level.reduction + '元';
                          }
                        );
                      } else {
                        // console.log(activityItem.lack);
                        if (activityItem.lack === 0) {
                          if (activityItem.fullReductionLevel.fullCount) {
                            title += `您已满足满${activityItem.fullReductionLevel.fullCount}件减${activityItem.fullReductionLevel.reduction}元`;
                          } else {
                            title += `您已满足满${activityItem.fullReductionLevel.fullAmount}元减${activityItem.fullReductionLevel.reduction}元`;
                          }
                        } else {
                          if (activityItem.fullReductionLevel.fullCount) {
                            title += `满${
                              activityItem.fullReductionLevel.fullCount + '件'
                            }减${
                              activityItem.fullReductionLevel.reduction
                            }元，还差${
                              activityItem.fullReductionLevel.fullCount
                                ? activityItem.lack + '件'
                                : activityItem.lack + '元'
                            }`;
                          } else {
                            title += `满${
                              activityItem.fullReductionLevel.fullAmount
                            }元减${
                              activityItem.fullReductionLevel.reduction
                            }元，还差${
                              activityItem.fullReductionLevel.fullCount
                                ? activityItem.lack + '件'
                                : activityItem.lack + '元'
                            }`;
                          }
                        }
                      }
                    } else if (activityItem.marketingType === 1) {
                      if (activityItem.fullDiscountLevelList) {
                        activityItem.fullDiscountLevelList.map(
                          (level, index) => {
                            if (index === 0) {
                              title += '满';
                            } else {
                              title += '，';
                            }

                            // 满金额
                            if (activityItem.subType === 2) {
                              title += level.fullAmount + '元';
                            } else if (activityItem.subType === 3) {
                              // 满数量
                              title += level.fullCount + '件';
                            }

                            title += '享' + level.discount * 10 + '折';
                          }
                        );
                      } else {
                        if (activityItem.lack === 0) {
                          title += `您已满足立享${
                            activityItem.fullDiscountLevel.discount * 10
                          }折`;
                        } else {
                          title += `立享${
                            activityItem.fullDiscountLevel.discount * 10
                          }折，还差`;
                          if (activityItem.subType === 2) {
                            title += activityItem.lack + '元。';
                          } else if (activityItem.subType === 3) {
                            // 满数量
                            title += activityItem.lack + '件。';
                          }
                        }

                        // title += '享' + activityItem.fullDiscountLevel.discount * 10 + '折';
                      }
                    }
                    e.titlen = title;
                    e.marketingId = activityItem.marketingId;
                  }
                });
              }
            });
          }
        });

        console.log(info.file.response.context.importGoodsInfoList);
        if (
          arr.storeMarketingMap &&
          JSON.stringify(arr.storeMarketingMap) != '{}'
        ) {
          arr.storeMarketingMap[123457929].forEach((e) => {
            const obj = {
              giftSkuIds: [],
              marketingId: null,
              marketingLevelId: null,
              skuIds: []
            };
            // console.log(e.lack);
            if (e.lack <= 0) {
              obj.skuIds = e.goodsInfoIds;
              obj.marketingId = e.marketingId;
              if (e.fullDiscountLevel) {
                obj.marketingLevelId = e.fullDiscountLevel.discountLevelId;
              } else {
                obj.marketingLevelId = e.fullGiftLevel
                  ? e.fullGiftLevel.giftLevelId
                  : e.fullReductionLevel.reductionLevelId;
              }
              if (e.fullGiftLevelList) {
                e.fullGiftLevelList.forEach((item) => {
                  if (e.fullGiftLevel.giftLevelId == item.giftLevelId) {
                    // console.log(item.giftType,'11111111111111111');

                    if (item.giftType == 1) {
                      console.log(item.fullGiftDetailList[0]);

                      if (!item.fullGiftDetailList[0].giftGoodsInfoVO.stock) {
                        obj.giftSkuIds.push(
                          item.fullGiftDetailList[0].productId
                        );
                        item.fullGiftDetailList[0].giftGoodsInfoVO.stock = 1;
                        item.fullGiftDetailList[0].giftGoodsInfoVO.stockpace = 1;
                        item.fullGiftDetailList[0].giftGoodsInfoVO.buyCount = 1;
                      }
                      zengping.push(item.fullGiftDetailList[0].giftGoodsInfoVO);
                    } else {
                      item.fullGiftDetailList.forEach((item_child) => {
                        if (item_child.giftGoodsInfoVO.goodsStatus == 0) {
                          if (!item_child.giftGoodsInfoVO.stock) {
                            obj.giftSkuIds.push(item_child.productId);
                            item_child.giftGoodsInfoVO.stock = 1;
                            item_child.giftGoodsInfoVO.stockpace = 1;
                            item_child.giftGoodsInfoVO.buyCount = 1;
                          }
                          zengping.push(item_child.giftGoodsInfoVO);
                        }
                      });
                    }
                  }
                });
              }
              arrgif.push(obj);
            }
          });
        }
        // console.log(zengping);

        this.setState({
          zengping: zengping
        });
        ext = info.file.response.context.importGoodsInfoList;

        // console.log(arrgif);
        // console.log(ext);

        let selectedRows = fromJS(
          info.file.response.context.importGoodsInfoList || []
        );
        // let selectedRows = fromJS(
        //   (await this['_goodsAdd'].getSelectRows()) || []
        // );

        let datasouce = goodsList.get('dataSource');
        // console.log(datasouce.toJS());
        selectedRows = QMMethod.distinct(
          fromJS(datasouce),
          selectedRows,
          'goodsInfoId'
        );

        // const selectedKeys = GoodsAdd.getSelectKeys();

        // const newKeys = selectedKeys
        //   .map((key) => key.substring(4))
        //   .filter((key) => this.props.relaxProps.oldSkuIds.findIndex((o) => o == key) < 0);
        console.log(ext);

        const newKeys = fromJS(
          ext.map((e) => {
            return e.goodsInfoId;
          })
        );
        // console.log(newKeys);
        const wholeKeys = this.props.relaxProps.newSkuIds
          .toSet()
          .concat(newKeys.toSet())
          .toList();
        if (wholeKeys.count() > 50) {
          message.error('购买商品种类不能超过50种');
          return;
        }

        // return
        this.props.relaxProps.saveNewSkuIds(wholeKeys);
        const intervalPricesNew = fromJS([]);

        const { goodsIntervalPrices } = this.props.relaxProps;
        let intervalPricesOld = goodsIntervalPrices;
        //当前选中的商品
        const selectedRow = selectedRows.map((v) => {
          let buyCount = v.get('buyCount') || 1;
          //如果有最小起订量
          if (v.get('priceType') === 0 && v.get('count')) {
            buyCount =
              v.get('count') > v.get('stock') ? v.get('stock') : v.get('count');
          }
          return v.set('buyCount', buyCount);
        });
        const rowCount = selectedRows.count();
        this.props.form.setFieldsValue({
          goodsChoose: rowCount > 0 ? rowCount.toString() : ''
        });
        // console.log(selectedKeys);
        // console.log(selectedRow);

        this.setState({
          addAddressVisible: false,
          selectedKeys: newKeys,
          selectedRows: selectedRows
        });
        this.props.relaxProps.onSelectGoodList(
          selectedRow,
          QMMethod.distinct(
            fromJS(intervalPricesNew),
            fromJS(intervalPricesOld),
            'intervalPriceId'
          )
        );

        tradeMarketingListmap(arrgif);
        console.log(this.state.tradePrice);

        shezhijine(arr.tradePrice.toFixed(2));
        // 优惠劵
        couponCodegetId(arr.couponCode ? arr.couponCode.couponCodeId : '');

        // this.next();
        message.success(fileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          // this._importGoods(info.file.response.message);
          // this._importerror(info.file.response.message);
          err = true;
          let uuid = info.file.response.message;
          this.setState({ uuid });

          message.error('导入商品错误，下载错误表格查看详情');
        }
      }
      this.setState({ ext, fileName, loading, err });
    } else if (status === 'error') {
      message.error('上传失败');
      loading = false;
      this.setState({ loading, err });
    }
  };
  toExcel = () => {
    const { uuid } = this.state;
    // 参数加密
    let base64 = new util.Base64();
    const atoken = (window as any).token;
    if (atoken != '') {
      let encrypted = base64.urlEncode(JSON.stringify({ token: atoken }));

      // 新窗口下载
      const exportHref = Const.HOST + `/trade/exportGoodsInfos/${uuid}`;
      // Const.HOST + `trade/exportGoodsInfos/${uuid}/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };

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
  centeraa: {
    height: 150,
    marginBottom: 20
  },
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
    // marginLeft: 20,
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
function saveNewSkuIds(wholeKeys: any) {
  throw new Error('Function not implemented.');
}

function onSelectGoodList(selectedRow: any, arg1: any) {
  throw new Error('Function not implemented.');
}

function dataSource(dataSource: any): any {
  throw new Error('Function not implemented.');
}
