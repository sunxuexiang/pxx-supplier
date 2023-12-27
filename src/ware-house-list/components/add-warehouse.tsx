import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TreeSelect, Select, message } from 'antd';
import { AreaSelect, FindArea, Const } from 'qmkit';
import { addNewWarehouse } from '../webapi';

const AddWarehouse = (props) => {
  const { getFieldDecorator } = props.form;
  // 弹窗显示
  const [showModal, setShowModal] = useState(false);
  // 弹窗确认loading
  const [confirmLoading, setLoding] = useState(false);
  // 覆盖区域
  const [treeData, setTreeData] = useState([]);
  const [destinationAreaName, setAreaName] = useState([]);
  useEffect(() => {
    if (props.visible) {
      setTreeData(FindArea.findProvinceCity([]));
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [props.visible]);
  // 区域选择
  const changeArea = (value, label, extra) => {
    console.warn(value, label, extra);
    setAreaName(label);
  };
  const confirmAdd = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        console.warn(value);
        const {
          destinationArea,
          type,
          wareCode,
          wareName,
          addressDetail
        } = value;
        const params = {
          type,
          wareCode,
          wareName,
          destinationArea,
          destinationAreaName,
          provinceId: value.area[0],
          cityId: value.area[1],
          areaId: value.area[2],
          addressDetail
        };
        addNewWarehouse(params)
          .then((data) => {
            if (data.res.code !== Const.SUCCESS_CODE) {
              message.error(data.res.message || '添加失败');
              return;
            }
            message.success('添加成功');
            setShowModal(false);
            props.form.resetFields();
            props.hide(true);
          })
          .catch((err) => {
            message.error('添加失败');
          });
      }
    });
  };
  return (
    <Modal
      title="新增仓库"
      width={500}
      visible={showModal}
      onOk={confirmAdd}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setShowModal(false);
        props.form.resetFields();
        props.hide();
      }}
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
        <Form.Item style={{ marginBottom: 15 }} label="仓库名称">
          {getFieldDecorator('wareName', {
            rules: [{ required: true, message: '请输入仓库名称' }],
            initialValue: ''
          })(<Input placeholder="请输入仓库名称" />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="仓库编码">
          {getFieldDecorator('wareCode', {
            rules: [{ required: true, message: '请输入仓库编码' }],
            initialValue: ''
          })(<Input placeholder="请输入仓库编码" />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="仓库类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入仓库类型' }],
            initialValue: '1'
          })(
            <Select disabled>
              <Select.Option key="0" value="0">
                门店仓
              </Select.Option>
              <Select.Option key="1" value="1">
                线上仓
              </Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="覆盖区域">
          {getFieldDecorator('destinationArea', {
            // initialValue: ,
            rules: [
              {
                required: true,
                message: '请选择覆盖区域'
              }
            ]
          })(
            <TreeSelect
              treeData={treeData}
              onChange={changeArea}
              treeCheckable={true}
              searchPlaceholder={'请选择覆盖区域'}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            />
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="所在区域">
          {getFieldDecorator('area', {
            rules: [{ required: true, message: '请输入所在区域' }],
            initialValue: []
          })(
            <AreaSelect
              onChange={(value) => {
                console.warn(value);
              }}
            />
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="详细地址">
          {getFieldDecorator('addressDetail', {
            rules: [{ required: true, message: '请输入详细地址' }],
            initialValue: ''
          })(<Input.TextArea rows={4} placeholder="请输入详细地址" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
// AddWarehouse.propTypes = {
//   visible: Boolean
// };
const AddWarehouseTemplate = Form.create()(AddWarehouse);

export default AddWarehouseTemplate;
