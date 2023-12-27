import React from 'react';
import { IMap, Relax } from 'plume2';
import { Col, Icon, Input, Modal, Popover, Row, Table } from 'antd';
import { AuthWrapper, Const, noop, util } from 'qmkit';
import { fromJS, Map } from 'immutable';

import moment from 'moment';

const flowState = (status) => {
  if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return '待发货';
  } else if (status == 'DELIVERED') {
    return '待收货';
  } else if (status == 'CONFIRMED') {
    return '已收货';
  } else if (status == 'COMPLETED') {
    return '已完成';
  }
};

const columns = [
  {
    title: 'SKU编码',
    dataIndex: 'skuNo',
    key: 'skuNo',
    render: (text) => text
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    key: 'skuName'
  },
  {
    title: '规格',
    dataIndex: 'specDetails',
    key: 'specDetails'
  },
  {
    title: '单价',
    dataIndex: 'points',
    key: 'points',
    render: (points) => <span>{points}</span>
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '金额小计',
    render: (row) => <span>{row.num * row.points}</span>
  }
];

/**
 * 订单详情
 */
@Relax
export default class OrderDetailTab extends React.Component<any, any> {
  _rejectForm;

  props: {
    relaxProps?: {
      detail: IMap;
      confirm: Function;
      retrial: Function;
      sellerRemarkVisible: boolean;
      setSellerRemarkVisible: Function;
      remedySellerRemark: Function;
      setSellerRemark: Function;
      onDelivery: Function;
      orderRejectModalVisible: boolean;
      hideRejectModal: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    confirm: noop,
    retrial: noop,
    sellerRemarkVisible: 'sellerRemarkVisible',
    orderRejectModalVisible: 'orderRejectModalVisible',
    setSellerRemarkVisible: noop,
    remedySellerRemark: noop,
    setSellerRemark: noop,
    onDelivery: noop,
    hideRejectModal: noop
  };

  render() {
    const {
      detail,
      sellerRemarkVisible,
      setSellerRemarkVisible,
      remedySellerRemark,
      setSellerRemark
    } = this.props.relaxProps;
    //当前的订单号
    const tid = detail.get('id');

    const tradePrice = detail.get('tradePrice').toJS() as any;

    const tradeItems = detail.get('tradeItems').toJS();

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
    };

    //附件信息
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    const enclo = fromJS(
      encloses.map((url, index) =>
        Map({
          uid: index,
          name: index,
          size: 1,
          status: 'done',
          url: url
        })
      )
    );
    //交易状态
    const tradeState = detail.get('tradeState');

    return (
      <div>
        <div style={styles.headBox as any}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <label style={styles.greenText}>
              {flowState(detail.getIn(['tradeState', 'flowState']))}
            </label>

            {this._renderBtnAction(tid)}
          </div>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>订单号：{detail.get('id')} </p>
              <p style={styles.darkText}>
                下单时间：
                {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                客户：{detail.getIn(['buyer', 'name'])}
              </p>
              <p style={styles.darkText}>
                客户账号：{detail.getIn(['buyer', 'account'])}
              </p>
              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  {(util.isThirdStore() ? '客户等级：  ' : '平台等级：  ') +
                    detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
          </Row>
        </div>

        <div
          style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}
        >
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={columns}
            dataSource={tradeItems}
            pagination={false}
            bordered
          />
          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>订单积分:</span>
                <strong>{tradePrice.points || 0}</strong>
              </label>
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: 10,
              marginLeft: 20
            }}
          >
            卖家备注:
            {sellerRemarkVisible == true && (
              <a onClick={() => setSellerRemarkVisible(false)}>
                <Icon type="edit" />
                {detail.get('sellerRemark') || '无'}
              </a>
            )}
            {sellerRemarkVisible == false && (
              <div
                style={{ width: 400, display: 'flex', flexDirection: 'row' }}
              >
                <Input
                  style={{ width: 300, marginRight: 20 }}
                  onChange={(e) => {
                    setSellerRemark((e.target as any).value);
                  }}
                  placeholder={detail.get('sellerRemark')}
                  size="small"
                  defaultValue={detail.get('sellerRemark')}
                />

                <a style={styles.pr20} onClick={() => remedySellerRemark()}>
                  确认
                </a>
                <a onClick={() => setSellerRemarkVisible(true)}>取消</a>
              </div>
            )}
          </div>
          <label style={styles.inforItem}>
            买家备注: {detail.get('buyerRemark') || '无'}
          </label>
          <label style={styles.inforItem}>
            订单附件: {this._renderEncloses(enclo)}
          </label>

          <label style={styles.inforItem}>
            支付方式: {detail.getIn(['payInfo', 'desc']) || '暂无信息'}
          </label>
          <label style={styles.inforItem}>配送方式: 快递配送</label>
          <label style={styles.inforItem}>
            收货信息：{consignee.name} {consignee.phone}{' '}
            {consignee.detailAddress}
          </label>
        </div>
      </div>
    );
  }

  //附件
  _renderEncloses(encloses) {
    if (encloses.size == 0 || encloses[0] === '') {
      return <span>无</span>;
    }

    return encloses.map((v, k) => {
      return (
        <Popover
          key={'pp-' + k}
          placement="topRight"
          title={''}
          trigger="click"
          content={
            <img
              key={'p-' + k}
              style={styles.attachmentView}
              src={v.get('url')}
            />
          }
        >
          <a href="javascript:;">
            <img key={k} style={styles.attachment} src={v.get('url')} />
          </a>
        </Popover>
      );
    });
  }

  _renderBtnAction(tid: string) {
    const { detail, onDelivery } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (flowState === 'INIT' || flowState === 'AUDIT') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {flowState === 'AUDIT' && (
            <div>
              {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
                <AuthWrapper functionName="f_points_order_list_005">
                  {/*<a*/}
                  {/*href="javascript:void(0);"*/}
                  {/*style={styles.pr20}*/}
                  {/*onClick={() => {*/}
                  {/*onDelivery();*/}
                  {/*}}*/}
                  {/*>*/}
                  {/*发货*/}
                  {/*</a>*/}
                </AuthWrapper>
              )}
            </div>
          )}
        </div>
      );
    } else if (flowState === 'DELIVERED_PART') {
      return (
        <div>
          <AuthWrapper functionName="f_points_order_list_005">
            {/*<a*/}
            {/*href="javascript:void(0);"*/}
            {/*style={styles.pr20}*/}
            {/*onClick={() => {*/}
            {/*onDelivery();*/}
            {/*}}*/}
            {/*>*/}
            {/*发货*/}
            {/*</a>*/}
          </AuthWrapper>
        </div>
      );
    } else if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="f_points_order_list_002">
            <a
              onClick={() => {
                this._showConfirm(tid);
              }}
              href="javascript:void(0)"
              style={styles.pr20}
            >
              确认收货
            </a>
          </AuthWrapper>
        </div>
      );
    }

    return null;
  }

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = (tdId: string) => {
    const { confirm } = this.props.relaxProps;

    const confirmModal = Modal.confirm;
    confirmModal({
      title: '确认收货',
      content: '确认已收到全部货品?',
      onOk() {
        confirm(tdId);
      },
      onCancel() {}
    });
  };
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  greenText: {
    color: '#339966'
  },
  greyText: {
    marginLeft: 20
  },
  pr20: {
    paddingRight: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 140,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-between'
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any,

  imgItem: {
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff'
  },
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 400,
    maxHeight: 400
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#1890ff',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
