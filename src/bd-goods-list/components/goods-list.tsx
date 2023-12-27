import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper, Const, checkAuth } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Menu, Dropdown, Table, Modal, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
const { Column } = Table;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');

@withRouter
@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      total: number;
      form: IList;
      onFormFieldChange: Function;
      onSearch: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      pageSize:number;
      expandedRowKeys: IList;
      switchShowModal: Function;
      onFieldChange: Function;
      searchBrandLink: Function;
      likeGoodsName: string;
      likeErpNo: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      brandList: IList;
      cateList: IList;
      goodsType: string;
      specialPriceFirst: any;
      specialPriceLast: any;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onSearch: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    pageSize:'pageSize',
    expandedRowKeys: 'expandedRowKeys',
    switchShowModal: noop,
    onFieldChange: noop,
    searchBrandLink: noop,
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    likeErpNo: 'likeErpNo',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    goodsType: 'goodsType',
    specialPriceFirst: 'specialPriceFirst',
    specialPriceLast: 'specialPriceLast'
  };

  render() {
    const {
      goodsBrandList,
      goodsPageContent,
      selectedSpuKeys,
      onSelectChange,
      total,
      pageNum,
      pageSize,
      expandedRowKeys,
      onShowSku,
      likeGoodsName,
      likeGoodsInfoNo,
      likeGoodsNo,
      stockUp,
      likeErpNo,
      auditStatus,
      goodsInfoType
    } = this.props.relaxProps;
    let hasMenu = false;
    if (
      checkAuth('f_bd_goods_sku_edit_2') ||
      checkAuth('f_bd_goods_sku_edit_3') ||
      checkAuth('f_bd_goods_up_down') ||
      checkAuth('f_bd_goods_6')
    ) {
      hasMenu = true;
    }
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpand={(expanded, record) => {
          let keys = fromJS([]);
          if (expanded) {
            keys = expandedRowKeys.push(record.goodsId);
          } else {
            keys = expandedRowKeys.filter((key) => key != record.goodsId);
          }
          onShowSku(keys);
        }}
        rowSelection={{
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
        }}
        pagination={{ 
          total, 
          current: pageNum + 1,
          pageSize:pageSize,
          showSizeChanger:true,
          showQuickJumper:true,
          pageSizeOptions:["10","40","60","80","100"],
          onChange: this._getData,
          onShowSizeChange:(current,pageSize)=>{
            this._getData(1,pageSize);
          }
         }}
      >
        {/* <Column
          title="排序"
          dataIndex="goodsSeqNum"
          key="goodsSeqNum"
          render={(goodsSeqNum) => (goodsSeqNum ? goodsSeqNum : '-')}
        /> */}
        <Column
          title="图片"
          dataIndex="goodsImg"
          key="goodsImg"
          render={(img) =>
            img ? (
              <img src={img} style={styles.imgItem} />
            ) : (
              <img src={defaultImg} style={styles.imgItem} />
            )
          }
        />
        <Column
          title="商品名称"
          dataIndex="goodsName"
          key="goodsName"
          className="nameBox"
          width={200}
        />
        <Column title="SPU编码" dataIndex="goodsNo" key="goodsNo" />
        <Column
          title="商品类型"
          key="goodsType"
          render={(rowInfo) => {
            const { goodsType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {goodsType == 2 ? '特价商品' : '普通商品'}
                </p>
              </div>
            );
          }}
        />
        {/* <Column
          title="囤货状态"
          key="purchaseNum"
          render={(rowInfo) => {
            const { marketingId, purchaseNum } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {marketingId > 0 && purchaseNum <= 0
                    ? '等货中'
                    : marketingId > 0 && purchaseNum > 0
                    ? '囤货中'
                    : marketingId > 0 && purchaseNum == 0
                    ? '已囤完'
                    : '非囤货商品'}
                </p>
              </div>
            );
          }}
        /> */}
        <Column
          title="销售类型"
          key="saleType"
          render={(rowInfo) => {
            const { saleType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {saleType == 0 ? '批发' : (saleType == 1?'零售':'散批')}
                </p>
              </div>
            );
          }}
        />
        <Column
          title={
            <span>
              门店价
              {/*<br />*/}
              {/*设价方式*/}
            </span>
          }
          key="marketPrice"
          render={(rowInfo) => {
            const { marketPrice, priceType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {marketPrice == null ? 0.0 : marketPrice.toFixed(2)}
                </p>
                {/*<p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>*/}
              </div>
            );
          }}
        />
        <Column
          title={
            <span>
              大客户价
              {/*<br />*/}
              {/*设价方式*/}
            </span>
          }
          key="vipPrice"
          render={(rowInfo) => {
            const { vipPrice, marketPrice } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {vipPrice == null
                    ? marketPrice.toFixed(2)
                    : vipPrice.toFixed(2)}
                </p>
                {/*<p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>*/}
              </div>
            );
          }}
        />
        <Column
          title="特价"
          // dataIndex="specialPrice"
          key="specialPrice"
          render={
            (rowInfo) => (
              <span>
                {rowInfo.goodsType == 2 ? rowInfo.specialPrice.toFixed(2) : '-'}
              </span>
            )
            // specialPrice == null ? 0.0 : specialPrice.toFixed(2)
          }
        />
        <Column
          title="批次号"
          // dataIndex="goodsInfoBatchNo"
          key="goodsInfoBatchNo"
          render={
            (rowInfo) => (
              <span>
                {rowInfo.goodsInfoBatchNo ? rowInfo.goodsInfoBatchNo : '-'}
              </span>
            )
            // specialPrice == null ? 0.0 : specialPrice.toFixed(2)
          }
        />
        <Column
          title="店铺分类"
          dataIndex="storeCateIds"
          key="storeCateIds"
          width={150}
          render={this._renderStoreCateList}
        />
        <Column
          title="品牌"
          dataIndex="brandId"
          key="brandId"
          render={(rowInfo) => {
            return (
              goodsBrandList
                .filter((v) => {
                  return v.get('brandId') == rowInfo;
                })
                .getIn([0, 'brandName']) || '-'
            );
          }}
        />
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
        <Column title="所属仓库" dataIndex="wareName" key="wareName" />
        <Column
          align="center"
          title="操作"
          key="goodsId"
          className="operation-th"
          render={(rowInfo) => {
            return hasMenu ? this._menu(rowInfo) : '-';
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 渲染多个店铺分类
   */
  _renderStoreCateList = (rowInfo) => {
    const { allCateList } = this.props.relaxProps;
    if (rowInfo && rowInfo.length) {
      const strInfo = rowInfo
        .map((info) =>
          allCateList
            .filter((v) => v.get('storeCateId') == info)
            .getIn([0, 'cateName'])
        )
        .join(',');
      if (strInfo.length > 20) {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo.substr(0, 20)}...
          </Tooltip>
        );
      } else {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo}
          </Tooltip>
        );
      }
    }
    return '-';
  };

  _menu = (rowInfo) => {
    const {
      spuOnSale,
      spuOffSale,
      switchShowModal,
      pageNum,
      onFieldChange,
      searchBrandLink
    } = this.props.relaxProps;
    return (
      <div className="operation-box">
        {rowInfo.goodsType == 2 && (
          <AuthWrapper functionName="f_bd_goods_sku_edit_price">
            <a
              href="javascript:void(0);"
              onClick={() => {
                const goodsInfoIdList = [];
                goodsInfoIdList.push(rowInfo.goodsInfoIds);
                onFieldChange('goodsInfoIdList', ...goodsInfoIdList);
                onFieldChange(
                  'goodDiscount',
                  (rowInfo.specialPrice / rowInfo.marketPrice).toFixed(1)
                );
                switchShowModal(true, '设价');
              }}
            >
              设价&nbsp;
            </a>
          </AuthWrapper>
        )}
        {rowInfo.goodsType != 2 && (
          <AuthWrapper functionName="f_bd_goods_sku_edit_2">
            <a
              href="javascript:;"
              onClick={() => {
                // let request: any = {
                //   likeGoodsName: likeGoodsName,
                //   likeGoodsInfoNo: likeGoodsInfoNo,
                //   likeGoodsNo: likeGoodsNo,
                //   pageNum: pageNum,
                //   stockUp: stockUp,
                //   likeErpNo: likeErpNo,
                //   pageSize: pageSize,
                //   auditStatus: auditStatus,
                //   goodsInfoType: 0
                // };

                history.push({
                  pathname: `/bd_goods-edit/${rowInfo.goodsId}/${pageNum}`,
                  state: { tab: 'main' }
                });
              }}
            >
              编辑
            </a>
          </AuthWrapper>
        )}
        {/* <AuthWrapper functionName="f_goods_edit_sort">
          <a
            href="javascript:;"
            onClick={() => {
              rowInfo.brandId && searchBrandLink(rowInfo.brandId)
              onFieldChange('goodsInfo', rowInfo);
              onFieldChange('goodsSeqNum', rowInfo.goodsSeqNum);
              switchShowModal(true);
            }}
          >
            编辑排序
          </a>
        </AuthWrapper> */}
        {/*<AuthWrapper functionName="f_goods_sku_edit_3">*/}
        {/*<a*/}
        {/*href="javascript:;"*/}
        {/*onClick={() =>*/}
        {/*history.push({*/}
        {/*pathname: `/ls_goods-edit/${rowInfo.goodsId}`,*/}
        {/*state: { tab: 'price' }*/}
        {/*})*/}
        {/*}*/}
        {/*>*/}
        {/*设价*/}
        {/*</a>*/}
        {/*</AuthWrapper>*/}
        {rowInfo.addedFlag == 0 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_bd_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                spuOnSale([rowInfo.goodsId]);
              }}
            >
              上架
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.addedFlag == 1 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_bd_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                spuOffSale([rowInfo.goodsId]);
              }}
            >
              下架
            </a>
          </AuthWrapper>
        ) : null}
        <AuthWrapper functionName="f_bd_goods_6">
          <a
            href="javascript:;"
            onClick={() => {
              this._delete(rowInfo.goodsId);
            }}
          >
            删除
          </a>
        </AuthWrapper>
      </div>
    );
  };

  _expandedRowRender = (record, index) => {
    const { goodsInfoList, goodsInfoSpecDetails } = this.props.relaxProps;
    const currentGoods = goodsInfoList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });
    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = goodsInfoSpecDetails
          .filter(
            (v) =>
              goods.get('specDetailRelIds').indexOf(v.get('specDetailRelId')) !=
              -1
          )
          .map((v) => {
            return v.get('detailName');
          })
          .join(' ');

        return (
          <div key={`${index}_${i}`} style={styles.item}>
            <div style={{ marginLeft: 17 }}>
              <img
                src={
                  goods.get('goodsInfoImg')
                    ? goods.get('goodsInfoImg')
                    : defaultImg
                }
                style={styles.imgItem}
              />
              <AuthWrapper functionName="f_bd_goods_sku_edit_2">
                <a
                  href="javascript:;"
                  style={{
                    marginTop: 5,
                    marginRight: 5,
                    display: 'inline-block'
                  }}
                  onClick={() =>
                    history.push({
                      pathname: `/bd_goods-sku-edit/${goods.get(
                        'goodsInfoId'
                      )}`,
                      state: { tab: 'main' }
                    })
                  }
                >
                  编辑
                </a>
              </AuthWrapper>
              {/*<AuthWrapper functionName="f_goods_sku_edit_3">*/}
              {/*{record.priceType === 1 && !record.allowPriceSet ? null : (*/}
              {/*<a*/}
              {/*href="javascript:;"*/}
              {/*style={{ marginTop: 5, display: 'inline-block' }}*/}
              {/*onClick={() =>*/}
              {/*history.push({*/}
              {/*pathname: `/ls_goods-sku-edit/${goods.get('goodsInfoId')}`,*/}
              {/*state: { tab: 'price' }*/}
              {/*})*/}
              {/*}*/}
              {/*>*/}
              {/*设价*/}
              {/*</a>*/}
              {/*)}*/}
              {/*</AuthWrapper>*/}
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span className="specification" style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU编码：</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>门店价：</label>
                {goods.get('marketPrice') || goods.get('marketPrice') === 0
                  ? goods.get('marketPrice').toFixed(2)
                  : 0}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>上下架：</label>
                {goods.get('addedFlag') == 0 ? '下架' : '上架'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>条形码：</label>
                {goods.get('goodsInfoBarcode')
                  ? goods.get('goodsInfoBarcode')
                  : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>大客户价：</label>
                {goods.get('vipPrice')
                  ? goods.get('vipPrice').toFixed(2)
                  : goods.get('marketPrice').toFixed(2)}
              </div>
            </div>
          </div>
        );
      })
      .toJS();
  };

  //通过图标点击显示SKU
  _showSkuByIcon = (index) => {
    const { onShowSku } = this.props.relaxProps;
    let goodsIds = List();
    if (index != null && index.length > 0) {
      index.forEach((value, key) => {
        goodsIds = goodsIds.set(key, value);
      });
    }
    onShowSku(goodsIds);
  };

  _getData = (pageNum, pageSize) => {
    const { onFormFieldChange, onPageSearch } = this.props.relaxProps;
    onFormFieldChange({ key: 'pageNum', value: --pageNum });
    onFormFieldChange({ key: 'pageSize', value: pageSize });
    onPageSearch();
  };

  /**
   * 删除
   */
  _delete = (goodsId: string) => {
    const { spuDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除这个商品吗？',
      onOk() {
        spuDelete([goodsId]);
      }
    });
  };
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  cell: {
    color: '#999',
    width: 200,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 120,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
