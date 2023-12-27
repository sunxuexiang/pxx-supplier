import React, { useState } from 'react';

import { Table, Button, message } from 'antd';
import { Const } from 'qmkit';
import { orList, oldOrList, modalList } from './optionsList';
import { Link } from 'react-router-dom';
import ReturnModal from './return-modal';
import { getRecordDetail } from '../webapi';
import '../index.less';

function AccountList(props) {
  const { list, pagination, loading, getList, showDeail } = props;
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentDetail, setDetail] = useState();

  const showDetails = async (row) => {
    if (row.relationOrderId) {
      const { res } = await getRecordDetail(row.relationOrderId);
      if (res && res.code === Const.SUCCESS_CODE) {
        setDetail(res.context);
        setDetailVisible(true);
      } else {
        message.error(res.message || '');
      }
    }
  };
  const columns = [
    {
      title: '金额类型',
      dataIndex: 'budgetType',
      key: 'budgetType',
      render: (text) => {
        if (text === 0) {
          return '获得';
        }
        if (text === 1) {
          return '扣除';
        }
        return '-';
      }
    },
    {
      title: '明细类型',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, row) => {
        if ([...orList, ...oldOrList].includes(text)) {
          if (
            [
              '订单退款',
              '订单退款扣除',
              '鲸币抵扣退还',
              '订单返运费退还'
            ].includes(text)
          ) {
            if (
              text === '订单退款' &&
              row.relationOrderId.substr(0, 2) === 'LP'
            ) {
              return text;
            }
            if (`${row.relationOrderId}`.startsWith('O')) {
              return (
                <Link to={`/order-detail/${row.relationOrderId}`}>{text}</Link>
              );
            }
            return (
              <Link
                to={
                  row.activityType == 3
                    ? `/th_order-return-detail/${row.relationOrderId}`
                    : `/order-return-detail/${row.relationOrderId}`
                }
              >
                {text}
              </Link>
            );
          } else {
            return (
              <Link
                to={
                  row.activityType == 3
                    ? `/th_order-detail/${row.relationOrderId}`
                    : `/order-detail/${row.relationOrderId}`
                }
              >
                {text}
              </Link>
            );
          }
        } else if (
          ['指定商品返鲸币', '指定商品返鲸币退回', ...modalList].includes(text)
        ) {
          return <a onClick={() => showDetails(row)}>{text}</a>;
        } else {
          return text;
        }
      }
    },
    {
      title: '相关账号',
      dataIndex: 'customerAccount',
      key: 'customerAccount'
    },
    {
      title: '鲸币数量',
      dataIndex: 'dealPrice',
      key: 'dealPrice'
    },
    {
      title: '明细时间',
      dataIndex: 'dealTime',
      key: 'dealTime'
    },
    {
      title: '相关单号',
      dataIndex: 'relationOrderId',
      key: 'relationOrderId'
    },
    {
      title: '备注',
      dataIndex: 'remarkDetail',
      key: 'remarkDetail'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, row) => {
        if (['手动充值', '手动扣除'].includes(row.remark)) {
          return (
            <Button type="link" onClick={() => showDeail(row)}>
              查看详情
            </Button>
          );
        }
        return '-';
      }
    }
  ];

  const pageChange = (page, pageSize) => {
    getList({ pageNum: page - 1, pageSize });
  };
  return (
    <div>
      <Table
        dataSource={list}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: pageChange
        }}
      />
      <ReturnModal
        detailVisible={detailVisible}
        currentDetail={currentDetail}
        setDetailVisible={setDetailVisible}
      />
    </div>
  );
}

export default AccountList;
