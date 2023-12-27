import React from 'react';
import { Relax } from 'plume2';
import { Button, Popconfirm, Dropdown, Icon, Menu } from 'antd';
import { noop, ExportModal, AuthWrapper, checkAuth } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchConfirm: Function;
      onShow: Function;
      exportModalData: any;
      onHideExportModal: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
    };
  };

  static relaxProps = {
    onBatchConfirm: noop,
    onShow: noop,
    exportModalData: 'exportModalData',
    onHideExportModal: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop
  };

  render() {
    const {
      onShow,
      onHideExportModal,
      exportModalData
    } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName="editOrderInvoices">
          <Button type="primary" onClick={() => onShow()}>
            新增
          </Button>
        </AuthWrapper>

        {checkAuth('destoryOpenOrderInvoice') ||
        checkAuth('exportOpenOrderInvoice') ? (
          <Dropdown
            overlay={this._menu()}
            getPopupContainer={() => document.getElementById('page-content')}
          >
            <Button>
              批量操作<Icon type="down" />
            </Button>
          </Dropdown>
        ) : null}

        <ExportModal
          data={exportModalData}
          onHide={onHideExportModal}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }
  _menu = () => {
    const { onBatchConfirm } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="destoryOpenOrderInvoice">
            <Popconfirm
              title={'确定批量开票？'}
              overlayStyle={{ width: '180px' }}
              onConfirm={() => {
                onBatchConfirm();
              }}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">批量开票</a>
            </Popconfirm>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="exportOpenOrderInvoice">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );
  };

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportModalChange
    } = this.props.relaxProps;
    onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的开票纪录',
      byIdsTitle: '导出选中的开票纪录',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
