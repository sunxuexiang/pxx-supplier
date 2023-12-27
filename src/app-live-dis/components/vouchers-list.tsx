import React from 'react';
import { Relax } from 'plume2';
import { Table, Modal } from 'antd';
import { IList } from 'typings/globalType';
import { noop, Const } from 'qmkit';
import Moment from 'moment';

@Relax
export default class VouchersList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      liveVouchersList: IList;
      isModalVisible: boolean;
      liveVouchersInfoList: IList;
      onVouchersRecord: Function;
      changeLiveInfo: Function;
    };
  };

  static relaxProps = {
    liveVouchersList: 'liveVouchersList',
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
      liveVouchersList,
      liveVouchersInfoList,
      isModalVisible,
      changeLiveInfo
    } = this.props.relaxProps;
    return (
      <div>
        <Table
          rowKey="liveVouchersList"
          dataSource={liveVouchersList.toJS()}
          columns={this._columns}
        />
        <Modal
          title="查看领券记录"
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
        </Modal>
      </div>
    );
  }

  record_columns = [
    {
      key: 'customerAccount',
      dataIndex: 'customerAccount',
      title: '用户账号'
    },
    {
      key: 'couponName',
      dataIndex: 'couponName',
      title: '优惠券名称'
    },
    {
      key: 'denomination',
      dataIndex: 'denomination',
      title: '优惠券面值'
    },
    {
      key: 'validityStr',
      dataIndex: 'validityStr',
      title: '有效期'
    },
    {
      key: 'receiveCount',
      dataIndex: 'receiveCount',
      title: '领取数量'
    },
    {
      key: 'couponStatusStr',
      dataIndex: 'couponStatusStr',
      title: '优惠券状态'
    }
  ];

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'activityName',
      dataIndex: 'activityName',
      title: '优惠券活动名称',
      render: (_rowInfo, row) => {
        return row?.couponActivity?.activityName;
      }
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '活动时间',
      render: (_rowInfo, rowInfo) => {
        return (
          <div>
            <div>
              {Moment(rowInfo.couponActivity.createTime)
                .format(Const.TIME_FORMAT)
                .toString() + '~'}
            </div>
            <div>
              {Moment(rowInfo.couponActivity.endTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </div>
          </div>
        );
      }
    },
    {
      key: 'stock',
      dataIndex: 'stock',
      title: '每人限领次数',
      render: (text, row) => {
        return row.couponActivity.receiveType
          ? row.couponActivity.receiveCount
          : '不限';
      }
    },
    {
      key: 'joinLevel',
      dataIndex: 'joinLevel',
      title: '目标客户',
      render: (text, row) => {
        return row.couponActivity.joinLevel == '-1' ? '全平台客户' : '其他';
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
    const { onVouchersRecord } = this.props.relaxProps;
    return (
      <div>
        <a
          href="javascript:void(0);"
          onClick={() => {
            // this.setState({
            //   liveVouchersInfoList:rowInfo
            // })
            onVouchersRecord(rowInfo.couponActivity.activityId);
          }}
        >
          查看领券记录
        </a>
      </div>
    );
  };
}
