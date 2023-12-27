import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  Button,
  Menu,
  Dropdown,
  Icon,
  DatePicker
} from 'antd';
import {
  noop,
  ExportModal,
  ExportTradeModal,
  util,
  AuthWrapper,
  checkAuth,
  Headline,
  SelectGroup,
  cache
} from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import { fromJS } from 'immutable';
import styled from 'styled-components';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      tab: IMap;
      dataList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
      onExportBySonTrade: Function;
      wareList: IMap;
      form: IMap;
      addonBeforeForm: IMap;
      onFormValFieldChange: Function;
      onExportBySonDetail: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    tab: 'tab',
    dataList: 'dataList',
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    onExportBySonTrade: noop,
    exportModalData: 'exportModalData',
    wareList: 'wareList',
    form: 'form',
    addonBeforeForm: 'addonBeforeForm',
    onFormValFieldChange: noop,
    onExportBySonDetail: noop
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      receiverSelect: 'consigneeName',
      buyerOptions: 'buyerName',
      business: 'employeeName',
      businessValue: null,
      id: '',
      buyerOptionsValue: '',
      providerOptions: 'providerName',
      idOptions: 'id',
      providerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      wareId: null,
      deliverWay: null,
      useBalancePrice: null,
      presellFlag: '',
      startTime:
        moment()
          .subtract(6, 'months')
          .format('YYYY-MM-DD') +
        ' ' +
        '00:00:00',
      endTime: moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
      defaultTime: []
    };
  }
  componentDidMount(): void {
    const {
      relaxProps: { form }
    } = this.props;
    if (!Boolean(form.get('beginTime') && form.get('endTime'))) {
      console.warn(666);

      this.setState({
        defaultTime: [
          moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss'),
          moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')
        ]
      });
    } else {
      this.setState({
        defaultTime: [
          moment(form.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
          moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
        ]
      });
    }
  }
  render() {
    const {
      onSearch,
      tab,
      exportModalData,
      onExportModalHide,
      wareList,
      form,
      addonBeforeForm,
      onFormValFieldChange
    } = this.props.relaxProps;
    const tradeState = form.get('tradeState');
    let hasMenu = false;
    if (
      (tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) ||
      checkAuth('fOrderList004')
    ) {
      hasMenu = true;
    }

    // 是否为第三方商家 第三方隐藏供应商名称、发货仓、业务员名称/账号
    const isThird = util.isThirdStore();

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002">
              <a
                target="_blank"
                href="javascript:;"
                onClick={() => this._showBatchAudit()}
              >
                批量审核
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    const allDeliveryWay = sessionStorage.getItem(cache.DELIVERYWAY)
      ? JSON.parse(sessionStorage.getItem(cache.DELIVERYWAY))
      : [];

    return (
      <div>
        <Headline title="订单列表" />
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="订单编号"
                defaultValue={''}
                value={form.get('id')}
                onChange={(e) => {
                  onFormValFieldChange('id', (e.target as any).value);
                  // this.setState({
                  //   id: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <Input
                addonBefore="子订单编号"
                defaultValue=""
                value={form.get('providerTradeId')}
                onChange={(e) => {
                  onFormValFieldChange(
                    'providerTradeId',
                    (e.target as any).value
                  );
                  // this.setState({
                  //   providerTradeId: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore="支付单号"
                defaultValue={''}
                value={form.get('payOrderNo')}
                onChange={(e) => {
                  onFormValFieldChange('payOrderNo', (e.target as any).value);
                  // this.setState({
                  //   id: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore={this._renderBuyerOptionSelect()}
                defaultValue={''}
                value={form.get(addonBeforeForm.get('buyerOptions'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('buyerOptions'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   buyerOptionsValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            {/*商品名称、SKU编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                defaultValue=""
                value={form.get(addonBeforeForm.get('goodsOptions'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('goodsOptions'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   goodsOptionsValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore={this._renderReceiverSelect()}
                defaultValue=""
                value={form.get(addonBeforeForm.get('receiverSelect'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('receiverSelect'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   receiverSelectValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <Input
                addonBefore="供应商名称"
                defaultValue=""
                value={form.get('providerName')}
                onChange={(e) => {
                  onFormValFieldChange('providerName', (e.target as any).value);
                  // this.setState({
                  //   providerName: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={tradeState.get('deliverStatus') || ''}
                label="发货状态"
                onChange={(value) => {
                  onFormValFieldChange(
                    'tradeState',
                    fromJS({
                      deliverStatus: value,
                      payState: tradeState.get('payState'),
                      orderSource: tradeState.get('orderSource')
                    })
                  );
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: value,
                  //     payState: this.state.tradeState.payState,
                  //     orderSource: this.state.tradeState.orderSource
                  //   }
                  // });
                }}
              >
                <Option value="">全部</Option>
                <Option value="NOT_YET_SHIPPED">未发货</Option>
                <Option value="PART_SHIPPED">部分发货</Option>
                <Option value="SHIPPED">全部发货</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={tradeState.get('payState') || ''}
                onChange={
                  (value) =>
                    onFormValFieldChange(
                      'tradeState',
                      fromJS({
                        deliverStatus: tradeState.get('deliverStatus'),
                        payState: value,
                        orderSource: tradeState.get('orderSource')
                      })
                    )
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: this.state.tradeState.deliverStatus,
                  //     payState: value,
                  //     orderSource: this.state.tradeState.orderSource
                  //   }
                  // })
                }
                label="付款状态"
              >
                <Option value="">全部</Option>
                <Option value="NOT_PAID">未付款</Option>
                <Option value="UNCONFIRMED">待确认</Option>
                <Option value="PAID">已付款</Option>
              </SelectGroup>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={tradeState.get('orderSource') || ''}
                label="订单来源"
                onChange={(value) => {
                  onFormValFieldChange(
                    'tradeState',
                    fromJS({
                      deliverStatus: tradeState.get('deliverStatus'),
                      payState: tradeState.get('payState'),
                      orderSource: value
                    })
                  );
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: this.state.tradeState.deliverStatus,
                  //     payState: this.state.tradeState.payState,
                  //     orderSource: value
                  //   }
                  // });
                }}
              >
                <Option value="">全部</Option>
                <Option value="PC">PC订单</Option>
                <Option value="WECHAT">H5订单</Option>
                <Option value="APP">APP订单</Option>
                <Option value="LITTLEPROGRAM">小程序订单</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={form.get('deliverWay')}
                label="配送方式"
                onChange={(value) => {
                  onFormValFieldChange('deliverWay', value);
                  // this.setState({
                  //   deliverWay: value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                {allDeliveryWay.map((item) => (
                  <Option key={item.deliveryTypeId} value={item.deliveryTypeId}>
                    {item.deliverWayDesc}
                  </Option>
                ))}
                {/* <Option value="1">托运部</Option>
                <Option value="2">快递到家(自费)</Option>
                <Option value="3">自提</Option>
                {!isThird && <Option value="4">免费店配</Option>}
                <Option value="5">本地配送</Option>
                <Option value="6">自提</Option>
                <Option value="7">配送到店(自费)</Option>
                <Option value="8">指定专线</Option>
                <Option value="9">同城配送(到付)</Option>
                <Option value="10">快递到家(到付)</Option> */}
              </SelectGroup>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={form.get('activityType')}
                label="订单类型"
                onChange={(value) => {
                  onFormValFieldChange('activityType', value);
                  // this.setState({
                  //   activityType: value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                {/* <Option value="0">提货订单</Option> */}
                <Option value="0">提货订单</Option>
                <Option value="4">囤货订单</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <RangePicker
                showTime={{
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss')
                  ]
                }}
                value={
                  this.state.defaultTime
                  // form.get('beginTime') && form.get('endTime')
                  //   ? [
                  //       moment(form.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
                  //       moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
                  //     ]
                  //   : []
                }
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                    this.setState({
                      defaultTime: [
                        moment(beginTime, 'YYYY-MM-DD HH:mm:ss'),
                        moment(endTime, 'YYYY-MM-DD HH:mm:ss')
                      ]
                    });
                  } else {
                    this.setState({
                      defaultTime: []
                    });
                  }
                  onFormValFieldChange('beginTime', beginTime);
                  onFormValFieldChange('endTime', endTime);
                  // this.setState({ beginTime: beginTime, endTime: endTime });
                }}
              />
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="发货仓"
                  value={form.get('wareId') || '0'}
                  showSearch
                  onChange={(value) => {
                    onFormValFieldChange('wareId', value != '0' ? value : null);
                    // this.setState({
                    //   wareId: value != '0' ? value : null
                    // });
                  }}
                >
                  {wareList.map((ware, i) => {
                    return (
                      <Option key={i} value={ware.wareId}>
                        {ware.wareName}
                      </Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <Input
                addonBefore={this._renderbusinessOptionSelect()}
                value={form.get(addonBeforeForm.get('business'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('business'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   businessValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            {/*是否使用鲸币*/}
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={null}
                value={form.get('useBalancePrice')}
                label="是否使用鲸币"
                onChange={(value: any) => {
                  onFormValFieldChange('useBalancePrice', value);
                  // this.setState({
                  //   useBalancePrice:value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={form.get('presellFlag')}
                label="是否预售订单"
                onChange={(value: any) => {
                  onFormValFieldChange('presellFlag', value);
                }}
              >
                <Option value="">全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={(e) => {
                  e.preventDefault();
                  // const {
                  //   buyerOptions,
                  //   goodsOptions,
                  //   receiverSelect,
                  //   id,
                  //   providerTradeId,
                  //   providerName,
                  //   buyerOptionsValue,
                  //   goodsOptionsValue,
                  //   receiverSelectValue,
                  //   tradeState,
                  //   beginTime,
                  //   endTime,
                  //   deliverWay,
                  //   wareId,
                  //   business,
                  //   businessValue,
                  //   activityType,
                  //   useBalancePrice
                  // }:any = {...form.toJS(),...addonBeforeForm.toJS()};
                  // console.log('business', business, businessValue)
                  // return
                  const tradeState = form.get('tradeState').toJS();
                  // console.log(form.get('tradeState'),'tradeState')
                  const ts = {} as any;
                  if (tradeState.deliverStatus) {
                    ts.deliverStatus = tradeState.deliverStatus;
                  }

                  if (tradeState.payState) {
                    ts.payState = tradeState.payState;
                  }

                  if (tradeState.orderSource) {
                    ts.orderSource = tradeState.orderSource;
                  }

                  onFormValFieldChange('tradeState', fromJS(ts));

                  // const params = {
                  //   [business]: businessValue,
                  //   id,
                  //   providerTradeId,
                  //   providerName,
                  //   [buyerOptions]: buyerOptionsValue,
                  //   tradeState: ts,
                  //   [goodsOptions]: goodsOptionsValue,
                  //   [receiverSelect]: receiverSelectValue,
                  //   beginTime,
                  //   endTime,
                  //   deliverWay: deliverWay ? deliverWay : null,
                  //   wareId: wareId ? wareId : null,
                  //   activityType:activityType?activityType:null,
                  //   useBalancePrice:useBalancePrice
                  // };
                  // const addonBeforeParams={
                  //   business,
                  //   buyerOptions,
                  //   receiverSelect,
                  //   goodsOptions,
                  // }
                  onSearch();
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>

          {hasMenu && (
            <div className="handle-bar">
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>

        <ExportTradeModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          handleBySonTrade={exportModalData.get('exportBySonTrade')}
          handleBySonDetail={exportModalData.get('exportByDetail')}
          alertInfo={fromJS({
            message: '操作说明:',
            description:
              '为保证效率,每次最多支持' +
              '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
          })}
          alertVisible={true}
        />
      </div>
    );
  }

  _renderbusinessOptionSelect = () => {
    const { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('business', value, 'addonBeforeForm');
          // this.setState({
          //   business: value
          // });
        }}
        value={addonBeforeForm.get('business')}
        style={{ width: 110 }}
      >
        <Option value="employeeName">业务员名称</Option>
        <Option value="employeeAccount">业务员账号</Option>
      </Select>
    );
  };

  _renderBuyerOptionSelect = () => {
    const { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('buyerOptions', value, 'addonBeforeForm');
          // this.setState({
          //   buyerOptions: value
          // });
        }}
        value={addonBeforeForm.get('buyerOptions')}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  _renderGoodsOptionSelect = () => {
    const { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormValFieldChange('goodsOptions', val, 'addonBeforeForm');
          // this.setState({
          //   goodsOptions: val
          // });
        }}
        value={addonBeforeForm.get('goodsOptions')}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderReceiverSelect = () => {
    const { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={
          (val) =>
            onFormValFieldChange('receiverSelect', val, 'addonBeforeForm')
          // this.setState({
          //   receiverSelect: val
          // })
        }
        value={addonBeforeForm.get('receiverSelect')}
        style={{ width: 100 }}
      >
        <Option value="consigneeName">收件人</Option>
        <Option value="consigneePhone">收件人手机</Option>
      </Select>
    );
  };

  /**
   * 批量审核确认提示
   * @private
   */
  _showBatchAudit = () => {
    const { onBatchAudit, dataList } = this.props.relaxProps;
    const checkedIds = dataList
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error('请选择需要操作的订单');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: '审核',
      content: '确认审核已选择订单？',
      onOk() {
        onBatchAudit();
      },
      onCancel() {}
    });
  };

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportBySonTrade,
      onExportBySonDetail
    } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的订单',
      byIdsTitle: '导出选中的订单',
      bySonTradesTitle: '只导出子订单',
      byDetailTitle: '导出订单明细',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds,
      disabled: false,
      detailFlag: false,
      exportBySonTrade: onExportBySonTrade,
      exportByDetail: onExportBySonDetail
    });
  }
}
