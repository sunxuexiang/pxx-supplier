import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';
import { Card, Form, InputNumber, Switch, TreeSelect, message } from 'antd';
import { FindArea } from 'qmkit';
import '../add-product.less';

const RegionQuota = forwardRef((props: any, ref) => {
  const { getFieldDecorator } = props.form;
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  // 是否指定区域
  const [areaDesignated, setAreaDesignated] = useState(false);
  // 指定区域树形选择组件参数
  const [regionTreeParams] = useState({
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '请选择地区',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    style: {
      minWidth: 300
    }
  });
  // 单笔指定区域树形选择组件参数
  const [singleRegionTreeParams] = useState({
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '单用户指定限购区域',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    style: {
      minWidth: 300
    }
  });
  // 选择区域名称
  const [allowedPurchaseAreaName, setAllowedPurchaseAreaName] = useState([]);
  // 单笔指定区域销售允许选择地区
  const [allowedPurchaseArea, setAllowedPurchaseArea] = useState([]);
  // 单笔指定区域销售选择地区名称
  const [singleOrderAssignAreaName, setSingleOrderAssignAreaName] = useState(
    []
  );
  // 单笔限购区域数据
  const [singleAreaData, setSingleAreaData] = useState([]);
  const [editInfo, setInfo] = useState({} as any);
  useImperativeHandle(ref, () => ({
    regionQuotaSubmit
  }));
  // 编辑信息初始化处理
  useEffect(() => {
    if (props.openEdit) {
      const info = props.goodsDetail.goodsInfos[0];
      if (!info.allowedPurchaseArea && !info.allowedPurchaseAreaName) {
        setAreaDesignated(false);
      } else {
        setAreaDesignated(true);
      }
      const data = {
        allowedPurchaseArea: info.allowedPurchaseArea
          ? info.allowedPurchaseArea.split(',')
          : [],
        allowedPurchaseAreaName: info.allowedPurchaseAreaName
          ? info.allowedPurchaseAreaName.split(',')
          : [],
        singleOrderAssignArea: info.singleOrderAssignArea
          ? info.singleOrderAssignArea.split(',')
          : [],
        singleOrderAssignAreaName: info.singleOrderAssignAreaName
          ? info.singleOrderAssignAreaName.split(',')
          : [],
        singleOrderPurchaseNum: info.singleOrderPurchaseNum || ''
      };
      setInfo({ ...data });
      setAllowedPurchaseArea(data.allowedPurchaseArea);
    }
  }, [props.goodsDetail]);
  useEffect(() => {
    buildFreeAreaData_singleOrderAssignAreaList();
  }, [allowedPurchaseArea]);
  // 指定区域开关
  const onChange = (checked) => {
    setAreaDesignated(checked);
  };
  /**
   * 构建地区数据
   */
  const buildFreeAreaData = (id) => {
    return FindArea.findProvinceCity([]);
  };
  // 选择地区
  const changeAreaect = (value, label) => {
    setAllowedPurchaseAreaName([...label]);
    setAllowedPurchaseArea(value);
    buildFreeAreaData_singleOrderAssignAreaList('');
  };
  // 单笔限定区域选择
  const singleOrderchangeAreaect = (value, label) => {
    setSingleOrderAssignAreaName([...label]);
  };
  /**
   * 指定限购区域
   */
  const buildFreeAreaData_singleOrderAssignAreaList = (id = '') => {
    const allarea = allowedPurchaseArea;
    const Finlcity = FindArea.findProvinceCity([]);
    const allcityArray = [];
    if (allarea.length > 0) {
      Finlcity.forEach((finel) => {
        allarea.forEach((areael) => {
          if (areael == finel.key) {
            allcityArray.push(finel);
          } else {
            if (finel.children) {
              finel.children.forEach((chilel) => {
                if (areael == chilel.key) {
                  allcityArray.push(chilel);
                }
              });
            }
          }
        });
      });
    }
    setSingleAreaData(allcityArray);
    // return allcityArray;
  };
  // 区域限购提交
  const regionQuotaSubmit = async () => {
    const info = await props.form.validateFieldsAndScroll();
    console.warn(info);
    if (info.errors) {
      message.error('请填写正确的商品区域限购信息');
      return false;
    } else {
      const data = {
        allowedPurchaseArea: areaDesignated
          ? info.allowedPurchaseArea.join(',')
          : '',
        allowedPurchaseAreaName: areaDesignated
          ? allowedPurchaseAreaName.join(',')
          : '',
        singleOrderAssignArea: areaDesignated
          ? info.singleOrderAssignArea.join(',')
          : '',
        singleOrderAssignAreaName: areaDesignated
          ? singleOrderAssignAreaName.join(',')
          : '',
        singleOrderPurchaseNum: areaDesignated
          ? info.singleOrderPurchaseNum
          : ''
      };
      return data;
    }
  };
  return (
    <div className="new-product-card">
      <Card title="区域限购" headStyle={{ color: '#F56C1D' }} bordered={false}>
        <Form
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          <Form.Item label="指定区域销售">
            <Switch
              defaultChecked
              checked={areaDesignated}
              onChange={onChange}
            />
          </Form.Item>
          {areaDesignated && (
            <div>
              <Form.Item label="请选择区域">
                {getFieldDecorator('allowedPurchaseArea', {
                  rules: [{ required: areaDesignated, message: '请选择区域' }],
                  initialValue: props.openEdit
                    ? editInfo.allowedPurchaseArea
                    : []
                })(
                  <TreeSelect
                    {...regionTreeParams}
                    treeData={buildFreeAreaData('')}
                    onChange={(value, label) => {
                      changeAreaect(value, label);
                    }}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="单用户指定限购区域">
                {getFieldDecorator('singleOrderAssignArea', {
                  initialValue: props.openEdit
                    ? editInfo.singleOrderAssignArea
                    : []
                })(
                  <TreeSelect
                    {...singleRegionTreeParams}
                    allowClear
                    treeData={singleAreaData}
                    onChange={(value, label) => {
                      singleOrderchangeAreaect(value, label);
                    }}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="单用户限购数量">
                {getFieldDecorator('singleOrderPurchaseNum', {
                  rules: [
                    {
                      required:
                        props.form.getFieldValue('singleOrderAssignArea')
                          .length > 0,
                      message: '请输入单用户限购数量'
                    }
                  ],
                  initialValue: props.openEdit
                    ? editInfo.singleOrderPurchaseNum
                    : ''
                })(
                  <InputNumber
                    placeholder="请输入单用户限购数量"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
});
const RegionQuotaTemplate = Form.create()(RegionQuota);
export default RegionQuotaTemplate;
