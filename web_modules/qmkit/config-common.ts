const Common = {
  // 当前版本号
  COPY_VERSION: 'SBC V1.18.0',
  HTTP_TIME_OUT: 10,
  DAY_FORMAT: 'YYYY-MM-DD',
  DATE_FORMAT_HOUR: 'YYYY-MM-DD HH',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm',
  TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DATE_FORMAT_SECOND: 'HH:mm:ss',
  SUCCESS_CODE: 'K-000000',

  // 商品审核状态
  goodsState: {
    0: '待审核',
    1: '已审核',
    2: '审核未通过',
    3: '禁售中'
  },

  // 退货状态
  returnGoodsState: {
    INIT: '待审核',
    AUDIT: '待填写物流信息',
    DELIVERED: '待商家收货',
    RECEIVED: '待退款',
    COMPLETED: '已完成',
    REJECT_RECEIVE: '拒绝收货',
    REJECT_REFUND: '拒绝退款',
    VOID: '已作废',
    REFUND_FAILED: '退款失败'
  },
  // 退款状态
  returnMoneyState: {
    INIT: '待审核',
    AUDIT: '待退款',
    COMPLETED: '已完成',
    REJECT_REFUND: '拒绝退款',
    VOID: '已作废',
    REFUND_FAILED: '退款失败'
  },
  // 退款单状态
  refundStatus: {
    0: '待退款',
    3: '待退款',
    1: '拒绝退款',
    2: '已退款'
  },
  // 支付方式
  payType: {
    0: '在线支付',
    1: '转账汇款'
  },
  // 设价方式
  priceType: {
    0: '按客户设价',
    1: '按订货量设价',
    2: '以门店价销售'
  },
  // 平台类型
  platform: {
    BOSS: '平台',
    MERCHANT: '商户',
    THIRD: '第三方',
    CUSTOMER: '客户' //C用户
  },

  // 发货状态
  deliverStatus: {
    NOT_YET_SHIPPED: '未发货',
    SHIPPED: '已发货',
    PART_SHIPPED: '部分发货',
    VOID: '作废'
  },

  // 支付状态
  payState: {
    NOT_PAID: '未支付',
    PARTIAL_PAID: '部分支付',
    PAID: '已付款'
  },

  // 订单状态
  flowState: {
    INIT: '待审核',
    REMEDY: '修改订单',
    REFUND: '退款',
    AUDIT: '待发货',
    DELIVERED_PART: '待发货',
    DELIVERED: '待收货',
    CONFIRMED: '已收货',
    COMPLETED: '已完成',
    VOID: '已作废',
    REFUND_FAILED: '退款失败'
  },
  // 优惠券使用范围
  couponScopeType: {
    0: '全部商品',
    1: '限品牌',
    2: '限类目', //平台分类
    3: '限店铺分类', //店铺分类
    4: '部分商品'
  },
  // 优惠券查询类型
  couponStatus: {
    0: '全部',
    1: '生效中',
    2: '未生效',
    3: '领取生效',
    4: '已失效'
  },
  activityStatus: {
    1: '进行中',
    2: '暂停中',
    3: '未开始',
    4: '已结束'
  },
  couponActivityType: {
    0: '全场赠券',
    1: '精准发券',
    2: '进店赠券',
    3: '注册赠券',
    9: '指定商品赠劵'
  },

  // 统计模块，companyId的常量...
  platformDefaultId: 1,

  // 文件大小
  fileSize: {
    // 2M
    TWO: 2 * 1024 * 1024
  },

  spuMaxSku: 50
};
export default Common;
