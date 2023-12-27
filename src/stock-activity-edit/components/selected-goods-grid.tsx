import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid } from 'qmkit';
import { Checkbox, Input, message, Table, Form, InputNumber } from 'antd';
// import * as Enum from './marketing-enum';
const { Column } = Table;
const FormItem = Form.Item;
import styled from 'styled-components';
const TableRow = styled.div`
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
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const { selectedRows, deleteSelectedSku, cheBOx, wareId } = this.props;
    console.log(selectedRows.toJS(),'selectedRowsselectedRows')
    const row=selectedRows.toJS()
    const goods =selectedRows.get(`${wareId}`)?(row[wareId]||[]):[];
  
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={goods}
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
            width={140}
          />

          <Column
            title="ERP编码"
            dataIndex="erpGoodsInfoNo"
            key="erpGoodsInfoNo"
            width={140}
          />
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={140}
          />
          <Column
            title="适用区域"
            dataIndex="wareName"
            key="wareName"
            width={100}
          />

          <Column title="分类" key="cateName" dataIndex="cateName"  width={100} />

          <Column
            title="品牌"
            key="brandName"
            dataIndex="brandName"
            width={100}
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
            width={90}
            render={(data) => {
              let { specialPrice, marketPrice } = data;
              marketPrice = specialPrice ? specialPrice : marketPrice;
              return `¥${marketPrice}`;
            }}
          />

          <Column
            title="虚拟库存"
            key="virtualStock"
            width={120}
            render={(text,row:any,index) => {
              row.virtualStock=row.virtualStock||0
              return (
                <div>
                  <InputNumber min={0} max={999999} defaultValue={0} value={row.virtualStock} onChange={(e)=>{this.purchChange(e,row.goodsInfoId,'virtualStock')}} />
                </div>
              );
            }}
          />
          <Column
            title="操作"
            key="operate"
            width={100}
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
  purchChange = (value, id,index) => {
    const { purChange } = this.props;
    purChange(value, id,index);
  };
}
