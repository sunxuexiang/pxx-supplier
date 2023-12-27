import React, { useEffect, useState } from 'react';
import { Const, AreaSelect, ValidConst, FindArea } from 'qmkit';
import { Button, Table, Modal, Form, Switch, Input, message } from 'antd';
import {
  addDoorPickConfig,
  fetchDoorPickConfig,
  editDoorPickConfig,
  startDoorPickConfig,
  endDoorPickConfig,
  delDoorPickConfig
} from '../webapi';

const { confirm } = Modal;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
};

function SelfList(props) {
  // const { formRef } = props;
  // 弹窗开关
  const [visible, setVisible] = useState(false);
  // 新增/编辑
  const [type, setType] = useState('add');
  // 被编辑数据
  const [editInfo, setEditInfo] = useState('');
  // 分页数据
  const [pagination, setPage] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  // 列表数据
  const [list, setList] = useState([]);

  // 获取列表数据
  const getList = async () => {
    const params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };
    const { res } = await fetchDoorPickConfig(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context?.content || []);
      setTotal(res.context?.total || 0);
    } else {
      message.error(res.message || '');
    }
  };

  useEffect(() => {
    getList();
  }, [pagination]);
  // 打开弹窗(新增)
  const add = () => {
    setVisible(true);
    setType('add');
  };
  // 关闭弹窗
  const closeModal = () => {
    setVisible(false);
    setEditInfo('');
  };
  // 打开弹窗(编辑)
  const edit = (info) => {
    setVisible(true);
    setType('edit');
    setEditInfo(info);
  };
  // 打开停用确认modal
  const endConfirm = async (record) => {
    confirm({
      title: '确认停用自提点?',
      // content: '停用自提点将自动关闭上门自提开关', (配送方式合并后 自提开关放在运营后台中了 故此逻辑废弃)
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        const { res } = await endDoorPickConfig({
          networkIds: [record.networkId]
        });
        if (res && res.code === Const.SUCCESS_CODE) {
          getList();
          // 停用成功后需关闭上门自提开关 (配送方式合并后 自提开关放在运营后台中了 故此逻辑废弃)
          // formRef.current.form.setFieldsValue({ openFlag: false }, () => {
          //   formRef.current.save();
          // });
        } else {
          message.error(res.message || '');
        }
      }
    });
  };
  // 启用/停用
  const switchChange = async (checked, record) => {
    if (!checked) {
      endConfirm(record);
      return;
    }
    const { res } = await startDoorPickConfig({
      networkIds: [record.networkId]
    });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      getList();
    } else {
      message.error(res.message || '');
    }
  };
  //删除
  const delConfig = async (record) => {
    const { res } = await delDoorPickConfig({ networkIds: [record.networkId] });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      setPage({ current: 1, pageSize: 10 });
    } else {
      message.error(res.message || '');
    }
  };

  const columns = [
    // {
    //   title: '自提点名称',
    //   dataIndex: 'networkName',
    //   key: 'networkName'
    // },
    {
      title: '自提点地址',
      dataIndex: 'networkAddress',
      key: 'networkAddress',
      render: (text, record) => {
        let address = '';
        if (record.province && record.city && record.area && record.town) {
          address = FindArea.addressStreetInfo(
            record.province,
            record.city,
            record.area,
            record.town
          );
        }
        return address + text;
      }
    },
    // {
    //   title: '联系人',
    //   dataIndex: 'contacts',
    //   key: 'contacts'
    // },
    {
      title: '状态',
      dataIndex: 'delFlag',
      key: 'delFlag', // 0启用 1删除 2停用
      render: (text, record) => (
        <Switch
          checked={text === 0}
          onChange={(checked) => switchChange(checked, record)}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        if (record.delFlag === 2) {
          return (
            <React.Fragment>
              <Button type="link" onClick={() => edit(record)}>
                编辑
              </Button>
              <Button type="link" onClick={() => delConfig(record)}>
                删除
              </Button>
            </React.Fragment>
          );
        }
        return '-';
      }
    }
  ];
  return (
    <div>
      <Button type="primary" onClick={add}>
        新增自提点
      </Button>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          showQuickJumper: false,
          showSizeChanger: false,
          onChange: (page, pageSize) => setPage({ current: page, pageSize })
        }}
      />
      <AddModalForm
        visible={visible}
        closeModal={closeModal}
        setPage={setPage}
        type={type}
        editInfo={editInfo}
      />
    </div>
  );
}

function AddModal(props) {
  const { form, visible, closeModal, setPage, type, editInfo } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    // 新增时每次打开清空表单数据
    if (visible && type === 'add') {
      form.resetFields();
    }
  }, [visible]);
  // 保存
  const handleOk = () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const addressNames = FindArea.addressStreetName(
          values.address[0],
          values.address[1],
          values.address[2],
          values.address[3]
        );
        const params = {
          ...values,
          province: values.address[0] || '',
          provinceName: addressNames.proviceName || '',
          city: values.address[1] || '',
          cityName: addressNames.cityName || '',
          area: values.address[2] || '',
          areaName: addressNames.areaName || '',
          town: values.address[3] || '',
          townName: addressNames.streetName || ''
        };
        delete params.address;
        if (type === 'edit') {
          params.networkId = editInfo.networkId;
          params.delFlag = 2;
        }
        const functionName =
          type === 'edit' ? editDoorPickConfig : addDoorPickConfig;
        const { res } = await functionName(params);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success(`${type === 'add' ? '新增' : '修改'}成功`);
          setPage({ current: 1, pageSize: 10 });
          closeModal();
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  let initAddress = [];
  if (
    type === 'edit' &&
    editInfo.province &&
    editInfo.city &&
    editInfo.area &&
    editInfo.town
  ) {
    initAddress = [
      editInfo.province,
      editInfo.city,
      editInfo.area,
      editInfo.town
    ];
  }
  return (
    <Modal
      visible={visible}
      centered
      maskClosable={false}
      width={600}
      onCancel={closeModal}
      onOk={handleOk}
      title={type === 'add' ? '新增自提点' : '修改自提点'}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        {/* <FormItem label="自提点名称">
          {getFieldDecorator('networkName', {
            initialValue: type === 'edit' ? editInfo?.networkName : '',
            rules: [
              { required: true, message: '请输入自提点名称' },
              { validator: ValidConst.validateNoPhone }
            ]
          })(<Input placeholder="请输入自提点名称" />)}
        </FormItem> */}
        <FormItem required label="自提点地址">
          {getFieldDecorator('address', {
            initialValue: initAddress,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value && value.length === 4) {
                    callback();
                  } else {
                    callback('请选择自提点地址');
                  }
                }
              }
            ]
          })(
            <AreaSelect
              placeholder="请选择自提点地址"
              getPopupContainer={() => document.getElementById('page-content')}
            />
          )}
        </FormItem>
        <FormItem label="详细地址">
          {getFieldDecorator('networkAddress', {
            initialValue: type === 'edit' ? editInfo?.networkAddress : '',
            rules: [
              { required: true, message: '请输入详细地址' },
              { validator: ValidConst.validateNoPhone }
            ]
          })(
            <Input
              placeholder="请输入详细地址,不超过200个字符"
              maxLength={200}
            />
          )}
        </FormItem>
        {/* <FormItem label="联系人">
          {getFieldDecorator('contacts', {
            initialValue: type === 'edit' ? editInfo?.contacts : '',
            rules: [
              { required: true, message: '请输入联系人' },
              { pattern: ValidConst.noNumber, message: '联系人不可填数字' }
            ]
          })(<Input placeholder="请输入联系人" />)}
        </FormItem> */}
        {/* <FormItem label="联系电话">
          {getFieldDecorator('phone', {
            initialValue: type === 'edit' ? editInfo?.phone : '',
            rules: [
              { required: true, message: '请输入联系电话' },
              {
                pattern: ValidConst.phoneortele,
                message: '请输入正确的联系电话'
              }
            ]
          })(<Input placeholder="请输入联系电话" />)}
        </FormItem> */}
      </Form>
    </Modal>
  );
}

const AddModalForm = Form.create<any>()(AddModal);

export default SelfList;
