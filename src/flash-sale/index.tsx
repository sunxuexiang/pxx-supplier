import React from 'react';
import { Alert, Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ActivityTab from './components/activity-tab';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FlashSale extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb></BreadCrumb>
        {/* 面包屑导航 */}
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>抢购活动</Breadcrumb.Item>
          <Breadcrumb.Item>整点秒杀</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          {/* 头部标题 */}
          <Headline title="整点秒杀" />

          <div >
            <Alert
              message="操作提示:"
              description={
                <div>
                  <p>1、点击参与即可编辑参与整点秒杀的商品</p>
                  <p>2、秒杀活动结束时间默认持续两小时</p>
                  <p>3、各个场次活动商品不可重叠，当前场次开始后，不可取消</p>
                  <p>4、抢购商品金额不可设置为0元，抢购商品正常计算运费，商家也可设置包邮</p>
                </div>
              }
              type="info"
            />
          </div>

          {/* 搜索项区域 */}
          {this.store.state().get('activityKey') != 1 && <SearchForm />}

          {/* 数据列表区域 */}
          <ActivityTab />
        </div>
      </div>
    );
  }
}
