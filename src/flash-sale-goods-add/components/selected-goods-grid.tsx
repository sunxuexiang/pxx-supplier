import * as React from 'react';
import { DataGrid, ValidConst } from 'qmkit';
import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button, Form, Input, InputNumber } from 'antd';
import Table from 'antd/es/table/Table';
import Select from 'antd/lib/select';

const TableSet = styled.div`
  @media screen and (max-width: 1440px) {
    .ant-select {
      max-width: 220px;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1680px) {
    .ant-select {
      max-width: 320px;
    }
  }
  @media screen and (min-width: 1680px) {
    .ant-select {
      max-width: 400px;
    }
  }
`;
const { Column } = DataGrid;
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      goodsRows: IList;
      cateList: IMap;
      deleteSelectedSku: Function;
      fieldsValue: Function;
      onGoodsChange: Function;
      onCateInputChange: Function;
    };
  };
  static relaxProps = {
    goodsRows: 'goodsRows',
    cateList: 'cateList',
    deleteSelectedSku: noop,
    fieldsValue: noop,
    onGoodsChange: noop,
    onCateInputChange: noop
  };
  render() {
    const {
      goodsRows,
      deleteSelectedSku,
      onGoodsChange,
      onCateInputChange
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <TableSet className="resetTable">
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          添加商品
        </Button>
        &nbsp;&nbsp;
        <Table
          rowKey={(record: any) => record.goodsInfoId}
          dataSource={goodsRows ? goodsRows.toJS() : []}
          pagination={false}
          style={{ width: '100%' }}
        >
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={100}
          />
          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width={100}
          />
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width={100}
          />
          <Column title="现有库存" dataIndex="stock" key="stock" width={80} />
          <Column
            title="门店价"
            key="marketPrice"
            dataIndex="marketPrice"
            width={100}
            render={(data) => {
              return data != null ? `${data}` : '0';
            }}
          />
          <Column
            title="抢购库存"
            width={80}
            dataIndex="flashsaleStock"
            key="flashsaleStock"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_flashsaleStock', {
                      initialValue: null,
                      validateFirst: true,
                      rules: [
                        { required: true, message: '请填写抢购库存数量' },
                        {
                          validator: (_rule, value, callback) => {
                            const stock = record.stock;
                            const convertStock = record.convertStock;
                            const minNum = record.minNum ? record.minNum : 1;
                            // const convertStockKey = {[record.goodsInfoId+'_convertStock']: convertStock};
                            // const minNumKey = {[record.goodsInfoId+'_minNum']: minNum};

                            if (stock < value) {
                              callback('抢购库存数量不可大于现有库存');
                              return;
                            } else if (convertStock && convertStock > value) {
                              callback('抢购库存不可小于限购数量');
                              return;
                            } else if (minNum > value) {
                              callback('抢购库存不可小于起售数量');
                              return;
                            }
                            // this.props.form.setFieldsValue(convertStockKey);
                            // this.props.form.setFieldsValue(minNumKey);
                            callback();
                          }
                        }
                      ]
                    })(
                      <InputNumber
                        min={1}
                        precision={0}
                        onChange={(value) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'flashsaleStock',
                            value: value
                          })
                        }
                        style={{ width: '80px' }}
                      />
                    )}
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="抢购价"
            width={80}
            dataIndex="settlementPrice"
            key="settlementPrice"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(
                      record.goodsInfoId + '_settlementPrice',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请填写抢购价'
                          },
                          {
                            pattern: ValidConst.price,
                            message: '请填写大于0的两位小数的合法金额'
                          },
                          {
                            type: 'number',
                            max: 9999999.99,
                            message: '最大值为9999999.99',
                            transform: function(value) {
                              return isNaN(parseFloat(value))
                                ? 0
                                : parseFloat(value);
                            }
                          }
                        ],
                        initialValue: null,
                        validateFirst: true
                      }
                    )(
                      <Input
                        onChange={(e) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'settlementPrice',
                            value: e.target.value
                          })
                        }
                        style={{ width: '80px' }}
                      />
                    )}
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="分类"
            width={120}
            key="cateName"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_cateName', {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择分类' }]
                    })(
                      <Select
                        showSearch
                        style={{ width: 120 }}
                        placeholder="选择分类名称"
                        optionFilterProp="children"
                        onChange={(value) =>
                          onCateInputChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'cateId',
                            value: value
                          })
                        }
                      >
                        {this._renderOption()}
                      </Select>
                    )}
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="限购数量"
            width={80}
            dataIndex="convertStock"
            key="convertStock"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_convertStock', {
                      initialValue: null,
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          message: '请填写限购数量'
                        },
                        {
                          validator: (_rule, value, callback) => {
                            const stock = record.flashsaleStock;
                            const minNum = record.minNum ? record.minNum : 1;
                            // const stockKey = {[record.goodsInfoId+'_flashsaleStock']: stock};
                            // const minNumKey = {[record.goodsInfoId+'_minNum']: minNum};

                            if (value && stock && stock < value) {
                              callback('限购数量不可大于抢购库存');
                              return;
                            } else if (value && value < minNum) {
                              callback('限购数量不可小于起售数量');
                              return;
                            }
                            // this.props.form.setFieldsValue(stockKey);
                            // this.props.form.setFieldsValue(minNumKey);

                            callback();
                          }
                        }
                      ]
                    })(
                      <InputNumber
                        max={100}
                        min={1}
                        precision={0}
                        onChange={(value) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'convertStock',
                            value: value
                          })
                        }
                        style={{ width: '80px' }}
                      />
                    )}
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="起售数量"
            width={80}
            dataIndex="minNum"
            key="minNum"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_minNum', {
                      initialValue: 1,
                      validateFirst: true,
                      rules: [
                        { required: true, message: '请填写起售数量' },
                        {
                          validator: (_rule, value, callback) => {
                            const stock = record.flashsaleStock;
                            const convertStock = record.convertStock;
                            // const stockKey = {[record.goodsInfoId+'_flashsaleStock']: stock};
                            // const convertStockKey = {[record.goodsInfoId+'_convertStock']: convertStock};

                            if (stock && stock < value) {
                              callback('起售数量不可大于抢购库存');
                              return;
                            } else if (convertStock && value > convertStock) {
                              callback('起售数量不可大于限购数量');
                              return;
                            }
                            // this.props.form.setFieldsValue(stockKey);
                            // this.props.form.setFieldsValue(convertStockKey);
                            callback();
                          }
                        }
                      ]
                    })(
                      <InputNumber
                        max={100}
                        min={1}
                        precision={0}
                        onChange={(value) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'minNum',
                            value: value
                          })
                        }
                        style={{ width: '80px' }}
                      />
                    )}
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="是否包邮"
            key="isRecommend"
            width={80}
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('page-content')
                      }
                      defaultValue="否"
                      onChange={(value) => {
                        onGoodsChange({
                          goodsInfoId: record.goodsInfoId,
                          field: 'recommendFlag',
                          value: value
                        });
                      }}
                    >
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  </FormItem>
                </div>
              );
            }}
          />
          <Column
            title="操作"
            key="operate"
            width={60}
            render={(row) => {
              return (
                <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>删除</a>
              );
            }}
          />
        </Table>
      </TableSet>
    );
  }
  /**
   *下拉栏里内容填充
   * @private
   */
  _renderOption = () => {
    const { cateList } = this.props.relaxProps;
    return cateList.map((v) => {
      return (
        <Option value={v.get('cateName')} key={v.get('cateId')}>
          {v.get('cateName')}
        </Option>
      );
    });
  };
  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }
}
