import React, { useState, useEffect, useRef } from 'react';

import { message, Tabs } from 'antd';
import { AuthWrapper, Headline, BreadCrumb, Const, cache } from 'qmkit';

import AccountDetail from './components/account-detail';
import SearchForm from './components/search-form';
import AccountList from './components/list';
import OperationModal from './components/operation-modal';
import DetailModal from './components/detail-modal';
import {
  fetchList,
  merchantGiveUser,
  queryCustomerWallet,
  getApplyDetail
} from './webapi';
const { TabPane } = Tabs;

function JinAccount(props) {
  const { location } = props;
  const [accountMoney, setMoney] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [visible, setVisible] = useState(false);
  const [isOrderReturn, setIsOrderReturn] = useState(false);
  const [currentData, setCurrentData] = useState({} as any);
  const [modalLoading, setModalLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentDetail, setDetail] = useState();
  const formRef = useRef(null);

  useEffect(() => {
    getList();
    getBalance();
    if (location && location.state && location.state.isOrderReturn) {
      setCurrentData(location.state.currentData);
      setIsOrderReturn(true);
      setVisible(true);
    }
  }, []);

  // 获取列表数据
  const getList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const values = formRef.current!.form.getFieldsValue();
    const params = {
      pageNum,
      pageSize,
      customerAccount: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
        .accountName,
      ...values
    };
    setLoading(true);
    const { res } = await fetchList(params);
    setLoading(false);
    if (res.code === Const.SUCCESS_CODE) {
      setList(res.context?.customerWalletVOList?.content || []);
      setPagination({
        current: pageNum + 1,
        pageSize,
        total: res.context?.customerWalletVOList?.total
      });
    } else if (res) {
      message.error(res.message || '');
    }
  };

  // 获取账户余额
  const getBalance = async () => {
    const params = {
      storeFlag: true,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId
    };
    const { res } = await queryCustomerWallet(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      setMoney(res.context?.balance || 0);
    } else {
      message.error(res.message || '');
    }
  };

  //鲸币赠送/收回提交
  const operationSubmit = async (values, callback) => {
    setModalLoading(true);
    const { res } = await merchantGiveUser(values);
    setModalLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      getList();
      getBalance();
      callback();
    } else {
      message.error(res.message || '');
    }
  };

  //查看详情
  const showDeail = async (info) => {
    if (info.relationOrderId) {
      const { res } = await getApplyDetail(info.relationOrderId);
      if (res && res.code === Const.SUCCESS_CODE) {
        setDetail(res.context);
        setDetailVisible(true);
      } else {
        message.error(res.message || '');
      }
    }
  };

  const closeModal = () => {
    setCurrentData({});
    setIsOrderReturn(false);
    setVisible(false);
  };
  return (
    <AuthWrapper functionName={'f_jinbi_account'}>
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="鲸币账户" />
          <Tabs defaultActiveKey="1">
            <TabPane tab="账户明细" key="1">
              <AccountDetail
                accountMoney={accountMoney}
                getList={getList}
                setVisible={setVisible}
              />
              <SearchForm wrappedComponentRef={formRef} getList={getList} />
              <AccountList
                list={list}
                pagination={pagination}
                loading={loading}
                getList={getList}
                showDeail={showDeail}
              />
            </TabPane>
          </Tabs>
        </div>
        <OperationModal
          visible={visible}
          getList={getList}
          modalLoading={modalLoading}
          closeModal={closeModal}
          currentData={currentData}
          isOrderReturn={isOrderReturn}
          operationSubmit={operationSubmit}
        />
        <DetailModal
          detailVisible={detailVisible}
          currentDetail={currentDetail}
          setDetailVisible={setDetailVisible}
        />
      </div>
    </AuthWrapper>
  );
}

export default JinAccount;
