import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import EvaluateSumActor from './actor/evaluate-sum-actor';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }
  tabMap = { '1': null, '2': 0 };

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new FormActor(),
      new EvaluateSumActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();

    // 是否已回复
    const tabIndex = this.state().get('tabIndex');
    query.isAnswer = this.tabMap[tabIndex];

    const isShow = this.state().getIn(['form', 'isShow']);
    if (isShow == '-1') {
      query.isShow = null;
    }
    const isUpload = this.state().getIn(['form', 'isUpload']);
    if (isUpload == '-1') {
      query.isUpload = null;
    }
    const evaluateScore = this.state().getIn(['form', 'evaluateScore']);
    if (evaluateScore == '-1') {
      query.evaluateScore = null;
    }
    const isEdit = this.state().getIn(['form', 'isEdit']);
    if (isEdit == '-1') {
      query.isEdit = null;
    }

    const { res } = await webapi.fetchGoodsEvaluateList({
      ...query,
      pageNum,
      pageSize
    });

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context.goodsEvaluateVOPage);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }

    const param = {} as any;
    param.scoreCycle = 2;
    //查询180天的商家评价汇总
    const { res: storeEvaluateSum } = await webapi.fetchStoreEvaluateSum(param);
    if (storeEvaluateSum.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'storeEvaluateSum:init',
          storeEvaluateSum.context.storeEvaluateSumVO || {}
        );
      });
    } else {
      message.error(storeEvaluateSum.message);
    }
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  /**
   * 下拉搜索框切换option筛选字段
   * @param fieldOld 原筛选字段名
   * @param fieldNew 新筛选字段名
   */
  onSelectOptionChange = (fieldOld, fieldNew) => {
    this.transaction(() => {
      this.dispatch('form:field', { field: fieldNew, value: this.state().getIn(['form', fieldOld]) });
      this.dispatch('form:field', { field: fieldOld, value: null });
    });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 显示服务评价弹框
   */
  serviceModal = (isAdd) => {
    this.dispatch('service: modal', isAdd);
  };

  /**
   * 查看
   */
  modal = (isAdd) => {
    this.dispatch('cate: modal', isAdd);
  };

  /**
   * arrow点击
   */
  arrow = (state) => {
    this.dispatch('change: arrow', state);
  };

  /**
   * 初始化服务评价记录
   */
  initStoreEvaluate = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    //近180天评分
    const param = {} as any;
    param.scoreCycle = 2;
    const { res: storeEvaluateNum } = await webapi.fetchStoreEvaluateNum(param);
    if (storeEvaluateNum.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('storeEvaluateNum:init', storeEvaluateNum.context);
      });
    } else {
      message.error(storeEvaluateNum.message);
    }
    //评价历史记录
    const { res } = await webapi.fetchStoreEvaluateList({
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'storeEvaluateList:init',
          res.context.storeEvaluateVOPage
        );
        this.dispatch('storeEvaluateList:currentPage', pageNum && pageNum + 1);
      });
    } else {
      message.error(res.message);
    }
  };

  goodsEvaluateDetail = async (evaluateId, isShow) => {
    const { res } = await webapi.fetchGoodsEvaluateDetail({
      evaluateId: evaluateId
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsEvaluate: init', res.context.goodsEvaluateVO);
      this.dispatch('cate: modal', isShow);
      // this.dispatch('evaluate: field', { 'isShow', true });
      this.onFormFieldChange('isShow', res.context.goodsEvaluateVO.isShow);
      this.onFormFieldChange('isAnswer', res.context.goodsEvaluateVO.isAnswer);
      this.onFormFieldChange('evaluateId', evaluateId);
      this.onFormFieldChange(
        'evaluateAnswer',
        res.context.goodsEvaluateVO.evaluateAnswer
      );
    } else {
      message.error(res.message);
    }
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('evaluate: field', { key, value });
  };

  /**
   * 修改选中tab的key
   */
  onStateTabChange = (tabInd) => {
    this.dispatch('evaluate:setTabIndex', tabInd);
    this.init();
  };

  /**
   * 保存评价回复
   * @returns {Promise<void>}
   */
  saveAnswer = async (evaluateId, evaluateAnswer, isShow) => {
    const { res } = await webapi.saveGoodsEvaluateAnswer({
      evaluateId: evaluateId,
      evaluateAnswer: evaluateAnswer,
      isShow: isShow,
      isAnswer: 1
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('cate: modal', false);
      this.init({ pageNum: 0, pageSize: 10 });
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };
}
