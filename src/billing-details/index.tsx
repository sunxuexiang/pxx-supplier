import React from 'react';

import { Breadcrumb, Tooltip, Icon } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';

import { Headline, BreadCrumb } from 'qmkit';

import Detail from './components/detail';
import List from './components/list';
import Bottom from './components/bottom';
import AppStore from './store';
import './style.css';

const OptionDiv = styled.div`
  width: 100%;
  text-align: right;
  display: block;
  position: absolute;
  right: 40px;
  top: 90px;
`;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BillingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { settleId } = this.props.match.params;
    this.store.init(settleId);
  }

  render() {
    return (
      <div
        style={{
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
          margin: -10,
          padding: 10,
          position: 'relative'
        }}
      >
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>结算明细</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title="结算明细" />
          <OptionDiv>
            <Tooltip
              overlayStyle={{
                overflowY: 'auto',
                height: 'calc(100vh - 64px)'
              }}
              placement="bottomLeft"
              title={this._renderTitle}
            >
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
                &nbsp;&nbsp;结算说明
              </a>
            </Tooltip>
          </OptionDiv>
          <Detail />
          <List settleId={this.props.match.params.settleId} />
          <Bottom />
        </div>
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <div>
          <p>
            所有订单在订单完成并且超过退款时效的次日入账，如存在未处理完的退单，则延迟到退单处理完成（对应退单状态为：拒绝收货、拒绝退款、已作废、已完成）的次日入账；
          </p>
          <br />
          <p>名词解释：</p>
          <p>- 商品单价：商品原价，包括设价后的金额；</p>
          <p>
            -
            数量(不含退)：结算时订单中商品数量需排除掉退款完成的数量，结算时满减优惠、满折优惠、店铺券优惠、通用券优惠、积分抵扣、订单改价差额、商品实付金额、供货金额都以不含退的数量来计算；
          </p>
          <p>
            -
            满减优惠、满折优惠：商品参加满减、满折活动减免的金额，成本由商家承担；
          </p>
          <p>- 店铺券优惠：商品使用了店铺优惠券减免的金额，成本由商家承担；</p>
          <p>
            -
            通用券优惠：商品使用了通用优惠券减免的金额，成本由平台承担，在结算时补偿给商家；
          </p>
          <p>- 订单改价差额：商家修改订单金额产生的差价，差价可正可负；</p>
          <p>
            -
            积分抵扣：用户在支付时使用积分抵扣的部分，成本由平台承担，在结算时补偿给商家；
          </p>
          <p>
            -
            商品实付金额：商品在进行了各类优惠活动、虚拟资产抵扣、订单改价后的实付金额；
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;未改价订单商品实付金额=商品原价-满减优惠-满折优惠-店铺券优惠-通用券优惠-积分抵扣
          </p>
          <p>&nbsp;&nbsp;&nbsp;有改价订单商品实付金额=改价后金额</p>
          <p>- 供货金额：代销供应商商品需要结算给供应商的金额；</p>
          <p>
            -
            类目扣率：商品所属类目产生销售时需支付给平台的佣金，结算比例以用户下单时为准；
          </p>
          <p>
            -
            平台佣金：平台应收的佣金，每款商品平台佣金=（商品实付金额×类目扣率；
          </p>
          <p>
            - 分销佣金比例
            ：商家设置的分销员代销商品可获得的佣金比例，结算比例以用户下单时为准；
          </p>
          <p>
            -
            分销佣金：商家支付给分销员的佣金，每款商品平台佣金=商品实付金额×佣金比例；
          </p>
          <p>
            -
            退单改价差额：订单产生退款，商家若修改退单金额导致商品实退金额小于实付金额，则在结算时将差额补偿给商家；
          </p>
          <p>- 运费：用户支付的运费，由平台代收，在结算时需返还给商家；</p>
          <p>
            -
            店铺应收金额：每笔订单店铺应收金额=商品实付金额+退单改价差额+运费+通用券优惠+积分抵扣-平台佣金-分销佣金；
          </p>
          <p>- 店铺应收总额：店铺应收总额=每笔订单店铺应收金额之和</p>
          <p>- 商品实付总额：每笔订单商品实付金额之和；</p>
          <p>- 供货总额：每笔订单需结算给供货商的供货金额总和；</p>
          <p>- 平台佣金总额：每笔订单平台佣金之和；</p>
          <p>- 分销佣金总额：每笔订单分销佣金之和；</p>
        </div>
      </div>
    );
  };
}
