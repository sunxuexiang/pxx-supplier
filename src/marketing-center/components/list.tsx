import * as React from 'react';
import { Col, message, Row } from 'antd';

import { AuthWrapper, Headline, history, util, cache } from 'qmkit';

const images = {
  new_01: require('../images/new/01.png'),
  new_02: require('../images/new/02.png'),
  new_03: require('../images/new/03.png'),
  order_01: require('../images/order/01.png'),
  order_02: require('../images/order/02.png'),
  order_03: require('../images/order/03.png'),
  order_04: require('../images/order/04.png'),
  order_05: require('../images/order/05.png'),
  full_01: require('../images/full/01.svg'),
  full_02: require('../images/full/02.svg'),
  full_03: require('../images/full/03.svg'),
  customer_01: require('../images/customer/01.png'),
  customer_02: require('../images/customer/02.png'),
  customer_03: require('../images/customer/03.png'),
  extend_01: require('../images/customer/03.png'),
  live_01: require('../images/live/01.png'),
  jinbi_01: require('../images/jinbi/01.svg')
};

export default class List extends React.Component<any, any> {
  render() {
    const { liveStatus } = this.props;
    const isThrid = util.isThirdStore();
    //商家权限数据
    const authInfo = JSON.parse(sessionStorage.getItem(cache.AUTHINFO));
    const { jingBiState } = authInfo;
    return (
      <div className="container">
        <Headline title="营销中心" />
        <div className="appsMain">
          {!isThrid && (
            <React.Fragment>
              <h3>
                获客拉新<span>全渠道新用户</span>
              </h3>
              <Row>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() => {
                      history.push('/groupon-add');
                    }}
                  >
                    <span className="left">
                      <img src={images.new_01} />
                    </span>
                    <div className="info">
                      <h5>拼团</h5>
                      <p>裂变传播拉新，邀请好友一起购买</p>
                    </div>
                  </a>
                </Col>

                {/*<Col span={6}>*/}
                {/*<a*/}
                {/*className="createMarket"*/}
                {/*onClick={() => history.push('/distribution-setting')}*/}
                {/*>*/}
                {/*<span className="left">*/}
                {/*<img src={images.new_02} />*/}
                {/*</span>*/}
                {/*<div className="info">*/}
                {/*<h5>社交分销</h5>*/}
                {/*<p>裂变传播，让分销员帮你卖货</p>*/}
                {/*</div>*/}
                {/*<span className="miniTags">推荐</span>*/}
                {/*</a>*/}
                {/*</Col>*/}
              </Row>
            </React.Fragment>
          )}

          {!isThrid && (
            <React.Fragment>
              <h3>
                下单转化<span>更多订单和销量</span>
              </h3>
              <Row>
                <AuthWrapper functionName={'f_create_coupon'}>
                  <Col span={6}>
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: 'coupon-add',
                          state: {
                            couponType: '1',
                            source: 'marketCenter'
                          }
                        })
                      }
                    >
                      <span className="left">
                        <img src={images.order_01} />
                      </span>
                      <div className="info">
                        <h5>优惠券</h5>
                        <p>优惠券抵扣，购物更优惠</p>
                      </div>
                      <span className="miniTags">推荐</span>
                    </a>
                  </Col>
                </AuthWrapper>

                <AuthWrapper functionName={'f_create_all_coupon_activity'}>
                  <Col span={6}>
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: 'coupon-activity-all-present',
                          state: {
                            source: 'marketCenter'
                          }
                        })
                      }
                    >
                      <span className="left">
                        <img src={images.order_02} />
                      </span>
                      <div className="info">
                        <h5>全场赠券</h5>
                        <p>全场发券活动，领券中心全员领券</p>
                      </div>
                      <span className="miniTags">推荐</span>
                    </a>
                  </Col>
                </AuthWrapper>

                <AuthWrapper functionName={'f_create_all_coupon_activity'}>
                  <Col span={6}>
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: 'coupon-activity-specify',
                          state: {
                            source: 'marketCenter'
                          }
                        })
                      }
                    >
                      <span className="left">
                        <img src={images.order_03} />
                      </span>
                      <div className="info">
                        <h5>精准发券</h5>
                        <p>定向发券，精准触达会员</p>
                      </div>
                    </a>
                  </Col>
                </AuthWrapper>

                {!isThrid && (
                  <AuthWrapper functionName={'f_create_all_coupon_activity'}>
                    <Col span={6}>
                      <a
                        className="createMarket"
                        onClick={() =>
                          history.push({
                            pathname: 'coupon-activity-store',
                            state: {
                              source: 'marketCenter'
                            }
                          })
                        }
                      >
                        <span className="left">
                          <img src={images.order_04} />
                        </span>
                        <div className="info">
                          <h5>进店赠券</h5>
                          <p>进店发放券礼包，促进转化</p>
                        </div>
                      </a>
                    </Col>
                  </AuthWrapper>
                )}
              </Row>
              <Row>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() => {
                      history.push('/flash-sale-list');
                    }}
                  >
                    <span className="left">
                      <img src={images.order_05} />
                    </span>
                    <div className="info">
                      <h5>秒杀</h5>
                      <p>限时特价促销，刺激消费</p>
                    </div>
                  </a>
                </Col>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-goods-add',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left">
                      <img src={images.order_04} />
                    </span>
                    <div className="info">
                      <h5>指定商品赠券</h5>
                      <p>购买指定商品赠券</p>
                    </div>
                  </a>
                </Col>
              </Row>
            </React.Fragment>
          )}

          <h3>
            提高客单<span>更高销售和利润</span>
          </h3>
          <Row>
            <AuthWrapper functionName="f_marketing_reduction_add">
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() =>
                    history.push({
                      pathname: '/marketing-full-reduction',
                      state: {
                        source: 'marketCenter'
                      }
                    })
                  }
                >
                  <span className="left">
                    <img src={images.full_01} />
                  </span>
                  <div className="info">
                    <h5>满减</h5>
                    <p>满足指定条件享受减价</p>
                  </div>
                </a>
              </Col>
            </AuthWrapper>

            <AuthWrapper functionName="f_marketing_discount_add">
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() =>
                    history.push({
                      pathname: '/marketing-full-discount',
                      state: {
                        source: 'marketCenter'
                      }
                    })
                  }
                >
                  <span className="left">
                    <img src={images.full_02} />
                  </span>
                  <div className="info">
                    <h5>满折</h5>
                    <p>满足指定条件享受折扣</p>
                  </div>
                </a>
              </Col>
            </AuthWrapper>

            <AuthWrapper functionName="f_marketing_gift_add">
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() =>
                    history.push({
                      pathname: '/marketing-full-gift',
                      state: {
                        source: 'marketCenter'
                      }
                    })
                  }
                >
                  <span className="left">
                    <img src={images.full_03} />
                  </span>
                  <div className="info">
                    <h5>满赠</h5>
                    <p>满足指定条件获得赠品</p>
                  </div>
                </a>
              </Col>
            </AuthWrapper>
          </Row>

          {/*<h3>*/}
          {/*留存复购<span>维护老客不流失</span>*/}
          {/*</h3>*/}
          {/*<Row>*/}
          {/*<Col span={6}>*/}
          {/*<a*/}
          {/*className="createMarket"*/}
          {/*onClick={() => history.push('/customer-level')}*/}
          {/*>*/}
          {/*<span className="left">*/}
          {/*<img src={images.customer_01} />*/}
          {/*</span>*/}
          {/*<div className="info">*/}
          {/*<h5>店铺会员等级</h5>*/}
          {/*<p>店铺内会员体系管理，差异化服务</p>*/}
          {/*</div>*/}
          {/*</a>*/}
          {/*</Col>*/}

          {/*<Col span={6}>*/}
          {/*<a*/}
          {/*className="createMarket"*/}
          {/*onClick={() => history.push('/points-order-list')}*/}
          {/*>*/}
          {/*<span className="left">*/}
          {/*<img src={images.customer_02} />*/}
          {/*</span>*/}
          {/*<div className="info">*/}
          {/*<h5>积分商城</h5>*/}
          {/*<p>小积分大价值，礼品随心兑</p>*/}
          {/*</div>*/}
          {/*<span className="miniTags">推荐</span>*/}
          {/*</a>*/}
          {/*</Col>*/}
          {/*</Row>*/}

          <div>
            <h3>
              业务扩展<span>更多业务场景</span>
            </h3>
            <Row>
              {liveStatus && !isThrid && (
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() => history.push(`/live-room/${0}`)}
                  >
                    <span className="left">
                      <img src={images.live_01} />
                    </span>
                    <div className="info">
                      <h5>小程序直播</h5>
                      <p>培养店铺粉丝，营造消费场景</p>
                    </div>
                  </a>
                </Col>
              )}
              {jingBiState === 1 && (
                <AuthWrapper functionName="f_jinbi_return_zdls">
                  <Col span={6}>
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: 'jinbi-return',
                          state: {
                            source: 'marketCenter'
                          }
                        })
                      }
                    >
                      <span className="left">
                        <img src={images.jinbi_01} />
                      </span>
                      <div className="info">
                        <h5>指定商品返鲸币</h5>
                        <p>购买指定商品返还鲸币</p>
                      </div>
                    </a>
                  </Col>
                </AuthWrapper>
              )}
            </Row>
          </div>
        </div>
      </div>
    );
  }

  _pleaseWait = () => {
    message.success('即将上线，敬请期待');
  };
}
