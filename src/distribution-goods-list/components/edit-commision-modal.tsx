import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst } from 'qmkit';

import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

@Relax
export default class EditCommissionModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ForbidModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      editGoodsInfoId: string;
      distributionCommission: number;
      editMarketPrice: number;
      onFieldChange: Function;
      onSaveCommission: Function;
      switchShowModal: Function;
      editCommissionFuc: Function;
      editDistributionCommission: number;
      editCommissionRate: number;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 编辑单个商品的id
    editGoodsInfoId: 'editGoodsInfoId',
    // 分销佣金
    distributionCommission: 'distributionCommission',
    // 该条编辑sku数据的门店价
    editMarketPrice: 'editMarketPrice',
    editDistributionCommission: 'editDistributionCommission',
    editCommissionRate: 'editCommissionRate',
    // 修改分销佣金
    onFieldChange: noop,
    // 保存分销佣金
    onSaveCommission: noop,
    // 显示/关闭弹窗
    switchShowModal: noop,
    editCommissionFuc: noop
  };

  render() {
    const { modalVisible, switchShowModal } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={'编辑分销商品'}
        visible={modalVisible}
        onCancel={() => switchShowModal(false)}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const {
          onSaveCommission,
          editGoodsInfoId,
          editCommissionRate,
          editDistributionCommission
        } = this.props.relaxProps;
        onSaveCommission(
          editGoodsInfoId,
          editDistributionCommission,
          editCommissionRate
        );
      }
    });
  };
}

class ForbidModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      editMarketPrice: number;
      editDistributionCommission: number;
      editCommissionRate: number;
      onFieldChange: Function;
      editCommissionFuc: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      editDistributionCommission,
      editCommissionRate,
      editCommissionFuc,
      editMarketPrice
    } = this.props.relaxProps;
    return (
      <Form className="login-form" style={{ position: 'relative' }}>
        <FormItem {...formItemLayout} label="佣金比例" required={true}>
          {getFieldDecorator('editCommissionRate', {
            initialValue: editCommissionRate,
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
                  callback();
                }
              }
            ]
          })(
            <Input
              style={{ width: '100px' }}
              maxLength={2}
              onChange={(e) => {
                editCommissionFuc(editMarketPrice, (e.target as any).value);
              }}
            />
          )}
          <div className="tips">
            %&nbsp;&nbsp;<span style={{ color: '#333' }}>仅限1-99间的整数</span>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="预估佣金">
          {!!!editCommissionRate ? '-' : editDistributionCommission}
        </FormItem>
      </Form>
    );
  }
}
