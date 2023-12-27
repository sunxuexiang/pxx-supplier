import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import GoodsGrid from './goods-grid';
import { IList } from '../../../typings/globalType';

export default class GoodsModal extends React.Component<any, any> {
  props: {
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
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      goodsInfoList: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
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
      application
    } = this.props;
    const { selectedSkuIds, selectedRows, goodsInfoList } = this.state;
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
        width={1100}
        visible={visible}
        onOk={() => {
          if (selectedSkuIds.length > skuLimit) {
            message.error('每次最多可选200款商品');
          } else {
            onOkBackFun(selectedSkuIds, selectedRows, goodsInfoList);
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
            visible={visible}
            showValidGood={showValidGood}
            skuLimit={skuLimit}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
          />
        }
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows, goodsInfoList) => {
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows,
      goodsInfoList: goodsInfoList
    });
  };
}
