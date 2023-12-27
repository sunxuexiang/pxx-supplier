import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Button, Tag } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class SelfLevelViewModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      selfVisible: boolean;
      onSelfViewHide: Function;
    };
  };

  static relaxProps = {
    selfVisible: 'selfVisible',
    onSelfViewHide: noop
  };

  render() {
    const WrapperForm = Form.create()(SelfLevelViewForm as any);
    const { selfVisible, onSelfViewHide } = this.props.relaxProps;
    if (!selfVisible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title="查看等级"
        visible={selfVisible}
        footer={<Button onClick={() => onSelfViewHide()}>关闭</Button>}
        onCancel={() => onSelfViewHide()}
      >
        <WrapperForm />
      </Modal>
    );
  }
}

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

const FormItem = Form.Item;

@Relax
class SelfLevelViewForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      selfCustomerLevel: any;
    };
  };

  static relaxProps = {
    selfCustomerLevel: 'selfCustomerLevel'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { selfCustomerLevel } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label="等级名称：">
          <label>{selfCustomerLevel.get('customerLevelName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="等级徽章：">
          <label><img src={selfCustomerLevel.get('rankBadgeImg')} alt="" height="50" width="50" /></label>
        </FormItem>
        <FormItem {...formItemLayout} label="所需成长值：">
          <label>{selfCustomerLevel.get('growthValue')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="折扣率：">
          <label>{selfCustomerLevel.get('customerLevelDiscount')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="会员权益：">
          {selfCustomerLevel.get("customerLevelRightsVOS").toJS().map((v,k) => {
            return (
              <Tag color="blue" key={k}>{v.rightsName}</Tag>
            );
          })}
        </FormItem>
      </Form>
    );
  }
}
