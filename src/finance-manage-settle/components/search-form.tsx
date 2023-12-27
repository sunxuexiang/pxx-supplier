import React from 'react';

import { Button, Form, DatePicker, AutoComplete } from 'antd';
import moment from 'moment';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';

const FormItem = Form.Item;
const AutoOption = AutoComplete.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      storeQueryParams: Function;
      fetchSettleList: Function;
      queryStoreByName: Function;
      storeMap: IMap;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    storeQueryParams: noop,
    fetchSettleList: noop,
    queryStoreByName: noop,
    storeMap: 'storeMap',
    queryParams: 'queryParams'
  };

  constructor(props) {
    super(props);
    this.state = {
      startTime: props.relaxProps.queryParams.get('startTime'),
      endTime: props.relaxProps.queryParams.get('endTime'),
      pickOpen: false,
      pickErrorInfo: ''
    };
  }

  render() {
    const { fetchSettleList } = this.props.relaxProps;
    const { startTime, endTime, pickOpen, pickErrorInfo } = this.state;
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
              value={[startTime, endTime]}
              open={pickOpen}
              onOpenChange={() => this.setState({ pickErrorInfo: '' })}
              {...options}
            />
          </FormItem>

          {/*<FormItem>*/}
          {/*<DatePicker*/}
          {/*disabledDate={this.disabledStartDate}*/}
          {/*format="YYYY-MM-DD"*/}
          {/*value={startTime}*/}
          {/*placeholder="开始时间"*/}
          {/*allowClear={false}*/}
          {/*onChange={this.onStartChange}*/}
          {/*/>*/}
          {/*</FormItem>*/}
          {/*<FormItem>*/}
          {/*<DatePicker*/}
          {/*disabledDate={this.disabledEndDate}*/}
          {/*format="YYYY-MM-DD"*/}
          {/*value={endTime}*/}
          {/*placeholder="结束时间"*/}
          {/*allowClear={false}*/}
          {/*onChange={this.onEndChange}*/}
          {/*/>*/}
          {/*</FormItem>*/}

          {/*<FormItem>*/}
          {/*<AutoComplete*/}
          {/*size="default"*/}
          {/*style={{width: 180}}*/}
          {/*dataSource={this._renderOption(storeMap.toJS())}*/}
          {/*onSelect={(value) => storeQueryParams('storeId', value)}*/}
          {/*onChange={(value) => this._handleOnStoreNameChange(value)}*/}
          {/*allowClear={true}*/}
          {/*placeholder='店铺名称'*/}
          {/*/>*/}
          {/*</FormItem>*/}
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                fetchSettleList();
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
    let endTimeClone = endTime.clone().subtract(3, 'months');
    if (
      moment(startTime.format('YYYY-MM-DD')).isSameOrAfter(
        moment(endTimeClone.format('YYYY-MM-DD'))
      )
    ) {
      this.setState({ pickOpen: false, pickErrorInfo: '', startTime, endTime });
      const { storeQueryParams } = this.props.relaxProps;
      storeQueryParams('startTime', startTime);
      storeQueryParams('endTime', endTime);
    } else {
      this.setState({
        pickOpen: true,
        pickErrorInfo: '开始时间和结束时间需在三个月之内'
      });
    }
  };

  /**
   * 根据商铺名称模糊查询
   * @param value
   * @private
   */
  _handleOnStoreNameChange = (value) => {
    const { queryStoreByName, storeQueryParams } = this.props.relaxProps;
    if (value) {
      queryStoreByName(value);
    } else {
      storeQueryParams('storeId', null);
      storeQueryParams('storeName', null);
    }
  };

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = (storeMap) => {
    let optionArray = [];
    for (let store in storeMap) {
      optionArray.push(<AutoOption key={store}>{storeMap[store]}</AutoOption>);
    }
    return optionArray;
  };

  /**
   * 控制开始时间范围
   * @param startTime
   * @returns {boolean}
   */
  disabledStartDate = (startTime: any) => {
    //startTime  是指： start弹层 当前的44个日期每翻页一次，就执行一次，跟选中的 endVlaue 进行比较
    const { endTime } = this.state;
    if (!startTime || !endTime) {
      return false;
    }
    let endTimeClone: any = endTime.clone();
    return (
      startTime.valueOf() > endTimeClone.valueOf() ||
      startTime.valueOf() < endTimeClone.subtract(3, 'months').valueOf()
    );
  };

  /**
   * 控制结束时间范围
   * @param endTime
   * @returns {boolean}
   */
  disabledEndDate = (endTime: any) => {
    //endVlaue  是指： end弹层 当前的44个日期每翻页一次，就执行一次，跟选中的 startVlaue 进行比较
    const { startTime } = this.state;
    if (!endTime || !startTime) {
      return false;
    }
    let startTimeClone: any = startTime.clone();
    return (
      endTime.valueOf() <= startTimeClone.valueOf() ||
      endTime.valueOf() > startTimeClone.add(3, 'months').valueOf()
    );
  };

  onChange = (field: any, value: any) => {
    this.setState({
      [field]: value
    });
    this._handleDateParams(field, value);
  };

  onStartChange = (value: any) => {
    this.onChange('startTime', value);
  };

  onEndChange = (value: any) => {
    this.onChange('endTime', value);
  };
}
