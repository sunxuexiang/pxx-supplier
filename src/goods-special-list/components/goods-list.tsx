import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { DataGrid, noop, AuthWrapper, checkAuth } from 'qmkit';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
import { Modal } from 'antd';
const confirm = Modal.confirm;

const { Column } = DataGrid;
const defaultImg = require('../img/none.png');

// /**
//  * 分销商品审核状态 0:普通商品 1:待审核 2:已审核通过 3:审核不通过 4:禁止分销
//  * @type {{"0": string; "1": string; "2": string; "3": string; "4": string}}
//  */
// const GOODS_AUDIT_TYPE = {
//   0: '普通商品',
//   1: '待审核',
//   2: '已审核',
//   3: '审核未通过',
//   4: '禁止分销'
// };

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      goodsCateList: IList;
      goodsBrandList: IList;
      selectedSkuKeys: IList;
      total: number;
      pageNum: number;
      form: any;
      sortedInfo: IMap;
      onFormFieldChange: Function;
      onSelectChange: Function;
      init: Function;
      setSortedInfo: Function;
      checkSwapInputGroupCompact: Function;
      onChecked: Function;
      onFieldChange: Function;
      switchShowModal: Function;
      setGoodsPrice: Function;
      skuOnSale: Function;
      skuOffSale: Function;
      deleteGood: Function;
      spuDelete: Function;
    };
  };

  static relaxProps = {
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    goodsCateList: 'goodsCateList',
    goodsBrandList: 'goodsBrandList',
    selectedSkuKeys: 'selectedSkuKeys',
    total: 'totalCount',
    pageNum: 'pageNum',
    form: 'form',
    sortedInfo: 'sortedInfo',
    onFormFieldChange: noop,
    onSelectChange: noop,
    init: noop,
    setSortedInfo: noop,
    checkSwapInputGroupCompact: noop,
    onChecked: noop,
    // 设置驳回或禁止分销的skuId
    onFieldChange: noop,
    // 显示/关闭弹窗
    switchShowModal: noop,
    //上架
    skuOnSale: noop,
    //下架
    skuOffSale: noop,
    //删除
    spuDelete: noop
  };

  render() {
    const {
      goodsCateList,
      goodsBrandList,
      goodsInfoList,
      selectedSkuKeys,
      total,
      pageNum,
      onSelectChange,
      init,
      sortedInfo
      // onFieldChange,
      // switchShowModal,
      // spuOnSale,
      // spuOffSale,
      // deleteGood
    } = this.props.relaxProps;
    // 表格排序
    const sortInfo = sortedInfo.toJS();
    let hasMenu = false;
    if (
      // checkAuth('f_goods_sku_edit_2') ||
      checkAuth('f_goods_sku_edit_3') ||
      checkAuth('f_goods_up_down') ||
      checkAuth('f_goods_6')
    ) {
      hasMenu = true;
    }
    return (
      <DataGrid
        className="resetTable"
        rowKey={(record) => record.goodsInfoId}
        rowSelection={{
          selectedRowKeys: selectedSkuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
          // getCheckboxProps: (record) => ({
          //   disabled: record.distributionGoodsAudit != 1
          // })
        }}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        dataSource={goodsInfoList.toJS()}
        pagination={{
          total,
          current: pageNum + 1,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="图片"
          dataIndex="goodsInfoImg"
          key="goodsInfoImg"
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
          dataIndex="goodsInfoName"
          key="goodsInfoName"
          className="nameBox"
          width={200}
        />
        <Column title="SKU编码" dataIndex="goodsInfoNo" key="goodsInfoNo" />
        <Column
          title="批次号"
          dataIndex="goodsInfoBatchNo"
          key="goodsInfoBatchNo"
        />

        <Column
          title="平台类目"
          dataIndex="cateId"
          key="cateId"
          render={(rowInfo) => {
            return goodsCateList
              .filter((v) => {
                return v.get('cateId') == rowInfo;
              })
              .getIn([0, 'cateName']);
          }}
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
          title="原价"
          dataIndex="marketPrice"
          key="marketPrice"
          sorter={true}
          sortOrder={sortInfo.columnKey === 'marketPrice' && sortInfo.order}
          render={(marketPrice) =>
            marketPrice == null ? 0.0 : marketPrice.toFixed(2)
          }
        />
        <Column
          title="特价"
          dataIndex="specialPrice"
          key="specialPrice"
          sorter={true}
          sortOrder={sortInfo.columnKey === 'specialPrice' && sortInfo.order}
          render={(specialPrice) =>
            specialPrice == null ? 0.0 : specialPrice.toFixed(2)
          }
        />
        <Column
          align="center"
          title="操作"
          key="goodsInfoId"
          render={(rowInfo) => {
            console.log(rowInfo.addedFlag);
            return hasMenu ? this._menu(rowInfo) : '-';
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 拼装商品信息
   * @param rowInfo
   * @returns {{goodsInfoId: any; goodsInfoNo: any; goodsInfoName: any; goodsInfoImg: any; currentGoodsSpecDetails: string}}
   * @private
   */
  _dealData = (rowInfo) => {
    const { goodsInfoSpecDetails } = this.props.relaxProps;
    const {
      goodsInfoId,
      goodsInfoNo,
      goodsInfoName,
      goodsInfoImg,
      specDetailRelIds
    } = rowInfo;
    const currentGoodsSpecDetails =
      goodsInfoSpecDetails &&
      goodsInfoSpecDetails
        .filter((v) => specDetailRelIds.indexOf(v.get('specDetailRelId')) != -1)
        .map((v) => {
          return v.get('detailName');
        })
        .join(' ');
    const dataResult = {
      goodsInfoId: goodsInfoId,
      goodsInfoNo: goodsInfoNo,
      goodsInfoName: goodsInfoName,
      goodsInfoImg: goodsInfoImg,
      currentGoodsSpecDetails: currentGoodsSpecDetails || '-'
    };
    return dataResult;
  };

  /**
   * 列表排序
   * @param _pagination
   * @param _filters
   * @param sorter
   * @private
   */
  _handleOnChange = (pagination, _filters, sorter) => {
    let currentPage = pagination.current;
    const {
      init,
      onFormFieldChange,
      setSortedInfo,
      pageNum,
      checkSwapInputGroupCompact
    } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    // let currentPage = pagination.current;
    //如果是翻页触发table数据变化 不重新排序
    if (pageNum != currentPage - 1) {
      return;
    }
    if (
      sorter.columnKey != sortedInfo.columnKey ||
      sorter.order != sortedInfo.order
    ) {
      currentPage = 1;
    }
    onFormFieldChange({
      key: 'sortColumn',
      value: sorter.columnKey ? sorter.columnKey : 'createTime'
    });
    onFormFieldChange({
      key: 'sortRole',
      value: sorter.order === 'ascend' ? 'asc' : 'desc'
    });
    this.setState({ pageNum: currentPage - 1 });
    setSortedInfo(sorter.columnKey, sorter.order);
    checkSwapInputGroupCompact();
    init();
  };

  _menu = (rowInfo) => {
    const {
      skuOnSale,
      skuOffSale,
      onFieldChange,
      switchShowModal
    } = this.props.relaxProps;
    return (
      <div style={{ textAlign: 'center' }}>
        <AuthWrapper functionName="f_goods_sku_edit_3">
          <a
            href="javascript:void(0);"
            onClick={() => {
              const goodsInfoIdList = [];
              goodsInfoIdList.push(rowInfo.goodsInfoId);
              onFieldChange('goodsInfoIdList', goodsInfoIdList);
              // onFieldChange('marketPrice',rowInfo.marketPrice);
              switchShowModal(true);
            }}
          >
            设价&nbsp;
          </a>
        </AuthWrapper>
        {rowInfo.addedFlag == 0 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                skuOnSale([rowInfo.goodsInfoId]);
              }}
            >
              上架&nbsp;
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.addedFlag == 1 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                skuOffSale([rowInfo.goodsInfoId]);
              }}
            >
              下架&nbsp;
            </a>
          </AuthWrapper>
        ) : null}
        <AuthWrapper functionName="f_goods_6">
          <a
            href="javascript:;"
            onClick={() => {
              this._delete(rowInfo.goodsInfoId);
            }}
          >
            删除
          </a>
        </AuthWrapper>
      </div>
    );
  };
  /**
   * 删除
   */
  _delete = (goodsInfoId: string) => {
    const { spuDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除这个商品吗？',
      onOk() {
        spuDelete([goodsInfoId]);
      }
    });
  };
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 0',
    height: 124
  },
  content: {
    width: 200,
    marginLeft: 5,
    textAlign: 'left'
  },
  name: {
    color: '#333',
    fontSize: 14
  },
  spec: {
    color: '#999',
    fontSize: 12
  },
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
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
    WebkitBoxOrient: 'vertical'
  }
} as any;
