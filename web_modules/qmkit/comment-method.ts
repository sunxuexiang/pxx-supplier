/**
 * Created by songhanlin on 2017/6/14.
 */
import { fromJS } from 'immutable';
import validate from './validate';
import * as _ from 'lodash';
import { message } from 'antd';
import { cache, Fetch, Const, VASConst } from 'qmkit';

/**
 * 两个对象集合合并去重的方法
 *
 * list1和list2需要为immutable对象,param为属性字符串
 *
 * list1: [{name:1,age:1},{name:2,age:2}]
 * list2: [{name:3,age:3},{name:2,age:4}]
 * distinct(list1,list2,'name') ====> [{name:1,age:1},{name:2,age:2},{name:3,age:3}]
 * distinct(list2,list1,'name') ====> [{name:3,age:3},{name:2,age:4},{name:1,age:1}]
 * distinct(list1,list2,'age') ====> [{name:1,age:1},{name:2,age:2},{name:3,age:3},{name:2,age:4}]
 * distinct(list2,list1,'age') ====> [{name:3,age:3},{name:2,age:4},{name:1,age:1},{name:2,age:2}]
 *
 * @param list1 原始集合,需要保留该集合的所有元素
 * @param list2 新集合,如果发现指定param在list1中 '不' 存在, 则添加进入list1中
 * @param param 指定相同对象的参数
 * @returns {*}
 */
export function distinct(list1, list2, param) {
  if (list1.count() > 0 && list2.count() > 0) {
    let newList = list1;
    list2.forEach((l1) => {
      if (newList.every((l2) => l1.get(param) != l2.get(param))) {
        newList = newList.concat(fromJS([l1]));
      }
    });
    return newList;
  } else {
    return list1.concat(list2);
  }
}

/**
 * 同时验证去前后空格之后的输入值
 * 验证不为空
 * 验证最小长度
 * 验证最大长度
 * @param rule
 * @param value 输入值
 * @param callback 回调
 * @param fieldText 提示文本
 * @param minNum 最小值
 * @param maxNum 最大值
 */
export function validatorTrimMinAndMax(
  _rule,
  value,
  callback,
  fieldText,
  minNum,
  maxNum
) {
  if (!value) {
    callback(fieldText + '不能为空');
    return;
  } else {
    const val = value.toString();
    if (val.trim().length <= 0) {
      callback(fieldText + '不能为空');
      return;
    }
    if (val.trim().length > 0 && val.trim().length < minNum) {
      callback(fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间');
      return;
    }
    if (val.trim().length > minNum && val.trim().length > maxNum) {
      callback(fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间');
      return;
    }
  }
  callback();
}

/**
 * 可以为空时验证输入不为空格
 * 验证最小长度
 * 验证最大长度
 * @param rule
 * @param value
 * @param callback
 * @param fieldText
 * @param minNum
 * @param maxNum
 */
export function validatorMinAndMax(
  _rule,
  value,
  callback,
  fieldText,
  minNum,
  maxNum
) {
  if (!value) {
    callback();
    return;
  } else {
    const val = value.toString();
    if (val.trim().length > 0 && val.trim().length < minNum) {
      callback(fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间');
      return;
    }
    if (val.trim().length > minNum && val.trim().length > maxNum) {
      callback(fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间');
      return;
    }
  }
  callback();
}

/**
 * 社会统一代码
 * @param rule
 * @param value
 * @param callback
 * @param fieldText
 */
export function validatorDeliveryCode(_rule, value, callback, fieldText) {
  if (!value) {
    callback();
    return;
  } else {
    const regex = /^[A-Za-z0-9]{1,50}$/;
    if (!regex.test(value)) {
      callback(fieldText + '必须为1-50位数字或字母');
      return;
    }
  }
  callback();
}

/**
 * 验证是否有非法字符表情
 */
export function validatorEmoji(_rule, value, callback, fieldText) {
  if (!value) {
    callback();
    return;
  }
  if (validate.emoji.test(value)) {
    callback(fieldText + '含有非法字符');
    return;
  }
  callback();
}

/**
 * 校验结算日期
 * @param rule
 * @param value
 * @param callback
 */
export function validatorAccountDays(_rule, value, callback) {
  if (!value) {
    callback();
    return;
  } else {
    if (value.length > 0) {
      value.map((v) => {
        if (parseInt(v) > 31 || parseInt(v) < 1 || isNaN(parseInt(v))) {
          callback('只能输入1-31之间的整数');
          return;
        }
        const valueList = fromJS(value);
        valueList.forEach((v, k) => {
          const trimValue = v.trim();
          if (!trimValue) {
            callback('日期不能为空字符');
            return;
          }
          // 重复校验
          const duplicatedIndex = valueList.findIndex(
            (v1, index1) => index1 != k && v1.trim() === trimValue
          );
          if (duplicatedIndex > -1) {
            callback('日期重复');
            return;
          }
        });
      });
    }

    if (value.length > 5) {
      callback('最多只能添加5个结算日');
      return;
    }
  }
  callback();
}

/**
 * 防抖函数 - 延迟执行版
 *   场景介绍: 1.搜索框联想,等用户输入完毕后,延迟n秒后,检索出匹配的关键词
 * @param func 真正执行的业务函数
 * @param wait 延迟时间
 * @returns {()=>undefined}
 */
export function delayFunc(func, wait) {
  let timeout, context, args;
  wait = wait || 300;

  const later = function() {
    func.apply(context, args);
    timeout = context = args = null;
  };

  const throttled = function() {
    context = this;
    args = arguments;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(later, wait);
  };

  return throttled;
}

/**
 * 防抖函数 - 立即执行版
 *   场景例如: 确认下单,需要立即执行,但抛弃执行连续点击的后几次动作事件
 * @param func 真正执行的业务函数
 * @param wait n毫秒时间内只触发第一次
 * @returns {()=>undefined}
 */
export function onceFunc(func, wait) {
  let timeout,
    context = null,
    args;
  wait = wait || 800;

  const later = function() {
    timeout = context = args = null;
  };

  return function() {
    if (timeout) {
      clearTimeout(timeout);
    } else {
      context = this;
      args = arguments;
      func.apply(context, args);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * json对象中所有字段trim前后空格
 */
export function trimValueDeep(value) {
  return value && !_.isNumber(value) && !_.isBoolean(value) && !_.isDate(value)
    ? _.isString(value)
      ? _.trim(value)
      : _.isArray(value)
      ? _.map(value, trimValueDeep)
      : _.mapValues(value, trimValueDeep)
    : value;
}

/**
 * 校验密码，6-16个字母或数字
 */
export function testPass(pass) {
  const regex = /^[A-Za-z0-9]{6,16}$/;
  if (pass) {
    if (!regex.test(pass)) {
      message.error('密码仅限6-16位字母或数字！');
      return false;
    } else {
      return true;
    }
  } else {
    message.error('请填写密码！');
    return false;
  }
}

/**
 * 手机号公共校验方法
 * @param tel
 * @returns {boolean}
 */
export function testTel(tel) {
  const regex = validate.phone;
  if (tel) {
    if (!regex.test(tel)) {
      message.error('无效的手机号！');
      return false;
    } else {
      return true;
    }
  } else {
    message.error('请填写手机号！');
    return false;
  }
}

/**
 * 查询所有增值服务
 */
export async function fetchAllVAS() {
  let data = localStorage.getItem(cache.VALUE_ADDED_SERVICES);
  if (data) {
    const services = JSON.parse(data);
    return services;
  } else {
    const { res } = await Fetch('/vas/setting/list');
    if (res.code === Const.SUCCESS_CODE) {
      const services = res.context.services;
      localStorage.setItem(
        cache.VALUE_ADDED_SERVICES,
        JSON.stringify(services)
      );
      return services;
    } else {
      return null;
    }
  }
}

/**
 * 查询指定服务的状态
 * 例:
 * {
 *    import { QMMethod, VASConst } from 'qmkit';
 *    const res = await QMMethod.fetchVASStatus(VASConst.IEP);
 * }
 */
export async function fetchVASStatus(serviceName) {
  let services = await fetchAllVAS();
  if (services) {
    const service = fromJS(services).find(
      (f) => f.get('serviceName') === serviceName
    );
    if (service) {
      return service.get('serviceStatus');
    } else {
      return false;
    }
  } else {
    return false;
  }
}


/**
 * 查询企业购服务信息
 */
export async function fetchIepInfo() {
  const iepAuth = await fetchVASStatus(VASConst.IEP);
  if (iepAuth) {
      let result = { isIepAuth: iepAuth, iepInfo: { enterprisePriceName: '企业价' } };
      const res = (await Fetch('/vas/iep/setting')) as any;
      if (res.res.code === Const.SUCCESS_CODE) {
        const info = res.res.context.iepSettingVO;
        result.iepInfo = info
      }
      return result;
    } else {
      return null;
  }
}

/**
 * 校验主播昵称
 */
export function validatorAnchorNick(_rule, value, callback, fieldText) {
  if (!value) {
    callback(fieldText + '不能为空');
    return;
  } else {
    const regex = /^[\u4E00-\u9FA5]{2,15}$/;
    if (!regex.test(value)) {
      callback(fieldText + '必须为2-15汉字');
      return;
    }
  }
  callback();
}

/**
 * 同时验证去前后空格之后的输入值
 * 验证不为空
 * 验证最小长度
 * 验证最大长度
 * @param rule
 * @param value 输入值
 * @param callback 回调
 * @param fieldText 提示文本
 * @param minNum 最小值
 * @param maxNum 最大值
 */
export function validatorBlankStr(
    _rule,
    value,
    callback,
    fieldText,
) {
  if (!value) {
    // callback(fieldText + '不能为空');
    // return;
  } else {
    const val = value.toString();
    if (val.trim().length <= 0) {
      callback(fieldText + '不能为空');
      return;
    }
  }
  callback();
}