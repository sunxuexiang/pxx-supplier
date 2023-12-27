import React from 'react';
import { IMap, Relax } from 'plume2';
import { Modal,Alert,Form,Input,InputNumber  } from 'antd';
import { noop } from 'qmkit';

const FormItem=Form.Item;
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
export default class refundFormItem extends React.Component<any, any> {
    props: {
        form?:any;
        relaxProps?: {
            refundAuditForm:IMap;
            onRefundActorChange:Function;
            onRefundActorAuditChange:Function;
        };  
    };

  static relaxProps = {
    refundAuditForm:'refundAuditForm',
    onRefundActorAuditChange:noop,
    onRefundActorChange:noop,
  };

  render() {
    const {refundAuditForm,onRefundActorAuditChange}=this.props.relaxProps;
    const {getFieldDecorator}=this.props.form;
    return (
        <Form>
            <FormItem  {...formItemLayout} label="退款金额：">
                {getFieldDecorator('actualReturnPrice', {
                    initialValue: refundAuditForm.get('actualReturnPrice'),
                    onChange:(e)=>{onRefundActorAuditChange('actualReturnPrice',e)},
                    rules: [{required: true, message: '请输入退款金额'}]
                    })(
                    <InputNumber min={0} disabled={refundAuditForm.get('type')==1?false:true} style={{width:'140px'}} />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="退款鲸币">
                {getFieldDecorator('balancePrice', {
                    initialValue: refundAuditForm.get('balancePrice'),
                    onChange:(e)=>{onRefundActorAuditChange('balancePrice',e)},
                    rules: [{required: true, message: '请输入退款鲸币'}]
                    })(
                    <InputNumber min={0} disabled={refundAuditForm.get('type')==2?false:true} style={{width:'140px'}} />
                )}
            </FormItem>
            {/* <FormItem label="备注：">
                {getFieldDecorator('pi1', {
                    initialValue: refundAuditForm.get('pi2'),
                    onChange:(e)=>{onRefundActorAuditChange('pi2',e.target.value)},
                    })(
                        <InputNumber min={0} value={refundAuditForm.get('pi2')}/>
                )}
            </FormItem> */}
      </Form>
    );
  }

}



