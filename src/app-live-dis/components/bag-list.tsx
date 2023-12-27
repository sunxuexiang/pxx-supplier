import React from 'react';
import { Relax } from 'plume2';
import { Table, Modal, Form } from 'antd';
import { IList } from 'typings/globalType';
import { noop, Const } from 'qmkit';
import Moment from 'moment';
import LiveBagSearch from './live-bag-search-form';

const LiveBagSearchForm = Relax(Form.create()(LiveBagSearch));

@Relax
export default class VouchersList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      liveBagList: IList;
      isModalVisible: boolean;
      liveVouchersInfoList: IList;
      onVouchersRecord: Function;
      changeLiveInfo: Function;
    };
  };

  static relaxProps = {
    liveBagList: 'liveBagList',
    isModalVisible: 'isModalVisible',
    liveVouchersInfoList: 'liveVouchersInfoList',
    // goodsInfoList: 'goodsInfoList',
    onVouchersRecord: noop,
    changeLiveInfo: noop
  };
  state = {
    liveVouchersInfoList: []
  };

  render() {
    const {
      liveBagList
      // liveVouchersInfoList,
      // isModalVisible,
      // changeLiveInfo
    } = this.props.relaxProps;
    return (
      <div>
        {/* 搜索项区域 */}
        <LiveBagSearchForm />
        <Table
          rowKey="liveBagId"
          dataSource={liveBagList.toJS()}
          columns={this._columns}
        />
        {/* <Modal
          title="查看福袋记录"
          visible={isModalVisible}
          onCancel={() => changeLiveInfo('isModalVisible', false)}
          footer={null}
          width={1000}
        >
          <Table
            rowKey="liveVouchersInfoList"
            dataSource={liveVouchersInfoList.toJS()}
            columns={this.record_columns}
          />
        </Modal> */}
      </div>
    );
  }

  record_columns = [
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '福袋场次'
    },
    {
      key: 'bagName',
      dataIndex: 'bagName',
      title: '奖品名称'
    },
    {
      key: 'winningNumber',
      dataIndex: 'winningNumber',
      title: '中奖名额（个）'
    },
    {
      key: 'lotteryTime',
      dataIndex: 'lotteryTime',
      title: '开奖时间（分钟）'
    },
    {
      key: 'joinType',
      dataIndex: 'joinType',
      title: '用户参与方式',
      render: (_row) => {
        return '指定内容';
      }
    },
    {
      key: 'ticketWay',
      dataIndex: 'ticketWay',
      title: '中奖用户兑奖方式',
      render: (_row) => {
        return '自动发放';
      }
    },
    {
      key: 'joinContent',
      dataIndex: 'joinContent',
      title: '奖品内容'
    },
    {
      key: 'provideStatus',
      dataIndex: 'provideStatus',
      title: '状态',
      render: (_row) => {
        return _row ? '已发放' : '未发放';
      }
    },
    {
      key: 'provideNums',
      dataIndex: 'provideNums',
      title: '发放次数'
    },
    {
      key: 'customerAccounts',
      dataIndex: 'customerAccounts',
      title: '中奖记录'
    }
  ];

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'ticketTime',
      dataIndex: 'ticketTime',
      title: '福袋场次'
    },
    {
      key: 'joinContent',
      dataIndex: 'joinContent',
      title: '奖品名称'
    },
    {
      key: 'winningNumber',
      dataIndex: 'winningNumber',
      title: '中奖名额（个）'
    },
    {
      key: 'lotteryTime',
      dataIndex: 'lotteryTime',
      title: '开奖时间（分钟）'
    },
    {
      key: 'joinType',
      dataIndex: 'joinType',
      title: '用户参与方式',
      render: (_row) => {
        return '指定内容';
      }
    },
    {
      key: 'ticketWay',
      dataIndex: 'ticketWay',
      title: '中奖用户兑奖方式',
      render: (_row) => {
        return '自动发放';
      }
    },
    {
      key: 'joinContent',
      dataIndex: 'joinContent',
      title: '奖品内容'
    },
    {
      key: 'provideStatus',
      dataIndex: 'provideStatus',
      title: '状态',
      render: (_row) => {
        return _row ? '已发放' : '未发放';
      }
    },
    {
      key: 'provideNums',
      dataIndex: 'provideNums',
      title: '发放次数'
    },
    {
      key: 'customerAccounts',
      dataIndex: 'customerAccounts',
      title: '中奖记录'
    }
  ];
}
