import React from 'react';

import { Breadcrumb, Tabs, Button, message } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history, Const } from 'qmkit';

import AppStore from './store';
import MarketingDes from './common/components/marketing-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import GiftList from './gift-details/components/gift-list';
import MarketingRule from './common/components/marketing-rule';
import * as webapi from './webapi';

const MAK_TYPE = {
  0: '满减',
  1: '满折',
  2: '满赠',
  3: '套装'
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { marketingId, pageNum } = this.props.match.params;
    if (pageNum) {
      sessionStorage.setItem('pageNum', pageNum);
    }
    this.store.init(marketingId);
  }
  state = {
    btnDisabled: false,
    goods: [],
    gifList: [],
    skuExists: []
  };

  render() {
    const marketingType = this.store.state().get('marketingType');
    const { have } = this.props.match.params;
    const { btnDisabled, skuExists } = this.state;
    const title = MAK_TYPE[marketingType] + '活动详情';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={title} />

          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="活动信息" key="0">
              {/*满赠顶部描述*/}
              <MarketingDes />
              {marketingType === 1 ? (
                <MarketingRule />
              ) : marketingType === 2 ? (
                <GiftList have={have} onChangeBack={this.onChangeBack} />
              ) : (
                <MarketingRule />
              )}
              {/*商品列表*/}
              <GoodsList
                have={have}
                skuExists={skuExists}
                marketingType={marketingType}
                onChangeBack={this.onChangeBackGoods}
              />

              {/*满赠底部*/}
              <Bottom />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="领取记录" key="1">
              <CouponRecord />
            </Tabs.TabPane> */}
          </Tabs>

          <div className="bar-button">
            {have && have == '9' && (
              <Button
                disabled={btnDisabled}
                type="primary"
                onClick={() => this.saveCoupon()}
                style={{ marginRight: 10 }}
              >
                保存
              </Button>
            )}
            <Button
              onClick={() => {
                history.push('/marketing-list');
              }}
              style={{ marginLeft: 10 }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }

  saveCoupon = () => {
    const { have } = this.props.match.params;
    const { goods, gifList } = this.state;
    const { giftList, goodsList, marketingId } = this.store.state().toJS();
    // console.log('====================================');
    // console.log(goodsList, '091', goodsList.goodsInfoPage.content);
    // console.log('====================================');
    this.setState({
      btnDisabled: true
    });
    const gifarray = [];
    const goodsarray = [];
    const gifarrayId = [];
    const goodsarrayId = [];
    // 赠品
    if (gifList.length > 0) {
      giftList.forEach((element) => {
        gifarray.push(element.goodsInfoId);
      });
      gifList.forEach((e) => {
        if (gifarray.indexOf(e.productId) == -1) {
          gifarrayId.push({
            productId: e.productId,
            productNum: e.productNum,
            boundsNum: e.boundsNum
          });
        }
      });
    }

    // 商品
    if (goods.length > 0) {
      goodsList.goodsInfoPage.content.forEach((element) => {
        goodsarray.push(element.goodsInfoId);
      });
      goods.forEach((e) => {
        goodsarrayId.push({
          scopeId: e.goodsInfoId,
          terminationFlag: e.terminationFlag,
          whetherChoice: e.checked ? 1 : 0,
          purchaseNum: e.purchaseNum,
          goodsInfoName: e.goodsInfoName
        });
      });
    }

    if (gifarrayId.length > 0) {
      this.addgif(gifarrayId, marketingId, have);
    } else {
      this.setState({
        btnDisabled: false
      });
    }
    if (goodsarrayId.length > 0) {
      this.addGoods(goodsarrayId, marketingId, have);
    } else {
      this.setState({
        btnDisabled: false
      });
    }
    if (goodsarrayId.length <= 0 && gifarrayId.length <= 0) {
      message.error('请添加赠品或者商品再保存');
    }
  };
  // 请求新增商品
  addGoods = async (goodsarrayId, marketingId, have) => {
    const { res } = await webapi.addGoods({
      marketingId,
      addActivitGoodsRequest: goodsarrayId
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context.length > 0) {
        if (res.context.length == 1 && res.context[0] == 'all') {
          this.setState({ skuExists: res.context });
          message.error('订单满减、订单满折、订单满赠不可在同一时间存在');
        } else {
          this.setState({ skuExists: res.context });
          const errArr = [];
          goodsarrayId.forEach((item) => {
            if (res.context.includes(item.scopeId)) {
              errArr.push(item.goodsInfoName);
            }
          });
          message.error(
            <div>
              <p>{`${res.context.length}款商品活动时间冲突，请删除后再保存`}</p>
              {errArr.map((item) => (
                <p>{item}</p>
              ))}
            </div>,
            4
          );
          // message.error(
          //   `${res.context.length}款商品活动时间冲突，请删除后再保存`
          // );
        }
      } else {
        history.push(`/marketing-details/${marketingId}/0/${have}`);
        this.setState({
          btnDisabled: false
        });
      }
    }
  };

  // 请求新增赠品
  addgif = async (gifarrayId, marketingId, have) => {
    const { fullGiftLevelList } = this.store.state().toJS();
    const { res } = await webapi.addGif({
      marketingId,
      giftLevelId: fullGiftLevelList[0].giftLevelId,
      addActivitGoodsRequest: gifarrayId
    });

    if (res.code != 'K-000000') {
      message.error('商品：' + res.message);
    } else {
      history.push(`/marketing-details/${marketingId}/0/${have}`);
      this.setState({
        btnDisabled: false
      });
    }
  };

  // 回调商品
  onChangeBackGoods = (goods) => {
    // console.log(goods.toJS());

    this.setState({
      goods: goods.toJS()
    });
  };
  // 回调赠品
  onChangeBack = (fullGiftLevelList) => {
    console.log(fullGiftLevelList[0].fullGiftDetailList);
    this.setState({
      gifList: fullGiftLevelList[0].fullGiftDetailList
    });
  };
}
