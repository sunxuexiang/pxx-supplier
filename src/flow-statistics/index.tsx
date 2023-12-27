import React from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { WMChart, StatisticsHeader, DownloadModal } from 'biz';
import { DataModal, BreadCrumb } from 'qmkit';

import FlowStatisticsList from './component/list';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FlowStatistics extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const flowData = this.store.state().get('flowData');
    const hasNoData =
      flowData.get('flowList') && flowData.get('flowList').size == 0;
    const dateRange = this.store.state().get('dateRange');

    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>流量统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="newContent">

          <StatisticsHeader
            onClick={(param) =>
              this.store.setDateRange(param[0], param[1], param[2])
            }
          />

          <div style={styles.content}>
            <div >
              <h4 style={styles.h4}>流量概况</h4>
              <div style={styles.static}>
                <Row>
                  <Col span={6}>
                    <p style={styles.nav}>访客数UV</p>
                    <p style={styles.num}>
                      {hasNoData ? '0' : flowData.get('totalUv')}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p style={styles.nav}>浏览量PV</p>
                    <p style={styles.num}>
                      {hasNoData ? '0' : flowData.get('totalPv')}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p style={styles.nav}>商品访客数</p>
                    <p style={styles.num}>
                      {hasNoData ? '0' : flowData.get('skuTotalUv')}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p style={styles.nav}>商品浏览量</p>
                    <p style={styles.num}>
                      {hasNoData ? '0' : flowData.get('skuTotalPv')}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          {flowData &&
            flowData.get('flowList') && (
              <WMChart
                title="流量趋势"
                startTime={new Date(dateRange.get('startTime'))}
                endTime={new Date(dateRange.get('endTime'))}
                dataDesc={[
                  { title: '访客数UV', key: 'totalUv' },
                  { title: '浏览量PV', key: 'totalPv' },
                  {
                    title: '商品访客数',
                    key: 'skuTotalUv'
                  },
                  { title: '商品浏览量', key: 'skuTotalPv' }
                ]}
                radioClickBack={(value) => this._dateRangeChanged(value)}
                currentWeekly={this.store.state().get('weekly')}
                content={flowData.get('flowList').toJS()}
              />
            )}

          <div style={styles.content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <h4 style={styles.h4}>流量报表</h4>
              <DownloadModal visible={false} reportType={0} />
            </div>
            <FlowStatisticsList />
          </div>
        </div>

        <DataModal />
      </div>
    );
  }

  /**
   * 折线图点击按周按钮之后。。
   * @param value （1：按周，0：按天）
   * @private
   */
  _dateRangeChanged = (value) => {
    this.store.getFlowData(1 === value);
    this.store.setCurrentChartWeekly(1 === value);
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    display: 'block',
    color: '#333333'
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#333333',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginTop: 10
  }
};
