import { Actor, Action } from 'plume2';
import { fromJS, OrderedMap } from 'immutable';
import { IMap, IList } from 'typings/globalType';

export default class PriceActor extends Actor {
  defaultState() {
    return {
      // 设价方式 0:客户,1:区间, 2:以门店价销售
      priceOpt: 2,
      // 门店价
      mtkPrice: '',
      // 成本价
      costPrice: '',
      // 是否开启按客户单独定价
      openUserPrice: false,
      // 级别价格Map
      userLevelPrice: {},
      // 用户价格Map
      userPrice: {},
      // 是否叠加客户等级折扣
      levelDiscountFlag: false,
      // 区间价Map
      areaPrice: OrderedMap(
        fromJS({
          0: {
            intervalPriceId: 0,
            count: 1
          }
        })
      ),

      userLevelList: [],
      levelCountChecked: false,
      levelCountDisable: false,
      levelMaxCountChecked: false,
      levelMaxCountDisable: false,
      userCountChecked: false,
      userCountDisable: false,
      userMaxCountChecked: false,
      userMaxCountDisable: false
    };
  }

  /**
   * 更改价格设置
   */
  @Action('priceActor: editPriceSetting')
  editPriceSetting(state, { key, value }: { key: string; value: any }) {
    state = state.set(key, value);
    return state;
  }

  /**
   * 初始化价格
   */
  @Action('priceActor: initPrice')
  initPrice(state, { key, priceMap }: { key: string; priceMap: IMap }) {
    return state.set(key, priceMap);
  }

  /**
   * 修改级别价单个属性
   * @param state
   * @param param1
   */
  @Action('priceActor: editUserLevelPriceItem')
  editUserLevelPriceItem(
    state,
    {
      userLevelId,
      key,
      value
    }: { userLevelId: string; key: string; value: string }
  ) {
    const map = fromJS({
      [userLevelId]: {
        levelId: userLevelId,
        [key]: value
      }
    });
    return state.update('userLevelPrice', (userLevelPrice) =>
      userLevelPrice.mergeDeep(map)
    );
  }

  /**
   * 修改级别价
   * @param state
   * @param param1
   */
  @Action('priceActor: editUserPrice')
  editUserPrice(
    state,
    {
      userId,
      userName,
      userLevelName
    }: { userId: string; userName: string; userLevelName: string }
  ) {
    const count = state.get('userPrice').count();
    if (count === 0) {
      state = state.set('userPrice', OrderedMap());
    }
    const userPriceMap = {
      customerId: userId,
      userName,
      userLevelName
    };

    // 如果勾选了 起订量／限订量 全部相同
    if (count > 0) {
      if (state.get('userCountChecked')) {
        userPriceMap['count'] = state
          .get('userPrice')
          .toList()
          .getIn([0, 'count']);
      }
      if (state.get('userMaxCountChecked')) {
        userPriceMap['maxCount'] = state
          .get('userPrice')
          .toList()
          .getIn([0, 'maxCount']);
      }
    }

    const map = fromJS({
      [userId]: userPriceMap
    });
    return state.update('userPrice', (userPrice) => userPrice.mergeDeep(map));
  }

  /**
   * 删除级别价
   * @param state
   * @param param1
   */
  @Action('priceActor: deleteUserPrice')
  deleteUserPrice(state, userId: string) {
    return state.update('userPrice', (userPrice) => userPrice.delete(userId));
  }

  /**
   * 修改级别价单个属性
   * @param state
   * @param param1
   */
  @Action('priceActor: editUserPriceItem')
  editUserPriceItem(
    state,
    { userId, key, value }: { userId: string; key: string; value: string }
  ) {
    const map = fromJS({
      [userId]: {
        customerId: userId,
        [key]: value
      }
    });
    return state.update('userPrice', (userPrice) => userPrice.mergeDeep(map));
  }

  /**
   * 修改区价单个属性
   * @param state
   * @param param1
   */
  @Action('priceActor: editAreaPriceItem')
  editAreaPriceItem(
    state,
    { id, key, value }: { id: string; key: string; value: string }
  ) {
    const map = fromJS({
      [id]: {
        [key]: value
      }
    });
    return state.update('areaPrice', (areaPrice) => areaPrice.mergeDeep(map));
  }

  /**
   * 删除区间价
   * @param state
   * @param id
   */
  @Action('priceActor: deleteAreaPrice')
  deleteAreaPrice(state, id: string) {
    return state.update('areaPrice', (areaPrice) => areaPrice.delete(id + ''));
  }

  /**
   * 新增区间价
   * @param state
   * @param param1
   */
  @Action('priceActor: addAreaPrice')
  addAreaPrice(state) {
    const id = Math.random()
      .toString()
      .substring(2);
    const map = fromJS({
      [id]: { intervalPriceId: id }
    });
    return state.update('areaPrice', (areaPrice) => areaPrice.mergeDeep(map));
  }

  @Action('priceActor: setUserLevelList')
  setUserLevelList(state, userLevelList: IList) {
    return state.set('userLevelList', userLevelList);
  }

  /**
   * 同步等级起订量
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: synchLevelCount')
  synchCountLevel(state) {
    if (state.get('levelCountChecked')) {
      let userLevelPrice = state.get('userLevelPrice');
      let userLevelList = state.get('userLevelList');
      if (
        !userLevelPrice.get(userLevelList.get(0).get('customerLevelId') + '')
      ) {
        userLevelList.toArray().forEach((v) => {
          userLevelPrice = userLevelPrice
            .setIn([v.get('customerLevelId') + '', 'count'], null)
            .setIn(
              [v.get('customerLevelId') + '', 'levelId'],
              v.get('customerLevelId')
            );
        });
      } else {
        userLevelList.toArray().forEach((v) => {
          userLevelPrice = userLevelPrice
            .setIn(
              [v.get('customerLevelId') + '', 'count'],
              userLevelPrice
                .get(userLevelList.get(0).get('customerLevelId') + '')
                .get('count')
            )
            .setIn(
              [v.get('customerLevelId') + '', 'levelId'],
              v.get('customerLevelId')
            );
        });
      }
      return state
        .set('levelCountDisable', true)
        .set('userLevelPrice', userLevelPrice);
    }
    return state.set('levelCountDisable', false);
  }

  /**
   * 更新等级起订量选中状态
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: editLevelCountChecked')
  updateCountLevelChecked(state, levelCountChecked: boolean) {
    return state.set('levelCountChecked', levelCountChecked);
  }

  /**
   * 同步等级限订量
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: synchLevelMaxCount')
  synchMaxLevelCount(state) {
    if (state.get('levelMaxCountChecked')) {
      let userLevelPrice = state.get('userLevelPrice');
      let userLevelList = state.get('userLevelList');
      if (
        !userLevelPrice.get(userLevelList.get(0).get('customerLevelId') + '')
      ) {
        userLevelList.toArray().forEach((v) => {
          userLevelPrice = userLevelPrice
            .setIn([v.get('customerLevelId') + '', 'maxCount'], null)
            .setIn(
              [v.get('customerLevelId') + '', 'levelId'],
              v.get('customerLevelId')
            );
        });
      } else {
        userLevelList.toArray().forEach((v) => {
          userLevelPrice = userLevelPrice
            .setIn(
              [v.get('customerLevelId') + '', 'maxCount'],
              userLevelPrice
                .get(userLevelList.get(0).get('customerLevelId') + '')
                .get('maxCount')
            )
            .setIn(
              [v.get('customerLevelId') + '', 'levelId'],
              v.get('customerLevelId')
            );
        });
      }
      return state
        .set('levelMaxCountDisable', true)
        .set('userLevelPrice', userLevelPrice);
    }
    return state.set('levelMaxCountDisable', false);
  }

  /**
   * 更新等级限订量选中状态
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: editLevelMaxCountChecked')
  updateMaxLevelCountChecked(state, levelMaxCountChecked: boolean) {
    return state.set('levelMaxCountChecked', levelMaxCountChecked);
  }

  /**
   * 同步客户起订量
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: synchUserCount')
  synchUserLevel(state) {
    if (state.get('userCountChecked')) {
      let userPrice = state.get('userPrice');
      let userPriceData = userPrice.valueSeq().toList();
      userPrice.forEach((value, key) => {
        userPrice = userPrice.set(
          key,
          value.setIn(
            ['count'],
            userPrice
              .get(userPriceData.get(0).get('customerId') + '')
              .get('count')
          )
        );
      });

      return state.set('userCountDisable', true).set('userPrice', userPrice);
    }
    return state.set('userCountDisable', false);
  }

  /**
   * 更新客户起订量选中状态
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: editUserCountChecked')
  updateCountUserChecked(state, userCountChecked: boolean) {
    return state.set('userCountChecked', userCountChecked);
  }

  /**
   * 同步客户限订量
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: synchUserMaxCount')
  synchUserMaxCount(state) {
    if (state.get('userMaxCountChecked')) {
      let userPrice = state.get('userPrice');
      let userPriceData = userPrice.valueSeq().toList();
      userPrice.forEach((value, key) => {
        userPrice = userPrice.set(
          key,
          value.setIn(
            ['maxCount'],
            userPrice
              .get(userPriceData.get(0).get('customerId') + '')
              .get('maxCount')
          )
        );
      });

      return state.set('userMaxCountDisable', true).set('userPrice', userPrice);
    }
    return state.set('userMaxCountDisable', false);
  }

  /**
   * 更新客户限订量选中状态
   * @param state
   * @returns {any}
   * @private
   */
  @Action('priceActor: editUserMaxCountChecked')
  updateMaxCountUserChecked(state, userMaxCountChecked: boolean) {
    return state.set('userMaxCountChecked', userMaxCountChecked);
  }
}
