import React from 'react';
import { Icon, Tooltip, Breadcrumb, Radio } from 'antd';
import { StoreProvider } from 'plume2';

import { StatisticsHeader, WMChart, DownloadModal } from 'biz';
import { DataModal, BreadCrumb } from 'qmkit';
import ChinaMap from './component/chinachart/index';

import CustomerStatisticsList from './component/list';
import CustomerStatisticsMultiList from './component/multiList';
import WMPieChart from './component/pieChart';
import AppStore from './store';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

enum dayChoice {
  today = 0,
  yesterday = 1,
  sevenDays = 2,
  thirtyDays = 3
}

enum chartType {
  level = 0,
  area = 1
}

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerStatistics extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {
      currentDayChoice: dayChoice.today,
      currentChart: chartType.area
    };
  }

  componentWillMount() {
    this.store.init();
  }

  render() {
    const currentDayChoice = this.state.currentDayChoice;
    const currentChart = this.state.currentChart;

    const viewData = this.store.state().get('viewData');
    const chartData = this.store.state().get('chartData');
    const dateRange = this.store.state().get('dateRange');

    if (!viewData.get('isInit') && viewData.get('isInit') == 0) {
      return null;
    }

    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>客户统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="newContent">
          <div style={styles.content}>
            <div>
              <h4 style={styles.h4}>客户概况</h4>
              <div style={{ marginBottom: 16 }}>
                <div style={styles.headBox}>
                  <ul style={styles.box}>
                    <li>
                      <a
                        className={
                          currentDayChoice == dayChoice.today
                            ? 'statisticsItemCur'
                            : 'statisticsItem'
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.today)
                        }
                      >
                        今天
                      </a>
                    </li>
                    <li>
                      <a
                        className={
                          currentDayChoice == dayChoice.yesterday
                            ? 'statisticsItemCur'
                            : 'statisticsItem'
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.yesterday)
                        }
                      >
                        昨天
                      </a>
                    </li>
                    <li>
                      <a
                        className={
                          currentDayChoice == dayChoice.sevenDays
                            ? 'statisticsItemCur'
                            : 'statisticsItem'
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.sevenDays)
                        }
                      >
                        7天前
                      </a>
                    </li>
                    <li>
                      <a
                        className={
                          currentDayChoice == dayChoice.thirtyDays
                            ? 'statisticsItemCur'
                            : 'statisticsItem'
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.thirtyDays)
                        }
                      >
                        30天前
                      </a>
                    </li>
                  </ul>

                  <div style={{ textAlign: 'right' }}>
                    <Tooltip placement="left" title={this._renderTitle}>
                      <a style={{ fontSize: 14 }}>
                        <Icon type="question-circle-o" />
                        &nbsp;&nbsp;统计说明
                      </a>
                    </Tooltip>
                  </div>
                </div>

                <div style={styles.rowAway}>
                  <div>
                    <p style={styles.total}>客户总数</p>
                    <h2 style={styles.h2}>
                      {viewData.get('total') ? viewData.get('total') : 0}
                    </h2>
                  </div>
                  <div>
                    <RadioGroup
                      value={currentChart}
                      onChange={(e) =>
                        this._changeChoice('chart', (e as any).target.value)
                      }
                    >
                      {/*  <RadioButton value={chartType.level}>
                        等级分布
                    </RadioButton>*/}
                      <RadioButton value={chartType.area}>地区分布</RadioButton>
                    </RadioGroup>
                  </div>
                </div>

                {viewData &&
                viewData.get('viewList') &&
                viewData.get('viewList').size > 0 ? (
                  <div style={{ height: 400 }}>
                    {currentChart == 0 ? (
                      <WMPieChart
                        content={viewData.get('viewList').toJS()}
                        height={400}
                      />
                    ) : (
                      <ChinaMap
                        title="客户地区分布1"
                        style={{ height: '400px' }}
                        dataJson={viewData.get('viewList').toJS()}
                        height={400}
                        showProvince={false}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ height: 400 }}>
                    {currentChart == 0 ? (
                      <WMPieChart
                        content={[
                          {
                            levelId: '-1',
                            levelName: '无',
                            centage: '100.00%',
                            num: 0
                          }
                        ]}
                        height={400}
                      />
                    ) : (
                      <ChinaMap
                        title="客户地区分布2"
                        style={{ height: '400px' }}
                        dataJson={[]}
                        height={400}
                        showProvince={false}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <StatisticsHeader
            noTitle={true}
            onClick={(param) =>
              this.store.setDateRange(param[0], param[1], param[2])
            }
          />

          {chartData && (
            <WMChart
              title="客户增长趋势"
              startTime={new Date(dateRange.get('startTime'))}
              endTime={new Date(dateRange.get('endTime'))}
              dataDesc={[
                {
                  title: '客户总数',
                  key: 'customerAllCount'
                },
                {
                  title: '新增客户数',
                  key: 'customerDayGrowthCount'
                }
              ]}
              radioClickBack={(value) => this._dateRangeChanged(value)}
              currentWeekly={this.store.state().get('weekly')}
              content={chartData.toJS()}
              xAxisKey={'xValue'}
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
              <h4 style={styles.h4}>客户增长报表</h4>
              <DownloadModal visible={false} reportType={5} />
            </div>
            <CustomerStatisticsList />
          </div>

          <div style={styles.content}>
            <h4 style={styles.h4}>客户订货报表</h4>
            <CustomerStatisticsMultiList />
          </div>
        </div>

        <DataModal />
      </div>
    );
  }

  _dateRangeChanged = (value) => {
    this.store.getChartData(1 === value);
    this.store.setCurrentChartWeekly(1 === value);
  };

  _changeChoice = async (choiceType, choiceValue) => {
    const currentDayChoice = this.state.currentDayChoice;
    const currentChart = this.state.currentChart;

    if (choiceType == 'day' && choiceValue != currentDayChoice) {
      await this.store.getViewData(choiceValue, currentChart);
      this.setState({ currentDayChoice: choiceValue });
    } else if (choiceType == 'chart' && choiceValue != currentChart) {
      await this.store.getViewData(currentDayChoice, choiceValue);
      this.setState({ currentChart: choiceValue });
    }
  };

  _renderTitle = () => {
    return (
      <div>
        <p>
          <span>1、当前统计不区分PC/H5/APP端；</span>
        </p>
        <p>
          <span>2、当前统计不区分订货端和管理端；</span>
        </p>
        <p>
          <span>
            3、订单在提交成功后纳入统计，订单金额以订单提交成功时为准；
          </span>
        </p>
        <p>
          <span>4、退单在完成后纳入统计，退货金额以退单完成时为准；</span>
        </p>
        <p>
          <span>
            5、统计时间内商品没有销售/退货，客户没有订单/退单，则不在报表中体现；
          </span>
        </p>
      </div>
    );
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
    color: '#333333',
    marginBottom: 16
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
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '80%'
  } as any,
  total: {
    fontSize: 12,
    color: '#666666',
    marginTop: 20
  },
  h2: {
    fontSize: 18,
    color: '#333333'
  },
  rowAway: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  } as any,
  headBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any
};
