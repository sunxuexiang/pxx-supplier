import React from 'react';
import { DataGrid, noop, util } from 'qmkit';
import { Relax } from 'plume2';
const { Column } = DataGrid;

@Relax
export default class SkuTable extends React.Component<any, any> {
  props: {
    relaxProps?: {
      skuReportList: any;
      skuTotal: number;
      skuPageSize: number;
      skuCurrent: number;
      onPagination: Function;
      changeOrder: Function;
      skuColumns: any;
      dateFlag: number;
      skuSortCol: string; //默认按下单件数降序排序
      skuSortType: number;
    };
  };

  static relaxProps = {
    skuReportList: 'skuReportList',
    skuTotal: 'skuTotal',
    skuPageSize: 'skuPageSize',
    skuCurrent: 'skuCurrent',
    onPagination: noop,
    changeOrder: noop,
    skuColumns: 'skuColumns',
    dateFlag: 'dateFlag',
    skuSortCol: 'skuSortCol', //默认按下单件数降序排序
    skuSortType: 'skuSortType'
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: {
        columnKey: util.getSortCol(props.relaxProps.skuSortCol),
        order: util.getSortType(props.relaxProps.skuSortType)
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.dateFlag !== this.props.relaxProps.dateFlag ||
      nextProps.relaxProps.skuSortCol != this.props.relaxProps.skuSortCol ||
      nextProps.relaxProps.skuSortType != this.props.relaxProps.skuSortType
    ) {
      this.setState({
        sortedInfo: {
          columnKey: util.getSortCol(nextProps.relaxProps.skuSortCol),
          order: util.getSortType(nextProps.relaxProps.skuSortType)
        }
      });
    }
  }

  render() {
    const { sortedInfo } = this.state;
    const {
      skuReportList,
      skuPageSize,
      skuTotal,
      skuCurrent,
      skuColumns
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={skuReportList ? skuReportList : []}
        rowKey="title"
        pagination={{
          pageSize: skuPageSize,
          total: skuTotal,
          current: skuCurrent,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true
        }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
      >
        <Column title="序号" key="index" dataIndex="index" />
        <Column
          title="商品信息"
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          render={(_text, record) => {
            return (
              <div>
                <p>{(record as any).goodsInfoName}</p>
                <p style={{ color: '#d9d9d9' }}>{(record as any).detailName}</p>
              </div>
            );
          }}
        />
        {/* <Column title="SKU编码" key="goodsInfoNo" dataIndex="goodsInfoNo" /> */}
        <Column
          title="ERP编码"
          key="erpGoodsInfoNo"
          dataIndex="erpGoodsInfoNo"
        />
        {skuColumns.length > 0
          ? skuColumns.map((v) => {
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

  /**
   * 变更排序
   * @param pagination
   * @param filters
   * @param sorter
   * @private
   */
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
