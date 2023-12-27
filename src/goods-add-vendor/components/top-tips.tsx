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
              此功能涉及到前端各模块的推荐商品展示，设置即时生效，请慎重选择
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
