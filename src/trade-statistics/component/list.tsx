import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
const { Column } = DataGrid;

@Relax
export default class TradeStatisticsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeTable: any;
      total: number;
      pageSize: number;
      current: number;
      onPagination: Function;
      tableColumns: any;
      startDate: string; //开始时间
      endDate: string; //结束时间，
      sortedName: string; //排序的列
      sortedOrder: string; //排序的种类（升或降）
    };
  };

  static relaxProps = {
    tradeTable: 'tradeTable',
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    onPagination: noop,
    tableColumns: 'tableColumns',
    startDate: 'startDate', //开始时间
    endDate: 'endDate', //结束时间，
    sortedName: 'sortedName', //排序的列
    sortedOrder: 'sortedOrder' //排序的种类（升或降）
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: {
        columnKey: props.relaxProps.sortedName,
        order: props.relaxProps.sortedOrder
      }
    };
  }

  /**
   * 数据源发生变化时，以新的为准
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.startDate !== this.props.relaxProps.startDate ||
      nextProps.sortedName != this.props.relaxProps.sortedName ||
      nextProps.sortedOrder != this.props.relaxProps.sortedOrder
    ) {
      this.setState({
        sortedInfo: {
          columnKey: nextProps.relaxProps.sortedName,
          order: nextProps.relaxProps.sortedOrder
        }
      });
    }
  }

  render() {
    const {
      tradeTable,
      total,
      pageSize,
      current,
      tableColumns
    } = this.props.relaxProps;
    const { sortedInfo } = this.state;
    return (
      <DataGrid
        dataSource={tradeTable ? tradeTable : []}
        rowKey="title"
        pagination={{
          pageSize,
          total,
          current: current,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true
        }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
      >
        <Column
          title="日期"
          key="title"
          dataIndex="title"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'title' && sortedInfo.order}
        />
        {tableColumns.map(v => {
          return (
            <Column
              title={v.title}
              key={v.key}
              dataIndex={v.key}
              sorter={true}
              sortOrder={sortedInfo.columnKey === v.key && sortedInfo.order}
            />
          );
        })}
      </DataGrid>
    );
  }

  /**
   * 升降序排列
   * @param pagination
   * @param _filters
   * @param sorter
   * @private
   */
  _changeOrder = (pagination, _filters, sorter) => {
    const { onPagination } = this.props.relaxProps;
    //普通换页还是排序,当前的排序名称不变，则为页切换，变化的话则为排序，从第一页开始
    const { sortedInfo } = this.state;
    if (sortedInfo) {
      if(sorter.field&&sorter.order){
        //sortName
        const field = sorter.field == 'title' ? 'date' : sorter.field;
        //sortOrder
        const order = sorter.order == 'descend' ? 'DESC' : 'ASC';
        if (
          sortedInfo.columnKey != sorter.field ||
          sortedInfo.order != sorter.order
        ) {
          onPagination(1, pagination.pageSize, field, order);
        } else {
          onPagination(pagination.current, pagination.pageSize, field, order);
        }
      } else {
        sorter.field = sortedInfo.columnKey;
        sorter.order = sortedInfo.order == 'descend' ?  'ASC' : 'DESC';
        onPagination(1, pagination.pageSize, sortedInfo.columnKey  == 'title' ? 'date' : sorter.field, sortedInfo.order == 'descend' ?  'ASC' : 'DESC');
      }
    }
    this.setState({
      sortedInfo: sorter.field
        ? sorter
        : { columnKey: 'title', order: 'descend' }
    });
  };
}
