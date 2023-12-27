import React from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import { StatisticsHeader, IndicatorPopver, DownloadModal } from 'biz';
import AppStore from './store';
import TradeStatisticsList from './component/list';
import TradeCharts from './component/tradechart';
import Paint from './component/paint';
import { util, DataModal } from 'qmkit';
const nodataImg = require('./nodata.png');

//自定义指标卡片显示的内容
const popContent = [
  {
    title: '下单指标',
    data: [
      { title: '下单笔数', key: 'orderCount', default: true },
      { title: '下单人数', key: 'orderNum', default: true },
      { title: '下单金额', key: 'orderAmt', default: true },
      { title: '付款订单数', key: 'PayOrderCount', default: true },
      { title: '付款人数', key: 'PayOrderNum', default: true },
      { title: '付款金额', key: 'payOrderAmt', default: true }
    ]
  },
  {
    title: '转化指标',
    data: [
      { title: '下单转化率', key: 'orderConversionRate', default: false },
      { title: '付款转化率', key: 'payOrderConversionRate', default: false },
      { title: '全店转化率', key: 'wholeStoreConversionRate', default: false },
      { title: '客单价', key: 'customerUnitPrice', default: false },
      { title: '笔单价', key: 'everyUnitPrice', default: false }
    ]
  },
  {
    title: '退单指标',
    data: [
      { title: '退单笔数', key: 'returnOrderCount', default: false },
      { title: '退单人数', key: 'returnOrderNum', default: false },
      { title: '退单金额', key: 'returnOrderAmt', default: false }
    ]
  }
];
@StoreProvider(AppStore, { debug: __DEV__ })
export default class TradeStatistics extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    //初始化当天的交易情况
    this.store.init();
  }

  render() {
    const isNull = this.store.state().get('isNull');
    const tradeGeneral = this.store.state().get('tradeGeneral');
    //转化率格式化补0
    const orderConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('orderConversionRate')).toFixed(2) + '%';
    const payOrderConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('payOrderConversionRate')).toFixed(2) + '%';
    const wholeStoreConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('wholeStoreConversionRate')).toFixed(2) +
        '%';
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>交易统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="newContent">
          <StatisticsHeader
            onClick={(param) => this.store.getTradeInfo(param)}
          />
          <div style={styles.content}>
            <div>
              <h4 style={styles.h4}>交易概况</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={styles.static}>
                  <p style={styles.itemheader}>转化</p>
                  <Row style={styles.bgrey}>
                    <Col span={4}>
                      <p style={styles.nav}>访客数UV</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('totalUv')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>下单转化率</p>
                      <p style={styles.num}>{orderConversionRate}</p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>付款转化率</p>
                      <p style={styles.num}>{payOrderConversionRate}</p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>全店转化率</p>
                      <p style={styles.num}>{wholeStoreConversionRate}</p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>笔单价</p>
                      <p style={styles.num}>
                        {isNull
                          ? '-'
                          : util.formateMoney(
                              tradeGeneral.get('everyUnitPrice')
                            )}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>客单价</p>
                      <p style={styles.num}>
                        {isNull
                          ? '-'
                          : util.formateMoney(
                              tradeGeneral.get('customerUnitPrice')
                            )}
                      </p>
                    </Col>
                  </Row>
                  <p style={styles.itemheader}>订单</p>
                  <Row style={styles.bgrey}>
                    <Col span={4}>
                      <p style={styles.nav}>下单笔数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('orderCount')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>下单人数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('orderNum')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>下单金额</p>
                      <p style={styles.num}>
                        {isNull
                          ? '-'
                          : util.formateMoney(tradeGeneral.get('orderAmt'))}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>付款订单数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('PayOrderCount')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>付款人数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('PayOrderNum')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>付款金额</p>
                      <p style={styles.num}>
                        {isNull
                          ? '-'
                          : util.formateMoney(tradeGeneral.get('payOrderAmt'))}
                      </p>
                    </Col>
                  </Row>
                  <p style={styles.itemheader}>退单</p>
                  <Row style={styles.bgrey}>
                    <Col span={4}>
                      <p style={styles.nav}>退单笔数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('returnOrderCount')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>退单人数</p>
                      <p style={styles.num}>
                        {isNull ? '-' : tradeGeneral.get('returnOrderNum')}
                      </p>
                    </Col>
                    <Col span={4}>
                      <p style={styles.nav}>退单金额</p>
                      <p style={styles.num}>
                        {isNull
                          ? '-'
                          : util.formateMoney(
                              tradeGeneral.get('returnOrderAmt')
                            )}
                      </p>
                    </Col>
                  </Row>
                </div>
                {isNull ? (
                  <div style={styles.emptyData}>
                    <img src={nodataImg} />
                  </div>
                ) : (
                  <div>
                    <div style={styles.filter}>
                      <Paint />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <TradeCharts />
          <div style={styles.content}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={styles.h4}>交易报表</h4>
              <div style={{ display: 'flex' }}>
                <IndicatorPopver
                  selfIndicators={this.store.state().get('recommendIndicators')}
                  popContent={popContent}
                  maxCheckedCount={6}
                  onSubmit={(value) => this.store.changeColumn(value)}
                  checkedArray={this.store.state().get('tableColumns')}
                />
                <DownloadModal visible={false} reportType={1} />
              </div>
            </div>
            <div style={styles.content}>
              <TradeStatisticsList />
            </div>
          </div>
        </div>
        <DataModal />
      </div>
    );
  }
}

const styles = {
  contentChart: {
    background: '#ffffff',
    height: 420
  },
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 18,
    marginBottom: 40,
    display: 'block',
    color: '#444444'
  } as any,
  h4: {
    fontSize: 14,
    color: '#444444'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5,
    fontWeight: 700
  } as any,
  itemheader: {
    fontSize: 14,
    color: '#444444',
    fontWeight: 'bold',
    padding: '20px 0 10px 0'
  } as any,
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    flexGrow: 1
  },
  filter: {
    marginLeft: 20,
    marginTop: 50
  },
  conversionRate: {
    padding: 10,
    color: 'rgb(102, 102, 102)'
  },
  bgrey: {
    background: '#fafafa',
    padding: 15
  },
  emptyData: {
    width: 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any
};
