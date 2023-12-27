import React from 'react';

import { Breadcrumb, Tabs, Button, message } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history } from 'qmkit';

import AppStore from './store';
import JinbiReturnDes from './common/components/jinbi-return-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import JinbiReturnRecord from './common/components/jinbi-return-record';
import * as webapi from './webapi';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiReturnDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { activityId, pageNum, have } = this.props.match.params;
    if (pageNum) {
      sessionStorage.setItem('pageNum', pageNum);
    }
    this.store.init(activityId);
    if (!have) {
      this.store.getRecordInfo({ pageNum: 0, pageSize: 10 }, activityId);
    }
  }
  state = {
    btnDisabled: false,
    goods: []
  };

  render() {
    const { have } = this.props.match.params;
    const { btnDisabled } = this.state;
    const title = '返鲸币活动详情';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={title} />

          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="活动信息" key="0">
              {/*返鲸币活动顶部描述*/}
              <JinbiReturnDes />
              {/*商品列表*/}
              <GoodsList have={have} onChangeBack={this.onChangeBackGoods} />

              {/*返鲸币活动底部*/}
              <Bottom />
            </Tabs.TabPane>
            {/* 只有查看显示领取记录 */}
            {!have && (
              <Tabs.TabPane tab="领取记录" key="1">
                <JinbiReturnRecord />
              </Tabs.TabPane>
            )}
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
                history.push('/jinbi-return-list');
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
    const { goods } = this.state;
    const { activityId, goodsList } = this.store.state().toJS();
    // console.log('====================================');
    // console.log(goodsList, '091', goodsList.goodsInfoPage.content);
    // console.log('====================================');
    this.setState({
      btnDisabled: true
    });
    const goodsarrayId = [];
    const hasChooseGoods = [];

    // 商品
    if (goodsList.goodsInfoPage.content.length > 0) {
      goodsList.goodsInfoPage.content.forEach((e) => {
        hasChooseGoods.push(e.goodsInfoId);
      });
    }
    if (goods.length > 0) {
      goods.forEach((e) => {
        // 只传新增商品的ID和displayType
        if (hasChooseGoods.indexOf(e.goodsInfoId) === -1) {
          goodsarrayId.push({
            goodsInfoId: e.goodsInfoId,
            displayType: e.displayType
          });
        }
      });
    }

    if (goodsarrayId.length > 0) {
      this.addGoods(goodsarrayId, activityId, have);
    } else {
      this.setState({
        btnDisabled: false
      });
    }
    if (goodsarrayId.length <= 0) {
      message.error('请添加商品再保存');
    }
  };
  // 请求新增商品
  addGoods = async (goodsarrayId, activityId, have) => {
    const { res } = await webapi.addGoods({
      activityId,
      goodsInfos: goodsarrayId
    });
    this.setState({
      btnDisabled: false
    });
    if (res.code != 'K-000000') {
      message.error('商品：' + res.message);
    } else {
      history.push(`/jinbi-return-details/${activityId}/0/${have}`);
    }
  };
  // 回调商品
  onChangeBackGoods = (goods) => {
    // console.log(goods.toJS());
    this.setState({
      goods: goods.toJS()
    });
  };
}
