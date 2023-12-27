import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import loadingActor from './actor/loading-actor';
import listActor from './actor/list-actor';
import editActor from './actor/edit-actor';
import visibleActor from './actor/visible-actor';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new loadingActor(),
      new listActor(),
      new editActor(),
      new visibleActor()
    ];
  }

  init = async (param?) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFinaceTicket(param);

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', fromJS(res));
      this.dispatch('current', param && param.pageNum + 1);
    });
  };

  onAdd = async () => {
    const { res } = await webapi.fetchFinaceTicket();

    if (res && res['totalElements']) {
      if (res['totalElements'] < 100) {
        this.dispatch('modal:show');
      } else {
        message.error('开票项目最多支持100条');
      }
    } else {
      message.error('系统异常，请稍后再试');
    }
  };

  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onEdit = (id: string) => {
    const project = this.state()
      .get('dataList')
      .find((project) => project.get('projectId') == id);

    this.transaction(() => {
      this.dispatch('edit', true);
      this.dispatch('edit:init', project);
      this.dispatch('modal:show');
    });
  };

  onSave = async (params) => {
    if (this.state().get('edit')) {
      params.projectId = this.state().getIn(['projectForm', 'projectId']);
      const { res } = await webapi.editFinaceTicket(params);

      if (res.code === Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.dispatch('edit', false);
        this.dispatch('modal:hide');
        //修改分页留在当前
        this.init({ pageNum: this.state().get('current') - 1 });
      } else {
        message.error(res.message);
      }
      return;
    }

    const { res: addFinance } = await webapi.addFinaceTicket(params);
    if (addFinance.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('modal:hide');
      this.init({ pageNum: this.state().get('current') - 1 });
    } else {
      message.error(addFinance.message);
    }
  };

  onDelete = async (id) => {
    const { res } = await webapi.deleteFinaceTicket(id);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: this.state().get('current') - 1 });
    } else {
      message.error(res.message);
    }
  };
}
