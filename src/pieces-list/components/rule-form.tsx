import React from 'react';

import { Form, Alert, InputNumber, Button, Row, Tabs } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { noop } from 'qmkit';

const { TabPane } = Tabs;
const FormItem = Form.Item;

@Relax
export default class Rule extends React.Component<any, any> {
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(RuleForm as any);
  }

  props: {
    relaxProps?: {
      ruleTabList: IList;
      currentRultTab: string | number;
      currentTabChange: Function;
      saveRule: Function;
    };
  };

  static relaxProps = {
    ruleTabList: 'ruleTabList',
    currentRultTab: 'currentRultTab',
    currentTabChange: noop,
    saveRule: noop
  };

  render() {
    const WrapperForm = this.WrapperForm;
    const {
      ruleTabList,
      currentRultTab,
      currentTabChange
    } = this.props.relaxProps;
    return (
      <div style={{ height: 'calc(100vh - 330px)' }}>
        <Alert
          message=""
          description={
            <div>
              <p>操作说明</p>
              <p>
                1、商家可根据自己的实际情况设置乡镇件的免费店配门槛和乡镇件地址指定
              </p>
              <p>
                2、设置成功后，用户下单若收货地址在指定的“乡镇件地址”范围内，且单笔订单满足所设定的件数后，则可以享受免费店配配送方式
              </p>
            </div>
          }
          type="info"
        />
        <Tabs
          activeKey={currentRultTab ? currentRultTab.toString() : ''}
          onChange={(activeKey) => currentTabChange(activeKey)}
        >
          {ruleTabList.toJS().map((item) => {
            return (
              <TabPane tab={item.wareName} key={item.wareId.toString()}>
                <WrapperForm relaxProps={this.props.relaxProps} />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

class RuleForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      ruleTabList: IList;
      currentRultTab: any;
      saveRule: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { ruleTabList, currentRultTab } = this.props.relaxProps;
    let initNum = '';
    if (ruleTabList && ruleTabList.toJS()) {
      ruleTabList.toJS().forEach((item) => {
        if (item.wareId === currentRultTab) {
          initNum = item.freightFreeNumber;
        }
      });
    }

    return (
      <div>
        <Form layout="inline">
          <Row style={{ marginBottom: '12px' }}>
            <FormItem required label="单笔订单满足" colon={false}>
              <FormItem>
                {getFieldDecorator('freightFreeNumber', {
                  initialValue: initNum,
                  rules: [{ required: true, message: '请填写件数' }]
                })(<InputNumber step={1} precision={0} min={1} max={999} />)}
              </FormItem>
              <span style={{ color: '#000000d9' }}>
                件可享受乡镇件免费店配配送方式
              </span>
            </FormItem>
          </Row>
        </Form>
        <Button
          style={{ position: 'fixed', left: '275px', bottom: '100px' }}
          type="primary"
          onClick={this.save}
        >
          保存
        </Button>
      </div>
    );
  }

  //保存规则
  save = () => {
    const { form } = this.props;
    const { saveRule } = this.props.relaxProps;
    form.validateFields((errs, values) => {
      console.log(values);
      if (!errs) {
        const { ruleTabList, currentRultTab } = this.props.relaxProps;
        let currentData;
        ruleTabList.toJS().forEach((item) => {
          if (item.wareId === currentRultTab) {
            currentData = item;
          }
        });
        const params = {
          freightTemplateDeliveryAreaList: [
            {
              wareId: currentData.wareId,
              destinationType: 1,
              id: currentData.id,
              freightFreeNumber: values.freightFreeNumber,
              openFlag: 1
            }
          ]
        };
        saveRule(params);
      }
    });
  };
}
