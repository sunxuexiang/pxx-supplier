import React, { useEffect, useState } from 'react';
import { Alert, Tabs, message, Form, Switch, Button } from 'antd';
import { Const, BreadCrumb, Headline, AuthWrapper, util } from 'qmkit';
import { fetchInfo, saveInfo } from './webapi';
import FreightTemplate from '../freight';
// import FreightSameCityTemplate from '../freight/same-city-index';

/**
 * 快递到家与同城配送主页
 */

const { TabPane } = Tabs;
const FormItem = Form.Item;
function DeliveryToHome(props) {
  const { form, location } = props;
  const { getFieldDecorator } = form;
  const [mainTab, setMainTab] = useState('1');
  const [tabList, setTabList] = useState([]);
  const [currentTab, setCurrnetTab] = useState('');
  const [loading, setLoading] = useState(false);

  // 1: 同城配送, 0: 快递到家  2023/10/23 同城配送改为同城配送(到付) 没有运费模板了 所以同城配送挪到delivery-to-home-collect页面
  // let pageType = props.match.path === '/delivery-to-same-city' ? 1 : 0;
  const getInfo = async () => {
    // const { res } = await fetchInfo(pageType);
    const { res } = await fetchInfo();
    if (res && res.code === Const.SUCCESS_CODE) {
      const warePage = JSON.parse(localStorage.getItem('warePage'));
      const newTabList = [];
      warePage.forEach((item) => {
        res.context.forEach((cd) => {
          if (item.wareId === cd.wareId) {
            newTabList.push(cd);
          }
        });
      });
      if (newTabList.length > 0) {
        setCurrnetTab(newTabList[0].wareId);
        setTabList(newTabList);
      }
    } else {
      message.error(res.message || '');
    }
  };

  useEffect(() => {
    getInfo();
    if (location.state && location.state.type === 'temp') {
      setMainTab('2');
    }
  }, []);

  // 保存
  const save = () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        let params = {} as any;
        tabList.forEach((item) => {
          if (item.wareId === currentTab) {
            params = item;
          }
        });
        params.openFlag = values.openFlag ? 1 : 0;
        setLoading(true);
        const { res } = await saveInfo({
          freightTemplateDeliveryAreaList: [params]
        });
        setLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  // const pageName = ['快递到家', '同城配送'][pageType];

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        {/* <Headline title={`${pageName}`} /> */}
        <Headline title="快递到家(自费)" />
        <Tabs
          activeKey={mainTab}
          onChange={(activeKey) => setMainTab(activeKey)}
        >
          <TabPane tab="规则配置" key="1">
            <AuthWrapper functionName="f_delivery_to_home">
              <Alert
                message=""
                description={
                  <div>
                    <p>可根据实际情况设置该配送方式规则</p>
                    <p>若开启，则用户在下单时可使用该配送服务</p>
                  </div>
                }
                type="info"
              />
              <Tabs
                activeKey={currentTab.toString()}
                onChange={(activeKey) => setCurrnetTab(activeKey)}
              >
                {tabList.map((item) => {
                  return (
                    <TabPane tab={item.wareName} key={item.wareId.toString()}>
                      <div>
                        <Form layout="inline">
                          {/* <FormItem label={`支持“${pageName}(到付)”配送方式`}> */}
                          <FormItem label="支持快递到家(到付)配送方式">
                            {getFieldDecorator('openFlag', {
                              initialValue: item.openFlag === 1,
                              valuePropName: 'checked',
                              rules: [{ required: true, message: '请选择' }]
                            })(<Switch />)}
                          </FormItem>
                        </Form>
                        <Button
                          style={{
                            position: 'fixed',
                            left: '291px',
                            bottom: '100px'
                          }}
                          type="primary"
                          loading={loading}
                          onClick={save}
                        >
                          保存
                        </Button>
                      </div>
                    </TabPane>
                  );
                })}
              </Tabs>
            </AuthWrapper>
          </TabPane>
          <TabPane tab="运费模板" key="2">
            <FreightTemplate location={location} />
            {/* {pageType === 0 && <FreightTemplate location={location}/>} */}
            {/* {pageType === 1 && <FreightSameCityTemplate location={location} />} */}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

const DeliveryToHomeForm = Form.create()(DeliveryToHome);

export default DeliveryToHomeForm;
