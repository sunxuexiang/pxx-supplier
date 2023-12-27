import * as React from 'react';
import { fromJS, Set } from 'immutable';
import { message } from 'antd';

import { Const, DataGrid, cache } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from './webapi';

const Column = DataGrid;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {}
    };
  }

  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : {});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {}
      });
      this.init(nextProps.searchParams ? nextProps.searchParams : {});
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
      selectedRows
    } = this.state;
    const { rowChangeBackFun, visible, allGoodsList } = this.props;
    return (
      <div className="content">
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage.content}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
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

            //禁用已添加到直播商品库的商品
            getCheckboxProps: (record) => ({
              disabled: allGoodsList.find(
                (item) => item.goodsInfoId == record.goodsInfoId
              )
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
            dataIndex="specText"
            key="specText"
            width="20%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column title="分类" key="goodsCate" dataIndex="cateName" />

          <Column
            title="品牌"
            key="goodsBrand"
            dataIndex="brandName"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="单价"
            key="marketPrice"
            dataIndex="marketPrice"
            render={(data) => {
              return data ? `¥${data}` : '￥0.00';
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    //查缓存
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));

    //查本商家的商品
    params.storeId = loginInfo.storeId;
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
     params.wareId=1;
    let { res } = await webapi.fetchGoodsList({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      res['goodsInfoPage'].content.map((goodInfo) => {
        const cId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('cateId');
        const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
        goodInfo['cateName'] = cate ? cate.get('cateName') : '';

        const bId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('brandId');
        const brand =
          res['brands'] == null
            ? ''
            : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
        goodInfo['brandName'] = brand ? brand.get('brandName') : '';

        return goodInfo;
      });

      this.setState({
        goodsInfoPage: res['goodsInfoPage'],
        loading: false
      });
    } else {
      message.error((res as any).message);
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    if (this.props.searchParams) {
      searchParams = { ...searchParams, ...this.props.searchParams };
    }
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
