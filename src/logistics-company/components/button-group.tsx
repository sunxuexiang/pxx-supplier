import React from 'react';
import { Button, Modal, message } from 'antd';
import { Relax } from 'plume2';
import { noop, ExportModal, AuthWrapper, cache } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { history } from 'qmkit';
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
      openSyncCompany: Function;
      urlType: number;
    };
  };

  static relaxProps = {
    checkedIds: 'checkedIds',
    exportModalData: 'exportModalData',
    onAdd: noop,
    onBatchDelete: noop,
    onExportModalHide: noop,
    onExportModalShow: noop,
    openSyncCompany: noop,
    urlType: 'urlType'
  };

  render() {
    const {
      exportModalData,
      onAdd,
      onExportModalHide,
      openSyncCompany,
      urlType
    } = this.props.relaxProps;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));

    return (
      <div className="handle-bar">
        {/*<AuthWrapper functionName={'f_xxx'}>*/}

        {/*</AuthWrapper>*/}
        {/*<AuthWrapper functionName={'f_yyy'}>*/}
        {/*<Button onClick={() => this._batchDelete()}>
            批量删除
          </Button>*/}
        {/*</AuthWrapper>*/}
        {/*<AuthWrapper functionName={'f_zzz'}>*/}
        {/*<Button onClick={() => this._batchExport()}>
            批量导出
          </Button>*/}
        {/*</AuthWrapper>*/}
        <AuthWrapper functionName={'f_appoint_company_tabs'}>
          {urlType === 1 && ( // 指定专线才可新增物流公司
            <React.Fragment>
              <Button onClick={() => history.push('/logistics-company-import')}>
                批量导入
              </Button>
              <Button type="primary" onClick={() => onAdd()}>
                {`新增${urlType === 1 ? '指定专线' : '物流公司'}`}
              </Button>
            </React.Fragment>
          )}

          {/* 只有 喜吖吖自营 这一个商家有此同步按钮 */}
          {/* {loginInfo && loginInfo.storeId === 123457929 && (
            <Button type="primary" onClick={() => openSyncCompany()}>
              同步设置
            </Button>
          )} */}
        </AuthWrapper>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
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
