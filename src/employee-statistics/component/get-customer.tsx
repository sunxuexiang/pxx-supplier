import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';

const { Column } = DataGrid;

@Relax
export default class GetCustomerStatistics extends React.Component<any, any> {
  props: {
    relaxProps?: {
      clientViewList: any;
      clientPageSize: number;
      clientTotal: number;
      clientCurrent: number;
      onClientPagination: Function;
      dateType: any;
      clientSort: string;
      newlySort: string;
    };
  };

  static relaxProps = {
    clientViewList: 'clientViewList',
    clientPageSize: 'clientPageSize',
    clientTotal: 'clientTotal',
    clientCurrent: 'clientCurrent',
    onClientPagination: noop,
    dateType: 'dateType',
    clientSort: 'clientSort',
    newlySort: 'newlySort'
  };

  constructor(props) {
    super(props);
    const { dateType } = props.relaxProps;
    this.state = {
      sortedInfo: {
        //截取字符串
        columnKey:
          dateType == 0 || dateType == 1
            ? this._renderSortCol(props.relaxProps.clientSort)
            : this._renderSortCol(props.relaxProps.newlySort),
        order:
          dateType == 0 || dateType == 1
            ? this._renderSortType(props.relaxProps.clientSort)
            : this._renderSortType(props.relaxProps.newlySort)
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dateType } = nextProps.relaxProps;
    if (
      nextProps.relaxProps.dateType !== this.props.relaxProps.dateType ||
      nextProps.clientSort != this.props.relaxProps.clientSort
    ) {
      this.setState({
        sortedInfo: {
          columnKey:
            dateType == 0 || dateType == 1
              ? this._renderSortCol(nextProps.relaxProps.clientSort)
              : this._renderSortCol(nextProps.relaxProps.newlySort),
          order:
            dateType == 0 || dateType == 1
              ? this._renderSortType(nextProps.relaxProps.clientSort)
              : this._renderSortType(nextProps.relaxProps.newlySort)
        }
      });
    }
  }

  render() {
    const { sortedInfo } = this.state;
    const {
      clientViewList,
      clientTotal,
      clientPageSize,
      clientCurrent,
      dateType
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={clientViewList ? clientViewList : []}
        rowKey="title"
        pagination={{
          pageSize: clientPageSize,
          total: clientTotal,
          current: clientCurrent,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true
        }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
      >
        <Column title="序号" key="index" dataIndex="index" />
        <Column title="业务员" key="employeeName" dataIndex="employeeName" />
        {dateType == 0 || dateType == 1 ? (
          <Column
            title="客户总数"
            key="total"
            dataIndex="total"
            sorter={true}
            sortOrder={sortedInfo.columnKey === 'total' && sortedInfo.order}
          />
        ) : null}
        <Column
          title="新增客户数"
          key="newlyNum"
          dataIndex="newlyNum"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'newlyNum' && sortedInfo.order}
        />
      </DataGrid>
    );
  }

  /**
   * 排序事件
   * @param pagination
   * @param filters
   * @param soter
   * @private
   */
  _changeOrder = async (pagination, _filters, sorter) => {
    const { dateType } = this.props.relaxProps;
    this.setState({
      sortedInfo: sorter.field
        ? sorter
        : dateType == 0 || dateType == 1
          ? { columnKey: 'total', order: 'descend' }
          : {
              columnKey: 'newlyNum',
              order: 'descend'
            }
    });
    const { onClientPagination } = this.props.relaxProps;
    let sort = '';
    //组合排序规则
    if (sorter.field) {
      let field =
        sorter.field == 'newlyNum' ? 'NEWLY' : sorter.field.toUpperCase();
      let order = sorter.order == 'descend' ? 'DESC' : 'ASC';
      sort = field + '_' + order;
    }
    const { sortedInfo } = this.state;
    if (
      sortedInfo.order != sorter.order ||
      sortedInfo.columnKey != sorter.field
    ) {
      await onClientPagination(1, pagination.pageSize, sort);
    } else {
      await onClientPagination(pagination.current, pagination.pageSize, sort);
    }
  };

  /**
   * 排序名称
   * @param clientSort
   * @private
   */
  _renderSortCol = clientSort => {
    //对形如"TOTAL_DESC"这样的排序进行分割
    let sortName = '';
    if (clientSort.split('_')[0] == 'NEWLY') {
      sortName = 'newlyNum';
    } else {
      sortName = clientSort.split('_')[0].toLocaleLowerCase();
    }
    return sortName;
  };

  /**
   * 排序规则
   * @param clientSort
   * @private
   */
  _renderSortType = clientSort => {
    //对形如"TOTAL_DESC"这样的排序进行分割
    let sortType = clientSort.split('_')[1] == 'ASC' ? 'ascend' : 'descend';
    return sortType;
  };
}
