import React, { useRef, useState, useEffect } from 'react';
import { message } from 'antd';
import { Headline, BreadCrumb, Const } from 'qmkit';

import SearchHead from './components/search-head';
import List from './components/list';
import { getPage } from './webapi';
import moment from 'moment';

const AdvertList = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPage] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 页码change
  const pageChange = async (page = 1) => {
    const values = formRef.current.form.getFieldsValue();
    const parmas = {
      ...values,
      startTime1:
        values.startTime && values.startTime.length === 2
          ? moment(values.startTime[0])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      startTime2:
        values.startTime && values.startTime.length === 2
          ? moment(values.startTime[1])
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      submitTime1:
        values.submitTime && values.submitTime.length === 2
          ? moment(values.submitTime[0])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      submitTime2:
        values.submitTime && values.submitTime.length === 2
          ? moment(values.submitTime[1])
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      pageNum: page - 1,
      pageSize: pagination.pageSize
    };
    setLoading(true);
    const { res } = await getPage(parmas);
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context?.content || []);
      setPage({
        current: page,
        pageSize: 10,
        total: res.context?.totalElements || 0
      });
    } else {
      message.error(res.message || '');
    }
  };

  useEffect(() => {
    pageChange();
  }, []);

  return (
    <div>
      <BreadCrumb />

      <div className="container">
        <Headline title="广告列表" />
        <SearchHead wrappedComponentRef={formRef} pageChange={pageChange} />
        <List
          list={list}
          pagination={pagination}
          pageChange={pageChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdvertList;
