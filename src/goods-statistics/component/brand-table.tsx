import React from 'react';
import { DataGrid, noop, util } from 'qmkit';
import { Relax } from 'plume2';

const { Column } = DataGrid;

@Relax
export default class BrandTable extends React.Component<any, any> {
  props: {
    relaxProps?: {
      skuReportList: any;
      brandTotal: number;
      brandPageSize: number;
      brandCurrent: number;
      onPagination: Function;
      brandReportList: any;
      changeOrder: Function;
      brandColumns: any;
      dateFlag: number;
      brandSortCol: string;
      brandSortType: number;
    };
  };

  static relaxProps = {
    skuReportList: 'skuReportList',
    brandTotal: 'brandTotal',
    brandPageSize: 'brandPageSize',
    brandCurrent: 'brandCurrent',
    onPagination: noop,
    brandReportList: 'brandReportList',
    changeOrder: noop,
    brandColumns: 'brandColumns',
    dateFlag: 'dateFlag',
    brandSortCol: 'brandSortCol', //默认按下单件数降序排序
    brandSortType: 'brandSortType'
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: {
        columnKey: util.getSortCol(props.relaxProps.brandSortCol),
        order: util.getSortType(props.relaxProps.brandSortType)
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.dateFlag !== this.props.relaxProps.dateFlag ||
      nextProps.relaxProps.brandSortCol != this.props.relaxProps.brandSortCol ||
      nextProps.relaxProps.brandSortType != this.props.relaxProps.brandSortType
    ) {
      this.setState({
        sortedInfo: {
          columnKey: util.getSortCol(nextProps.relaxProps.brandSortCol),
          order: util.getSortType(nextProps.relaxProps.brandSortType)
        }
      });
    }
  }

  render() {
    const { sortedInfo } = this.state;
    const {
      brandReportList,
      brandPageSize,
      brandTotal,
      brandCurrent,
      onPagination,
      brandColumns
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={brandReportList ? brandReportList : []}
        rowKey="title"
        pagination={{
          pageSize: brandPageSize,
          total: brandTotal,
          current: brandCurrent,
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
        <Column title="品牌名称" key="name" dataIndex="name" />
        {brandColumns.length > 0
          ? brandColumns.map(v => {
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
    if(sorter.columnKey&&sorter.order){
      this.setState({sortedInfo: sorter});
    } else {
      this.setState({
        sortedInfo: { columnKey: sortedInfoData.columnKey, order: sortedInfoData.order == 'descend' ? "ascend" : "descend"}
      });
      sorter.field = sortedInfoData.columnKey;
      sorter.order = sortedInfoData.order == 'descend' ? "ascend" : "descend";
    }
    const { changeOrder } = this.props.relaxProps;
    const { sortedInfo } = this.state;
    changeOrder(pagination, filters, sorter, sortedInfo);
  };
}
