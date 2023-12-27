import * as React from 'react';
import { DataGrid } from 'qmkit';

const { Column } = DataGrid;

import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button } from 'antd';
const TableRow = styled.div`
  width: 100%;
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsRows: IList;
      deleteSelectedSku: Function;
      fieldsValue: Function;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    deleteSelectedSku: noop,
    fieldsValue: noop
  };

  render() {
    const { goodsRows, deleteSelectedSku } = this.props.relaxProps;

    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          添加商品
        </Button>
        &nbsp;&nbsp;
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.goodsInfoId}
            dataSource={goodsRows ? goodsRows.toJS() : []}
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
      </div>
    );
  }

  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }
}
