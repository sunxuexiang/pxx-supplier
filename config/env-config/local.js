/**
 * @desc
 *
 * @使用场景 本地开发环境，链接IM开发环境时使用
 *
 * @company qianmi.com
 * @Date    2019/5/8
 **/

var Common = require('./common');
module.exports = {
  host: 'https://supplierbff-t.cjdbj.cn',
  HOST: 'https://supplierbff-t.cjdbj.cn',
  X_XITE_ADMIN_HOST: 'https://web-server-t.cjdbj.cn',
  X_XITE_OPEN_HOST: 'https://admin-api-t.cjdbj.cn',
  X_XITE_RENDER_HOST: 'https://mbff-t.cjdbj.cn',
  customerAccount: "MTg3NzQ5ODgwOTg=",
  customerPassword: "MTIzNDU2",
  IM_URL: 'http://localhost:8080',
  TMS_URL: 'https://dztms.cjdbj.cn',
  ...Common
};