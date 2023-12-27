import React from 'react';

import {
  Form,
  Alert,
  Switch,
  InputNumber,
  Button,
  Row,
  TreeSelect,
  Tabs
} from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { FindArea, noop, AuthWrapper, cache } from 'qmkit';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const allProvinceData = FindArea.findProvinceCity([]).map((item) => {
  return { label: item.label, value: item.value };
});

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
      openSyncRule: Function;
      urlType: number;
    };
  };

  static relaxProps = {
    ruleTabList: 'ruleTabList',
    currentRultTab: 'currentRultTab',
    currentTabChange: noop,
    saveRule: noop,
    openSyncRule: noop,
    urlType: 'urlType'
  };

  render() {
    const WrapperForm = this.WrapperForm;
    const {
      ruleTabList,
      currentRultTab,
      currentTabChange,
      urlType
    } = this.props.relaxProps;
    const name = ['托运部', '指定专线'][urlType];
    return (
      <div style={{ height: 'calc(100vh - 330px)' }}>
        <Alert
          message=""
          description={
            <div>
              <p>操作说明</p>
              <p>
                1、启用该配送方式后，那么在用户下单时就可以选择该配送方式进行下单
              </p>
              <p>
                2、设置成功后，用户下单满足设定的件数且收货地址在设定的区域内，则可以享受“
                {name}”的服务
              </p>
              <p>3、用户可选择的{name}为商家自己提供的物流公司</p>
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
      openSyncRule: Function;
      urlType: number;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      ruleTabList,
      currentRultTab,
      openSyncRule,
      urlType
    } = this.props.relaxProps;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const tProps = {
      treeCheckable: true,
      labelInValue: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择地区',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      treeDefaultExpandedKeys: ['all'],
      style: {
        minWidth: 300
      }
    };
    let currentData;
    ruleTabList.toJS().forEach((item) => {
      if (item.wareId === currentRultTab) {
        currentData = item;
      }
    });
    const destinationAreaVal = [];
    if (currentData.destinationArea) {
      if (this._checkIsAll(currentData.destinationArea)) {
        destinationAreaVal.push({ label: '全部', value: 'all' });
      } else {
        currentData.destinationArea.forEach((item, index) => {
          destinationAreaVal.push({
            label: currentData.destinationAreaName[index],
            value: item
          });
        });
      }
    }

    const name = ['托运部', '指定专线'][urlType];

    return (
      <div>
        <Form layout="inline">
          <Row style={{ marginBottom: '12px' }}>
            <FormItem label={`支持${name}配送方式`}>
              {getFieldDecorator('openFlag', {
                valuePropName: 'checked',
                initialValue: currentData.openFlag === 1,
                rules: [
                  { required: true, message: `请选择支持${name}配送方式` }
                ]
              })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
            </FormItem>
          </Row>
          <Row style={{ marginBottom: '12px' }}>
            <FormItem required label="单笔订单满足" colon={false}>
              <FormItem>
                {getFieldDecorator('freightFreeNumber', {
                  initialValue: currentData.freightFreeNumber || '',
                  rules: [{ required: true, message: '请填写件数' }]
                })(
                  <InputNumber
                    step={1}
                    precision={0}
                    min={1}
                    max={999}
                    disabled
                  />
                )}
              </FormItem>
              <span style={{ color: '#000000d9' }}>
                {`件可使用“${name}”配送方式`}
              </span>
            </FormItem>
          </Row>
          <Row>
            <FormItem label={`“${name}”覆盖区域`}>
              {getFieldDecorator('destinationArea', {
                initialValue: destinationAreaVal,
                rules: [{ required: true, message: `请选择“${name}”覆盖区域` }]
              })(
                <TreeSelect
                  {...tProps}
                  treeData={this._buildFreeAreaData('')}
                  filterTreeNode={(input, treeNode) =>
                    treeNode.props.title
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                />
              )}
            </FormItem>
          </Row>
        </Form>
        <AuthWrapper functionName={'f_logistics_company_edit'}>
          <Button
            style={{ position: 'fixed', left: '275px', bottom: '100px' }}
            type="primary"
            onClick={this.save}
          >
            保存
          </Button>
          {/* 只有 喜吖吖自营 这一个商家有此同步按钮 */}
          {loginInfo && loginInfo.storeId === 123457929 && (
            <Button
              style={{ position: 'fixed', left: '350px', bottom: '100px' }}
              type="primary"
              onClick={() => openSyncRule()}
            >
              同步设置
            </Button>
          )}
        </AuthWrapper>
      </div>
    );
  }
  /**
   * 构建包邮地区数据
   */
  _buildFreeAreaData = (id) => {
    const treeData = [
      {
        label: '全部',
        value: 'all',
        key: 'all',
        children: FindArea.findProvinceCity([])
      }
    ];
    return treeData;
  };

  // 判断数据是否全选
  _checkIsAll = (value) => {
    let flag = true;
    allProvinceData.forEach((item) => {
      if (!value.includes(item.value)) {
        flag = false;
        return;
      }
    });
    return flag;
  };

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
        const destinationArea = [];
        const destinationAreaName = [];
        let destinationAreaData = values.destinationArea;
        if (
          values.destinationArea.length === 1 &&
          values.destinationArea[0].value === 'all'
        ) {
          destinationAreaData = allProvinceData;
        }
        destinationAreaData.forEach((item) => {
          destinationArea.push(item.value);
          destinationAreaName.push(item.label);
        });
        const params = {
          freightTemplateDeliveryAreaList: [
            {
              wareId: currentData.wareId,
              destinationType: currentData.destinationType,
              id: currentData.id,
              destinationArea,
              destinationAreaName,
              // freightFreeNumber: values.freightFreeNumber,
              freightFreeNumber: 1,
              openFlag: values.openFlag ? 1 : 0
            }
          ]
        };
        saveRule(params);
      }
    });
  };
}
