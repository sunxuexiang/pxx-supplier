import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import {
  saveCustomerCommonMessage,
  saveImReplyMessageGroup,
  updateCustomerCommonMessage,
  updateImReplyMessageTree
} from '../webapi';
import { Const } from 'qmkit';

function IMSettingModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const groupTitles = ['添加分组', '编辑分组', '添加回复内容', '编辑回复内容'];

  const _handleCancel = (e) => {
    props.onModalVisible(false);
  };

  const _handleSubmit = (e) => {
    const submitGroup = async (name) => {
      setConfirmLoading(true);
      try {
        const nodeData = props.selectNodeInfo;
        let res;
        if (props.modalType == 1) {
          // 编辑分组
          const data = {
            groupId: nodeData.groupId,
            groupLevel: nodeData.level, //分组层级
            // parentGroupId: nodeData.parentGroupId, //上级分组ID，0表示一级分组
            groupName: name //分组名称
          };
          const result = await updateImReplyMessageTree(data);
          res = result.res;
        } else if (props.modalType == 2) {
          // 添加常用回复语
          const data = {
            oneGroupId: nodeData.groupId, //nodeData.parentGroupId, //一级分组ID
            // secondGroupId: nodeData.groupId, //二级分组ID
            message: name //消息内容
          };
          const result = await saveCustomerCommonMessage(data);
          res = result.res;
        } else if (props.modalType == 3) {
          // 编辑常用回复语
          const data = {
            msgId: props.modalData.msgId,
            oneGroupId: props.modalData.oneGroupId,
            // secondGroupId: props.modalData.secondGroupId,
            message: name
          };
          const result = await updateCustomerCommonMessage(data);
          res = result.res;
        } else {
          // 添加分组
          const data = {
            groupLevel: 1, //nodeData.isSelect ? 2 : 1, //分组层级
            parentGroupId: 0,
            //nodeData.level == 2 ? nodeData.parentGroupId : nodeData.groupId, //上级分组ID，0表示一级分组
            groupName: name //分组名称
          };
          const result = await saveImReplyMessageGroup(data);
          res = result.res;
        }
        if (res.code === Const.SUCCESS_CODE) {
          message.success(`${groupTitles[props.modalType]}成功`);
        } else {
          message.error(res.message);
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        setConfirmLoading(false);
        props.onModalVisible(false);
      }
    };
    props.form.validateFields((err, values) => {
      if (!err) {
        submitGroup(values.name);
      }
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      maskClosable={false}
      title={groupTitles[props.modalType] || groupTitles[0]}
      visible={props.modalVisible}
      onCancel={_handleCancel}
      onOk={_handleSubmit}
    >
      <Form>
        <PropsForm form={props.form} {...props} />
      </Form>
    </Modal>
  );
}

const PropsForm = (formRef) => {
  const { getFieldDecorator } = formRef.form;
  let initValue = '';
  if (formRef.modalType == 1) {
    initValue = formRef.selectNodeInfo.name;
  }
  if (formRef.modalType == 3) {
    initValue = formRef.modalData.message;
  }
  return (
    <React.Fragment>
      <Form.Item label={formRef.modalType >= 2 ? '' : '分组名称'} key="name">
        {getFieldDecorator('name', {
          rules: [
            { required: true, message: '请输入内容' },
            {
              max: formRef.modalType >= 2 ? 300 : 20,
              message: `最多输入${formRef.modalType >= 2 ? 300 : 20}个字`
            }
          ],
          initialValue: initValue
        })(
          formRef.modalType >= 2 ? (
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
          ) : (
            <Input maxLength={8} />
          )
        )}
      </Form.Item>
    </React.Fragment>
  );
};

const IMSettingModalodal = Form.create({})(IMSettingModal);
export default IMSettingModalodal;
