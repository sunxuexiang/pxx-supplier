/**
 * @desc
 *
 * @使用场景 打包环境，打包生产环境时使用
 *
 * @company qianmi.com
 * @Date    2019/5/8
 **/

var Common = require('./common');


module.exports = {
  host: 'https://supplierbff.cjdbj.cn',
  HOST: 'https://supplierbff.cjdbj.cn',
  X_XITE_ADMIN_HOST: 'https://web-server.cjdbj.cn',
  X_XITE_OPEN_HOST: 'https://admin-api.cjdbj.cn',
  X_XITE_RENDER_HOST: 'https://mbff.cjdbj.cn',
  customerAccount: "MTgwNzMxODAwNTA=",
  customerPassword: "MTIzNDU2",
  IM_URL: 'https://im.cjdbj.cn',
  TMS_URL: 'https://dztms.cjdbj.cn',
  ...Common
};
