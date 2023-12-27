import * as React from 'react';
import { Relax } from 'plume2';
import styled from 'styled-components';

import {
  Table,
  Input,
  Row,
  Col,
  Form,
  InputNumber,
  message,
  Alert,
  Radio,
  Button,
  Switch,
  Select,
  TreeSelect,
} from 'antd';
const GreyText = styled.span`
  color: red;
  margin-left: 5px;
`;
import { IList, IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { noop, ValidConst, FindArea } from 'qmkit';

import ImageLibraryUpload from './image-library-upload';
import QrcodeLibraryUpload from './qrcode-library-upload';
import GoodsModal from './modoul/goods-modal';

import SelectedGoodsGrid from './selected-goods-grid';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { nextTick } from 'process';

const RadioGroup = Radio.Group;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};
const formItemLayouast = {
  // labelCol: {
  //   span: 1,
  //   xs: { span: 24 },
  //   sm: { span: 6 }
  // },
  // wrapperCol: {
  //   span: 24,
  //   xs: { span: 24 },
  //   sm: { span: 18 }
  // }
};
let isftree = true;

const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      goods: IMap;
      singleOrderAssignAreaList: IMap;
      singleOrderAssignAreaParam: IList;
      editGoods: Function;
      choseProductSkuId: Function;
      editGoodsItem: Function;
      updateeditGoodsisscatt: Function;
      gPack: Function;
      updateSkuForm: Function;
      modalVisible: Function;
      doInitGoodList: Function;
      clickImg: Function;
      removeImg: Function;
      removeQrImg: Function;
      syncErpStock: Function;
      editGoodsStock: Function;
      changePackWays: Function;
      changeArea: Function;
      changeAreas: Function;
      goodsSalesCountOfOneMonth: Function;
      singleOrderAssignArea: Function;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    goods: 'goods',
    singleOrderAssignAreaList: 'singleOrderAssignAreaList',
    singleOrderAssignAreaParam: 'singleOrderAssignAreaParam',
    editGoods: noop,
    editGoodsItem: noop,
    choseProductSkuId: noop,
    updateeditGoodsisscatt: noop,
    updateSkuForm: noop,
    modalVisible: noop,
    gPack: noop,
    doInitGoodList: noop,
    clickImg: noop,
    removeImg: noop,
    changeAreas: noop,
    goodsSalesCountOfOneMonth: noop,
    singleOrderAssignArea: noop,
    removeQrImg: noop,
    syncErpStock: noop,
    editGoodsStock: noop
  };

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this._store = ctx['_plume$Store'];
    const relaxProps = this._store.state();
    console.log(relaxProps.toJS(), '00000000000', props.goodsInfoVOS)
    // console.log(relaxProps.toJS(), 'relaxPropsrelaxPropsrelaxProps')
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      //营销活动已选的商品信息
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([]),
    }
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { updateSkuForm } = this.props.relaxProps;
    return (
      <WrapperForm
        ref={(form) => updateSkuForm(form)}
        relaxProps={this.props.relaxProps}
      />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  _stores: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };
  constructor(props, ctx) {
    super(props);
    this._stores = ctx['_plume$Store'];
    const relaxProps = this._stores.state();
    console.log(relaxProps.toJS(), '00000000000');
    // console.log(relaxProps.toJS(), 'relaxPropsrelaxPropsrelaxProps')
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      //营销活动已选的商品信息
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([]),
    }
  }
  componentWillReceiveProps(nextProps) {
    const relaxProps = this._stores.state();
    // const { singleOrderAssignAreaList} =
    // relaxProps;
    const choseProductGoodsInfo = relaxProps.get('singleOrderAssignAreaList').get('choseProductGoodsInfo');
    console.log(choseProductGoodsInfo ? choseProductGoodsInfo.toJS() : '', 'singleOrderAssignAreaList123');

    nextTick(() => {
      const { selectedRows, selectedSkuIds } = this.state;
      console.log('====================================');
      console.log(selectedRows.toJS(), '有商品', selectedSkuIds);
      console.log('====================================');
      if (selectedRows.toJS().length <= 0) {
        if (choseProductGoodsInfo && choseProductGoodsInfo.toJS()) {
          if (selectedSkuIds.indexOf(choseProductGoodsInfo.toJS().goodsInfoId) == -1) {
            selectedSkuIds.push(choseProductGoodsInfo.toJS().goodsInfoId);
          }
        }
      }
      this.setState({
        selectedRows: selectedRows.toJS().length > 0 ? selectedRows : fromJS(choseProductGoodsInfo ? [choseProductGoodsInfo.toJS()] : []), selectedSkuIds,
        goodsModal: {
          _selectedSkuIds: selectedSkuIds,
          _selectedRows: selectedRows.toJS().length > 0 ? selectedRows : fromJS(choseProductGoodsInfo ? [choseProductGoodsInfo.toJS()] : [])
        }
      });
    })

  }
  render() {
    const {
      selectedRows,
      skuExists,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { goodsList, goods, doInitGoodList, goodsSpecs, singleOrderAssignAreaList, singleOrderAssignAreaParam } =
      this.props.relaxProps;
    let goodsId;
    if (goodsList) {
      goodsId = goodsList.get(0).get('goodsInfoId');
    }

    const columns = this._getColumns();
    let tProps = {
      // treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择产地',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      style: {
        minWidth: 300
      }
    };
    const tPropsss = {
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '单笔订单指定限购区域',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      style: {
        minWidth: 300
      }
    };
    // const { singleOrderAssignAreaParam } = this.state().toJS();
    return (
      <div>
        <Alert message="您可在此对单个SKU的上下架状态进行设置" type="info" />
        <Form style={{ marginTop: 15, marginBottom: 20, overflowX: 'scroll' }}>
          <Row type="flex" justify="start">
            <Col span={8}>
              {/*<FormItem {...formItemLayout} label="门店价">*/}
              {/*{getFieldDecorator('marketPrice', {*/}
              {/*rules: [*/}
              {/*{*/}
              {/*required: true,*/}
              {/*message: '请填写门店价'*/}
              {/*},*/}
              {/*{*/}
              {/*pattern: ValidConst.zeroPrice,*/}
              {/*message: '请填写两位小数的合法金额'*/}
              {/*},*/}
              {/*{*/}
              {/*type: 'number',*/}
              {/*max: 9999999.99,*/}
              {/*message: '最大值为9999999.99',*/}
              {/*transform: function(value) {*/}
              {/*return isNaN(parseFloat(value)) ? 0 : parseFloat(value);*/}
              {/*}*/}
              {/*}*/}
              {/*],*/}
              {/*onChange: this._editGoods.bind(this, 'marketPrice'),*/}
              {/*initialValue: goods.get('marketPrice')*/}
              {/*})(<Input placeholder="请填写该SKU门店价，单位“元”" />)}*/}
              {/*</FormItem>*/}
            </Col>
          </Row>

          <Row type="flex" justify="start">
            <Col span={6}>
              <FormItem {...formItemLayout} label="上下架">
                {getFieldDecorator('addedFlag', {
                  rules: [
                    {
                      required: true,
                      message: '请选择上下架状态'
                    }
                  ],
                  onChange: this._editGoods.bind(this, 'addedFlag'),
                  initialValue: goods.get('addedFlag')
                })(
                  <RadioGroup>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="产地" {...formItemLayout}>
                {getFieldDecorator('originCode', {
                  initialValue: goods.get('originCode')
                })(
                  <TreeSelect
                    {...tProps}
                    // searchPlaceholder='请选择地区'
                    treeData={this._buildFreeAreaData('')}
                    onChange={(value, label) => {
                      this.changeArea(value, label);
                    }}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span={8}>
              <FormItem {...formItemLayout} label="商品起售数量设置">
                {getFieldDecorator('isStartBuyNum', {
                  rules: [
                    {
                      required: true,
                      message: '请选择商品起售数量设置'
                    }
                  ],
                  onChange: this._editGoods.bind(this, 'isStartBuyNum'),
                  initialValue: goods.get('isStartBuyNum') ? goods.get('isStartBuyNum') : 0
                })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            {goods.get('isStartBuyNum') ?
              <Col span={8}>
                <FormItem {...formItemLayout} label={`起售数量(${goods.get('goodsUnit')})`}>
                  {getFieldDecorator('startBuyNum',
                    {
                      rules: [
                        { required: true, message: '请输入起售数量' },
                        {
                          pattern: ValidConst.noZeroNineNumber,
                          message: message
                        }
                      ],
                      onChange: this._editGoods.bind(this, 'startBuyNum'),
                      initialValue: goods.get('startBuyNum') ? goods.get('startBuyNum') : 1
                    }
                  )(<InputNumber min={1} max={999999999}  />)}
                </FormItem>
              </Col> : ''
            }
          </Row>

          <Row type="flex" justify="start">
            <Col span={8}>
              <FormItem {...formItemLayout} label="商品询价设置">
                {getFieldDecorator('inquiryFlag', {
                  rules: [
                    {
                      required: true,
                      message: '请选择商品询价设置'
                    }
                  ],
                  onChange: this._editQueryPrice.bind(this, 'inquiryFlag'),
                  initialValue: goods.get('inquiryFlag') ? goods.get('inquiryFlag') : 0
                })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          {/* <Row  type="flex" justify="start">
            
          </Row> */}

          <div>
            <Table
              rowKey="id"
              dataSource={goodsList.toJS()}
              columns={columns}
              pagination={false}
            />
          </div>

        </Form>
        {/* 单笔定购 */}
        {/* {isftree ? */}
        <Row type="flex" justify="start" style={styles.rowflex}>
          {/* <Col span={8}> */}
          <div className="" style={styles.FormItemflex}>单笔订单指定限购区域：</div>
          {getFieldDecorator('singleOrderAssignArea', {
            initialValue: goods.get('singleOrderAssignArea')
              ? goods.get('singleOrderAssignArea').split(',')
              : null
          })(
            <TreeSelect
              {...tPropsss}
              allowClear
              // treeData={goods.get('allowedPurchaseArea')
              // ? goods.get('allowedPurchaseArea').split(',')
              // : []}
              treeData={this._buildFreeAreaData_singleOrderAssignAreaList('')}
              // treeData={this._buildFreeAreaData('')}
              onChange={(value, label) => {
                this.singleOrderchangeAreaect(value, label);
              }}
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            />

          )}
          <GreyText>如需修改<span style={{ fontSize: '24px' }}>指定区域销售</span>,请先删除包含单笔订单指定限购区域的地区。</GreyText>
          {/* </FormItem> */}
          {/* </Col> */}
        </Row>
        {/* : '' */}
        {/* } */}
        {goods.get('singleOrderAssignArea') || singleOrderAssignAreaParam.toJS().destinationArea.length > 0 ?
          <Row type="flex" justify="start">
            <Col span={8}>
              <FormItem {...formItemLayout} label="单笔订单限购数量">
                {getFieldDecorator('singleOrderPurchaseNum', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     whitespace: true,
                  //     message: '请填写单笔订单限购数量'
                  //   },
                  //   {
                  //     min: 1,
                  //     max: 20,
                  //     message: '1-20字符'
                  //   },
                  // ],
                  onChange: this._editGoods.bind(this, 'singleOrderPurchaseNum'),
                  initialValue: goods.get('singleOrderPurchaseNum')
                })(<Input />)}
              </FormItem>
            </Col>
          </Row> : ''
        }
        {/* 是否可关联商品 */}
        <Row type="flex" justify="start" style={styles.rowflex}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="是否关联商品">
              {getFieldDecorator('isSuitGoods', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否关联商品状态'
                  }
                ],
                onChange: this._editQueryPrice.bind(this, 'isSuitGoods'),
                initialValue: goods.get('isSuitGoods') ? goods.get('isSuitGoods') : 0
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        {goods.get('isSuitGoods') ?
          <Col >
            <FormItem {...formItemLayouast} label="指定商品" required={true}>
              {getFieldDecorator(
                'goods',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={this.openGoodsModal}
                    >
                      添加指定商品
                    </Button>
                    &nbsp;&nbsp;
                    <div>仅限1个指定商品</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku}
                    cheBOx={this.cheBOx}
                    purChange={this.purChange}
                  />
                </div>
              )}
            </FormItem>
          </Col> : ''
        }
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          // marketingId={marketingId}
          skuLimit={1}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />

      </div >
    );
  }


  /**
 * 关闭货品选择modal
 */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedSkuIds, selectedRows'
    );
    const { choseProductSkuId } = this.props.relaxProps;
    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    if (selectedSkuIds.length > 0) {
      this.props.form.resetFields('goods');
      choseProductSkuId(selectedSkuIds);
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
      console.log('====================================');
      console.log(selectedSkuIds, selectedRows.toJS(), 'selectedRowsselectedRows123123');
      console.log('====================================');
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
  };
  purChange = (value, id) => {
    // console.log('====================================');
    // console.log(value, 'valuevalue');
    // console.log('====================================');
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.purchaseNum = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  cheBOx = (id) => {
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    // console.log('99999999999999----删除', skuId)
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    });
  };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    // selectedRows.toJS().forEach((item) => {
    //   if (selectedSkuIds.indexOf(item.goodsInfoId) == -1) {
    //     selectedSkuIds.push(item.marketingVO ? item.marketingVO.goodsInfoId : item.goodsInfoId)
    //   }
    // })

    // console.log(
    //   selectedSkuIds,
    //   selectedRows.toJS(),
    //   'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    // );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      goodsSpecs,
      modalVisible,
      clickImg,
      removeImg,
      removeQrImg,
      syncErpStock,
      changePackWays,
      goods
    } = this.props.relaxProps;
    // console.log('====================================');
    // console.log(goods.get('allowedPurchaseArea'), '222222');
    // console.log('====================================');

    let columns: any = goodsSpecs
      .map((item) => {
        return {
          title: item.get('specName'),
          dataIndex: 'specId-' + item.get('specId'),
          key: item.get('specId')
        };
      })
      .toList();

    columns = columns.unshift({
      title: '图片',
      key: 'img',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return (
          <div>
            <FormItem>
              <ImageLibraryUpload
                images={images}
                modalVisible={modalVisible}
                clickImg={clickImg}
                removeImg={removeImg}
                imgCount={1}
                imgType={1}
                skuId={rowInfo.id}
              />
            </FormItem>
          </div>
        );
      }
    });

    columns = columns.unshift({
      title: '',
      key: 'index',
      dataIndex: 'index'
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          SKU编码
        </div>
      ),
      key: 'goodsInfoNo',
      width: '13%',
      render: (rowInfo) => {
        return (
          <Row>
            <Col>
              <FormItem>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: '请填写SKU编码'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20字符'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'goodsInfoNo'
                  ),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          ERP编码
        </div>
      ),
      key: 'erpGoodsInfoNo',
      width: '10%',
      render: (rowInfo) => {
        return (
          <Row>
            <Col>
              <FormItem>
                {getFieldDecorator('erpGoodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写erp编码'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20字符'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'erpGoodsInfoNo'
                  ),
                  initialValue: rowInfo.erpGoodsInfoNo
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          门店价
        </div>
      ),
      key: 'marketPrice',
      width: '8%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem>
              {getFieldDecorator('marketPrice_' + rowInfo.id, {
                rules: [
                  {
                    required: true,
                    message: '请填写门店价'
                  },
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],

                onChange: this._editGoods.bind(this, 'marketPrice'),
                initialValue: rowInfo.marketPrice || 0
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          大客户价
        </div>
      ),
      key: 'vipPrice',
      width: '9%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem>
              {getFieldDecorator('vipPrice_' + rowInfo.id, {
                rules: [
                  {
                    required: true,
                    message: '请填写大客户价'
                  },
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],

                onChange: this._editGoods.bind(this, 'vipPrice'),
                initialValue: rowInfo.vipPrice || 0
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: '库存',
      key: 'stock',
      width: '15%',
      render: (rowInfo) => {
        const goodsWareStocks = fromJS(
          rowInfo.goodsWareStocks ? rowInfo.goodsWareStocks : []
        );
        return (
          <Row>
            <Col>
              {goodsWareStocks.size == 0
                ? '暂无数据'
                : goodsWareStocks.map((item) => {
                  return (
                    <FormItem>
                      <span>{item.get('wareName')}</span> &nbsp;&nbsp;
                      {getFieldDecorator(
                        'goodsWareStocks_' + item.get('id'),
                        {
                          rules: [
                            {
                              pattern: ValidConst.number,
                              required: true,
                              message: '请输入库存数量'
                            }
                          ],
                          onChange: this._editGoodsStockWare.bind(
                            this,
                            rowInfo.id,
                            item.get('id'),
                            'stock'
                          ),
                          initialValue: item.get('stock')
                        }
                      )(<Input style={styles.wareStock} />)}
                    </FormItem>
                  );
                })}
            </Col>
          </Row>
        );
      }
    });
    // columns = columns.push({
    //   title: '虚拟库存',
    //   key: 'stock',
    //   width: '15%',
    //   render: (rowInfo) => {
    //     return (
    //       <Row>
    //         <Col>
    //           <FormItem>
    //             <span>虚拟库存</span> &nbsp;&nbsp;
    //             {getFieldDecorator(
    //               'virtualStock',
    //               { 
    //                 rules: [
    //                   {
    //                     pattern: ValidConst.number,
    //                     required: true,
    //                     message: '请输入虚拟库存库存数量'
    //                   }
    //                 ],
    //                 // onChange: this._editGoodsStockWare.bind(
    //                 //   this,
    //                 //   rowInfo.id,
    //                 //   rowInfo.get('virtualStock').get('id'),
    //                 //   'virtualStock'
    //                 // ),
    //                 onChange: this._editGoods.bind(this, 'virtualStock'),
    //                 initialValue: rowInfo.virtualStock ? rowInfo.virtualStock : 0
    //               }
    //             )(<Input style={styles.wareStock} />)}
    //           </FormItem>
    //         </Col>
    //       </Row>
    //     );
    //   }
    // });

    columns = columns.push({
      title: '包装类型',
      key: 'isScatteredQuantitative',
      width: '6%',
      render: (rowInfo) => {
        const { updateeditGoodsisscatt } = this.props.relaxProps;
        return (
          <Row>
            <Col>
              <FormItem>
                {getFieldDecorator('isScatteredQuantitative_' + rowInfo.id, {
                  initialValue:
                    rowInfo.isScatteredQuantitative == null || rowInfo.isScatteredQuantitative == -1 ? '其他' : rowInfo.isScatteredQuantitative == 0 ? '散称' : '定量',
                  // onChange: this._editGoods.bind(this, 'isScatteredQuantitative'),
                  onChange: this._editGoodsisscatt
                  // onChange: updateeditGoodsisscatt.bind(
                  //   this,
                  //   rowInfo.id,
                  //   'isScatteredQuantitative'
                  // )
                })(
                  <Select style={{ width: '70px' }}>
                    <Option value="0">散称</Option>
                    <Option value="1">定量</Option>
                    <Option value="-1">其他</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: '指定区域销售',
      key: 'allowedPurchaseArea',
      width: '15%',
      render: (rowInfo) => {
        const goodsWareStocks = fromJS(
          rowInfo.goodsWareStocks ? rowInfo.goodsWareStocks : []
        );
        const tPropss = {
          treeCheckable: true,
          showCheckedStrategy: SHOW_PARENT,
          searchPlaceholder: '请选择地区',
          dropdownStyle: { maxHeight: 400, overflow: 'auto' },
          style: {
            minWidth: 300
          }
        };
        return (
          <Row>
            <Col>
              {/* <FormItem
                style={{
                  display: 'inline-block',
                  marginBottom: 0,
                  width: '80%'
                }}
              >
                {getFieldDecorator('destinationArea', {
                   initialValue: areaAry.toJS() 注释 
                })(
                  <TreeSelect
                    {...tProps} 注释
                    style={{ width: '100px' }}
                    treeData={this._buildFreeAreaData('')}
                    onChange={(value, label) => {
                    }}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              </FormItem> */}
              <FormItem
                style={{
                  display: 'inline-block',
                  marginBottom: 0,
                  width: '80%'
                }}
              >
                <Switch
                  checkedChildren="全选"
                  unCheckedChildren="全选"
                  checked={goods.get('allowedPurchaseArea') ? goods.get('allowedPurchaseArea').split(',').length == 34 ? true : false : false}
                  onChange={(e) => {
                    // console.log(e, '123123123');
                    if (e) {
                      const allowedPurchaseArea = ['110000', '120000', '130000', '140000', '150000', '210000', '220000', '230000', '310000', '320000', '330000', '340000', '350000', '360000', '370000', '410000', '420000', '430000', '440000', '450000', '460000', '500000', '510000', '520000', '530000', '540000', '610000', '620000', '630000', '640000', '650000', '710000', '810000', '820000'];
                      const allowedPurchaseAreaName = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'];
                      this.changeAreaect(allowedPurchaseArea, allowedPurchaseAreaName);
                    } else {
                      this.changeAreaect([], []);
                    }
                  }}
                />
                {getFieldDecorator('allowedPurchaseArea', {
                  initialValue: goods.get('allowedPurchaseArea')
                    ? goods.get('allowedPurchaseArea').split(',')
                    : null
                  //   initialValue: ["220200",
                  //    "220300",
                  //    "220400",
                  //    "220500",
                  //    "220600",
                  //    "220700",
                  //  "220800",
                  //   ]
                })(
                  <TreeSelect
                    {...tPropss}
                    treeData={this._buildFreeAreaData('')}
                    onChange={(value, label) => {
                      this.changeAreaect(value, label);
                    }}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          条形码
        </div>
      ),
      key: 'goodsInfoBarcode',
      width: '12%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem>
              {getFieldDecorator('goodsInfoBarcode_' + rowInfo.id, {
                rules: [
                  {
                    pattern: ValidConst.thirteenNineNumber,
                    message: '不超过20位'
                  }
                ],
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'goodsInfoBarcode'
                ),
                initialValue: rowInfo.goodsInfoBarcode
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    // columns = columns.push({
    //   title: '二维码',
    //   key: 'goodsInfoQrcode',
    //   render: (rowInfo) => {
    //     const qrCodeImages = fromJS(
    //       rowInfo.qrCodeImages ? rowInfo.qrCodeImages : []
    //     );
    //     return (
    //       <div>
    //         <FormItem>
    //           <QrcodeLibraryUpload
    //             qrCodeImages={qrCodeImages}
    //             modalVisible={modalVisible}
    //             clickImg={clickImg}
    //             removeQrImg={removeQrImg}
    //             imgCount={1}
    //             imgType={-1000}
    //             skuId={rowInfo.id}
    //           />
    //         </FormItem>
    //       </div>
    //     );
    //   }
    // });

    columns = columns.push({
      title: '操作',
      key: 'opt',
      render: (rowInfo) => (
        <div>
          <a
            onClick={() =>
              syncErpStock(rowInfo.erpGoodsInfoNo, rowInfo.goodsInfoId)
            }
          >
            库存同步
          </a>
        </div>
      )
    });

    return columns.toJS();
  };
  changeAreaect = (value, label) => {
    const { goodsSalesCountOfOneMonth, editGoods, singleOrderAssignArea, goods } = this.props.relaxProps;
    const goods_goods = Map({
      allowedPurchaseArea: value.join(',')
    });
    const goodss = Map({
      singleOrderAssignArea: ''
    });
    const goodsss = Map({
      singleOrderPurchaseNum: ''
    });
    editGoods(goodsss);
    editGoods(goodss);
    editGoods(goods_goods);
    this._buildFreeAreaData_singleOrderAssignAreaList('');
    singleOrderAssignArea([], []);
    // console.log(value, label, '1222222222222',);
    goodsSalesCountOfOneMonth(value, label);

  };
  // 单笔指定销售区域
  singleOrderchangeAreaect = (value, label) => {
    const { singleOrderAssignArea, editGoods } = this.props.relaxProps;
    if (value.length == 0) {
      const goodsss = Map({
        singleOrderPurchaseNum: ''
      });
      editGoods(goodsss);
      console.log(value, label, '11111');

    }
    singleOrderAssignArea(value, label);
  };

  changeArea = (value, label) => {
    const { changeAreas } = this.props.relaxProps;
    // const araea = FindArea.findProvinceCity([]);
    // araea
    changeAreas(value, label);
  };
  _editGoodsisscatt = (e: string) => {
    // console.log('====================================');
    // console.log(e, '2222222222222');
    // console.log('====================================');
    sessionStorage.setItem('isScatteredQuantitative', e);
    // const { updateeditGoodsisscatt } = this.props.relaxProps;
    // updateeditGoodsisscatt(e);
  };

  editchange = (id: string, key: string, e: any) => {
    const { editGoodsItem } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    // console.info(key);
    // console.info(e, '---editchange---');
    //this.state.set("selectList",{id,e})
    editGoodsItem(id, key, e);
  };

  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods, goods } = this.props.relaxProps;
    if (key == 'singleOrderPurchaseNum') {
      if (e < 0) {
        message.error('请填写大于0的值')
        // return
      }
      // else if(e.target.value > goods.get('stock')){
      //   message.error('请填写小于库存值')
      //   // return
      // }
    }
    if (e && e.target) {
      e = e.target.value;
    }
    const goodss = Map({
      [key]: e
    });
    console.log(key, e, 'goodsgoods');

    editGoods(goodss);
  };

  /**
   * 修改商品询价设置项
   */
  _editQueryPrice = (key: string, e) => {
    const { editGoods } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    const goods = Map({
      [key]: e
    });

    editGoods(goods);
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    console.info(id);
    console.info(key);
    console.info(e);
    editGoodsItem(id, key, e);
  };

  /**
   * 修改商品库存
   */
  _editGoodsStockWare = (
    id: string,
    storeWareId: number,
    key: string,
    e: any
  ) => {
    const { editGoodsStock } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    editGoodsStock(id, storeWareId, key, e);
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { _file, fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (
          file.status == 'done' &&
          file.response != null &&
          file.response.message != null
        ) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter(
          (file) =>
            file.status == 'done' &&
            file.response != null &&
            file.response.message == null
        );
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
 * 指定限购区域
 */
  _buildFreeAreaData_singleOrderAssignAreaList = (id) => {
    const { singleOrderAssignAreaList, goods } = this.props.relaxProps;
    const allarea = goods.toJS().allowedPurchaseArea ? goods.toJS().allowedPurchaseArea.split(',') : [];
    // const allname = singleOrderAssignAreaList.toJS().allowedPurchaseAreaName;
    // console.log('123234324', goods);
    console.log('123234324', goods.toJS().allowedPurchaseArea);
    const Finlcity = FindArea.findProvinceCity([]);
    // console.log(Finlcity, 'Finlcity');
    const allcityArray = [];
    if (allarea.length > 0) {
      Finlcity.forEach(finel => {
        allarea.forEach(areael => {
          if (areael == finel.key) {
            allcityArray.push(finel);
          } else {
            if (finel.children) {
              finel.children.forEach(chilel => {
                if (areael == chilel.key) {
                  allcityArray.push(chilel);
                }
              })
            }
          }
        });
      });
    }

    return allcityArray;
  };
  /**
   * 构建地区数据
   */
  _buildFreeAreaData = (id) => {

    return FindArea.findProvinceCity([]);
  };
}
const styles = {
  wareStock: {
    width: '80px'
  },
  FormItemflex: {
    color: 'rgba(0, 0, 0, 0.85)'
  },
  rowflex: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  }
};
