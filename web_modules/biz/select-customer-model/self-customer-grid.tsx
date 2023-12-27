import React from 'react';
import { Button, Form, Input, message, Select } from 'antd';

import { AreaSelect, Const, DataGrid, FindArea, SelectGroup } from 'qmkit';
import { fromJS, Set } from 'immutable';

import * as webApi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = DataGrid;

const OPTION_TYPE = {
  0: 'customerName',
  1: 'customerAccount'
};

const OPTION_PLACE_HOLDER = {
  0: '客户名称',
  1: '客户账号'
};
export default class SelfCustomerGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: this.props.selectedRows ? this.props.selectedRows : [],
      selectedRowKeys: this.props.selectedCustomerIds
        ? this.props.selectedCustomerIds
        : [],
      total: 0,
      //客户列表数据
      customerPage: [],
      //业务员
      employee: [],
      //客户等级
      customerLevel: [],
      searchParams: {
        optType: '0',
        areaId: '',
        cityId: '',
        provinceId: ''
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.init();
    }

    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : [],
      selectedRowKeys: nextProps.selectedCustomerIds
        ? nextProps.selectedCustomerIds
        : []
    });
  }

  render() {
    const { employee, customerLevel } = this.state;
    return (
      <div className="content">
        {this.showSearchForm(employee, customerLevel)}
        {this.showList()}
      </div>
    );
  }

  /**
   * 展示搜索条件
   */
  private showSearchForm(employee, customerLevel) {
    const customerName = this.state.searchParams.customerName;
    const customerAccount = this.state.searchParams.customerAccount;
    const searchText = customerName || customerAccount;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            placeholder={OPTION_PLACE_HOLDER[this.state.searchParams.optType]}
            addonBefore={this._renderCustomerOptionSelect()}
            value={searchText}
            onChange={(e: any) => this._setField(e.target.value)}
          />
        </FormItem>

        {/*省市区*/}
        <FormItem>
          <AreaSelect
            label="地区"
            getPopupContainer={() => document.getElementById('page-content')}
            onChange={(value) => {
              let searchParams = this.state.searchParams;
              ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
                searchParams[v] = value[index];
              });
              this.setState({ searchParams: searchParams });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="平台等级"
            defaultValue=""
            style={{ width: 80 }}
            onChange={(value) => {
              let searchParams = this.state.searchParams;
              searchParams.customerLevelId = value;
              this.setState({ searchParams: searchParams });
            }}
          >
            <Option value="">全部</Option>
            {customerLevel &&
              customerLevel.map((v) => (
                <Option
                  key={v.get('customerLevelId').toString()}
                  value={v.get('customerLevelId').toString()}
                >
                  {v.get('customerLevelName')}
                </Option>
              ))}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="客户类型"
            defaultValue=""
            style={{ width: 80 }}
            onChange={(value) => {
              let searchParams = this.state.searchParams;
              searchParams.isMyCustomer = value;
              this.setState({ searchParams: searchParams });
            }}
          >
            <Option value="">全部</Option>

            <Option key={'false'} value={'false'}>
              {'平台客户'}
            </Option>

            <Option key={'true'} value={'true'}>
              {'商家客户'}
            </Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="业务员"
            defaultValue=""
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              let searchParams = this.state.searchParams;
              searchParams.employeeId = value;
              this.setState({ searchParams: searchParams });
            }}
          >
            <Option value="">全部</Option>
            {employee &&
              employee.map((v) => (
                <Option
                  key={v.get('employeeId').toString()}
                  value={v.get('employeeId').toString()}
                >
                  {v.get('employeeName')}
                </Option>
              ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              this._pageSearch({ pageNum: 0, pageSize: 10 })}}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  /**
   * 展示列表
   */
  private showList() {
    const { customerPage, loading, selectedRowKeys, selectedRows } = this.state;
    const { rowChangeBackFun,limitChildFlag } = this.props;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
          getCheckboxProps: (record) => ({
            disabled: limitChildFlag&&record.parentCustomerId,
          }),
          onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
            const sRows = fromJS(selectedRows).filter((f) => f);
            let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
              .concat(fromJS(selectedTableRows).toSet())
              .toList();
            rows = selectedRowKeys
              .map((key) =>
                rows
                  .filter((row) => row.get('customerId') == key)
                  .first()
                  .toJS()
              )
              .filter((f) => f);

            this.setState({
              selectedRows: rows,
              selectedRowKeys: selectedRowKeys
            });
            rowChangeBackFun(selectedRowKeys, rows);
          }
        }}
        rowKey="customerId"
        pagination={{
          total: customerPage.total,
          current: customerPage.currentPage + 1,
          pageSize: 10,
          onChange: (pageNum, pageSize) => {
            const param = {
              pageNum: --pageNum,
              pageSize: pageSize
            };
            this._pageSearch(param);
          }
        }}
        dataSource={customerPage.detailResponseList}
      >
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />

        <Column
          title="地区"
          render={(rowData) => {
            const data = fromJS(rowData);
            const provinceId = data.get('provinceId')
              ? data.get('provinceId').toString()
              : '';
            const cityId = data.get('cityId')
              ? data.get('cityId').toString()
              : '';
            const areaId = data.get('areaId')
              ? data.get('areaId').toString()
              : '';
            return provinceId
              ? FindArea.addressInfo(provinceId, cityId, areaId)
              : '-';
          }}
        />
        <Column
          title="级别"
          key="customerLevelName"
          dataIndex="customerLevelName"
        />
        <Column
          title="客户类型"
          key="customerType"
          dataIndex="customerType"
          render={(customerType) =>
            customerType == '1' ? '商家客户' : '平台客户'
          }
        />
        <Column
          title="是否为主账号"
          key="parentCustomerId"
          dataIndex="parentCustomerId"
          render={(parentCustomerId) => {
            if (parentCustomerId){
              return '否'
            } else {
              return '是'
            }
          }}
        />

        <Column
          title="业务员"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />
      </DataGrid>
    );
  }

  /**
   * 分页查询
   */
  _pageSearch = async ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    params.pageNum = pageNum;
    params.pageSize = pageSize;
    const { res } = await webApi.fetchCustomerList(params);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.setState({
        customerPage: res.context,
        loading: false
      });
    }
    this.setState({
      pageNum,
      pageSize
    });
  };

  /**
   *  初始化列表
   */
  init = async () => {
    const levelResult = await webApi.fetchAllBossCustomerLevel();
    const { res: resEmployee } = await webApi.fetchAllBossEmployee();

    this.setState({
      employee: fromJS(resEmployee),
      customerLevel: fromJS(levelResult.res.context.customerLevelVOList)
    });
    await this._pageSearch({ pageNum: 0, pageSize: 10 });
  };

  _renderCustomerOptionSelect = () => {
    const form = this.state.searchParams;
    return (
      <Select
        value={form.optType}
        // / /   getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeOptions(val)}
      >
        <Option value="0">客户名称</Option>
        <Option value="1">客户账号</Option>
      </Select>
    );
  };

  /**
   * 更改Option
   */
  _changeOptions = (val) => {
    let searchParams = this.state.searchParams;
    searchParams.optType = val;
    searchParams.customerName = '';
    searchParams.customerAccount = '';
    this.setState({ searchParams: searchParams });
  };

  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    let searchParams = this.state.searchParams;
    let optionType = OPTION_TYPE[searchParams.optType];
    searchParams[optionType] = val;
    this.setState({ searchParams: searchParams });
  };
}
