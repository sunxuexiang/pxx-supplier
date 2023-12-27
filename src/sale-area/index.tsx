import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button, message, Tooltip } from 'antd';
import { BreadCrumb, Const, Headline, history, AuthWrapper } from 'qmkit';
import { fetchList, delLimit } from './webapi';

const FormItem = Form.Item;
const SaleArea = (props) => {
  const { form } = props;
  const { getFieldDecorator, getFieldsValue } = form;
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // 获取列表数据
  const getList = async () => {
    const values = getFieldsValue();
    const params = {
      ...values,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };
    setLoading(true);
    const { res } = await fetchList(params);
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res?.context?.content || []);
      setTotal(res?.context?.total || 0);
    } else {
      message.error(res.message || '');
    }
  };
  // 页码change
  const pageChange = (page) => {
    setPagination({ ...pagination, current: page });
  };
  // 搜索
  const search = () => {
    setPagination({ ...pagination, current: 1 });
  };
  // 删除
  const del = async (goodsInfoId) => {
    const { res } = await delLimit(goodsInfoId);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      search();
    } else {
      message.error(res.message || '');
    }
  };
  // 编辑
  const goEdit = (goodsInfoId) => {
    history.push({
      pathname: '/sale-area-form',
      state: { goodsInfoId }
    });
  };
  useEffect(() => {
    getList();
  }, [pagination]);

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'goodsInfoImg',
      render: (text) => <img src={text} alt="" style={{ width: 80 }} />
    },
    {
      title: '商品名称',
      dataIndex: 'goodsInfoName'
    },
    {
      title: '商品条码',
      dataIndex: 'goodsInfoBarcode'
    },
    {
      title: '可销售区域',
      dataIndex: 'allowedPurchaseAreaName',
      width: 240,
      render: (text) => {
        if (text && text.split(',').length > 8) {
          return (
            <div style={{ wordBreak: 'break-all' }}>
              <Tooltip title={text}>
                {text
                  .split(',')
                  .slice(0, 8)
                  .join(',')}
                ...
              </Tooltip>
            </div>
          );
        } else {
          return text || '--';
        }
      }
    },
    {
      title: '限购数量区域',
      dataIndex: 'singleOrderAssignAreaName',
      width: 240,
      render: (text) => {
        if (text && text.split(',').length > 8) {
          return (
            <div style={{ wordBreak: 'break-all' }}>
              <Tooltip title={text}>
                {text
                  .split(',')
                  .slice(0, 8)
                  .join(',')}
                ...
              </Tooltip>
            </div>
          );
        } else {
          return text || '--';
        }
      }
    },
    {
      title: '用户限购数量',
      dataIndex: 'singleOrderPurchaseNum',
      render: (text) => text || '--'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <div>
            <AuthWrapper functionName="f_sale_area_edit">
              <Button type="link" onClick={() => goEdit(record.goodsInfoId)}>
                编辑
              </Button>
              <Button type="link" onClick={() => del(record.goodsInfoId)}>
                删除
              </Button>
            </AuthWrapper>
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="商品指定销售区域" />
        <AuthWrapper functionName="f_sale_area">
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('likeGoodsName', {
                initialValue: ''
              })(<Input placeholder="请输入商品名称" addonBefore="商品名称" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('likeGoodsInfoBarcode', {
                initialValue: ''
              })(<Input placeholder="请输入商品条码" addonBefore="商品条码" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={search}>
                搜索
              </Button>
            </FormItem>
          </Form>
          <AuthWrapper functionName="f_sale_area_edit">
            <Button
              type="primary"
              style={{ margin: '12px 0' }}
              onClick={() => history.push('/sale-area-form')}
            >
              添加限购商品
            </Button>
          </AuthWrapper>
          <Table
            rowKey="goodsInfoId"
            dataSource={list}
            columns={columns}
            loading={loading}
            pagination={{
              ...pagination,
              total,
              onChange: pageChange
            }}
          />
        </AuthWrapper>
      </div>
    </div>
  );
};

const SaleAreaForm = Form.create()(SaleArea);
export default SaleAreaForm;
