import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import ExpActor from './actor/exp-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ExpActor()];
  }

  init = async () => {
    const expressAll = await webapi.fetchAllExpress();
    if (expressAll.res.code == Const.SUCCESS_CODE) {
      const expressChecked = await webapi.fetchCheckedExpress();
      if (expressChecked.res.code == Const.SUCCESS_CODE) {
        this.dispatch('exp:init', {
          all: expressAll.res.context,
          checked: expressChecked.res.context
        });
      } else {
        message.error(expressChecked.res.message);
      }
    } else {
      message.error(expressAll.res.message);
    }
  };

  /**
   * 选中一个或多个快递公司
   *
   */
  onChecked = async (
    index: number,
    checked: boolean,
    expressCompanyId: Number
  ) => {
    const checkedRelation = this.state().get('checkedRelation');
    if (checked) {
      if (checkedRelation.size >= 20) {
        message.error('最多可设置20个物流公司');
      } else {
        const { res } = await webapi.addExpress(expressCompanyId);
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch('exp:afterChecked', res.context);
          this.dispatch('exp:checked', { index, checked });
        } else if (res.code == 'K-090903') {
          message.error('选择的物流公司不存在！');
          this.init();
        } else {
          message.error(res.message);
          this.init();
        }
      }
    } else {
      if (checkedRelation.get(expressCompanyId.toString())) {
        const { res } = await webapi.deleteExpress(
          checkedRelation.get(expressCompanyId.toString()),
          expressCompanyId.toString()
        );
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch('exp:afterUnChecked', expressCompanyId.toString());
          this.dispatch('exp:checked', { index, checked });
        } else {
          message.error(res.message);
          this.init();
        }
      }
    }
  };
}
