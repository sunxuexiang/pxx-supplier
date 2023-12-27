import React from 'react';
import { Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { Table, Button, Modal, Form } from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper } from 'qmkit';

import PickUpForm from './pickUp-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
type TList = List<any>;

/**
 * 订单发货记录
 */
@Relax
export default class OrderPickUp extends React.Component<any, any> {
  _form;
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
      modalPickUpVisible: boolean;
      formData: IMap;
      hidePickUpModal: Function;
      savePickUp: Function;
      obsoleteDeliver: Function;
      payRecord: TList;
      pickUp: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalPickUpVisible: 'modalPickUpVisible',
    formData: 'formData',
    hidePickUpModal: noop,
    savePickUp: noop,
    obsoleteDeliver: noop,
    payRecord: 'payRecord',
    pickUp: noop
  };

  render() {
    const { detail, modalPickUpVisible, savePickUp, pickUp } =
      this.props.relaxProps;

    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');
    const providerTrade = detail.get('tradeVOList');
    const payTypeId = detail.getIn(['payInfo', 'payTypeId']);

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【赠品】${gift.get('skuName')}`)
          .set('levelPrice', 0)
          .set('isGift', true)
    );

    const DeliveryFormDetail = Form.create({})(PickUpForm);
    //先款后货
    const payFirst =
      flowState === 'TOPICKUP' &&
      paymentOrder == 'PAY_FIRST' &&
      payState == 'PAID';
    //先货后款
    const noLimit = flowState === 'TOPICKUP' && paymentOrder == 'NO_LIMIT';
    return (
      <div>
        {/*providerTrade存在，就要进行拆单展示*/}
        {providerTrade && providerTrade.size == 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Table
              rowKey={(_record, index) => index.toString()}
              columns={this._deliveryColumns(null)}
              dataSource={detail.get('tradeItems').concat(gifts).toJS()}
              pagination={false}
              bordered
            />
            {payFirst || noLimit ? (
              <div style={styles.buttonBox as any}>
                <AuthWrapper functionName="fOrderDetail002">
                  <Button type="primary" onClick={() => pickUp()}>
                    兑换自提码
                  </Button>
                </AuthWrapper>
              </div>
            ) : null}
          </div>
        ) : (
          <div>{this._renderList(detail.get('tradeVOList'))}</div>
        )}

        <Modal
          maskClosable={false}
          title="兑换"
          visible={modalPickUpVisible}
          onCancel={this._hidePickUpModal}
          onOk={() => {
            const form = this._form as WrappedFormUtils;
            form.validateFields(null, (errs, values) => {
              //如果校验通过
              if (!errs) {
                savePickUp(values);
              }
            });
          }}
        >
          <DeliveryFormDetail ref={(form) => (this._form = form)} />
        </Modal>
      </div>
    );
  }

  _renderList(providerTrade) {
    return (
      providerTrade &&
      providerTrade.map((v, index) => {
        //处理赠品
        const gifts = (v.get('gifts') ? v.get('gifts') : fromJS([])).map(
          (gift) =>
            gift
              .set('skuName', `【赠品】${gift.get('skuName')}`)
              .set('levelPrice', 0)
              .set('isGift', true)
        );
        return (
          <div style={{ marginBottom: '20px' }}>
            <Table
              columns={
                v.get('storeId')
                  ? this._deliveryColumns2()
                  : this._deliveryColumns(index)
              }
              dataSource={v.get('tradeItems').concat(gifts).toJS()}
              pagination={false}
              bordered
            />
          </div>
        );

        // return <div key={index}>{this._renderSonOrderSku(providerTrade)}</div>;
      })
    );
  }

  _deliveryColumns = (index: null) => {
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
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }
    ];
  };
  _deliveryColumns2 = () => {
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
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }
    ];
  };

  /**
   * 关闭发货modal
   * @private
   */
  _hidePickUpModal = () => {
    const { hidePickUpModal } = this.props.relaxProps;
    hidePickUpModal();
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
