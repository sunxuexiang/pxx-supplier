import React from 'react';
import { Button, message, Modal } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      checkedIds: IList;
      exportModalData: IMap;
      onAdd: Function;
      onBatchDelete: Function;
      onExportModalHide: Function;
      onExportModalShow: Function;
    };
  };

  static relaxProps = {
    checkedIds: 'checkedIds',
    exportModalData: 'exportModalData',
    onAdd: noop,
    onBatchDelete: noop,
    onExportModalHide: noop,
    onExportModalShow: noop
  };

  render() {
    const { exportModalData, onAdd, onExportModalHide } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_ware_house_edit'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增仓库
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 批量删除
   */
  _batchDelete = () => {
    const { onBatchDelete, checkedIds } = this.props.relaxProps;
    if (checkedIds.isEmpty()) {
      message.warning('请勾选需要操作的信息');
      return;
    }
    confirm({
      title: '批量删除',
      content: '是否确认删除已选内容？删除后不可恢复。',
      onOk() {
        onBatchDelete();
      },
      onCancel() {}
    });
  };

  /**
   * 批量导出
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息'
    });
  }
}
