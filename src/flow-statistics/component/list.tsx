import React from 'react';

import { IMap, Relax } from 'plume2';

import { DataGrid, noop } from 'qmkit';

const { Column } = DataGrid;

@Relax
export default class FlowStatisticsList extends React.Component<any, any> {
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
    pageSize: 'pageSize',
    sortedInfo: 'sortedInfo'
  };

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10
    };
  }

  render() {
    const { pageData } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    const { pageSize } = this.state;
    return (
      <DataGrid
        rowKey="date"
        dataSource={
          pageData.get('content') ? pageData.get('content').toJS() : []
        }
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          total: pageData.get('totalElements'),
          pageSize: pageSize,
          current: pageData.get('number') + 1
        }}
      >
        <Column
          title="日期"
          key="date"
          dataIndex="date"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'date' && sortedInfo.order}
        />
        <Column
          title="访客数UV"
          key="totalUv"
          dataIndex="totalUv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'totalUv' && sortedInfo.order}
        />
        <Column
          title="浏览量PV"
          key="totalPv"
          dataIndex="totalPv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'totalPv' && sortedInfo.order}
        />
        <Column
          title="商品访客数"
          key="skuTotalUv"
          dataIndex="skuTotalUv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'skuTotalUv' && sortedInfo.order}
        />
        <Column
          title="商品浏览量"
          key="skuTotalPv"
          dataIndex="skuTotalPv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'skuTotalPv' && sortedInfo.order}
        />
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    const { getPageData } = this.props.relaxProps;
    let pageCurrent = pagination.current;
    const { pageSize } = this.state;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
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
