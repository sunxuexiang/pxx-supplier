import React, { useEffect, useState } from 'react';
import { Tabs, message, Form, Switch, Button } from 'antd';
import { Const, BreadCrumb, Headline, AuthWrapper, util } from 'qmkit';
import { fetchInfo, saveInfo } from './webapi';

const { TabPane } = Tabs;
const FormItem = Form.Item;
function DeliveryToHome(props) {
  const { form } = props;
  const { getFieldDecorator } = form;
  const [tabList, setTabList] = useState([]);
  const [currentTab, setCurrnetTab] = useState('');
  const [loading, setLoading] = useState(false);

  // 1: 同城配送, 0: 快递到家
  let pageType = props.match.path === '/delivery-to-same-city' ? 1 : 0;
  const getInfo = async () => {
    const { res } = await fetchInfo(pageType);
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

  const pageName = ['快递到家(到付)', '同城配送(到付)'][pageType];

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title={pageName} />
        <AuthWrapper functionName="f_delivery_to_home_collect">
          <Tabs
            activeKey={currentTab.toString()}
            onChange={(activeKey) => setCurrnetTab(activeKey)}
          >
            {tabList.map((item) => {
              return (
                <TabPane tab={item.wareName} key={item.wareId.toString()}>
                  <div>
                    <Form layout="inline">
                      <FormItem label={`支持“${pageName}”配送方式`}>
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
      </div>
    </div>
  );
}

const DeliveryToHomeForm = Form.create()(DeliveryToHome);

export default DeliveryToHomeForm;
