import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Tooltip, Popconfirm } from 'antd';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const defaultImg = require('../img/none.png');

/**
 * 企业购商品审核状态 0:普通商品 1:待审核 2:已审核通过 3:审核不通过 4:禁止企业购
 * @type {{"0": string; "1": string; "2": string; "3": string; "4": string}}
 */
const GOODS_AUDIT_TYPE = {
  1: '待审核',
  2: '已审核',
  3: '审核未通过'
};

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      allCateList: IList;
      brandList: IList;
      total: number;
      pageNum: number;
      form: any;
      sortedInfo: IMap;
      onFormFieldChange: Function;
      init: Function;
      setSortedInfo: Function;
      checkSwapInputGroupCompact: Function;
      onFieldChange: Function;
      onShowEditEnterprisePriceModal: Function;
      onDelete: Function;

      goodsModalVisible: boolean;
      selectedSkuKeys: IList;
      selectedSkuRows: IList;
      onNextBackFun: Function;
      onCancelBackFun: Function;
      iepInfo: IMap;
    };
  };

  static relaxProps = {
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    allCateList: 'allCateList',
    brandList: 'brandList',
    total: 'totalCount',
    pageNum: 'pageNum',
    form: 'form',
    sortedInfo: 'sortedInfo',
    onFormFieldChange: noop,
    init: noop,
    setSortedInfo: noop,
    checkSwapInputGroupCompact: noop,
    onFieldChange: noop,
    // 显示/关闭列表编辑弹窗
    onShowEditEnterprisePriceModal: noop,
    // 删除企业购商品
    onDelete: noop,

    goodsModalVisible: 'goodsModalVisible',
    selectedSkuKeys: 'selectedSkuKeys',
    selectedSkuRows: 'selectedSkuRows',
    onNextBackFun: noop,
    onCancelBackFun: noop,
    iepInfo: 'iepInfo'
  };

  render() {
    const {
      brandList,
      goodsInfoList,
      total,
      pageNum,
      init,
      sortedInfo,
      onShowEditEnterprisePriceModal,
      onDelete,
      iepInfo
    } = this.props.relaxProps;
    // 表格排序
    const sortInfo = sortedInfo.toJS();
    const { isIepAuth: iepSwitch, iepInfo: info = {} } = iepInfo.toJS();
    const { enterprisePriceName } = info;
    return (
      <div>
        <DataGrid
          className="resetTable"
          rowKey={(record) => record.goodsInfoId}
          onChange={(pagination, filters, sorter) =>
            this._handleOnChange(pagination, filters, sorter)
          }
          dataSource={goodsInfoList.toJS()}
          pagination={{
            total,
            current: pageNum + 1
            // onChange: (pageNum, pageSize) => {
            //   init({ pageNum: pageNum - 1, pageSize });
            // }
          }}
        >
          <Column
            title="商品"
            key="goodsInfoId"
            render={(rowInfo) => {
              const dataResult = this._dealData(rowInfo);
              return (
                <div key={dataResult.goodsInfoId} style={styles.item}>
                  <div>
                    <img
                      src={
                        dataResult.goodsInfoImg
                          ? dataResult.goodsInfoImg
                          : defaultImg
                      }
                      style={styles.imgItem}
                    />
                  </div>
                  <div style={styles.content}>
                    <div className="line-two" style={styles.name}>
                      {dataResult.goodsInfoName}
                    </div>
                    <div className="line-two" style={styles.spec}>
                      {dataResult.currentGoodsSpecDetails}
                    </div>
                    <div style={styles.spec}>{dataResult.goodsInfoNo}</div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            title="店铺分类"
            dataIndex="storeCateIds"
            key="storeCateIds"
            render={this._renderStoreCateList}
          />
          <Column
            title="品牌"
            dataIndex="brandId"
            key="brandId"
            render={(rowInfo) => {
              return (
                brandList
                  .filter((v) => {
                    return v.get('brandId') == rowInfo;
                  })
                  .getIn([0, 'brandName']) || '-'
              );
            }}
          />
          <Column
            title="门店价"
            dataIndex="marketPrice"
            key="marketPrice"
            sorter={true}
            sortOrder={sortInfo.columnKey === 'marketPrice' && sortInfo.order}
            render={(marketPrice) =>
              marketPrice == null ? 0.0 : marketPrice.toFixed(2)
            }
          />
          {iepSwitch && (
            <Column
              title={enterprisePriceName}
              dataIndex="enterPrisePrice"
              key="enterPrisePrice"
              sorter={true}
              sortOrder={
                sortInfo.columnKey === 'enterPrisePrice' && sortInfo.order
              }
              render={(enterPrisePrice) =>
                enterPrisePrice == null ? 0.0 : enterPrisePrice.toFixed(2)
              }
            />
          )}
          <Column
            title="库存"
            dataIndex="stock"
            key="stock"
            sorter={true}
            sortOrder={sortInfo.columnKey === 'stock' && sortInfo.order}
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
          <Column
            title="审核状态"
            key="enterPriseAuditState"
            render={(rowInfo) => {
              const {
                enterPriseAuditState,
                enterPriseGoodsAuditReason
              } = rowInfo;
              return (
                <div>
                  <p>{GOODS_AUDIT_TYPE[enterPriseAuditState]}</p>
                  {enterPriseAuditState == 3 && (
                    <Tooltip
                      placement="topLeft"
                      title={enterPriseGoodsAuditReason}
                    >
                      <a href="javascript:;">原因</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title="操作"
            className="operation-th"
            key="goodsId"
            render={(rowInfo) => {
              return (
                <div className="operation-box">
                  {rowInfo.enterPriseAuditState == 1 && '-'}
                  {(rowInfo.enterPriseAuditState == 2 ||
                    rowInfo.enterPriseAuditState == 3) && (
                    <div>
                      <AuthWrapper functionName={'f_enterprise_goods_edit'}>
                        <a
                          style={{ marginRight: 10 }}
                          href="javascript:void(0);"
                          onClick={() =>
                            onShowEditEnterprisePriceModal(rowInfo)
                          }
                        >
                          编辑
                        </a>
                      </AuthWrapper>
                      <AuthWrapper functionName={'f_enterprise_goods_del'}>
                        <Popconfirm
                          title="确定删除该商品？"
                          onConfirm={() =>
                            onDelete(rowInfo.goodsInfoId, rowInfo.goodsInfoNo)
                          }
                          okText="确定"
                          cancelText="取消"
                        >
                          <a href="javascript:void(0);">删除</a>
                        </Popconfirm>
                      </AuthWrapper>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </DataGrid>
      </div>
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

  /**
   * 列表排序
   * @param _pagination
   * @param _filters
   * @param sorter
   * @private
   */
  _handleOnChange = async (pagination, _filters, sorter) => {
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
    // if (pageNum != currentPage - 1) {
    //   return;
    // }
    //切换排序
    onFormFieldChange({
      key: 'sortColumn',
      value: sorter.columnKey ? sorter.columnKey : 'createTime'
    });
    onFormFieldChange({
      key: 'sortRole',
      value: sorter.order === 'ascend' ? 'asc' : 'desc'
    });
    setSortedInfo(sorter.columnKey, sorter.order);
    if (
      sorter.columnKey &&
      sorter.order &&
      (sorter.columnKey != sortedInfo.columnKey ||
        sorter.order != sortedInfo.order)
    ) {
      currentPage = 1;
      this.setState({ pageNum: currentPage - 1 });
      checkSwapInputGroupCompact();
      await init();
    } else {
      //普通分页
      await init({ pageNum: currentPage - 1, pageSize: 10 });
    }
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
