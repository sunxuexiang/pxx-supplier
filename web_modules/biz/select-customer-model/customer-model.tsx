import React from 'react';

import CustomerGrid from './customer-grid';
import SelfCustomerGrid from './self-customer-grid';
import { Modal, message } from 'antd';
import { util } from 'qmkit';

export default class CustomerModel extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    this.state = {
      selectedCustomerIds: props.selectedCustomerIds
        ? props.selectedCustomerIds
        : [],
      selectedRows: props.selectedRows ? props.selectedRows : []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible == nextProps.visible) {
      return;
    }
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : [],
      selectedCustomerIds: nextProps.selectedCustomerIds
        ? nextProps.selectedCustomerIds
        : []
    });
  }

  render() {
    const { visible, onOkBackFun, onCancelBackFun, maxLength,limitChildFlag } = this.props;
    const { selectedCustomerIds, selectedRows } = this.state;
    return (
      <Modal  maskClosable={false}
        title={
          <div>
            选择客户&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>
                {selectedCustomerIds.length}
              </span>位
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          if (maxLength && this.state.selectedCustomerIds.length > maxLength) {
            message.error(`最多可选${maxLength}个用户`);
          } else {
            onOkBackFun(
              this.state.selectedCustomerIds,
              this.state.selectedRows
            );
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="确认"
        cancelText="取消"
      >
        {util.isThirdStore() && (
          <CustomerGrid
            visible={visible}
            selectedCustomerIds={selectedCustomerIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
          />
        )}
        {!util.isThirdStore() && (
          <SelfCustomerGrid
            visible={visible}
            selectedCustomerIds={selectedCustomerIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            limitChildFlag={limitChildFlag}
          />
        )}
      </Modal>
    );
  }

  rowChangeBackFun = (selectedCustomerIds, selectedRows) => {
    this.setState({
      selectedCustomerIds: selectedCustomerIds,
      selectedRows: selectedRows
    });
  };
}
