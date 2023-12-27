import React from 'react';
import { Relax } from 'plume2';
import { noop, util, AuthWrapper } from 'qmkit';
import { Popconfirm, Table, Modal } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';
const defaultImg = require('../img/none.png');

const confirm = Modal.confirm;
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
      // onVisible: Function;
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
    queryPage: noop
    // onVisible: noop,
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
    const isThird = util.isThirdStore();
    const cols = isThird
      ? []
      : [
          {
            key: 'companyName',
            title: '厂商',
            dataIndex: 'companyName'
          },
          {
            key: 'brandMap',
            dataIndex: 'brandMap',
            title: '品牌',
            render: (rowInfo) => this._getElist(rowInfo)
          }
        ];
    /**
     * 列表数据的column信息
     */
    const _columns = [
      {
        title: '直播间图片',
        key: 'imgPath',
        dataIndex: 'imgPath',
        render: (imgPath) =>
          imgPath ? (
            <img style={styles.imgItem} src={imgPath} />
          ) : (
            <img style={styles.imgItem} src={defaultImg} />
          )
      },
      {
        key: 'liveRoomName',
        dataIndex: 'liveRoomName',
        title: '直播间名称'
      },
      ...cols,
      {
        key: 'accountMap',
        dataIndex: 'accountMap',
        title: '直播账号',
        render: (rowInfo) => this._getElist(rowInfo)
      },
      {
        key: 'operationMap',
        dataIndex: 'operationMap',
        title: '运营账号',
        render: (rowInfo) => this._getElist(rowInfo)
      },
      {
        key: 'option',
        title: '操作',
        render: (rowInfo) => this._getOption(rowInfo)
      }
    ];
    return (
      <Table
        rowKey="biddingId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={_columns}
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
    // console.log(rowInfo);
    return (
      <div>
        <AuthWrapper functionName={'f_live_manage_edit'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo)}>
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_live_manage_management'}>
          <Link
            style={styles.edit}
            to={{
              pathname: `/live-manage-list/${rowInfo.liveRoomId}`
            }}
          >
            管理
          </Link>
        </AuthWrapper>
        <AuthWrapper functionName={'f_live_manage_setUp'}>
          <Link
            style={styles.edit}
            to={{ pathname: `/live-manage-setUp/${rowInfo.liveRoomId}` }}
          >
            设置
          </Link>
        </AuthWrapper>
        {/* <AuthWrapper functionName={'f_live_manage_del'}> 
          <a onClick={() => this._onDelete(rowInfo.liveRoomId)}>删除</a>
        </AuthWrapper>  */}

        <AuthWrapper functionName={'f_live_manage_del'}>
          {this._getElist(rowInfo.accountMap) == '暂无' &&
          this._getElist(rowInfo.operationMap) == '暂无' ? (
            <a onClick={() => this._onDelete(rowInfo.liveRoomId)}>删除</a>
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
      title: '确定要删除选中直播间吗?',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
  /**
   * 启用/禁用
   */
  _onVisible = (item) => {
    // const { onVisible } = this.props.relaxProps;
    // onVisible(item);
  };
  _getElist = (item) => {
    if (item) {
      let o = '';
      let e = [];
      for (let key in item) {
        // o += item[key];
        e.push(item[key]);
      }
      o = e.join(',');
      return o;
    } else {
      return '暂无';
    }
  };
}

const styles = {
  imgItem: {
    width: 48,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  edit: {
    paddingRight: 10
  }
};
