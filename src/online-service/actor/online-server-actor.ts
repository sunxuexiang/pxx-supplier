import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
export default class IndexActor extends Actor {
  defaultState() {
    return {
      //客服设置
      onlineServer: {},
      //客服列表
      onlineServerList: [],
      //弹窗显隐
      smsVisible: false,
      //是否需要新增一条
      setOneFlag: '',
      //是否需要校验
      checkFlag: true,
      //是否启用
      enableFlag: false
    };
  }

  /**
   * 初始化加载在线客服设置
   * @param {IMap} state
   * @param context
   * @returns {Map<string, any>}
   */
  @Action('ONLINE_SERVER_INIT')
  onlineServerInit(state: IMap, context) {
    const onlineServer = fromJS(context);
    return state
      .set('onlineServer', onlineServer)
      .set('enableFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 初始化加载在线客服列表
   * @param {IMap} state
   * @param context
   * @returns {Map<string, any>}
   */
  @Action('ONLINE_SERVER_LIST')
  onlineServerList(state: IMap, context) {
    let onlineServerList = context.qqOnlineServerItemRopList;
    if (onlineServerList) {
      onlineServerList = onlineServerList.map((v) => {
        v.key = Math.random()
          .toString()
          .substring(2);
        return v;
      });
    }

    const onlineServer = fromJS(context.qqOnlineServerRop);
    let setOneFlag = onlineServerList && onlineServerList.length > 0 ? '1' : '';

    return state
      .set(
        'onlineServerList',
        onlineServerList ? fromJS(onlineServerList) : fromJS([])
      )
      .set('onlineServer', onlineServer)
      .set('setOneFlag', setOneFlag)
      .set('checkFlag', onlineServer.get('serverStatus') == 1)
      .set('enableFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 弹窗显隐
   * @param {IMap} state
   * @returns {Map<string, any>}
   */
  @Action('modal:changeQQShow')
  changeQQShow(state: IMap) {
    return state.set('smsVisible', !state.get('smsVisible'));
  }

  /**
   * 值改变
   * @param {IMap} state
   * @param {any} field
   * @param {any} value
   * @returns {Map<string, any>}
   */
  @Action('ON_FORM_CHANGE')
  onFormChange(state: IMap, { field, value }) {
    let onlineServer = state.get('onlineServer');
    onlineServer = onlineServer.setIn([field], value);

    return state
      .set('onlineServer', onlineServer)
      .set('checkFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 新增客服
   * @param state
   * @returns {*}
   */
  @Action('ADD_ONLINE_SERVER')
  onAddOnlineServer(state: IMap) {
    const onlineServer = state.get('onlineServer');
    let onlineServerList = state.get('onlineServerList');

    let newServer = fromJS({
      key: Math.random()
        .toString()
        .substring(2),
      serviceItemId: null,
      storeId: onlineServer.get('storeId'),
      onlineServiceId: onlineServer.get('onlineServiceId'),
      customerServiceName: '',
      customerServiceAccount: ''
    });
    onlineServerList = onlineServerList.push(newServer);
    let setOneFlag = '1';
    return state
      .set('onlineServerList', onlineServerList)
      .set('setOneFlag', setOneFlag);
  }

  /**
   * 客服编辑
   * @param state
   * @param index
   * @param field
   * @param text
   */
  @Action('SET_ONLINE_SERVER')
  onSetOnlineServer(state: IMap, { index, field, text }) {
    let onlineServerList = state.get('onlineServerList');
    onlineServerList = onlineServerList.setIn([index, field], text);

    return state.set('onlineServerList', onlineServerList);
  }

  /**
   * 删除客服
   * @param {IMap} state
   * @param index
   * @returns {Map<string, any>}
   */
  @Action('ON_DEL_ONLINE_SERVER')
  onDelOnlineServer(state: IMap, index) {
    let onlineServerList = state.get('onlineServerList');
    onlineServerList = onlineServerList.delete(index);

    let setOneFlag = onlineServerList.size > 0 ? '1' : '';
    return state
      .set('onlineServerList', onlineServerList)
      .set('setOneFlag', setOneFlag);
  }
}
