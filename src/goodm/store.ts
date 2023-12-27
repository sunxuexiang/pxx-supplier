import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import { Const, util } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new FormActor(),
      new CustomerLevelActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    console.log(pageNum, 'pageNumpageNumpageNumpageNumpageNum');

    this.dispatch('loading:start');
    const query = this.state().get('form').toJS();
    if (query.marketingSubType === '-1') {
      query.marketingSubType = 9;
    }

    const { res } = await webapi.fetchList({ ...query, pageNum, pageSize });
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
        this.dispatch('customerLevel:init', fromJS(levelList));
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:field', { field: 'queryTab', value: index });
    const pageNum = sessionStorage.getItem('pageNum');
    this.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize: 10 });
    sessionStorage.removeItem('pageNum');
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onDelete = async (marketingId) => {
    const { res } = await webapi.deleteMarketing(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onPause = async (marketingId) => {
    const { res } = await webapi.pause(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onStart = async (marketingId) => {
    const { res } = await webapi.start(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onTermination = async (marketingId) => {
    const { res } = await webapi.onTermination(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init({ pageNum: 0, pageSize: 10 });
  };
}
