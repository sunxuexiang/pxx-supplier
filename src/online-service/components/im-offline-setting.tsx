import { Checkbox, Col, Row, Select, message } from 'antd';
import { Const, Headline } from 'qmkit';
import React, { useState, useEffect } from 'react';
import {
  getCustomerServiceConfig,
  getIMConfig,
  saveCustomerServiceConfig
} from '../webapi';
import { produce } from 'immer';
import Radio from 'antd/es/radio';

export function IMOfflineSetting(props) {
  const [customer, setCustomer] = useState([]);

  const [checkedId, setcheckedId] = useState(0);

  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = async () => {
    try {
      const [res1, res2] = await Promise.all([
        getCustomerServiceConfig({ settingType: 4 }),
        getIMConfig()
      ]);
      if (res2.res.code === Const.SUCCESS_CODE) {
        const transData = res2.res.context.imOnlineServerItemRopList.map(
          (item) => {
            if (res1.res.code === Const.SUCCESS_CODE) {
              const data = res1.res.context[0];
              if (
                data &&
                data.content.offlineReceiveAccounts.length > 0 &&
                data.content.offlineReceiveAccounts.includes(
                  item.customerServiceAccount
                )
              ) {
                // item.checked = true;
                setcheckedId(item.customerServiceAccount);
              }
              // else {
              //   item.checked = false;
              // }
            }
            return item;
          }
        );
        setCustomer(transData);
      } else {
        message.error(res2.res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const onChanged = async (e) => {
    console.warn('===cc===>', e);
    setcheckedId(e.target.customerServiceAccount);
    // const isChecked = e.target.checked;
    // const newData = produce(customer, (draft) => {
    //   draft[index].checked = isChecked;
    // });
    // const allCheckedAccounts = newData
    //   .filter((item) => item.checked)
    //   .map((item) => item.customerServiceAccount);
    // setCustomer(newData);
    try {
      await saveCustomerServiceConfig([
        {
          settingType: 4,
          content: {
            offlineReceiveAccounts: [e.target.customerServiceAccount]
          }
        }
      ]);
    } catch (error) {}
  };

  return (
    <div>
      <Headline children={<h4>离线设置</h4>} />
      <div>
        <Row>
          <span>
            所有账号下线之后，用户再发起的消息则为离线消息，离线消息接收遵循以下设置
          </span>
          <Col style={{ marginTop: 10 }}>
            <span>接收消息账号：</span>
            <Radio.Group value={checkedId} onChange={(e) => onChanged(e)}>
              {customer.map((item, index) => {
                return (
                  // <Checkbox
                  //   checked={item.checked}
                  //   key={item.imServiceItemId}
                  //   {...item}
                  //   onChange={(e) => onChanged(e, index)}
                  // >
                  //   {item.customerServiceName}
                  // </Checkbox>
                  <Radio
                    {...item}
                    value={item.customerServiceAccount}
                    key={item.customerServiceAccount}
                  >
                    {item.customerServiceName}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Col>
        </Row>
      </div>
    </div>
  );
}
