import * as React from 'react';
import { fromJS, Set } from 'immutable';

import {
  InputNumber,
  Input,
  Button,
  Select,
  Form,
  Tooltip,
  Icon,
  Modal,
  Table
} from 'antd';
import { DataGrid, ValidConst, util } from 'qmkit';

import { GoodsModal } from 'biz';

const Option = Select.Option;
const { Column } = Table;
const FormItem = Form.Item;

import styled from 'styled-components';

const HasError = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .ant-select-selection {
    border-color: #d9d9d9 !important;
  }
  .ant-select-selection .ant-select-arrow {
    color: #d9d9d9;
  }
`;

export default class GiftLevels extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: props.isFullCount,
      selectedRows: props.selectedRows,
      wareId: props.wareId,
      isOverlap: props.isOverlap,
      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [],
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _forIndex: 0
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.selectedRows.toJS(), 'nextProps456');
    if (!nextProps.fztype) {
      if (nextProps.wareId != this.state.wareId) {
        this.setState({
          selectedRows: fromJS([])
        });
      }
    } else {
      if (nextProps.selectedRows && nextProps.selectedRows.toJS().length > 0) {
        this.setState({
          selectedRows: this.state.selectedRows.push(...nextProps.selectedRows)
        });
      }
    }

    this.setState({ wareId: nextProps.wareId, isOverlap: nextProps.isOverlap });

    if (nextProps.isOverlap && nextProps.fullGiftLevelList.length > 1) {
      this.setState(
        {
          fullGiftLevelList: nextProps.fullGiftLevelList.slice(0, 1)
        },
        () => {
          const { onChangeBack } = this.props;
          onChangeBack(nextProps.fullGiftLevelList.slice(0, 1));
        }
      );
    } else {
      this.setState({
        fullGiftLevelList: nextProps.fullGiftLevelList
          ? nextProps.fullGiftLevelList
          : []
      });
    }
  }

  componentDidMount() {
    if (
      !this.props.fullGiftLevelList ||
      this.props.fullGiftLevelList.length == 0
    ) {
      this.initLevel();
    }
  }

  shouldComponentUpdate(nextProps) {
    let resetFields = {};
    const { fullGiftLevelList, isFullCount } = this.props;
    // console.log(fullGiftLevelList, 'fullGiftLevelListfullGiftLevelList');

    if (isFullCount != nextProps.isFullCount) {
      fullGiftLevelList.forEach((level, index) => {
        resetFields[`level_rule_value_${index}`] = null;
        level.fullGiftDetailList.forEach((detail, detailIndex) => {
          resetFields[
            `${detail.productId}level_detail${index}${detailIndex}`
          ] = 1;
        });
      });
      this.initLevel();
      this.setState({
        selectedRows: fromJS([]),
        isFullCount: nextProps.isFullCount
      });
    } else {
      if (
        fullGiftLevelList &&
        fullGiftLevelList.length != nextProps.fullGiftLevelList.length
      ) {
        nextProps.fullGiftLevelList.forEach((level, index) => {
          if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
            resetFields[`level_rule_value_${index}`] = !isFullCount
              ? level.fullAmount
              : level.fullCount;
          }
        });
      }
    }
    if (JSON.stringify(resetFields) !== '{}') {
      this.props.form.setFieldsValue(resetFields);
    }
    return true;
  }

  render() {
    const {
      goodsModal,
      isFullCount,
      fullGiftLevelList,
      wareId,
      isOverlap
    } = this.state;
    const { form } = this.props;

    const { getFieldDecorator } = form;
    // console.log(fullGiftLevelList,'fullGiftLevelListfullGiftLevelList');

    // console.log(
    //   '==================== isFullCount : ' +
    //   isFullCount +
    //   ' ===================='
    // );

    return (
      <div>
        {fullGiftLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.giftLevelId}>
              <HasError>
                <span>满&nbsp;</span>
                <FormItem>
                  {getFieldDecorator(`level_rule_value_${index}`, {
                    rules: [
                      { required: true, message: '必须输入规则' },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (!isFullCount) {
                              if (
                                !ValidConst.price.test(value) ||
                                !(value < 100000000 && value > 0)
                              ) {
                                callback('请输入0.01-99999999.99间的数字');
                              }
                            } else {
                              if (
                                !ValidConst.noZeroNumber.test(value) ||
                                !(value < 10000 && value > 0)
                              ) {
                                callback('请输入1-9999间的整数');
                              }
                            }
                          }
                          callback();
                        }
                      }
                    ],
                    initialValue: !isFullCount
                      ? level.fullAmount
                      : level.fullCount
                  })(
                    <Input
                      style={{ width: 200 }}
                      placeholder={
                        !isFullCount
                          ? '0.01-99999999.99间的数字'
                          : '1-9999间的数字'
                      }
                      onChange={(e) => {
                        this.ruleValueChange(index, e.target.value);
                      }}
                    />
                  )}
                </FormItem>
                <span>
                  &nbsp;{!isFullCount ? '元' : '箱'}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => this.openGoodsModal(index)}
                  style={{ marginTop: 3.5 }}
                >
                  添加赠品
                </Button>
                &nbsp;&nbsp;
                <Select
                  value={level.giftType}
                  style={{ width: 120, marginTop: 3.5 }}
                  onChange={(val) => {
                    this.onChange(index, 'giftType', val);
                  }}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                >
                  <Option value={1}>可选一种</Option>
                  <Option value={0}>默认全赠</Option>
                </Select>
                &nbsp;&nbsp;&nbsp;
                {index > 0 && (
                  <a onClick={() => this.deleteLevels(index)}>删除</a>
                )}
              </HasError>

              <DataGrid
                scroll={{ y: 500 }}
                size="small"
                rowKey={(record) => record.goodsInfoId}
                dataSource={
                  level.fullGiftDetailList
                    ? this.getSelectedRowByIds(
                        this.getIdsFromLevel(level.fullGiftDetailList)
                      )
                    : []
                }
                pagination={false}
              >
                {!util.isThirdStore() && (
                  <Column
                    title="SKU编码"
                    dataIndex="goodsInfoNo"
                    key="goodsInfoNo"
                    width="12%"
                  />
                )}
                {!util.isThirdStore() && (
                  <Column
                    title="ERP编码"
                    dataIndex="erpGoodsInfoNo"
                    key="erpGoodsInfoNo"
                    width="12%"
                  />
                )}
                <Column
                  title="商品名称"
                  dataIndex="goodsInfoName"
                  key="goodsInfoName"
                  width={!util.isThirdStore() ? '20%' : '54%'}
                  render={(value) => {
                    return <div className="line-two">{value}</div>;
                  }}
                />

                {/* <Column
                  title="规格"
                  dataIndex="specText"
                  key="specText"
                  width="8%"
                  render={(value) => {
                    if (value) {
                      return <div>{value}</div>;
                    } else {
                      return '-';
                    }
                  }}
                /> */}

                <Column
                  title="分类"
                  key="cateName"
                  dataIndex="cateName"
                  width="8%"
                />
                {!util.isThirdStore() && (
                  <Column
                    title="适用区域"
                    dataIndex="wareName"
                    key="wareName"
                    width="10%"
                  />
                )}
                <Column
                  title="品牌"
                  key="brandName"
                  dataIndex="brandName"
                  width="8%"
                  render={(value) => {
                    if (value) {
                      return value;
                    } else {
                      return '-';
                    }
                  }}
                />

                <Column
                  title="销售价"
                  key="marketPrice"
                  width="8%"
                  render={(data) => {
                    let { specialPrice, marketPrice } = data;
                    marketPrice = specialPrice ? specialPrice : marketPrice;
                    return `¥${marketPrice}`;
                  }}
                />

                {/*  <Column
                                    title="库存"
                                    key="stock"
                                    dataIndex="stock"
                                    width="10%"
                                    render={(stock) => {
                                        if (stock < 20) {
                                            return (
                                                <div className="has-error">
                                                    <p>{stock}</p>
                                                    <div className="ant-form-explain">库存过低</div>
                                                </div>
                                            );
                                        } else {
                                            return stock;
                                        }
                                    }}
                                />*/}

                <Column
                  title="赠送数量"
                  className="centerItem"
                  key="count"
                  width="10%"
                  render={(row, _record, detailIndex) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `${row.goodsInfoId}level_detail${index}${detailIndex}`,
                          {
                            initialValue: fullGiftLevelList[index][
                              'fullGiftDetailList'
                            ][detailIndex]
                              ? fullGiftLevelList[index]['fullGiftDetailList'][
                                  detailIndex
                                ]['productNum']
                              : 1,
                            rules: [
                              { required: true, message: '必须输入赠送数量' },
                              {
                                pattern: ValidConst.noZeroNumber,
                                message: '只能是大于0的整数'
                              },
                              {
                                validator: (_rule, value, callback) => {
                                  if (
                                    value &&
                                    ValidConst.noZeroNumber.test(value) &&
                                    (value > 999 || value < 1)
                                  ) {
                                    callback('仅限1-999间的整数');
                                  }
                                  callback();
                                }
                              }
                            ]
                          }
                        )(
                          <InputNumber
                            min={0}
                            onChange={(val: string) => {
                              this.giftCountOnChange(index, detailIndex, val);
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  }}
                />

                <Column
                  title={this.titlereturn()}
                  className="centerItem"
                  key="boundsNum"
                  width="10%"
                  render={(row, _record, detailIndex) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `${row.goodsInfoId}_level_detail${index +
                            1}${detailIndex}`,
                          {
                            initialValue: fullGiftLevelList[index][
                              'fullGiftDetailList'
                            ][detailIndex]
                              ? fullGiftLevelList[index]['fullGiftDetailList'][
                                  detailIndex
                                ]['boundsNum']
                              : 1,
                            rules: [
                              // { required: true, message: '必须输入限赠送数量' },
                              {
                                pattern: ValidConst.noZeroNumber,
                                message: '只能是大于0的整数'
                              }
                              // {
                              //   validator: (_rule, value, callback) => {
                              //     if (
                              //       value &&
                              //       ValidConst.noZeroNumber.test(value) &&
                              //       (value > 999 || value < 1)
                              //     ) {
                              //       callback('仅限1-999间的整数');
                              //     }
                              //     callback();
                              //   }
                              // }
                            ]
                          }
                        )(
                          <InputNumber
                            min={0}
                            onChange={(val: string) => {
                              this.giftCountOnChangeboundsNum(
                                index,
                                detailIndex,
                                val
                              );
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  }}
                />

                <Column
                  title="操作"
                  key="operate"
                  width="10%"
                  render={(row) => {
                    return (
                      <a
                        onClick={() => this.deleteRows(index, row.goodsInfoId)}
                      >
                        删除
                      </a>
                    );
                  }}
                />
              </DataGrid>
              <FormItem key={index}>
                {getFieldDecorator(`level_${index}`, {})(<div />)}
              </FormItem>
            </div>
          );
        })}
        {/* 商家入驻需求 第三方商家隐藏添加多级促销 */}
        {!util.isThirdStore() && (
          <React.Fragment>
            <Button
              onClick={this.addLevels}
              disabled={fullGiftLevelList.length >= 5}
            >
              添加多级促销
            </Button>
            &nbsp;&nbsp;最多可设置5级
          </React.Fragment>
        )}
        {fullGiftLevelList.length > 0 && goodsModal._modalVisible && (
          <GoodsModal
            limitNOSpecialPriceGoods={true}
            key={goodsModal._forIndex}
            skuLimit={20}
            // wareId={wareId}
            //商家入驻需求 wareId传''
            wareId=""
            needHide
            showThirdColumn={util.isThirdStore()}
            visible={goodsModal._modalVisible}
            selectedSkuIds={this.getIdsFromLevel(
              fullGiftLevelList[goodsModal._forIndex]['fullGiftDetailList']
            )}
            selectedRows={fromJS(
              this.getSelectedRowByIds(
                this.getIdsFromLevel(
                  fullGiftLevelList[goodsModal._forIndex]['fullGiftDetailList']
                )
              )
            )}
            onOkBackFun={(selectedSkuIds, selectedRows) =>
              this.skuSelectedBackFun(
                goodsModal._forIndex,
                selectedSkuIds,
                selectedRows
              )
            }
            onCancelBackFun={this.closeGoodsModal}
          />
        )}
      </div>
    );
  }

  // 限赠送数量
  titlereturn = () => {
    return (
      <div>
        限赠送数量&nbsp;
        <Tooltip title="该商品的总赠送数量，赠完为止，默认为空，非必填">
          <Icon type="info-circle" />
        </Tooltip>
      </div>
    );
  };

  /**
   * 删除已经绑定的商品
   * @param index
   * @param goodsInfoId
   */
  deleteRows = (index, goodsInfoId) => {
    let { selectedRows, fullGiftLevelList } = this.state;
    const { onChangeBack } = this.props;
    fullGiftLevelList.forEach((level, key) => {
      if (key == index) {
        let levelIndex = level.fullGiftDetailList.findIndex(
          (detail) => detail.productId == goodsInfoId
        );
        if (levelIndex > -1) {
          level.fullGiftDetailList.splice(levelIndex, 1);
        }
      }
    });

    let flag = false;
    fullGiftLevelList.forEach((level) => {
      let levelIndex = level.fullGiftDetailList.findIndex(
        (detail) => detail.productId == goodsInfoId
      );
      if (levelIndex > -1) {
        flag = true;
        return;
      }
    });

    if (!flag) {
      //去除选中
      let rowIndex = selectedRows
        .toJS()
        .findIndex((row) => row.goodsInfoId == goodsInfoId);
      let newRows = selectedRows.toJS();
      //大于-1说明包含此元素
      if (rowIndex > -1) {
        newRows.splice(rowIndex, 1);
      }
      selectedRows = fromJS(newRows);
    }

    this.setState({
      selectedRows: selectedRows,
      fullGiftLevelList: fullGiftLevelList
    });
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 删除等级
   * @param index
   */
  deleteLevels = (index) => {
    let { fullGiftLevelList } = this.state;
    //重置表单的值
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullGiftLevelList.length - 1}`]: null
    });
    fullGiftLevelList.splice(index, 1);
    this.setState({ fullGiftLevelList: fullGiftLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 添加多级促销
   */
  addLevels = () => {
    const { fullGiftLevelList, isOverlap } = this.state;
    if (fullGiftLevelList.length >= 5) return;
    if (isOverlap) {
      Modal.info({
        title: '操作提示',
        content: (
          <div>
            <p>
              活动已设置叠加，不可再设置阶梯，需将活动
              叠加选项设置为“否”，再添加阶梯促销！
            </p>
          </div>
        )
      });
      return;
    }
    fullGiftLevelList.push({
      key: this.makeRandom(),
      fullAmount: null,
      fullCount: null,
      giftType: 1,
      fullGiftDetailList: []
    });
    this.setState({ fullGiftLevelList: fullGiftLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 初始化等级
   */
  initLevel = () => {
    const initLevel = [
      {
        key: this.makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        fullGiftDetailList: []
      }
    ];
    this.setState({ fullGiftLevelList: initLevel });
    console.log(initLevel, 'fullGiftLevelListfullGiftLevelList');

    const { onChangeBack } = this.props;
    onChangeBack(initLevel);
  };

  /**
   * 规则变更
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.state;
    this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
  };

  /**
   * 整个表单内容变化方法
   * @param index
   * @param props
   * @param value
   */
  onChange = (index, props, value) => {
    const { fullGiftLevelList } = this.state;
    fullGiftLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullGiftLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullGiftLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullGiftLevelList: fullGiftLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * sku选择之后的回调事件
   * @param index
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = (index, selectedSkuIds, selectedRows) => {
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    // console.log('qy>>>', selectedSkuIds, selectedRows)
    this.onChange(
      index,
      'fullGiftDetailList',
      selectedSkuIds.map((skuId) => {
        return { productId: skuId, productNum: 1, boundsNum: null };
      })
    );
    let rows = fromJS([]);
    selectedRows.map((e) => {
      const list = this.state.selectedRows.filter(
        (item) => item.get('erpGoodsInfoNo') === e.get('erpGoodsInfoNo')
      );
      if (list.length != 1) {
        rows = rows.push(e);
      }
    });

    let rowList = (rows.isEmpty() ? fromJS([]) : rows).concat(
      fromJS(this.state.selectedRows)
    );
    console.log(rowList.toJS(), 'rowListrowListrowList');

    this.setState({
      goodsModal: { _modalVisible: false },
      selectedRows: rowList
    });
  };

  /**
   * 满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChange = (index, detailIndex, count) => {
    let { fullGiftLevelList } = this.state;
    let fullGiftDetailList = fullGiftLevelList[index].fullGiftDetailList;
    fullGiftDetailList[detailIndex]['productNum'] = count;
    this.onChange(index, 'fullGiftDetailList', fullGiftDetailList);
  };
  /**
   * 限满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChangeboundsNum = (index, detailIndex, count) => {
    let { fullGiftLevelList } = this.state;
    let fullGiftDetailList = fullGiftLevelList[index].fullGiftDetailList;
    fullGiftDetailList[detailIndex]['boundsNum'] = count;
    this.onChange(index, 'fullGiftDetailList', fullGiftDetailList);
  };

  /**
   * 打开modal
   * @param index
   */
  openGoodsModal = (index) => {
    this.setState({ goodsModal: { _modalVisible: true, _forIndex: index } });
  };

  /**
   * 关闭modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 工具方法：通过选择id获取rows
   * @param ids
   * @returns {Array}
   */
  getSelectedRowByIds = (ids) => {
    let { selectedRows } = this.state;
    selectedRows = selectedRows ? selectedRows.toJS() : [];
    let temp = {};
    let result = [];
    selectedRows.map((item) => {
      if (!temp[item.goodsInfoNo]) {
        result.push(item);
        temp[item.goodsInfoNo] = true;
      }
    });
    console.log('>>>>selectedRows>>', result, 'ids', ids);
    selectedRows = fromJS(result);

    const rows = selectedRows.filter((row) =>
      ids.includes(row.get('goodsInfoId'))
    );
    return rows && !rows.isEmpty() ? rows.toJS() : [];
  };

  /**
   * 通过detailList获取id集合
   * @param detailList
   * @returns {Array}
   */
  getIdsFromLevel = (detailList) => {
    return detailList
      ? detailList.map((detail) => {
          return detail.productId;
        })
      : [];
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
}
