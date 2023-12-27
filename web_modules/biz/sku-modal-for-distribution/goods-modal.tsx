import * as React from 'react';
import { fromJS } from 'immutable';

import { Modal, message } from 'antd';

import GoodsGrid from './goods-grid';

export default class GoodsModal extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([])
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
      showValidGood
    } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    return (
      <Modal  maskClosable={false}
        title={
          <div>
            <span style={{paddingRight:8}}>添加分销商品</span>
            <small>
              已选<span style={{ color: '#F56C1D' }}>{selectedSkuIds.length}</span>款商品，每次最多可选{
                skuLimit
              }款
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          if (selectedSkuIds.length <= 0) {
            message.error('请至少选择一条');
          } else if (skuLimit && selectedSkuIds.length > skuLimit) {
            message.error('每次最多可选50款');
          } else {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="下一步"
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
