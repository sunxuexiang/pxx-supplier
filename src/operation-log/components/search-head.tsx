import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { Const, noop, SelectGroup, AuthWrapper } from 'qmkit';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 日志查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onExportByParams: Function;
      dataList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onExportByParams: noop,
    dataList: 'dataList'
  };

  constructor(props) {
    super(props);

    this.state = {
      search: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      export: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      pickOpen: false,
      pickErrorInfo: ''
    };
  }

  render() {
    const { onSearch, onExportByParams } = this.props.relaxProps;
    const { search, pickOpen, pickErrorInfo } = this.state;
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
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="操作人账号"
                onChange={(e) => {
                  search.opAccount = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="操作人姓名"
                onChange={(e) => {
                  search.opName = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="模块"
                onChange={(value) => {
                  search.opModule = value;
                  this.setState({ search: search });
                }}
              >
                <Option value="">全部</Option>
                <Option value="登录">登录</Option>
                <Option value="商品">商品</Option>
                <Option value="订单">订单</Option>
                <Option value="客户">客户</Option>
                <Option value="营销">营销</Option>
                <Option value="财务">财务</Option>
                <Option value="设置">设置</Option>
                <Option value="账户管理">账户管理</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore="操作类型"
                onChange={(e) => {
                  search.opCode = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="操作内容"
                onChange={(e) => {
                  search.opContext = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={[search.beginTime, search.endTime]}
                value={[search.beginTime, search.endTime]}
                format={Const.DATE_FORMAT}
                showTime={{ format: 'HH:mm' }}
                open={pickOpen}
                allowClear={false}
                renderExtraFooter={() =>
                  pickErrorInfo != '' && (
                    <span style={{ color: 'red' }}>{pickErrorInfo}</span>
                  )
                }
                onChange={this._handleDateParams}
                onOk={this._dateOkBtn}
                {...options}
              />
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  //将搜索条件复制到导出条件
                  const {
                    opAccount,
                    opName,
                    opCode,
                    opModule,
                    opContext,
                    beginTime,
                    endTime
                  } = this.state.search;

                  this.setState({
                    export: {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    }
                  });

                  const params = {
                    opAccount,
                    opName,
                    opCode,
                    opModule,
                    opContext,
                    beginTime,
                    endTime
                  };

                  onSearch(params);
                }}
              >
                搜索
              </Button>
            </FormItem>
            <AuthWrapper functionName="f_operation_log_export">
              <FormItem>
                <Button
                  type="primary"
                  icon="download"
                  onClick={() => {
                    const {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    } = this.state.export;

                    const params = {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    };
                    onExportByParams(params);
                  }}
                >
                  导出
                </Button>
              </FormItem>
            </AuthWrapper>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date) => {
    let beginTime = date[0];
    let endTime = date[1];
    let endTimeClone = endTime.clone().subtract(3, 'months');
    //时间相差3个月以内
    const search = this.state.search;
    if (moment(beginTime).isSameOrAfter(moment(endTimeClone))) {
      search.beginTime = beginTime;
      search.endTime = endTime;
      this.setState({ pickErrorInfo: '', search: search });
    } else {
      search.beginTime = beginTime;
      search.endTime = beginTime.clone().add(3, 'months');
      this.setState({
        pickErrorInfo: '开始时间和结束时间需在三个月之内',
        search: search
      });
    }
  };

  _dateOkBtn = () => {
    const { pickErrorInfo } = this.state;
    if (pickErrorInfo === '') {
      this.setState({ pickOpen: false });
    } else {
      this.setState({ pickOpen: true });
    }
  };
}
