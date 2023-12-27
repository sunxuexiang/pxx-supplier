import React from 'react';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      urlType: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop,
    urlType: 'urlType'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      checkedIds,
      onSelect,
      queryPage,
      urlType
    } = this.props.relaxProps;

    /**
     * 列表数据的column信息
     */
    const _columns = [
      // {
      //   key: 'companyNumber',
      //   dataIndex: 'companyNumber',
      //   title: '物流公司编号'
      // },
      {
        key: 'logisticsName',
        dataIndex: 'logisticsName',
        title: `${urlType === 1 ? '指定专线' : '物流公司'}名称`
      },
      {
        key: 'logisticsPhone',
        dataIndex: 'logisticsPhone',
        title: `${urlType === 1 ? '指定专线' : '物流公司'}电话`
      },
      {
        key: 'logisticsAddress',
        dataIndex: 'logisticsAddress',
        title: `${urlType === 1 ? '指定专线' : '物流公司'}地址`
      },
      /*{
        key: 'createTime',
        dataIndex: 'createTime',
        title: '创建时间',
        render: (time) => time ? Moment(time).format(Const.TIME_FORMAT).toString() : '-',
      },
      {
        key: 'deleteTime',
        dataIndex: 'deleteTime',
        title: '删除时间',
        render: (time) => time ? Moment(time).format(Const.TIME_FORMAT).toString() : '-',
      },*/
      ...(urlType === 1
        ? [
            {
              key: 'option',
              title: '操作',
              render: (rowInfo) => this._getOption(rowInfo)
            }
          ]
        : [])
    ];

    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={_columns}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_appoint_company_tabs'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo.id)}>
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_appoint_company_tabs'}>
          <a onClick={() => this._onDelete(rowInfo.id)}>删除</a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
}
