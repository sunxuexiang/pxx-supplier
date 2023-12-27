import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Alert
          message="操作提示"
          description={
            <div>
              <p>
                1、您可在此设置不同客户等级在您店铺内可享受的商品折扣率，修改折扣率，按客户设价的商品价格将会重新计算；
              </p>
              <p>2、客户等级最多支持10个，等级名称可编辑，可维护自动升级条件；</p>
              <p>2、后台添加的会员，以添加时设置的等级为准，满足下一等级升级条件时自动升级；</p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
