import React from 'react';
import { Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import {
  Table,
  Button,
  InputNumber,
  Modal,
  Form,
  Row,
  Col,
  Icon,
  Input,
  Select
} from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper, Logistics, util, ImgPreview } from 'qmkit';
import DeliveryForm from './delivery-form';
import Moment from 'moment';
type TList = List<any>;
const { TextArea } = Input;
const { Option } = Select;
/**
 * 订单发货记录
 */
@Relax
export default class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: [],
      imgList: [],
      visible: false
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
      payRecord: TList;
      delivers: Function;
      modalLogisticsVisible: boolean;
      showLogisticsCompany: Function;
      hideLogisticsCompany: Function;
      companyInfo: TList;
      changeCompanyInfo: Function;
      companyShow: IMap;
      showArea: Function;
      areaVisible: boolean;
      hideareaVisible: Function;
      changeAreaInfo: Function;
      updateTradeCompany: Function;
      areaInfo: string;
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
    obsoleteDeliver: noop,
    payRecord: 'payRecord',
    delivers: noop,
    modalLogisticsVisible: 'modalLogisticsVisible',
    showLogisticsCompany: noop,
    hideLogisticsCompany: noop,
    companyInfo: 'companyInfo',
    changeCompanyInfo: noop,
    companyShow: 'companyShow',
    showArea: noop,
    areaVisible: 'areaVisible',
    hideareaVisible: noop,
    changeAreaInfo: noop,
    updateTradeCompany: noop,
    areaInfo: 'areaInfo'
  };

  render() {
    const { imgList, visible } = this.state;
    const {
      detail,
      deliver,
      modalVisible,
      saveDelivery,
      payRecord,
      modalLogisticsVisible,
      showLogisticsCompany,
      companyInfo,
      changeCompanyInfo,
      companyShow,
      showArea,
      areaVisible,
      changeAreaInfo,
      updateTradeCompany,
      areaInfo
    } = this.props.relaxProps;
    const tradeDelivers = detail.get('tradeDelivers') as IList;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');
    const providerTrade = detail.get('tradeVOList');
    const payTypeId = detail.getIn(['payInfo', 'payTypeId']);
    const logisticsCompanyInfo = detail.get('logisticsCompanyInfo');
    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
    };

    //物流单图片
    const encloses =
      tradeDelivers &&
      tradeDelivers.toJS() &&
      tradeDelivers.toJS()[0] &&
      tradeDelivers.toJS()[0].logistics
        ? tradeDelivers.toJS()[0].logistics.encloses || ''
        : '';

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【赠品】${gift.get('skuName')}`)
          .set('levelPrice', 0)
          .set('isGift', true)
    );

    const DeliveryFormDetail = Form.create({})(DeliveryForm);
    const editFlag =
      detail.get('tradeState') &&
      detail.get('tradeState').get('auditState') &&
      detail.get('tradeState').get('auditState') == 'NON_CHECKED';
    const isThird = util.isThirdStore();
    return (
      <div>
        {/* && !util.isThirdStore() */}
        {(detail.get('deliverWay') == 1 || detail.get('deliverWay') == 8) && (
          <div>
            <h4>客户物流信息</h4>
            <Row>
              <Col style={{ width: '50%' }}>
                <p style={styles.darkText}>
                  【物流公司】
                  {logisticsCompanyInfo &&
                  logisticsCompanyInfo.get('logisticsCompanyName')
                    ? logisticsCompanyInfo.get('logisticsCompanyName')
                    : '由大白鲸代选物流'}
                  {editFlag && (
                    <Icon
                      type="edit"
                      style={{ color: '#F56C1D' }}
                      onClick={() => {
                        showLogisticsCompany();
                      }}
                    />
                  )}
                </p>
                <p style={styles.darkText}>
                  【收货站点】
                  {logisticsCompanyInfo &&
                  logisticsCompanyInfo.get('receivingPoint')
                    ? logisticsCompanyInfo.get('receivingPoint')
                    : '-'}
                  {editFlag && (
                    <Icon
                      type="edit"
                      style={{ color: '#F56C1D' }}
                      onClick={() => {
                        showArea();
                      }}
                    />
                  )}
                </p>
                <p style={styles.darkText}>
                  【添加物流公司】物流公司名称:
                  {logisticsCompanyInfo &&
                  logisticsCompanyInfo.get('logisticsCompanyName')
                    ? logisticsCompanyInfo.get('logisticsCompanyName')
                    : '-'}
                  &nbsp;&nbsp; 物流公司电话:
                  {logisticsCompanyInfo &&
                  logisticsCompanyInfo.get('logisticsCompanyPhone')
                    ? logisticsCompanyInfo.get('logisticsCompanyPhone')
                    : '-'}
                  &nbsp;&nbsp; 收货站点:
                  {logisticsCompanyInfo &&
                  logisticsCompanyInfo.get('receivingPoint')
                    ? logisticsCompanyInfo.get('receivingPoint')
                    : '-'}
                </p>
                {encloses && (
                  <p style={{ display: 'flex', marginBottom: 12 }}>
                    <span>【物流单图片】</span>
                    <img
                      src={encloses}
                      alt=""
                      style={{ width: 80, height: 80, cursor: 'pointer' }}
                      onClick={() => {
                        this.setState({ imgList: [encloses], visible: true });
                      }}
                    />
                    <ImgPreview
                      visible={visible}
                      imgList={imgList}
                      showTitlte={false}
                      close={() => {
                        this.setState({ visible: false });
                      }}
                    />
                  </p>
                )}
              </Col>
            </Row>
          </div>
        )}
        {/*providerTrade存在，就要进行拆单展示*/}
        {providerTrade && providerTrade.size == 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Table
              rowKey={(_record, index) => index.toString()}
              columns={this._deliveryColumns(null)}
              dataSource={detail
                .get('tradeItems')
                .concat(gifts)
                .toJS()}
              pagination={false}
              bordered
            />
            {(flowState === 'AUDIT' || flowState === 'DELIVERED_PART') &&
            !(paymentOrder == 'PAY_FIRST' && payState != 'PAID') &&
            (payTypeId != '1' || payState == 'PAID') ? (
              <div style={styles.buttonBox as any}>
                {/*<AuthWrapper functionName="fOrderDetail002">*/}
                {/*<Button type="primary" onClick={() => deliver()}>*/}
                {/*发货*/}
                {/*</Button>*/}
                {/*</AuthWrapper>*/}
              </div>
            ) : null}
          </div>
        ) : (
          <div>{this._renderList(detail.get('tradeVOList'), detail)}</div>
        )}
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
                      {!['01', null].includes(logistic) ? (
                        <label style={styles.information}>
                          子单：{v.get('tradeId')}&nbsp;&nbsp; 商家：
                          {v.get('providerName')}
                          <br />
                          【物流信息】发货日期：{deliverTime}
                          物流公司：{logistic.get('logisticCompanyName')}{' '}
                          物流单号：{logistic.get('logisticNo')}
                          物流联系方式：{logistic.get('logisticPhone')}
                          {!isThird && (
                            <Logistics
                              companyInfo={logistic}
                              deliveryTime={deliverTime}
                              consignee={consignee}
                            />
                          )}
                          <br />
                          {/* 配送到店 已发货订单显示接货点 */}
                          {[
                            'DELIVERED',
                            'CONFIRMED',
                            'COMPLETED',
                            'VOID'
                          ].includes(flowState) &&
                            detail.get('deliverWay') == 7 && (
                              <span>
                                接货点: {logistic.get('shipmentSiteName')}
                              </span>
                            )}
                        </label>
                      ) : (
                        '无'
                      )}
                    </div>
                    {/* // 暂时屏蔽作废按钮 */}
                    {/* {v.get('shipperType') &&
                    v.get('shipperType') != 'PROVIDER' ? (
                      flowState === 'CONFIRMED' ||
                      flowState === 'COMPLETED' ||
                      flowState === 'VOID' ? null : (
                        <AuthWrapper functionName="fOrderDetail002">
                          <a
                            style={{ color: 'blue' }}
                            href="javascript:;"
                            onClick={() =>
                              this._showCancelConfirm(v.get('deliverId'))
                            }
                          >
                            作废
                          </a>
                        </AuthWrapper>
                      )
                    ) : null} */}
                  </div>
                </div>
              );
            })
          : null}

        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
          <div style={styles.expressOp}>
            {flowState === 'DELIVERED' ? (
              <AuthWrapper functionName="fOrderList003">
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
                saveDelivery(values, providerTrade);
              }
            });
          }}
        >
          <DeliveryFormDetail
            ref={(_receiveAdd) => (this['_receiveAdd'] = _receiveAdd)}
          />
        </Modal>

        <Modal
          maskClosable={false}
          title="选择物流公司"
          visible={modalLogisticsVisible}
          onCancel={this._hideLogisticsCompany}
          onOk={() => {
            updateTradeCompany();
          }}
        >
          <div>
            * 请选择物流公司：
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: '70%' }}
              optionLabelProp="label"
              placeholder="选择物流信息"
              onChange={(value) => {
                changeCompanyInfo(value);
              }}
            >
              {companyInfo.map((item) => {
                return (
                  <Option
                    key={item.get('id')}
                    value={item}
                    label={item.get('logisticsName')}
                  >
                    {item.get('logisticsName')
                      ? item.get('logisticsName')
                      : '-'}
                    <br />
                    {item.get('logisticsPhone')
                      ? item.get('logisticsPhone')
                      : '-'}
                    <br />
                    {item.get('logisticsAddress')
                      ? item.get('logisticsAddress')
                      : '-'}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Modal>
        <Modal
          maskClosable={false}
          title="填写收货站点"
          visible={areaVisible}
          onCancel={this._hideareaVisible}
          onOk={() => {
            updateTradeCompany();
          }}
        >
          <div>
            <text style={{ verticalAlign: 'top' }}>* 收货站点：</text>
            <TextArea
              placeholder={'收货站点信息展示,支持录入'}
              defaultValue={
                logisticsCompanyInfo &&
                logisticsCompanyInfo.get('receivingPoint')
                  ? logisticsCompanyInfo.get('receivingPoint')
                  : ''
              }
              style={{ height: '90px', width: '70%' }}
              maxLength={200}
              onChange={(e: any) => {
                changeAreaInfo(e.target.value);
              }}
            />
            {areaInfo.length >= 200 && (
              <div style={{ paddingLeft: '77px' }}>
                <text style={{ color: 'red' }}>* 字数已满200字</text>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  _renderList(providerTrade, detail) {
    let { delivers } = this.props.relaxProps;

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
              dataSource={v
                .get('tradeItems')
                .concat(gifts)
                .toJS()}
              pagination={false}
              bordered
            />
            {v.get('storeId') == null ? (
              (v.get('tradeState').get('flowState') == 'AUDIT' ||
                v.get('tradeState').get('flowState') == 'DELIVERED_PART') &&
              !(
                v.get('paymentOrder') == 'PAY_FIRST' &&
                v.get('tradeState').get('payState') != 'PAID'
              ) &&
              (v.get('payInfo').get('payTypeId') != '1' ||
                v.get('tradeState').get('payState') == 'PAID') ? (
                <div style={styles.buttonBox as any}>
                  <AuthWrapper functionName="fOrderDetail002">
                    {/*<Button*/}
                    {/*type="primary"*/}
                    {/*onClick={() => {*/}
                    {/*delivers(*/}
                    {/*v.get('id'),*/}
                    {/*v.get('tradeItems'),*/}
                    {/*v.get('gifts')*/}
                    {/*);*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*发货*/}
                    {/*</Button>*/}
                  </AuthWrapper>
                </div>
              ) : null
            ) : null}
          </div>
        );

        // return <div key={index}>{this._renderSonOrderSku(providerTrade)}</div>;
      })
    );
  }

  _deliveryColumns = (index: null) => {
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
      // {
      //   title: '供应商名称',
      //   dataIndex: 'providerName',
      //   key: 'providerName'
      // },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
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
              disabled={true}
              max={row.num - row.deliveredNum}
              value={row.deliveringNum ? row.deliveringNum : 0}
              onChange={(value) => {
                changeDeliverNum(_.skuId, _.isGift, value, index);
              }}
            />
          );
        }
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
        title: '供应商名称',
        dataIndex: 'providerName',
        key: 'providerName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
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
        title: '生产日期',
        dataIndex: 'listNo',
        key: 'listNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
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
   * 关闭发货modal
   * @private
   */
  _hideLogisticsCompany = () => {
    const { hideLogisticsCompany } = this.props.relaxProps;
    hideLogisticsCompany();
  };

  /**
   * 关闭站点modal
   * @private
   */
  _hideareaVisible = () => {
    const { hideareaVisible } = this.props.relaxProps;
    hideareaVisible();
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
