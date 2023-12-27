import React from 'react';
import { DataGrid, noop } from 'qmkit';
import { Relax } from 'plume2';
const { Column } = DataGrid;
@Relax
export default class AchieveStatistics extends React.Component<any, any> {
  props: {
    relaxProps?: {
      achieveViewList: any;
      achievePageSize: number;
      achieveTotal: number;
      achieveCurrent: number;
      achieveColumns: any;
      dateType: any;
      changeOrder: Function;
      onAchievePagination: Function;
      achieveSortName: string;
      achieveSortType: string;
    };
  };

  static relaxProps = {
    achieveViewList: 'achieveViewList',
    achievePageSize: 'achievePageSize',
    achieveTotal: 'achieveTotal',
    achieveCurrent: 'achieveCurrent',
    achieveColumns: 'achieveColumns',
    dateType: 'dateType',
    changeOrder: noop,
    onAchievePagination: noop,
    achieveSortName: 'achieveSortName',
    achieveSortType: 'achieveSortType'
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: {
        columnKey: props.relaxProps.achieveSortName,
        order: props.relaxProps.achieveSortType
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.dateType !== this.props.relaxProps.dateType ||
      nextProps.relaxProps.achieveSortName !=
        this.props.relaxProps.achieveSortName ||
      nextProps.relaxProps.achieveSortType !=
        this.props.relaxProps.achieveSortType
    ) {
      this.setState({
        sortedInfo: {
          columnKey: nextProps.relaxProps.achieveSortName,
          order: nextProps.relaxProps.achieveSortType
        }
      });
    }
  }

  render() {
    const { sortedInfo } = this.state;
    const {
      achieveColumns,
      achieveViewList,
      achievePageSize,
      achieveTotal,
      achieveCurrent
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={achieveViewList ? achieveViewList : []}
        rowKey="employeeId"
        pagination={{
          pageSize: achievePageSize,
          total: achieveTotal,
          current: achieveCurrent,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true
        }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
      >
        <Column title="序号" key="index" dataIndex="index" />
        <Column title="业务员" key="employeeName" dataIndex="employeeName" />
        {achieveColumns.length > 0
          ? achieveColumns.map(v => {
              return (
                <Column
                  title={v.title}
                  key={v.key}
                  dataIndex={v.key}
                  sorter={true}
                  sortOrder={sortedInfo.columnKey === v.key && sortedInfo.order}
                />
              );
            })
          : null}
      </DataGrid>
    );
  }

  _changeOrder = (pagination, _filters, sorter) => {
    this.setState({
      sortedInfo: sorter.field
        ? sorter
        : { columnKey: 'amount', order: 'descend' }
    });
    const { changeOrder } = this.props.relaxProps;
    const { sortedInfo } = this.state;
    if (
      sortedInfo.order != sorter.order ||
      sortedInfo.columnKey != sorter.field
    ) {
      changeOrder(1, pagination.pageSize, sorter);
    } else {
      changeOrder(pagination.current, pagination.pageSize, sorter);
    }
  };
}
