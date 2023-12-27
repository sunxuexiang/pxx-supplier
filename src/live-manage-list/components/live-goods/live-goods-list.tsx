import React from 'react';
import { Relax } from 'plume2';
import { noop, DataGrid, history, AuthWrapper } from 'qmkit';
import { Modal, Form, Input, Table, Popconfirm } from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import FormItem from 'antd/lib/form/FormItem';
import { fromJS } from 'immutable';
const defaultImg = require('../../../images/none.png');
const downloadImg = require('../../../images/download.png');
import './live-goods-list.less';
import { IMap } from 'plume2/es5/typings';

const confirm = Modal.confirm;
const { Column } = Table;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

@Relax
export default class InfoList extends React.Component<any, any> {
  _rejectForm;
  props: {
    relaxProps?: {
      LiveGoodsTotal: number;
      LiveGoodsPageSize: number;
      LiveGoodsDataList: IList;
      LiveGoodsCurrent: number;
      goodsId: string;
      queryLiveGoodsPage: Function;
      onLiveStreamSendMessage: Function;
      onDelGoods: Function;
      onGoodsSelect: Function;
      onCancelLiveStreamSendMessage: Function;
      onCancelLiveStreamSendStatus: Function;
      onAddGoodsChange: Function;
      LiveGoodsSearchData: IMap;
    };
  };

  static relaxProps = {
    LiveGoodsTotal: 'LiveGoodsTotal',
    LiveGoodsPageSize: 'LiveGoodsPageSize',
    LiveGoodsDataList: 'LiveGoodsDataList',
    LiveGoodsCurrent: 'LiveGoodsCurrent',
    orderRejectModalVisible: 'orderRejectModalVisible',
    goodsId: 'goodsId',
    LiveGoodsSearchData: 'LiveGoodsSearchData',
    queryLiveGoodsPage: noop,
    onLiveStreamSendMessage: noop,
    onDelGoods: noop,
    onCancelLiveStreamSendMessage: noop,
    onGoodsSelect: noop,
    onCancelLiveStreamSendStatus: noop,
    onAddGoodsChange: noop
  };

  render() {
    const {
      LiveGoodsTotal,
      LiveGoodsPageSize,
      LiveGoodsDataList,
      LiveGoodsCurrent,
      queryLiveGoodsPage,
      onGoodsSelect,
      onLiveStreamSendMessage,
      onDelGoods,
      onCancelLiveStreamSendMessage,
      onCancelLiveStreamSendStatus,
      onAddGoodsChange,
      LiveGoodsSearchData
    } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          rowKey={(e) => e.goodsInfoId}
          dataSource={LiveGoodsDataList.toJS()}
          // expandedRowRender={this._expandedRowRender}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              onGoodsSelect(selectedRowKeys);
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows
              );
            }
          }}
          pagination={{
            total: LiveGoodsTotal,
            pageSize: LiveGoodsPageSize,
            current: LiveGoodsCurrent,
            onChange: (pageNum, pageSize) => {
              queryLiveGoodsPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            key="goodsImg"
            dataIndex="goods.goodsImg"
            title="商品图片"
            render={(_row) => {
              return _row ? <img src={_row} style={styles.imgItem} /> : null;
            }}
          />
          <Column
            key="goodsName"
            dataIndex="goods.goodsName"
            title="商品名称"
          />
          <Column
            key="goodsType1"
            dataIndex="pileFlag"
            title="囤货状态"
            render={(_row) => {
              return _row ? '囤货商品' : '非囤货商品';
            }}
          />
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
            dataIndex="wareId"
            title="所属仓库"
            render={(text) => {
              let t = {
                1: '长沙仓',
                46: '南昌仓',
                47: '武汉仓'
              };
              return t[text];
            }}
          />
          <Column
            key="addedFlag"
            dataIndex="addedFlag"
            title="商品状态"
            render={(_row) => {
              return _row == 1 ? '上架' : '下架';
            }}
          />
          <Column
            key="liveGoodsStatus"
            dataIndex="liveGoodsStatus"
            title="直播商品状态"
            render={(_row) => {
              return _row == 1 ? '上架' : '下架';
            }}
          />
          <Column
            title="操作"
            dataIndex="option"
            key="option"
            render={(_row, rowInfo: any) => {
              return (
                <div>
                  {rowInfo.addedFlag ? (
                    <a
                      href="javascript:void(0);"
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        if (rowInfo.liveGoodsStatus == 2) {
                          onAddGoodsChange(fromJS([rowInfo.goodsInfoId]));
                        } else {
                          onCancelLiveStreamSendStatus(
                            [rowInfo.goodsInfoId],
                            rowInfo.liveGoodsStatus ? 0 : 1
                          );
                        }
                      }}
                    >
                      {rowInfo.liveGoodsStatus == 1 ? '下架' : '上架'}
                    </a>
                  ) : null}
                  <AuthWrapper functionName="f_app_live_goods_push1">
                    {rowInfo?.explainFlag ? (
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          onCancelLiveStreamSendMessage(rowInfo.goodsInfoId);
                        }}
                      >
                        取消推送
                      </a>
                    ) : (
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          onLiveStreamSendMessage(1, rowInfo.goodsInfoId);
                        }}
                      >
                        推送
                      </a>
                    )}
                  </AuthWrapper>
                  {!rowInfo?.explainFlag ? (
                    <AuthWrapper functionName="f_app_live_goods_del1">
                      <Popconfirm
                        title="移除后该商品不参与直播，是否确认该操作"
                        onConfirm={() => {
                          onDelGoods([rowInfo.goodsInfoId]);
                        }}
                        onCancel={() => {}}
                        okText="确定"
                        cancelText="取消"
                      >
                        <a href="javascript:void(0);">移除</a>
                      </Popconfirm>
                    </AuthWrapper>
                  ) : null}
                </div>
              );
            }}
          />
        </DataGrid>
      </TableBox>
    );
  }
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row'
    // alignItems: 'center'
  },
  goodsInfo: {
    flexDirection: 'row',
    marginLeft: 5
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  },

  vipwidth: {
    background: '#ffebc4',
    padding: '0 3px 0 0',
    fontWeight: 500,
    borderRadius: '2px'
  },
  vipprices: {
    width: '40px',
    height: '20px'
  },
  // item: {
  //   float: 'left',
  //   width: '50%',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   margin: '10px 0',
  //   height: 124
  // },
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
