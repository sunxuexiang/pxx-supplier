import * as React from 'react';
import { Relax } from 'plume2';
import { Form, Modal, Input, Button, message } from 'antd';
import { noop, DataGrid, ValidConst } from 'qmkit';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const FormItem = Form.Item;

@Relax
export default class ChooseSkuModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(EditChoseSkuModalForm as any);
  }

  props: {
    relaxProps?: {
      choseGoodsModalVisible: boolean;
      selectedSkuKeys: IList;
      selectedSkuRows: IList;
      onSaveDistributionGoods: Function;
      onCancelChoseSkuFun: Function;
      onEditChoseSkuCommission: Function;
      onDelChoseSku: Function;
      invalidGoodsInfoIds: IList;
    };
  };

  static relaxProps = {
    choseGoodsModalVisible: 'choseGoodsModalVisible',
    selectedSkuKeys: 'selectedSkuKeys',
    selectedSkuRows: 'selectedSkuRows',
    onSaveDistributionGoods: noop,
    onCancelChoseSkuFun: noop,
    onEditChoseSkuCommission: noop,
    onDelChoseSku: noop,
    invalidGoodsInfoIds: 'invalidGoodsInfoIds'
  };

  render() {
    const {
      selectedSkuRows,
      choseGoodsModalVisible,
      onCancelChoseSkuFun
    } = this.props.relaxProps;

    const WrapperForm = this.WrapperForm;
    if (!choseGoodsModalVisible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            添加分销商品&nbsp;
            <small>
              已选
              <span style={{ color: '#F56C1D' }}>{selectedSkuRows.size}</span>
              款商品，每次最多可选50款111
            </small>
          </div>
        }
        width={1100}
        visible={choseGoodsModalVisible}
        footer={[
          <Button
            key="submit"
            type="primary"
            size="large"
            onClick={this._handleSubmit}
          >
            确定
          </Button>
        ]}
        onCancel={() => onCancelChoseSkuFun()}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 选择商品 点击确定之后的回调
   */
  _handleSubmit = () => {
    const { onSaveDistributionGoods, selectedSkuRows } = this.props.relaxProps;
    if (selectedSkuRows.size <= 0) {
      message.error('请至少选择一条');
      return;
    }
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        onSaveDistributionGoods(selectedSkuRows);
      }
    });
  };
}

class EditChoseSkuModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      selectedSkuRows: IList;
      onFieldChange: Function;
      onEditChoseSkuCommission: Function;
      onDelChoseSku: Function;
      invalidGoodsInfoIds: IList;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      selectedSkuRows,
      onDelChoseSku,
      invalidGoodsInfoIds
    } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          rowKey={(record) => record.goodsInfoId}
          pagination={false}
          dataSource={selectedSkuRows.toJS()}
          rowClassName={(record) => {
            if (invalidGoodsInfoIds.includes(record.goodsInfoId)) {
              return 'antErrorTr';
            }
            return '';
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
            key="specText"
            dataIndex="specText"
            width="20%"
          />
          <Column
            title="门店价"
            dataIndex="marketPrice"
            key="marketPrice"
            render={(marketPrice) =>
              marketPrice == null ? 0.0 : marketPrice.toFixed(2)
            }
          />
          <Column
            title={
              <div>
                <span
                  style={{
                    color: '#F56C1D',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                佣金比例
              </div>
            }
            key="commissionRate"
            render={(rowInfo) => {
              return (
                <FormItem hasFeedback>
                  {getFieldDecorator('commissionRate_' + rowInfo.goodsInfoId, {
                    initialValue:
                      rowInfo.commissionRate == 0 ? '' : rowInfo.commissionRate,
                    rules: [
                      {
                        validator: (_rule, value, callback) => {
                          if (!value) {
                            callback(new Error('请填写佣金比例'));
                            return;
                          }

                          if (
                            !ValidConst.noZeroNumber.test(value) ||
                            value < 1 ||
                            value > 99
                          ) {
                            callback(new Error('请填写1-99间的整数'));
                            return;
                          }

                          // if (value >= rowInfo.marketPrice) {
                          //   callback(
                          //     new Error('仅限大于0小于门店价间的数值')
                          //   );
                          //   return;
                          // }
                          callback();
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(
                      this,
                      rowInfo.goodsInfoId
                    )
                  })(
                    <Input
                      maxLength={2}
                      style={{ marginTop: 25, width: '80%' }}
                    />
                  )}
                  <span className="fx-num">%</span>
                </FormItem>
              );
            }}
          />
          <Column
            title="预估佣金"
            key="distributionCommission"
            render={(rowInfo) => {
              return rowInfo.distributionCommission == null ||
                rowInfo.commissionRate == 0
                ? '-'
                : rowInfo.distributionCommission;
            }}
          />
          <Column title="库存" dataIndex="stock" key="stock" />
          <Column
            title="操作"
            key="option"
            render={(rowInfo) => {
              return (
                <a
                  href="javascript:void(0);"
                  onClick={() => onDelChoseSku(rowInfo.goodsInfoId)}
                >
                  删除
                </a>
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  /**
   * 修改佣金
   */
  _editPriceItem = (id: string, e) => {
    const { onEditChoseSkuCommission } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    onEditChoseSkuCommission(id, e);
  };
}
