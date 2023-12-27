import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';
import { util } from 'qmkit';

import GoodsGrid from './goods-grid';
import { IList } from '../../../typings/globalType';

export default class GoodsModal extends React.Component<any, any> {
  props: {
    marketingId: String;
    wareId: any;
    selectedSkuIds: IList;
    selectedRows: IList;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    //搜索参数
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
    //是否排除提价商品
    limitNOSpecialPriceGoods: boolean;
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      marketingId: props.marketingId ? props.marketingId : '',
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      wareId: props.wareId ? props.wareId : null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
      wareId: nextProps.wareId ? nextProps.wareId : null
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
      limitNOSpecialPriceGoods
    } = this.props;

    const { selectedSkuIds, selectedRows, marketingId, wareId } = this.state;
    const isThrid = util.isThirdStore();

    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>
              款商品
            </small>
          </div>
        }
        width={isThrid ? 1300 : 1100}
        visible={visible}
        onOk={() => {
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
            marketingId={marketingId}
            visible={visible}
            wareId={wareId}
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
