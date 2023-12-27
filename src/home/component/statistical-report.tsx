import React from 'react';
import { IMap, Relax } from 'plume2';

import { AuthWrapper } from 'qmkit';
import { Table } from 'antd';

import TradeTrendsCharts from './trade-trends';
import { IList } from 'typings/globalType';
import FlowTrendsCharts from './flow-trends';
import CustomerGrowTrendsCharts from './cus-trends';

const trafficColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '访客数UV',
    dataIndex: 'totalUv',
    key: 'totalUv'
  },
  {
    title: '浏览量PV',
    dataIndex: 'totalPv',
    key: 'totalPv'
  },
  {
    title: '商品访客数',
    dataIndex: 'skuTotalUv',
    key: 'skuTotalUv'
  },
  {
    title: '商品浏览量',
    dataIndex: 'skuTotalPv',
    key: 'skuTotalPv'
  }
];

const tradeColumns = [
  {
    title: '日期',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '下单笔数',
    dataIndex: 'orderCount',
    key: 'orderCount'
  },
  {
    title: '下单金额',
    dataIndex: 'orderAmt',
    render: (_text, record) => '￥' + (record.orderAmt || 0).toFixed(2),
    key: 'orderAmt'
  },
  {
    title: '付款订单数',
    dataIndex: 'payOrderCount',
    key: 'payOrderCount'
  },
  {
    title: '付款金额',
    dataIndex: 'payOrderAmt',
    render: (_text, record) => '￥' + (record.payOrderAmt || 0).toFixed(2),
    key: 'payOrderAmt'
  }
];

const customerColumns = [
  {
    title: '日期',
    dataIndex: 'baseDate',
    key: 'baseDate'
  },
  {
    title: '客户总数',
    dataIndex: 'cusAllCount',
    key: 'cusAllCount'
  },
  {
    title: '新增客户数',
    dataIndex: 'cusDayGrowthCount',
    key: 'cusDayGrowthCount'
  }
];

const oviewUi = {
  0: 'flowBox',
  1: 'flowBox todayDataOne',
  2: 'flowBox todayDataTwo',
  3: 'flowBox todayDataThree',
  4: 'flowBox todayDataFour'
};

@Relax
export default class StatisticalReport extends React.Component<any, any> {
  props: {
    relaxProps?: {
      trafficReport: boolean;
      tradeReport: boolean;
      customerGrowthReport: boolean;
      trafficTrends: boolean;
      tradeTrends: boolean;
      customerGrowthTrends: boolean;
      tradeData: IList;
      flowData: IList;
      customerData: IList;
      trafficOview: boolean;
      tradeOview: boolean;
      skuOview: boolean;
      customerOview: boolean;
      skuNum: IMap;
      tradeNum: IMap;
      oViewNum: number;
      customerNum: IMap;
      trafficNum: IMap;
    };
  };

  static relaxProps = {
    trafficReport: 'trafficReport',
    tradeReport: 'tradeReport',
    customerGrowthReport: 'customerGrowthReport',
    trafficTrends: 'trafficTrends',
    tradeTrends: 'tradeTrends',
    customerGrowthTrends: 'customerGrowthTrends',
    tradeData: 'tradeData',
    flowData: 'flowData',
    customerData: 'customerData',
    trafficOview: 'trafficOview',
    tradeOview: 'tradeOview',
    skuOview: 'skuOview',
    customerOview: 'customerOview',
    skuNum: 'skuNum',
    tradeNum: 'tradeNum',
    oViewNum: 'oViewNum',
    customerNum: 'customerNum',
    trafficNum: 'trafficNum'
  };

  render() {
    const {
      trafficReport,
      tradeReport,
      customerGrowthReport,
      trafficTrends,
      tradeTrends,
      customerGrowthTrends,
      tradeData,
      flowData,
      customerData,
      trafficOview,
      tradeOview,
      skuOview,
      customerOview,
      skuNum,
      tradeNum,
      oViewNum,
      customerNum,
      trafficNum
    } = this.props.relaxProps;

    return (
      <div
        className={oviewUi[oViewNum]}
        style={{ marginLeft: -5, marginRight: -5 }}
      >
        {/* 流量统计报表查看 */}
        {trafficOview ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem todayData">
              <h3>流量概况&nbsp;今日</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>访客数UV</label>
                  <strong>{trafficNum.get('totalUv') || 0}</strong>
                </div>
                <div className="dataItem">
                  <label>浏览器PV</label>
                  <strong>{trafficNum.get('totalPv') || 0}</strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>商品访客数</label>
                  <strong>{trafficNum.get('skuTotalUv') || 0}</strong>
                </div>
                <div className="dataItem">
                  <label>商品浏览量</label>
                  <strong>{trafficNum.get('skuTotalPv') || 0}</strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {tradeOview ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem todayData">
              <h3>交易概况&nbsp;今日</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>下单笔数</label>
                  <strong>
                    {tradeNum && (tradeNum.get('orderCount') || 0)}
                  </strong>
                </div>
                <div className="dataItem">
                  <label>下单金额</label>
                  <strong>
                    ￥{tradeNum
                      ? (tradeNum.get('orderAmt') || 0).toFixed(2)
                      : 0.0}
                  </strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>付款订单数</label>
                  <strong>
                    {tradeNum && (tradeNum.get('payOrderCount') || 0)}
                  </strong>
                </div>
                <div className="dataItem">
                  <label>付款金额</label>
                  <strong>
                    ￥{tradeNum
                      ? (tradeNum.get('payOrderAmt') || 0).toFixed(2)
                      : 0.0}
                  </strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {skuOview ? (
          <AuthWrapper functionName="f_goods_watch_1">
            <div className="homeItem todayData">
              <h3>商品概况&nbsp;今日</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>商品总数SKU</label>
                  <strong>{skuNum && (skuNum.get('total') || 0)}</strong>
                </div>
                <div className="dataItem">
                  <label>上架商品数</label>
                  <strong>{skuNum && (skuNum.get('addedTotal') || 0)}</strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>已审核商品SKU</label>
                  <strong>{skuNum && (skuNum.get('checkedTotal') || 0)}</strong>
                </div>
                <div className="dataItem">
                  <label>销售中商品SKU</label>
                  <strong>{skuNum && (skuNum.get('saleTotal') || 0)}</strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {customerOview ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem todayData">
              <h3>客户概况&nbsp;今日</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>客户总数</label>
                  <strong>{customerNum.get('cusAllCount') || 0}</strong>
                </div>
                <div className="dataItem" />
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>新增客户数</label>
                  <strong>{customerNum.get('cusDayGrowthCount') || 0}</strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {trafficReport ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem lastTenData">
              <h3>流量报表&nbsp;近10日</h3>
              <Table
                dataSource={flowData.size > 0 ? flowData.toJS() : null}
                columns={trafficColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {trafficTrends ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem lastTenData">
              <h3>流量趋势&nbsp;近10日</h3>
              <FlowTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
        {tradeReport ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem lastTenData">
              <h3>交易报表&nbsp;近10日</h3>
              <Table
                dataSource={tradeData.size > 0 ? tradeData.toJS() : null}
                columns={tradeColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {tradeTrends ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem lastTenData">
              <h3>交易趋势&nbsp;近10日</h3>
              <TradeTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
        {customerGrowthReport ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem lastTenData">
              <h3>客户增长报表&nbsp;近10日</h3>
              <Table
                dataSource={customerData.size > 0 ? customerData.toJS() : null}
                columns={customerColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {customerGrowthTrends ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem lastTenData">
              <h3>客户增长趋势&nbsp;近10日</h3>
              <CustomerGrowTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
      </div>
    );
  }
}
