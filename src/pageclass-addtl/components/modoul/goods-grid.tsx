import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid, cache } from 'qmkit';
import { Table } from 'antd';
import SearchForm from './search-form';
import * as webapi from './webapi';

const { Column } = Table;

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
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood,
      searchForm: props.searchForm || {}
    };
  }

  componentDidMount() {
    this.init(
      this.props.searchParams ? this.props.searchParams : {},
      this.props.limitNOSpecialPriceGoods,
      this.props.noLimitWare
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {}
      });
      console.log(nextProps, 'nextProps');
      this.setState({ searchForm: nextProps.searchForm || {} }, () => {
        this.init(
          nextProps.searchParams ? nextProps.searchParams : {},
          this.props.limitNOSpecialPriceGoods,
          this.props.noLimitWare,
          nextProps.marketingId ? nextProps.marketingId : ''
        );
      });
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
        {/* <SearchForm searchBackFun={this.searchBackFun} visible={visible} /> */}

        <DataGrid
          loading={loading}
          rowKey={(record) => record.pageCode}
          dataSource={goodsInfoPage.pageInfoList}
          pagination={{
            total: goodsInfoPage.totalCount,
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
                  rows.filter((row) => row.get('pageCode') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              /* old: 如果validFlag === 0 标识该商品不是有效的商品,可能存在情况是=>无货,起订量大于库存etc..
                      该情况下商品checkbox置灰,禁止选中 */

              // 以上两行注释是老的逻辑, 新的逻辑需要把状态为无货的商品给放开
              // goodsStatus 的状态为: 商品状态 0：正常 1：缺货 2：失效
              // 因此判断等于2的失效状态下禁用
              disabled: showValidGood
                ? !showValidGood
                : record.goodsStatus === 2
            })
          }}
        >
          <Column title="海报标题" dataIndex="title" key="title" />
          <Column title="类型ID" key="pageCode" dataIndex="pageCode" />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init(
      { ...params, pageNum, pageSize },
      this.props.limitNOSpecialPriceGoods,
      this.props.noLimitWare
    );
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params, limitNOSpecialPriceGoods, noLimitWare, marketingId) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (marketingId) {
      params.marketingId = marketingId;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    // if (limitNOSpecialPriceGoods){
    //   params.goodsInfoType=0;
    // }
    console.log(this.state.searchForm, 'searchForm');
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    let storeId = loginInfo.storeId;
    const ress = await fetch(
      `${Const.X_XITE_OPEN_HOST}/api/page/list?includePageTypeList=[%22poster%22]&excludePageTypeList=[]&platform=weixin&pageNo=${params.pageNum}&pageSize=${params.pageSize}&storeId=${storeId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: (window as any).token
        }
      }
    ).then((res: any) => {
      return res.json();
    });
    if (ress.status == 1) {
      ress.data.number = params.pageNum;
      ress.data.size = params.pageSize;
      this.setState({
        goodsInfoPage: ress.data,
        loading: false
      });
      // this.transaction(() => {
      //   this.dispatch('loading:end');
      //   this.dispatch('listActor:init', res);
      //   this.dispatch('list:currentPage', pageNum + 1);
      // });
    } else {
      this.setState({
        loading: false
      });
    }
    console.log(ress, 'ressressress');

    // if ((res as any).code == Const.SUCCESS_CODE) {
    //   res = (res as any).context;
    //   res['goodsInfoPage'].content.map((goodInfo) => {
    //     const cId = fromJS(res['goodses'])
    //       .find((s) => s.get('goodsId') === goodInfo.goodsId)
    //       .get('cateId');
    //     const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
    //     goodInfo['cateName'] = cate ? cate.get('cateName') : '';

    //     const bId = fromJS(res['goodses'])
    //       .find((s) => s.get('goodsId') === goodInfo.goodsId)
    //       .get('brandId');
    //     const brand =
    //       res['brands'] == null
    //         ? ''
    //         : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
    //     goodInfo['brandName'] = brand ? brand.get('brandName') : '';

    //     return goodInfo;
    //   });

    //   this.setState({
    //     goodsInfoPage: res['goodsInfoPage'],
    //     loading: false
    //   });
    // }
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
    this.init(
      searchParams,
      this.props.limitNOSpecialPriceGoods,
      this.props.noLimitWare
    );
  };
}
