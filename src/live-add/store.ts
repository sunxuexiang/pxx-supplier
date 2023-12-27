import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, history } from 'qmkit';
import moment from 'moment';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 创建直播点击保存
   */
  handleSave = async (values) => {
    const chooseSkuIds = this.state().get('chooseSkuIds');
    console.log('dbeug88 chooseSkuIds handleSave', chooseSkuIds);
    //编辑参数
    const params = {
      name: values.title,
      coverImg: values.background.file.response[0],
      startTime: moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      anchorName: values.nickname,
      anchorWechat: values.weChart,
      shareImg: values.card.file.response[0],
      goodsIdList: chooseSkuIds
    };
    const { res: pageRes } = await webApi.add(params);
    if (pageRes.code === Const.SUCCESS_CODE) {
      history.push(`/live-room/${0}`);
      message.success('操作成功');
    } else {
      message.error(pageRes.message);
    }
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //保存商品信息
    this.dispatch('info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('info: field: value', {
      field: 'goodsRows',
      value: rows
    });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
  };
}
