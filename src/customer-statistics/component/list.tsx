import React from 'react';

import { IMap, Relax } from 'plume2';

import { DataGrid, noop } from 'qmkit';

const { Column } = DataGrid;

@Relax
export default class CustomerStatisticsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      pageData: IMap;
      dateRange: IMap;
      getPageData: Function;
      pageSize: number;
      sortedInfo: IMap;
    };
  };

  static relaxProps = {
    pageData: 'pageData',
    dateRange: 'dateRange',
    getPageData: noop,
    pageSize: 'firstPageSize',
    sortedInfo: 'firstSortedInfo'
  };

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10
    };
  }

  render() {
    const { pageData } = this.props.relaxProps;
    const { pageSize } = this.state;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();

    return (
      <DataGrid
        rowKey={(_row, index) => index.toString()}
        dataSource={pageData.get('data') ? pageData.get('data').toJS() : []}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          pageSize: pageSize,
          current: pageData.get('pageNum'),
          total: pageData.get('total')
        }}
      >
        <Column
          title="日期"
          key="baseDate"
          dataIndex="baseDate"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'baseDate' && sortedInfo.order}
        />
        <Column
          title="客户总数"
          key="customerAllCount"
          dataIndex="customerAllCount"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'customerAllCount' && sortedInfo.order
          }
        />
        <Column
          title="新增客户数"
          key="customerDayGrowthCount"
          dataIndex="customerDayGrowthCount"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'customerDayGrowthCount' &&
            sortedInfo.order
          }
        />
        {/*<Column*/}
        {/*title="注册客户数"*/}
        {/*key="customerDayRegisterCount"*/}
        {/*dataIndex="customerDayRegisterCount"*/}
        {/*sorter={true}*/}
        {/*sortOrder= {sortedInfo.columnKey === 'customerDayRegisterCount' && sortedInfo.order}*/}
        {/*/>*/}
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    const { getPageData } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    let pageCurrent = pagination.current;
    const { pageSize } = this.state;
    if (sortedInfo) {
      if(sorter.columnKey&&sorter.order){
        if (
          sorter.columnKey != sortedInfo.columnKey ||
          sorter.order != sortedInfo.order
        ) {
          pageCurrent = 1;
        }
      } else {
        sorter.columnKey = sortedInfo.columnKey;
        if(sortedInfo.order == "ascend"){
          sorter.order = "descend";
        }
        if(sortedInfo.order == "descend"){
          sorter.order = "ascend";
        }
        pageCurrent = 1;
      }
    }
    if (pageSize !== pagination.pageSize) {
      pageCurrent = 1;
    }
    getPageData(
      pageCurrent,
      pagination.pageSize,
      sorter.columnKey,
      sorter.order
    );
    this.setState({ pageSize: pagination.pageSize });
  };
}
