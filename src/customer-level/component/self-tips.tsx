import React from 'react';
import { Alert } from 'antd';

export default class SelfTips extends React.Component<any, any> {
  render() {
    return (
      <div >
        <Alert
          message="操作提示"
          description={
            <div>
              <p>
                平台设置客户等级，成长值达到升级条件可自动升级；
              </p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
