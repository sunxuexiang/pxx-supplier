import React from 'react';
import { Row, Col, Radio } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';

import { IndicatorPopver } from 'biz';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const noneData = require('./images/nodata.png');

interface WMChartProps {
  isTrade?: boolean;
  title: string;
  startTime: Date;
  endTime: Date;
  currentWeekly?: boolean;
  xAxisKey?: string;
  dataDesc: Array<{
    title: string;
    key: string;
    icon?: string;
    textColor?: string;
    //是否选中
    selected?: boolean;
  }>;
  content: Array<any>;
  radioClickBack: Function;
  height?: number;
  multiYAxis?: boolean;
  weekDisabled?: boolean;
  hasIndicators?: boolean; //是否显示自定义指标
  popContent?: any; //气泡卡片里的内容
  onChecked?: Function;
  rangeVisible?: boolean; //是否显示按天/周切换
  chartCheckedArray?: any; //图表中的自定义指标默认选中
  chartRecommend?: any; //图标中的推荐指标
}

enum RangeType {
  day = 0,
  week = 1
}

const ColorArray = ['#2db7f5', '#7dc856', '#df6898', '#895adf'];

let newData = new Array();
export default class WMChart extends React.Component<WMChartProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      weekDisabled: true,
      visible: false
    };
  }

  static defaultProps = {
    //默认不显示自定义指标
    hasIndicators: false,
    //默认显示按天/周范围
    rangeVisible: true
  };

  componentWillReceiveProps(nextProps) {
    //渲染折线图跨度按钮显示状态
    this._renderDateRange(nextProps);
  }

  render() {
    const {
      title,
      height,
      hasIndicators,
      onChecked,
      popContent,
      rangeVisible,
      content,
      currentWeekly
    } = this.props;
    //容器高度
    const chartHeight = height || 400;
    if (content && content.length > 0) {
      //获取折线图需要的数据
      const option = this._renderChartData();
      return (
        <div style={styles.content}>
          {rangeVisible == false ? null : (
            <Row>
              <Col span={4}>
                <h4 style={styles.h4}>{title}</h4>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  {hasIndicators && (
                    <IndicatorPopver
                      selfIndicators={this.props.chartRecommend}
                      popContent={popContent}
                      maxCheckedCount={1}
                      checkedArray={this.props.chartCheckedArray}
                      onSubmit={value => onChecked(value)}
                    />
                  )}
                  <RadioGroup
                    style={{ marginLeft: 10 }}
                    value={currentWeekly ? RangeType.week : RangeType.day}
                    onChange={e => this._changeRange(e)}
                  >
                    <RadioButton value={RangeType.day}>按天</RadioButton>
                    <RadioButton
                      value={RangeType.week}
                      disabled={this.state.weekDisabled}
                    >
                      按周
                    </RadioButton>
                  </RadioGroup>
                </div>
              </Col>
            </Row>
          )}
          <div style={{ height: { chartHeight } as any }}>
            <div>
              <ReactEchartsCore
                legendselectchanged={() => {}}
                echarts={echarts}
                option={option}
                style={{ height: `${chartHeight}px`, width: '100%' }}
                className="react_for_echarts"
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={styles.content}>
          <h4 style={styles.h4}>{title}</h4>
          <div style={styles.center}>
            <img src={noneData} alt="" />
          </div>
        </div>
      );
    }
  }

  _renderDateRange = nextProps => {
    const startStamp = nextProps.startTime.getTime();
    const endStamp = nextProps.endTime.getTime();
    const range = endStamp - startStamp;
    if (range >= 0) {
      if (range > 8 * 24 * 60 * 60 * 1000) {
        this.setState({ weekDisabled: false });
      } else {
        this.setState({ weekDisabled: true });
      }
    }
  };

  _changeRange = e => {
    const { radioClickBack } = this.props;
    radioClickBack(e.target.value);
  };

  _renderChartData = () => {
    const legend = this._renderLegend();
    let yAxis = [];
    if (this.props.multiYAxis && legend.length > 1) {
      for (let i = 0; i < 2; i++) {
        //百分数的时候写死，格式化
        if (
          legend[i].name == '付款转化率' ||
          legend[i].name == '下单转化率' ||
          legend[i].name == '全店转化率'
        ) {
          yAxis.push({
            name: legend[i]['name'],
            type: 'value',
            axisLabel: { formatter: '{value}%' }
          });
        } else {
          yAxis.push({
            name: legend[i]['name'],
            type: 'value',
            axisLabel: { formatter: '{value}' }
          });
        }
      }
    } else {
      if (
        legend[0].name == '付款转化率' ||
        legend[0].name == '下单转化率' ||
        legend[0].name == '全店转化率'
      ) {
        yAxis.push({ type: 'value', axisLabel: { formatter: '{value}%' } });
      } else {
        yAxis.push({ type: 'value', axisLabel: { formatter: '{value}' } });
      }
    }

    const { content, dataDesc } = this.props;

    let seriesArray = new Array();

    let seriesJson = {};
    content.forEach(valueData => {
      dataDesc.forEach(keyData => {
        let array;
        if (seriesJson[keyData.title]) {
          array = seriesJson[keyData.title];
        } else {
          array = new Array();
          seriesJson[keyData.title] = array;
        }
        array.push(valueData[keyData.key]);
      });
    });

    let count = 0;

    for (let obj in seriesJson) {
      if (this.props.multiYAxis && count == 1) {
        seriesArray.push({
          name: obj,
          type: 'line',
          yAxisIndex: 1,
          data: seriesJson[obj],
          lineStyle: { normal: { color: ColorArray[count] } },
          itemStyle: { normal: { color: ColorArray[count] } }
        });
        break;
      } else {
        seriesArray.push({
          name: obj,
          type: 'line',
          yAxisIndex: this.props.multiYAxis ? count : 0,
          data: seriesJson[obj],
          lineStyle: { normal: { color: ColorArray[count] } },
          itemStyle: { normal: { color: ColorArray[count] } }
        });
      }
      count++;
    }
    let option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let res = params[0].name + '<br/>';
          for (let i = 0; i < params.length; i++) {
            //图表title名称
            let seriesName = params[i].seriesName;
            //值
            let value = params[i].value;
            if (
              seriesName == '下单转化率' ||
              seriesName == '付款转化率' ||
              seriesName == '全店转化率'
            ) {
              //百分率格式化
              res += seriesName + ':' + value + '%' + '<br/>';
            } else {
              res += seriesName + ':' + value + '<br/>';
            }
          }
          return res;
        },
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: { title: '保存报表' }
        },
        right: '30px'
      },
      legend: {
        data: legend
      },
      grid: {
        left: '6%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this._renderXAxisArray()
      },
      yAxis: yAxis,
      series: seriesArray
    };
    return option;
  };

  _renderLegend = () => {
    const { dataDesc } = this.props;
    //组装图例
    const legendArray = new Array();
    dataDesc.forEach(value => {
      let dataObject: any = { name: value.title };
      if (value.icon) {
        dataObject.icon = value.icon;
      }
      legendArray.push(dataObject);
    });
    return legendArray;
  };

  _renderXAxisArray = () => {
    const resultArray = new Array();
    const { content, xAxisKey } = this.props;
    content.forEach(value =>
      resultArray.push(xAxisKey ? value[xAxisKey] : value['title'])
    );
    return resultArray;
  };

  /**
   * 复选框选中改变数据
   * @param checked
   * @param title
   * @param key
   * @private
   */
  _changeData = (checked, title, key) => {
    if (checked) {
      if (newData.length == 2) {
        newData.pop();
      }
      let value = { title: title, key: key };
      newData.push(value);
    } else {
      //取消选中时从数组中移除
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].key == key) {
          newData.splice(i, 1);
        }
      }
    }
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  static: {
    width: 800
  },
  contentRow: {
    padding: 10,
    fontSize: 14
  },
  contentCol: {
    fontSize: 14,
    marginRight: 5
  },
  item: {
    width: 100,
    display: 'inline-block'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0'
  } as any,
  title: {
    fontSize: 14,
    fontWeight: 400
  } as any,
  center: {
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: '#fafafa',
    marginTop: 10
  }
} as any;
