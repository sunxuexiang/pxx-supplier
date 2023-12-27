import { Store } from 'plume2';
import * as webapi from './webapi';
import { history } from 'qmkit';
import EditActor from './actor/edit-actor';
import { message } from 'antd';
export default class AppStore extends Store {
  bindActor() {
    return [new EditActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?) => {
    const res = (await webapi.fetchDetail(param)) as any;
    let pageInfoExtend = res.res.context.pageInfoExtend;
    this.changeFieldInfo('backGroundPic', pageInfoExtend.backgroundPic);
    this.changeFieldInfo('miniProgramQrCode', pageInfoExtend.miniProgramQrCode);
    this.changeFieldInfo('pageId', pageInfoExtend.pageId);
    this.changeFieldInfo('qrCode', pageInfoExtend.qrCode);
    this.changeFieldInfo('sources', pageInfoExtend.sources);
    this.changeFieldInfo('url', pageInfoExtend.url);
    this.changeFieldInfo('platform', param.platform);
    this.changeFieldInfo('useType', pageInfoExtend.useType);
  };
  changeFieldInfo = (key, value) => {
    this.dispatch('form:info', {
      key,
      value
    });
  };
  //链接保存
  saveInput = async () => {
    const query = this.state();
    let sources = query.get('sources') || [];
    let inputRegx = /[^\u4E00-\u9FA5]/g; //不允许输入汉字
    let submitInput = query.get('submitInput');
    let repeatArry = sources.filter((v) => v == submitInput);
    if (repeatArry.length > 0) return message.error('请勿重复添加渠道');
    if (inputRegx.test(submitInput)) {
      sources.push(submitInput);
      await this.changeFieldInfo('sources', sources);
      await this.submit();
    } else {
      message.error('渠道标记，只允许包括 字母 数字 和上下划线、星号');
    }
  };
  //删除链接
  deleteLink = async (i) => {
    const query = this.state();
    let sources = query.get('sources') || [];
    let newSource = sources.filter((ele) => ele != i);
    await this.changeFieldInfo('sources', newSource);
    await this.submit();
  };
  submitSave = async () => {
    const query = this.state();
    const res = (await webapi.updatePageInfo({ ...query.toJS() })) as any;
    if (res.res.code == 'K-000000') {
      message.success('提交成功');
      history.push({ pathname: '/page-manage/weixin' });
    }
    console.log('res', res);
  };
  //提交
  submit = async () => {
    const query = this.state();
    const res = await webapi.updatePageInfo({ ...query.toJS() });
    await this.changeFieldInfo('isShowInputFlag', false);
    await this.changeFieldInfo('submitInput', '');
    console.log('query', query.toJS());
  };
}
