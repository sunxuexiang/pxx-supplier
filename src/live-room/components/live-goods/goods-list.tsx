import React from 'react';
import { Relax } from 'plume2';
import { noop, DataGrid, history } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
const defaultImg = require('../../../images/none.png');

const confirm = Modal.confirm;

const Column = DataGrid;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      liveGoodLoading: boolean;
      liveGoodsTotal: number;
      liveGoodsPageSize: number;
      liveGoodsDataList: IList;
      liveGoodsCurrent: number;
      currentLiveGoodsTab: string;
      goodsInfoList: IList;
      onDelete: Function;
      queryLiveGoodsPage: Function;
    };
  };

  static relaxProps = {
    liveGoodLoading: 'liveGoodLoading',
    liveGoodsTotal: 'liveGoodsTotal',
    liveGoodsPageSize: 'liveGoodsPageSize',
    liveGoodsDataList: 'liveGoodsDataList',
    liveGoodsCurrent: 'liveGoodsCurrent',
    currentLiveGoodsTab: 'currentLiveGoodsTab',
    goodsInfoList: 'goodsInfoList',
    onDelete: noop,
    queryLiveGoodsPage: noop
  };

  render() {
    const {
      liveGoodLoading,
      liveGoodsTotal,
      liveGoodsPageSize,
      liveGoodsDataList,
      liveGoodsCurrent,
      queryLiveGoodsPage,
      currentLiveGoodsTab,
      goodsInfoList
    } = this.props.relaxProps;
    return (
      <TableBox>
        <DataGrid
          dataSource={liveGoodsDataList.toJS()}
          rowKey={'liveGoodsListData'}
          loading={liveGoodLoading}
          pagination={{
            total: liveGoodsTotal,
            pageSize: liveGoodsPageSize,
            current: liveGoodsCurrent,
            onChange: (pageNum, pageSize) => {
              queryLiveGoodsPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            key="goodsInfoName"
            dataIndex="goodsInfoName"
            title="商品"
            render={(name, rowInfo) => {
              const goodsInfo = goodsInfoList.find(
                (e) => e.goodsInfoId == rowInfo.goodsInfoId
              );
              return (
                <div style={styles.item}>
                  <div>
                    <img
                      src={
                        rowInfo.coverImgUrl ? rowInfo.coverImgUrl : defaultImg
                      }
                      style={styles.imgItem}
                    />
                  </div>
                  <div style={styles.goodsInfoRight}>
                    <div>{rowInfo.name}</div>
                    <div style={styles.specText}>
                      {goodsInfo && goodsInfo.specText
                        ? goodsInfo.specText
                        : '-'}
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            key="price"
            dataIndex="price"
            title="价格"
            render={(_row, rowInfo) => {
              let comps = [];
              switch (rowInfo.priceType) {
                case 1:
                  comps = [<div>￥{rowInfo.price}</div>];
                  break;
                case 2:
                  comps = [
                    <div>
                      ￥{rowInfo.price}~{rowInfo.price2}
                    </div>
                  ];
                  break;
                case 3:
                  comps = [
                    <div>
                      ￥{rowInfo.price2}
                      <del
                        style={{
                          color: 'rgba(153, 153, 153, 1)',
                          fontSize: '12px'
                        }}
                      >
                        {rowInfo.price}
                      </del>
                    </div>
                  ];
                  break;
                default:
                  comps = [<div>--</div>];
                  break;
              }
              return comps;
            }}
          />
          <Column key="stock" dataIndex="stock" title="库存" />
          <Column key="url" dataIndex="url" title="商品链接" />
          {currentLiveGoodsTab == '3' && (
            <Column
              title="审核未通过原因"
              key="auditReason"
              dataIndex="auditReason"
            />
          )}
          {
            <Column
              title="操作"
              dataIndex="option"
              key="option"
              render={(_row, rowInfo) => {
                return (
                  <div>
                    {currentLiveGoodsTab == '2' ||
                    currentLiveGoodsTab == '3' ? (
                      <a
                        onClick={() =>
                          this._onDelete(rowInfo.goodsId, rowInfo.id)
                        }
                      >
                        删除
                      </a>
                    ) : (
                      <div />
                    )}
                    <a
                      target="_blank"
                      onClick={() =>
                        history.push({
                          pathname: `/goods-detail/${rowInfo.goodsIdForDetails}`
                        })
                      }
                      style={{ marginLeft: 5 }}
                    >
                      查看
                    </a>
                  </div>
                );
              }}
            />
          }
        </DataGrid>
      </TableBox>
    );
  }

  /**
   * 单个删除信息
   */
  _onDelete = (goodsId, id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(goodsId, id);
      },
      onCancel() {}
    });
  };
}

const styles = {
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
