import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Button, Form, DatePicker } from 'antd';

import { noop } from 'qmkit';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      beginTime: moment(nextProps.relaxProps.dateRange.get('beginTime')),
      endTime: moment(nextProps.relaxProps.dateRange.get('endTime')),
      pickErrorInfo: ''
    });
  }

  state = {
    beginTime: moment(this.props.relaxProps.dateRange.get('beginTime')),
    endTime: moment(this.props.relaxProps.dateRange.get('endTime')),
    pickOpen: false,
    pickErrorInfo: ''
  };

  props: {
    relaxProps?: {
      dateRange: any;
      //改变日期范围
      changeDateRange: Function;
      //根据日期搜索
      searchByDate: Function;
    };
  };

  static relaxProps = {
    dateRange: 'dateRange',
    changeDateRange: noop,
    searchByDate: noop
  };

  render() {
    const { searchByDate } = this.props.relaxProps;
    const { beginTime, endTime, pickOpen, pickErrorInfo } = this.state;
    const options = {
      onFocus: () => {
        this.setState({ pickOpen: true });
      },
      onBlur: () => {
        this.setState({ pickOpen: false });
      }
    };
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format="YYYY-MM-DD"
              placeholder={['起始时间', '结束时间']}
              onChange={(date, dateString) =>
                this._handleDateParams(date, dateString)
              }
              renderExtraFooter={() =>
                pickErrorInfo != '' && (
                  <span style={{ color: 'red' }}>{pickErrorInfo}</span>
                )
              }
              value={[beginTime, endTime]}
              open={pickOpen}
              onOpenChange={() => this.setState({ pickErrorInfo: '' })}
              {...options}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                searchByDate();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date, _dateString) => {
    let startTime = date[0];
    let endTime = date[1];
    let endTimeClone: any = endTime.clone();
    if (startTime.valueOf() >= endTimeClone.subtract(3, 'months').valueOf()) {
      this.setState({ pickOpen: false, pickErrorInfo: '' });
      const { changeDateRange } = this.props.relaxProps;
      changeDateRange('beginTime', startTime.format('YYYY-MM-DD').toString());
      changeDateRange('endTime', endTime.format('YYYY-MM-DD').toString());
    } else {
      this.setState({
        pickOpen: true,
        pickErrorInfo: '开始时间和结束时间需在三个月之内'
      });
    }
  };
}
