import React from 'react';
import { Alert } from 'antd';

export default class TopTips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>为了方便在创建直播间时从选择商品，请尽量提前提审直播商品；</p>
            <p>一天最多可创建20个直播间；</p>
          </div>
        }
        type="info"
      />
    );
  }
}
