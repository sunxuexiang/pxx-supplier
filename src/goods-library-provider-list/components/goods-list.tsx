import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const defaultImg = require('../img/none.png');

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsPageContent: IList;
      standardSkuList: IList;
      standardSkuSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
      onSearch: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
      onImport: Function;
      goodsCateList: IList;
    };
  };

  static relaxProps = {
    goodsPageContent: ['standardGoodsPage', 'content'],
    standardSkuList: 'standardSkuList',
    standardSkuSpecDetails: 'standardSkuSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['standardGoodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onSearch: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys',
    onImport: noop,
    //分类列表
    goodsCateList: 'goodsCateList'
  };

  render() {
    const {
      goodsBrandList,
      goodsPageContent,
      selectedSpuKeys,
      onSelectChange,
      total,
      pageNum,
      expandedRowKeys,
      onImport,
      goodsCateList
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
        rowSelection={{
          getCheckboxProps: (record) => ({
            disabled: record.addStatus
          }),
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
        }}
        pagination={{ total, current: pageNum, onChange: this._getData }}
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
        <Column
          title="供应商名称"
          dataIndex="providerName"
          key="providerName"
          className="nameBox"
          width={200}
        />
        <Column
          title="供货价"
          dataIndex="supplyPrice"
          key="supplyPrice"
          render={(rowInfo) => {
            return rowInfo == null ? 0.0 : rowInfo.toFixed(2);
          }}
        />
        <Column
          title="商品类目"
          dataIndex="cateId"
          key="cateId"
          render={(rowInfo) => {
            return (
              goodsCateList
                .filter((v) => {
                  return v.get('cateId') == rowInfo;
                })
                .getIn([0, 'cateName']) || '-'
            );
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
          title="状态"
          dataIndex="addStatus"
          key="addStatus"
          render={(addStatus) => {
            if (addStatus) {
              return '已导入';
            }
            return '未导入';
          }}
        />
        <Column
          title="操作"
          dataIndex="addStatus"
          key="addGoodsLibraryFlag"
          render={(addStatus, record) => {
            if (addStatus) {
              return '-';
            }

            return (
              <a
                href="javascript:;"
                style={{
                  marginTop: 5,
                  marginRight: 5,
                  display: 'inline-block'
                }}
                onClick={() => onImport([record['goodsId']])}
              >
                导入{' '}
              </a>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 根据分类id查询分类名称
   * @param cateId
   * @private
   */
  _showCateName = (cateId) => {
    const { goodsCateList } = this.props.relaxProps;
    return goodsCateList.forEach((value) => {
      if (value.get('cateId') == cateId) {
        return value.get('cateName');
      }
    });
  };

  _expandedRowRender = (record, index) => {
    const { standardSkuList, standardSkuSpecDetails } = this.props.relaxProps;

    const currentGoods = standardSkuList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });

    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = standardSkuSpecDetails
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
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span className="specification">
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>门店价：</label>
                {goods.get('marketPrice')
                  ? goods.get('marketPrice').toFixed(2)
                  : '-'}
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
    const { onPageSearch } = this.props.relaxProps;
    onPageSearch(pageNum, pageSize);
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
