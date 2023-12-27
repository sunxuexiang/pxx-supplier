import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { ExportModal, noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      exportModalData: any;
      onHideExportModal: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      sumReturnPrice: number;
    };
  };

  static relaxProps = {
    exportModalData: 'exportModalData',
    onHideExportModal: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    sumReturnPrice: 'sumReturnPrice'
  };

  render() {
    const {
      exportModalData,
      onHideExportModal,
      sumReturnPrice
    } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <Button type="primary" onClick={() => this._handleBatchExport()}>
          批量导出
        </Button>
        <h2 style={styles.total}>
          退款合计: ￥{sumReturnPrice
            ? sumReturnPrice
                .toFixed(2)
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
            : '0.00'}
        </h2>
        <ExportModal
          data={exportModalData}
          onHide={onHideExportModal}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportModalChange
    } = this.props.relaxProps;
    onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的退款明细',
      byIdsTitle: '导出选中的退款明细',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}

const styles = {
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 0,
    color: '#555'
  } as any
};
