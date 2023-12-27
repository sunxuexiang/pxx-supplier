import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const, history, QMFloat } from 'qmkit';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new ListActor(), new LoadingActor(), new FormActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');

    let form = this.state().get('form').toJS();
    const wareHouseVOPage =
      JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
      this.transaction(() => {
        console.log(res, '123');

        // res.content.forEach((ware) => {
        //   wareHouseVOPage.forEach((ware) => {
        //     if (ware.wareId == ware.wareId) {
        //       ware.wareName = ware.wareName
        //     }
        //   })
        // })
        this.dispatch('loading:end');
        this.dispatch('list:orderList', res);
        this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
      });
    });
  };

  /**
   * 查询可申请的订单列表
   *
   * @param pageNum
   * @param pageSize
   */
  onSearch = (params) => {
    this.dispatch('formActor:formFieldChange', params);
    this.init();
  };

  /**
   * 申请退单
   */
  apply = async (tid) => {
    let { res } = (await webapi.getTradeDetail(tid)) as any;
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    let errMsg;
    let canApply = false;

    const trade = fromJS(res);
    const tradeState = trade && trade.getIn(['context', 'tradeState']);

    let { res: applyable } = await webapi.fechReturnOrderCanApply(
      tid,
      tradeState.get('payState') === 'PAID' &&
        tradeState.get('deliverStatus') === 'NOT_YET_SHIPPED'
    );
    if ((applyable as any).code !== Const.SUCCESS_CODE) {
      message.error((applyable as any).message);
      return;
    }

    if (res.code === Const.SUCCESS_CODE) {
      const flowState = trade.getIn(['context', 'tradeState', 'flowState']);
      const payState = trade.getIn(['context', 'tradeState', 'payState']);
      const deliverStatus = trade.getIn([
        'context',
        'tradeState',
        'deliverStatus'
      ]);

      // 获取该订单所有的待处理及已完成的退单列表
      let orderReturnListRes = await webapi.fetchOrderReturnList(tid);

      if (orderReturnListRes.res) {
        canApply = true;

        // 如果有未处理完的，则不允许再次申请
        orderReturnListRes.res['context'].forEach((v) => {
          if (
            v.returnFlowState != 'REFUNDED' &&
            v.returnFlowState != 'COMPLETED' &&
            v.returnFlowState != 'REJECT_REFUND' &&
            v.returnFlowState != 'REJECT_RECEIVE' &&
            v.returnFlowState != 'VOID'
          ) {
            // 有未处理完的
            canApply = false;
            errMsg = '该订单关联了处理中的退单，不可再次申请';
          }
        });

        // 没有待处理的申请
        if (canApply) {
          // 退款申请，如果有已完成的则不允许再次申请
          if (
            (flowState == 'AUDIT' || flowState == 'TOPICKUP') &&
            payState == 'PAID' &&
            deliverStatus == 'NOT_YET_SHIPPED'
          ) {
            orderReturnListRes.res['context'].forEach((v) => {
              // 已完成申请的
              if (v.returnFlowState == 'COMPLETED') {
                canApply = false;
                errMsg = '无可退商品';
              }
            });
          } else {
            if (
              trade.getIn(['context', 'tradeItems']) &&
              trade
                .getIn(['context', 'tradeItems'])
                .filter((v) => v.get('canReturnNum') > 0).length == 0
            ) {
              // 退货申请，如果没有可退商品则不允许申请
              canApply = false;
              errMsg = '无可退商品';
            } else if (
              trade.getIn(['context', 'payInfo', 'payTypeId']) == '0'
            ) {
              // 在线支付需判断退款金额
              let totalApplyPrice = 0;
              orderReturnListRes.res['context'].forEach((v) => {
                // 计算已完成的申请单退款总额
                if (v.returnFlowState == 'COMPLETED') {
                  totalApplyPrice = QMFloat.accAdd(
                    totalApplyPrice,
                    v.returnPrice.applyStatus
                      ? v.returnPrice.applyPrice
                      : v.returnPrice.totalPrice
                  );
                }
              });

              // if (
              //   totalApplyPrice >=
              //     trade.getIn(['context', 'tradePrice', 'totalPrice']) &&
              //   trade.getIn(['context', 'tradePrice', 'totalPrice']) !== 0
              // ) {
              //   canApply = false;
              //   errMsg = '无可退金额';
              // }
            }
          }
        }
      } else {
        errMsg = orderReturnListRes.err;
      }
    }
    //  可以申请，进入申请页面，否则提示错误信息
    if (canApply) {
      history.push({
        pathname: '/order-return-add',
        search: `?tid=${tid}`
      });
    } else {
      message.error(errMsg);
    }
  };
}
