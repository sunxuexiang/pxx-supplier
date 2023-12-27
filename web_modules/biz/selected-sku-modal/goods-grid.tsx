import * as React from 'react';
import { fromJS, Set } from 'immutable';
import { Pagination, Table } from 'antd';
import { Const, DataGrid, util } from 'qmkit';

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
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      selectedRowKeys: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood,
      wareId: props.wareId
    };
  }

  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : { wareId: this.props.wareId }, this.props.limitNOSpecialPriceGoods, this.props.noLimitWare);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps,'nextProps');
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {}
      });

      this.init(nextProps.searchParams ? nextProps.searchParams : { wareId: nextProps.wareId }, this.props.limitNOSpecialPriceGoods, this.props.noLimitWare, nextProps.marketingId ? nextProps.marketingId : '');
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
      wareId: nextProps.wareId
    });
  }

  render() {
    const {
      loading,
      goodsInfoPage,
      selectedRowKeys,
      selectedRows,
      showValidGood,
      wareId
    } = this.state;
    const { rowChangeBackFun, visible, needHide, showThirdColumn } = this.props;
    console.log('====================================');
    console.log(goodsInfoPage, 'goods_grid');
    console.log('====================================');
    return (
      <div className="content">
        {/*search*/}
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} wareId={wareId} needHide={needHide} />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage.content}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "40", "60", "80", "100"],
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize,
                wareId
              };
              this._pageSearch(param);
            },
            onShowSizeChange: (current, pageSize) => {
              const param = {
                pageNum: 0,
                pageSize: pageSize,
                wareId
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
          scroll={{ x: true }}
        >
          {!util.isThirdStore() && needHide && (
            <Column
              title='序号'
              width={65}
              align='center'
              render={(text, record, index) => {
                return (`${(goodsInfoPage.number) * (goodsInfoPage.size) + (index + 1)}`) //当前页数减1乘以每一页页数再加当前页序号+1
              }
              }
            />
          )}

          {!util.isThirdStore() && needHide && (
            <Column
              title="SKU编码"
              dataIndex="goodsInfoNo"
              key="goodsInfoNo"
              width={130}
              align='center'
            />
          )}

          {!util.isThirdStore() && needHide && (
            <Column
              title="ERP编码"
              dataIndex="erpGoodsInfoNo"
              key="erpGoodsInfoNo"
              align='center'
              width={150}
            />
          )}


          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            align='center'
            width={220}
          />
          {util.isThirdStore() && (
            <Column
              title="规格"
              dataIndex="specText"
              key="specText"
              align='center'
              width={150}
              render={(text, row: any) => {
                const result = [];
                row.goodsAttributeKeys?.forEach(item => {
                  result.push(item.goodsAttributeValue);
                });
                return result.join('-');
              }}
            />
          )}
          {!util.isThirdStore() && needHide && (
            <Column
              title="适用区域"
              dataIndex="wareName"
              key="wareName"
              align='center'
              width={130}
            />
          )}

          <Column title="分类" key="goodsCate" dataIndex="cateName" align='center' width={150} />

          <Column
            title="品牌"
            key="goodsBrand"
            dataIndex="brandName"
            align='center'
            width={150}
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="销售价"
            key="marketPrice"
            dataIndex="marketPrice"
            align='center'
            width={80}
            render={(data) => {
              return data ? `¥${data}` : '￥0.00';
            }}
          />

          {showThirdColumn && <Column title="条形码" key="goodsInfoBarcode" dataIndex="goodsInfoBarcode" align='center' width={150} />}
          {!util.isThirdStore() && needHide && showThirdColumn && <Column title="计量单位" key="goodsUnit" dataIndex="goodsUnit" align='center' width={90} />}
        </DataGrid>
        {/* <Pagination defaultCurrent={1} total={50} /> */}
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize, wareId }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize, wareId }, this.props.limitNOSpecialPriceGoods, this.props.noLimitWare);
    this.setState({
      pageNum,
      pageSize,
      wareId
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
    // if (!noLimitWare){
    //   params.wareId=1;
    // }
    console.log(params, 'params');
    if (params.wareId == 0) {
      params.wareId = null
    }
    let { res } = await webapi.fetchGoodsList({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      console.log(res, 'goodsgoodsgoods')
      const wareHouseVOPage =
        JSON.parse(localStorage.getItem('warePage')) || [];
      res['goodsInfoPage'].content.map((goodInfo) => {
        wareHouseVOPage.forEach(element => {
          if (element.wareId == goodInfo.wareId) {
            goodInfo.wareName = element.wareName
          }
        });

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
    this.init(searchParams, this.props.limitNOSpecialPriceGoods, this.props.noLimitWare);
  };
}
