import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Tooltip, Popconfirm, Pagination } from 'antd';
import { AuthWrapper, DataGrid, history, noop, QMFloat } from 'qmkit';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const defaultImg = require('../img/none.png');

/**
 * 分销商品审核状态 0:普通商品 1:待审核 2:已审核通过 3:审核不通过 4:禁止分销
 * @type {{"0": string; "1": string; "2": string; "3": string; "4": string}}
 */
const GOODS_AUDIT_TYPE = {
  0: '普通商品',
  1: '待审核',
  2: '已审核',
  3: '审核未通过',
  4: '禁止分销'
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
      onShowEditCommissionModal: Function;
      onDelete: Function;

      goodsModalVisible: boolean;
      selectedSkuKeys: IList;
      selectedSkuRows: IList;
      onNextBackFun: Function;
      onCancelBackFun: Function;
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
    onShowEditCommissionModal: noop,
    // 删除分销商品
    onDelete: noop,

    goodsModalVisible: 'goodsModalVisible',
    selectedSkuKeys: 'selectedSkuKeys',
    selectedSkuRows: 'selectedSkuRows',
    onNextBackFun: noop,
    onCancelBackFun: noop
  };

  render() {
    const {
      brandList,
      goodsInfoList,
      total,
      pageNum,
      init,
      sortedInfo,
      onShowEditCommissionModal,
      onDelete
    } = this.props.relaxProps;
    // 表格排序
    const sortInfo = sortedInfo.toJS();

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
          <Column
            title="佣金比例"
            dataIndex="commissionRate"
            key="commissionRate"
            sorter={true}
            sortOrder={
              sortInfo.columnKey === 'commissionRate' && sortInfo.order
            }
            render={(commissionRate) =>
              commissionRate == null
                ? '0%'
                : QMFloat.accMul(commissionRate, 100) + '%'
            }
          />
          <Column
            title="预估佣金"
            dataIndex="distributionCommission"
            key="distributionCommission"
            sorter={true}
            sortOrder={
              sortInfo.columnKey === 'distributionCommission' && sortInfo.order
            }
            render={(distributionCommission) =>
              distributionCommission == null
                ? 0.0
                : distributionCommission.toFixed(2)
            }
          />
          <Column
            title="库存"
            dataIndex="stock"
            key="stock"
            sorter={true}
            sortOrder={sortInfo.columnKey === 'stock' && sortInfo.order}
          />
          {/*<Column
            title="分销销量"
            dataIndex="distributionSalesCount"
            key="distributionSalesCount"
            sorter={true}
            sortOrder={
              sortInfo.columnKey === 'distributionSalesCount' && sortInfo.order
            }
          />*/}
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
            key="distributionGoodsAudit"
            render={(rowInfo) => {
              const {
                distributionGoodsAudit,
                distributionGoodsAuditReason
              } = rowInfo;
              return (
                <div>
                  <p>{GOODS_AUDIT_TYPE[distributionGoodsAudit]}</p>
                  {(distributionGoodsAudit == 3 ||
                    distributionGoodsAudit == 4) && (
                    <Tooltip
                      placement="topLeft"
                      title={distributionGoodsAuditReason}
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
                  {rowInfo.distributionGoodsAudit == 1 && '-'}
                  {(rowInfo.distributionGoodsAudit == 2 ||
                    rowInfo.distributionGoodsAudit == 3) && (
                    <div>
                      <AuthWrapper functionName={'f_distribution_goods_edit'}>
                        <a
                          style={{ marginRight: 10 }}
                          href="javascript:void(0);"
                          onClick={() => onShowEditCommissionModal(rowInfo)}
                        >
                          编辑
                        </a>
                      </AuthWrapper>
                      <AuthWrapper functionName={'f_distribution_goods_matter'}>
                        <a
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            history.push({
                              pathname: '/distribution-goods-matter-list',
                              state: {
                                goodsInfo: this._dealData(rowInfo)
                              }
                            });
                          }}
                        >
                          素材
                        </a>
                      </AuthWrapper>
                      <AuthWrapper functionName={'f_distribution_goods_del'}>
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
                  {rowInfo.distributionGoodsAudit == 4 && (
                    <div>
                      <AuthWrapper functionName={'f_distribution_goods_edit'}>
                        <a
                          style={{ marginRight: 10 }}
                          href="javascript:void(0);"
                          onClick={() => onShowEditCommissionModal(rowInfo)}
                        >
                          编辑
                        </a>
                      </AuthWrapper>
                      <AuthWrapper functionName={'f_distribution_goods_del'}>
                        <Popconfirm
                          title="确定删除该商品？"
                          onConfirm={() => onDelete(rowInfo.goodsInfoId)}
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
