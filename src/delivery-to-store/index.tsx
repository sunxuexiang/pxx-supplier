import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { BreadCrumb, Headline, AuthWrapper, cache } from 'qmkit';
import { fetchCarrierInfo } from './webapi';

import RuleForm from './component/ruleForm';
import PlateRule from './component/plateRule';
import CarrierInfo from './component/carrierInfo';

const { TabPane } = Tabs;
export default function DeliveryToStore() {
  const [carrierName, setName] = useState('');
  const [list, setList] = useState([]);
  const [freight, setFreight] = useState('');
  const getList = async () => {
    const storeId = sessionStorage.getItem(cache.LOGIN_DATA)
      ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))?.storeId
      : '';
    if (storeId) {
      const { res }: any = await fetchCarrierInfo(storeId);
      if (res) {
        setName(res.carrierName || '');
        setList(res.sites || []);
        (res.freights || []).forEach((item) => {
          if (item.status === 1 && item.type === 1) {
            setFreight(item || '');
            return;
          }
        });
      }
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    // <div>
    //   <BreadCrumb />
    //   <div className="container">
    //     <Headline title="配送到店" />
    //     <AuthWrapper functionName="f_delivery_to_store">
    //       <Tabs defaultActiveKey="1">
    //         <TabPane tab="规则配置" key="1">
    //           <RuleForm />
    //         </TabPane>
    //         <TabPane tab="运费模板" key="2">
    //           <PlateRule freight={freight} carrierName={carrierName} />
    //         </TabPane>
    //         <TabPane tab="承运商信息" key="3">
    //           <CarrierInfo carrierName={carrierName} list={list} />
    //         </TabPane>
    //       </Tabs>
    //     </AuthWrapper>
    //   </div>
    // </div>
    <div>
      <Tabs defaultActiveKey="2">
        <TabPane tab="运费模板" key="2">
          <PlateRule freight={freight} carrierName={carrierName} />
        </TabPane>
        <TabPane tab="承运商信息" key="3">
          <CarrierInfo carrierName={carrierName} list={list} />
        </TabPane>
      </Tabs>
    </div>
  );
}
