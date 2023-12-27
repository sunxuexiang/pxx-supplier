import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid } from 'qmkit';
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
      goodslists: []
    };
    console.log('这个组件的回复')
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const { selectedRows, deleteSelectedSku, cheBOx,itmelist } = this.props;
    console.log(selectedRows.toJS(),'selectedRowsselectedRows2222')
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.goodsInfoId}
            dataSource={selectedRows.toJS()}
            pagination={false}
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
              width="20%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
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
