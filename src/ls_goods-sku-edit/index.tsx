import * as React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Tabs } from 'antd';
import { Const, Headline, history, checkAuth, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SkuTable from './component/sku-table';
import Price from './component/price';
import Foot from './component/foot';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsSKUEdit extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { pid } = this.props.match.params;
    this.store.init(pid);
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 }); //传入-1时,则会去初始化第一个分类的信息
    if (this.props.location.state != undefined) {
      this.store.onMainTabChange(this.props.location.state.tab, false);
    }
  }

  render() {
    const { pid } = this.props.match.params;
    //默认添加商品的编辑与设价权限
    let goodsFuncName = 'f_goods_sku_edit_2';
    let priceFuncName = 'f_goods_sku_edit_3';
    if (this.props.location.pathname.indexOf('/goods-sku-check-edit') > -1) {
      //待审核SKU编辑,设价
      goodsFuncName = 'f_goods_sku_edit';
      priceFuncName = 'f_goods_sku_price';
    }
    const path = this.props.match.path || '';
    const parentPath =
      path.indexOf('/goods-sku-edit/') > -1 ? '商品列表' : '待审核商品';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          {/* <Breadcrumb.Item>{parentPath}</Breadcrumb.Item> */}
          <Breadcrumb.Item>编辑商品SKU</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>{parentPath}</Breadcrumb.Item>
          <Breadcrumb.Item>编辑商品SKU</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title="编辑商品SKU" state={this._getState(pid)} />

          <Tabs
            activeKey={this.store.state().get('activeTabKey')}
            onChange={(activeKey) => this.store.onMainTabChange(activeKey)}
          >
            {(checkAuth(goodsFuncName) || checkAuth(priceFuncName)) && (
              <Tabs.TabPane tab="基础信息" key="main">
                {/*商品表格*/}
                <SkuTable />
              </Tabs.TabPane>
            )}
            {/*{checkAuth(priceFuncName) &&*/}
            {/*this.store.state().getIn(['spu', 'priceType']) === 1 &&*/}
            {/*!this.store.state().getIn(['spu', 'allowPriceSet']) ? null : (*/}
            {/*  <Tabs.TabPane tab="价格及订货量" key="price">*/}
            {/*    /!*价格及订货量设置*!/*/}
            {/*    <Price />*/}
            {/*  </Tabs.TabPane>*/}
            {/*)}*/}
          </Tabs>

          {/*页脚*/}
          <Foot goodsFuncName={goodsFuncName} priceFuncName={priceFuncName} />
          <PicModal />
          <ImgModal />
        </div>
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param pid
   * @returns {any}
   * @private
   */
  _getState(pid) {
    // 已保存的才有这种状态
    if (pid) {
      const auditStatus = this.store.state().getIn(['spu', 'auditStatus']);
      // 待审核的不能修改
      if (auditStatus == 0) {
        history.goBack();
      }
      return Const.goodsState[auditStatus];
    }

    return null;
  }
}
