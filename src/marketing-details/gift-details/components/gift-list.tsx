import * as React from 'react';
import { Table, Row, Col, Button, InputNumber, Tooltip, Icon } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, DataGrid, util } from 'qmkit';

import { GoodsModal } from 'biz';

const { Column } = Table;

import styled from 'styled-components';

const GreyBg = styled.div`
  padding: 15px 0 15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@withRouter
@Relax
export default class GiftList extends React.Component<any, any> {
  props: {
    have: String;
    history?: any;
    onChangeBack: Function;
    relaxProps?: {
      levelList: IList;
      giftList: IList;
      brands: IList;
      cates: IList;
      subType: any;
      isShowActiveStatus: Boolean;
      oneGifTermination: Function;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    giftList: 'giftList',
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    subType: 'subType',
    isShowActiveStatus: 'isShowActiveStatus',
    oneGifTermination: noop
  };
  state = {
    isFullCount: null,
    selectedRows: null,
    wareId: null,
    fullGiftLevelList: [],
    //公用的商品弹出框
    goodsModal: {
      _modalVisible: false,
      _forIndex: 0
    },
    selectedSkuIds: [],
    originId: []
  };
  componentWillReceiveProps(nextProps) {
    this.initLevel();
    let idS = nextProps.relaxProps.giftList.toJS().map((e) => e.goodsInfoId);
    this.setState({
      wareId: nextProps.relaxProps.giftList.toJS()[0]
        ? nextProps.relaxProps.giftList.toJS()[0].wareId
        : '',
      selectedSkuIds: idS,
      originId: idS
    });
    // const {
    //   marketingScopeList
    // } = nextProps.relaxProps;
    // const ids = marketingScopeList.toJS().map((e) => e.scopeId).join(',').split(',');
    // this.setState({
    //   selectedSkuIds: ids,
    // })
    // console.log(marketingScopeList.toJS(), '123123123');
  }

  render() {
    const {
      levelList,
      giftList,
      brands,
      cates,
      subType,
      isShowActiveStatus,
      oneGifTermination
    } = this.props.relaxProps;
    const { have } = this.props;
    const {
      fullGiftLevelList,
      goodsModal,
      wareId,
      selectedSkuIds,
      selectedRows
    } = this.state;
    let skuList = fromJS(giftList);
    let brandList = fromJS(brands ? brands : []);
    let cateList = fromJS(cates ? cates : []);
    let dataSource = levelList.map((level) => {
      level = level.set(
        'fullGiftDetailList',
        level.get('fullGiftDetailList').map((gift) => {
          const sku = skuList.find(
            (s) => s.get('goodsInfoId') === gift.get('productId')
          );
          gift = gift.set('sku', sku);

          const cId = sku.get('cateId');
          const cate = cateList.find((s) => s.get('cateId') === cId);
          gift = gift.set('cateName', cate ? cate.get('cateName') : '');

          const bId = sku.get('brandId');
          const brand = brandList.find((s) => s.get('brandId') === bId);
          gift = gift.set('brandName', brand ? brand.get('brandName') : '');
          return gift;
        })
      );
      return level;
    });
    console.log(dataSource.toJS(), 'nextPropsnextProps');

    const isThird = util.isThirdStore();
    return (
      <div>
        {have && have == '9' && (
          <Button
            type="primary"
            icon="plus"
            style={{ marginTop: 20 }}
            onClick={() => {
              this.openGoodsModal();
            }}
          >
            添加赠品
          </Button>
        )}
        {dataSource.toJS().map((level) => (
          <div key={Math.random()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <span>规则：</span>满
                  {level.fullAmount ? level.fullAmount : level.fullCount}
                  {subType == '4' ? '元' : '件'}{' '}
                  {level.giftType == '1' ? '可选一种' : '默认全赠'}
                </Col>
              </Row>
            </GreyBg>

            <Table
              dataSource={level.fullGiftDetailList}
              pagination={false}
              rowKey="giftDetailId"
            >
              {!isThird && (
                <Column
                  width="10%"
                  title="SKU编码"
                  key="goodsInfoNo"
                  render={(rowInfo) => <div>{rowInfo.sku.goodsInfoNo}</div>}
                />
              )}
              {!isThird && (
                <Column
                  width="15%"
                  title="ERP编码"
                  key="erpGoodsInfoNo"
                  render={(rowInfo) => <div>{rowInfo.sku.erpGoodsInfoNo}</div>}
                />
              )}
              <Column
                width={!isThird ? '25%' : '50%'}
                title="商品名称"
                key="goodsInfoName"
                render={(rowInfo) => <div>{rowInfo.sku.goodsInfoName}</div>}
              />
              <Column
                width="12%"
                title="类目"
                key="cateName"
                render={(rowInfo) => (
                  <div>{rowInfo.cateName ? rowInfo.cateName : '-'}</div>
                )}
              />
              <Column
                width="10%"
                title="品牌"
                key="brandName"
                render={(rowInfo) => (
                  <div>{rowInfo.brandName ? rowInfo.brandName : '-'}</div>
                )}
              />
              <Column
                width="8%"
                key="priceType"
                title={'销售价'}
                render={(rowInfo) => {
                  let price = rowInfo.sku.salePrice;
                  if (rowInfo.sku.goodsInfoType == 1) {
                    price = rowInfo.sku.specialPrice;
                  }
                  return <div>{price}</div>;
                }}
              />
              <Column
                width="7%"
                title="赠送数量"
                key="productNum"
                dataIndex="productNum"
              />
              <Column
                width="7%"
                title="限赠送数量"
                key="boundsNum"
                dataIndex="boundsNum"
              />
              {isShowActiveStatus ? (
                <Column
                  width="15%"
                  key="operation"
                  title={'操作'}
                  render={(rowInfo) => (
                    // <AuthWrapper functionName="f_marketing_view">
                    <AuthWrapper functionName="f_marketing_view-tow">
                      <a
                        href="javascript:;"
                        onClick={() => oneGifTermination(rowInfo, have)}
                      >
                        {rowInfo.terminationFlag == 0 ? '终止' : ''}
                      </a>
                      {rowInfo.terminationFlag != 0 ? '已终止' : ''}
                    </AuthWrapper>
                  )}
                />
              ) : null}
            </Table>
          </div>
        ))}
        {fullGiftLevelList.length > 0 &&
          fullGiftLevelList[0].fullGiftDetailList.length > 0 &&
          selectedRows && (
            <div style={{ marginTop: 20 }}>
              <div>新增的赠品列表</div>
              {this.gifList()}
            </div>
          )}
        {fullGiftLevelList.length > 0 && goodsModal._modalVisible && (
          <GoodsModal
            limitNOSpecialPriceGoods={true}
            key={goodsModal._forIndex}
            skuLimit={20}
            wareId={wareId}
            visible={goodsModal._modalVisible}
            // selectedSkuIds={this.getIdsFromLevel(
            //   fullGiftLevelList[0].fullGiftDetailList
            // )}
            needHide
            selectedSkuIds={selectedSkuIds}
            selectedRows={fromJS(
              this.getSelectedRowByIds(
                this.getIdsFromLevel(fullGiftLevelList[0].fullGiftDetailList)
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
  gifList = () => {
    const {
      fullGiftLevelList,
      goodsModal,
      wareId,
      selectedRows,
      originId
    } = this.state;
    console.log(selectedRows.toJS(), 'selectedRows');
    const rows = [];
    selectedRows.toJS().forEach((element) => {
      if (originId.indexOf(element.goodsInfoId) == -1) {
        rows.push(element);
      }
    });
    return (
      <div>
        {fullGiftLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.giftLevelId}>
              <DataGrid
                scroll={{ y: 500 }}
                size="small"
                rowKey={(record) => record.goodsInfoId}
                dataSource={rows ? rows : []}
                pagination={false}
              >
                <Column
                  title="SKU编码"
                  dataIndex="goodsInfoNo"
                  key="goodsInfoNo"
                  width="12%"
                />
                <Column
                  title="ERP编码"
                  dataIndex="erpGoodsInfoNo"
                  key="erpGoodsInfoNo"
                  width="12%"
                />
                <Column
                  title="商品名称"
                  dataIndex="goodsInfoName"
                  key="goodsInfoName"
                  width="20%"
                  render={(value) => {
                    return <div className="line-two">{value}</div>;
                  }}
                />

                <Column
                  title="分类"
                  key="cateName"
                  dataIndex="cateName"
                  width="8%"
                />
                <Column
                  title="适用区域"
                  dataIndex="wareName"
                  key="wareName"
                  width="10%"
                />

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
                  title="单价"
                  key="marketPrice"
                  width="8%"
                  render={(data) => {
                    let { specialPrice, marketPrice } = data;
                    marketPrice = specialPrice ? specialPrice : marketPrice;
                    return `¥${marketPrice}`;
                  }}
                />

                <Column
                  title="赠送数量"
                  className="centerItem"
                  key="count"
                  width="10%"
                  render={(row, _record, detailIndex) => {
                    return (
                      <InputNumber
                        min={0}
                        defaultValue={1}
                        initialValue={
                          fullGiftLevelList[index]['fullGiftDetailList'][
                            detailIndex
                          ]
                            ? fullGiftLevelList[index]['fullGiftDetailList'][
                                detailIndex
                              ]['productNum']
                            : 1
                        }
                        onChange={(val: string) => {
                          this.giftCountOnChange(index, detailIndex, val, row);
                        }}
                      />
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
                      <InputNumber
                        min={0}
                        initialValue={
                          fullGiftLevelList[index]['fullGiftDetailList'][
                            detailIndex
                          ]
                            ? fullGiftLevelList[index]['fullGiftDetailList'][
                                detailIndex
                              ]['boundsNum']
                            : 1
                        }
                        onChange={(val: string) => {
                          this.giftCountOnChangeboundsNum(
                            index,
                            detailIndex,
                            val,
                            row
                          );
                        }}
                      />
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
            </div>
          );
        })}
      </div>
    );
  };

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
    // this.props.form.setFieldsValue({
    //   [`level_rule_value_${fullGiftLevelList.length - 1}`]: null
    // });
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
    const { fullGiftLevelList } = this.state;
    if (fullGiftLevelList.length >= 5) return;
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
    // console.log(initLevel, 'fullGiftLevelListfullGiftLevelList');

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
    fullGiftLevelList[0][props] = value;
    if (props == 'fullAmount') {
      fullGiftLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullGiftLevelList[index]['fullAmount'] = null;
    }
    console.log(fullGiftLevelList, 'fullGiftLevelListfullGiftLevelList452');

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
    console.log(this.state.selectedSkuIds);
    const ids = [];
    const rowaitme = [];
    // selectedSkuIds.forEach(element => {
    //   if(this.state.selectedSkuIds.indexOf(element) == -1) {
    //     ids.push(element)
    //   }
    // });
    // selectedRows.toJS().forEach(elements => {
    //   if(this.state.selectedSkuIds.indexOf(elements.goodsInfoId) == -1) {
    //     rowaitme.push(elements)
    //   }
    // });
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    // console.log('qy>>>', selectedSkuIds, selectedRows.toJS())
    this.onChange(
      index,
      'fullGiftDetailList',
      selectedSkuIds.map((skuId) => {
        return { productId: skuId, productNum: 1, boundsNum: null };
      })
    );
    // console.log(selectedSkuIds,'selectedSkuIdsselectedSkuIds',ids);

    // let rows = fromJS([]);
    // this.state.selectedRows && selectedRows.map((e) => {
    //   const list = this.state.selectedRows.filter(
    //     (item) => item.get('erpGoodsInfoNo') === e.get('erpGoodsInfoNo')
    //   );
    //   if (list.length != 1) {
    //     rows = rows.push(e);
    //   }
    // });

    let rowList = (selectedRows.isEmpty() ? fromJS([]) : selectedRows).concat(
      fromJS(this.state.selectedRows)
    );
    // console.log(rowList.toJS(), 'rowListrowListrowList');

    this.setState({
      goodsModal: { _modalVisible: false },
      selectedRows: selectedRows,
      selectedSkuIds: selectedSkuIds
    });
  };

  /**
   * 满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChange = (index, detailIndex, count, row) => {
    let { fullGiftLevelList } = this.state;
    fullGiftLevelList[0].fullGiftDetailList.forEach((element) => {
      if (row.goodsInfoId == element.productId) {
        element.productNum = count;
      }
    });
    this.onChange(
      index,
      'fullGiftDetailList',
      fullGiftLevelList[0].fullGiftDetailList
    );
  };
  /**
   * 限满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChangeboundsNum = (index, detailIndex, count, row) => {
    let { fullGiftLevelList } = this.state;
    fullGiftLevelList[0].fullGiftDetailList.forEach((element) => {
      if (row.goodsInfoId == element.productId) {
        element.boundsNum = count;
      }
    });
    this.onChange(
      index,
      'fullGiftDetailList',
      fullGiftLevelList[0].fullGiftDetailList
    );
  };

  /**
   * 打开modal
   * @param index
   */
  openGoodsModal = () => {
    const { fullGiftLevelList } = this.state;
    this.setState({
      goodsModal: { _modalVisible: true, _forIndex: fullGiftLevelList[0].key }
    });
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
    console.log(selectedRows, 'selectedRowsselectedRowsselectedRows123');

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
