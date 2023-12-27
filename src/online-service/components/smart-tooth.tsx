import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, message } from 'antd';
import { Const } from 'qmkit';
import { updateSmartTooth } from '../webapi';

const SmartTooth = (props) => {
  const [status, setStatus] = useState(0);
  // 初始化
  useEffect(() => {
    if (props.visible) {
      setStatus(props.defaultStatus === 2 ? 1 : 0);
    }
  }, [props.visible]);

  const changeConfirm = () => {
    props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        updateSmartTooth(val)
          .then((data) => {
            if (data.res.code !== Const.SUCCESS_CODE) {
              message.error(data.res.message || '修改失败');
              return;
            }
            message.success('修改成功');
            props.form.resetFields();
            props.hideModal();
          })
          .catch((err) => {
            message.error('修改失败');
          });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      title="IM商家客服"
      visible={props.visible}
      onOk={changeConfirm}
      onCancel={() => {
        props.form.resetFields();
        props.hideModal();
      }}
      width={600}
    >
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
        autoComplete="off"
      >
        <Form.Item style={{ marginBottom: 15 }} label="启用开关">
          {getFieldDecorator('switchStatus', {
            rules: [{ required: true, message: '请选择启用状态' }],
            initialValue: status ? status : 0
          })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SmartToothTemplate = Form.create<any>()(SmartTooth);
export default SmartToothTemplate;
