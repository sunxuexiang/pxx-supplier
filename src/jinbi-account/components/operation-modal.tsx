import React from 'react';

import { Input, InputNumber, Select, Radio, Modal, Form } from 'antd';
import { ValidConst, history, util } from 'qmkit';

import '../index.less';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const { Option } = Select;

function OperationModal(props) {
  const {
    form,
    visible,
    modalLoading,
    operationSubmit,
    closeModal,
    isOrderReturn,
    currentData
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const isThird = util.isThirdStore();
  //关闭modal
  const handleCancel = (event) => {
    if (event.target.type == 'button') {
      history.goBack();
    } else {
      form.resetFields();
      closeModal();
    }
  };
  // 提交
  const handleOk = () => {
    form.validateFields((errs, values) => {
      if (!errs) {
        operationSubmit(values, () => {
          form.resetFields();
          closeModal();
        });
      }
    });
  };
  // 对象类型切换
  const typeChange = (e) => {
    setFieldsValue({ opertionType: 0 });
  };
  return (
    <Modal
      title={isThird ? '鲸币退款' : '鲸币退款/收回'}
      visible={visible}
      maskClosable={false}
      confirmLoading={modalLoading}
      cancelText="返回"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form {...formLayout}>
        <Form.Item
          label="对象类型"
          style={isOrderReturn ? { display: 'none' } : {}}
        >
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择对象类型' }],
            initialValue: 0
          })(
            <Radio.Group onChange={typeChange}>
              <Radio value={0}>平台用户</Radio>
              <Radio value={1}>平台商家</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {getFieldValue('type') === 0 && (
          <Form.Item label="用户账号">
            {getFieldDecorator('customerAccount', {
              rules: [
                { required: true, message: '请填写用户账号' },
                { pattern: ValidConst.noChar, message: '不允许特殊字符' }
              ],
              initialValue: isOrderReturn ? currentData.customerAccount : ''
            })(<Input maxLength={100} disabled={isOrderReturn} />)}
          </Form.Item>
        )}
        {getFieldValue('type') === 1 && (
          <Form.Item label="商家账号">
            {getFieldDecorator('changOverToStoreAccount', {
              rules: [
                { required: true, message: '请填写商家账号' },
                { pattern: ValidConst.noChar, message: '不允许特殊字符' }
              ]
            })(<Input maxLength={100} />)}
          </Form.Item>
        )}
        <Form.Item
          label="操作类型"
          style={isOrderReturn ? { display: 'none' } : {}}
        >
          {getFieldDecorator('opertionType', {
            initialValue: 0,
            rules: [{ required: true, message: '请选择操作类型' }]
          })(
            <Select disabled={isThird || getFieldValue('type') === 1}>
              <Option key={0} value={0}>
                {getFieldValue('type') === 1 ? '赠送' : '退款'}
              </Option>
              <Option key={1} value={1}>
                收回
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="鲸币数量">
          {getFieldDecorator('balance', {
            rules: [{ required: true, message: '请填写鲸币数量' }],
            initialValue: isOrderReturn ? currentData.balance : ''
          })(
            <InputNumber
              min={0.01}
              precision={2}
              step={1}
              max={isOrderReturn ? currentData.balance : Infinity}
              style={{ width: '100%' }}
            />
          )}
        </Form.Item>
        {getFieldValue('type') === 0 && (
          <React.Fragment>
            <Form.Item label="订单号">
              {getFieldDecorator('relationOrderId', {
                initialValue: isOrderReturn ? currentData.relationOrderId : '',
                rules: [
                  { required: true, message: '请填写订单号' },
                  { pattern: ValidConst.noChar, message: '不允许特殊字符' }
                ]
              })(<Input maxLength={100} disabled={isOrderReturn} />)}
            </Form.Item>
            <Form.Item label="退单号">
              {getFieldDecorator('returnOrderCode', {
                initialValue: isOrderReturn ? currentData.returnOrderCode : '',
                rules: [
                  { pattern: ValidConst.noChar, message: '不允许特殊字符' }
                ]
              })(<Input maxLength={100} disabled={isOrderReturn} />)}
            </Form.Item>
          </React.Fragment>
        )}
        <Form.Item label="备注">
          {getFieldDecorator('remark', {
            initialValue: isOrderReturn ? currentData.remark : ''
          })(<Input.TextArea maxLength={200} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}
const OperationModalForm = Form.create<any>()(OperationModal);
export default OperationModalForm;
