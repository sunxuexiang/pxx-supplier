/**
 * IM会话上限设置
 */

import { Alert, Button, Form, Input, Row, message } from 'antd';
import { Const, Headline } from 'qmkit';
import React, { useState, useEffect } from 'react';
import { getCustomerServiceConfig, saveCustomerServiceConfig } from '../webapi';

function IMConvLimitSetting(props) {
  const { getFieldDecorator } = props.form;

  // 最大接待上限
  const limitMax = 30;
  // 最小接待上限
  const limitMin = 1;

  useEffect(() => {
    getChatServiceLimit();
  }, []);

  const getChatServiceLimit = async () => {
    try {
      const { res } = (await getCustomerServiceConfig({
        settingType: 7
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        const limit = res.context[0].content.quantity;
        props.form.setFieldsValue({
          customerServiceLimit: limit
        });
      }
    } catch (error) {}
  };

  const save = () => {
    const form = props.form;
    const _saveOpera = async () => {
      try {
        const limit = form.getFieldValue('customerServiceLimit');
        const { res } = (await saveCustomerServiceConfig([
          {
            settingType: 7,
            content: {
              quantity: limit
            }
          }
        ])) as any;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
        } else {
          message.error(message);
        }
      } catch (error) {
        message.error(error.message || '保存失败');
      }
    };
    form.validateFields((err, values) => {
      if (!err) {
        _saveOpera();
      }
    });
  };

  return (
    <Form>
      <Headline children={<h4>会话上限设置</h4>} />
      <div>
        <Row>
          <Alert
            message="会话上限设置用于配置每个商家客服账号同时最多接待用户会话的人数！"
            type="info"
            showIcon
          />
        </Row>
        <Row>
          <Form.Item>
            <span style={{ marginRight: 10 }}>每个客服同时接待会话上限</span>
            {getFieldDecorator('customerServiceLimit', {
              initialValue: 1,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (!/^[1-9]\d*$/.test(value)) {
                      callback(
                        <span style={{ paddingLeft: 180 }}>
                          请输入{limitMin}-{limitMax}之间的数字
                        </span>
                      );
                      return;
                    }
                    if (value < limitMin || value > limitMax) {
                      callback(
                        <span style={{ paddingLeft: 180 }}>
                          请输入1-40之间的数字
                        </span>
                      );
                    }
                    callback();
                  }
                }
              ]
            })(<Input style={{ width: 100 }} />)}
            <span style={{ marginLeft: 10 }}>人</span>
          </Form.Item>
        </Row>
        <Row>
          <Button type="primary" onClick={save}>
            保存
          </Button>
        </Row>
      </div>
    </Form>
  );
}

const FormConvSetting = Form.create({})(IMConvLimitSetting);
export default FormConvSetting;
