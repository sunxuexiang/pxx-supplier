// 校验规则常量
export default {
  // 手机号码
  phone: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[\d]{9}$/,
  //0.01~1之间的小数，eg:折扣率
  zeroOne: /(^0\.[1-9][0-9]{0,1}$)|(^0\.0[1-9]{1}$)|(^1((\.0)|(\.00))?$)/,
  //数字
  number: /^\d+$/,
  numberto2: /^\D*(\d*(?:\.\d{0,2})?).*$/g,
  //正整数
  numbezz: /^[1-9]\d*$/,
  numbezzs: /^[0-9]\d*$/,
  //价格 不能为0
  price: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.0[1-9]{1}$)|(^0\.[1-9][0-9]{0,1}$)/,
  //价格 可以为0
  zeroPrice: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  //数字,不包含0
  noZeroNumber: /^[1-9]\d{0,}$/,
  //9位数字,不包含0
  noZeroNineNumber: /^[1-9]\d{0,8}$/,
  /** 4位数字,不包含0 两位小数 */
  noZeroFourNumber: /^(([1-9]\d{0,3}))(\.\d{0,2}?)?$/,
  //经度
  lng: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
  //纬度
  lat: /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,

  //13位数字
  thirteenNineNumber: /^[^\u4e00-\u9fa5]{1,45}$/,
  // 固定电话
  telephone: /(^\d{0,9}-\d{0,10}$)|(^\d{1,20}$)/,
  // 纳税人识别号
  tax: /^[A-Za-z0-9]{15,20}$/,
  // 银行户号
  bankNumber: /^\d{1,30}$/,
  //仅中文或英文，不允许含有数字
  noNumber: /^[a-zA-Z\u4E00-\u9FA5]*$/,
  //不允许含有特殊字符
  noChar: /^[0-9a-zA-Z\u4E00-\u9FA5]*$/,
  //有emoji表情
  emoji: /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/,
  //统一社会信用代码
  socialCreditCode: /^[A-Za-z0-9]{15,20}$/,
  //折扣率0.00-100.00, 可以为0
  discount: /^\d(\.\d{1,2})?$|^[1-9]\d(\.\d{1,2})?$|^100(\.(0){1,2})?$/,
  //邮箱
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  //排序合法数字 0-999
  sortNum: /^([1-9](\d{1,2})?)$|^0$/,
  //不允许输入中文
  noChinese: /^[^\u4e00-\u9fa5]{1,50}$/,
  //密码为6-16位字母或数字密码
  password: /^[0-9a-zA-Z]{6,16}$/,
  //1位小数
  singleDecimal: /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)|(^[0-9]\.[0-9]$)/,
  //0-9999999.99
  enterpriseRange: /^(0|[1-9][0-9]{0,6})(\.([1-9]|[0-9][1-9]))?$/,
  //小于10位
  erpIdLength: /^[A-Za-z0-9]{0,10}$/,
  //三位小数
  three: /^-?\d+(\.\d{1,3})?$/,
  /** 电话号码与座机 */
  phoneortele: /^1\d{10}$|^(0\d{2,3}[-+]*|\(0\d{2,3}\))?[2-9]\d{4,7}([-+]*\d{1,8})?$/,
  //同时支持18位和15位社会信用代码
  socialCode: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
  /** 银行卡号(非0开头，1-30位数字) */
  bankNo: /^([1-9]{1})\d{1,29}$/i,
  // 身份证
  idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 大于0保留两位小数
  greaterZeroTwoNumber: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
  validateNoPhone: (rule, value, callback) => {
    if(value && /\d{8,}/g.test(value)){
      callback('不能输入连续8位及以上数字')
    }else{
      callback();
    }
  }
};