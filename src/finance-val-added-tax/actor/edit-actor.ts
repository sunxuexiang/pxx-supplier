import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      saveForm: {
        //会员id
        customerId: '',
        //单位全称
        companyName: '',
        //纳税人识别号
        taxpayerNumber: '',
        //单位电话
        companyPhone: '',
        //单位地址
        companyAddress: '',
        //银行基本户号
        bankNo: '',
        //开户行
        bankName: '',
        //营业执照复印件
        businessLicenseImg: '',
        //一般纳税人认证资格复印件
        taxpayerIdentificationImg: '',
        //增票资质审核状态
        checkState: null
      }
    };
  }

  @Action('modal:show')
  show(state: IMap) {
    return state.set('visible', true);
  }

  @Action('modal:hide')
  hide(state: IMap) {
    return state.set('visible', false);
  }
}
