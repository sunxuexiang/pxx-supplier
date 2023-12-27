import React from 'react';
import { Relax, IMap } from 'plume2';
import { Table, Tooltip, Menu, Icon } from 'antd';
import { noop, Const, util,history } from 'qmkit';
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
 * 订单提货记录
 */
@Relax
export default class OrderPickUp extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      tradesList: IList;
      // addReceiverVisible: boolean;
      // setReceiveVisible: Function;
      // onConfirm: Function;
    };
  };

  /*state: {
    addReceiverVisible: boolean;
  }*/

  // constructor(props) {
  //   super(props);
  //   /*this.state = {
  //     addReceiverVisible: false
  //   }*/
  // }

  static relaxProps = {
    detail: 'detail',
    tradesList: 'tradesList',
    // addReceiverVisible: 'addReceiverVisible',
    // setReceiveVisible: noop,
    // onConfirm: noop
  };

  //收款列表
  receiveColumns = [
    {
      title: '提货订单号',
      dataIndex: 'pickOrderNo',
      key: 'pickOrderNo',
      render:(text)=>{
        return (
          <a href="javascript:void(0);" onClick={() => {
            history.push({ pathname: `/order-detail/${text}`})
          }}>{text}</a>
        )
      }
    },
    {
      title: '提货时间',
      dataIndex: 'pickTime',
      key: 'pickTime',
      render: (receiveTime) =>
        receiveTime &&
        moment(receiveTime)
          .format(Const.TIME_FORMAT)
          .toString()
    },
    {
      title: '商品数量',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '商品金额',
      dataIndex: 'orderGoodsPrice',
      key: 'orderGoodsPrice',
      render: (text, record) =>
        record.payOrderStatus == 1 ? '' : '￥' + (text || 0).toFixed(2)
    },
    {
      title: '配送方式',
      dataIndex: 'deliverWayText',
      key: 'deliverWayText'
    },
    {
      title: '配送运费',
      dataIndex: 'freight',
      key: 'freight',
      render: (freight) =>
      freight ? freight: '-'
    },
    {
      title: '运费优惠金额',
      dataIndex: 'deliveryDiscountPrice',
      key: 'deliveryDiscountPrice',
      render: (text) =>
      text ? this._desensitizeAccount(text) : '-'
    },
    {
      title: (
        <div>
          <span>扣款金额</span>
          <Tooltip title="从囤货单中进行扣款" placement="top">
            <Icon type="question-circle" />
          </Tooltip>
        </div>
      ),
      dataIndex: 'payPrice',
      key: 'payPrice',
    },
    {
      title: '实付金额',
      dataIndex: 'actualPrice',
      key: 'actualPrice',
    },
  
   
  ];

  render() {
    const { detail, tradesList } = this.props.relaxProps;
    const id = detail.get('id');
    const totalPayCash = detail.getIn(['tradePrice', 'totalPrice']) || 0;
    console.log(tradesList,'tradesList')
    return (
      <div style={styles.container}>
        {/* <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              收件人:&nbsp;喜丫丫 &nbsp;&nbsp;&nbsp;&nbsp; 123456789
            </label>
          </div>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              收货地址:&nbsp;比比比比比比比比比比比比比比
            </label>
          </div>
        </div> */}

        <div>
          <Table
            columns={this.receiveColumns}
            dataSource={tradesList.toJS()}
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


}



const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    // display: 'flex',
    // flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  orderNum: {
    fontSize: 12
  } as any,
} as any;
