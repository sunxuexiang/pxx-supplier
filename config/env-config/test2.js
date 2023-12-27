/**
 * @desc
 *
 * @使用场景 打包预发布环境，发布到预发布环境时使用
 *
 * @company qianmi.com
 * @Date    2019/5/8
 **/

var Common = require('./common');

module.exports = {
  host: 'https://supplierbff2.cjdbj.cn',
  HOST: 'https://supplierbff2.cjdbj.cn',
  X_XITE_ADMIN_HOST: 'https://web-server2.cjdbj.cn',
  X_XITE_OPEN_HOST: 'https://admin-api2.cjdbj.cn',
  X_XITE_RENDER_HOST: 'https://mbff2.cjdbj.cn',
  customerAccount: "MTg3NzQ5ODgwOTg=",
  customerPassword: "MTIzNDU2",
  IM_URL: 'https://im2.cjdbj.cn',
  TMS_URL: 'https://dztms.cjdbj.cn',
  ...Common
};
