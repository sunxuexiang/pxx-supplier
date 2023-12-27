import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';

const { RangePicker } = DatePicker;

export default class WmRangePicker extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    this.state = {
      // 选择的时间区间
      choseRange: null,
      // 可选的时间区间
      enableRange: null,
      timeRanges: []
    };
  }

  render() {
    const { value, onChange, placeholder, getCalendarContainer, isDateTime = false } = this.props;

    return (
      <RangePicker
        getCalendarContainer={() => getCalendarContainer()}
        placeholder={placeholder}
        value={value}
        disabledDate={this._disabledDate}
        format={isDateTime ? Const.TIME_FORMAT : Const.DATE_FORMAT}
        showTime={{ format: isDateTime ? 'HH:mm' : 'HH:mm:ss'}}
        onCalendarChange={(data) => {
          this.setState({ choseRange: data });
          this._calcEnableRange(data[0]);
        }}
        onChange={(data, dateStrings) => {
          if (data.length == 0) {
            this.setState({
              choseRange: null,
              enableRange: null,
              timeRanges: []
            });
          }
          onChange(data, dateStrings);
        }}
      />
    );
  }

  /**
   * 判定日历上展示的日期是否需要禁用
   * @param current 日历上的某个日期
   */
  _disabledDate = (current) => {
    if (!current) return;
    let enableRange = this.state.enableRange;
    let { disableRanges, format } = this.props as any;
    //
    if (current && current.isBefore(moment().startOf('day'))){
      return true;
    }
    if (enableRange == null) {
      // 情况1：第一次渲染日期组件时，直接禁用禁用区间中完整包含的日期
      let flag = false;
      if (!disableRanges) {
        return flag;
      }
      disableRanges.forEach((range) => {
        const startTime = moment(range.startTime, format);
        //结束时间是23：59：59 在比较时要加一天（因为比较精确到天）
        const endTime = moment(range.endTime, format).add(1, 'd');
        // 1.禁用禁用区间内的日期
        if (current.isBetween(startTime, endTime, 'day')) {
          flag = true;
        }
        // 2.根据情况禁用区间开始日期
        if (
          current.isSame(startTime, 'day') &&
          startTime.isSame(dayHead(startTime))
        ) {
          // 如果日期为禁用区间头部日期，且禁用区间从0时0分0秒开始，则禁用该日期
          flag = true;
        }
      });
      return flag;
    } else {
      // 情况2：选择了日期后，根据选择的开始时间算出的可用区间计算禁用日期
      let flag = false;
      const min = enableRange[0];
      const max = enableRange[1];
      if (min && !current.isAfter(min, 'day')) {
        flag = true;
      }
      if (max && !current.isBefore(max, 'day')) {
        flag = true;
      }
      return flag;
    }
  };

  _calcEnableRange = (startTime) => {
    let { disableRanges } = this.props as any;
    if (!disableRanges || disableRanges.length == 0) return;

    const index = disableRanges.findIndex((range) => {
      return !startTime.isAfter(range.startTime, 'day');
    });
    if (index == -1) {
      // 选择时间大于禁用区间组，禁用小于禁用区间组最大日期的日期
      const max = disableRanges[disableRanges.length - 1].endTime;
      this.setState({
        enableRange: [max, null]
      });
    } else if (index == 0) {
      // 选择时间小于禁用区间组，禁用大于禁用区间组最小日期的日期
      const min = disableRanges[0].startTime;
      this.setState({
        enableRange: [null, min]
      });
    } else {
      // 选择时间在两区间中间，禁用前一区间最大值与后一区间最小值中的数
      const min = disableRanges[index - 1].endTime;
      const max = disableRanges[index].startTime;
      this.setState({
        enableRange: [min, max]
      });
    }
  };
}

/**
 * 获得指定日期 最早时间
 */
const dayHead = (date) => {
  return date
    .clone()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0);
};
