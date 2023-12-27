import React from 'react';
import { DataGrid, noop, util } from 'qmkit';
import { Relax } from 'plume2';

const { Column } = DataGrid;

@Relax
export default class CateTable extends React.Component<any, any> {
  props: {
    relaxProps?: {
      skuReportList: any;
      cateTotal: number;
      catePageSize: number;
      cateCurrent: number;
      onPagination: Function;
      cateReportList: any;
      changeOrder: Function;
      cateColumns: any;
      dateFlag: number;
      cateSortCol: string;
      cateSortType: number;
    };
  };

  static relaxProps = {
    skuReportList: 'skuReportList',
    cateTotal: 'cateTotal',
    catePageSize: 'catePageSize',
    cateCurrent: 'cateCurrent',
    onPagination: noop,
    cateReportList: 'cateReportList',
    changeOrder: noop,
    cateColumns: 'cateColumns',
    dateFlag: 'dateFlag',
    cateSortCol: 'cateSortCol',
    cateSortType: 'cateSortType'
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: {
        columnKey: util.getSortCol(props.relaxProps.cateSortCol),
        order: util.getSortType(props.relaxProps.cateSortType)
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.dateFlag !== this.props.relaxProps.dateFlag ||
      nextProps.relaxProps.cateSortCol != this.props.relaxProps.cateSortCol ||
      nextProps.relaxProps.cateSortType != this.props.relaxProps.cateSortType
    ) {
      this.setState({
        sortedInfo: {
          columnKey: util.getSortCol(nextProps.relaxProps.cateSortCol),
          order: util.getSortType(nextProps.relaxProps.cateSortType)
        }
      });
    }
  }

  render() {
    const { sortedInfo } = this.state;
    const {
      cateReportList,
      catePageSize,
      cateTotal,
      cateCurrent,
      onPagination,
      cateColumns
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={cateReportList ? cateReportList : []}
        rowKey="title"
        pagination={{
          pageSize: catePageSize,
          total: cateTotal,
          current: cateCurrent,
          onChange: (pageNum, pageSize) => {
            onPagination(pageNum, pageSize);
          },
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true
        }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
      >
        <Column title="序号" key="index" dataIndex="index" />
        <Column title="分类名称" key="name" dataIndex="name" />
        <Column title="上级分类" key="parentNames" dataIndex="parentNames" />
        {cateColumns.length > 0
          ? cateColumns.map((v) => {
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

  _changeOrder = (pagination, filters, sorter) => {
    const sortedInfoData = this.state.sortedInfo;
    if (sorter.columnKey && sorter.order) {
      this.setState({ sortedInfo: sorter });
    } else {
      this.setState({
        sortedInfo: {
          columnKey: sortedInfoData.columnKey,
          order: sortedInfoData.order == 'descend' ? 'ascend' : 'descend'
        }
      });
      sorter.field = sortedInfoData.columnKey;
      sorter.order = sortedInfoData.order == 'descend' ? 'ascend' : 'descend';
    }
    const { changeOrder } = this.props.relaxProps;
    const { sortedInfo } = this.state;
    changeOrder(pagination, filters, sorter, sortedInfo);
  };
}
