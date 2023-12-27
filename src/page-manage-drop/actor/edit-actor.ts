import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';
export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      backGroundPic: '',
      miniProgramQrCode: '',
      pageId: '',
      qrCode: '',
      sources: [],
      url: '',
      useType: 0,
      images: [],
      isShowInputFlag: false,
      submitInput: '',
      platform: 'weixin'
    };
  }

  constructor() {
    super();
  }
  @Action('form:info')
  formChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
  /**
   * 保存数据
   * @param state
   */
  @Action('changeInfo:setInfo')
  setInfo(state: IMap, value) {
    let imagesUrl = [
      {
        uid: '',
        name: '',
        size: '',
        status: 'done',
        response: [value.popupUrl]
      }
    ];
    // console.log('imagesUrl', imagesUrl);
    let radioKey = value.launchFrequency.split(',')[0];
    let radioTimes = 0;
    if (value.launchFrequency.split(',').length > 1) {
      radioTimes = value.launchFrequency.split(',')[1];
    }
    return state
      .set('applicationPageName', value.applicationPageName.split(';'))
      .set('beginTime', value.beginTime)
      .set('endTime', value.endTime)
      .set('popupName', value.popupName)
      .set('jumpPage', value.jumpPage)
      .set('jumpPage', value.jumpPage)
      .set('popupUrl', value.popupUrl)
      .set('radioKey', radioKey)
      .set('radioTimes', radioTimes)
      .set('launchFrequency', value.launchFrequency)
      .set('images', imagesUrl)
      .set('jumpPage', value.jumpPage)
      .set('popupStatus', value.popupStatus);
  }

  /**
   *
   * @param state
   */
  @Action('changeInfo:setId')
  changePopId(state: IMap, value) {
    return state.set('popupId', value);
  }
  /**
   *
   * @param state
   */
  @Action('changeInfo:JumpPage')
  changeInfoJumpPage(state: IMap, value) {
    return state.set('jumpPage', value);
  }
  /**
   *
   * @param state
   */
  @Action('changeInfo:popupName')
  changeName(state: IMap, value) {
    return state.set('popupName', value);
  }

  /**
   * 修改radio状态
   * @param state
   */
  @Action('changeInfo:radioKey')
  changeInfo(state: IMap, value) {
    return state.set('radioKey', value);
  }
  /**
   * 修改频率
   * @param state
   */
  @Action('changeInfo:times')
  changeTimes(state: IMap, value) {
    return state.set('radioTimes', value);
  }
  /**
   * 图片地址
   * @param state
   */
  @Action('changeInfo:images')
  changeUploadFile(state: IMap, value) {
    return state.set('images', value);
  }

  /**
   * 修改应用界面
   * @param state
   */
  @Action('changeInfo:applicationPageName')
  onChangeCheckBox(state: IMap, value) {
    return state.set('applicationPageName', value);
  }
  /**
   * 修改应用界面
   * @param state
   */
  @Action('changeInfo:changeTime')
  onChangeDate(state: IMap, value) {
    return state
      .set('beginTime', value.beginTime)
      .set('endTime', value.endTime);
  }
}
