import React from 'react';
import { Breadcrumb, Row, Col, Tooltip, Icon } from 'antd';
import { StoreProvider } from 'plume2';
import { DataModal, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SkuTable from './component/sku-table';
import CateTable from './component/cate-table';
import BrandTable from './component/brand-table';
import SearchForm from './component/search-form';
import { StatisticsHeader } from 'biz';

const defaultSkuColumns = [
  {
    title: '下单笔数',
    key: 'orderCount',
    dataIndex: 'orderCount',
    sorter: true
  },
  { title: '下单金额', key: 'orderAmt', dataIndex: 'orderAmt', sorter: true },
  { title: '下单件数', key: 'orderNum', dataIndex: 'orderNum', sorter: true },
  { title: '付款商品数', key: 'payNum', dataIndex: 'payNum', sorter: true },
  { title: '付款金额', key: 'payAmt', dataIndex: 'payAmt', sorter: true },
  {
    title: '单品转化率',
    key: 'orderConversion',
    dataIndex: 'orderConversion',
    sorter: true
  },
  {
    title: '退单件数',
    key: 'returnOrderNum',
    dataIndex: 'returnOrderNum',
    sorter: true
  }
];

const defaultCateColumns = [
  {
    title: '下单笔数',
    key: 'orderCount',
    dataIndex: 'orderCount',
    sorter: true
  },
  { title: '下单金额', key: 'orderAmt', dataIndex: 'orderAmt', sorter: true },
  { title: '下单件数', key: 'orderNum', dataIndex: 'orderNum', sorter: true },
  { title: '付款商品数', key: 'payNum', dataIndex: 'payNum', sorter: true },
  { title: '付款金额', key: 'payAmt', dataIndex: 'payAmt', sorter: true },

  {
    title: '退单笔数',
    key: 'returnOrderCount',
    dataIndex: 'returnOrderCount',
    sorter: true
  },
  {
    title: '退单件数',
    key: 'returnOrderNum',
    dataIndex: 'returnOrderNum',
    sorter: true
  }
];

const defaultBrandColumns = [
  {
    title: '下单笔数',
    key: 'orderCount',
    dataIndex: 'orderCount',
    sorter: true
  },
  { title: '下单金额', key: 'orderAmt', dataIndex: 'orderAmt', sorter: true },
  { title: '下单件数', key: 'orderNum', dataIndex: 'orderNum', sorter: true },
  { title: '付款商品数', key: 'payNum', dataIndex: 'payNum', sorter: true },
  { title: '付款金额', key: 'payAmt', dataIndex: 'payAmt', sorter: true },

  {
    title: '退单笔数',
    key: 'returnOrderCount',
    dataIndex: 'returnOrderCount',
    sorter: true
  },
  {
    title: '退单件数',
    key: 'returnOrderNum',
    dataIndex: 'returnOrderNum',
    sorter: true
  }
];

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsStatistics extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init(defaultSkuColumns, defaultCateColumns, defaultBrandColumns);
    this.store.warehouseBut();
  }

  constructor(props) {
    super(props);
  }

  render() {
    const goodsTotal = this.store
      .state()
      .get('GoodsTotal')
      .toJS();
      const warehouseList=this.store.state().get('warehouseList');
    //获取日期类型，决定商品概况中商品总数和上架商品数显示"-"还是真实的
    const dateFlag = this.store.state().get('dateFlag');
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>商品统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="newContent">
          <StatisticsHeader warehouseList={warehouseList} onClick={(param) => this.store.getGoodsInfo(param)} selectWare={(value)=>this.store.getChangeWare(value)} />
          <div style={styles.content}>
            <div >
              <h4 style={styles.h4}>商品概况</h4>
              <div style={styles.static}>
                <Row>
                  <Col span={4}>
                    <p style={styles.nav}>
                      <Tooltip
                        placement="rightBottom"
                        title="只支持按今天、昨天查看，当点击最近7天、最近30天、自然月时查询不生效。"
                      >
                        <span style={{ fontSize: 14 }}>
                          商品总数(SKU)<Icon type="question-circle-o" />
                        </span>
                      </Tooltip>
                    </p>
                    <p style={styles.num}>
                      {dateFlag != 0 && dateFlag != 1 ? '-' : goodsTotal.total}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p style={styles.nav}>
                      <Tooltip
                        placement="rightBottom"
                        title="只支持按今天、昨天查看，当点击最近7天、最近30天、自然月时查询不生效。"
                      >
                        <span style={{ fontSize: 14 }}>
                          已审核商品(SKU)<Icon type="question-circle-o" />
                        </span>
                      </Tooltip>
                    </p>
                    <p style={styles.num}>
                      {dateFlag != 0 && dateFlag != 1
                        ? '-'
                        : goodsTotal.checkedTotal}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p style={styles.nav}>
                      <Tooltip
                        placement="rightBottom"
                        title="只支持按今天、昨天查看，当点击最近7天、最近30天、自然月时查询不生效。"
                      >
                        <span style={{ fontSize: 14 }}>
                          上架商品数(SKU)<Icon type="question-circle-o" />
                        </span>
                      </Tooltip>
                    </p>
                    <p style={styles.num}>
                      {dateFlag != 0 && dateFlag != 1
                        ? '-'
                        : goodsTotal.addedTotal}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p style={styles.nav}>
                      <Tooltip
                        placement="rightBottom"
                        title="只支持按今天、昨天查看，当点击最近7天、最近30天、自然月时查询不生效。"
                      >
                        <span style={{ fontSize: 14 }}>
                          销售中商品(SKU)<Icon type="question-circle-o" />
                        </span>
                      </Tooltip>
                    </p>
                    <p style={styles.num}>
                      {dateFlag != 0 && dateFlag != 1
                        ? '-'
                        : goodsTotal.saleTotal}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p style={styles.nav}>
                      <span style={{ fontSize: 14 }}>商品详情转化率</span>
                    </p>
                    <p style={styles.num}>
                      {parseFloat(goodsTotal.orderConversion).toFixed(2) + '%'}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div style={styles.content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h4 style={styles.title}>商品销售报表</h4>
            </div>
            <SearchForm />
            {this.store.state().get('tableFlag') == 0 ? (
              <SkuTable />
            ) : this.store.state().get('tableFlag') == 1 ? (
              <CateTable />
            ) : (
                  <BrandTable />
                )}
          </div>

        </div>

        <DataModal />
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <p>1.当前统计不区分PC/H5/APP端；</p>
        <p>2.当前统计不区分订货端和管理端；</p>
        <p>3.订单/退单在提交成功后纳入统计,订单金额/退货</p>
        <p>金额以订单/退单提交成功时为准；</p>
        <p>4.统计时间内商品没有销售/退货，客户没有订单/退</p>
        <p>单，则不在报表中体现；</p>
      </div>
    );
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 14,
    // marginBottom: 20,
    color: '#333333'
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#333333',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fff',
    padding: 10,
    marginTop: 10,
    flex: 1
  },
  filter: {
    width: '23%',
    borderLeft: '3px solid #f5f5f5'
  }
};
