import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import * as webapi from './webapi';
import LoadingActor from './actor/loading-actor';
import LevelActor from './actor/level-actor';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import { Const } from 'qmkit';
import SelfLevelActor from "./actor/self-level-actor";

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new LevelActor(),
      new SelfLevelActor(),
      new VisibleActor(),
      new EditActor()
    ];
  }


  init = () => {
    this.dispatch('loading:start');
    webapi.fetchCustomerLevel().then(({ res }) => {
      if (res.code === Const.SUCCESS_CODE) {
        if (res.context.storeLevelVOList.length > 0) {
          this.dispatch('edit: lastData', res.context.storeLevelVOList[res.context.storeLevelVOList.length - 1].storeLevelId);
        }
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('level:init', res.context);
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    });
  };

  initSelf = () => {
    this.dispatch('loading:start');
    webapi.fetchBossCustomerLevel().then(({ res }) => {
      if (res.code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('self-level:init', res.context);
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    });
  };

  onView = (id: number) => {
    const level = this.state()
      .get('selfDataList')
      .filter((v) => v.get('customerLevelId') == id)
      .first();

    this.transaction(() => {
      this.dispatch('self-level:view', level);
      this.dispatch('modal-self:show');
    });
  };

  onSelfViewHide = () => {
    this.dispatch('modal-self:hide');
  };

  /**
   * 添加
   */
  onCreate = () => {
    let data = this.state().get("dataList");
    if (data.size >= 10) {
      message.error("最多添加10个客户等级!")
      return
    }
    this.dispatch('modal:show');
  };

  /**
   * 关闭model
   */
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  /**
   * 保存
   */
  onSave = async (params) => {
    //更新
    if (this.state().get('edit')) {
      let storeLevelId = this.state().getIn(['customerLevel', 'storeLevelId'])
      const { res } = await webapi.updateCustomerLevel({ ...params, storeLevelId });
      if (res.code === Const.SUCCESS_CODE) {
        //取消编辑状态
        this.dispatch('edit', false);
        message.success("操作成功!");
        this.dispatch('modal:hide');
        this.init();
      } else {
        message.error(res.message);
      }
      return;
    }
    //保存
    const { res } = await webapi.saveCustomerLevel(params);
    if (res.code === Const.SUCCESS_CODE) {
      message.success("操作成功!");
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑
   */
  onEdit = async (rowInfo) => {
    this.transaction(() => {
      this.dispatch('edit', true);
      this.dispatch(
        'edit:init',
        fromJS({
          storeLevelId: rowInfo.storeLevelId,
          levelName: rowInfo.levelName,
          amountConditions: rowInfo.amountConditions,
          discountRate: rowInfo.discountRate,
          orderConditions: rowInfo.orderConditions
        })
      );
      this.dispatch('modal:show');
    });
  };

  /**
   * 删除
   */
  onDelete = async (customerLevelId: string) => {
    const { res } = await webapi.deleteCustomerLevel(customerLevelId);
    if (res.code === Const.SUCCESS_CODE) {
      message.success("操作成功!");
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };


}
