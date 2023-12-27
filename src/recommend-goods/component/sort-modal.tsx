import React, { useState, useEffect } from 'react';
import { Modal, Form, message, InputNumber } from 'antd';
import { Const } from 'qmkit';
import { changeGoodsSort } from '../webapi';

const SortModal = (props) => {
  // 当前排序数据
  const [sortData, setData] = useState({} as any);
  // 初始化
  useEffect(() => {
    if (props.showSort) {
      console.warn(props.currentData);
      setData(props.currentData);
    }
  }, [props.showSort]);
  // 确认排序
  const confirmSort = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const params = {
          merchantRecommendId: sortData.merchantRecommendId,
          sort: value.sort
        };
        changeGoodsSort(params).then((data) => {
          if (data.res.code !== Const.SUCCESS_CODE) {
            message.error(data.res.message || '修改失败');
            return;
          }
          message.success('修改成功');
          props.hideSort(true);
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      title={'修改排序'}
      width={400}
      visible={props.showSort}
      onOk={confirmSort}
      //   confirmLoading={confirmLoading}
      onCancel={() => {
        props.hideSort();
      }}
      destroyOnClose
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
        <Form.Item style={{ marginBottom: 15 }} label="排序">
          {getFieldDecorator('sort', {
            rules: [{ required: true, message: '请输入排序序号' }],
            initialValue: sortData.sort || ''
          })(
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入排序序号"
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SortModalTemplate = Form.create<any>()(SortModal);
export default SortModalTemplate;
