import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  TreeSelect,
  Button,
  InputNumber,
  Row,
  Col,
  message,
  Spin
} from 'antd';
import { BreadCrumb, Headline, FindArea, history, Const, util } from 'qmkit';
import { getCateList, addLimit, fetchDetail, updeteLimit } from './webapi';
import GoodsModal from './components/goodsModal';
import './index.less';

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
};
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SaleArea = (props) => {
  const { form, location } = props;
  const { getFieldDecorator, getFieldValue, validateFieldsAndScroll } = form;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({} as any);
  const [type, setType] = useState('add');
  const [selectedGoods, setSelectedGoods] = useState([]);
  // 分类
  const [allCateList, setCateList] = useState([] as any);
  // 获取平台类目
  const getCateData = () => {
    getCateList().then((res) => {
      const cateList = res.res.context;
      setCateList(cateList);
    });
  };
  // 编辑初始化
  const init = async () => {
    if (location && location.state && location.state.goodsInfoId) {
      setType('edit');
      const { res } = await fetchDetail(location.state.goodsInfoId);
      if (res && res.code === Const.SUCCESS_CODE) {
        const data = res?.context || {};
        setEditData(data);
        setAllowedPurchaseAreaName(
          (data?.allowedPurchaseAreaName || []).split(',')
        );
        setSingleOrderAssignAreaName(
          (data?.singleOrderAssignAreaName || []).split(',')
        );
        setAllowedPurchaseArea((data?.allowedPurchaseArea || []).split(','));
        setSelectedGoods([
          {
            goodsInfoId: data.goodsInfoId,
            goodsInfoName: data.goodsInfoName,
            storeCateIds: data.storeCateIds || [],
            marketPrice: data.marketPrice,
            specText: data.goodsInfoSubtitle
          }
        ]);
      } else {
        message.error(res.message || '');
      }
    }
  };
  useEffect(() => {
    getCateData();
    init();
  }, []);
  // 指定区域树形选择组件参数
  const [regionTreeParams] = useState({
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '请选择可销售地区',
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
  useEffect(() => {
    buildFreeAreaData_singleOrderAssignAreaList();
  }, [allowedPurchaseArea]);
  // 删除商品
  const delGood = (goodsInfoId) => {
    const newData = selectedGoods.filter(
      (item) => item.goodsInfoId !== goodsInfoId
    );
    setSelectedGoods(newData);
  };
  const delAllGood = () => {
    setSelectedGoods([]);
  };
  // 保存
  const save = () => {
    if (type === 'add') {
      add();
    } else if (type === 'edit') {
      change();
    }
  };
  // 新增
  const add = () => {
    if (selectedGoods.length === 0) {
      message.error('请选择商品');
      return;
    }
    validateFieldsAndScroll(async (errs, values) => {
      if (errs) {
        return;
      }
      const params = {
        allowedPurchaseArea: values.allowedPurchaseArea.join(','),
        allowedPurchaseAreaName: allowedPurchaseAreaName.join(','),
        singleOrderAssignArea: values.singleOrderAssignArea.join(','),
        singleOrderAssignAreaName: singleOrderAssignAreaName.join(','),
        singleOrderPurchaseNum: values.singleOrderPurchaseNum,
        goodsInfoIds: selectedGoods.map((item) => item.goodsInfoId)
      };
      setLoading(true);
      const { res } = await addLimit(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('保存成功', () => {
          setLoading(false);
          history.push('/sale-area');
        });
      } else {
        setLoading(false);
        message.error(res.message || '');
      }
    });
  };
  // 修改
  const change = () => {
    validateFieldsAndScroll(async (errs, values) => {
      if (errs) {
        return;
      }
      const params = {
        allowedPurchaseArea: values.allowedPurchaseArea.join(','),
        allowedPurchaseAreaName: allowedPurchaseAreaName.join(','),
        singleOrderAssignArea: values.singleOrderAssignArea.join(','),
        singleOrderAssignAreaName: singleOrderAssignAreaName.join(','),
        singleOrderPurchaseNum: values.singleOrderPurchaseNum,
        goodsInfoId: editData.goodsInfoId
      };
      setLoading(true);
      const { res } = await updeteLimit(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('保存成功', () => {
          setLoading(false);
          history.push('/sale-area');
        });
      } else {
        setLoading(false);
        message.error(res.message || '');
      }
    });
  };
  const columns = [
    {
      title: '商品名称',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoName',
      key: 'goodsInfoName'
    },
    {
      title: '规格',
      align: 'center' as 'center',
      dataIndex: 'specText',
      key: 'specText',
      render: (text, row: any) => {
        if (util.isThirdStore() && type === 'add') {
          const result = [];
          row.goodsAttributeKeys?.forEach((item) => {
            result.push(item.goodsAttributeValue);
          });
          return result.join('-');
        } else if (text) {
          return text;
        } else {
          return '-';
        }
      }
    },
    {
      title: '分类',
      width: 200,
      align: 'center' as 'center',
      dataIndex: 'storeCateIds',
      key: 'storeCateIds',
      render: (storeCateIds) => {
        const cateName = [];
        allCateList.forEach((item) => {
          if (storeCateIds.includes(item.storeCateId)) {
            cateName.push(item.cateName);
          }
        });
        return cateName.length ? cateName.join(',') : '-';
      }
    },
    {
      title: '销售价',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    }
  ] as any;
  if (type === 'add') {
    columns.push({
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        return (
          <Button type="link" onClick={() => delGood(record.goodsInfoId)}>
            移除
          </Button>
        );
      }
    });
  }
  return (
    <Spin spinning={loading} tip="保存中...">
      <BreadCrumb />
      <div className="container">
        <Headline title="添加限购商品" />
        <Form {...formLayout}>
          {type === 'add' && (
            <FormItem label="选择商品" required>
              <Button
                type="primary"
                icon="plus"
                onClick={() => setVisible(true)}
              >
                添加商品
              </Button>
              <Button onClick={delAllGood} style={{ marginLeft: 12 }}>
                全部清空
              </Button>
            </FormItem>
          )}
          {type === 'edit' && <FormItem label="已选商品"></FormItem>}
          <Row>
            <Col offset={3} span={21}>
              <Table
                rowKey={(record: any) => record.goodsInfoId}
                columns={columns}
                dataSource={selectedGoods}
                pagination={false}
                bordered
                style={{ marginBottom: 24 }}
              />
            </Col>
          </Row>

          <Form.Item label="商品可销售区域">
            {getFieldDecorator('allowedPurchaseArea', {
              rules: [{ required: true, message: '请选择商品可销售区域' }],
              initialValue:
                type === 'edit' && editData.allowedPurchaseArea
                  ? editData.allowedPurchaseArea.split(',')
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
                maxTagCount={15}
              />
            )}
          </Form.Item>
          <Form.Item label="商品限数量区域">
            {getFieldDecorator('singleOrderAssignArea', {
              initialValue:
                type === 'edit' && editData.singleOrderAssignArea
                  ? editData.singleOrderAssignArea.split(',')
                  : []
            })(
              <TreeSelect
                {...singleRegionTreeParams}
                allowClear
                treeData={singleAreaData}
                onChange={(value, label) => {
                  singleOrderchangeAreaect(value, label);
                }}
                maxTagCount={15}
                filterTreeNode={(input, treeNode) =>
                  treeNode.props.title
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
            )}
          </Form.Item>
          <Form.Item label="商品限购数量">
            {getFieldDecorator('singleOrderPurchaseNum', {
              rules: [
                {
                  required: getFieldValue('singleOrderAssignArea').length > 0,
                  message: '请输入商品限购数量'
                }
              ],
              initialValue:
                type === 'edit' ? editData.singleOrderPurchaseNum : ''
            })(
              <InputNumber
                placeholder="请输入商品限购数量"
                style={{ width: '100%' }}
                disabled={getFieldValue('singleOrderAssignArea').length === 0}
              />
            )}
          </Form.Item>
        </Form>
        <Row className="sale-form-footer">
          <Col offset={3} span={16}>
            <Button type="primary" onClick={save}>
              保存
            </Button>
            <Button onClick={() => history.push('/sale-area')}>返回</Button>
          </Col>
        </Row>
      </div>
      <GoodsModal
        visible={visible}
        setVisible={setVisible}
        selectedGoods={selectedGoods}
        setSelectedGoods={setSelectedGoods}
        allCateList={allCateList}
      />
    </Spin>
  );
};

const SaleAreaForm = Form.create()(SaleArea);
export default SaleAreaForm;
