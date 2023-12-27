import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const } from 'qmkit';

export default class ExtraInfoActor extends Actor {
  defaultState() {
    return {
      extra: {
        //买家备注
        buyerRemark: '',
        //卖家备注
        sellerRemark: '',
        //配送方式 0：其他   1：快递
        deliverWay: '',
        //支付方式 0：在线支付   1：线下转账
        payType: 1,
        //发票类型 0：普通发票 1：增值税专用发票 -1：无
        invoiceType: -1,
        //发票信息 0:个人 1:单位
        invoiceProjectType: 0,
        //开票项目
        invoiceResult: '-1',
        //附件
        images: fromJS([]),
        //开票项目
        projectOptions: fromJS([]),
        //发票抬头
        invoiceTitle: '',
        //发票独立收货地址 false:不使用 true:使用独立地址
        sperator: false,
        //物流公司
        logisticsCompanyList: [],
        //选中的物流公司信息
        selectLogistics: {}
      }
    };
  }

  @Action('extra:change')
  buyerRemark(state: IMap, { field, val }) {
    return state.setIn(['extra', field], val);
  }

  /**
   * 修改附件图片
   * @param state
   * @param images
   */
  @Action('extra:editImages')
  editImages(state, images) {
    return state.setIn(['extra', 'images'], images);
  }

  /**
   * 清除附加信息
   * @param state
   * @returns {Map<K, V>}
   */
  @Action('extra:clear')
  clear(state: IMap) {
    return state
      .setIn(['extra', 'buyerRemark'], '')
      .setIn(['extra', 'sellerRemark'], '')
      .setIn(['extra', 'deliverWay'], '')
      .setIn(['extra', 'wareHouseList'], '')
      .setIn(['extra', 'payType'], 1)
      .setIn(['extra', 'invoiceType'], -1)
      .setIn(['extra', 'invoiceProjectType'], 0)
      .setIn(['extra', 'invoiceResult'], '-1')
      .setIn(['extra', 'images'], fromJS([]))
      .setIn(['extra', 'projectOptions'], fromJS([]))
      .setIn(['extra', 'invoiceTitle'], '')
      .setIn(['extra', 'sperator'], false);
  }

  /**
   * 存储开票项目
   * @param state
   * @param options
   * @returns {any}
   */
  @Action('extra:projectOptions')
  projectOptions(state, options) {
    return state.setIn(['extra', 'projectOptions'], options);
  }

  /**
   * 编辑订单初始化附加信息
   * @param state
   * @param deliverWay
   * @param payType
   * @param buyerRemark
   * @param sellerRemark
   * @param invoiceType
   * @param invoiceProjectType
   * @param invoiceResult
   * @param invoiceTitle
   * @param images
   * @param sperator
   * @returns {Map<K, V>}
   */
  @Action('extra:edit:init')
  editInit(
    state: IMap,
    {
      deliverWay,
      payType,
      buyerRemark,
      sellerRemark,
      invoiceType,
      invoiceProjectType,
      invoiceResult,
      invoiceTitle,
      images,
      sperator,
      projectOptions,
      projectUpdateTime,
      taxNo
    }
  ) {
    if (projectOptions.count() > 0) {
      const orderProject = projectOptions.find(
        (p) => p.get('projectId') == invoiceResult
      );
      if (
        invoiceResult == '00000000000000000000000000000000' || //如果选择的是明细，则不进行时间比较
        (orderProject &&
          moment(orderProject.get('projectUpdateTime')).format(
            Const.TIME_FORMAT
          ) == moment(projectUpdateTime).format(Const.TIME_FORMAT))
      ) {
        state = state.setIn(['extra', 'invoiceResult'], invoiceResult);
      }
    }

    return state
      .setIn(['extra', 'deliverWay'], deliverWay)
      .setIn(['extra', 'payType'], payType)
      .setIn(['extra', 'buyerRemark'], buyerRemark)
      .setIn(['extra', 'sellerRemark'], sellerRemark)
      .setIn(['extra', 'invoiceType'], invoiceType)
      .setIn(['extra', 'invoiceProjectType'], invoiceProjectType)
      .setIn(['extra', 'invoiceTitle'], invoiceTitle)
      .setIn(['extra', 'images'], fromJS(images))
      .setIn(['extra', 'sperator'], sperator)
      .setIn(['extra', 'projectOptions'], projectOptions.toJS())
      .setIn(['extra', 'taxNo'], taxNo);
  }

  /**
   * 选择发票时初始化发票信息
   * 防止修改订单初始化置空
   * @param state
   * @returns {Map<K, V>}
   */
  @Action('extra:invoice:init')
  invoiceInit(state: IMap) {
    return state
      .setIn(['extra', 'invoiceProjectType'], 0)
      .setIn(['extra', 'invoiceResult'], '-1');
  }

  @Action('logisticsCompanyList:init')
  logisticsCompanyList(state: IMap, param) {
    return state.set('logisticsCompanyList', param);
  }
}
