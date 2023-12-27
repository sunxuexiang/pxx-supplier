import { Button, Checkbox, Col, Input, Row, Select, message } from 'antd';
import { produce } from 'immer';
import { Const, Headline } from 'qmkit';
import React, { useEffect, useState } from 'react';
import { getCustomerServiceConfig, saveCustomerServiceConfig } from '../webapi';

export function IMAutoReplySetting(props) {
  // 设置类型：1、人工客服欢迎语；2、客服超时说辞；3、客户超时下线提示；4、接收离线消息账号；5、客户超时说辞；6、客服不在线说辞
  const [replyConfigs, setReplyConfigs] = useState([
    {
      title: '人工客服欢迎语',
      isOpen: false,
      tipTitle: '*开启后，客户接入人工客服会话，系统将使用此说辞作为欢迎语',
      content: '',
      itemType: 1
    },
    {
      title: '客服超时说辞',
      isOpen: false,
      days: 0,
      tipTitle:
        '*开启后，当客服超过设置的时长未回复时，系统将自动给客户推送此说辞',
      content: '',
      itemType: 2,
      dayOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      title: '客户超时说辞',
      isOpen: false,
      days: 0,
      tipTitle:
        '*开启后，当客户超过设置的时长未回复时，系统将自动给客户推送此说辞',
      content: '',
      itemType: 5,
      dayOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      title: '客服不在线说辞',
      isOpen: false,
      days: 0,
      tipTitle: '*开启后，人工客服不在线时，系统将回复此说辞',
      content: '',
      itemType: 6,
      dayOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      title: '客户超时下线提示',
      isOpen: false,
      days: 0,
      tipTitle:
        '*当客户招过设置的时长未回复时，系统将结束该次会话并向给客户推送此说辞',
      content: '',
      itemType: 3,
      dayOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    }
  ]);

  useEffect(() => {
    getConfigData();
  }, []);

  const openOnChanged = (e, index) => {
    setReplyConfigs(
      produce(replyConfigs, (draf) => {
        draf[index].isOpen = e.target.checked ? true : false;
      })
    );
  };

  const daySelectChanged = (e, index) => {
    setReplyConfigs(
      produce(replyConfigs, (draf) => {
        draf[index].days = e;
      })
    );
  };

  const contentInput = (e, index) => {
    setReplyConfigs(
      produce(replyConfigs, (draf) => {
        draf[index].content = e.target.value;
      })
    );
  };

  /**
   * 获取配置
   */
  const getConfigData = async () => {
    try {
      const { res } = await getCustomerServiceConfig();
      if (res.code === Const.SUCCESS_CODE) {
        setReplyConfigs(
          produce(replyConfigs, (draf) => {
            for (const item of draf) {
              const findItem = res.context.filter((x) => {
                return x.settingType === item.itemType;
              });
              if (findItem.length) {
                item.content = findItem[0].content.message;
                item.isOpen = findItem[0].content.switchStatus;
                if (findItem[0].content.time) {
                  item.days = findItem[0].content.time;
                }
              }
            }
          })
        );
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('获取配置失败');
    }
  };

  const save = async (e) => {
    const saveData = replyConfigs.map((item) => {
      return {
        content: {
          message: item.content,
          time: item.itemType === 1 ? '' : item.days || 5,
          switchStatus: item.isOpen
        },
        settingType: item.itemType
      };
    });
    try {
      const { res } = await saveCustomerServiceConfig(saveData);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('保存成功');
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const createItems = (item) => {
    return item.map((item, index) => {
      return (
        <Row key={item.title} style={{ marginTop: 20 }}>
          <Col span={4} style={{ marginTop: index == 0 ? '0' : '5px' }}>
            <span>{item.title}</span>
          </Col>
          <Col span={18}>
            <Row>
              <Checkbox
                checked={item.isOpen}
                onChange={(e) => openOnChanged(e, index)}
              >
                开启
              </Checkbox>
              {item.dayOptions !== undefined && (
                <Select
                  style={{ width: 100 }}
                  value={item.days}
                  onChange={(e) => daySelectChanged(e, index)}
                >
                  {item.dayOptions.map((op) => {
                    return (
                      <Select.Option key={op} value={op}>
                        {op}分钟
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Row>
            <Row>
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 6 }}
                className="auth-reply-textarea"
                value={item.content}
                onInput={(e) => contentInput(e, index)}
              ></Input.TextArea>
              <span className="auth-reply-tips">{item.tipTitle}</span>
            </Row>
          </Col>
        </Row>
      );
    });
  };

  return (
    <div>
      <Headline children={<h4>自动回复设置</h4>} />
      <div>
        {createItems(replyConfigs)}
        <Row>
          <Button type="primary" onClick={save}>
            保存
          </Button>
        </Row>
      </div>
    </div>
  );
}
