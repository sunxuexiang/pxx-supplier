import React from 'react';
import {
  Modal,
  DatePicker,
  Form,
  Radio,
  message,
  Alert,
  Button,
  Icon
} from 'antd';
import { noop, util, Const, history, cache } from 'qmkit';
import * as weapi from './webapi';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface ModalProps {
  visible?: boolean;
  onDownLoad?: Function;
  dateRange?: any;
  reportType?: number; //下载的报表类型枚举
  onCancel?: Function; //弹框关闭事件
}

export default class DownloadModal extends React.Component<ModalProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      showConfirm: false,
      onCancel: noop,
      dateRange: props.dateRange || [],
      calenderDateRange: [],
      checkedValue: 0, //单选按钮初始选中的值，默认为0，表示两个都不选中
      //提示弹框
      infoVisible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  render() {
    const { visible } = this.state;

    return (
      <div>
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => this.setState({ visible: true })}
        >
          <Icon type="download" />下载报表
        </Button>

        <Modal
          maskClosable={false}
          title="下载报表"
          visible={visible}
          onOk={() => this._handleOK()}
          onCancel={() => this._hideModal()}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <FormItem>
              <RangePicker
                onChange={(param) => this._changeCalender(param)}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                format="YYYY-MM-DD"
                placeholder={['起始时间', '结束时间']}
                onOk={noop}
                value={this.state.calenderDateRange}
                disabledDate={this.disabledDate}
              />
            </FormItem>
            <RadioGroup
              style={{ marginBottom: '24px', width: 230, marginLeft: 10 }}
              value={this.state.checkedValue}
              onChange={(e) => this._onChange(e)}
            >
              <Radio value={30}>最近30天</Radio>
              <Radio value={90}>最近90天</Radio>
            </RadioGroup>
          </div>
          <div>
            <Alert message={this._renderMessage()} />
          </div>
        </Modal>

        <Modal
          maskClosable={false}
          title="下载报表"
          visible={this.state.infoVisible}
          okText="关闭"
          cancelText="查看进度"
          onCancel={() => {
            history.push({
              pathname: '/download-report'
            });
          }}
          onOk={() => this.setState({ infoVisible: false })}
        >
          <div>
            <p>
              下载任务已进入队列,可能需要花费一些时间,请稍后在报表下载中心查看!
            </p>
          </div>
        </Modal>
      </div>
    );
  }

  /**
   * 禁选择的日期
   * @param current
   * @returns {any|boolean}
   */
  disabledDate(current) {
    //当天日期往后（包括当天）及当天日期一年前，禁选
    return (
      current &&
      (current.valueOf() > Date.now() - 24 * 60 * 60 ||
        current < moment().subtract(366, 'days'))
    );
  }

  /**
   * alert里面的内容
   * @returns {any}
   * @private
   */
  _renderMessage = () => {
    return (
      <div>
        <p>数据导出说明:</p>
        <p>1、我们可为您导出1年内的数据；</p>
        <p>2、我们默认为您导出所有统计指标的数据；</p>
        <p>3、导出时间跟导出数据量的大小有关，请耐心等待；</p>
        <p>4、如果导出的数据超过5000条，我们将会自动为您拆成多个任务处理；</p>
      </div>
    );
  };

  /**
   * 弹框确定事件
   * @returns {Promise<void>}
   * @private
   */
  _handleOK = async () => {
    //获取当前的companyId
    const companyId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .companyInfoId;
    //报表类型，开始时间和结束时间
    const { reportType } = this.props;
    let beginDate = this.state.dateRange[0];
    let endDate = this.state.dateRange[1];
    if (this.state.dateRange.length == 0) {
      //空数组，未选中起止日期
      message.error('请选择您要导出的日期范围');
    } else {
      const { res } = await weapi.downLoadReport({
        companyInfoId: companyId,
        beginDate: beginDate,
        endDate: endDate,
        typeCd: reportType
      });
      if (res.code == Const.SUCCESS_CODE) {
        this.setState({
          visible: false,
          showConfirm: true,
          infoVisible: true
        });
        // confirm({
        //   title: '下载报表',
        //   content: '下载任务已进入队列，可能需要花费一些时间，请稍后在报表下载中心查看',
        //   okText: '关闭',
        //   cancelText: '查看进度',
        //   onOk() {
        //     console.log('OK');
        //   },
        //   onCancel() {
        //     history.push({
        //       pathname: `/download-report`,
        //     })
        //   },
        // });
      } else {
        message.error(res.message);
      }
    }
  };

  /**
   * 隐藏模态框
   * @private
   */
  _hideModal = async () => {
    this.setState({
      visible: false
    });
  };

  /**
   * 获取近30天的时间范围
   * @private
   */
  _recentThirtyDays = () => {
    //昨天
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    //获取30天前的日期
    const monthago = new Date(new Date().getTime() - 24 * 30 * 60 * 60 * 1000);
    let rangeDate = new Array();
    rangeDate.push(util.formateDate(monthago), util.formateDate(yesterday));
    return rangeDate;
  };

  /**
   * 获取近90天的时间范围
   * @private
   */
  _recentNintyDays = () => {
    //昨天
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    //获取90天前的日期
    const nintyago = new Date(new Date().getTime() - 24 * 90 * 60 * 60 * 1000);
    let rangeDate = new Array();
    rangeDate.push(util.formateDate(nintyago), util.formateDate(yesterday));
    return rangeDate;
  };

  /**
   * 单选按钮选中事件
   * @param e
   * @private
   */
  _onChange = (e) => {
    if (e.target.value == 30) {
      //最近30天
      this.setState({
        dateRange: this._recentThirtyDays(),
        checkedValue: 30
      });
    } else {
      //最近90天
      this.setState({
        dateRange: this._recentNintyDays(),
        checkedValue: 90
      });
    }
    //覆盖日历控件的选中
    this.setState({
      calenderDateRange: []
    });
  };

  /**
   * 日历控件日期改变
   * @param params
   * @private
   */
  _changeCalender = (params) => {
    let rangeDate = new Array();
    let beginTime;
    let endTime;
    if (params.length > 0) {
      beginTime = params[0].format(Const.DAY_FORMAT);
      endTime = params[1].format(Const.DAY_FORMAT);
      rangeDate.push(beginTime, endTime);
    }
    this.setState({
      dateRange: rangeDate,
      calenderDateRange: params,
      //覆盖单选按钮的选中
      checkedValue: 0
    });
  };
}
