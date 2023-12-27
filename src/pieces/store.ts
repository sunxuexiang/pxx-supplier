import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, history } from 'qmkit';
import moment from 'moment';
import * as webApi from './webapi';
import Actor from './actor/actor';
import { FindArea } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new Actor()];
  }

  init = async () => {
    const { res } = await webApi.query();
    if (
      res.code == Const.SUCCESS_CODE &&
      res.context.freightTemplateDeliveryAreaVO
    ) {
      const destinationArea =
        res.context.freightTemplateDeliveryAreaVO.destinationArea;
      const areaAry =
        destinationArea && destinationArea[0] != ''
          ? res.context.freightTemplateDeliveryAreaVO.destinationArea
          : [];

      const cityAreaAry =
        res.context.areaTenFreightTemplateDeliveryAreaVO != null
          ? res.context.areaTenFreightTemplateDeliveryAreaVO.destinationArea
          : [];

      const areaName =
        res.context.freightTemplateDeliveryAreaVO != null
          ? res.context.freightTemplateDeliveryAreaVO.destinationAreaName
          : [];

      const cityName =
        res.context.areaTenFreightTemplateDeliveryAreaVO != null
          ? res.context.areaTenFreightTemplateDeliveryAreaVO.destinationAreaName
          : [];
      console.log(areaName, cityAreaAry, '11111111111');

      // this.dispatch('areas: changeArea', { cityAreaAry, destinationAreaName });
      // this.dispatch('areas: changeCityArea', { areaAry, tinationAreaName });

      const cityAreaId =
        res.context.areaTenFreightTemplateDeliveryAreaVO != null
          ? res.context.areaTenFreightTemplateDeliveryAreaVO.id
          : -1;
      const id = res.context.freightTemplateDeliveryAreaVO.id;
      this.dispatch('areas: init', {
        areaAry,
        cityName,
        id,
        cityAreaAry,
        areaName,
        cityAreaId
      });
      console.info(areaAry);
      console.info(cityAreaAry);
      console.info(cityName);
      console.info(areaName);
      console.info(id);
      const { areaParam, cityAreaParam } = this.state().toJS();
      console.log(areaParam, cityAreaParam, '222222');
    }
  };

  /**
   * 点击保存
   */
  handleSave = async () => {
    const {
      areaParam,
      id,
      cityAreaParam,
      cityAreaId,
      areaName,
      cityName,
      areaAry,
      cityAreaAry
    } = this.state().toJS();
    console.info(this.state().toJS());
    console.log(cityAreaAry, 'names');
    if (cityAreaAry.length <= 0) {
      return message.error('请选择乡镇件');
    }
    let villageIds = cityAreaAry.map((el) => {
      return el.villageId;
    });
    const lists = (await webApi.checkaddressList(villageIds)) as any;
    if (lists.res.context.length > 0) {
      let text = '';
      // message.error(lists.message);
      await lists.res.context.forEach((el) => {
        text = el + ',' + text;
      });
      return message.error('存在已有, ' + text);
    }
    const { res } = (await webApi.save(cityAreaAry)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
      history.push('/pieces-list');
    } else {
      message.error(res.message);
    }
  };

  changeArea = (value, label) => {
    // console.info('changeArea');
    this.dispatch('areas: changeArea', { value, label });
  };

  changeCityArea = (value) => {
    // console.info('changeCityArea');
    // console.log(value, '222222222222');

    this.dispatch('areas: changeCityArea', value);
  };
}
