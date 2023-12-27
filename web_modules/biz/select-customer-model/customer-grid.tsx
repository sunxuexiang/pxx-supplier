import React from 'react';
import { Button, Form, Input, message, Select } from 'antd';

import { AreaSelect, Const, DataGrid, FindArea, SelectGroup } from 'qmkit';
import { fromJS, Set } from 'immutable';

import * as webApi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = DataGrid;

export default class CustomerGrid extends React.Component<any, any> {
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
      searchParams: {
        customerName: '',
        customerAccount: ''
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
    return (
      <div className="content">
        {this.showSearchForm()}
        {this.showList()}
      </div>
    );
  }

  /**
   * 展示搜索条件
   */
  private showSearchForm() {
    const customerName = this.state.searchParams.customerName;
    const customerAccount = this.state.searchParams.customerAccount;
    const searchText = customerName || customerAccount;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            placeholder="客户名称"
            addonBefore="客户名称"
            value={customerName}
            onChange={(e: any) => {
              let searchParams = this.state.searchParams;
              searchParams.customerName = e.target.value;
              this.setState({ searchParams });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            placeholder="客户账号"
            addonBefore="客户账号"
            value={customerAccount}
            onChange={(e: any) => {
              let searchParams = this.state.searchParams;
              searchParams.customerAccount = e.target.value;
              this.setState({ customerAccount });
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              this._pageSearch({ pageNum: 0, pageSize: 10 })
            }}
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
    const { rowChangeBackFun } = this.props;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
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
            customerType == '1' ? '我发展的' : '我关联的'
          }
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
    const { searchParams } = this.state;
    const params = {
      customerNameList: searchParams.customerName ? searchParams.customerName.split(',') : [],
      customerAccountList: searchParams.customerAccount ? searchParams.customerAccount.split(',') : [],
      pageNum,
      pageSize
    }
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
    await this._pageSearch({ pageNum: 0, pageSize: 10 });
  };
}
