import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

@Relax
export default class SetGoodPrice extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(SetGoodPriceModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      goodsInfoIdList: IList;
      goodDiscount: string;
      modalText: string;
      // marketPrice: number;
      // forbidReason: string;
      onFieldChange: Function;
      SetGoodPrice: Function;
      switchShowModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    //商品的id list
    goodsInfoIdList: 'goodsInfoIdList',
    //商品折扣
    goodDiscount: 'goodDiscount',
    modalText: 'modalText',
    //市场价
    // marketPrice: 'marketPrice',
    //设价
    onFieldChange: noop,
    // 添加类目
    SetGoodPrice: noop,
    // 显示/关闭弹窗
    switchShowModal: noop
  };

  render() {
    const { modalVisible, modalText } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={modalText}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
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
        const { SetGoodPrice, goodsInfoIdList } = this.props.relaxProps;
        SetGoodPrice(goodsInfoIdList);
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { switchShowModal, onFieldChange } = this.props.relaxProps;
    onFieldChange('goodDiscount', null);
    switchShowModal(false);
  };
}

class SetGoodPriceModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      modalVisible: boolean;
      goodsInfoId: string;
      goodDiscount: string;
      // marketPrice: number;
      onFieldChange: Function;
      SetGoodPrice: Function;
      switchShowModal: Function;
      checkSpecialPrice: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onFieldChange, goodDiscount } = this.props.relaxProps;
    const tipTxt = '批量设价';
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} hasFeedback>
          {/*{getFieldDecorator('goodDiscount', {*/}
          {/*  initialValue: goodDiscount,*/}
          {/*  rules: [*/}
          {/*    {*/}
          {/*      validator: (rule, value, callback) => {*/}
          {/*        checkSpecialPrice(*/}
          {/*          rule,*/}
          {/*          value,*/}
          {/*          callback,*/}
          {/*          tipTxt,*/}
          {/*          1,*/}
          {/*          100*/}
          {/*        );*/}
          {/*      }*/}
          {/*    }*/}
          {/*  ]*/}
          {/*})(*/}
          {/*  <Input*/}
          {/*      addonBefore="请输入折扣"*/}
          {/*      // value={goodDiscount}*/}
          {/*    onChange={(e) => {*/}
          {/*      onFieldChange('goodDiscount', (e.target as any).value);*/}
          {/*    }}*/}
          {/*  />*/}
          {/*)}*/}

          {getFieldDecorator('goodDiscount', {
            initialValue: goodDiscount,
            rules: [
              { required: true, message: '请填写特价折扣' },
              // {max: 25, message: '站点分享推荐语仅限1-25位字符'},
              { validator: this.checkSpecial },
              {
                pattern: ValidConst.singleDecimal,
                message: '请输入有效的折扣'
              }
            ]
          })(
            <Input
              addonBefore="请输入折扣"
              // value={goodDiscount}
              onChange={(e) => {
                onFieldChange('goodDiscount', (e.target as any).value);
              }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   *  判断特价折扣
   */
  checkSpecial = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (value.trim() == '') {
      callback(new Error('特价折扣不能为空'));
      return;
    }
    if (value > 1 || value <= 0) {
      callback(new Error('设价折扣有误，仅限于0-1之间！'));
      return;
    }
    callback();
  };
}
