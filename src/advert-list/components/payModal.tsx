import React, { useState } from 'react';
import { Modal, Form, Radio, Spin, message } from 'antd';
import { Const, history } from 'qmkit';
import { adActivityPay } from '../webapi';

const FormItem = Form.Item;
const PayModal = (props) => {
  const { form, currentData, visible, onCancel, balance, pageChange } = props;
  const { getFieldDecorator, validateFields } = form;
  const [loading, setLoading] = useState(false);
  // 支付
  const onOk = () => {
    validateFields(async (errs, values) => {
      if (errs) {
        return;
      }
      if (values.payType === 0) {
        history.push({
          pathname: '/advert-pay',
          state: { id: currentData.id }
        });
        return;
      }
      const params = {
        id: currentData.id,
        payType: values.payType
      };
      setLoading(true);
      const { res } = await adActivityPay(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('支付成功', () => {
          setLoading(false);
          onCancel();
          pageChange();
        });
      } else {
        setLoading(false);
        message.error(res.message || '');
      }
    });
  };
  return (
    <Modal
      visible={visible}
      centered
      maskClosable={false}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Spin spinning={loading} tip="支付中...">
        <Form>
          <FormItem label="支付方式">
            {getFieldDecorator('payType', {
              rules: [{ required: true, message: '请选择支付方式' }],
              initialValue:
                currentData.payType || currentData.payType === 0
                  ? currentData.payType
                  : ''
            })(
              <Radio.Group>
                <Radio value={0}>线上支付</Radio>
                <Radio
                  value={1}
                  disabled={
                    !(
                      balance &&
                      currentData.totalPrice &&
                      balance >= currentData.totalPrice
                    )
                  }
                >
                  鲸币支付
                </Radio>
              </Radio.Group>
            )}
            <span>鲸币余额：{balance}</span>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
};

const PayModalForm = Form.create<any>()(PayModal);
export default PayModalForm;
