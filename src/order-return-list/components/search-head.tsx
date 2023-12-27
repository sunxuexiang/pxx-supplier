import React, { Component } from 'react';
import { Relax } from 'plume2';
import moment from 'moment';

import {
  Button,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Select,
  DatePicker,
  message
} from 'antd';
import {
  ExportModal,
  Headline,
  noop,
  Const,
  AuthWrapper,
  checkAuth,
  SelectGroup
} from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
import { Alert } from 'antd';
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

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      onBatchReceive: Function;
      onSearchFormChange: Function;
      selected: IList;
      exportModalData: IMap;
      onExportModalChange: Function;
      onExportModalHide: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    onBatchReceive: noop,
    onSearchFormChange: noop,
    selected: 'selected',
    exportModalData: 'exportModalData',
    onExportModalChange: noop,
    onExportModalHide: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    tab: 'tab'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      buyerOptions: 'buyerName',
      consigneeOptions: 'consigneeName',
      rid: '',
      tid: '',
      skuName: '',
      skuNo: '',
      buyerName: '',
      buyerAccount: '',
      consigneeName: '',
      consigneePhone: '',
      beginTime: '',
      endTime: '',
      providerName: '',
      providerCode: '',
      providerOptions: 'providerName',
      wareId: null
    };
  }

  render() {
    const { exportModalData, onExportModalHide, tab } = this.props.relaxProps;
    const wareHouseVOPage =
      JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    const tabKey = tab.get('key');
    let hasMenu =
      (tabKey == 'flowState-INIT' && checkAuth('rolf002')) ||
      (tabKey == 'flowState-DELIVERED' && checkAuth('rolf004')) ||
      checkAuth('rolf006');
    const batchMenu = (
      <Menu>
        {tabKey == 'flowState-INIT' ? (
          <Menu.Item>
            <AuthWrapper functionName="rolf002">
              <a href="javascript:;" onClick={() => this._handleBatchAudit()}>
                批量审核
              </a>
            </AuthWrapper>
          </Menu.Item>
        ) : null}
        {tabKey == 'flowState-DELIVERED' ? (
          <Menu.Item>
            <AuthWrapper functionName="rolf004">
              <a href="javascript:;" onClick={() => this._handleBatchReceive()}>
                批量收货
              </a>
            </AuthWrapper>
          </Menu.Item>
        ) : null}
        <Menu.Item>
          <AuthWrapper functionName="rolf006">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title="退单列表" />

        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="退单编号"
                onChange={(e) => {
                  this.setState(
                    { rid: (e.target as any).value },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  this.setState(
                    { tid: (e.target as any).value },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            {/*商品名称、SKU编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                onChange={(e) => {
                  if (this.state.goodsOptions === 'skuName') {
                    this.setState(
                      {
                        skuName: (e.target as any).value,
                        skuNo: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.goodsOptions === 'skuNo') {
                    this.setState(
                      {
                        skuName: '',
                        skuNo: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            {/*客户名称、客户账号*/}
            <FormItem>
              <Input
                addonBefore={this._renderBuyerOptionSelect()}
                onChange={(e) => {
                  if (this.state.buyerOptions === 'buyerName') {
                    this.setState(
                      {
                        buyerName: (e.target as any).value,
                        buyerAccount: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.buyerOptions === 'buyerAccount') {
                    this.setState(
                      {
                        buyerName: '',
                        buyerAccount: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            {/*收件人、收件人手机*/}
            <FormItem>
              <Input
                addonBefore={this._renderConsigneeOptionSelect()}
                onChange={(e) => {
                  if (this.state.consigneeOptions === 'consigneeName') {
                    this.setState(
                      {
                        consigneeName: (e.target as any).value,
                        consigneePhone: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.consigneeOptions === 'consigneePhone') {
                    this.setState(
                      {
                        consigneeName: '',
                        consigneePhone: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            {/*供应商名称、供应商编号*/}
            <FormItem>
              <Input
                addonBefore={this._renderProviderOptionSelect()}
                onChange={(e) => {
                  if (this.state.providerOptions === 'providerName') {
                    this.setState(
                      {
                        providerName: (e.target as any).value,
                        providerCode: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.providerOptions === 'providerCode') {
                    this.setState(
                      {
                        providerName: '',
                        providerCode: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="订单类型"
                onChange={(value) => {
                  this.setState({
                    activityType: value
                  });
                }}
              >
                <Option value="">全部</Option>
                <Option value="0">提货订单</Option>
                <Option value="4">囤货订单</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <RangePicker
                // showTime
                showTime={{
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss')
                  ]
                }}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                  }
                  this.setState(
                    { beginTime: beginTime, endTime: endTime },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="发货仓"
                  defaultValue="0"
                  showSearch
                  onChange={(value) => {
                    this.setState({
                      wareId: value != '0' ? value : null
                    });
                  }}
                >
                  {wareHouseVOPage.map((ware) => {
                    return <Option value={ware.wareId}>{ware.wareName}</Option>;
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="是否预售退单"
                onChange={(value) => {
                  this.setState({
                    presellFlag: value
                  });
                }}
              >
                <Option value="">全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.relaxProps.onSearch(this.state);
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>
          {hasMenu ? (
            <div className="handle-bar">
              <Dropdown
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                overlay={batchMenu}
                placement="bottomLeft"
              >
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          ) : null}
        </div>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          extraDom={
            <Alert
              message="操作说明：为保证效率，每次最多支持导出1000条记录，如需导出更多，请更换筛选条件后再次导出"
              type="warning"
            />
          }
        />
      </div>
    );
  }

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'skuName') {
            this.setState(
              {
                skuName: this.state.skuNo,
                skuNo: '',
                goodsOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'skuNo') {
            this.setState(
              {
                skuName: '',
                skuNo: this.state.skuName,
                goodsOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'buyerName') {
            this.setState(
              {
                buyerName: this.state.buyerAccount,
                buyerAccount: '',
                buyerOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'buyerAccount') {
            this.setState(
              {
                buyerName: '',
                buyerAccount: this.state.buyerName,
                buyerOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.buyerOptions}
        style={{ width: 100 }}
      >
        <Option value="buyerName">会员昵称</Option>
        <Option value="buyerAccount">会员账号</Option>
      </Select>
    );
  };

  _renderConsigneeOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'consigneeName') {
            this.setState(
              {
                consigneeName: this.state.consigneePhone,
                consigneePhone: '',
                consigneeOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'consigneePhone') {
            this.setState(
              {
                consigneeName: '',
                consigneePhone: this.state.consigneeName,
                consigneeOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.consigneeOptions}
        style={{ width: 100 }}
      >
        <Option value="consigneeName">收货人</Option>
        <Option value="consigneePhone">收货人手机</Option>
      </Select>
    );
  };

  _renderProviderOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'providerName') {
            this.setState(
              {
                providerName: this.state.providerCode,
                providerCode: '',
                providerOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'providerCode') {
            this.setState(
              {
                providerName: '',
                providerCode: this.state.providerName,
                providerOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.providerOptions}
        style={{ width: 120 }}
      >
        <Option value="providerName">供应商名称</Option>
        <Option value="providerCode">供应商编号</Option>
      </Select>
    );
  };

  // 搜索条件变化，更新store的form参数
  _paramChanged() {
    // console.log(this.props.relaxProps);
    this.props.relaxProps.onSearchFormChange(this.state);
  }

  _handleBatchAudit() {
    const { selected, onBatchAudit } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量审核',
      content: (
        <div>
          <div>您确定要批量通过已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchAudit(selected.toArray());
      },
      onCancel() {}
    });
  }

  _handleBatchReceive() {
    const { selected, onBatchReceive } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量收货',
      content: (
        <div>
          <div>您确定要批量收货已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchReceive(selected.toArray());
      },
      onCancel() {}
    });
  }

  _handleBatchExport() {
    const { onExportByParams, onExportByIds } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的退单',
      byIdsTitle: '导出选中的退单',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
