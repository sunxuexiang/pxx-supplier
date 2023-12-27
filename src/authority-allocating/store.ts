import { Store } from 'plume2';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import RoleActor from './actor/role-actor';
import BossMenuActor from './actor/boss-menu-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import { Const, util } from 'qmkit';
import * as _ from 'lodash';

export default class AppStore extends Store {
  bindActor() {
    return [
      new RoleActor(),
      new BossMenuActor(),
      new VisibleActor(),
      new EditActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (roleInfoId, roleName) => {
    this.dispatch('loading:start');
    const { res: menusRes } = (await webapi.fetchBossMenus()) as any;
    const bossMenus = fromJS(menusRes.context);
    const allGradeMenus = this._getChildren(
      bossMenus.filter((item) => item.get('grade') == 1),
      bossMenus
    );
    const isThird = util.isThirdStore();
    //非自营店铺 隐藏部分菜单
    const thirdAllGradeMenus = [];
    if (isThird) {
      allGradeMenus.toJS().forEach((item) => {
        const firstMenu = _.cloneDeep(item);
        if (item.url !== '/store-customer') {
          if (item.children) {
            firstMenu.children = [];
            item.children.forEach((secondItem) => {
              const secondMenu = _.cloneDeep(secondItem);
              const hideSecond = [
                '/finance-ticket-second-menu',
                '/mofang-pc-second-menu',
                '/groupon-activity-second-menu',
                '/flash-sale-second-menu',
                '/applet-second-menu'
              ];
              if (!hideSecond.includes(secondItem.url)) {
                if (secondItem.children) {
                  secondMenu.children = [];
                  secondItem.children.forEach((thirdItem) => {
                    const thirdMenu = thirdItem;
                    const hideThird = [
                      '/th_daike_order_list',
                      '/order-add',
                      '/order-return-apply-list',
                      '/release-products',
                      '/goods-evaluate-list',
                      '/stockout-list',
                      '/goods-add-vendor',
                      '/customer-statistics',
                      '/goodm',
                      '/ls-goods-list',
                      '/bd-goods-list'
                    ];
                    if (!hideThird.includes(thirdItem.url)) {
                      secondMenu.children.push(thirdMenu);
                    }
                  });
                }
                firstMenu.children.push(secondMenu);
              }
            });
          }
          thirdAllGradeMenus.push(firstMenu);
        }
      });
    }

    let menuIdList = [];
    let functionIdList = [];
    const { res } = (await webapi.fetchRoleMenuAuths(roleInfoId)) as any;
    if (
      res.context &&
      res.context.menuIdList &&
      res.context.menuIdList.length > 0
    ) {
      menuIdList = res.context.menuIdList;
    }
    if (
      res.context &&
      res.context.functionIdList &&
      res.context.functionIdList.length > 0
    ) {
      functionIdList = res.context.functionIdList;
    }
    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('authority:selectedRole', roleInfoId);
      this.dispatch('authority:roles', roleName);
      this.dispatch('authority:allMenus', bossMenus);
      this.dispatch(
        'authority:bossMenus',
        isThird ? fromJS(thirdAllGradeMenus) : allGradeMenus
      );
      this.dispatch('authority:menuIdList', fromJS(menuIdList));
      this.dispatch('authority:functionIdList', fromJS(functionIdList));
    });
  };

  /**
   * 获取子菜单与权限
   * @param list
   * @private
   */
  _getChildren = (list, dataList) => {
    return list.map((data) => {
      const children = dataList.filter(
        (item) => item.get('pid') == data.get('id')
      );
      if (!children.isEmpty()) {
        data = data.set('children', this._getChildren(children, dataList));
      }
      return data;
    });
  };

  /**
   * 勾选菜单与权限触发的事件
   * @param menuIdList
   * @param functionIdList
   */
  onCheckMenuAuth = (menuIdList, functionIdList) => {
    this.transaction(() => {
      this.dispatch('authority:menuIdList', menuIdList);
      this.dispatch('authority:functionIdList', functionIdList);
    });
  };

  /**
   * 保存权限
   * @returns {Promise<void>}
   */
  onSave = async () => {
    const roleInfoId = this.state().get('selectedRoleId');
    const menuIdList = this.state().get('menuIdList');
    const functionIdList = this.state().get('functionIdList');
    if (roleInfoId) {
      const { res } = (await webapi.updateBossMenus({
        roleInfoId,
        menuIdList,
        functionIdList
      })) as any;
      this.messageByResult(res);
    }
  };

  /**
   * 创建
   */
  onCreate = () => {
    this.transaction(() => {
      this.dispatch('modal:show');
      this.dispatch('authority:edit', false);
    });
  };

  /**
   * 取消
   */
  onCancel = () => {
    this.dispatch('modal:hide');
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  }
}
