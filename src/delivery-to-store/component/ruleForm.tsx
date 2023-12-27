import React, { useEffect, useState } from 'react';
import {
  Alert,
  Tabs,
  message,
  Form,
  Switch,
  Button,
  Row,
  TreeSelect
} from 'antd';
import { Const, FindArea } from 'qmkit';
import { fetchRuleInfo, saveInfo } from '../webapi';

const { TabPane } = Tabs;
const FormItem = Form.Item;

function Rule(props) {
  const { form } = props;
  const { getFieldDecorator } = form;
  const [tabList, setTabList] = useState([]);
  const [currentTab, setCurrnetTab] = useState('');
  const [loading, setLoading] = useState(false);

  const _transformInfoData = (datas) => {
    let dataArray = [];
    for (const item of datas) {
      const tmpArr = dataArray[item.wareId];
      if (tmpArr) {
        tmpArr.items.push({ ...item });
      } else {
        dataArray[item.wareId] = {
          wareId: item.wareId,
          wareName: item.wareName,
          items: [{ ...item }]
        };
      }
    }
    dataArray = dataArray.filter(Boolean);
    return dataArray;
  };

  const getInfo = async () => {
    const { res } = await fetchRuleInfo();
    if (res && res.code === Const.SUCCESS_CODE) {
      const dataArray = _transformInfoData(res.context);
      setTabList(dataArray);
      if (dataArray.length > 0) {
        setCurrnetTab(dataArray[0].wareId);
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
        const findItem = tabList.filter(
          (item) => item.wareId === currentTab
        )[0];
        const flagItem = findItem.items.filter(
          (item) => item.destinationType == 5
        )[0];
        params = {
          ...flagItem,
          openFlag: values.openFlag ? 1 : 0
        };
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

  const tProps = {
    treeCheckable: true,
    labelInValue: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    searchPlaceholder: '请选择地区',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    style: {
      minWidth: 300
    }
  };

  const _item5Render = (item) => {
    return (
      <div key={item.id}>
        <FormItem label="支持“配送到店(收费)”配送方式">
          {getFieldDecorator('openFlag', {
            initialValue: item.openFlag === 1,
            valuePropName: 'checked',
            rules: [{ required: true, message: '请选择' }]
          })(<Switch />)}
        </FormItem>
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
  };

  const _item6Render = (item) => {
    const destinationAreaVal = [];
    (item.destinationArea || []).forEach((areaItem, index) => {
      destinationAreaVal.push({
        label: item.destinationAreaName[index],
        value: areaItem
      });
    });
    console.warn('===这里', item);
    return (
      <FormItem
        label={`单笔订单满足 ${item.freightFreeNumber} 件起配覆盖区域:`}
        key={item.id}
      >
        {getFieldDecorator('destinationArea', {
          initialValue: destinationAreaVal,
          rules: [{ required: true, message: '请选择覆盖区域' }]
        })(<TreeSelect {...tProps} disabled />)}
      </FormItem>
    );
  };

  const _item7Render = (item) => {
    const streetInitValue = [];
    (item.destinationArea || []).forEach((areaItem, index) => {
      streetInitValue.push({
        label: item.destinationAreaName[index],
        value: areaItem
      });
    });

    return (
      <FormItem
        label={`乡镇件满足 ${item.freightFreeNumber} 件起配覆盖区域:`}
        key={item.id}
      >
        {getFieldDecorator('destinationStreet', {
          initialValue: streetInitValue,
          rules: [{ required: true, message: '请选择乡镇件覆盖区域' }]
        })(
          <TreeSelect
            {...tProps}
            disabled
            filterTreeNode={(input, treeNode) =>
              treeNode.props.title.toLowerCase().indexOf(input.toLowerCase()) >=
              0
            }
          />
        )}
      </FormItem>
    );
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 }
    }
  };

  return (
    <div>
      <Alert
        message=""
        description={
          <div>
            <p>若开启，则用户在下单时可使用该配送服务，且遵循平台制定的规则</p>
            <p>若关闭，则用户在下单时该配送方式可见不可选</p>
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
              <Form {...formItemLayout}>
                {item.items.map((subItem) => {
                  if (subItem.destinationType == 5) {
                    return _item5Render(subItem);
                  } else if (subItem.destinationType == 6) {
                    return _item6Render(subItem);
                  } else if (subItem.destinationType == 7) {
                    return _item7Render(subItem);
                  }
                })}
              </Form>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

const RuleForm = Form.create()(Rule);
export default RuleForm;
