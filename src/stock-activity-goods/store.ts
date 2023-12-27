import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const, util } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import StockListActor from './actor/stock-activity-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new StockListActor()];
  }

  wareBut=async(activityId)=>{
    this.dispatch('actor: change', {key:'activityId',value:activityId});
    let warePage = JSON.parse(localStorage.getItem('warePage')) || [];
    this.dispatch('actor: change', {key:'wareId',value:warePage[0].wareId});
    // this.dispatch('actor: change', {key:'wareHouseVOPage',value:warePage});
    const { res: brand} =await webapi.fetchBrands();
    if(brand.code==Const.SUCCESS_CODE){
      this.dispatch('actor: change', {key:'brandsList',value:fromJS(brand.context)});
    }
    const { res: cate} =await webapi.fetchCates();
    if(cate.code==Const.SUCCESS_CODE){
      this.dispatch('actor: change', {key:'cateList',value:fromJS(cate.context)});
    }
    this.init();
  }

  /**
   * 初始化页面
   */
  init = async ({ pageNum, pageSize } = { pageNum: 1, pageSize: 10 }) => {
    const query = this.state().get('form').toJS();
    const wareId = this.state().get('wareId');
    const activityId=this.state().get('activityId');
    const { res } = await webapi.pileActivityPage({
      ...query,
      wareId,
      activityId,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let activityList = res.context.content;
    this.dispatch('init', {
      activityList: fromJS(activityList),
      total: res.context.totalElements,
      pageNum: pageNum,
      pageSize:res.context.size
    });
  };



     /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
        // const { selectedRows, selectedSkuIds,wareId } = this.state;
        // this.setState({
        //   goodsModal: {
        //     _modalVisible: true,
        //     _selectedSkuIds: fromJS([]),
        //     _selectedRows: fromJS([])
        //   }
        // });
  };


    /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
     skuSelectedBackFun = async (selectedSkuObj) => {
      let { selectedSkuIds, selectedRows, isExportModalData, searchParams } = selectedSkuObj;
      if (isExportModalData === 0) {//选择框
        selectedSkuIds = fromJS([...new Set(selectedSkuIds.toJS())]);
        selectedRows = fromJS([...new Set(selectedRows.toJS())]);
        if (selectedSkuIds.size > 0) {
          // this.onChange('selectedSkuIds',selectedSkuIds);
          // this.onChange('selectedRows',selectedRows);
          this.onpileActivityGoodsAdd({selectFlag:0,selectedGoods:selectedSkuIds});
        } else {
          this.onChange('modalVisible',false);
        }
      }else if(isExportModalData === 1){//搜索条件
        this.onpileActivityGoodsAdd({selectFlag:2,filterCondition:JSON.stringify(searchParams)});
      }else if(isExportModalData === 2){//全部
        this.onpileActivityGoodsAdd({selectFlag:1});
      }
    };


  onpileActivityGoodsAdd=async(params)=>{
    let {wareId,activityId}=this.state().toJS()
    let obj={...params,wareId,activityId}
    let { res }:any=await webapi.pileActivityGoodsAdd(obj);
      if (res.code = Const.SUCCESS_CODE) {
        this.onChange('modalVisible',false);
        this.init();
      }else{
        message.error(res.message);
      }
  };

  /**
   * 已选商品的删除方法
   * @param skuId,delType0 单个商品删除，1 按仓库清空
   */
  deleteSelectedSku = async(delType,goodsInfoId?) => {
    let {wareId,activityId}=this.state().toJS();
  
    const { res } = await webapi.pileActivityGoodsDel({id:goodsInfoId||null,activityId:activityId,wareId,delType});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('删除成功');
    //刷新页面
    this.init();
  };

  /**
   * 修改表格里库存
   * @param value
   * @param id
   * @param key
   */
  purchChange=async(value,row,key?)=>{
    let {wareId,activityId,activityGoodsList}=this.state().toJS();

    const { res } = await webapi.pileActivityGoodsModify({wareId,activityId,id:row.id,virtualStock:value});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    activityGoodsList[row.index][row.key]=Number(value);
    this.dispatch('actor: change', {key:'activityGoodsList',value:fromJS(activityGoodsList)});
    console.log(row,'row')
    // this.init();
  };

  onChange=(key,value)=>{
    this.dispatch('actor: change', {key,value});
  };

  /**
   * tab框切换
   */
  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  /**
   * 点击搜索
   */
  search = () => {
    this.init({ pageNum: 1, pageSize: 10 });
  };

  /**
   * 搜索框字段改变
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };




}
