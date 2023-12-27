import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  Table,
  message
} from 'antd';
import { Const, Headline } from 'qmkit';
import React, { useEffect, useState } from 'react';
import { getServiceChatManagerList } from '../webapi';

export function IMAccountManager(props) {
  const columns = [
    {
      title: '客服昵称',
      dataIndex: 'customerServiceName',
      key: 'customerServiceName'
    },
    {
      title: '账号',
      dataIndex: 'customerServiceAccount',
      key: 'customerServiceAccount'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return text == 0 ? '在线' : '离线';
      }
    },
    {
      title: '最近登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      render: (text) => {
        return text;
      }
    },
    {
      title: '接待数量',
      dataIndex: 'acceptQuantity',
      key: 'acceptQuantity'
    }
  ];

  const [data, setData] = useState([]);

  const getServiceAccountList = async () => {
    try {
      const { res } = await getServiceChatManagerList();
      if (res.code === Const.SUCCESS_CODE) {
        setData(res.context);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getServiceAccountList();
  }, []);

  return (
    <Table
      rowKey={(row) => row.customerServiceAccount}
      columns={columns}
      dataSource={data}
    ></Table>
  );
}
