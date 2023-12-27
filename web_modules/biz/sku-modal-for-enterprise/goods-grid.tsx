import * as React from 'react';
import { Set, fromJS } from 'immutable';

import { DataGrid, Const } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from './webapi';

const { Column } = DataGrid;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      selectedRowKeys: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: {},
      showValidGood: props.showValidGood
    };
  }

  componentDidMount() {
    this.init({saleType:1});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.init({saleType:1});
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      loading,
      goodsInfoPage,
      selectedRowKeys,
      selectedRows,
      showValidGood
    } = this.state;
    const { rowChangeBackFun, visible } = this.props;
    return (
      <div className="content">
        {/*search*/}
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          isScroll={false}
          dataSource={goodsInfoPage.content}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              this._pageSearch({
                pageNum: pageNum - 1,
                pageSize: pageSize
              });
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
                .concat(fromJS(selectedTableRows).toSet())
                .toList();
              rows = selectedRowKeys
                .map((key) =>
                  rows.filter((row) => row.get('goodsInfoId') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              // goodsStatus 的状态为: 商品状态 0：正常 1：缺货 2：失效
              // 仅展示有效的商品，下架状态的SKU勾选框禁用
              disabled: showValidGood ? !showValidGood : record.addedFlag === 0
            })
          }}
        >
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
          />

          <Column
            title="规格"
            key="specText"
            dataIndex="specText"
            width="20%"
          />

          <Column
            title="店铺分类"
            dataIndex="storeCateName"
            key="storeCateName"
          />

          <Column
            title="门店价"
            dataIndex="marketPrice"
            key="marketPrice"
            render={(marketPrice) =>
              marketPrice == null ? 0.0 : marketPrice.toFixed(2)
            }
          />

          <Column title="库存" dataIndex="stock" key="stock" />

          <Column
            title="上下架"
            dataIndex="addedFlag"
            key="addedFlag"
            render={(rowInfo) => {
              if (rowInfo == 0) {
                return '下架';
              }
              if (rowInfo == 2) {
                return '部分上架';
              }
              return '上架';
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize,saleType: 1 });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }

    let { res } = await webapi.fetchGoodsList({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      // 店铺分类列表
      const { res: cateRes } = await webapi.fetchCateList();
      res = (res as any).context;

      res['goodsInfoPage'].content.map((goodInfo) => {
        const specText =
          res['goodsInfoSpecDetails'] &&
          res['goodsInfoSpecDetails']
            .filter(
              (v) => goodInfo.specDetailRelIds.indexOf(v.specDetailRelId) != -1
            )
            .map((v) => {
              return v.detailName;
            })
            .join(' ');
        goodInfo['specText'] = specText ? specText : '-';
        let strInfo =
          goodInfo.storeCateIds && goodInfo.storeCateIds.length
            ? goodInfo.storeCateIds
                .map((info) =>
                  fromJS(cateRes.context)
                    .filter((v) => v.get('storeCateId') == info)
                    .getIn([0, 'cateName'])
                )
                .join(',')
            : '-';
        goodInfo['storeCateName'] = strInfo;
        return goodInfo;
      });

      this.setState({
        goodsInfoPage: res['goodsInfoPage'],
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
