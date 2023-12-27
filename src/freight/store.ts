import { Store, IOptions } from 'plume2';

import { message, Modal } from 'antd';
import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';

import FreightActor from './actor/freight-actor';
import * as webapi from './webapi';

const confirm = Modal.confirm;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreightActor()];
  }

  changePageType = (pageType: number) => {
    this.dispatch('info:setPageType', pageType);
  };

  /**
   * 初始化方法
   *
   * @returns {Promise<void>}
   */
  init = ({ pageNum, pageSize, tab } = { pageNum: 0, pageSize: 2, tab: 0 }) => {
    this.transaction(() => {
      this.fetchStore();
      this.freightTemplateGoods();
      this.freightTemplateStore(pageNum, pageSize);
      this.dispatch('freight: field: save', { field: 'tab', value: tab });
    });
  };

  /**
   * 初始化单品运费模板列表
   */
  freightTemplateGoods = async () => {
    const pageType = this.state().get('pageType');
    const { res } = (await webapi.freightTemplateGoods(pageType)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('freight: goods: init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 初始化店铺运费模板列表
   */
  freightTemplateStore = async (pageNum, pageSize) => {
    const pageType = this.state().get('pageType');
    const { res } = (await webapi.freightTemplateStore(
      { pageNum, pageSize },
      pageType
    )) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('freight: store: init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 键值存储
   */
  fieldSave = ({ field, value }) => {
    this.dispatch('freight: field: save', { field, value });
  };

  /**
   * 保存店铺运费模板方式
   */
  saveStoreFreight = async () => {
    const fMode = this.state().get('fMode');
    const { res } = (await webapi.changeStoreFreightType({
      freightTemplateType: fMode
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 复制
   */
  copy = async (freightId) => {
    const pageType = this.state().get('pageType');
    const { res } = (await webapi.copyFreightGoods(freightId, pageType)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('复制成功');
      this.init({ tab: 1 } as any);
    } else if (res.code == 'K-110701' || res.code == 'K-110702') {
      confirm({
        content: res.message,
        iconType: 'exclamation-circle',
        onOk() {
          history.push({
            pathname: `/goods-freight-edit/${freightId}`,
            state: {
              isCopy: true
            }
          });
        }
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除
   */
  del = async (freightId, isStore) => {
    let result;
    const pageType = this.state().get('pageType');
    if (isStore) {
      result = await webapi.deleteFreightStore(freightId, pageType);
    } else {
      result = await webapi.deleteFreightGoods(freightId, pageType);
    }
    const { res } = result;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('删除成功');
      const { size, number } = this.state()
        .get('storeFreight')
        .toJS();
      if (isStore) {
        this.freightTemplateStore(number - 1, size);
      } else {
        this.freightTemplateGoods();
      }
    } else {
      message.error(res.message);
    }
  };

  /**
   * 隐藏弹框
   */
  cancelModal = () => {
    this.dispatch('freight: store: modal: hide');
  };

  /**
   * 查询店铺信息
   *
   * @memberof AppStore
   */
  fetchStore = async () => {
    const { res } = (await webapi.fetchStore()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('freight: field: save', {
        field: 'fMode',
        value: res.context.freightTemplateType
      });
    } else {
      message.error(res.message);
    }
  };
}
