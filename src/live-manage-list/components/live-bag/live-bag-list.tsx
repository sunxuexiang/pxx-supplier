import React from 'react';
import { Relax } from 'plume2';
import { noop, history, Const, AuthWrapper } from 'qmkit';
import { Table, Switch } from 'antd';
import { IList } from 'typings/globalType';
import Moment from 'moment';
// import OnlinelService from 'src/online-service';

const styles = {
  edit: {
    paddingRight: 10
  },
  liveGoods: {
    width: 40,
    height: 40,
    marginLeft: 5
  }
} as any;

@Relax
export default class LiveBagList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      LiveBagLoading: boolean;
      LiveBagTotal: number;
      LiveBagPageSize: number;
      liveListBagDataList: IList;
      LiveBagCurrent: number; //当前页
      // liveListGoodsDataList: IList; //直播商品列表
      queryLiveBagPage: Function; //分页查数据
      // changeRecommend: Function; //改变推荐状态
      onlinelBagIssue: Function;
      onlinelBagDel: Function;
      onLiveStreamSendMessage: Function;
      onAdd: Function;
    };
  };

  static relaxProps = {
    LiveBagLoading: 'LiveBagLoading',
    LiveBagTotal: 'LiveBagTotal',
    LiveBagPageSize: 'LiveBagPageSize',
    liveListBagDataList: 'liveListBagDataList',
    LiveBagCurrent: 'LiveBagCurrent',
    // liveListGoodsDataList: 'liveListGoodsDataList',
    queryLiveBagPage: noop,
    // changeRecommend: noop,
    onlinelBagIssue: noop,
    onlinelBagDel: noop,
    onLiveStreamSendMessage: noop,
    onAdd: noop
  };

  render() {
    const {
      LiveBagLoading,
      LiveBagTotal,
      LiveBagPageSize,
      liveListBagDataList,
      LiveBagCurrent,
      queryLiveBagPage
    } = this.props.relaxProps;
    console.log(liveListBagDataList.toJS());
    return (
      <Table
        rowKey={(e) => e.liveBagId}
        dataSource={liveListBagDataList.toJS() || []}
        columns={this._columns}
        loading={LiveBagLoading}
        pagination={{
          total: LiveBagTotal,
          pageSize: LiveBagPageSize,
          current: LiveBagCurrent,
          onChange: (pageNum, pageSize) => {
            queryLiveBagPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
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
      key: 'joinContent1',
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
      key: 'createTime',
      dataIndex: 'createTime',
      title: '直播时间'
    },
    {
      key: 'option1',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    const {
      onLiveStreamSendMessage,
      onlinelBagDel,
      onAdd
    } = this.props.relaxProps;
    return (
      <div>
        <AuthWrapper functionName="f_app_live_bag_push">
          <a
            style={styles.edit}
            href="javascript:void(0);"
            onClick={() => {
              onLiveStreamSendMessage(7, rowInfo.liveBagId);
            }}
          >
            {rowInfo.provideStatus ? '再次发放' : '开始发放'}
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_app_live_bag_edit">
          <a
            style={styles.edit}
            href="javascript:void(0);"
            onClick={() => {
              onAdd(rowInfo.liveBagId);
            }}
          >
            编辑
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="f_app_live_bag_del">
          <a
            style={styles.edit}
            href="javascript:void(0);"
            onClick={() => {
              onlinelBagDel(rowInfo.liveBagId);
            }}
          >
            删除
          </a>
        </AuthWrapper>
      </div>
    );
  };
}
