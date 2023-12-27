import * as React from 'react';
import { fromJS, List } from 'immutable';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Popconfirm,
  notification,
  InputNumber,
  Tabs
} from 'antd';
import { Const, history, QMMethod, util } from 'qmkit';
import moment from 'moment';
import { SelectedGoodsModal } from 'biz';
import SelectedGoodsGrid from './selected-goods-grid';

import * as webapi from '../webapi';
import { string } from 'prop-types';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;
const Confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

export default class StockActivityForm extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    const relaxProps = props.store.state();
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //营销活动已选的商品信息
      selectedSkuIds: fromJS({}),
      selectedRows: fromJS({}),
      //全部等级
      customerLevel: [],
      //选择的等级
      selectedLevelIds: [],
      //营销实体
      marketingBean: relaxProps.get('marketingBean'),
      type: relaxProps.get('type'),
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //满金额还是满数量还是订单满赠 （4：满金额，5：满数量，6：满订单，7:满订单减，8:满订单折）
      isFullCount: null,
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      saveLoading: false
    };
  }

  componentDidMount() {
    this.init();
  }
 
  render() {
    const { marketingType, form, marketingId, fztype } = this.props;

    const { getFieldDecorator } = form;

    const {
      customerLevel,
      selectedRows,
      marketingBean,
      level,
      isFullCount,
      skuExists,
      saveLoading
    } = this.state;
    // console.log(marketingBean.toJS(), '123123999');
    // const isShowOverlap =
    //   (Enum.GET_MARKETING_STRING(marketingType) == '减' && isFullCount != 2) ||
    //   (Enum.GET_MARKETING_STRING(marketingType) == '赠' && isFullCount != 2);
    const wareHouseVOPage = JSON.parse(localStorage.getItem('warePage')) || [];
    return (
      <Form
        onSubmit={(e) => this.handleSubmit(e)}
        style={{ marginTop: 20 }}
      >
        <FormItem {...smallformItemLayout} label="囤货活动名称">
          {getFieldDecorator('activityName', {
            rules: [
              { required: true, whitespace: true, message: '请填写囤货活动名称' },
              { min: 1, max: 40, message: '1-40字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '囤货活动名称');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ activityName: e.target.value }),
            initialValue: marketingBean.get('activityName')
          })(
            <Input
              disabled={marketingBean.get('state')?true:false}
              placeholder="请填写活动名称，不超过40字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开始时间">
          {getFieldDecorator('startTime', {
            rules: [
              { required: true, message: '请选择开始时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date()).hour(0).minute(0).second(0).unix() >
                    value.unix()&&!marketingBean.get('state')
                  ) {
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              console.log(date,dateString)
              if (dateString) {
                this.onBeanChange({
                  startTime: dateString + ':00'
                });
              }else{
                this.onBeanChange({
                  startTime: ''
                });
              }
            },
            initialValue: marketingBean.get('startTime')?moment(marketingBean.get('startTime'),Const.DATE_FORMAT):marketingBean.get('startTime')
          })(
            <DatePicker
              disabledDate={this.disabledStartDate}
              disabled={marketingBean.get('state')?true:false}
              showTime={{ format: 'HH:mm' }}
              format={Const.DATE_FORMAT}
              placeholder="开始时间"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="结束时间">
          {getFieldDecorator('endTime', {
            rules: [
              { required: true, message: '请选择结束时间' },
            ],
            onChange: (date, dateString) => {
              if (dateString) {
                this.onBeanChange({
                  endTime: dateString + ':00'
                });
              }else{
                this.onBeanChange({
                  endTime: ''
                });
              }
            },
            initialValue: marketingBean.get('endTime')?moment(marketingBean.get('endTime'),Const.DATE_FORMAT):marketingBean.get('endTime')
          })(
            <DatePicker
              disabledDate={this.disabledEndDate}
              showTime={{ format: 'HH:mm' }}
              format={Const.DATE_FORMAT}
              placeholder="结束时间"
            />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date()).hour(0).minute(0).second(0).unix() >
                    value[0].unix()
                  ) {
                    // console.log(value[0], '22222');
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                this.onBeanChange({
                  startTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },
            initialValue: marketingBean.get('startTime') &&
              marketingBean.get('endTime') && [
                moment(marketingBean.get('startTime')),
                moment(marketingBean.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format={Const.DATE_FORMAT}
              placeholder={['起始时间', '结束时间']}
              showTime={{ format: 'HH:mm' }}
            />
          )}
        </FormItem> */}
        <FormItem {...formItemLayout} label='囤货类型'>
          {getFieldDecorator('pileActivityType', {
            rules: [{ required: true, message: '请选择囤货类型' }],
            initialValue: marketingBean.get('pileActivityType')
          })(
            <RadioGroup >
              <Radio value={0}>
                全款囤货
              </Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='是否强制囤货'>
          {getFieldDecorator('forcePileFlag', {
            rules: [{ required: true, message: '请选择是否强制囤货' }],
            initialValue: marketingBean.get('forcePileFlag')
          })(
            <RadioGroup onChange={(e) => this.onBeanChange({ forcePileFlag:e.target.value })}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...smallformItemLayout} label="设置公共虚拟库存">
          {getFieldDecorator('publicVirtualStock', {
            rules: [
              { required: true, message: '请填写公共虚拟库存' },
            ],
            onChange: (e) =>{
              this.onBeanChange({ publicVirtualStock: e })
            },
             initialValue: marketingBean.get('publicVirtualStock')
          })(
            <InputNumber
              placeholder="请填写1-999999之间的数字"
              type='number' min={1} max={999999} style={{ width: 360 }} />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} required={true} label="适用区域">
          <Col span={10}>
            {getFieldDecorator('wareId', {
              initialValue: marketingBean.get('wareId') + '',
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (value && value.length > 3) {
                      callback('最多可选一个适用区域');
                      return;
                    }
                    callback();
                  }
                }
              ]
            })(
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                // mode="multiple"
                placeholder="请选择适用区域"
                onChange={(value) => {
                  this.onBeanChange({ wareId: value });

                  if (fztype && fztype == 1) {
                    this.changeWareId(value);
                  }
                  if (value != marketingBean.get('wareId')) {
                    this.changeNull();
                    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
                      let { marketingBean } = this.state;
                      const datamar = this.state.marketingBean.toJS();
                    }
                  }
                }}
              >
                {wareHouseVOPage.map((cate) => {
                  return (
                    <Option
                      key={cate.wareId}
                    >
                      {cate.wareName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Col>
        </FormItem> */}

        {/* {isFullCount !== 2 && (
          <FormItem {...formItemLayout} label="选择商品" required={true}>
            {getFieldDecorator('goods', {})(
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <Button type="primary" icon="plus" onClick={this.openGoodsModal}>
                    添加商品
                  </Button>
                  &nbsp;&nbsp;
                  <Popconfirm
                    title="确认后商品列表则全部清空， 不可恢复请谨慎操作"
                    // onCancel={() => {
                    //   if (isOnclick == 'auto') {
                    //     isOnclick = 'none';
                    //   }
                    //   this._renderConfirmMenu(id, activityType,orderCode);
                    // }}
                    onConfirm={() => { this.changeNull(); }} okText="确认" cancelText="取消">
                    <Button> 全部清空</Button>
                  </Popconfirm>
                  &nbsp;&nbsp;
                </div>
                <Tabs activeKey={String(marketingBean.get('wareId'))} onChange={(e) => this.onBeanChange({ wareId: e })} tabPosition="top">
                  {wareHouseVOPage.map((item, i) => (
                    <TabPane tab={item.wareName} key={String(item.wareId)} ></TabPane>
                  ))}
                </Tabs>
                <SelectedGoodsGrid selectedRows={selectedRows} skuExists={skuExists}
                  deleteSelectedSku={this.deleteSelectedSku}
                  wareId={marketingBean.get('wareId')} purChange={this.purChange}
                />
              </div>
            )}
          </FormItem>
        )} */}

        <Row type="flex" justify="start">
          <Col span={3} />
          <Col span={10}>
            <Button type="primary" htmlType="submit" loading={saveLoading}>保存</Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.go(-1)}>返回</Button>
          </Col>
        </Row>
        {/* <SelectedGoodsModal
          visible={this.state.goodsModal._modalVisible}
          marketingId={marketingId}
          wareId={Number(marketingBean.get('wareId'))}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        /> */}
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const { marketingBean } = this.state;
    let endTime=marketingBean.get('endTime')?moment(marketingBean.get('endTime'),'YYYY-MM-DD hh:mm'):null
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > endTime.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { marketingBean } = this.state;
    let startTime=marketingBean.get('startTime')?moment(marketingBean.get('startTime'),'YYYY-MM-DD hh:mm'):null
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() <= startTime.valueOf();
  };

  //   // 复制活动，切换仓库
  //   changeWareId = async (value) => {
  //     const { marketingBean } = this.state;
  //     const { marketingType, fztype } = this.props;
  //     const giftLevelList=this.props.store.state().get('giftLevelList');
  //     // console.log(marketingBean.toJS(), value, 'marketingId,value', marketingType);
  //     let datas = {
  //       marketingId: marketingBean.get('marketingId'),
  //       wareId: value
  //     };
  //     let response;
  //     let resgif;
  //     if (marketingType != 2) {
  //       response = await webapi.udtalGoods(datas)
  //     } else {
  //       resgif = await webapi.udtalgifGoods(datas);
  //       // const datamar = marketingBean.toJS();
  //       if (resgif.res.code != Const.SUCCESS_CODE) {
  //         message.error(resgif.res.message);
  //       } else {
  //         let skuid = [];
  //         if (resgif.res.context.goodsInfoPage?.content.length > 0) {
  //           resgif.res.context.goodsInfoPage.content.forEach((e) => {
  //             marketingBean.get('goodsList').get('goodsInfoPage').get('content').toJS().forEach(item=>{
  //               if(item.parentGoodsInfoId==e.parentGoodsInfoId){
  //                 skuid.push({
  //                   productId: e.goodsInfoId,
  //                   parentGoodsInfoId:e.parentGoodsInfoId,
  //                   oid:item.goodsInfoId,
  //                   productNum: 1,
  //                   boundsNum: null
  //                 })
  //               }
  //             })
  //           });
  //           await this.onBeanChange({ goodsList: resgif.res.context });
  //           let list=giftLevelList.toJS().map(element => {
  //             let lists=skuid.filter(item=>element.fullGiftDetailList.some(item1=>item1.productId==item.oid));
  //             return {...element,fullGiftDetailList:lists};
  //           });
  //           await this.onBeanChange({ fullGiftLevelList:list});
  //         }else{
  //           let list=giftLevelList.toJS().map(element=>{return {...element,fullGiftDetailList:[]}});
  //           await this.onBeanChange({ fullGiftLevelList:list});
  //         }
  //       }
  //       response = await webapi.udtalGoods(datas)
  //     }

  //     if (response.res.code != Const.SUCCESS_CODE) {
  //       message.error(response.res.message);
  //     } else {
  //       const listaa = fromJS(response.res.context.goodsInfoPage?.content||[]);
  //       const skuid = response.res.context.goodsInfoPage?.content.map((value) => value.goodsInfoId);
  //       setTimeout(() => {
  //         this.setState({
  //           selectedSkuIds: skuid,
  //           selectedRows: listaa,
  //           goodsModal: {
  //             // _modalVisible: false,
  //             _selectedSkuIds: skuid,
  //             _selectedRows: listaa
  //           }
  //         });
  //       });
  //     }
  //   }

  //  请空商品列表
  changeNull = () => {
    const listaa = fromJS([]);
    setTimeout(() => {
      // this.setState({
      //   selectedSkuIds: [],
      //   selectedRows: listaa,
      //   goodsModal: {
      //     // _modalVisible: false,
      //     _selectedSkuIds: [],
      //     _selectedRows: listaa
      //   }
      // });
    });
  };

  /**
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    let levelList = [];
    // if (util.isThirdStore()) {
    //   const levRes = await webapi.getUserLevelList();
    //   if (levRes.res.code != Const.SUCCESS_CODE) {
    //     message.error(levRes.res.message);
    //     return;
    //   }
    //   levelList = levRes.res.context.storeLevelVOList;
    //   // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
    //   levelList.forEach((level) => {
    //     level.customerLevelId = level.storeLevelId;
    //     level.customerLevelName = level.levelName;
    //   });
    // }
    // this.setState({ customerLevel: levelList });

    let { marketingBean } = this.state;
    const subType = marketingBean.get('subType');
    // console.info('================ subType: ' + subType + ' ============= ');
    if (subType != undefined && subType != null) {
      this.setState({
        isFullCount:
          subType == 6 || subType == 7 || subType == 8 ? 2 : subType % 2
      });
    } else {
      this.setState({ isFullCount: 0 });
    }
    // this.levelInit(marketingBean.get('joinLevel'));
    // render selectedRows
    const scopeArray = marketingBean.get('marketingScopeList');
    if (scopeArray && !scopeArray.isEmpty()) {
      const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
      this.setState({
        selectedRows: this.makeSelectedRows(scopeIds),
        selectedSkuIds: scopeIds.toJS()
      });
    }
    // this.setState({
    //   marketingBean: this.state.marketingBean.set('isOverlap', 1)
    // });
    // this.setState({
    //   marketingBean: this.state.marketingBean.set('isAddMarketingName', 0)
    // });
  };

  /**
   * 等级初始化
   * @param joinLevel
   */
  //   levelInit = (joinLevel) => {
  //     if (joinLevel == undefined || joinLevel == null) {
  //       const { customerLevel } = this.state;
  //       const levelIds = customerLevel.map((level) => {
  //         return level.customerLevelId + '';
  //       });
  //       this.setState({
  //         level: {
  //           _indeterminate: false,
  //           _checkAll: true,
  //           _checkedLevelList: levelIds,
  //           _allCustomer: true,
  //           _levelPropsShow: false
  //         }
  //       });
  //     } else {
  //       if (+joinLevel === 0) {
  //         //店铺内客户全选
  //         this.allLevelChecked(true);
  //       } else if (+joinLevel === -1) {
  //         //全平台客户
  //         this.levelRadioChange(-1);
  //       } else {
  //         //勾选某些等级
  //         this.levelGroupChange(joinLevel.split(','));
  //       }
  //     }
  //   };


  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { marketingType, form } = this.props;
    let { marketingBean, level, isFullCount, selectedSkuIds, selectedRows } =this.state;

    form.resetFields();
    
    // let rowObj={};
    // // marketingBean.set('goodsList',selectedRows.map(item=>))
    // for(let a in selectedRows.toJS()){
    //   rowObj[a]=selectedRows.toJS()[a].map(item=>{
    //     return {
    //       goodsInfoId:item.goodsInfoId,
    //       virtualStock:item.virtualStock,
    //       wareId:item.wareId
    //     }
    //   })
    // };
    // console.log(rowObj,'rowObj')
    // marketingBean=marketingBean.set('goodsList',rowObj[1]);
    form.validateFieldsAndScroll((err) => {
      console.log(marketingBean.toJS(),'marketingBean.toJS()')
      this.props.store.submit(marketingBean.toJS())
           .then((res) => this._responseThen(res));
     
    });
  };




  /**
   * 满系类型改变
   * @param marketingType
   * @param e
   */
  subTypeChange = (e) => {
    const _thisRef = this;
   
  };

  

  /**
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    setTimeout(() => {
      this.setState({ marketingBean: this.state.marketingBean.merge(params) });
      console.log(
        this.state.marketingBean.toJS(),
        'marketingBeanmarketingBean'
      );
    });
  };

  // /**
  //  * 货品选择方法的回调事件
  //  * @param selectedSkuIds
  //  * @param selectedRows
  //  */
  // skuSelectedBackFun = async (selectedSkuObj) => {
  //   console.log(selectedSkuObj)
  //   let { selectedSkuIds, selectedRows, isExportModalData, searchParams } = selectedSkuObj;
  //   let {marketingBean}=this.state;
  //   if (isExportModalData === 0) {//选择框
  //     selectedSkuIds = fromJS([...new Set(selectedSkuIds.toJS())]);
  //     selectedRows = fromJS([...new Set(selectedRows.toJS())]);
  //     let idsObj={};
  //     idsObj[marketingBean.get('wareId')]=selectedSkuIds;
  //     let rowsObj={};
  //     rowsObj[marketingBean.get('wareId')]=selectedRows;
  //     if (selectedSkuIds.size > 0) {
  //       this.props.form.resetFields('goods');
  //       this.setState({ 
  //         selectedSkuIds:this.state.selectedSkuIds.merge(idsObj),
  //         selectedRows: this.state.selectedRows.merge(rowsObj),
  //         goodsModal: { _modalVisible: false } 
  //       });
  //     } else {
  //       this.setState({
  //         goodsModal: { _modalVisible: false }
  //       });
  //     }
  //   }else if(isExportModalData === 1){//搜索条件
      
  //   }else if(isExportModalData === 2){//全部
      
  //   }
    

  // };

  // arrayRemoveArray(Arr, cut) {
  //   let newArr = []
  //   for (let a of Arr) {
  //     if (!cut.includes(a)) {
  //       newArr.push(a)
  //     }
  //   }
  //   return newArr
  // };

  // /**
  //  * 打开货品选择modal
  //  */
  // openGoodsModal = () => {
  //   const { selectedRows, selectedSkuIds,marketingBean } = this.state;
  //   console.log(
  //     selectedRows,
  //     selectedSkuIds,
  //     'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
  //   );

  //   this.setState({
  //     goodsModal: {
  //       _modalVisible: true,
  //       _selectedSkuIds: selectedSkuIds.get(`${marketingBean.get('wareId')}`)||fromJS([]),
  //       _selectedRows: selectedRows.get(`${marketingBean.get('wareId')}`)||fromJS([])
  //     }
  //   });
  // };

  // /**
  //  * 关闭货品选择modal
  //  */
  // closeGoodsModal = () => {
  //   this.setState({ goodsModal: { _modalVisible: false } });
  // };

  //   /**
  //    * 渲染等级的checkBox
  //    * @param levels
  //    * @returns {any}
  //    */
  //   renderCheckboxOptions = (levels) => {
  //     return levels.map((level) => {
  //       return {
  //         label: level.customerLevelName,
  //         value: level.customerLevelId + '',
  //         key: level.customerLevelId
  //       };
  //     });
  //   };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    const { marketingBean } = this.state;
    const goodsList = marketingBean.get('goodsList');
    if (goodsList) {
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('goodsInfoPage')
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('goodsInfoId')));
      } else {
        selectedRows = goodsList.get('goodsInfoPage').get('content');
      }
      console.log(goodsList.toJS(), 'selectedRowsselectedRows123', selectedRows.toJS());

      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          const cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(goodsList.get('cates') || []).find(
            (s) => s.get('cateId') === cId
          );
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find(
            (s) => s.get('brandId') === bId
          );
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          goodInfo.perUserPurchaseNum = String(marketingBean.get('marketingScopeList').toJS().filter(item => item.scopeId == goodInfo.goodsInfoId)[0]?.perUserPurchaseNum) || null
          return JSON.parse(JSON.stringify(goodInfo));
        })
      );
    } else {
      return fromJS([]);
    }
  };

  purChange = (value, id, key = 'virtualStock') => {
    const { selectedRows,marketingBean } = this.state;
    const goodslk = selectedRows.toJS();
    (goodslk[marketingBean.get('wareId')]||[]).forEach((e) => {
      if (e.goodsInfoId == id) {
        e[key] = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };



  // /**
  //  * 已选商品的删除方法
  //  * @param skuId
  //  */
  // deleteSelectedSku = (skuId) => {
  //   const { selectedRows, selectedSkuIds,marketingBean } = this.state;
  //   // selectedSkuIds.splice(
  //   //   selectedSkuIds.findIndex((item) => item == skuId),
  //   //   1
  //   // );
  //   this.setState({
  //     selectedSkuIds: selectedSkuIds.get(`${marketingBean.get('wareId')}`).splice(
  //       selectedSkuIds.toJS().findIndex((item) => item == skuId),
  //       1
  //     ),
  //     selectedRows: selectedRows.get(`${marketingBean.get('wareId')}`).delete(
  //       selectedRows.get(`${marketingBean.get('wareId')}`).findIndex((row) => row.get('goodsInfoId') == skuId)
  //     )
  //   });
  // };

    /**
     * 处理返回结果
     * @param response
     * @private
     */
    _responseThen = (response) => {
      if (response.res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
        history.push('/stock-activity');
      } else {
        message.error(response.res.message);
      }
      // if(!isType) this.setState({ saveLoading: false });
    };
}
