import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, util } from 'qmkit';
import { Checkbox, Input, message } from 'antd';

const { Column } = DataGrid;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

/**
 * 商品添加
 */
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      skuExists: props.skuExists,
      goodslists: [],
      selectedRows: props.selectedRows
    };
    console.log('这个组件的回复');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      skuExists: nextProps.skuExists,
      selectedRows: nextProps.selectedRows
    });
  }

  render() {
    const { skuExists, selectedRows } = this.state;
    const { deleteSelectedSku, cheBOx, itmelist } = this.props;
    const goodsId = [];
    const listdata = [];
    selectedRows.toJS().forEach((e) => {
      if (goodsId.indexOf(e.goodsInfoId) == -1) {
        goodsId.push(e.goodsInfoId);
        listdata.push(e);
      }
    });
    console.log(
      selectedRows.toJS(),
      'selectedRowsselectedRows2222',
      listdata,
      goodsId
    );
    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={listdata}
          pagination={false}
          rowClassName={(record) => {
            if (fromJS(skuExists).includes(record.goodsInfoId)) {
              return 'red';
            } else {
              return '';
            }
          }}
        >
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
          />

          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width="10%"
            render={(value, row: any) => {
              if (util.isThirdStore()) {
                const result = [];
                row.goodsAttributeKeys?.forEach((item) => {
                  result.push(item.goodsAttributeValue);
                });
                return result.join('-');
              } else if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />
          <Column
            title="适用区域"
            dataIndex="wareName"
            key="wareName"
            width="10%"
          />

          <Column
            title="分类"
            key="cateName"
            dataIndex="cateName"
            width="10%"
          />

          <Column
            title="品牌"
            key="brandName"
            dataIndex="brandName"
            width="10%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="单价"
            key="marketPrice"
            dataIndex="marketPrice"
            width="10%"
            render={(data) => {
              return `¥${data}`;
            }}
          />

          <Column
            title="操作"
            key="operate"
            width="10%"
            render={(row) => {
              return (
                <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>删除</a>
              );
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
  purchChange = (e, id) => {
    const value = e.target.value;
    const { purChange } = this.props;
    const numbezzs = /^[1-9]\d*$/;
    if (value != '') {
      if (!numbezzs.test(value)) {
        message.error('请输入整数，合法数字');
      } else {
        purChange(value, id);
      }
    }
  };
}
