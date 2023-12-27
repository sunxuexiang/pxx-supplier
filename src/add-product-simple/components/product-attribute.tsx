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
import { PhotoGallery, Const, cache, util } from 'qmkit';
import { getGoodsAttr, createTableByAttr, getGoodsUnit } from '../webapi';
// import PhotoGallery from './photo-gallery/photo-gallery';

const ProductAttribute = forwardRef((props: any, ref) => {
  useImperativeHandle(ref, () => ({
    // form: props.form,
    attrFormSubmit,
    cancelMainSku
  }));
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldValue,
    validateFields,
    getFieldError
  } = props.form;
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
  // 计算物流体积
  const computeSize = (length, width, height, goodsInfoNo) => {
    const result = util.mul(
      util.mul(Number(length || 0), Number(width || 0)),
      Number(height || 0)
    );
    setFieldsValue({ [`goodsInfoCubage${goodsInfoNo}`]: result });
  };

  const attrColums = [
    // {
    //   title: '图片',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'goodsInfoImg',
    //   key: 'goodsInfoImg',
    //   // fixed: 'left',
    //   render: (text, record) => {
    //     if (props.openEdit) {
    //       return (
    //         <Form.Item>
    //           {getFieldDecorator(`goodsInfoImg${record.goodsInfoNo}`, {
    //             rules: [{ required: true, message: '请输入图片' }],
    //             initialValue: record.goodsInfoImg || ''
    //           })(
    //             <div
    //               className="attr-img"
    //               onClick={() => {
    //                 setImageModalShow(true);
    //                 setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
    //               }}
    //             >
    //               <img
    //                 src={props.form.getFieldValue(
    //                   `goodsInfoImg${record.goodsInfoNo}`
    //                 )}
    //               />
    //             </div>
    //           )}
    //         </Form.Item>
    //       );
    //     } else {
    //       return (
    //         <Form.Item>
    //           {getFieldDecorator(`goodsInfoImg${record.goodsInfoNo}`, {
    //             rules: [{ required: true, message: '请输入图片' }],
    //             initialValue: ''
    //           })(
    //             <div>
    //               {props.form.getFieldValue(
    //                 `goodsInfoImg${record.goodsInfoNo}`
    //               ) ? (
    //                 <img
    //                   className="upload-area-img"
    //                   src={`${props.form.getFieldValue(
    //                     `goodsInfoImg${record.goodsInfoNo}`
    //                   )}`}
    //                   onClick={() => {
    //                     setImageModalShow(true);
    //                     setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
    //                   }}
    //                 />
    //               ) : (
    //                 <div
    //                   className="photo-gallery-upload"
    //                   onClick={() => {
    //                     setImageModalShow(true);
    //                     setCurrentKey(`goodsInfoImg${record.goodsInfoNo}`);
    //                   }}
    //                 >
    //                   <Icon type="plus" />
    //                 </div>
    //               )}
    //             </div>
    //           )}
    //         </Form.Item>
    //       );
    //     }
    //   }
    // },
    // {
    //   title: 'SKU编码',
    //   width: 150,
    //   align: 'center' as 'center',
    //   dataIndex: 'goodsInfoNo',
    //   key: 'goodsInfoNo',
    //   // fixed: 'left',
    //   render: (text, record) => {
    //     return record.hostSku === 1 ? (
    //       <div className="attr-table-sku">
    //         <span>主</span>
    //         {record.goodsInfoNo}
    //       </div>
    //     ) : (
    //       record.goodsInfoNo
    //     );
    //   }
    // },
    // ...activeColums,
    {
      title: <div className="attr-required">商品规格</div>,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoUnit',
      key: 'goodsInfoUnit',
      render: (text, record) => {
        return (
          <div className="add-unit-td">
            <Form.Item> 1 </Form.Item>
            <Form.Item>
              {getFieldDecorator(`goodsInfoUnit${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请选择单位' }],
                initialValue: record.goodsInfoUnit || '箱'
              })(
                <Select
                  style={{ width: 80, marginLeft: 12 }}
                  placeholder="单位"
                  disabled
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
            <Form.Item style={{ marginLeft: 12 }}> = </Form.Item>
            <Form.Item>
              {getFieldDecorator(`addStep${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请输入最小单位数值' }],
                initialValue: record.addStep || ''
              })(
                <InputNumber
                  step={1}
                  min={0}
                  precision={2}
                  placeholder="最小单位数值"
                  onChange={(val) => computePrice(record.goodsInfoNo, val)}
                  style={{ width: 110, marginLeft: 12 }}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`devanningUnit${record.goodsInfoNo}`, {
                rules: [{ required: true, message: '请选择最小单位' }],
                initialValue: record.devanningUnit || undefined
              })(
                <Select style={{ width: 105 }} placeholder="最小单位">
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
            <Form.Item style={{ marginLeft: 12 }}> × </Form.Item>
            <Form.Item style={{ marginLeft: 12 }}>
              <Input
                disabled
                placeholder="不可输入，自动换算"
                style={{ width: 215 }}
                addonAfter={`元/${getFieldValue(
                  `devanningUnit${record.goodsInfoNo}`
                ) || ''}`}
                value={record.unitPrice || ''}
              />
            </Form.Item>
          </div>
        );
      }
    },
    {
      title: <div className="attr-required">销售价</div>,
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`marketPrice${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入销售价' }],
              initialValue: record.marketPrice || ''
            })(
              <InputNumber
                placeholder="销售价"
                min={0}
                precision={2}
                style={{ width: '100%' }}
                onChange={(val) => computePrice(record.goodsInfoNo, '', val)}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '条码',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoBarcode',
      key: 'goodsInfoBarcode',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoBarcode${record.goodsInfoNo}`, {
              // rules: [{ required: true, message: '请输入条码' }],
              initialValue: props.openEdit ? record.goodsInfoBarcode : ''
            })(<Input placeholder="条码" />)}
          </Form.Item>
        );
      }
    },
    {
      title: <div className="attr-required">可销售库存</div>,
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
                : '999999'
            })(<InputNumber placeholder="请输入" min={0} precision={0} />)}
          </Form.Item>
        );
      }
    },
    // ...presaleCol,
    // {
    //   title: '成本价（元）',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'costPrice',
    //   key: 'costPrice',
    //   render: (text, record) => {
    //     return (
    //       <Form.Item>
    //         {getFieldDecorator(`costPrice${record.goodsInfoNo}`, {
    //           // rules: [{ required: true, message: '请输入成本价' }],
    //           initialValue: props.openEdit ? record.costPrice : ''
    //         })(
    //           <InputNumber placeholder="请输入成本价" min={0} precision={2} />
    //         )}
    //       </Form.Item>
    //     );
    //   }
    // },
    {
      title: ' 物流体积(m³)',
      width: 430,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoCubage',
      key: 'goodsInfoCubage',
      render: (text, record) => {
        const volumeInfo = record.volumeInfo
          ? record.volumeInfo.split(',')
          : ['', '', ''];
        return (
          <div>
            <Form.Item className="add-cubage">
              {getFieldDecorator(`goodsInfoLength${record.goodsInfoNo}`, {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (
                        !value &&
                        (getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`) ||
                          getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`))
                      ) {
                        callback('请输入长度');
                      }
                      if (
                        !value &&
                        !getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`) &&
                        !getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`)
                      ) {
                        if (
                          getFieldError(`goodsInfoWidth${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoWidth${record.goodsInfoNo}`
                          ]);
                        }
                        if (
                          getFieldError(`goodsInfoHeight${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoHeight${record.goodsInfoNo}`
                          ]);
                        }
                      }
                      callback();
                    }
                  }
                ],
                initialValue: props.openEdit ? volumeInfo[0] : ''
              })(
                <InputNumber
                  placeholder="长"
                  min={0}
                  precision={3}
                  style={{ width: 60 }}
                  onChange={(val) =>
                    computeSize(
                      val,
                      getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`),
                      getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`),
                      record.goodsInfoNo
                    )
                  }
                />
              )}
              <div className="add-cubage-unit">m</div>
            </Form.Item>
            <Form.Item style={{ margin: '0 6px' }}> × </Form.Item>
            <Form.Item className="add-cubage">
              {getFieldDecorator(`goodsInfoWidth${record.goodsInfoNo}`, {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (
                        !value &&
                        (getFieldValue(
                          `goodsInfoLength${record.goodsInfoNo}`
                        ) ||
                          getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`))
                      ) {
                        callback('请输入宽度');
                      }
                      if (
                        !value &&
                        !getFieldValue(
                          `goodsInfoLength${record.goodsInfoNo}`
                        ) &&
                        !getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`)
                      ) {
                        if (
                          getFieldError(`goodsInfoLength${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoLength${record.goodsInfoNo}`
                          ]);
                        }
                        if (
                          getFieldError(`goodsInfoHeight${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoHeight${record.goodsInfoNo}`
                          ]);
                        }
                      }
                      callback();
                    }
                  }
                ],
                initialValue: props.openEdit ? volumeInfo[1] : ''
              })(
                <InputNumber
                  placeholder="宽"
                  min={0}
                  precision={3}
                  style={{ width: 60 }}
                  onChange={(val) =>
                    computeSize(
                      getFieldValue(`goodsInfoLength${record.goodsInfoNo}`),
                      val,
                      getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`),
                      record.goodsInfoNo
                    )
                  }
                />
              )}
              <div className="add-cubage-unit">m</div>
            </Form.Item>
            <Form.Item style={{ margin: '0 6px' }}> × </Form.Item>
            <Form.Item className="add-cubage">
              {getFieldDecorator(`goodsInfoHeight${record.goodsInfoNo}`, {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (
                        !value &&
                        (getFieldValue(
                          `goodsInfoLength${record.goodsInfoNo}`
                        ) ||
                          getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`))
                      ) {
                        callback('请输入高度');
                      }
                      if (
                        !value &&
                        !getFieldValue(
                          `goodsInfoLength${record.goodsInfoNo}`
                        ) &&
                        !getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`)
                      ) {
                        if (
                          getFieldError(`goodsInfoLength${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoLength${record.goodsInfoNo}`
                          ]);
                        }
                        if (
                          getFieldError(`goodsInfoWidth${record.goodsInfoNo}`)
                        ) {
                          validateFields([
                            `goodsInfoWidth${record.goodsInfoNo}`
                          ]);
                        }
                      }
                      callback();
                    }
                  }
                ],
                initialValue: props.openEdit ? volumeInfo[2] : ''
              })(
                <InputNumber
                  placeholder="高"
                  min={0}
                  precision={3}
                  style={{ width: 60 }}
                  onChange={(val) =>
                    computeSize(
                      getFieldValue(`goodsInfoLength${record.goodsInfoNo}`),
                      getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`),
                      val,
                      record.goodsInfoNo
                    )
                  }
                />
              )}
              <div className="add-cubage-unit">m</div>
            </Form.Item>
            <Form.Item style={{ margin: '0 6px' }}> = </Form.Item>
            <Form.Item>
              {getFieldDecorator(`goodsInfoCubage${record.goodsInfoNo}`, {
                initialValue: props.openEdit ? record.goodsInfoCubage : ''
              })(
                <InputNumber
                  placeholder="物流体积"
                  min={0}
                  precision={6}
                  style={{ width: 90 }}
                  disabled={
                    getFieldValue(`goodsInfoLength${record.goodsInfoNo}`) ||
                    getFieldValue(`goodsInfoWidth${record.goodsInfoNo}`) ||
                    getFieldValue(`goodsInfoHeight${record.goodsInfoNo}`)
                      ? true
                      : false
                  }
                />
              )}
            </Form.Item>
          </div>
        );
      }
    },
    {
      title: <div className="attr-required">毛重(公斤)</div>,
      width: 90,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoWeight',
      key: 'goodsInfoWeight',
      render: (text, record) => {
        return (
          <Form.Item>
            {getFieldDecorator(`goodsInfoWeight${record.goodsInfoNo}`, {
              rules: [{ required: true, message: '请输入毛重' }],
              initialValue: props.openEdit ? record.goodsInfoWeight : ''
            })(
              <InputNumber
                placeholder="毛重"
                min={0}
                precision={3}
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
        );
      }
    }
    // {
    //   title: '销售单位',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'goodsInfoUnit',
    //   key: 'goodsInfoUnit',
    //   render: (text, record) => {
    //     return (
    //       <Form.Item>
    //         {getFieldDecorator(`goodsInfoUnit${record.goodsInfoNo}`, {
    //           rules: [{ required: true, message: '请选择销售单位' }],
    //           initialValue: props.openEdit ? record.goodsInfoUnit : ''
    //         })(
    //           <Select
    //             style={{ width: 80 }}
    //             placeholder="请选择销售单位"
    //             notFoundContent="暂无销售单位"
    //           >
    //             {goodsUnitData.map((item) => {
    //               return (
    //                 <Select.Option
    //                   key={item.storeGoodsUnitId}
    //                   value={item.unit}
    //                 >
    //                   {item.unit}
    //                 </Select.Option>
    //               );
    //             })}
    //           </Select>
    //         )}
    //       </Form.Item>
    //     );
    //   }
    // },
    // {
    //   title: '最小单位规格',
    //   width: 200,
    //   align: 'center' as 'center',
    //   dataIndex: 'devanningUnit',
    //   key: 'devanningUnit',
    //   render: (text, record) => {
    //     return (
    //       <div className="add-unit-td">
    //         <Form.Item>
    //           {getFieldDecorator(`addStep${record.goodsInfoNo}`, {
    //             rules: [
    //               { required: true, message: '请输入最小单位规格' },
    //               {
    //                 pattern: ValidConst.greaterZeroTwoNumber,
    //                 message: '请输入大于0的两位小数'
    //               }
    //             ],
    //             initialValue: props.openEdit ? record.addStep : ''
    //           })(
    //             <InputNumber
    //               placeholder="请输入最小单位规格"
    //               min={0}
    //               precision={2}
    //             />
    //           )}
    //         </Form.Item>
    //         <Form.Item>
    //           {getFieldDecorator(`devanningUnit${record.goodsInfoNo}`, {
    //             rules: [{ required: true, message: '请选择单位' }],
    //             initialValue: props.openEdit ? record.devanningUnit : ''
    //           })(
    //             <Select
    //               style={{ width: 70 }}
    //               placeholder="请选择单位"
    //               notFoundContent="暂无单位"
    //             >
    //               {goodsUnitData.map((item) => {
    //                 return (
    //                   <Select.Option
    //                     key={item.storeGoodsUnitId}
    //                     value={item.unit}
    //                   >
    //                     {item.unit}
    //                   </Select.Option>
    //                 );
    //               })}
    //             </Select>
    //           )}
    //         </Form.Item>
    //       </div>
    //     );
    //   }
    // },
    // ...descCol,
    // {
    //   title: '上下架状态',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'addedFlag',
    //   key: 'addedFlag',
    //   render: (addedFlag) => {
    //     return addedFlag === 0 ? '下架' : '上架';
    //   }
    // },
    // {
    //   title: '操作',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'op',
    //   key: 'op',
    //   // fixed: 'right',
    //   render: (text, record, index) => {
    //     return (
    //       <div className="mall-table-btn">
    //         {/* {!props.openEdit && (
    //           <Button
    //             type="link"
    //             onClick={() => {
    //               tableOperate(record, index);
    //             }}
    //           >
    //             {record.addedFlag === 0 ? '上架' : '下架'}
    //           </Button>
    //         )} */}
    //         {!props.openEdit && (
    //           <Popconfirm
    //             placement="topRight"
    //             title={'确认删除该条数据？'}
    //             onConfirm={() => {
    //               delData(record, index);
    //             }}
    //             okText="确认"
    //             cancelText="取消"
    //           >
    //             <Button type="link">删除</Button>
    //           </Popconfirm>
    //         )}

    //         <Button
    //           type="link"
    //           onClick={() => {
    //             setMainSku(record, index);
    //           }}
    //         >
    //           {`${record.hostSku === 1 ? '取消' : '设为'}主SKU`}
    //         </Button>
    //       </div>
    //     );
    //   }
    // }
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
        // 根据 数量和总价 计算单价
        item.unitPrice = (
          Number(item.marketPrice) / Number(item.addStep)
        ).toFixed(2);
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
      const allAttrList = data.res.context.attributeVos;
      setAllAttrList(data.res.context.attributeVos);
      // 新增商品时默认操作 这里使用location.state判断而不是openEdit 因为setEdit是异步操作
      if (!(props.location.state && props.location.state.goodsId)) {
        allAttrList.forEach((item) => {
          if (item.attribute === '规格') {
            setFieldsValue({ goodsName: [item.attributeId] });
            const list = checkAttr([item.attributeId], allAttrList);
            createAttrData(list);
            return;
          }
        });
      }
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
  // 计算销售价
  const computePrice = (goodsInfoNo, addStep?, marketPrice?) => {
    let result = '';
    const num = addStep || getFieldValue(`addStep${goodsInfoNo}`);
    const price = marketPrice || getFieldValue(`marketPrice${goodsInfoNo}`);
    if (num && price) {
      result = (Number(price) / Number(num)).toFixed(2);
    }
    if (result) {
      const newData = tableData.map((item) => {
        const opt = item;
        if (item.goodsInfoNo === goodsInfoNo) {
          opt.unitPrice = result;
        }
        return opt;
      });
      setTableData(newData);
    }
  };
  /** 选择属性
   * 分页获取图片列表
   * @param attrIds 已选择的属性id数组
   */
  const checkAttr = (attrIds, list?) => {
    const checkList = [];
    (list || attributeList).forEach((item) => {
      if (attrIds.includes(item.attributeId)) {
        const { attributeId, attribute } = item;
        const checkItem = {
          attributeId,
          attribute
        };
        checkList.push(checkItem);
      }
    });
    setCheckList([...checkList]);
    return [...checkList];
  };
  // 根据已选属性生成表格
  const createAttrData = (list) => {
    const createAttrList = [];
    // 去除空属性、自定义属性

    list.forEach((item) => {
      const { attributeId, attribute } = item;
      const newItem = { attributeId, attribute, attributes: [1] };
      createAttrList.push(newItem);
    });
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
          allData[0].stock = '99999';
          if (presellState === 1) {
            allData[0].presellStock = '200000';
          }
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
        // item.goodsInfoImg = info[`goodsInfoImg${item.goodsInfoNo}`];

        item.marketPrice = info[`marketPrice${item.goodsInfoNo}`];
        item.costPrice = info[`marketPrice${item.goodsInfoNo}`];
        const inputStock = info[`stock${item.goodsInfoNo}`];
        item.stock =
          `${inputStock}`.length > 0 ? inputStock : current.stock || 999999;
        item.goodsInfoUnit = info[`goodsInfoUnit${item.goodsInfoNo}`];
        item.goodsInfoWeight = info[`goodsInfoWeight${item.goodsInfoNo}`];
        item.goodsInfoCubage = info[`goodsInfoCubage${item.goodsInfoNo}`];
        item.devanningUnit = info[`devanningUnit${item.goodsInfoNo}`];
        item.addStep = info[`addStep${item.goodsInfoNo}`];
        if (item.goodsWareStocks) {
          item.goodsWareStocks[0].stock = item.stock;
        }

        if (info[`goodsInfoLength${item.goodsInfoNo}`]) {
          item.volumeInfo = [
            info[`goodsInfoLength${item.goodsInfoNo}`],
            info[`goodsInfoWidth${item.goodsInfoNo}`],
            info[`goodsInfoHeight${item.goodsInfoNo}`]
          ].join(',');
        }

        item.goodsInfoBarcode = info[`goodsInfoBarcode${item.goodsInfoNo}`];
        item.presellStock = current.presellStock || '';
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
            规格信息
            <span className="new-product-card-subtitle">
              {props.openEdit && '已有规格信息'}
              {props.editAdd && '新增规格信息'}
            </span>
          </div>
        }
        headStyle={{ color: '#F56C1D' }}
        bordered={false}
      >
        <Form
          labelCol={{
            span: 0
          }}
          wrapperCol={{
            span: 24
          }}
          autoComplete="off"
        >
          {!props.openEdit && (
            <Form.Item label="属性类型" style={{ display: 'none' }}>
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
                  disabled
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
