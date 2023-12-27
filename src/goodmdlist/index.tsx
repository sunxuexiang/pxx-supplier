import React, { Component } from 'react';
import { Relax, StoreProvider, Store } from 'plume2';
import * as webApi from './webapi';
import { Breadcrumb, Form, Table, Tag, Space } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import Appstore from './store';
import MobileShowBox from './components/mobile-show-box';
import CouponInfoForm from './components/coupon-info-form';

const CouponInfoFormBox = Form.create()(CouponInfoForm as any);
const CouponInfoRelax = Relax(CouponInfoFormBox);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _store: Store;
  constructor(props) {
    super(props);
    console.log(this, '2123123213');
  }

  async componentDidMount() {
    const { cid } = this.props.match.params;
    // console.log(this.props.location.pathname,'这个是不是那个传值过来的')
    console.log(webApi.markeTing);
    let s = this.props.location.pathname;
    const state = this.props.location.state;
    let b = s.substr(s.lastIndexOf('?') + 1, 4);
    let itme = await webApi.markeTing(b);
    this.state.Ritme = itme.res.context;
    const { couponType } = (state || {}) as any;
    this.store.init({ couponType, cid });
  }
  render() {
    const id = this.store.state().get('couponId');
    // console.log(id,'这个是不是那个传值过来的')
    const state = this.props.location.state;
    const itmelist = this.state.Ritme;
    console.log(itmelist, '这是什么');
    const { source } = (state || {}) as any;
    const dataSourceitsm = itmelist ? itmelist.marketingSuitDetialVOList : [];
    let dataSource = [];
    const itmes = dataSourceitsm
      ? dataSourceitsm.map((v) => {
          let itmlist = {};
          console.log(v, '引');
          itmlist.key = v.goodsInfoVO.goodsInfoId;
          itmlist.name = v.marketingVO.marketingName
          itmlist.address = v.goodsInfoVO.goodsInfoName;
          dataSource.push(itmlist);
          itmlist.age = v.marketingVO.beginTime.substring(0,v.marketingVO.beginTime.length-4)  +  ' 至 '  + v.marketingVO.endTime.substring(0,v.marketingVO.endTime.length-4)
        })
      : [];
    console.log(dataSource, '999999999999-----');
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{id ? '编辑' : '创建'}购买套餐</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={id ? '编辑优惠券' : '查看套装'} />
        <div style={styles.container}>
          {/* <MobileShowBox /> */}

          <div style={styles.mangto}>
            <span>套餐名称：</span>
            <span style={styles.spfaine}>
              {itmelist ? itmelist.marketingName : ''}
            </span>
          </div>
          {/* <CouponInfoRelax /> */}
        </div>
        <div style={styles.mangto}>
          <span>下单数量：</span>
          <span style={styles.spfaine}>
            {itmelist ? itmelist.suitBuyNum : ''}
          </span>
        </div>
        <div style={styles.mangto}>
          <span>限购数量：</span>
          <span style={styles.spfaine}>
            {itmelist ? itmelist.suitLimitNum : ''}
          </span>
        </div>
        <div style={styles.mangto}>
          <span>起止时间：</span>
          <span style={styles.spfaine}>
            {itmelist ? itmelist.beginTime.substring(0,itmelist.beginTime.length-4) : ''} -{' '}
            {itmelist ? itmelist.endTime.substring(0,itmelist.beginTime.length-4) : ''}{' '}
          </span>
        </div>
        <div style={styles.mangto}>
          <span>优惠标签：</span>{' '}
          <span style={styles.spfaine}>
            {itmelist ? itmelist.suitCouponLabel : ''}
          </span>
        </div>
        <div style={styles.mangto}>
          <span>优惠文案：</span>
          <span style={styles.spfaine}>
            {itmelist ? itmelist.suitCouponDesc : ''}
          </span>
        </div>
        <div style={styles.mangto}>
          <span>
            营销头图：
            <img
              style={styles.imtg}
              src={itmelist ? itmelist.suitMarketingBanner : ''}
              alt=""
            />
          </span>
        </div>
        <div style={styles.mangto}>
          <span>
            顶部头图：
            <img
              style={styles.imtg}
              src={itmelist ? itmelist.suitTopImage : ''}
              alt=""
            />
          </span>
        </div>
        <div style={styles.mangto}>
          <span>活动：</span>
          <div style={styles.mangtoS}>
            {/* <th>1</th> */}
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </div>
    ];
  }
}
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];
const columns = [
  {
    title: '活动名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '起止时间',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '商品名称',
    dataIndex: 'address',
    key: 'address'
  }
];
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  mangto: {
    marginTop: 20
  },
  mangbomt: {
    marginTop: 20
  },
  mangtoS: {
    marginTop: 20,
    width: 70 + '%'
  },
  imtg: {
    width: 300 + 'px',
    height: 150 + 'px',
    verticalAlign: 'top',
    borderRadius: 5 + 'px'
  },
  spfaine: {
    letterSpacing: 2 + 'px'
  }
} as any;
