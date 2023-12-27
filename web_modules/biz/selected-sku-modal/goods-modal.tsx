import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import GoodsGrid from './goods-grid';
import { IList } from '../../../typings/globalType';

export default class GoodsModal extends React.Component<any, any> {
  props: {
    selectedSkuIds: any;
    selectedRows: any;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    marketingId?: String,
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    // 仓库id
    wareId?: any;
    //搜索参数
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
    //是否排除提价商品
    limitNOSpecialPriceGoods: boolean;
    // 是否隐藏适用区域和第三方商家隐藏epr编码
    needHide?: boolean;
    // 是否显示条形码和计量单位
    showThirdColumn?: boolean;
    // 是否只允许选择一个商品
    onlyOne?: boolean;
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      marketingId: props.marketingId
        ? props.marketingId
        : '',
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      wareId: props.wareId
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
      wareId: nextProps.wareId
    });
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      showValidGood,
      searchParams,
      application,
      limitNOSpecialPriceGoods,
      needHide,
      showThirdColumn,
      onlyOne
    } = this.props;

    const { selectedSkuIds, selectedRows, marketingId, wareId } = this.state;

    return (
      <Modal maskClosable={false}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>款商品
            </small>
          </div>
        }
        width={showThirdColumn ? 1300 : 1100}
        visible={visible}
        onOk={() => {
          if (onlyOne && this.state.selectedSkuIds && this.state.selectedSkuIds.length > 1) {
            message.error('只能选择一个商品');
            return
          }
          if (application === 'saleType') {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          } else if (skuLimit && selectedSkuIds.length > skuLimit) {
            message.error('最多选择20种赠品');
          } else {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="确认"
        cancelText="取消"
      >
        {
          <GoodsGrid
            wareId={wareId}
            needHide={needHide}
            showThirdColumn={showThirdColumn}
            marketingId={marketingId}
            visible={visible}
            showValidGood={showValidGood}
            skuLimit={skuLimit}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
            limitNOSpecialPriceGoods={limitNOSpecialPriceGoods}
          />
        }
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows
    });
  };
}
