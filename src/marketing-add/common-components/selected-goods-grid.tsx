import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, util } from 'qmkit';
import { Checkbox, Input, message, Table, Form, InputNumber } from 'antd';
import * as Enum from './marketing-enum';
const { Column } = Table;
const FormItem = Form.Item;
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
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const {
      selectedRows,
      deleteSelectedSku,
      cheBOx,
      marketingType
    } = this.props;
    const goods = selectedRows.toJS();
    // const { goodslists } = this.state;
    // console.log(goods, '111111111');

    // goods.forEach(element => {
    //   element.checked = true;
    // });
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={selectedRows ? goods : []}
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
              width="10%"
            />
          )}

          {!util.isThirdStore() && (
            <Column
              title="ERP编码"
              dataIndex="erpGoodsInfoNo"
              key="erpGoodsInfoNo"
              width="10%"
            />
          )}

          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="18%"
          />

          {util.isThirdStore() && (
            <Column
              title="规格"
              dataIndex="specText"
              key="specText"
              width="10%"
              render={(text, row: any) => {
                const result = [];
                row.goodsAttributeKeys?.forEach((item) => {
                  result.push(item.goodsAttributeValue);
                });
                return result.join('-');
              }}
            />
          )}

          {/* <Column
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
          /> */}
          {!util.isThirdStore() && (
            <Column
              title="适用区域"
              dataIndex="wareName"
              key="wareName"
              width="8%"
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
            width="8%"
            render={(data) => {
              let { specialPrice, marketPrice } = data;
              marketPrice = specialPrice ? specialPrice : marketPrice;
              return `¥${marketPrice}`;
            }}
          />

          <Column
            title="总限购量"
            key="purchaseNum"
            width="12%"
            render={(row) => {
              return (
                <div>
                  {row.isDisable == 0 ? (
                    <Input
                      defaultValue={
                        row.purchaseNum && row.purchaseNum > -1
                          ? row.purchaseNum
                          : ''
                      }
                      onChange={(e) => {
                        this.purchChange(e, row.goodsInfoId, 'purchaseNum');
                      }}
                      placeholder="限购数量"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    '已限购'
                  )}
                </div>
              );
            }}
          />

          <Column
            title="单用户限购量"
            key="perUserPurchaseNum"
            width="12%"
            render={(row) => {
              return (
                <div>
                  {/* <FormItem>
                      
                    </FormItem> */}
                  {row.isDisable == 0 ? (
                    // <InputNumber min={1} max={10} value={value} onChange={setValue} />
                    <Input
                      defaultValue={
                        row.perUserPurchaseNum && row.perUserPurchaseNum > -1
                          ? row.perUserPurchaseNum
                          : ''
                      }
                      onChange={(e) => {
                        this.purchChange(
                          e,
                          row.goodsInfoId,
                          'perUserPurchaseNum'
                        );
                      }}
                      placeholder="单用户限购数量"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    '已限购'
                  )}
                </div>
              );
            }}
          />
          {/* <Column
            title="必选商品"
            key="checked"
            width="7%"
            render={(row) => {
              return (
                <div>
                  <Checkbox
                    checked={row.checked}
                    onChange={(e) => {
                      cheBOx(row.goodsInfoId);
                    }}
                  />
                </div>
              );
            }}
          /> */}

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
  purchChange = (e, id, key) => {
    const value = e.target.value;
    const { purChange } = this.props;
    const numbezzs = /^[1-9]\d*$/;
    purChange(value, id, key);
    // if (value != '') {
    //   if (!numbezzs.test(value)) {
    //     message.error('请输入整数，合法数字');
    //   } else {
    //     purChange(value, id);
    //   }
    // }
  };
}
