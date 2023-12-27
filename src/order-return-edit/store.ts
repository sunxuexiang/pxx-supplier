import { IOptions, Store } from 'plume2';
import { fromJS, Map } from 'immutable';
import { message, Modal } from 'antd';
import { Const, history, QMFloat } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import FormActor from './actor/form-actor';
import TradeActor from './actor/trade-actor';
import PriceActor from './actor/price-actor';
import ImageActor from './actor/image-actor';
import {
  fetchOrderReturnList,
  getCanRefundPrice,
  getReturnDetail,
  getReturnReasons,
  getReturnWays,
  getTradeDetail,
  remedy
} from './webapi';

const confirm = Modal.confirm;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new FormActor(),
      new TradeActor(),
      new PriceActor(),
      new ImageActor()
    ];
  }

  init = async (rid: string) => {
    const returnReasonList = await getReturnReasons();
    const returnWayList = await getReturnWays();
    this.dispatch('formActor: init', {
      returnReasonList: fromJS(returnReasonList.res.context),
      returnWayList: fromJS(returnWayList.res.context)
    });
    let returnDetail;
    returnDetail = await getReturnDetail(rid);

    if (returnDetail.res.returnFlowState != 'INIT') {
      message.error('已审核，无法修改');
      return;
    }

    let tradeDetail = await getTradeDetail(returnDetail.res.tid);

    let canApplyPrice = tradeDetail.res.context['tradePrice'].totalPrice;
    let isOnLine = tradeDetail.res.context['payInfo']['payTypeId'] == '0';

    // 在线支付订单，计算剩余退款金额
    if (isOnLine) {
      let orderReturnListRes = await fetchOrderReturnList(returnDetail.res.tid);

      if (orderReturnListRes.res && orderReturnListRes.res['context']) {
        orderReturnListRes.res['context']
          .filter((v) => {
            return v.returnFlowState == 'COMPLETED';
          })
          .forEach((v) => {
            canApplyPrice = QMFloat.accSubtr(
              canApplyPrice,
              v.returnPrice.applyStatus
                ? v.returnPrice.applyPrice
                : v.returnPrice.totalPrice
            );
          });
      }
    }

    // 判断是否为退货
    let isReturn = returnDetail.res['returnType'] == 'RETURN' ? true : false;

    // 退货申请，设置商品可退数量
    if (isReturn) {
      returnDetail.res['returnItems'].forEach((v) => {
        v.canReturnNum = v.num + v.canReturnNum;
      });
    }

    const images = returnDetail.res.images || [];

    const detailMap: IMap = fromJS(returnDetail.res || Map());

    const selectedReturnReason = detailMap.get('returnReason')
      ? detailMap.get('returnReason').keySeq().first()
      : '0';
    const selectedReturnWay = detailMap.get('returnWay')
      ? detailMap.get('returnWay').keySeq().first()
      : '0';

    this.transaction(() => {
      this.dispatch('formActor: editItem', {
        key: 'id',
        value: detailMap.get('id')
      });
      this.dispatch('formActor: editItem', {
        key: 'selectedReturnReason',
        value: selectedReturnReason
      });
      this.dispatch('formActor: editItem', {
        key: 'selectedReturnWay',
        value: selectedReturnWay
      });
      this.dispatch('formActor: editItem', {
        key: 'description',
        value: detailMap.get('description')
      });
      this.dispatch('priceActor: editPriceItem', {
        key: 'applyStatus',
        value: detailMap.getIn(['returnPrice', 'applyStatus'])
      });
      this.dispatch('priceActor: editPriceItem', {
        key: 'applyPrice',
        value: detailMap.getIn(['returnPrice', 'applyPrice'])
      });
      this.dispatch('priceActor: editPriceItem', {
        key: 'applyIntegral',
        value: detailMap.getIn(['returnPoints', 'applyPoints'])
      });
      this.dispatch(
        'imageActor: editImages',
        fromJS(images.map((v) => JSON.parse(v)))
      );

      this.dispatch('tradeActor: init', {
        returnDetail: detailMap,
        isReturn: isReturn,
        isOnLine: isOnLine,
        canApplyPrice: canApplyPrice
      });
    });
  };

  /**
   * 修改项
   */
  editItem = (key: string, value: string) => {
    this.dispatch('formActor: editItem', { key, value });
  };

  /**
   * 修改金额项
   */
  editPriceItem = (key: string, value: any) => {
    this.dispatch('priceActor: editPriceItem', { key, value });
  };

  /**
   * 修改数量
   */
  editGoodsNum = (skuId: string, value: number) => {
    this.dispatch('tradeActor: editGoodsNum', { skuId, value });
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 提交
   */
  modify = async () => {
    const data = this.state();
    let param = Map();

    param = param.set('rid', data.get('id'));

    // 退货原因
    param = param.set(
      'returnReason',
      Map().set(data.get('selectedReturnReason'), 0)
    );

    // 退货说明
    param = param.set('description', data.get('description').trim());

    // 退单附件
    param = param.set(
      'images',
      data.get('images').map((v, i) => {
        // 上传成功的图片才保存
        if (v.get('status') == 'done') {
          // v.get('response')不为空，说明是新上传的，否则说明是修改前上传好的
          let url = v.get('response') ? v.get('response').get(0) : v.get('url');
          return JSON.stringify({
            uid: i + 1,
            status: 'done',
            url: url
          });
        }
      })
    );

    // 退货商品信息
    const returnItems = data.getIn(['returnDetail', 'returnItems']);

    // 退货申请
    if (data.get('isReturn')) {
      // 如果所有商品的退货数量都为0
      if (returnItems.filter((item) => item.get('num') > 0).count() == 0) {
        message.error('请填写退货数量');
        return;
      }

      // 退货方式
      param = param.set(
        'returnWay',
        Map().set(data.get('selectedReturnWay'), 0)
      );

      param = param.set('returnItemNums', returnItems);
    }

    // 退款金额，退货是商品总额，退款是应付金额
    const totalPrice = data.get('isReturn')
      ? returnItems
          .reduce(
            (sum, item) =>
              QMFloat.accAdd(sum, item.get('num') * item.get('price')),
            0
          )
          .toFixed(2)
      : data.getIn(['returnDetail', 'returnPrice', 'totalPrice']);

    // return
    param = param.set('returnPriceRequest', {
      applyStatus: data.get('applyStatus'),
      // applyPrice: data.get('isReturn')
      //   ? totalPrice
      //   : data.get('applyPrice').toFixed(2),
      applyPrice: data.get('applyPrice').toFixed(2),
      totalPrice: data.get('applyPrice').toFixed(2)
      // totalPrice: totalPrice
    });

    param = param.set('returnPointsRequest', {
      applyPoints: data.getIn(['returnDetail', 'returnPoints', 'applyPoints'])
    });

    // 本次退款金额
    const rePrice = data.get('applyStatus')
      ? data.get('applyPrice')
      : totalPrice;
    // 剩余可退金额
    let remainPrice = rePrice;
    const { res } = await getCanRefundPrice(data.get('id'));
    if ((res as any).code === Const.SUCCESS_CODE) {
      remainPrice = (res as any).context;
    }
    // 退款金额大于可退金额时
    if (remainPrice < rePrice) {
      // 在线支付要判断退款金额不能大于剩余退款金额
      if (data.get('isOnLine')) {
        Modal.warning({
          title: `该订单剩余可退金额为：￥${remainPrice.toFixed(2)}`,
          content: '退款金额不可大于可退金额，请修改',
          okText: '确定'
        });
        return;
      } else {
        if (remainPrice < 0) {
          remainPrice = 0;
        }

        let onModify = this.onModify;
        // 线下，给出提示
        confirm({
          title: `该订单剩余可退金额为：￥${remainPrice.toFixed(2)}`,
          content: '当前退款金额超出了可退金额，是否继续？',
          onOk() {
            return onModify(param);
          },
          onCancel() {},
          okText: '继续',
          cancelText: '关闭'
        });
        return;
      }
    }

    return this.onModify(param);
  };

  onModify = async (param) => {
    let result;

    result = await remedy(param.toJS());

    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('修改退单成功');
      history.go(-1);
    } else {
      message.error(result.res.message);
      return;
    }
  };
}
