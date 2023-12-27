import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import { IList } from 'typings/globalType';
const { Column } = Table;
const styles = {
  edit: {
    paddingRight: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  goodsInfoRight: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
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
    display: '-webkit-box'
    // webkitBoxOrient: 'vertical'
  } as any
} as any;

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      liveGoodsList: IList;
      goodsInfoList: IList;
    };
  };

  static relaxProps = {
    liveGoodsList: 'liveGoodsList',
    goodsInfoList: 'goodsInfoList'
  };
  render() {
    const { liveGoodsList } = this.props.relaxProps;
    return (
      <Table
        rowKey="liveDetailGoodsList"
        // expandedRowRender={this._expandedRowRender}
        dataSource={liveGoodsList.toJS()}
        // columns={this._columns}
      >
        <Column
          key="goodsImg"
          dataIndex="goods.goodsImg"
          title="商品图片"
          render={(_row) => {
            return _row ? <img src={_row} style={styles.imgItem} /> : null;
          }}
        />
        <Column key="goodsName" dataIndex="goods.goodsName" title="商品名称" />
        {/* <Column key="cateName" dataIndex="goods.cateName" title="商品分类" /> */}
        <Column
          key="goodsType"
          dataIndex="goods.goodsType"
          title="商品类型"
          render={(_row) => {
            if (_row == 2) {
              return '特价商品';
            } else {
              return '普通商品';
            }
          }}
        />
        {/* <Column key="brandId" dataIndex="goods.brandId" title="品牌" /> */}
        <Column
          title="ERP编码"
          dataIndex="erpGoodsInfoNo"
          key="erpGoodsInfoNo"
          width="15%"
        />
        <Column key="goodsInfoNo" dataIndex="goodsInfoNo" title="SKU编码" />
        <Column key="marketPrice" dataIndex="marketPrice" title="门店价" />
        <Column key="vipPrice" dataIndex="vipPrice" title="大客户价" />
        <Column key="stock" dataIndex="stock" title="库存" />
        <Column
          key="wareName"
          dataIndex="wareName"
          title="所属仓库"
          render={(_row) => {
            return _row;
            // if (_row.length) {
            //   return _row[0].wareName;
            // }
          }}
        />
        <Column
          key="addedFlag"
          dataIndex="addedFlag"
          title="上/下架状态"
          render={(_row) => {
            return _row == 1 ? '上架' : '下架';
          }}
        />
      </Table>
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'goodsInfoName',
      dataIndex: 'goodsInfoName',
      title: '商品名称'
    },
    {
      key: 'goodsType',
      dataIndex: 'goodsType',
      title: '商品类型',
      render: (text) => {
        if (text == 2) {
          return '特价商品';
        } else {
          return '普通商品';
        }
      }
    },
    {
      key: 'cateName',
      dataIndex: 'cateName',
      title: '商品分类',
      render: (stock) => {
        return <div>{stock}</div>;
      }
    },
    {
      key: 'brandId',
      dataIndex: 'brandId',
      title: '品牌'
    }
    // {
    //   key: 'option',
    //   title: '操作',
    //   render: (rowInfo) => this._getOption(rowInfo)
    // }
  ];
}
