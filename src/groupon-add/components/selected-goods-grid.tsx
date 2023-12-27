import * as React from 'react';
import { InputNumber, Input, Form } from 'antd';

import { DataGrid, ValidConst } from 'qmkit';

const { Column } = DataGrid;
const FormItem = Form.Item;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

/**
 * 商品添加
 */
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedRows, deleteSelectedSku } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={selectedRows ? selectedRows.toJS() : []}
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
            width="15%"
          />

          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width="15%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
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
            title="拼团价格"
            key="grouponPrice"
            width="10%"
            render={(row) => {
              return (
                <FormItem>
                  {getFieldDecorator('grouponPrice_' + row.goodsInfoId, {
                    rules: [
                      {
                        required: true,
                        message: '请填写拼团价格'
                      },
                      {
                        pattern: ValidConst.price,
                        message: '请填写两位小数的合法金额'
                      }
                    ],
                    initialValue: row.grouponPrice,
                    onChange: (e) => {
                      this.props.changeSelectSkuInfo({
                        skuId: row.goodsInfoId,
                        key: 'grouponPrice',
                        value: e.target.value
                      });
                    }
                  })(<Input style={{ maxWidth: 120, marginRight: 5 }} />)}
                </FormItem>
              );
            }}
          />

          <Column
            title="起售数量"
            key="startSellingNum"
            width="10%"
            render={(row) => {
              return (
                <FormItem>
                  {getFieldDecorator('grouponNum_' + row.goodsInfoId, {
                    initialValue: row.startSellingNum,
                    rules: [
                      {
                        required: true,
                        message: '请填写起售数量'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (!row.limitSellingNum) {
                            callback();
                            return;
                          }
                          if (value > row.limitSellingNum) {
                            callback('起售数量不能大于限购数量');
                            return;
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <InputNumber
                      precision={0}
                      min={1}
                      onChange={(value) => {
                        this.props.changeSelectSkuInfo({
                          skuId: row.goodsInfoId,
                          key: 'startSellingNum',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              );
            }}
          />

          <Column
            title="限购数量"
            key="limitSellingNum"
            width="10%"
            render={(row) => {
              return (
                <FormItem>
                  {getFieldDecorator('sellingNum' + row.goodsInfoId, {
                    initialValue: row.startSellingNum,
                    rules: [
                      {
                        required: true,
                        message: '请填写限购数量'
                      }
                    ]
                  })(
                    <InputNumber
                      precision={0}
                      min={1}
                      defaultValue={row.limitSellingNum}
                      onChange={async (value) => {
                        await this.props.changeSelectSkuInfo({
                          skuId: row.goodsInfoId,
                          key: 'limitSellingNum',
                          value
                        });
                        this.props.form.validateFields(
                          ['grouponNum_' + row.goodsInfoId],
                          { force: true }
                        );
                      }}
                    />
                  )}
                </FormItem>
              );
            }}
          />

          {!this.props.isEdit && (
            <Column
              title="操作"
              key="operate"
              width="10%"
              render={(row) => {
                return (
                  <a
                    onClick={async () => {
                      await deleteSelectedSku(row.goodsInfoId);
                      this.props.form.setFieldsValue({
                        selectedSkus: this.props.selectedRows.toJS()
                      });
                    }}
                  >
                    删除
                  </a>
                );
              }}
            />
          )}
        </DataGrid>
      </TableRow>
    );
  }
}
