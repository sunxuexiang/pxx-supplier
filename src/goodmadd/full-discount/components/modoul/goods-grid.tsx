import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';

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
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood
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

      this.init(
        nextProps.searchParams ? nextProps.searchParams : {},
        this.props.limitNOSpecialPriceGoods,
        this.props.noLimitWare,
        nextProps.marketingId ? nextProps.marketingId : ''
      );
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
    console.log(selectedRowKeys, 'selectedRowKeysselectedRowKeyss')
    const { rowChangeBackFun, visible } = this.props;
    return (
      <div className="content">
        {/*search*/}
        {/* <SearchForm searchBackFun={this.searchBackFun} visible={visible} /> */}

        <DataGrid
          loading={loading}
          rowKey={(record) => record.marketingId}
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
                  rows.filter((row) => row.get('marketingId') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              let keysa = [];
              let rowitem = [];
              rows.forEach(element => {
                if (selectedRowKeys.indexOf(element.marketingId) == -1) {
                  console.log('789')
                  keysa.push(element.toJS().marketingId)
                  rowitem.push(element.toJS())
                }
              });
              // console.log(selectedRowKeys, rows, '9999999999999', goodsInfoPage)
              console.log(keysa, rowitem, '8888888')
              rowChangeBackFun(keysa, fromJS(rowitem));
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
          <Column
            title="活动名称"
            dataIndex="marketingName"
            key="marketingName"
          // width="15%"
          />

          <Column
            title="起止时间"
            // dataIndex="goodsInfoName"
            // key="goodsInfoName"
            render={(value) => {
              if (value) {
                return (
                  value.beginTime.substring(0, value.beginTime.length - 7) +
                  ' - ' +
                  value.beginTime.substring(0, value.beginTime.length - 7)
                );
              } else {
                return '-';
              }
            }}
          // width="20%"
          />

          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />
          {/* 
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
          /> */}
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

  init = async (
    params,
    limitNOSpecialPriceGoods,
    noLimitWare,
    marketingId?
  ) => {
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
    if (!noLimitWare) {
      params.wareId = 1;
    }
    let { res } = await webapi.fetchGoodsList({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      console.log(res, '5555');
      // res['content'].map((goodInfo) => {
      //   const cId = fromJS(res['goodses'])
      //     .find((s) => s.get('goodsId') === goodInfo.marketingId)
      //     .get('cateId');
      //   const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
      //   goodInfo['cateName'] = cate ? cate.get('cateName') : '';

      //   const bId = fromJS(res['goodses'])
      //     .find((s) => s.get('goodsId') === goodInfo.marketingId)
      //     .get('brandId');
      //   const brand =
      //     res['brands'] == null
      //       ? ''
      //       : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
      //   goodInfo['brandName'] = brand ? brand.get('brandName') : '';

      //   return goodInfo;
      // });

      this.setState({
        goodsInfoPage: res,
        loading: false
      });
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
    this.init(
      searchParams,
      this.props.limitNOSpecialPriceGoods,
      this.props.noLimitWare
    );
  };
}
