import React from 'react';
import { Relax } from 'plume2';
import { noop, history, Const } from 'qmkit';
import { Table, Switch, Popconfirm } from 'antd';
import { IList } from 'typings/globalType';
import Moment from 'moment';

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
export default class LiveList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number; //当前页
      // liveListGoodsDataList: IList; //直播商品列表
      queryPage: Function; //分页查数据
      onliveDel: Function;
      // changeRecommend: Function; //改变推荐状态
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    // liveListGoodsDataList: 'liveListGoodsDataList',
    queryPage: noop,
    onliveDel: noop
    // changeRecommend: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="liveId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
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
      key: 'roomName',
      dataIndex: 'roomName',
      title: '直播标题',
      render: (rowInfo) => {
        return <div>{rowInfo ? rowInfo : '-'}</div>;
      }
    },
    {
      key: 'startTime',
      dataIndex: 'startTime',
      title: '直播时间',
      render: (time, rowInfo) => {
        return (
          <div>
            <div>
              {Moment(time)
                .format(Const.TIME_FORMAT)
                .toString() + '~'}
            </div>
            <div>
              {rowInfo.endTime
                ? Moment(rowInfo.endTime)
                    .format(Const.TIME_FORMAT)
                    .toString()
                : null}
            </div>
          </div>
        );
      }
    },
    {
      key: 'anchorName',
      dataIndex: 'anchorName',
      title: '主播昵称/账号',
      render: (rowInfo, row) => {
        return (
          <div>
            {rowInfo}/{row.customerAccount}
          </div>
        );
      }
    },
    {
      key: 'liveStatus',
      dataIndex: 'liveStatus',
      title: '直播状态', // 0: 直播中, 3: 未开始, 4: 已结束, 5: 禁播, 1: 暂停中, 2: 异常, 6: 已过期
      render: (status) => {
        let liveStatus = '-';
        switch (status) {
          case 0:
            liveStatus = '未开始';
            break;
          case 1:
            liveStatus = '直播中';
            break;
          case 2:
            liveStatus = '已结束';
            break;
        }
        return liveStatus;
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    const { onliveDel } = this.props.relaxProps;
    return (
      <div>
        <a
          style={styles.edit}
          onClick={() =>
            history.push({ pathname: `/app-live-dis/${rowInfo.liveId}` })
          }
        >
          查看
        </a>
        {rowInfo.status != 1 ? (
          <Popconfirm
            title="是否确认删除该直播间？"
            onConfirm={() => onliveDel(rowInfo.liveId)}
            okText="确认"
            cancelText="取消"
          >
            <a style={styles.edit} href="javascript:void(0);">
              删除
            </a>
          </Popconfirm>
        ) : null}
      </div>
    );
  };
}
