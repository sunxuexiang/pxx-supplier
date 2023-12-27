import * as React from 'react';
import { Relax } from 'plume2';
import { fromJS, Set } from 'immutable';
import { Button, Table } from 'antd';
import { Const, DataGrid, noop,ExportModal } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from '../webapi';
import { IList,IMap } from 'typings/globalType';

const { Column } = Table;

/**
 * 商品添加
 */

@Relax
export default class GoodsGrid extends React.Component<any, any> {
  props: {
    // selectedSkuIds:any,
    // selectedRows:any,
    // searchParams:any,
    // showValidGood:any,
    // wareId:number,
    limitNOSpecialPriceGoods?: any,
    // rowChangeBackFun:Function;
    relaxProps?: {
      init: Function;
      goodsInfoPage: any;
      loading: boolean;
      selectedSkuIds: IList;
      selectedRows: IList;
      onGoodsActorFormBut: Function;
      onExportModalShow:Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      showValidGood: props.showValidGood,
    };
  }

  static relaxProps = {
    init: noop,
    goodsInfoPage: 'goodsInfoPage',
    loading: 'loading',
    selectedSkuIds: 'selectedSkuIds',
    selectedRows: 'selectedRows',
    exportModalData: 'exportModalData',
    onGoodsActorFormBut: noop,
    onExportModalShow:noop,
    onExportModalHide: noop
  };



  render() {
    const {
      showValidGood,
    } = this.state;
    // const { rowChangeBackFun } = this.props;
    const { goodsInfoPage, loading, selectedSkuIds,selectedRows, 
      onGoodsActorFormBut,onExportModalShow,exportModalData,onExportModalHide} = this.props.relaxProps;

    return (
      <div className="content">
        <SearchForm />
        <div style={{marginBottom:'10px'}}>
          <Button
            onClick={(e) => {
              onExportModalShow({
                byParamsTitle: '选择筛选中的商品',
                // byIdsTitle: '选择勾选的信息',
                byAllTitle: '选择全部商品'
              });
            }}>
            批量选择
          </Button>
          <ExportModal
            data={exportModalData}
            onHide={onExportModalHide}
            handleByParams={exportModalData.get('exportByParams')}
            handleByIds={exportModalData.get('exportByIds')}
            handleByAll={exportModalData.get('exportByAll')}
          />
        </div>
        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage?.content}
          pagination={{
            total: goodsInfoPage?.totalElements,
            current: goodsInfoPage?.number + 1,
            pageSize: goodsInfoPage.size,
            showSizeChanger: true,
            pageSizeOptions: ["10", "40", "60", "80", "100"],
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            },
            onShowSizeChange: (current, pageSize) => {
              const param = {
                pageNum: 0,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}

          rowSelection={{
            selectedRowKeys: selectedSkuIds.toJS(),
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet()).concat(fromJS(selectedTableRows).toSet()).toList();
              rows = selectedRowKeys.map((key) => rows.filter((row) => row.get('goodsInfoId') == key).first()).filter((f) => f);
              onGoodsActorFormBut('selectedSkuIds', fromJS(selectedRowKeys));
              onGoodsActorFormBut('selectedRows', fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              /* old: 如果validFlag === 0 标识该商品不是有效的商品,可能存在情况是=>无货,起订量大于库存etc..
                      该情况下商品checkbox置灰,禁止选中 */

              // 以上两行注释是老的逻辑, 新的逻辑需要把状态为无货的商品给放开
              // goodsStatus 的状态为: 商品状态 0：正常 1：缺货 2：失效
              // 因此判断等于2的失效状态下禁用
              disabled: showValidGood
                ? !showValidGood
                : record.goodsStatus === 2
            })
          }}
        >
          <Column title='序号' width='7%'
            render={(text, record, index) => {
              return (`${(goodsInfoPage.number) * (goodsInfoPage.size) + (index + 1)}`) //当前页数减1乘以每一页页数再加当前页序号+1
            }}
          />
          <Column title="SKU编码" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title="ERP编码" dataIndex="erpGoodsInfoNo" key="erpGoodsInfoNo" />
          <Column title="商品名称" dataIndex="goodsInfoName" key="goodsInfoName"/>
          <Column title="适用区域" dataIndex="wareName" key="wareName"/>
          <Column title="分类" key="goodsCate" dataIndex="cateName" />
          <Column title="品牌" key="goodsBrand" dataIndex="brandName"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />
          <Column title="单价"  key="marketPrice" dataIndex="marketPrice"
            render={(data) => {
              return data ? `¥${data}` : '￥0.00';
            }}
          />
        </DataGrid>
        {/* <Pagination defaultCurrent={1} total={50} /> */}
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize}) => {
    this.props.relaxProps.init({pageNum,pageSize});
  };

 

}
