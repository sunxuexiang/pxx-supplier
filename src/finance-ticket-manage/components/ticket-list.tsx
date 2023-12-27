import * as React from 'react';
import { Relax } from 'plume2';
import { Menu, Dropdown, Icon, Modal } from 'antd';
import { DataGrid, noop } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = DataGrid;
const confirm = Modal.confirm;

@Relax
export default class TicketList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      onEdit: Function;
      onDelete: Function;
      pageSize: number;
      total: number;
      current: number;
      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    onEdit: noop,
    onDelete: noop,
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    init: noop
  };

  render() {
    const {
      loading,
      dataList,
      total,
      pageSize,
      init,
      current
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="projectId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column title="开票项目" dataIndex="projectName" key="ticket" />
        <Column
          title="操作"
          key="action"
          render={rowInfo => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { onEdit } = this.props.relaxProps;

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="javascript:;" onClick={() => onEdit(rowInfo.projectId)}>
            编辑
          </a>
        </Menu.Item>
        <Menu.Item key="1">
          <a
            href="javascript:;"
            onClick={() => this._handleDelete(rowInfo.projectId)}
          >
            删除
          </a>
        </Menu.Item>
      </Menu>
    );

    if (rowInfo.projectName == '明细') {
      return <Icon type="minus" />;
    } else {
      return (
        <Dropdown
          getPopupContainer={() => document.getElementById('page-content')}
          overlay={menu}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="javascript:;">
            操作&nbsp;<Icon type="down" />
          </a>
        </Dropdown>
      );
    }
  }

  _handleDelete(id) {
    const { onDelete } = this.props.relaxProps;

    confirm({
      title: '提示',
      content: '确定要删除该项目吗？',
      onOk() {
        onDelete(id);
      }
    });
  }
}
