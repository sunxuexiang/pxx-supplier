import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper } from 'qmkit';
import { Popconfirm, Table, Modal } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
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
      // onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      cateList: IList;
      sourceCateList: IList;
      onVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop,
    onVisible: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="biddingId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
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
   * 列表数据的column信息
   */
  _columns = [
    {
      title: '厂商名称',
      key: 'companyName',
      dataIndex: 'companyName'
    },
    {
      key: 'contactPhone',
      dataIndex: 'contactPhone',
      title: '联系方式'
    },
    {
      key: 'contactAddress',
      dataIndex: 'contactAddress',
      title: '联系地址'
    },
    {
      key: 'brandNames',
      dataIndex: 'brandNames',
      title: '旗下品牌'
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (status) => {
        return status == 1 ? '已启用' : '已禁用';
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_vendor_edit'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo)}>
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_vendor_state'}>
          <a
            style={styles.edit}
            onClick={() => this._onVisible(rowInfo.companyId, rowInfo.status)}
          >
            {rowInfo.status ? '禁用' : '启用'}
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_vendor_del'}>
          {rowInfo.status == 0 ? (
            <a onClick={() => this._onDelete(rowInfo.companyId)}>删除</a>
          ) : null}
        </AuthWrapper>
      </div>
    );
  };
  /**
   * 编辑信息
   */
  _onEdit = (rowInfo) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(rowInfo);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确定要删除选中厂商吗?',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
  /**
   * 启用/禁用
   */
  _onVisible = (id, status) => {
    const { onVisible } = this.props.relaxProps;
    onVisible(id, status);
  };
}

const Styles = {
  text: {
    width: 300,
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
