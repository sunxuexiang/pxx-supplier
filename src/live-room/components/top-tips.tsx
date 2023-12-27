import React from 'react';
import { Alert } from 'antd';

export default class TopTips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>我是直播间的提示信息</p>
          </div>
        }
        type="info"
      />
    );
  }
}
