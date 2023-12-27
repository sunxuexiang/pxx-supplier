import React from 'react';
import { IMap, Relax } from 'plume2';
import { Modal,Alert,Form,Input,InputNumber  } from 'antd';
import { noop } from 'qmkit';
import refundFormItem from './form-item';
const FormItem=Form.Item;
const RefundForm =  Form.create()(refundFormItem);
@Relax
export default class refundModalForm extends React.Component<any, any> {
  _form;
  props: {
    relaxProps?: {
      onRefundAuditConfirm: Function;
      refundVisible: boolean;
      refundAuditForm:IMap;
      onRefundActorChange:Function;
    };
  };

  static relaxProps = {
    onRefundAuditConfirm: noop,
    refundVisible: 'refundVisible',
    refundAuditForm:'refundAuditForm',
    onRefundActorChange:noop,
  };

  render() {
    const {refundVisible,refundAuditForm,onRefundAuditConfirm,onRefundActorChange}=this.props.relaxProps;
    // const refundForm= Form.create()(<refundFormItem  />as any)
    // const refundForm = this.refundForme;
   
    return (
      <div>
          <Modal title="审核" visible={refundVisible} onOk={()=>onRefundAuditConfirm()}
          onCancel={()=>onRefundActorChange('refundVisible',false)}
        >
          <Alert
          style={{marginBottom: 10}}
          message={
            <div>
              <p>请确认退款金额。</p>
            </div>
          }
          type="info"
        />
          <RefundForm ref={(form) => (this._form = form)} />
        </Modal>  
      </div>
    );
  }

}



