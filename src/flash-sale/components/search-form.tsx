import React from 'react';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import { Relax } from 'plume2';
import { Const, noop } from 'qmkit';

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      changeStartTime: Function;
      activityKey: number;
      timeValue: any;
    };
  };

  static relaxProps = {
    onSearch: noop,
    changeStartTime: noop,
    activityKey: 'activityKey',
    timeValue: 'timeValue'
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log('SearchForm-render');
    const { onSearch,timeValue } = this.props.relaxProps;
    return (
      <div style={{ marginTop: 10 }}>
        <DatePicker
          allowClear={true}
          format={Const.DAY_FORMAT}
          value={timeValue}
          onChange={this.onStartChange}
          showToday={false}
          // disabledDate={this._disabledDate}
          style={{ marginRight: 15 }}
        />
        <Button
          type="primary"
          icon="search"
          onClick={() => {
            onSearch();
          }}
        >
          搜索
        </Button>
      </div>
    );
  }

  onStartChange = (value) => {
    const { changeStartTime } = this.props.relaxProps;

    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    changeStartTime(
      {
        fullTimeBegin: time
      },
      value
    );
  };

  _disabledDate = (value) => {
    if (this.props.relaxProps.activityKey == 0) {
      return value <= moment();
    } else if (this.props.relaxProps.activityKey == 2) {
      return value >= moment();
    }
  };
}
