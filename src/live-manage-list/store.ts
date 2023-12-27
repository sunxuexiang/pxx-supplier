import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util } from 'qmkit';
import * as webApi from './webapi';
import LiveActor from './actor/live-actor';
import LiveCompanyActor from './actor/live-company-actor';
import LiveGoodsActor from './actor/live-goods-actor';
import LiveBagActor from './actor/live-bag-actor';
import moment from 'moment';
import CommissionDetail from 'src/commission-detail';
export default class AppStore extends Store {
  bindActor() {
    return [
      new LiveActor(),
      new LiveCompanyActor(),
      new LiveGoodsActor(),
      new LiveBagActor()
    ];
  }

  /**
   * 初始化方法
   */
  init = async (liveRoomId) => {
    this.dispatch('info:live', { key: 'liveRoomId', value: liveRoomId });
    await Promise.all([
      this.queryPage() //初始化查直播列表
      // this.isOpen() //查是否开启直播共功能
    ]);
  };

  /**
   * 查询直播列表分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    const liveRoomId = this.state().get('liveRoomId');
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.liveRoomId = liveRoomId;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询直播商品库分页数据
   */
  queryLiveGoodsPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('liveGoods:setLoading', true);
    const param = this.state()
      .get('LiveGoodsSearchData')
      .toJS();

    param.pageNum = pageNum < 0 ? 0 : pageNum;
    param.pageSize = pageSize;
    // param.goodsType=0;
    param.liveRoomId = this.state().get('liveRoomId');
    const { res: pageRes } = await webApi.getLiveGoodsPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // console.log(pageRes?.context?.goodsInfoPage,'pageRes?.context?.goodsInfoPage')
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('liveGoods:setLoading', false);
        // 设置分页数据
        this.dispatch('liveGoods:setPageData', pageRes?.context?.goodsInfoPage);
        // 设置当前页码
        this.dispatch('liveGoods:setCurrent', param.pageNum + 1);
        // 清空勾选信息
        this.dispatch('liveGoods:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('liveGoods:setLoading', false);
    }
  };

  /**
   * 查询直播优惠活动分页数据
   */
  queryLiveCompanyPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('liveCompany:setLoading', true);
    // const status = this.state().get('currentLiveCompanyTab'); //根据状态查tab
    const param = this.state()
      .get('liveCompanySearchData')
      .toJS();
    param.liveRoomId = this.state().get('liveRoomId');
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getLiveCompanyPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      let activityList = pageRes.context;
      const now = moment();
      activityList = activityList.map((item) => {
        //设置活动状态
        let pauseFlag;
        const flag = item.couponActivity.pauseFlag;
        if (
          item.couponActivity.startTime != null &&
          item.couponActivity.endTime != null
        ) {
          // 常规赠券活动有开始时间结束时间
          const startTime = moment(item.couponActivity.startTime);
          const endTime = moment(item.couponActivity.endTime);
          if (endTime.isBefore(now)) {
            pauseFlag = 4;
          } else if (startTime.isAfter(now)) {
            pauseFlag = 3;
          } else if (now.isBetween(startTime, endTime)) {
            if (flag == 1) {
              pauseFlag = 2;
            } else {
              pauseFlag = 1;
            }
          }
        } else if (item.couponActivity.couponActivityType == 4) {
          // 权益赠券活动
          if (flag == 1) {
            pauseFlag = 2;
          } else {
            pauseFlag = 1;
          }
        }
        item.couponActivity.pauseFlag = pauseFlag;
        return item;
      });
      // 设置loading结束状态
      this.dispatch('liveCompany:setLoading', false);
      // 设置分页数据
      this.dispatch(
        'liveCompany:setPageData',
        activityList
          ? {
              content: activityList,
              numberOfElements: pageRes.totalElements,
              size: pageRes.size
            }
          : { content: [] }
      );
      // 设置当前页码
      this.dispatch('liveCompany:setCurrent', pageNum + 1);
      // 清空勾选信息
      this.dispatch('liveCompany:setCheckedData', List());
      // this.transaction(() => {

      // });
    } else {
      message.error(pageRes.message);
      this.dispatch('liveCompany:setLoading', false);
    }
  };

  /**
   * 查询直播福袋分页数据
   */
  queryLiveBagPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('liveBag:setLoading', true);
    const param = this.state()
      .get('LiveBagSearchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.liveRoomId = this.state().get('liveRoomId');
    const { res: pageBagRes } = await webApi.liveStreamRoomBagPage(param);
    if (pageBagRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('liveBag:setLoading', false);
        // 设置分页数据
        this.dispatch('liveBag:setPageData', { ...pageBagRes.context });
        // 设置当前页码
        this.dispatch('liveBag:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('liveBag:setCheckedData', List());
      });
    } else {
      message.error(pageBagRes.message);
      this.dispatch('liveBag:setLoading', false);
    }
  };

  onAddGoodsChange = async (list) => {
    let liveRoomId = this.state().get('liveRoomId');
    let obj = {
      goodsInfoIds: list || [],
      liveRoomId
    };
    const { res } = await webApi.getLiveStreamGoodsAdd(obj);
    if (res.code === Const.SUCCESS_CODE) {
      this.onGoodsChange('modalVisible', false);
      this.queryLiveGoodsPage({
        pageSize: this.state().get('LiveGoodsPageSize'),
        pageNum: this.state().get('LiveGoodsCurrent') - 1
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 移除优惠券
   */
  onDelCoupons = async (activityId) => {
    let liveRoomId = this.state().get('liveRoomId');
    const { res } = await webApi.getLiveStreamActivityModify({
      activityId,
      liveRoomId
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveCompanyPage();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 福利发放
   */
  onlinelBagIssue = (id) => {
    console.log('请求发放接口');

    this.queryLiveBagPage();
  };
  /**
   * 福利删除
   */
  onlinelBagDel = async (liveBagId) => {
    let liveRoomId = this.state().get('liveRoomId');
    let { res } = await webApi.liveStreamRoomBagModify({
      liveBagId,
      delFlag: 1,
      liveRoomId
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveBagPage();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 移除商品
   */
  onDelGoods = async (goodsInfoIds) => {
    let liveRoomId = this.state().get('liveRoomId');
    const { res } = await webApi.getLiveStreamGoodsModify({
      goodsInfoIds: goodsInfoIds.length
        ? goodsInfoIds
        : this.state().toJS().LiveGoodsCheckedIds,
      liveRoomId,
      delFlag: 1
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveGoodsPage();
    } else {
      message.error(res.message);
    }
  };

  //打开优惠券弹框
  onIsCouponsModal = (activityId, type) => {
    this.onCompanyChange('activityId', activityId);
    this.onCompanyChange('couponsType', type);
    this.onCompanyChange('isCouponsModal', true);
  };

  /**
   * 推送 isShow:1已发布0未发布
   * idsKey：id
   */
  onCuponsModalOk = (idsKey, isShow) => {
    if (isShow) {
      this.onLiveStreamSendMessage(4, idsKey.join());
    } else {
      this.onLiveStreamSendMessage(2, idsKey.join());
    }
  };

  /**
   * 推送 typ:1商品，2优惠券,4优惠券取消发布
   */
  onLiveStreamSendMessage = async (type: number, value: any) => {
    const activityId = this.state().get('activityId');
    const liveRoomId = this.state().get('liveRoomId');
    let params;
    if (type == 1) {
      params = { goodsInfoId: value };
    } else if (type == 2 || type == 4) {
      params = { activityId: activityId, couponId: value };
    } else if (type == 7) {
      params = { bagId: value };
    }
    const { res } = await webApi.getLiveStreamSendMessage({
      ...params,
      type,
      liveRoomId
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      if (type == 1) {
        this.queryLiveGoodsPage({
          pageSize: this.state().get('LiveGoodsPageSize'),
          pageNum: this.state().get('LiveGoodsCurrent') - 1
        });
      } else if (type == 7) {
        this.queryLiveBagPage();
      } else {
        this.queryLiveCompanyPage();
      }
      if (type != 1) {
        this.onCompanyChange('isCouponsModal', false);
      }
    } else {
      message.error(res.message);
    }
  };

  /**
   * 商品取消推送
   */
  onCancelLiveStreamSendMessage = async (value) => {
    const liveRoomId = this.state().get('liveRoomId');
    let { res } = await webApi.getLiveStreamGoodsExplain({
      goodsInfoId: value,
      liveRoomId
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveGoodsPage({
        pageSize: this.state().get('LiveGoodsPageSize'),
        pageNum: this.state().get('LiveGoodsCurrent') - 1
      });
    } else {
      message.error(res.message);
    }
  };

  //选择活动（确定按钮）
  onActivityModalOk = async (idsKey, rows) => {
    let liveRoomId = this.state().get('liveRoomId');
    const { res } = await webApi.getLiveStreamActivityAdd({
      activityIds: idsKey,
      liveRoomId
    });
    if (res.code === Const.SUCCESS_CODE) {
      // this.onCompanyChange('selectedRowKeys', idsKey);
      // this.onCompanyChange('selectedRows', rows);
      this.onCompanyChange('isActivityModal', false);
      this.queryLiveCompanyPage();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改actor里的値
   */

  onGoodsChange = (key, value) => {
    this.dispatch('goods:info', { key, value });
  };
  onCompanyChange = (key, value) => {
    this.dispatch('company:info', { key, value });
  };

  /**
   * 设置搜索项信息并查询分页数据
   */

  onSearch = async (searchData) => {
    //直播列表
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };
  onSearchLiveGoods = (key, value) => {
    //商品
    this.dispatch('liveGoods:setSearchData', { key, value });
    // await this.queryLiveGoodsPage();
  };
  onLiveCompanySearch = async (searchData) => {
    //优惠券
    this.dispatch('liveCompany:setSearchData', fromJS(searchData));
    await this.queryLiveCompanyPage();
  };
  onLiveBagSearch = async (key, value) => {
    //福袋
    this.dispatch('liveBag:setSearchData', { key, value });
    await this.queryLiveBagPage();
  };

  onFormFieldChange = (key, value) => {
    // let {currentCardTab}=this.state().toJS();
    // let list=['info',]
    this.dispatch('form: field', { key, value });
  };

  /**
   * 设置勾选的多个id
   */
  onGoodsSelect = (checkedIds) => {
    this.dispatch('liveGoods:setCheckedData', fromJS(checkedIds));
    // this.dispatch('liveGoods:setLiveGoodsRows', fromJS(row));
  };

  onliveDel = async (liveId) => {
    const { res } = await webApi.deleteLiveStream({
      liveId
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryPage();
    } else {
      message.error(res.message);
    }
  };

  // /**
  //  * 批量删除
  //  */
  // onBatchDelete = async () => {
  //   const checkedIds = this.state().get('checkedIds');
  //   const { res: delRes } = await webApi.deleteByIdList(checkedIds.toJS());
  //   if (delRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     await this.queryPage();
  //   } else {
  //     message.error(delRes.message);
  //   }
  // };

  // /**
  //  * 打开添加弹窗
  //  */
  // onAdd = () => {
  //   this.transaction(() => {
  //     this.dispatch('info:setVisible', true);
  //     this.dispatch('info:setFormData', fromJS({}));
  //   });
  // };

  // /**
  //  * 打开编辑弹框
  //  */
  // onEdit = async (id) => {
  //   const editData = this.state()
  //     .get('dataList')
  //     .find((v) => v.get('id') == id);
  //   this.transaction(() => {
  //     this.dispatch('info:setFormData', editData);
  //     this.dispatch('info:setVisible', true);
  //   });
  // };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (key, value) => {
    this.dispatch('liveBag:editFormData', { key, value });
  };

  // /**
  //  * 关闭弹窗
  //  */
  // closeModal = () => {
  //   this.dispatch('info:setVisible', false);
  // };

  // /**
  //  * 保存新增/编辑弹框的内容
  //  */
  // onSave = async () => {
  //   const formData = this.state().get('formData');
  //   let result;
  //   if (formData.get('id')) {
  //     result = await webApi.modify(formData);
  //   } else {
  //     result = await webApi.add(formData);
  //   }
  //   if (result.res.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.closeModal();
  //     this.dispatch('info:setFormData', fromJS({}));
  //     await this.init();
  //   } else {
  //     message.error(result.res.message);
  //   }
  // };
  // /**
  //  * 福袋新增/编辑弹框的内容
  //  */
  onBagSave = async () => {
    let liveBagFormData = this.state()
      .get('liveBagFormData')
      .toJS();
    // if(liveBagFormData.selectedRowKeys.length>1){
    //   message.error('只能选择一张优惠券,请检查');
    //   return
    // }else{

    // }
    if (!liveBagFormData.selectedRowKeys.length) {
      message.error('请选择一张优惠券');
      return;
    }
    liveBagFormData.couponId = liveBagFormData.selectedRowKeys.join();
    liveBagFormData.liveRoomId = this.state().get('liveRoomId');
    if (liveBagFormData.joinContent == '自定义内容') {
      liveBagFormData.joinContent = liveBagFormData.joinContent_text;
    }
    let result;
    if (liveBagFormData.liveBagId) {
      result = await webApi.liveStreamRoomBagModify(liveBagFormData);
    } else {
      result = await webApi.liveStreamRoomBagAdd(liveBagFormData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // this.closeModal();
      this.dispatch(
        'liveBag:setFormData',
        fromJS({
          ticketWay: 0,
          joinType: 0,
          bagName: '',
          winningNumber: '',
          lotteryTime: '',
          selectedRowKeys: []
        })
      );
      await this.queryLiveBagPage();
      this.dispatch('liveBag:setVisible', false);
    } else {
      message.error(result.res.message);
    }
  };

  //商品上下架
  onCancelLiveStreamSendStatus = async (goodsInfoIds, LiveGoodsStatus) => {
    let liveRoomId = this.state().get('liveRoomId');
    const { res } = await webApi.getLiveStreamGoodsModify({
      goodsInfoIds: goodsInfoIds.length
        ? goodsInfoIds
        : this.state().toJS().LiveGoodsCheckedIds,
      liveRoomId,
      goodsStatus: LiveGoodsStatus
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.queryLiveGoodsPage({
        pageSize: this.state().get('LiveGoodsPageSize'),
        pageNum: this.state().get('LiveGoodsCurrent') - 1
      });
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 切换卡片式tab页
   */
  setCurrentTab = (key) => {
    //直播列表

    if (key == 0) {
      // this.onSearch({roomName: null,liveStatus:null,startTime: null,endTime: null})
      this.dispatch(
        'info:setSearchData',
        fromJS({
          roomName: null,
          liveStatus: '',
          startTime: null,
          endTime: null
        })
      );
      this.queryPage();
      //直播商品库
    } else if (key == 1) {
      this.queryLiveGoodsPage();
      //直播商家
    } else if (key == 2) {
      this.queryLiveCompanyPage();
    } else {
      this.queryLiveBagPage();
    }
    this.dispatch('change:setCurrentTab', key);
  };

  // /**
  //  * 切换直播列表tab页
  //  */
  // changeLiveListTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveListTab', key);
  //   this.queryPage();
  // };

  // /**
  //  * 切换直播商家列表
  //  */
  // changeLiveCompanyTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveCompanyTab', key);
  //   this.queryLiveCompanyPage();
  // };

  // /**
  //  * 切换直播商品库列表
  //  */
  // changeLiveGoodsTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveGoodsTab', key);
  //   this.queryLiveGoodsPage();
  // };

  // /**
  //  * 推荐直播
  //  */
  // changeRecommend = async (value, roomId) => {
  //   const param = {
  //     roomId: roomId,
  //     recommend: value ? 1 : 0 //传当前状态
  //   };
  //   const { res: pageRes } = await webApi.recommend(param);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.init(); //推荐成功刷新
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 商品提审
  //  */
  // onAudit = async (values) => {
  //   const params = [
  //     {
  //       name: values.name,
  //       coverImgUrl: values.coverImgUrl,
  //       priceType: values.priceType,
  //       price: values.price,
  //       price2: values.price2,
  //       url: values.url,
  //       id: values.id
  //     }
  //   ];

  //   const { res: pageRes } = await webApi.goodsAudit(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 批量提审
  //  */
  // spuCheckedFunc = async () => {
  //   const LiveGoodsRows = this.state().get('LiveGoodsRows');
  //   let params = [];
  //   LiveGoodsRows.map((item) => {
  //     item = item.toJS();
  //     const param = {
  //       name: item.name,
  //       coverImgUrl: item.coverImgUrl,
  //       priceType: item.priceType,
  //       price: item.price,
  //       price2: item.price2,
  //       url: item.url,
  //       id: item.id
  //     };
  //     params.push(param);
  //   });

  //   const { res: pageRes } = await webApi.goodsAudit(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 显示驳回弹框
  //  */
  // showRejectModal = (storeId, type) => {
  //   this.dispatch('modal:type', type);
  //   this.dispatch('modal:storeId', storeId);
  //   this.dispatch('order:list:reject:show');
  // };

  // /**
  //  *关闭驳回弹框
  //  */
  // hideRejectModal = () => {
  //   this.dispatch('order:list:reject:hide');
  // };

  // /**
  //  * 审核：type:2
  //  * 驳回：type:3
  //  * 禁用：type:4
  //  */
  // modify = async (id, type, cause) => {
  //   const params = {
  //     liveBroadcastStatus: type,
  //     storeId: id,
  //     auditReason: cause
  //   };
  //   const { res: pageRes } = await webApi.modify(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     if (type == '3' || type == '4') {
  //       this.hideRejectModal();
  //     }
  //     this.queryLiveCompanyPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 直播商品库驳回
  //  */
  // liveGoodsReject = async (id, type, cause) => {
  //   const params = {
  //     auditStatus: type,
  //     id: id,
  //     auditReason: cause
  //   };
  //   const { res: pageRes } = await webApi.liveGoodsReject(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.hideRejectModal();
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // liveGoodsShowRejectModal = (id) => {
  //   this.dispatch('modal:goodsId', id);
  //   this.dispatch('order:list:reject:show');
  // };

  // ------------------------------------------------------------------------------
  /**
   * 打开福袋弹窗
   */
  onAdd = async (liveBagId) => {
    let { liveCompanyDataList, liveRoomId } = this.state().toJS();

    if (liveCompanyDataList.length == 0) {
      this.queryLiveCompanyPage();
    }
    if (liveBagId) {
      let { res } = await webApi.liveStreamRoomBagGetInfo({
        liveBagId: liveBagId
      });
      if (res.code === Const.SUCCESS_CODE) {
        if (
          res.context.joinContent != '通过' &&
          res.context.joinContent != '不通过' &&
          res.context.joinContent != '打款失败'
        ) {
          res.context.joinContent_text = res.context.joinContent;
          res.context.joinContent = '自定义内容';
        }
        this.dispatch(
          'liveBag:setFormData',
          fromJS({
            ...res.context,
            selectedRowKeys: res?.context?.couponId.split(',')
          })
        );
        this.dispatch('liveBag:setVisible', true);
      } else {
        message.error(res.message);
      }
    } else {
      this.dispatch('liveBag:setVisible', true);
    }
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('liveBag:setVisible', false);
  };
}
