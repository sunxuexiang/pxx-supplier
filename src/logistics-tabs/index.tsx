import React, { useState, useEffect } from 'react';
import { Alert, Breadcrumb, Tabs } from 'antd';
import { Headline, AuthWrapper, Const, cache } from 'qmkit';
import LogisticsCompany from '../logistics-company';
import DeliveryToStore from '../delivery-to-store';
// import FreightTemplate from '../freight';
import HomeDeliverySelf from './components/home-delivery-self';
import SelfPick from '../self-pickup';
import { getLogisticsDistributionText } from './webapi';
import './index.less';

// res.context.deliveryTypeList
// @ApiEnumProperty("2: 托运部")
// @ApiEnumProperty("3: 上门自提/自提")
// @ApiEnumProperty("4: 收费快递/快递到家(自费)(老)")
// @ApiEnumProperty("5: 配送到店(自费)")
// @ApiEnumProperty("8: 指定物流")
// @ApiEnumProperty("9: 同城配送(到付)")
// @ApiEnumProperty("10: 快递到家(到付)")
// @ApiEnumProperty("11: 快递到家(自费)")

// tab和deliveryTypeList映射
const tabObj = {
  '1': 5, // 配送到店
  '2': 2, // 托运部
  '3': 8, // 指定专线
  '4': 11, // 快递到家（自费）
  '5': 10, // 快递到家（到付）
  '6': 3, // 自提
  '7': 9 // 同城配送
};

const { TabPane } = Tabs;
const LogisticsTabs = (props) => {
  const { location } = props;
  const deliveryTypeList = sessionStorage.getItem(cache.LOGIN_DATA)
    ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).deliveryTypeList
    : [];
  const [activeKey, setKey] = useState(() => {
    let result = '1';
    for (let key of Object.keys(tabObj)) {
      if (deliveryTypeList.includes(tabObj[key])) {
        result = key;
        break;
      }
    }
    return result;
  });
  const [logisticsMap, setLogisticsMap] = useState<{ [prop: string]: any }>({});
  useEffect(() => {
    if (location.state && location.state.mainTab) {
      setKey(location.state.mainTab);
    }
  }, []);

  // Tab和menuId请求映射
  const menuIdObj = {
    '1': '7', // 配送到店
    '2': '1', // 托运部
    '3': '8', // 指定专线
    '4': '11', // 快递到家（自费）
    '5': '10', // 到底到家（到付）
    '6': '6', // 自提
    '7': '9' // 同城配送
  };

  useEffect(() => {
    const menuId = menuIdObj[activeKey];
    _logisticsText(menuId);
  }, [activeKey]);

  const _logisticsText = async (menuId) => {
    const { res } = await getLogisticsDistributionText(menuId);
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context) {
        setLogisticsMap({
          activeKey: res.context
        });
      }
    }
  };

  const getDeliveryWayDescById = (id) => {
    const allDeliveryWay = sessionStorage.getItem(cache.DELIVERYWAY)
      ? JSON.parse(sessionStorage.getItem(cache.DELIVERYWAY))
      : [];
    let result = '';
    allDeliveryWay.forEach((item) => {
      if (item.deliveryTypeId === id) {
        result = item.deliverWayDesc;
        return;
      }
    });
    return result;
  };
  return (
    <div>
      <Breadcrumb />
      <div className="container">
        <Headline title="物流配送方式" />
        <Tabs activeKey={activeKey} onChange={(key) => setKey(key)}>
          {deliveryTypeList.includes(5) && (
            <TabPane tab={getDeliveryWayDescById(7)} key="1">
              <AuthWrapper functionName={'f_delivery_to_store_tabs'}>
                {logisticsMap.activeKey ? (
                  <Alert
                    style={{ whiteSpace: 'pre-wrap' }}
                    message={logisticsMap.activeKey}
                    type="info"
                    showIcon
                  />
                ) : null}
                <DeliveryToStore />
              </AuthWrapper>
            </TabPane>
          )}

          {deliveryTypeList.includes(2) && (
            <TabPane tab={getDeliveryWayDescById(1)} key="2">
              <AuthWrapper functionName={'f_logistics_company_tabs'}>
                {logisticsMap.activeKey ? (
                  <Alert
                    style={{ whiteSpace: 'pre-wrap' }}
                    message={logisticsMap.activeKey}
                    type="info"
                    showIcon
                  />
                ) : null}
                <LogisticsCompany urlType={0} />
              </AuthWrapper>
            </TabPane>
          )}

          {deliveryTypeList.includes(8) && (
            <TabPane tab={getDeliveryWayDescById(8)} key="3">
              <AuthWrapper functionName={'f_appoint_company_tabs'}>
                {logisticsMap.activeKey ? (
                  <Alert
                    style={{ whiteSpace: 'pre-wrap' }}
                    message={logisticsMap.activeKey}
                    type="info"
                    showIcon
                  />
                ) : null}
                {/* <LogisticsCompany urlType={1} /> */}
              </AuthWrapper>
            </TabPane>
          )}

          {deliveryTypeList.includes(11) && (
            <TabPane tab={getDeliveryWayDescById(11)} key="4">
              <AuthWrapper functionName={'f_homeDeliverySelf_tabs'}>
                {logisticsMap.activeKey ? (
                  <Alert
                    style={{ whiteSpace: 'pre-wrap' }}
                    message={
                      <div>
                        {logisticsMap.activeKey}
                        {/* <div>
                          请先设置运费计算模式，选择单品运费时订单运费使用每件商品的运费叠加{' '}
                          <a onClick={() => history.push('/freight-instruction')}>
                            查看计算公式
                          </a>{' '}
                          ，
                          选择店铺运费则商品选择的单品运费模板不生效，按照订单金额收取统一运费；
                        </div> */}
                      </div>
                    }
                    type="info"
                    showIcon
                  />
                ) : null}
                {/* <FreightTemplate location={location} /> */}
                <HomeDeliverySelf activeKey={activeKey} />
              </AuthWrapper>
            </TabPane>
          )}

          {deliveryTypeList.includes(10) && (
            <TabPane tab={getDeliveryWayDescById(10)} key="5">
              {logisticsMap.activeKey ? (
                <Alert
                  style={{ whiteSpace: 'pre-wrap' }}
                  message={logisticsMap.activeKey}
                  type="info"
                  showIcon
                />
              ) : null}
            </TabPane>
          )}

          {deliveryTypeList.includes(9) && (
            <TabPane tab={getDeliveryWayDescById(9)} key="7">
              {logisticsMap.activeKey ? (
                <Alert
                  style={{ whiteSpace: 'pre-wrap' }}
                  message={logisticsMap.activeKey}
                  type="info"
                  showIcon
                />
              ) : null}
            </TabPane>
          )}

          {deliveryTypeList.includes(3) && (
            <TabPane tab={getDeliveryWayDescById(6)} key="6">
              <AuthWrapper functionName={'f_self_pickup_tabs'}>
                {logisticsMap.activeKey ? (
                  <Alert
                    style={{ whiteSpace: 'pre-wrap' }}
                    message={logisticsMap.activeKey}
                    type="info"
                    showIcon
                  />
                ) : null}
                <SelfPick />
              </AuthWrapper>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default LogisticsTabs;
