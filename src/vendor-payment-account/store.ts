import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import AccountActor from './actor/account-actor';
import ModalActor from './actor/modal-actor';
import * as webApi from '../vendor-new-accounts/webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new ModalActor(), new AccountActor()];
  }

  /**
   * 变更当前账号弹框
   */
  accountModal = () => {
    this.dispatch('modalActor: accountModal');
  };

  /**
   * 确认首次打款弹框
   */
  moneyModal = () => {
    this.dispatch('modalActor: moneyModal');
  };

  /**
   * 确认删除账号弹框
   */
  deleteModal = () => {
    this.dispatch('modalActor: deleteModal');
  };

  /**
   * 基本信息
   */
  init = async () => {
    //基础银行信息(所有银行列表)
    const { res: bank } = await webApi.fetchBaseBank();
    if (bank.code == Const.SUCCESS_CODE) {
      this.dispatch('account:allBanks', fromJS(bank.context));
    }
    //店铺信息
    const { res: storeInfo } = await webapi.fetchStoreInfo();
    if (storeInfo.code == Const.SUCCESS_CODE) {
      this.dispatch('account:storeInfo', fromJS(storeInfo.context));
    } else {
      message.error(storeInfo.message);
    }
    //工商信息（入驻时间）
    const { res } = (await webapi.findOne()) as any;
    const companyInfo = res.context;
    if (companyInfo) {
      this.dispatch(
        'account:applyEnterTime',
        (companyInfo as any).applyEnterTime
      );
    }
    //收款账户信息
    this.accountInfo();
  };

  /**
   * 商家收款账户
   */
  accountInfo = async () => {
    //收款账户信息
    const { res } = await webapi.getAccountList();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('account:init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 设为主账号
   */
  setMainAccount = async (id) => {
    const { res } = await webapi.setPrimary({
      accountId: id
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('设置成功');
      this.accountInfo();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 确认收到打款
   */
  affrimRemit = (res) => {
    this.transaction(() => {
      //打款弹框
      this.dispatch('modalActor: moneyModal');
      //弹框内容
      this.dispatch('modalActor:moneyModal:content', fromJS(res));
    });
  };

  /**
   * 变更账户信息
   * @param res
   */
  updateAccount = (res) => {
    this.transaction(() => {
      //编辑弹框
      this.dispatch('modalActor: accountModal');
      //弹框内容
      this.dispatch('modalActor:accountModal:content', fromJS(res));
    });
  };

  /**
   * 变更银行各个字段信息
   * @param field
   * @param value
   */
  onAccountChange = ({ field, value }) => {
    if (field == 'bankName') {
      this.dispatch('modalActor:change:account', {
        field: 'bankName',
        value: value.split('_')[0]
      });
      this.dispatch('modalActor:change:account', {
        field: 'bankCode',
        value: value.split('_')[1]
      });
    } else {
      this.dispatch('modalActor:change:account', { field, value });
    }
  };

  /**
   *保存编辑内容
   */
  saveAccountEdit = async () => {
    let accountArray = new Array();
    const accountModalContent = this.state().get('accountModalContent');
    accountArray.push(accountModalContent);
    const { res } = await webapi.saveAccountEdit({
      offlineAccounts: accountArray
    });
    if (res.code == Const.SUCCESS_CODE) {
      await this.accountInfo();
      message.success('编辑成功');
    } else {
      message.error(res.message);
    }
    //关闭弹框
    this.dispatch('modalActor: accountModal');
  };

  /**
   * 确认收到打款
   */
  confirmReceive = async () => {
    const moneyModalContent = this.state().get('moneyModalContent');
    //获取账户ID
    const { res } = await webapi.confirmReceive({
      accountId: moneyModalContent.get('accountId')
    });
    if (res.code == Const.SUCCESS_CODE) {
      await this.accountInfo();
      message.success('确认成功');
    } else {
      message.error(res.message);
    }
    this.dispatch('modalActor: moneyModal');
  };

  /**
   * 删除账号弹出
   */
  deleteAccount = (res) => {
    const accountList = this.state()
      .get('accountList')
      .toJS();
    if (res.isDefaultAccount == 1 && accountList.length == 1) {
      message.error('请至少保留一个账号');
    } else {
      this.transaction(() => {
        this.dispatch('modalActor: deleteModal');
        this.dispatch('modalActor:deleteModal:content', fromJS(res));
      });
    }
  };

  /**
   * 确认删除
   */
  doDelete = async () => {
    const deleteModalContent = this.state().get('deleteModalContent');
    let deleteIds = new Array();
    deleteIds.push(deleteModalContent.get('accountId'));

    if (
      this.state()
        .get('accountList')
        .toJS().length <= 1
    ) {
      message.error('至少保留一个收款账号');
      return;
    } else {
      const { res } = await webapi.saveAccountEdit({
        deleteIds: deleteIds
      });
      if (res.code == Const.SUCCESS_CODE) {
        message.success('删除成功！');
        this.accountInfo();
      } else {
        message.error(res.message);
      }
      this.dispatch('modalActor: deleteModal');
    }
  };

  /**
   * 设置主账号弹框
   */
  mainModal = () => {
    this.dispatch('modalActor:main');
  };

  /**
   * 关闭设置主弹框提示框
   */
  setMainVisible = () => {
    this.dispatch('modalActor:close');
  };
}
