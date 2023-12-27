import React, { useState, useEffect } from 'react';
import {
  Alert,
  Table,
  Button,
  Form,
  Modal,
  Input,
  message,
  Switch
} from 'antd';
import { Const, BreadCrumb, Headline, AuthWrapper, ValidConst } from 'qmkit';
import { getWiteDrawalList, saveBankInfo } from './webapi';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 17
  }
};
const WithdrawalAccount = (props) => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentData, setCurrentData] = useState({} as any);
  const [type, setType] = useState('add');

  const getList = async () => {
    const { res } = await getWiteDrawalList();
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context || []);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getList();
  }, []);
  const add = () => {
    setType('add');
    setVisible(true);
  };
  const editBank = (record) => {
    setType('edit');
    setCurrentData(record);
    setVisible(true);
  };
  const onCancel = () => {
    setCurrentData({});
    setVisible(false);
  };
  // 修改启用状态
  const changeStatus = async (checked, record) => {
    const params = {
      offlineAccounts: [
        {
          ...record,
          bankStatus: checked ? 0 : 1
        }
      ]
    };
    const { res } = await saveBankInfo(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('修改成功');
      getList();
    } else {
      message.error(res.message || '');
    }
  };
  // 删除
  const delBank = async (id) => {
    const params = {
      deleteIds: [id]
    };
    const { res } = await saveBankInfo(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      getList();
    } else {
      message.error(res.message || '');
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      render: (_, record, index) => {
        return index + 1;
      }
    },
    {
      title: '银行',
      dataIndex: 'bankName'
    },
    {
      title: '账户名',
      dataIndex: 'accountName'
    },
    {
      title: '账号',
      dataIndex: 'bankNo'
    },
    {
      title: '支行',
      dataIndex: 'bankBranch'
    },
    {
      title: '是否启用',
      dataIndex: 'bankStatus',
      render: (text, record) => (
        <Switch
          checked={text === 0}
          onChange={(checked) => changeStatus(checked, record)}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        return record.isWithdrawal ? (
          <div>
            <Button type="link" onClick={() => editBank(record)}>
              编辑
            </Button>
            {record.bankStatus === 1 && (
              <Button type="link" onClick={() => delBank(record.accountId)}>
                删除
              </Button>
            )}
          </div>
        ) : (
          '--'
        );
      }
    }
  ];
  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="商家提现账户" />
        <Alert
          message={
            <div>
              <p>操作说明:</p>
              <p>该账户为提现账户，如果账号有变更请走变更操作</p>
            </div>
          }
          type="info"
        />
        <AuthWrapper functionName="f_withdrawal_account">
          <div>
            <Button type="primary" onClick={add} style={{ marginBottom: 12 }}>
              新增账户
            </Button>
            <Table
              rowKey="accountId"
              dataSource={list}
              columns={columns}
              pagination={false}
            />
            <BankModalForm
              visible={visible}
              currentData={currentData}
              onCancel={onCancel}
              type={type}
              getList={getList}
            />
          </div>
        </AuthWrapper>
      </div>
    </div>
  );
};

export default WithdrawalAccount;

const bankModal = (props) => {
  const { form, onCancel, currentData, visible, type, getList } = props;
  const { getFieldDecorator, validateFields } = form;
  const onOk = () => {
    validateFields(async (errs, values) => {
      if (errs) {
        return;
      }
      const params = {
        offlineAccounts: [
          {
            ...values,
            index: 0,
            bankStatus: type === 'add' ? 1 : currentData.bankStatus
          }
        ]
      };
      if (type === 'edit') {
        params.offlineAccounts[0].accountId = currentData.accountId;
      }
      const { res } = await saveBankInfo(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success(`${type === 'add' ? '新增' : '修改'}成功`);
        onCancel();
        getList();
      } else {
        message.error(res.message || '');
      }
    });
  };
  return (
    <Modal
      title={`${type === 'add' ? '新增' : '修改'}账户`}
      centered
      visible={visible}
      maskClosable={false}
      destroyOnClose
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form {...formItemLayout}>
        <FormItem label="开户银行">
          {getFieldDecorator('bankName', {
            initialValue: currentData.bankName || '',
            rules: [
              { required: true, whitespace: true, message: '请输入开户银行' },
              { pattern: ValidConst.noChar, message: '不允许特殊字符' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="开户银行支行">
          {getFieldDecorator('bankBranch', {
            initialValue: currentData.bankBranch || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入开户银行支行'
              },
              { pattern: ValidConst.noChar, message: '不允许特殊字符' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="账户名称">
          {getFieldDecorator('accountName', {
            initialValue: currentData.accountName || '',
            rules: [
              { required: true, whitespace: true, message: '请输入账户名称' },
              { pattern: ValidConst.noChar, message: '不允许特殊字符' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="银行卡号">
          {getFieldDecorator('bankNo', {
            initialValue: currentData.bankNo || '',
            rules: [
              { required: true, whitespace: true, message: '请输入银行卡号' },
              {
                pattern: ValidConst.bankNumber,
                message: '请输入正确的银行卡号'
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

const BankModalForm = Form.create<any>()(bankModal);
