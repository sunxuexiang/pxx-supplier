import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, util } from 'qmkit';
import { Table, Switch } from 'antd';
import * as _ from 'lodash';

const { Column } = Table;

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
    const { deleteSelectedSku, changeDisplay } = this.props;
    let listdata = [];
    selectedRows.toJS().forEach((e) => {
      listdata.push(e);
    });
    listdata = _.uniqBy(listdata, 'goodsInfoId');
    console.log(listdata, 'listdata');
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
          {!util.isThirdStore() && (
            <Column
              title="SKU编码"
              dataIndex="goodsInfoNo"
              key="goodsInfoNo"
              width="15%"
            />
          )}
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={!util.isThirdStore() ? '20%' : '45%'}
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
          {!util.isThirdStore() && (
            <Column
              title="适用区域"
              dataIndex="wareName"
              key="wareName"
              width="10%"
            />
          )}

          <Column title="分类" key="cateName" dataIndex="cateName" width="8%" />

          <Column
            title="品牌"
            key="brandName"
            dataIndex="brandName"
            width="8%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="销售价"
            key="marketPrice"
            dataIndex="marketPrice"
            width="8%"
            render={(data) => {
              return `¥${data}`;
            }}
          />

          <Column
            title="是否显示"
            key="displayType"
            dataIndex="displayType"
            width="8%"
            render={(text, row: any) => {
              return (
                <Switch
                  checked={text === 0}
                  onChange={(checked) =>
                    changeDisplay(row.goodsInfoId, checked)
                  }
                />
              );
            }}
          />

          <Column
            title="操作"
            key="operate"
            width="8%"
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
}
