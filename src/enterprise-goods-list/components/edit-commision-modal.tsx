import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst } from 'qmkit';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IMap } from '../../../typings/globalType';

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
      editMarketPrice: number;
      onFieldChange: Function;
      onSaveEnterprisePrice: Function;
      switchShowModal: Function;
      editDistributionCommission: number;
      enterPrisePrice: number;
      iepInfo: IMap;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 编辑单个商品的id
    editGoodsInfoId: 'editGoodsInfoId',
    // 企业购佣金
    // 该条编辑sku数据的门店价
    editMarketPrice: 'editMarketPrice',
    editDistributionCommission: 'editDistributionCommission',
    enterPrisePrice: 'enterPrisePrice',
    // 修改企业专享价
    onFieldChange: noop,
    // 保存企业购佣金
    onSaveEnterprisePrice: noop,
    // 显示/关闭弹窗
    switchShowModal: noop,
    iepInfo: 'iepInfo'
  };

  render() {
    const { modalVisible, switchShowModal, iepInfo } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    const { iepInfo: info = {} } = iepInfo.toJS();
    const { enterprisePriceName } = info;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={`编辑${enterprisePriceName}`}
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
          onSaveEnterprisePrice,
          editGoodsInfoId,
          enterPrisePrice
        } = this.props.relaxProps;
        onSaveEnterprisePrice(editGoodsInfoId, enterPrisePrice);
      }
    });
  };
}

class ForbidModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      enterPrisePrice: number;
      onFieldChange: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { enterPrisePrice, onFieldChange, iepInfo } = this.props.relaxProps;
    const { iepInfo: info = {} } = iepInfo.toJS();
    const { enterprisePriceName } = info;
    return (
      <Form className="login-form" style={{ position: 'relative' }}>
        <FormItem
          {...formItemLayout}
          label={enterprisePriceName}
          style={{ width: 650 }}
          required={true}
        >
          {getFieldDecorator('enterPrisePrice', {
            initialValue: enterPrisePrice,
            rules: [
              {
                validator: (_rule, value, callback) => {
                  if (!value) {
                    callback(new Error(`请填写${enterprisePriceName}`));
                    return;
                  }
                  if (!ValidConst.enterpriseRange.test(value)) {
                    callback(new Error('请填写0-9999999.99间的数值'));
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              style={{ width: '100px' }}
              maxLength={10}
              onChange={(e) =>
                onFieldChange('enterPrisePrice', (e.target as any).value)
              }
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
