import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, DataGrid, ValidConst } from 'qmkit';
import { Form, Radio, Input } from 'antd';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
const defaultImg = require('../../images/none.png');

const Column = DataGrid;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

export default class GoodsList extends React.Component<any, any> {
  render() {
    const { goodsRows, goodsRowsPrice } = this.props;
    const {
      getFieldDecorator,
      setFieldsValue,
      resetFields,
      validateFields
    } = this.props.form;
    return (
      <TableBox>
        <DataGrid
          dataSource={goodsRows}
          rowKey={'goodsList'}
          pagination={false}
        >
          <Column
            key="goodsInfoName"
            dataIndex="goodsInfoName"
            title="商品"
            render={(name, rowInfo) => {
              return (
                <div style={styles.item}>
                  <div>
                    <img
                      src={
                        rowInfo.goodsInfoImg ? rowInfo.goodsInfoImg : defaultImg
                      }
                      style={styles.imgItem}
                    />
                  </div>
                  <div style={styles.goodsInfoRight}>
                    <div style={styles.name}>{name}</div>
                    <div style={styles.specText}>
                      {rowInfo.specText ? rowInfo.specText : '-'}
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            key="price"
            dataIndex="price"
            title="价格"
            render={(row, rowInfo, key) => {
              return (
                <RadioGroup
                  onChange={(e) => {
                    const params = {
                      priceType: e.target.value,
                      price: goodsRowsPrice[key].price,
                      price2: goodsRowsPrice[key].price2
                    };
                    this.props.changePrice(params, key);
                    setFieldsValue({ priceType: e.target.value });
                  }}
                  defaultValue={1}
                >
                  <Radio value={1} style={styles.radioStyle}>
                    一口价：
                    <FormItem>
                      {getFieldDecorator('marketPrice' + rowInfo.goodsInfoId, {
                        rules: [
                          {
                            pattern: ValidConst.price,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (
                                !value &&
                                goodsRowsPrice[key].priceType == 1
                              ) {
                                callback('请填写一口价');
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: rowInfo.marketPrice,
                        onChange: (e) => {
                          const params = {
                            priceType: goodsRowsPrice[key].priceType,
                            price: e.target.value,
                            price2: goodsRowsPrice[key].price2
                          };
                          this.props.changePrice(params, key);
                          resetFields([
                            'rangePrice' + rowInfo.goodsInfoId,
                            'rangePrice2' + rowInfo.goodsInfoId,
                            'salePrice' + rowInfo.goodsInfoId,
                            'salePrice2' + rowInfo.goodsInfoId
                          ]);
                        }
                      })(
                        <Input
                          disabled={goodsRowsPrice[key].priceType != 1}
                          style={{ maxWidth: 60 }}
                        />
                      )}
                    </FormItem>
                  </Radio>
                  <br />
                  <Radio value={2} style={styles.radioStyle}>
                    区间价：
                    <FormItem>
                      {getFieldDecorator('rangePrice' + rowInfo.goodsInfoId, {
                        rules: [
                          {
                            pattern: ValidConst.price,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (goodsRowsPrice[key].priceType == 2) {
                                if (!value) {
                                  callback('请填写区间价');
                                }

                                if (
                                  parseInt(goodsRowsPrice[key].price2) <
                                  parseInt(value)
                                ) {
                                  callback('请输入正确的区间价');
                                } else {
                                  validateFields([
                                    'rangePrice2' + rowInfo.goodsInfoId
                                  ]);
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: '',
                        onChange: (e) => {
                          const params = {
                            priceType: goodsRowsPrice[key].priceType,
                            price: e.target.value,
                            price2: goodsRowsPrice[key].price2
                          };
                          this.props.changePrice(params, key);
                          resetFields([
                            'marketPrice' + rowInfo.goodsInfoId,
                            'salePrice' + rowInfo.goodsInfoId,
                            'salePrice2' + rowInfo.goodsInfoId
                          ]);
                        }
                      })(
                        <Input
                          disabled={goodsRowsPrice[key].priceType != 2}
                          style={{ maxWidth: 60 }}
                        />
                      )}
                    </FormItem>
                    &nbsp;-&nbsp;
                    <FormItem>
                      {getFieldDecorator('rangePrice2' + rowInfo.goodsInfoId, {
                        rules: [
                          {
                            pattern: ValidConst.price,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (goodsRowsPrice[key].priceType == 2) {
                                if (!value) {
                                  callback('请填写区间价');
                                }

                                if (
                                  parseInt(goodsRowsPrice[key].price) >
                                  parseInt(value)
                                ) {
                                  callback('请输入正确的区间价');
                                } else {
                                  validateFields([
                                    'rangePrice' + rowInfo.goodsInfoId
                                  ]);
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: '',
                        onChange: (e) => {
                          const params = {
                            priceType: goodsRowsPrice[key].priceType,
                            price: goodsRowsPrice[key].price,
                            price2: e.target.value
                          };
                          this.props.changePrice(params, key);
                          resetFields([
                            'marketPrice' + rowInfo.goodsInfoId,
                            'salePrice' + rowInfo.goodsInfoId,
                            'salePrice2' + rowInfo.goodsInfoId
                          ]);
                        }
                      })(
                        <Input
                          disabled={goodsRowsPrice[key].priceType != 2}
                          style={{ maxWidth: 60 }}
                        />
                      )}
                    </FormItem>
                  </Radio>
                  <br />
                  {/**price 原价 price2 现价 */}
                  <Radio value={3} style={styles.radioStyle}>
                    折扣价：现价&nbsp;
                    <FormItem>
                      {getFieldDecorator('salePrice2' + rowInfo.goodsInfoId, {
                        rules: [
                          {
                            pattern: ValidConst.price,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (goodsRowsPrice[key].priceType == 3) {
                                if (!value) {
                                  callback('请填写折扣价');
                                }

                                if (
                                  parseInt(goodsRowsPrice[key].price) <
                                  parseInt(value)
                                ) {
                                  callback('请输入正确的折扣价');
                                } else {
                                  validateFields([
                                    'salePrice' + rowInfo.goodsInfoId
                                  ]);
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: '',
                        onChange: (e) => {
                          const params = {
                            priceType: goodsRowsPrice[key].priceType,
                            price2: e.target.value,
                            price: goodsRowsPrice[key].price
                          };
                          this.props.changePrice(params, key);
                          resetFields([
                            'rangePrice' + rowInfo.goodsInfoId,
                            'rangePrice2' + rowInfo.goodsInfoId,
                            'marketPrice' + rowInfo.goodsInfoId
                          ]);
                        }
                      })(
                        <Input
                          disabled={goodsRowsPrice[key].priceType != 3}
                          style={{ maxWidth: 60 }}
                        />
                      )}
                    </FormItem>
                    &nbsp;原价&nbsp;
                    <FormItem>
                      {getFieldDecorator('salePrice' + rowInfo.goodsInfoId, {
                        rules: [
                          {
                            pattern: ValidConst.price,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (goodsRowsPrice[key].priceType == 3) {
                                if (!value) {
                                  callback('请填写折扣价');
                                }

                                if (
                                  parseInt(goodsRowsPrice[key].price2) >
                                  parseInt(value)
                                ) {
                                  callback('请输入正确的折扣价');
                                } else {
                                  validateFields([
                                    'salePrice2' + rowInfo.goodsInfoId
                                  ]);
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: '',
                        onChange: (e) => {
                          const params = {
                            priceType: goodsRowsPrice[key].priceType,
                            price2: goodsRowsPrice[key].price2,
                            price: e.target.value
                          };
                          this.props.changePrice(params, key);
                          resetFields([
                            'rangePrice' + rowInfo.goodsInfoId,
                            'rangePrice2' + rowInfo.goodsInfoId,
                            'marketPrice' + rowInfo.goodsInfoId
                          ]);
                        }
                      })(
                        <Input
                          disabled={goodsRowsPrice[key].priceType != 3}
                          style={{ maxWidth: 60 }}
                        />
                      )}
                    </FormItem>
                  </Radio>
                </RadioGroup>
              );
            }}
          />
          <Column key="stock" dataIndex="stock" title="库存" />
          <Column
            key="url"
            dataIndex="url"
            title="链接"
            render={(row, rowInfo) => {
              return (
                <div>
                  pages/package-B/goods/goods-details/index?skuId=
                  {rowInfo.goodsInfoId}
                </div>
              );
            }}
          />
          <Column
            title="操作"
            dataIndex="option"
            key="option"
            render={(row, rowInfo) => {
              return (
                <div>
                  <a
                    onClick={() =>
                      this.props.deleteSelectedSku(rowInfo.goodsInfoId)
                    }
                  >
                    删除
                  </a>
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgItem: {
    width: 40,
    height: 40,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  radioStyle: {
    display: 'block',
    height: 40,
    lineHeight: '40px'
  },
  goodsInfoRight: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  }
} as any;
