import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Dropdown, Icon, Menu, Popconfirm, Tooltip } from 'antd';
import momnet from 'moment';

type TList = List<any>;
const { Column } = DataGrid;

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

/**
 * 订单收款单列表
 */
@Relax
export default class PayOrderList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onCreateReceivable: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onCreateReceivable: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      current
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: selectedRowKeys => {
            onSelect(selectedRowKeys);
          }
        }}
        rowKey="payOrderId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="收款流水号"
          key="receivableNo"
          dataIndex="receivableNo"
          render={receivableNo => (
            <span>{receivableNo ? receivableNo : '-'}</span>
          )}
        />
        <Column title="订单号" key="orderCode" dataIndex="orderCode" />
        <Column
          title="下单时间"
          key="createTime"
          dataIndex="createTime"
          render={createTime => (
            <span>
              {momnet(createTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </span>
          )}
        />
        <Column title="客户名称" key="customerName" dataIndex="customerName" />
        <Column
          title="支付方式"
          key="payType"
          render={(rowInfo) => (
            <span>
              { rowInfo.payOrderPrice == null && rowInfo.payOrderPoints != null
                ? '积分兑换'
                : payTypeDic[rowInfo.payType]}
            </span>
          )}
          width="8%"
        />
        <Column
          width={200}
          title="收款账户"
          key="receivableAccount"
          dataIndex="receivableAccount"
          render={receivableAccount => <span>{receivableAccount || '-'}</span>}
        />
        <Column
          title="应收金额"
          key="payOrderPrice"
          render={(rowInfo) => (
            <span>
              {rowInfo.payOrderPoints != null
                ? rowInfo.payOrderPoints + '积分'
                : `￥${
                  rowInfo.payOrderPrice
                    ? rowInfo.payOrderPrice.toFixed(2)
                    : (0.0).toFixed(2)
                  }`}
            </span>
          )}
          width="8%"
        />
        <Column
          width="80"
          title="付款状态"
          key="payOrderStatus"
          dataIndex="payOrderStatus"
          render={payOrderStatus => (
            <span>{payOrderStatusDic[payOrderStatus]}</span>
          )}
        />
        <Column
          width="40"
          title="备注"
          key="comment"
          dataIndex="comment"
          render={comment => (
            <span>
              {comment ? (
                <Tooltip title={this._renderComment(comment)} placement="top">
                  <a href="javascript:void(0);">查看</a>
                </Tooltip>
              ) : (
                '无'
              )}
            </span>
          )}
        />
        <Column title="操作" render={rowInfo => this._renderOperate(rowInfo)} />
      </DataGrid>
    );
  }

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperate(rowInfo) {
    const { onCreateReceivable, onDestory } = this.props.relaxProps;

    const { payOrderId, payOrderStatus, payType } = rowInfo;
    if (payType == 0) {
      return '-';
    }

    //待确认
    if (payOrderStatus == 2) {
      return (
        <Dropdown overlay={this._renderMenu(payOrderId)} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      );
    } else if (payOrderStatus == 1) {
      //未付款
      //线下
      if (payType == 1) {
        return (
          <a
            href="javascript:void(0);"
            onClick={() => onCreateReceivable(payOrderId)}
          >
            新增收款记录
          </a>
        );
      } else {
        return '-';
      }
    } else {
      return (
        <Popconfirm
          title="是否确认作废这条收款记录？"
          onConfirm={() => {
            onDestory(payOrderId);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a href="javascript:void(0);">作废</a>
        </Popconfirm>
      );
    }
  }

  _renderMenu = (id: string) => {
    const { onDestory, onConfirm } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a href="javascript:void(0);" onClick={() => onConfirm(id)}>
            确认
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <Popconfirm
            title="是否确认作废这条收款记录？"
            onConfirm={() => {
              onDestory(id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">作废</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
}
