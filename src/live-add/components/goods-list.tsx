import React from 'react';
import { Modal, Table } from 'antd';
const defaultImg = require('../../images/none.png');

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgItem: {
    width: 40,
    height: 40,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  goodsInfoRight: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  }
} as any;

export default class GoodsList extends React.Component<any, any> {
  render() {
    const { goodsRows } = this.props;
    return <Table rowKey="id" dataSource={goodsRows} columns={this._columns} />;
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '商品',
      render: (name, rowInfo) => {
        const goodsInfo = this.props.goodsInfoList.find(
          (e) => e.goodsInfoId == rowInfo.goodsInfoId
        );
        return (
          <div style={styles.item}>
            <div>
              <img
                src={rowInfo.coverImgUrl ? rowInfo.coverImgUrl : defaultImg}
                style={styles.imgItem}
              />
            </div>
            <div style={styles.goodsInfoRight}>
              <div>{rowInfo.name ? rowInfo.name : '-'}</div>
              <div style={styles.specText}>
                {goodsInfo && goodsInfo.specText ? goodsInfo.specText : '-'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '价格',
      render: (row, rowInfo) => {
        let comps = [];
        // switch (rowInfo.priceType) {
        //   case 0:
            comps = [<div>￥{rowInfo.price}</div>];
            // break;
        //   case 1:
        //     comps = [
        //       <div>
        //         ￥{rowInfo.price}~{rowInfo.price2}
        //       </div>
        //     ];
        //     break;
        //   case 2:
        //     comps = [
        //       <div>
        //         ￥{rowInfo.price2}
        //         <del
        //           style={{
        //             color: 'rgba(153, 153, 153, 1)',
        //             fontSize: '12px'
        //           }}
        //         >
        //           {rowInfo.price}
        //         </del>
        //       </div>
        //     ];
        //     break;
        //   default:
        //     comps = [<div>--</div>];
        //     break;
        // }
        return comps;
      }
    },
    {
      key: 'stock',
      dataIndex: 'stock',
      title: '库存'
    },
    {
      key: 'url',
      dataIndex: 'url',
      title: '链接',
      render: (row, rowInfo) => {
        return (
          <div>
            /pages/package-B/goods/goods-details/index?skuId=
            {rowInfo.goodsInfoId}
          </div>
        );
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a onClick={() => this.props.deleteSelectedSku(rowInfo.goodsInfoId)}>
          删除
        </a>
        {/*</AuthWrapper>*/}
      </div>
    );
  };
}
