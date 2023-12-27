import React, {
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  forwardRef
} from 'react';
import { Headline, BreadCrumb, AuthWrapper, Const } from 'qmkit';
import {
  Alert,
  Form,
  Switch,
  InputNumber,
  Tabs,
  Row,
  Button,
  message
} from 'antd';
import { fetchRuleInfo, saveRuleInfo, checkSaveRuleInfo } from './webapi';
import SelfList from './component/selfList';
import './index.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const SelfPickup = (props) => {
  const formRef = useRef(null);
  const [tabList, setTabList] = useState([]);
  const [currentTab, setCurrnetTab] = useState('');
  const getInfo = async () => {
    const { res } = await fetchRuleInfo();
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

  // useEffect(() => {
  //   getInfo();
  // }, []);
  return (
    // <div>
    //   <BreadCrumb />
    //   <div className="container">
    //     <Headline title="自提" />
    //     <AuthWrapper functionName="f_self_pickup">
    //       <Tabs
    //         activeKey={currentTab.toString()}
    //         onChange={(activeKey) => setCurrnetTab(activeKey)}
    //       >
    //         {tabList.map((item) => {
    //           return (
    //             <TabPane tab={item.wareName} key={item.wareId.toString()}>
    //               <Tabs defaultActiveKey="0">
    //                 <TabPane tab="规则设置" key="0">
    //                   <Alert
    //                     message={
    //                       <div>
    //                         <p>操作说明:</p>
    //                         <p>1、可根据实际情况设置自提规则</p>
    //                         <p>
    //                           2、设置成功后，用户下单满足设定的件数，则可以享受自提的服务
    //                         </p>
    //                         <p>
    //                           3、用户在当天00:00:00至06:59:59下单并支付可当天07点之后提货
    //                         </p>
    //                         <p>
    //                           4、当天07:00:00至23:59:59下单并支付可在次日07点之后提货
    //                         </p>
    //                       </div>
    //                     }
    //                     type="info"
    //                   />
    //                   <SelfPickupForm
    //                     tabList={tabList}
    //                     currentTab={currentTab}
    //                     wrappedComponentRef={formRef}
    //                   />
    //                 </TabPane>
    //                 <TabPane forceRender tab="自提点列表" key="1">
    //                   <SelfList formRef={formRef} />
    //                 </TabPane>
    //               </Tabs>
    //             </TabPane>
    //           );
    //         })}
    //       </Tabs>
    //     </AuthWrapper>
    //   </div>
    // </div>
    <div>
      <SelfList formRef={formRef} />
    </div>
  );
};
export default SelfPickup;

const tabContent = forwardRef((props: any, ref) => {
  const { form, tabList, currentTab } = props;
  const { getFieldDecorator } = form;
  useImperativeHandle(ref, () => ({
    save,
    form
  }));
  const [loading, setLoading] = useState(false);
  let currentData;
  tabList.forEach((item) => {
    if (item.wareId === currentTab) {
      currentData = item;
    }
  });
  console.log(currentData, 'currentData');
  //保存规则
  const save = async () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const params = {
          freightTemplateDeliveryAreaList: [
            {
              wareId: currentData.wareId,
              destinationType: 3,
              id: currentData.id,
              freightFreeNumber: 1, //values.freightFreeNumber,
              openFlag: values.openFlag ? 1 : 0
            }
          ]
        };
        if (values.openFlag) {
          // 开关为打开时 保存需校验
          const checkRes = await checkSaveRuleInfo();
          if (!(checkRes && checkRes.res && checkRes.res.context)) {
            message.error('必需添加一个启用中的自提点');
            form.setFieldsValue({ openFlag: false });
            return;
          }
        }

        setLoading(true);
        const { res } = await saveRuleInfo(params);
        setLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
        } else {
          message.error(res.message || '');
        }
      }
    });
  };
  return (
    <div>
      <Form layout="inline" className="self-pickup-form">
        <Row>
          <FormItem label="支持“上门自提”配送方式">
            {getFieldDecorator('openFlag', {
              valuePropName: 'checked',
              initialValue: currentData.openFlag === 1,
              rules: [
                { required: true, message: '请选择支持“上门自提”配送方式' }
              ]
            })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
          </FormItem>
        </Row>
        {/* <Row>
          <FormItem label="单笔订单满足">
            {getFieldDecorator('freightFreeNumber', {
              initialValue: currentData.freightFreeNumber || 1,
              rules: [{ required: true, message: '请填写件数' }]
            })(<InputNumber step={1} precision={0} min={1} />)}
            <span style={{ marginLeft: '8px' }}>
              件可使用“上门自提”配送方式
            </span>
          </FormItem>
        </Row> */}
      </Form>
      <Button
        style={{ position: 'fixed', left: '291px', bottom: '100px' }}
        type="primary"
        loading={loading}
        onClick={save}
      >
        保存
      </Button>
    </div>
  );
});

const SelfPickupForm = Form.create<any>()(tabContent);
