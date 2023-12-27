import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, DataGrid, QMMethod } from 'qmkit';
import { Modal, Form, Input, Tooltip, Table } from 'antd';
import moment from 'moment';
import { fromJS, Set } from 'immutable';
import SearchForm from './search-form';
import * as webapis from './webapi';
const { Column } = Table;

const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

// @Relax
export default class ActivityModal extends React.Component<any, any> {
  // _rejectForm;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isModalVisible: props.isVisible,
      searchParams: {},
      total: 0,
      companyInfoPage: {
        content: [],
        totalElements: 0,
        number: 0,
        size: 10
      },
      selectedRowKeys: props.selectedRowKeys.toJS(),
      selectedRows: props.selectedRows.toJS()
    };
  }

  componentDidMount() {
    this.init({});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isModalVisible: nextProps.isVisible
    });
    console.log(nextProps.isModalVisible, 'nextProps.isModalVisible');
    if (nextProps.isModalVisible) {
      this.init({});
    }
  }

  render() {
    const {
      isModalVisible,
      loading,
      companyInfoPage,
      selectedRowKeys,
      selectedRows
    } = this.state;
    return (
      <Modal
        title="选择优惠券活动"
        visible={isModalVisible}
        width={1100}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <SearchForm
          searchBackFun={(searchParams) => this.searchBackFun(searchParams)}
        />
        <DataGrid
          loading={loading}
          rowKey={(row) => row.activityId}
          dataSource={companyInfoPage.content}
          columns={this._columns}
          pagination={{
            total: companyInfoPage.totalElements,
            current: companyInfoPage.number + 1,
            pageSize: companyInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              console.log(selectedRowKeys, 'selectedRowKeys');
              console.log(selectedTableRows, 'selectedTableRows');
              // rowChangeBackFun(selectedRowKeys, fromJS(rows));
              this.setState({
                selectedRows: selectedTableRows,
                selectedRowKeys
              });
            },
            getCheckboxProps: (record) => ({
              disabled: record.addedFlag === 0
            })
          }}
        ></DataGrid>
      </Modal>
    );
  }

  _columns = [
    {
      key: 'activityName',
      dataIndex: 'activityName',
      title: '优惠券活动名称',
      align: 'left',
      render: (text) => {
        return <div>{text}</div>;
      }
    },
    {
      key: 'startTime',
      dataIndex: 'startTime',
      title: '开始/结束时间',
      align: 'left',
      render: (text, record) => {
        return (
          <div>
            <p>
              {text
                ? moment(text)
                    .format(Const.TIME_FORMAT)
                    .toString()
                : '-'}
              /{' '}
              {(record as any).endTime
                ? moment((record as any).endTime)
                    .format(Const.TIME_FORMAT)
                    .toString()
                : '-'}
            </p>
          </div>
        );
      }
    },
    {
      key: 'receiveCount',
      dataIndex: 'receiveCount',
      title: '单人限领次数',
      align: 'left',
      render: (text, row) => {
        return <div>{row.receiveType ? row.text : '不限'}</div>;
      }
    },
    {
      key: 'joinLevel',
      dataIndex: 'joinLevel',
      title: '目标客户',
      align: 'left',
      render: (text) => {
        return <div>{this.showTargetCustomer(text)}</div>;
      }
    },
    {
      key: 'pauseFlag',
      dataIndex: 'pauseFlag',
      title: '活动状态',
      align: 'left',
      render: (text) => {
        return Const.activityStatus[text];
      }
    },
    {
      key: 'option',
      dataIndex: 'option',
      title: '操作',
      render: (text, rowInfo) => {
        const { onCouponsDis } = this.props;
        return (
          <a onClick={() => onCouponsDis(rowInfo.activityId)}>查看优惠券</a>
        );
      }
    }
  ];

  handleOk = () => {
    console.log('确定');
    const { onOk } = this.props;
    onOk(this.state.selectedRowKeys, this.state.selectedRows);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    console.log('取消');
  };

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      searchParams: { pageNum, pageSize }
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    let { res } = await webapis.getPage({
      ...params,
      queryTab: '0',
      sendType: 1
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      let activityList = res.context.content;
      const now = moment();
      activityList = activityList.map((item) => {
        //设置活动状态
        let pauseFlag;
        const flag = item.pauseFlag;
        if (item.startTime != null && item.endTime != null) {
          // 常规赠券活动有开始时间结束时间
          const startTime = moment(item.startTime);
          const endTime = moment(item.endTime);
          if (endTime.isBefore(now)) {
            pauseFlag = 4;
          } else if (startTime.isAfter(now)) {
            pauseFlag = 3;
          } else if (now.isBetween(startTime, endTime)) {
            if (flag == 1) {
              pauseFlag = 2;
            } else {
              pauseFlag = 1;
            }
          }
        } else if (item.couponActivityType == 4) {
          // 权益赠券活动
          if (flag == 1) {
            pauseFlag = 2;
          } else {
            pauseFlag = 1;
          }
        }
        item.pauseFlag = pauseFlag;
        return item;
      });
      this.setState(
        {
          companyInfoPage: { ...res['context'], content: activityList },
          loading: false
        },
        () => {
          console.log(this.state.companyInfoPage, 'companyInfoPage');
        }
      );
    }
  };

  /**
   * 展示目标客户
   */
  showTargetCustomer(text) {
    // const { levelList } = this.props.relaxProps;
    if (text == null) {
      return;
    }
    if (-1 == text) {
      return '全平台客户';
    } else if (-2 == text) {
      return '指定客户';
    } else if (+text === -3) {
      return '指定人群';
    } else if (-4 == text) {
      return '企业会员';
    } else {
      return '其他';
    }
  }

  /**
   * 清空搜索条件
   */
  clearSearchParam = () => {
    this.setState({ searchParams: {} });
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
