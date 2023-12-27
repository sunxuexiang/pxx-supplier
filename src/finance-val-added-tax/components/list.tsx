import React from 'react';
import { Relax } from 'plume2';
import { Table, Dropdown, Icon, Menu, Popconfirm, Popover } from 'antd';
import { DataGrid, noop, Const } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';

type TList = List<any>;
declare type IList = List<any>;

const Column = Table.Column;

@Relax
export default class TaxList extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      loading: boolean;
      selected: IList;
      total: number;
      pageSize: number;
      dataList: TList;
      init: Function;
      destroyByInvoiceId: Function;
      confirmByInvoiceId: Function;
      deleteByInvoiceId: Function;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    init: noop,
    destroyByInvoiceId: noop,
    confirmByInvoiceId: noop,
    deleteByInvoiceId: noop,
    selected: 'selected',
    onSelect: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      total,
      pageSize,
      dataList,
      init,
      loading,
      selected,
      onSelect
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          loading={loading}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selected.toJS(),
            onChange: selectedRowKeys => {
              onSelect(selectedRowKeys);
            }
          }}
          rowKey="customerInvoiceId"
          pagination={{
            pageSize,
            total,
            onChange: (pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize });
            }
          }}
          dataSource={dataList.toJS()}
        >
          <Column
            title="客户名称"
            dataIndex="customerName"
            key="customerName"
          />

          <Column
            title="申请时间"
            dataIndex="createTime"
            key="createTime"
            render={createTime => (
              <span>
                {moment(createTime)
                  .format(Const.DATE_FORMAT)
                  .toString()}
              </span>
            )}
          />

          <Column title="单位名称" dataIndex="companyName" key="companyName" />

          <Column
            title="纳税人识别码"
            dataIndex="taxpayerNumber"
            key="taxpayerNumber"
          />

          <Column
            title="注册地址"
            dataIndex="companyAddress"
            key="companyAddress"
          />

          <Column
            title="注册电话"
            dataIndex="companyPhone"
            key="companyPhone"
          />

          <Column title="银行基本户号" dataIndex="bankNo" key="bankNo" />

          <Column title="开户银行" dataIndex="bankName" key="bankName" />

          <Column
            title="资质证件"
            render={rowInfo => this._renderImage(rowInfo)}
          />
          <Column
            title="操作"
            className="left-td"
            render={rowInfo => this._renderOperate(rowInfo)}
          />
        </DataGrid>
      </div>
    );
  }

  _renderOperate(rowInfo) {
    const { checkState, customerInvoiceId } = rowInfo;
    const { destroyByInvoiceId, deleteByInvoiceId } = this.props.relaxProps;

    //待确认
    if (checkState == 0) {
      return (
        <Dropdown
          overlay={this._renderMenu(customerInvoiceId)}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      );
    } else if (checkState == 1) {
      //已审核
      return (
        <Popconfirm
          title="是否确认作废已选已审核增票资质？"
          onConfirm={() => destroyByInvoiceId(customerInvoiceId)}
          okText="确定"
          cancelText="取消"
        >
          <a href="javascript:void(0);">作废</a>
        </Popconfirm>
      );
    } else {
      //审核未通过
      return (
        <Popconfirm
          title="是否确认删除已选未通过增票资质?"
          onConfirm={() => deleteByInvoiceId(customerInvoiceId)}
          okText="确定"
          cancelText="取消"
        >
          <a href="javascript:void(0);">删除</a>
        </Popconfirm>
      );
    }
  }

  _renderMenu = (id: string) => {
    const { confirmByInvoiceId, destroyByInvoiceId } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item key="0">
          <Popconfirm
            title="是否确认通过已选增票资质?"
            onConfirm={() => confirmByInvoiceId(id)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">审核</a>
          </Popconfirm>
        </Menu.Item>

        <Menu.Item key="1">
          <Popconfirm
            title="是否确认驳回已选增票资质?"
            onConfirm={() => destroyByInvoiceId(id)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">驳回</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };

  _renderImage = rowInfo => {
    return (
      <Popover
        key={rowInfo.orderInvoiceId}
        placement="topLeft"
        title={'资质证件'}
        trigger="click"
        content={
          <div>
            <img
              style={styles.attachmentView}
              src={
                rowInfo.businessLicenseImg
                  ? JSON.parse(rowInfo.businessLicenseImg)[0].url
                  : ``
              }
            />
            <img
              style={styles.attachmentView}
              src={
                rowInfo.taxpayerIdentificationImg
                  ? JSON.parse(rowInfo.taxpayerIdentificationImg)[0].url
                  : ``
              }
            />
          </div>
        }
      >
        <a href="javascript:;">查看</a>
      </Popover>
    );
  };
}

const styles = {
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    width: 400,
    height: 400
  }
};
