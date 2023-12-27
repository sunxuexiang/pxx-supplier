import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid} from 'qmkit';
import { Table} from 'antd';
import './index.css';
import SearchForm from './search-form';
import * as webapi from './webapi';

const { Column } = Table;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      selectedRowKeys: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: {},
      showValidGood: props.showValidGood,
      isCouponList: props.showValidGood,
      companyType: props.companyType,
      wareList:[]
    };
  }

  componentDidMount() {
    console.log(this.props.isWare,'isWare11111')
    if(this.props.isWare){
      webapi.wareHousePage({pageNum:0,pageSize:10000,defaultFlag:1}).then(data=>{
        this.setState({
          wareList:data.res?.context?.wareHouseVOPage?.content||[]
        })
      });
    }
    this.init({});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.init({});
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      loading,
      goodsInfoPage,
      selectedRowKeys,
      selectedRows
    } = this.state;
    const { rowChangeBackFun, visible, checkAddedGood } = this.props;
    return (
      <div className="content">
        {/*search*/}
        <SearchForm
          searchBackFun={this.searchBackFun}
          visible={visible}
          wareList={this.state.wareList}
          companyType={this.props.companyType}
        />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage.content}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
                .concat(fromJS(selectedTableRows).toSet())
                .toList();
              rows = selectedRowKeys
                .map((key) =>
                  rows.filter((row) => row.get('goodsInfoId') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              disabled: checkAddedGood && record.addedFlag === 0
            })
          }}
        >
          
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width={140}
          />
          <Column
            title="ERP编码"
            dataIndex="erpGoodsInfoNo"
            key="erpGoodsInfoNo"
            width={165}
          />
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={180}
          />
          <Column
          // 适合区域
            title="所属仓库"
            dataIndex="wareId"
            key="wareId"
            width={100}
            render={(value) => {
                return (this.state.wareList||[]).filter(item=>item.wareId==value)[0]?.wareName||'';
            }}
          />

          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width={80}
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column title="分类" width="10%" key="cateName" dataIndex="cateName" />

          <Column
            title="品牌"
            key="goodsBrand"
            dataIndex="brandName"
            width={160}
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="门店价"
            key="marketPrice"
            dataIndex="marketPrice"
            width={80}
            render={(data) => {
              return `¥${data == null ? 0 : data}`;
            }}
          />

          <Column
            title="大客户价"
            key="vipPrice"
            dataIndex="vipPrice"
            width={100}
            render={(data) => {
              return `¥${data == null ? 0 : data}`;
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    console.log(this.props.liveId,'this.props.liveId')
    if(this.props?.liveId){
      params.liveRoomId=this.props.liveId;
    };
    const companyType = this.state.companyType;
    const isCouponList = this.state.isCouponList;
    if(isCouponList) {
      params.addedFlag = 1;
    }
    let { res }=await webapi.fetchGoodsList({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      console.log(res)
      // let list=res['goodsInfoPage'].content;
      res['goodsInfoPage'].content.map((goodInfo) => {
        const cId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('cateId');
        const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
        goodInfo['cateName'] = cate ? cate.get('cateName') : '';

        const bId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('brandId');
        const brand =
          res['brands'] == null
            ? ''
            : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
        goodInfo['brandName'] = brand ? brand.get('brandName') : '';

        return goodInfo;
      });

      this.setState({
        goodsInfoPage: res['goodsInfoPage'],
        loading: false
      });
    }
  };

  /**
   * 清空搜索条件
   */
  clearSearchParam = () => {
    this.setState({ searchParams: {} });
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
