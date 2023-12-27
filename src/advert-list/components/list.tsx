import React, { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { Const, history, FindArea, cache } from 'qmkit';
import moment from 'moment';
import { delAd, queryCustomerWallet } from '../webapi';
import '../index.less';

import PayModal from './payModal';

const List = (props) => {
  const { list, pagination, pageChange, loading } = props;
  const logInfo = sessionStorage.getItem(cache.LOGIN_DATA)
    ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
    : {};
  const [visible, setVisible] = useState(false);
  const [currentData, setCurrentData] = useState({});
  // 鲸币余额
  const [balance, setBalance] = useState('' as string | number);
  // 获取鲸币余额
  const getBalance = async () => {
    const params = {
      storeFlag: true,
      storeId: logInfo.storeId
    };
    const { res } = await queryCustomerWallet(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      setBalance(res.context?.balance || '');
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getBalance();
  }, []);
  // 关闭弹窗
  const onCancel = () => {
    setVisible(false);
    setCurrentData({});
  };
  // 删除广告
  const deleteAd = async (id: string) => {
    const { res } = await delAd({ id });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      pageChange();
    } else {
      message.error(res.message || '');
    }
  };
  const columns = [
    {
      title: '广告类型',
      dataIndex: 'slotType',
      key: 'slotType',
      render: (text) => {
        let result = '';
        switch (text) {
          case 0:
            result = '开屏广告';
            break;
          case 1:
            result = 'banner广告';
            break;
          case 2:
            result = '商城广告';
            break;
          default:
            break;
        }
        return result;
      }
    },
    {
      title: '缩略图',
      dataIndex: 'materialUrl',
      key: 'materialUrl',
      render: (text) =>
        text ? (
          <img alt="" src={text} className="advert-list-table-img" />
        ) : (
          '--'
        )
    },
    {
      title: '提交审核时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      title: '投放生效时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, record) => (
        <div>
          <span>
            {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'}至
          </span>
          <br />
          <span>
            {record.endTime
              ? moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </span>
        </div>
      )
    },
    {
      title: '广告位总价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => text || '--'
    },
    {
      title: '单位价格',
      dataIndex: 'detailList',
      key: 'detailList',
      render: (text, record) => (
        <div>
          {text &&
            text.map((item) => (
              <div key={item.id}>
                {record.slotType === 2
                  ? `${FindArea.findProviceName(record.provinceId)}-${
                      record.marketName
                    }-${record.mallTabName}-`
                  : ''}
                位置{record.slotGroupSeq}-
                {moment(item.startTime).format('YYYY年MM月DD日')}至
                {moment(item.endTime).format('YYYY年MM月DD日')}-{item.unitPrice}
                元/天
              </div>
            ))}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'activityState',
      key: 'activityState',
      render: (text) => {
        let result = '';
        switch (text) {
          case 0:
            result = '待支付';
            break;
          case 10:
            result = '待审核';
            break;
          case 20:
            result = '待履行';
            break;
          case 30:
            result = '履行中';
            break;
          case 40:
            result = '已驳回';
            break;
          case 50:
            result = '已取消';
            break;
          case 100:
            result = '已完成';
            break;
          default:
            break;
        }
        return result;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            {record.activityState !== 40 && (
              <Button
                type="link"
                onClick={() =>
                  history.push({
                    pathname: '/advert',
                    state: { id: record.id, isEdit: 0 }
                  })
                }
              >
                查看详情
              </Button>
            )}
            {record.activityState === 40 && (
              <Button
                type="link"
                onClick={() =>
                  history.push({
                    pathname: '/advert',
                    state: { id: record.id, isEdit: 1 }
                  })
                }
              >
                重新提交
              </Button>
            )}
            {record.activityState === 0 && (
              <Button
                type="link"
                onClick={() => {
                  setCurrentData(record);
                  setVisible(true);
                }}
              >
                继续支付
              </Button>
            )}
            {/* <Popconfirm
              title="确认删除？"
              onConfirm={() => deleteAd(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button type="link">删除</Button>
            </Popconfirm> */}
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <Table
        rowKey="id"
        dataSource={list}
        columns={columns}
        className="advert-list"
        pagination={{
          ...pagination,
          onChange: pageChange
        }}
        loading={loading}
        style={{ marginTop: '16px' }}
      />
      <PayModal
        visible={visible}
        currentData={currentData}
        onCancel={onCancel}
        balance={balance}
        pageChange={pageChange}
      />
    </div>
  );
};

export default List;
