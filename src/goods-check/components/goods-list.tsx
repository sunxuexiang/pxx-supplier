import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { List } from 'immutable';
import { Menu, Modal, Dropdown, Icon, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';
const { Column } = DataGrid;
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
      onSpuDelete: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    onSpuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys'
  };

  render() {
    const {
      goodsBrandList,
      goodsPageContent,
      selectedSpuKeys,
      onSelectChange,
      total,
      pageNum,
      expandedRowKeys
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
        rowSelection={{
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.auditStatus == 0 //待审核的不能删除
          })
        }}
        pagination={{ total, current: pageNum + 1, onChange: this._getData }}
      >
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
          title="销售类型"
          key="saleType"
          render={(rowInfo) => {
            const { saleType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {saleType == 0 ? '批发' : '零售'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title={
            <span>
              门店价
              <br />
              设价方式
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
                <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
              </div>
            );
          }}
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
          title="审核状态"
          dataIndex="auditStatus"
          key="auditStatus"
          render={this._getAuditInfo}
        />
        <Column
          align="center"
          title="操作"
          key="goodsId"
          className="operation-th"
          render={(rowInfo) => {
            if (rowInfo.auditStatus == 2 || rowInfo.auditStatus == 3) {
              return this._menu(rowInfo);
            } else {
              return (
                <div className="operation-th">
                  <AuthWrapper functionName="f_goods_detail_1">
                    <Link to={`/goods-detail/${rowInfo.goodsId}`}>查看</Link>
                  </AuthWrapper>
                </div>
              );
            }
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

  /**
   * 获取操作的菜单
   */
  _menu = (rowInfo) => {
    return (
      <div className="operation-box">
        <AuthWrapper functionName="f_goods_sku_edit">
          <a
            href="javascript:;"
            onClick={() =>
              history.push({
                pathname: `/goods-check-edit/${rowInfo.goodsId}`,
                state: { tab: 'main' }
              })
            }
          >
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_goods_sku_price">
          <a
            href="javascript:;"
            onClick={() =>
              history.push({
                pathname: `/goods-check-edit/${rowInfo.goodsId}`,
                state: { tab: 'price' }
              })
            }
          >
            设价
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_goods_del">
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

  /**
   * 删除
   */
  _delete = (goodsId: string) => {
    const { onSpuDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除这个商品吗？',
      onOk() {
        onSpuDelete([goodsId]);
      }
    });
  };

  /**
   * 获取审核区域展示信息
   */
  _getAuditInfo = (auditStatus, record) => {
    let auditStatusStr = '';
    if (auditStatus == 0) {
      auditStatusStr = '待审核';
    } else if (auditStatus == 1) {
      auditStatusStr = '审核通过';
    } else if (auditStatus == 2) {
      auditStatusStr = '审核未通过';
    } else if (auditStatus == 3) {
      auditStatusStr = '禁售中';
    }
    return (
      <div>
        <p>{auditStatusStr}</p>
        {(auditStatus == 2 || auditStatus == 3) && (
          <Tooltip placement="top" title={record.auditReason}>
            <a href="javascript:;">原因</a>
          </Tooltip>
        )}
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
              {record.auditStatus == 2 || record.auditStatus == 3 ? (
                <div>
                  <AuthWrapper functionName="f_goods_sku_edit">
                    <a
                      href="javascript:;"
                      style={{
                        marginTop: 5,
                        marginRight: 5,
                        display: 'inline-block'
                      }}
                      onClick={() =>
                        history.push({
                          pathname: `/goods-sku-check-edit/${goods.get(
                            'goodsInfoId'
                          )}`,
                          state: { tab: 'main' }
                        })
                      }
                    >
                      编辑
                    </a>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_goods_sku_price">
                    {record.saleType == 0 &&
                    record.priceType == 1 &&
                    record.allowPriceSet == 0 ? null : (
                      <a
                        href="javascript:;"
                        style={{ marginTop: 5, display: 'inline-block' }}
                        onClick={() =>
                          history.push({
                            pathname: `/goods-sku-check-edit/${goods.get(
                              'goodsInfoId'
                            )}`,
                            state: { tab: 'price' }
                          })
                        }
                      >
                        设价
                      </a>
                    )}
                  </AuthWrapper>
                </div>
              ) : (
                <div>
                  <AuthWrapper functionName="f_goods_detail_1">
                    <Link
                      style={{ marginTop: 5, display: 'inline-block' }}
                      to={`/goods-sku-detail/${goods.get('goodsInfoId')}`}
                    >
                      查看
                    </Link>
                  </AuthWrapper>
                </div>
              )}
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU编码：</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>门店价：</label>
                {goods.get('marketPrice')
                  ? goods.get('marketPrice').toFixed(2)
                  : '0.0'}
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
                <label style={styles.label}>库存：</label>
                {goods.get('stock')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>大客户价：</label>
                {goods.get('vipPrice') || goods.get('vipPrice') === 0
                  ? goods.get('vipPrice').toFixed(2)
                  : 0}
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
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
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
    width: 120
  }
} as any;
