export enum MARKETING_TYPE {
  //满减
  FULL_REDUCTION,
  //满折
  FULL_DISCOUNT,
  //满赠
  FULL_GIFT
}

export enum SUB_TYPE {
  // 满金额减
  REDUCTION_FULL_AMOUNT,
  // 满数量减
  REDUCTION_FULL_COUNT,

  // 满金额折
  DISCOUNT_FULL_AMOUNT,
  // 满数量折
  DISCOUNT_FULL_COUNT,

  // 满金额赠
  GIFT_FULL_AMOUNT,

  // 满数量赠
  GIFT_FULL_COUNT,

  //满订单赠
  GIFT_FULL_ORDER,
  // 满订单减
  REDUCTION_FULL_ORDER,
  // 满订单折
  DISCOUNT_FULL_ORDER
}

export const TYPE_STRING = {
  [MARKETING_TYPE.FULL_DISCOUNT]: '折',
  [MARKETING_TYPE.FULL_GIFT]: '赠',
  [MARKETING_TYPE.FULL_REDUCTION]: '减'
};

export function GET_MARKETING_STRING(type) {
  return TYPE_STRING[type];
}
