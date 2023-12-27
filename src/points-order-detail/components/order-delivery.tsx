import React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Table, Button, InputNumber, Modal, Form } from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper, Logistics } from 'qmkit';
import DeliveryForm from './delivery-form';
import Moment from 'moment';

/**
 * 订单发货记录
 */
@Relax
export default class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: []
    };
  }

  props: {
    relaxProps?: {
      detail: IMap;
      deliver: Function;
      confirm: Function;
      changeDeliverNum: Function;
      showDeliveryModal: Function;
      modalVisible: boolean;
      formData: IMap;
      hideDeliveryModal: Function;
      saveDelivery: Function;
      obsoleteDeliver: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalVisible: 'modalVisible',
    formData: 'formData',
    hideDeliveryModal: noop,
    saveDelivery: noop,
    obsoleteDeliver: noop
  };

  render() {
    const {
      detail,
      deliver,
      modalVisible,
      saveDelivery
    } = this.props.relaxProps;
    const tradeDelivers = detail.get('tradeDelivers') as IList;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【赠品】${gift.get('skuName')}`)
          .set('levelPrice', 0)
          .set('isGift', true)
    );

    const DeliveryFormDetail = Form.create({})(DeliveryForm);
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={this._deliveryColumns()}
            dataSource={detail.get('tradeItems').concat(gifts).toJS()}
            pagination={false}
            bordered
          />
          {(flowState === 'AUDIT' || flowState === 'DELIVERED_PART') &&
          !(paymentOrder == 'PAY_FIRST' && payState != 'PAID') ? (
            <div style={styles.buttonBox as any}>
              <AuthWrapper functionName="f_points_order_list_005">
                <Button type="primary" onClick={() => deliver()}>
                  发货
                </Button>
              </AuthWrapper>
            </div>
          ) : null}
        </div>
        {tradeDelivers.count() > 0
          ? tradeDelivers.map((v, i) => {
              const logistic = v.get('logistics');
              const deliverTime = v.get('deliverTime')
                ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT)
                : null;
              //处理赠品
              const deliversGifts = (v.get('giftItemList')
                ? v.get('giftItemList')
                : fromJS([])
              ).map((gift) =>
                gift.set('itemName', `【赠品】${gift.get('itemName')}`)
              );
              return (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <label style={styles.title}>发货记录</label>
                  <Table
                    rowKey={(_record, index) => index.toString()}
                    columns={this._deliveryRecordColumns()}
                    dataSource={v
                      .get('shippingItems')
                      .concat(deliversGifts)
                      .toJS()}
                    pagination={false}
                    bordered
                  />

                  <div style={styles.expressBox as any}>
                    <div style={styles.stateBox}>
                      {logistic ? (
                        <label style={styles.information}>
                          【物流信息】发货日期：{deliverTime}
                          物流公司：{logistic.get('logisticCompanyName')}{' '}
                          物流单号：{logistic.get('logisticNo')}
                          <Logistics
                            companyInfo={logistic}
                            deliveryTime={deliverTime}
                          />
                        </label>
                      ) : (
                        '无'
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : null}

        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
          <div style={styles.expressOp}>
            {flowState === 'DELIVERED' ? (
              <AuthWrapper functionName="f_points_order_list_002">
                <Button
                  type="primary"
                  onClick={() => {
                    this._showConfirm();
                  }}
                >
                  确认收货
                </Button>
              </AuthWrapper>
            ) : null}
          </div>
        </div>

        <Modal
          maskClosable={false}
          title="发货"
          visible={modalVisible}
          onCancel={this._hideDeliveryModal}
          onOk={() => {
            this['_receiveAdd'].validateFields(null, (errs, values) => {
              //如果校验通过
              if (!errs) {
                values.deliverTime = values.deliverTime.format(
                  Const.DAY_FORMAT
                );
                saveDelivery(values);
              }
            });
          }}
        >
          <DeliveryFormDetail
            ref={(_receiveAdd) => (this['_receiveAdd'] = _receiveAdd)}
          />
        </Modal>
      </div>
    );
  }

  _deliveryColumns = () => {
    const { changeDeliverNum } = this.props.relaxProps;

    return [
      {
        title: '序号',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
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
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '已发货数',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      },
      {
        title: '本次发货数',
        key: 'deliveringNum',
        render: (_, row) => {
          return (
            <InputNumber
              min={0}
              max={row.num - row.deliveredNum}
              value={row.deliveringNum ? row.deliveringNum : 0}
              onChange={(value) => {
                changeDeliverNum(_.skuId, _.isGift, value);
              }}
            />
          );
        }
      }
    ];
  };

  _deliveryRecordColumns = () => {
    return [
      {
        title: '序号',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
        key: 'itemName'
      },
      {
        title: '规格',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: '本次发货数',
        dataIndex: 'itemNum',
        key: 'itemNum'
      }
    ];
  };

  /**
   * 显示发货弹框
   */
  _showDeliveryModal = () => {
    const { showDeliveryModal } = this.props.relaxProps;
    showDeliveryModal();
  };

  /**
   * 关闭发货modal
   * @private
   */
  _hideDeliveryModal = () => {
    const { hideDeliveryModal } = this.props.relaxProps;
    hideDeliveryModal();
  };

  /**
   * 作废发货记录提示
   * @private
   */
  _showCancelConfirm = (tdId: string) => {
    const { obsoleteDeliver } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '提示',
      content: '是否确认作废这条发货记录',
      onOk() {
        obsoleteDeliver(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = () => {
    const { confirm, detail } = this.props.relaxProps;
    const tid = detail.get('id');
    const confirmModal = Modal.confirm;
    confirmModal({
      title: '确认收货',
      content: '确认已收到全部货品?',
      onOk() {
        confirm(tid);
      },
      onCancel() {}
    });
  };
}

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5
  },
  expressBox: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  expressOp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  information: {
    marginBottom: 10
  }
} as any;
