import React from 'react';
import { Relax, IMap } from 'plume2';
import { Table, Tooltip, Menu, Popover } from 'antd';
import { noop, Const, util } from 'qmkit';
import { IList } from 'typings/globalType';
import moment from 'moment';

const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

/**
 * 订单收款记录
 */
@Relax
export default class OrderReceive extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      payRecord: IList;
      onSavePayOrder: Function;
      destroyOrder: Function;
      fetchOffLineAccounts: Function;
      addReceiverVisible: boolean;
      setReceiveVisible: Function;
      onConfirm: Function;
    };
  };

  /*state: {
    addReceiverVisible: boolean;
  }*/

  constructor(props) {
    super(props);
    /*this.state = {
      addReceiverVisible: false
    }*/
  }

  static relaxProps = {
    detail: 'detail',
    payRecord: 'payRecord',
    onSavePayOrder: noop,
    destroyOrder: noop,
    fetchOffLineAccounts: noop,
    addReceiverVisible: 'addReceiverVisible',
    setReceiveVisible: noop,
    onConfirm: noop
  };

  //收款列表
  receiveColumns = [
    {
      title: '收款流水号',
      dataIndex: 'receivableNo',
      key: 'receivableNo'
    },
    {
      title: '收款时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: (receiveTime) =>
        receiveTime &&
        moment(receiveTime)
          .format(Const.TIME_FORMAT)
          .toString()
    },
    {
      title: '实扣积分',
      dataIndex: 'payOrderPoints',
      key: 'payOrderPoints',
      render: (text, record) =>
        record.payOrderStatus == 1 ? '' : text || 0
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => payTypeDic[payType]
    },
    {
      title: '收款账户',
      dataIndex: 'receivableAccount',
      key: 'receivableAccount',
      render: (receivableAccount) =>
        receivableAccount ? this._desensitizeAccount(receivableAccount) : '-'
    },
    {
      title: '附件',
      dataIndex: 'encloses',
      key: 'encloses',
      render: (encloses) =>
        encloses ? (
          <Popover
            key={'encloses'}
            placement="topRight"
            title={''}
            trigger="click"
            content={<img style={styles.attachmentView} src={encloses} />}
          >
            <a href="javascript:;">
              <img style={styles.attachment} src={encloses} />
            </a>
          </Popover>
        ) : (
          '无'
        )
    },
    {
      title: '状态',
      dataIndex: 'payOrderStatus',
      key: 'payOrderStatus',
      render: (payOrderStatus) => payOrderStatusDic[payOrderStatus]
    },
    ,
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <span>
          {comment ? (
            <Tooltip title={this._renderComment(comment)} placement="top">
              <a href="javascript:void(0);">查看</a>
            </Tooltip>
          ) : (
            '无'
          )}
        </span>
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_text, record) => this._renderOperator(record)
    }
  ];

  render() {
    const { detail, payRecord } = this.props.relaxProps;
    const id = detail.get('id');
    const totalPayPoints = detail.getIn(['tradePrice', 'points']) || 0;

    return (
      <div style={styles.container}>
        <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              订单号：{id}&nbsp;&nbsp;&nbsp;&nbsp; 应扣积分：{
              totalPayPoints || 0 }
            </label>
          </div>
        </div>

        <div>
          <Table
            columns={this.receiveColumns}
            dataSource={payRecord.toJS()}
            pagination={false}
            bordered
            rowKey={(_record, index) => index.toString()}
          />
        </div>
      </div>
    );
  }

  _desensitizeAccount(accountNm) {
    const strArr = accountNm.split(' ');
    if (strArr[1]) {
      strArr[1] = util.desensitizeStr(strArr[1]);
    }
    return strArr.join(' ');
  }

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperator(_payRecord) {
    return '-';
  }

  _renderMenu = (id: string) => {
    const { onConfirm } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={() => onConfirm(id)}>确认</a>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  addReceiveButton: {
    display: 'flex',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  orderNum: {
    fontSize: 12
  } as any,
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 500,
    maxHeight: 400
  }
} as any;
