import React from 'react';
import { Alert } from 'antd';

export default class TopTips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              由于直播商品需经过小程序直播平台的审核，你需要在此先提审商品，为了不影响直播间选取商品，请提前1天提审商品；
            </p>
            <p>
              每次最多可提审20款商品，每个店铺最多可维护200款商品，每款SPU只需选择其中一款SKU即可；
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
