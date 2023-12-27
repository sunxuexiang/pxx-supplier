import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Tag,
  Button,
  Table,
  Popconfirm,
  InputNumber,
  message,
  Icon
} from 'antd';
import '../add-product.less';
import lodash, { divide } from 'lodash';
import { PhotoGallery, Const, cache, ValidConst } from 'qmkit';
import { getGoodsAttr, createTableByAttr, getGoodsUnit } from '../webapi';
// import PhotoGallery from './photo-gallery/photo-gallery';

const ProductAttribute = forwardRef((props: any, ref) => {
  useImperativeHandle(ref, () => ({
    // form: props.form,
    attrFormSubmit,
    cancelMainSku
  }));
  const { getFieldDecorator, setFieldsValue } = props.form;
  // 所有商品属性
  const [attributeList, setAllAttrList] = useState([]);
  // 根据已选择属性生成的列表
  const [checkedAttrList, setCheckList] = useState([]);
  // 动态属性表头
  const [activeColums, setActiveColums] = useState([]);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  // 表格原数据
  const [tableOriginData, setOriginData] = useState([]);
  // 图片库显示
  const [imageModalShow, setImageModalShow] = useState(false);
  // 销售单位
  const [goodsUnitData, setGoodsUnitData] = useState([]);
  // 当前上传的列表key
  const [cuurentKey, setCurrentKey] = useState(null);
  // 编辑新增时 不可修改的规格项
  const [disabledAttr, setDisabledAttr] = useState([]);
  //商家权限数据
  const authInfo = JSON.parse(sessionStorage.getItem(cache.AUTHINFO));
  const { presellState } = authInfo;
  const presaleCol = [];
  if (presellState === 1) {
    presaleCol.push({
      title: '预售库存',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'presellStock',
      key: 'presellStock',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`presellStock${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入预售库存' }],
              initialValue: props.openEdit ? record?.presellStock : '200000'
            })(
              <InputNumber placeholder="请输入预售库存" min={0} precision={0} />
            )}
          </Form.Item>
        );
      }
    });
  }
  const descCol = [];
  if (props.openEdit && !props.editAdd) {
    descCol.push({
      title: '规格编码',
      width: 180,
      align: 'center' as 'center',
      dataIndex: 'erpGoodsInfoNo'
    });
    descCol.push({
      title: '规格描述',
      width: 180,
      align: 'center' as 'center',
      dataIndex: 'attributeNameDesc',
      render: (_, record) =>
        record.goodsAttributeKeys && record.goodsAttributeKeys[0]
          ? record.goodsAttributeKeys[0].attributeNameDesc
          : ''
    });
  }
  const attrColums = [
    {
      title: '图片',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoImg',
      key: 'goodsInfoImg',
      // fixed: 'left',
      render: (text, record) => {
        if (props.openEdit) {
          return (
            <Form.Item>
              {getFieldDecorator(`goodsInfoImg${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请输入图片' }],
                initialValue: record.goodsInfoImg || ''
              })(
                <div
                  className="attr-img"
                  onClick={() => {
                    setImageModalShow(true);
                    setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
                  }}
                >
                  <img
                    src={props.form.getFieldValue(
                      `goodsInfoImg${record.goodsInfoNo}`
                    )}
                  />
                </div>
              )}
            </Form.Item>
          );
        } else {
          return (
            <Form.Item>
              {getFieldDecorator(`goodsInfoImg${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请输入图片' }],
                initialValue: ''
              })(
                <div>
                  {props.form.getFieldValue(
                    `goodsInfoImg${record.goodsInfoNo}`
                  ) ? (
                    <img
                      className="upload-area-img"
                      src={`${props.form.getFieldValue(
                        `goodsInfoImg${record.goodsInfoNo}`
                      )}`}
                      onClick={() => {
                        setImageModalShow(true);
                        setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
                      }}
                    />
                  ) : (
                    <div
                      className="photo-gallery-upload"
                      onClick={() => {
                        setImageModalShow(true);
                        setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
                      }}
                    >
                      <Icon type="plus" />
                    </div>
                  )}
                </div>
              )}
            </Form.Item>
          );
        }
      }
    },
    {
      title: 'SKU编码',
      width: 150,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo',
      // fixed: 'left',
      render: (text, record) => {
        return record.hostSku === 1 ? (
          <div className="attr-table-sku">
            <span>主</span>
            {record.goodsInfoNo}
          </div>
        ) : (
          record.goodsInfoNo
        );
      }
    },
    ...activeColums,
    {
      title: '门店价',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`marketPrice${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入门店价' }],
              initialValue: props.openEdit ? record.marketPrice : ''
            })(
              <InputNumber placeholder="请输入门店价" min={0} precision={2} />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '可销售库存',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'stock',
      key: 'stock',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`stock${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入可销售库存' }],
              initialValue: props.openEdit
                ? record?.goodsWareStocks[0]?.stock
                : ''
            })(
              <InputNumber
                placeholder="请输入可销售库存"
                min={0}
                precision={0}
              />
            )}
          </Form.Item>
        );
      }
    },
    ...presaleCol,
    {
      title: '成本价（元）',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`costPrice${record.goodsInfoNo}`, {
              // rules: [{ required: true, message: '请输入成本价' }],
              initialValue: props.openEdit ? record.costPrice : ''
            })(
              <InputNumber placeholder="请输入成本价" min={0} precision={2} />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '条形码',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoBarcode',
      key: 'goodsInfoBarcode',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoBarcode${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入条形码' }],
              initialValue: props.openEdit ? record.goodsInfoBarcode : ''
            })(<Input placeholder="请输入条形码" />)}
          </Form.Item>
        );
      }
    },
    {
      title: '物流体积(m³)',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoCubage',
      key: 'goodsInfoCubage',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoCubage${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入物流体积' }],
              initialValue: props.openEdit ? record.goodsInfoCubage : ''
            })(
              <InputNumber placeholder="请输入物流体积" min={0} precision={6} />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '毛重(公斤)',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoWeight',
      key: 'goodsInfoWeight',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoWeight${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入毛重' }],
              initialValue: props.openEdit ? record.goodsInfoWeight : ''
            })(<InputNumber placeholder="请输入毛重" min={0} precision={3} />)}
          </Form.Item>
        );
      }
    },
    {
      title: '销售单位',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoUnit',
      key: 'goodsInfoUnit',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoUnit${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请选择销售单位' }],
              initialValue: props.openEdit ? record.goodsInfoUnit : ''
            })(
              <Select
                style={{ width: 80 }}
                placeholder="请选择销售单位"
                notFoundContent="暂无销售单位"
              >
                {goodsUnitData.map((item) => {
                  return (
                    <Select.Option
                      key={item.storeGoodsUnitId}
                      value={item.unit}
                    >
                      {item.unit}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '最小单位规格',
      width: 200,
      align: 'center' as 'center',
      dataIndex: 'devanningUnit',
      key: 'devanningUnit',
      render: (text, record) => {
        return (
          <div className="add-unit-td">
            <Form.Item>
              {getFieldDecorator(`addStep${record.goodsInfoNo}`, {
                rules: [
                  { required: true, message: '请输入最小单位规格' },
                  {
                    pattern: ValidConst.greaterZeroTwoNumber,
                    message: '请输入大于0的两位小数'
                  }
                ],
                initialValue: props.openEdit ? record.addStep : ''
              })(
                <InputNumber
                  placeholder="请输入最小单位规格"
                  min={0}
                  precision={2}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`devanningUnit${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请选择单位' }],
                initialValue: props.openEdit ? record.devanningUnit : ''
              })(
                <Select
                  style={{ width: 70 }}
                  placeholder="请选择单位"
                  notFoundContent="暂无单位"
                >
                  {goodsUnitData.map((item) => {
                    return (
                      <Select.Option
                        key={item.storeGoodsUnitId}
                        value={item.unit}
                      >
                        {item.unit}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </div>
        );
      }
    },
    ...descCol,
    {
      title: '上下架状态',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'addedFlag',
      key: 'addedFlag',
      render: (addedFlag) => {
        return addedFlag === 0 ? '下架' : '上架';
      }
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'op',
      key: 'op',
      // fixed: 'right',
      render: (text, record, index) => {
        return (
          <div className="mall-table-btn">
            {/* {!props.openEdit && (
              <Button
                type="link"
                onClick={() => {
                  tableOperate(record, index);
                }}
              >
                {record.addedFlag === 0 ? '上架' : '下架'}
              </Button>
            )} */}
            {!props.openEdit && (
              <Popconfirm
                placement="topRight"
                title={'确认删除该条数据？'}
                onConfirm={() => {
                  delData(record, index);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            )}

            <Button
              type="link"
              onClick={() => {
                setMainSku(record, index);
              }}
            >
              {`${record.hostSku === 1 ? '取消' : '设为'}主SKU`}
            </Button>
          </div>
        );
      }
    }
  ];
  // 初始化
  useEffect(() => {
    getAllGoodsAttr();
    getGoodsUnitData();
  }, []);
  useEffect(() => {
    const allData = props.goodsDetail.goodsInfos;
    let activeCol = [];
    // 根据选择属性添加动态表头
    if (allData && allData.length > 0) {
      activeCol = getActiveCol(allData);
      // 根据属性id新增对应key val 数据
      allData.forEach((item) => {
        (item.goodsAttributeKeys || []).forEach((el) => {
          item[el.goodsAttributeId] = el.goodsAttributeValue;
        });
      });
    }
    if (props.openEdit) {
      setOriginData([...props.goodsDetail.goodsInfos]);
      const hasSku = allData.filter((el) => {
        return el.hostSku === 1;
      });
      if (!hasSku.length) {
        allData[0].hostSku = 1;
      }
      setActiveColums([...activeCol]);
      setTableData([...allData]);
    }
    // 编辑新增数据时初始化
    if (props.editAdd && props.goodsDetail && props.goodsDetail.goodsInfos) {
      const attrIds = activeCol.map((item) => item.key);
      setFieldsValue({ goodsName: attrIds });
      setDisabledAttr(attrIds);
      checkAttr(attrIds);
      setActiveColums([...activeCol]);
    }
  }, [props.goodsDetail]);
  // 根据选择属性添加动态表头
  const getActiveCol = (allData) => {
    let goodsAttributeKeys = [];
    allData.forEach((item) => {
      if (
        item.goodsAttributeKeys &&
        item.goodsAttributeKeys.length > goodsAttributeKeys.length
      ) {
        goodsAttributeKeys = item.goodsAttributeKeys;
      }
    });
    const activeCol = [];
    goodsAttributeKeys.forEach((el) => {
      const newCol = {
        title: el.attributeName || el.attribute.attribute,
        width: 100,
        align: 'center' as 'center',
        dataIndex: el.goodsAttributeId,
        key: el.goodsAttributeId,
        render: (text) => text || '-'
      };
      activeCol.push(newCol);
    });
    return activeCol;
  };
  // 获取所有商品属性
  const getAllGoodsAttr = () => {
    getGoodsAttr().then((data) => {
      console.warn(data);
      setAllAttrList(data.res.context.attributeVos);
    });
  };
  // 获取所有销售单位
  const getGoodsUnitData = () => {
    getGoodsUnit()
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取销售单位列表失败');
          return;
        }
        console.warn(data, '销售单位');
        setGoodsUnitData(data.res.context.goodsUnitVos);
      })
      .catch((err) => {
        message.error('获取销售单位列表失败');
      });
  };
  /** 选择属性
   * 分页获取图片列表
   * @param attrIds 已选择的属性id数组
   */
  const checkAttr = (attrIds) => {
    const checkList = [];
    attributeList.forEach((item) => {
      if (attrIds.includes(item.attributeId)) {
        // 判断是否存在已添加属性
        const idx = checkedAttrList.findIndex((el) => {
          return el.attributeId === item.attributeId;
        });
        const { attributeId, attribute } = item;
        const checkItem = {
          attributeId,
          attribute,
          attributes: idx === -1 ? [] : checkedAttrList[idx].attributes,
          inputName: ''
        };
        checkList.push(checkItem);
      }
    });
    setCheckList([...checkList]);
  };
  const handleAttrChange = (id, val) => {
    const newArr = checkedAttrList.map((item) => {
      if (item.attributeId === id) {
        item.inputName = val;
      }
      return item;
    });
    setCheckList([...newArr]);
  };
  // 添加自定义属性子类名称
  const addCurrentAttr = (newTagName, index) => {
    const newList = lodash.cloneDeep(checkedAttrList);
    const newTagNames = newTagName.split('@');
    newTagNames.forEach((item) => {
      if (!item || newList[index].attributes.indexOf(item) !== -1) {
        message.warning(`属性名称${item}不正确或已存在`);
      } else {
        newList[index].attributes.push(item);
      }
    });

    newList[index].inputName = '';
    setCheckList(newList);
  };
  // 删除子标签
  const delTag = (tagIdx, attrId) => {
    const newList = lodash.cloneDeep(checkedAttrList);
    newList.forEach((item) => {
      if (item.attributeId === attrId) {
        item.attributes.splice(tagIdx, 1);
      }
    });
    console.warn(newList);
    setCheckList([...newList]);
  };
  // 根据已选属性生成表格
  const createAttrData = () => {
    const createAttrList = [];
    // 去除空属性、自定义属性
    let flag = false;
    checkedAttrList.forEach((item) => {
      const { attributeId, attribute, attributes } = item;
      if (attributes.length) {
        const newItem = { attributeId, attribute, attributes };
        createAttrList.push(newItem);
      } else {
        message.error(`属性${attribute}至少需要添加一个值`, 4);
        flag = true;
      }
    });
    if (flag) {
      return;
    }
    setActiveColums([]); // 清空动态列
    setTableData([]); // 清空表格
    createTableByAttr({ attributeList: createAttrList })
      .then((data) => {
        let allData = data.res.context.goodsInfoList;
        if (props.editAdd) {
          allData = checkData(allData);
        }
        // 保存原始数据
        setOriginData(allData);
        const activeCol = [];
        // 根据选择属性添加动态表头
        allData[0].goodsAttributeKeys.forEach((el) => {
          const newCol = {
            title: el.attributeName,
            width: 100,
            align: 'center' as 'center',
            dataIndex: el.attributeId,
            key: el.attributeId
          };
          activeCol.push(newCol);
        });
        // 根据属性id新增对应key val 数据
        allData.forEach((item) => {
          item.goodsAttributeKeys.forEach((el) => {
            item[el.attributeId] = el.goodsAttributeValue;
          });
          // 默认上架
          item.addedFlag = 1;
        });
        console.warn(allData);
        if (!props.editAdd) {
          allData[0].hostSku = 1;
        }
        setActiveColums([...activeCol]);
        setTableData([...allData]);
      })
      .catch((err) => {
        console.warn(err);
      });
  };
  // 编辑新增时 去除重复数据
  const checkData = (data) => {
    const attributes = [];
    props.goodsDetail.goodsInfos.forEach((item) => {
      attributes.push(
        item.goodsAttributeKeys.map(
          (cd) => `${cd.attributeName}${cd.goodsAttributeValue}`
        )
      );
    });
    const result = [];
    data.forEach((item) => {
      if (item.goodsAttributeKeys.length !== attributes[0].length) {
        result.push(item);
      } else {
        let flag = false;
        const itemKeys = [];
        item.goodsAttributeKeys.forEach((cd) => {
          itemKeys.push(`${cd.attributeName}${cd.goodsAttributeValue}`);
        });
        attributes.forEach((cd) => {
          const attr = [...itemKeys, ...cd];
          const uniqAttr = lodash.uniq(attr);
          if (itemKeys.length === uniqAttr.length) {
            flag = true;
            message.warning('存在规格重复数据，已删除');
            return;
          }
        });
        if (!flag) {
          result.push(item);
        }
      }
    });
    return result;
  };
  // 删除数据
  const delData = (data, idx) => {
    console.warn(idx);

    const list = tableData;
    list.splice(idx, 1);
    const originList = tableOriginData;
    originList.splice(idx, 1);
    setTableData([...list]);
    setOriginData([...originList]);
  };
  // 上下架
  const tableOperate = (data, index) => {
    console.warn(index);
    const nowData = tableData;
    const originData = tableData;
    if (data.addedFlag === 0) {
      nowData[index].addedFlag = 1;
      originData[index].addedFlag = 1;
    } else {
      nowData[index].addedFlag = 0;
      originData[index].addedFlag = 0;
    }
    console.warn(nowData, originData);
    setTableData([...nowData]);
    setOriginData([...originData]);
  };
  // 设为主SKU
  const setMainSku = (data, index) => {
    const nowData = tableData;
    nowData.forEach((item) => {
      if (item.goodsInfoNo === data.goodsInfoNo) {
        item.hostSku = item.hostSku === 1 ? 0 : 1;
      } else {
        item.hostSku = 0;
      }
    });
    setTableData([...nowData]);
    if (props.editAdd && props.productAttributeRef) {
      props.productAttributeRef.current.cancelMainSku();
    }
    if (props.openEdit && props.productAttributeAddRef) {
      props.productAttributeAddRef.current.cancelMainSku();
    }
  };
  // 编辑时取消主SKU
  const cancelMainSku = () => {
    const nowData = tableData;
    nowData.forEach((item) => {
      item.hostSku = 0;
    });
    setTableData([...nowData]);
  };
  // 提交商品属性数据
  const attrFormSubmit = async () => {
    const info = await props.form.validateFieldsAndScroll();
    console.warn(info);
    if (info.errors) {
      message.error('请填写正确的商品属性规格信息');
      return false;
    } else {
      const data = tableOriginData.map((item) => {
        const current = tableData.find(
          (el) => el.goodsInfoNo === item.goodsInfoNo
        );
        item.hostSku = current.hostSku;
        item.addedFlag = current.addedFlag;
        item.goodsInfoImg = info[`goodsInfoImg${item.goodsInfoNo}`];
        item.marketPrice = info[`marketPrice${item.goodsInfoNo}`];
        item.costPrice = info[`costPrice${item.goodsInfoNo}`];
        item.stock = info[`stock${item.goodsInfoNo}`];
        item.goodsInfoUnit = info[`goodsInfoUnit${item.goodsInfoNo}`];
        item.goodsInfoWeight = info[`goodsInfoWeight${item.goodsInfoNo}`];
        item.goodsInfoCubage = info[`goodsInfoCubage${item.goodsInfoNo}`];
        item.devanningUnit = info[`devanningUnit${item.goodsInfoNo}`];
        item.addStep = info[`addStep${item.goodsInfoNo}`];
        if (item.goodsWareStocks) {
          item.goodsWareStocks[0].stock = info[`stock${item.goodsInfoNo}`];
        }

        item.goodsInfoBarcode = info[`goodsInfoBarcode${item.goodsInfoNo}`];
        item.presellStock = info[`presellStock${item.goodsInfoNo}`];
        return item;
      });
      console.warn(data);
      return { ...info, goodsInfos: data, goodsAttributeKeys: checkedAttrList };
    }
  };
  return (
    <div className="new-product-card">
      <Card
        title={
          <div>
            属性规格
            <span className="new-product-card-subtitle">
              {props.openEdit && '已有属性规格'}
              {props.editAdd && '新增属性规格'}
            </span>
          </div>
        }
        headStyle={{ color: '#F56C1D' }}
        bordered={false}
      >
        <Form
          labelCol={{
            span: 2
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          {!props.openEdit && (
            <Form.Item label="属性类型">
              {getFieldDecorator('goodsName', {
                rules: [
                  { required: !props.openEdit, message: '请选择属性类型' }
                ],
                initialValue: []
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择属性类型"
                  onChange={checkAttr}
                  style={{ width: '100%' }}
                  disabled={props.openEdit}
                >
                  {attributeList.map((item) => {
                    return (
                      <Select.Option
                        key={item.attributeId}
                        disabled={disabledAttr.includes(item.attributeId)}
                      >
                        {item.attribute}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          )}
          {checkedAttrList.length > 0 &&
            checkedAttrList.map((item, index) => {
              // const { attributes } = item;
              return (
                <Form.Item label={item.attribute} key={item.attributeId}>
                  {/* 渲染自定义标签 */}
                  {item.attributes.map((el, elIdx) => {
                    return (
                      <Tag
                        key={el}
                        color="volcano"
                        closable
                        style={{ marginRight: 10, fontSize: 14 }}
                        onClose={() => {
                          delTag(elIdx, item.attributeId);
                        }}
                      >
                        {el}
                      </Tag>
                    );
                  })}
                  <div className="add-tag-input">
                    <Input
                      value={item.inputName}
                      onChange={(e) =>
                        handleAttrChange(item.attributeId, e.target.value)
                      }
                      addonAfter={
                        <div
                          className="add-tag-input-btn"
                          onClick={() => {
                            addCurrentAttr(item.inputName, index);
                          }}
                        >
                          添加
                        </div>
                      }
                    />
                  </div>
                  <span style={{ color: 'red' }}>
                    若有多个属性值，请用 @ 符号隔开
                  </span>
                </Form.Item>
              );
            })}
          {!props.openEdit && (
            <Form.Item label="操作">
              <Button
                type="primary"
                onClick={createAttrData}
                disabled={!checkedAttrList.length}
              >
                批量生成
              </Button>
            </Form.Item>
          )}
          <div className="attr-table">
            <Table
              // loading={tableLoading}
              columns={attrColums}
              dataSource={tableData}
              pagination={false}
              rowKey={(record: any) => record.goodsInfoNo}
              scroll={{ x: true }}
              bordered
            />
          </div>
        </Form>
      </Card>
      {/* 图片库 */}
      <PhotoGallery
        show={imageModalShow}
        maxCount={1}
        hide={() => {
          setImageModalShow(false);
        }}
        setImg={(data) => {
          const item = {};
          console.warn(data);
          item[cuurentKey] = data.length ? data[0].artworkUrl : '';
          props.form.setFieldsValue({ ...item });
          setCurrentKey(null);
        }}
      />
    </div>
  );
});

const ProductAttributeTemplate = Form.create<any>()(ProductAttribute);

export default ProductAttributeTemplate;
