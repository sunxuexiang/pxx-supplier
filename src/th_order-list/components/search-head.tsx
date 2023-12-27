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
  Const,
  AuthWrapper,
  checkAuth,
  Headline,
  SelectGroup
} from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import { fromJS } from 'immutable';

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
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      receiverSelect: 'consigneeName',
      buyerOptions: 'buyerName',
      id: '',
      buyerOptionsValue: '',
      providerOptions: 'providerName',
      idOptions: 'id',
      providerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      parentId:'',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      useBalancePrice:null,
      deliverWay: null
    };
  }

  render() {
    const {
      onSearch,
      tab,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;

    let hasMenu = false;
    if (
      (tab.get('key') == 'flowState-INIT' && checkAuth('thfOrderList002')) ||
      checkAuth('thfOrderList004')
    ) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        {/* {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="thfOrderList002">
              <a
                target="_blank"
                href="javascript:;"
                onClick={() => this._showBatchAudit()}
              >
                批量审核
              </a>
            </AuthWrapper>
          </Menu.Item>
        )} */}
        <Menu.Item>
          <AuthWrapper functionName="thfOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title="囤货订单列表" />
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  this.setState({
                    id: (e.target as any).value
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="PID"
                onChange={(e) => {
                  this.setState({
                    parentId: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/* <FormItem>
              <Input
                addonBefore="子订单编号"
                onChange={(e) => {
                  this.setState({
                    providerTradeId: (e.target as any).value
                  });
                }}
              />
            </FormItem> */}

            {/*是否使用鲸币*/}
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={null}
                label="是否使用鲸币"
                onChange={(value:any) => {
                  this.setState({
                    useBalancePrice:value
                  });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore={this._renderBuyerOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    buyerOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/*商品名称、SKU编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    goodsOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore={this._renderReceiverSelect()}
                onChange={(e) => {
                  this.setState({
                    receiverSelectValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/* <FormItem>
              <Input
                addonBefore="供应商名称"
                onChange={(e) => {
                  this.setState({
                    providerName: (e.target as any).value
                  });
                }}
              />
            </FormItem> */}

            {/* <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="发货状态"
                onChange={(value) => {
                  this.setState({
                    tradeState: {
                      deliverStatus: value,
                      payState: this.state.tradeState.payState,
                      orderSource: this.state.tradeState.orderSource
                    }
                  });
                }}
              >
                <Option value="">全部</Option>
                <Option value="NOT_YET_SHIPPED">未发货</Option>
                <Option value="PART_SHIPPED">部分发货</Option>
                <Option value="SHIPPED">全部发货</Option>
              </SelectGroup>
            </FormItem> */}

            {/* <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(value) =>
                  this.setState({
                    tradeState: {
                      deliverStatus: this.state.tradeState.deliverStatus,
                      payState: value,
                      orderSource: this.state.tradeState.orderSource
                    }
                  })
                }
                label="付款状态"
                defaultValue=""
              >
                <Option value="">全部</Option>
                <Option value="NOT_PAID">未付款</Option>
                <Option value="UNCONFIRMED">待确认</Option>
                <Option value="PAID">已付款</Option>
              </SelectGroup>
            </FormItem> */}

            {/* <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="订单来源"
                onChange={(value) => {
                  this.setState({
                    tradeState: {
                      deliverStatus: this.state.tradeState.deliverStatus,
                      payState: this.state.tradeState.payState,
                      orderSource: value
                    }
                  });
                }}
              >
                <Option value="">全部</Option>
                <Option value="PC">PC订单</Option>
                <Option value="WECHAT">H5订单</Option>
                <Option value="APP">APP订单</Option>
                <Option value="LITTLEPROGRAM">小程序订单</Option>
              </SelectGroup>
            </FormItem> */}

            {/* <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="配送方式"
                onChange={(value) => {
                  this.setState({
                    deliverWay: value
                  });
                }}
              >
                <Option value="">全部</Option>
                <Option value="1">物流</Option>
                <Option value="2">快递到家</Option>
                <Option value="3">自提</Option>
                <Option value="4">本地配送</Option>
              </SelectGroup>
            </FormItem> */}

            <FormItem>
              <RangePicker
                // showTime
                showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}

                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  console.log('====================================');
                  console.log(e[0].format(Const.DAY_FORMAT), 'onchange', e[1].format(Const.DAY_FORMAT), e[0]);
                  console.log('====================================');
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                  }
                  this.setState({ beginTime: beginTime, endTime: endTime });
                }}

              />
              {/* <RangePicker
              picker="month"
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format(Const.DAY_FORMAT);
                    endTime = e[1].format(Const.DAY_FORMAT);
                  }
                  this.setState({ beginTime: beginTime, endTime: endTime });
                }}
              /> */}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const {
                    buyerOptions,
                    goodsOptions,
                    receiverSelect,
                    id,
                    providerTradeId,
                    providerName,
                    buyerOptionsValue,
                    goodsOptionsValue,
                    receiverSelectValue,
                    tradeState,
                    beginTime,
                    endTime,
                    deliverWay,
                    parentId,
                    useBalancePrice
                  } = this.state;

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

                  const params = {
                    id,
                    providerTradeId,
                    providerName,
                    [buyerOptions]: buyerOptionsValue,
                    tradeState: ts,
                    [goodsOptions]: goodsOptionsValue,
                    [receiverSelect]: receiverSelectValue,
                    beginTime,
                    endTime,
                    deliverWay: deliverWay ? deliverWay : null,
                    parentId,
                    useBalancePrice:useBalancePrice
                  };
                  onSearch(params);
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

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            buyerOptions: value
          });
        }}
        value={this.state.buyerOptions}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderReceiverSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        value={this.state.receiverSelect}
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
      onCancel() { }
    });
  };

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportBySonTrade
    } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的订单',
      byIdsTitle: '导出选中的订单',
      bySonTradesTitle: '导出订单明细',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds,
      disabled: false,
      exportBySonTrade: onExportBySonTrade
    });
  }
}
