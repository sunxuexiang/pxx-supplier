import { Store, IOptions } from 'plume2';
import { message } from 'antd';

import { Const } from 'qmkit';
import SearchActor from './actor/search-actor';
import { getPageList, del, getGrouponCateList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new SearchActor()];
  }

  getGrouponCateList = async () => {
    const list: any = await getGrouponCateList();
    if (list.res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:group:cate:list', list.res.context.grouponCateVOList);
    }
  };

  /**
   * 初始化拼团活动列表
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const params = this.state()
      .get('form')
      .toJS();
    const pageList: any = await getPageList({
      ...params,
      pageSize,
      pageNum
    });
    if (pageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'group:list:init',
          pageList.res.context.grouponActivityVOPage
        );
      });
    } else {
      message.error(pageList.res.message);
    }
  };

  /**
   * 设置form参数
   */
  setFormField = (field, value) => {
    this.dispatch('group:list:form:field', { field, value });
  };

  /**
   * 切换tab
   */
  changeTab = (tabType) => {
    this.setFormField('tabType', tabType);
    this.init();
  };

  onDelete = async (grouponActivityId) => {
    const { res } = (await del(grouponActivityId)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };
}
