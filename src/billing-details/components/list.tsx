import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';

import styled from 'styled-components';

const DateTable = styled.div`
  .ant-table-thead > tr.ant-table-row-hover > td,
  .ant-table-tbody > tr.ant-table-row-hover > td,
  .ant-table-thead > tr:hover > td,
  .ant-table-tbody > tr:hover > td {
    background-color: #ffffff;
  }
  .tableRowCss {
    height: 80px !important;
    word-wrap: break-word;
    word-break: break-word;
  }
  .ant-table-thead {
    th {
      height: 38px;
      padding: 0;
    }
  }
`;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settleList: IList;
      exportSettlementDetailList: Function;
    };
    settleId: number;
  };

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop
  };

  componentWillMount() {
    this.setState({ expandedRows: [] });
  }

  render() {
    const settleList = this.props.relaxProps.settleList
      ? this.props.relaxProps.settleList.toJS()
      : [];
    const { exportSettlementDetailList } = this.props.relaxProps;
    return (
      <div>
        <AuthWrapper functionName="f_sett_det_exp">
          <Button
            style={{ marginBottom: 20 }}
            disabled={settleList.length == 0}
            onClick={() => exportSettlementDetailList(this.props.settleId)}
          >
            导出明细
          </Button>
        </AuthWrapper>
        <DateTable>
          <Table
            size="small"
            columns={this._renderColumns()}
            dataSource={settleList}
            pagination={false}
            onExpandedRowsChange={(expandedRows) => {
              this._onExpandedRowsChange(expandedRows);
            }}
            scroll={{ x: 2500, y: 600 }}
            rowClassName={() => {
              return 'tableRowCss';
            }}
          />
        </DateTable>
      </div>
    );
  }

  _onExpandedRowsChange = (expandedRows) => {
    this.setState({ expandedRows: expandedRows });
  };

  _renderColumns = (): any[] => {
    return [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
        width: 80
      },
      {
        title: '订单入账时间',
        dataIndex: 'finalTime',
        key: 'finalTime',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
        width: 120
      },
      {
        title: '订单编号',
        dataIndex: 'tradeCode',
        key: 'tradeCode',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
        width: 110
      },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        key: 'orderType',
        width: 110
      },
      {
        title: '商品编码/名称/规格',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 220,
        render: (value, row) => {
          return (
            <div style={{ maxWidth: 200 }}>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.skuNo}
              </span>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {value}
              </span>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.specDetails}
              </span>
            </div>
          );
        }
      },
      {
        title: '所属类目',
        dataIndex: 'cateName',
        key: 'cateName',
        width: 80
      },
      {
        title: '商品单价',
        dataIndex: 'goodsPrice',
        key: 'goodsPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value.toFixed(2));
        },
        width: 100
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        width: 50
      },
      {
        title: '满减优惠',
        dataIndex: 'reductionPrice',
        key: 'reductionPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 80
      },
      {
        title: '满折优惠',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 80
      },
      {
        title: '店铺券优惠',
        dataIndex: 'storeCouponPrice',
        key: 'storeCouponPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 95
      },
      {
        title: '通用券优惠',
        dataIndex: 'commonCouponPriceString',
        key: 'commonCouponPriceString',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 95
      },
      {
        title: '积分抵扣',
        dataIndex: 'pointPrice',
        key: 'pointPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 95
      },
      {
        title: '订单改价差额',
        key: 'specialPrice',
        dataIndex: 'specialPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value, false, true);
        },
        width: 150
      },
      {
        title: '商品实付金额',
        dataIndex: 'splitPayPrice',
        key: 'splitPayPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 100
      },
      {
        title: '供货总额',
        dataIndex: 'providerPrice',
        key: 'providerPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 100
      },
      {
        title: '类目扣率',
        dataIndex: 'cateRate',
        key: 'cateRate',
        width: 100
      },
      {
        title: '平台佣金',
        key: 'platformPriceString',
        dataIndex: 'platformPriceString',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 100
      },
      {
        title: '分销佣金',
        key: 'commission',
        dataIndex: 'commission',
        render: (value) => {
          return util.FORMAT_YUAN(value);
        },
        width: 100
      },
      {
        title: '运费',
        dataIndex: 'deliveryPrice',
        key: 'deliveryPrice',
        render: (value, row) => {
          return this._handleRowSpan(row, util.FORMAT_YUAN(value));
        },
        width: 100
      },
      {
        title: '退单改价差额',
        dataIndex: 'returnSpecialPrice',
        key: 'returnSpecialPrice',
        render: (value, row) => {
          return this._handleRowSpan(row, util.FORMAT_YUAN(value));
        },
        width: 100
      },
      {
        title: '店铺应收金额',
        key: 'storePrice',
        dataIndex: 'storePrice',
        fixed: 'right',
        render: (value, row) => {
          return this._handleRowSpan(row, util.FORMAT_YUAN(value));
        },
        width: 140
      }
    ];
  };

  _handleRowSpan = (row, value) => {
    const { expandedRows } = this.state;
    if (expandedRows.length != 0) {
      if (row.key.startsWith('p_') && expandedRows.indexOf(row.key) != -1) {
        return {
          children: value,
          props: { rowSpan: row.children ? row.children.length + 1 : 1 }
        };
      } else if (row.key.startsWith('c_')) {
        let isChild = false;
        expandedRows.forEach((rowKey) => {
          if (rowKey.split('_')[1] == rowKey.split('_')[1]) {
            isChild = true;
          }
        });
        if (isChild) {
          return {
            props: { rowSpan: 0 }
          };
        }
      }
    }
    return value;
  };
}
