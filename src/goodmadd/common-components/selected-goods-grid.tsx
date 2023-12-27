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
    const goods = selectedRows.toJS();
    console.log(itmelist,'看看这个玩意',goods,' selectedRows.toJS()', selectedRows.toJS())
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={selectedRows.toJS()}
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
            title="活动名称"
            render={(value) => {
              if(value.marketingVO) {
                return value.marketingVO.marketingName
              }else {
                return value.marketingName
              }
            }}
            // dataIndex="marketingName"
            // key="marketingName"
            // width="15%"
          />

          <Column
            title="起止时间"
            // dataIndex="goodsInfoName"
            // key="goodsInfoName"
            render={(value) => {
              if (value.marketingVO) {
                return (
                  value.marketingVO.beginTime.substring(0, value.marketingVO.beginTime.length - 7) +
                  ' - ' +
                  value.marketingVO.beginTime.substring(0, value.marketingVO.beginTime.length - 7)
                );
              } else {
                return (
                  value.beginTime.substring(0, value.beginTime.length - 7) +
                  ' - ' +
                  value.beginTime.substring(0, value.beginTime.length - 7)
                );
              }
            }}
            // width="20%"
          />

          <Column
            title="商品名称"
            // dataIndex="goodsInfoName"
            // key="goodsInfoName"
            // width="20%"
            render={(value) => {
              if (value.goodsInfoVO) {
                return value.goodsInfoVO.goodsInfoName;
              } else {
                return value.goodsInfoName;
              }
            }}
          />

          <Column
            title="操作"
            key="operate"
            width="13%"
            render={(row) => {
              return (
                // <a onClick={() => deleteSelectedSku(row)}>删除</a>
                <a onClick={() => deleteSelectedSku(row.marketingId)}>删除</a>

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
