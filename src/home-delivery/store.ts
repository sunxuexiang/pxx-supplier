import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, history } from 'qmkit';
import moment from 'moment';
import * as webApi from './webapi';
import Actor from './actor/actor';

export default class AppStore extends Store {
  bindActor() {
    return [new Actor()];
  }

  init = async (wareIdTab) => {
    const { res } = await webApi.query();
    if (res.code == Const.SUCCESS_CODE && res.context) {
      console.log(res.context, '免费店配', wareIdTab);
      if (!wareIdTab) {
        wareIdTab = res.context[0].areaTenFreightTemplateDeliveryAreaVO.wareId;
      }
      res.context.forEach((element) => {
        if (
          wareIdTab ==
          Number(element.areaTenFreightTemplateDeliveryAreaVO.wareId)
        ) {
          const destinationArea =
            element.freightTemplateDeliveryAreaVO.destinationArea;
          const areaAry =
            destinationArea && destinationArea[0] != ''
              ? element.freightTemplateDeliveryAreaVO.destinationArea
              : [];

          const cityAreaAry =
            element.areaTenFreightTemplateDeliveryAreaVO != null
              ? element.areaTenFreightTemplateDeliveryAreaVO.destinationArea
              : [];

          const areaName =
            element.freightTemplateDeliveryAreaVO != null
              ? element.freightTemplateDeliveryAreaVO.destinationAreaName
              : [];

          const cityName =
            element.areaTenFreightTemplateDeliveryAreaVO != null
              ? element.areaTenFreightTemplateDeliveryAreaVO.destinationAreaName
              : [];
          console.log(areaName, cityAreaAry, '11111111111');

          // this.dispatch('areas: changeArea', { cityAreaAry, destinationAreaName });
          // this.dispatch('areas: changeCityArea', { areaAry, tinationAreaName });

          const cityAreaId =
            element.areaTenFreightTemplateDeliveryAreaVO != null
              ? element.areaTenFreightTemplateDeliveryAreaVO.id
              : -1;
          const id = element.freightTemplateDeliveryAreaVO.id;
          const five_pcsNumber =
            element.freightTemplateDeliveryAreaVO.freightFreeNumber;
          const ten_pcsNumber =
            element.areaTenFreightTemplateDeliveryAreaVO.freightFreeNumber;
          const wareId = element.areaTenFreightTemplateDeliveryAreaVO.wareId;
          const openFlag = element.freightTemplateDeliveryAreaVO.openFlag || 0;
          this.dispatch('areas: init', {
            areaAry,
            cityName,
            id,
            cityAreaAry,
            areaName,
            cityAreaId,
            five_pcsNumber,
            ten_pcsNumber,
            wareId,
            openFlag
          });
          this.dispatch('liswre: init', res.context);
        }
      });
      // const destinationArea =
      //   res.context[0].freightTemplateDeliveryAreaVO.destinationArea;
      // const areaAry =
      //   destinationArea && destinationArea[0] != ''
      //     ? res.context[0].freightTemplateDeliveryAreaVO.destinationArea
      //     : [];

      // const cityAreaAry =
      //   res.context[0].areaTenFreightTemplateDeliveryAreaVO != null
      //     ? res.context[0].areaTenFreightTemplateDeliveryAreaVO.destinationArea
      //     : [];

      // const areaName =
      //   res.context[0].freightTemplateDeliveryAreaVO != null
      //     ? res.context[0].freightTemplateDeliveryAreaVO.destinationAreaName
      //     : [];

      // const cityName =
      //   res.context[0].areaTenFreightTemplateDeliveryAreaVO != null
      //     ? res.context[0].areaTenFreightTemplateDeliveryAreaVO
      //       .destinationAreaName
      //     : [];
      // console.log(areaName, cityAreaAry, '11111111111');

      // // this.dispatch('areas: changeArea', { cityAreaAry, destinationAreaName });
      // // this.dispatch('areas: changeCityArea', { areaAry, tinationAreaName });

      // const cityAreaId =
      //   res.context[0].areaTenFreightTemplateDeliveryAreaVO != null
      //     ? res.context[0].areaTenFreightTemplateDeliveryAreaVO.id
      //     : -1;
      // const id = res.context[0].freightTemplateDeliveryAreaVO.id;
      // const five_pcsNumber = res.context[0].freightTemplateDeliveryAreaVO.freightFreeNumber;
      // const ten_pcsNumber = res.context[0].areaTenFreightTemplateDeliveryAreaVO.freightFreeNumber;
      // const wareId = res.context[0].areaTenFreightTemplateDeliveryAreaVO.wareId;
      // this.dispatch('areas: init', {
      //   areaAry,
      //   cityName,
      //   id,
      //   cityAreaAry,
      //   areaName,
      //   cityAreaId,
      //   five_pcsNumber,
      //   ten_pcsNumber,
      //   wareId
      // });
      // this.dispatch('liswre: init', res.context);
      // console.info(areaAry);
      // console.info(cityAreaAry);
      // console.info(cityName);
      // console.info(areaName);
      // console.info(id);
      // const { areaParam, cityAreaParam } = this.state().toJS();
      // console.log(areaParam, cityAreaParam, '222222');
    }
  };

  wareIdInit = (wareIda) => {
    // this.dispatch('areas: changeCityArea', { value: [], label: [] });
    // this.dispatch('areas: changeArea', { value: [], label: [] });
    this.dispatch('wareIdas: init', wareIda);
    history.replace({
      pathname: '/home-delivery',
      state: {
        wareId: wareIda
      }
    });
    return;
    const { liswre } = this.state().toJS();
    liswre.forEach((element) => {
      console.log(
        element.areaTenFreightTemplateDeliveryAreaVO.wareId,
        wareIda,
        'wareIdawareIdawareIda'
      );
      if (
        wareIda == Number(element.areaTenFreightTemplateDeliveryAreaVO.wareId)
      ) {
        const destinationArea =
          element.freightTemplateDeliveryAreaVO.destinationArea;
        const areaAry =
          destinationArea && destinationArea[0] != ''
            ? element.freightTemplateDeliveryAreaVO.destinationArea
            : [];

        const cityAreaAry =
          element.areaTenFreightTemplateDeliveryAreaVO != null
            ? element.areaTenFreightTemplateDeliveryAreaVO.destinationArea
            : [];

        const areaName =
          element.freightTemplateDeliveryAreaVO != null
            ? element.freightTemplateDeliveryAreaVO.destinationAreaName
            : [];

        const cityName =
          element.areaTenFreightTemplateDeliveryAreaVO != null
            ? element.areaTenFreightTemplateDeliveryAreaVO.destinationAreaName
            : [];

        const cityAreaId =
          element.areaTenFreightTemplateDeliveryAreaVO != null
            ? element.areaTenFreightTemplateDeliveryAreaVO.id
            : -1;
        const id = element.freightTemplateDeliveryAreaVO.id;
        const five_pcsNumber =
          element.freightTemplateDeliveryAreaVO.freightFreeNumber;
        const ten_pcsNumber =
          element.areaTenFreightTemplateDeliveryAreaVO.freightFreeNumber;
        const wareId = element.areaTenFreightTemplateDeliveryAreaVO.wareId;
        this.dispatch('areas: init', {
          areaAry,
          cityName,
          id,
          cityAreaAry,
          areaName,
          cityAreaId,
          five_pcsNumber,
          ten_pcsNumber,
          wareId
        });
        return;
      }
      //  else {
      //   console.log('沒有找到');

      //   const destinationArea = [];
      //   const areaAry = [];

      //   const cityAreaAry = [];

      //   const areaName = [];

      //   const cityName = [];
      //   const cityAreaId = -1;
      //   const id = wareIda;
      //   const five_pcsNumber = 5;
      //   const ten_pcsNumber = 10;
      //   this.dispatch('areas: init', {
      //     areaAry,
      //     cityName,
      //     id,
      //     cityAreaAry,
      //     areaName,
      //     cityAreaId,
      //     five_pcsNumber,
      //     ten_pcsNumber,
      //     wareIda
      //   });
      // }
    });
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
      cityAreaAry,
      wareId,
      five_pcsNumber,
      ten_pcsNumber,
      openFlag
    } = this.state().toJS();
    console.info(this.state().toJS());
    console.log(areaName, cityName, 'names');

    console.log('=========保存==============');
    // return
    let freightTemplateDeliveryAreaList = [
      {
        destinationType: 0, // 免费店配
        destinationArea:
          areaParam.destinationArea.length > 0
            ? areaParam.destinationArea
            : areaAry,
        destinationAreaName:
          areaParam.destinationAreaName.length > 0
            ? areaParam.destinationAreaName
            : areaName,
        id: id,
        wareId,
        openFlag,
        freightFreeNumber: five_pcsNumber
      }
      // 商家入驻需求  此设置已被乡镇件设置替代  故注释
      // {
      //   destinationType: 1, // 10件起免运费设置覆盖区域
      //   destinationArea:
      //     cityAreaParam.destinationArea.length > 0
      //       ? cityAreaParam.destinationArea
      //       : cityAreaAry,
      //   destinationAreaName:
      //     cityAreaParam.destinationAreaName.length > 0
      //       ? cityAreaParam.destinationAreaName
      //       : cityName,
      //   id: cityAreaId == '-1' ? '' : cityAreaId,
      //   wareId,
      //   freightFreeNumber: ten_pcsNumber
      // }
    ];
    const params = {
      freightTemplateDeliveryAreaList: freightTemplateDeliveryAreaList
    };
    console.info(params);

    const { res } = (await webApi.save(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
    } else {
      message.error(res.message);
    }
  };
  numbersChnage = ({ keys, value }) => {
    this.dispatch('number: set', { keys, value });
  };
  changeArea = (value, label) => {
    console.info('changeArea', value, label);
    this.dispatch('areas: changeArea', { value, label });
  };
  openFlagChange = (checked) => {
    this.dispatch('openFlag: set', checked ? 1 : 0);
  };
  changeCityArea = (value, label) => {
    console.info('changeCityArea');
    console.log(value, label, '222222222222');

    this.dispatch('areas: changeCityArea', { value, label });
  };
}
