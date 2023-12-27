import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
import Store from '../store';
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
    sm: { span: 14 }
  }
};

@Relax
export default class BrandModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(BrandModalForm);
  }

  props: {
    relaxProps?: {
      modalBrandVisible: boolean;
      closeBrandModal: Function;
      brandData: IMap;
      editBrandInfo: Function;
      doBrandAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalBrandVisible: 'modalBrandVisible',
    // 添加品牌
    doBrandAdd: noop,
    // 修改form数据
    editBrandInfo: noop,
    // form数据
    brandData: 'brandData',
    // 关闭弹框
    closeBrandModal: noop
  };

  render() {
    const { modalBrandVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalBrandVisible) {
      return null;
    }
    return (
      <Modal  maskClosable={false}
        title="增加品牌"
         
        visible={modalBrandVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={form => (this._form = form)}
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

    form.validateFields(null, errs => {
      if (!errs) {
        //提交
        const { doBrandAdd, brandData } = this.props.relaxProps;
        if (brandData.get('brandName')) {
          doBrandAdd();
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeBrandModal } = this.props.relaxProps;
    closeBrandModal();
  };
}

class BrandModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      modalBrandVisible: boolean;
      closeBrandModal: Function;
      brandData: IMap;
      editBrandInfo: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const brandData = this._store.state().get('brandData');
    const brandName = brandData.get('brandName');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="品牌名称" hasFeedback>
          {getFieldDecorator('brandName', {
            rules: [
              { required: true, whitespace: true, message: '请输入品牌名称' },
              { max: 10, message: '最多10字符' },
              {
                pattern: ValidConst.noChar,
                message: '不允许特殊字符'
              }
            ]
          })(
            <div>
              <Input onChange={this._changeBrandName} value={brandName} />
            </div>
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改品牌名称
   */
  _changeBrandName = e => {
    const { editBrandInfo } = this.props.relaxProps;
    editBrandInfo(Map({ brandName: e.target.value }));
  };
}
