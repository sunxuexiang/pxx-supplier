import * as React from 'react';
import { Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { Popconfirm, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { DataGrid, noop, FindArea, AuthWrapper } from 'qmkit';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      // onSelect: Function;
      // selected: IList;
      init: Function;
      form: any;
      deleteRelated: Function;
      onShowUpdateRelatedModal: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    // selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    // onSelect: noop,
    init: noop,
    form: 'form',
    deleteRelated: noop,
    onShowUpdateRelatedModal: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      // selected,
      // onSelect,
      init,
      deleteRelated,
      onShowUpdateRelatedModal
    } = this.props.relaxProps;

    return (
      <DataGrid
        className="resetTable"
        loading={loading}
        // rowSelection={{
        //   type: 'checkbox',
        //   selectedRowKeys: selected.toJS(),
        //   onChange: selectedRowKeys => {
        //     onSelect(selectedRowKeys);
        //   }
        // }}
        rowKey="customerId"
        pagination={{
          current: currentPage,
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
          // key="customerName"
          // dataIndex="customerName"
          render={(vlaue) => {
            if (vlaue.beaconStar) {
              return <span style={styles.rescolor}>{vlaue.customerName}*</span>;
            } else {
              return vlaue.customerName ? vlaue.customerName : '-';
            }
          }}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />

        <Column
          title="地区"
          width="166px"
          render={(rowData) => {
            const data = fromJS(rowData);
            const provinceId = data.get('provinceId')
              ? data.get('provinceId').toString()
              : '';
            const cityId = data.get('cityId')
              ? data.get('cityId').toString()
              : '';
            const areaId = data.get('areaId')
              ? data.get('areaId').toString()
              : '';
            return provinceId
              ? FindArea.addressInfo(provinceId, cityId, areaId)
              : '-';
          }}
        />

        <Column
          title="级别"
          key="customerLevelName"
          dataIndex="customerLevelName"
          render={(customerLevelName) =>
            customerLevelName ? customerLevelName : '-'
          }
        />
        <Column
          title="联系人"
          key="contactName"
          dataIndex="contactName"
          render={(contactName) => (contactName ? contactName : '-')}
        />

        <Column
          title="联系方式"
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />

        <Column
          title="客户类型"
          key="myCustomer"
          dataIndex="myCustomer"
          render={(myCustomer) => (myCustomer ? '我发展的' : '我关联的')}
        />

        <Column
          title="账号状态"
          key="customerStatus"
          dataIndex="customerStatus"
          render={(customerStatus, rowData) => {
            if (customerStatus == 1) {
              return (
                <div>
                  <p>禁用</p>
                  <Tooltip placement="top" title={rowData['forbidReason']}>
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            } else {
              return <span>{CUSTOMER_STATUS[customerStatus]}</span>;
            }
            {
              /*const data = fromJS(rowData);*/
            }
            {
              /*return <span>{data.get('checkState') == 1 ? CUSTOMER_STATUS[customerStatus] || '-' : '-'}</span>*/
            }
          }}
        />

        <Column
          title="最近登录时间"
          key="lastLoginTime"
          dataIndex="lastLoginTime"
          render={(lastLoginTime) =>
            lastLoginTime
              ? lastLoginTime.substring(0, lastLoginTime.length - 4)
              : '-'
          }
        />

        <Column
          title="最近支付订单时间"
          key="lastPayOrderTime"
          dataIndex="lastPayOrderTime"
          render={(lastPayOrderTime) =>
            lastPayOrderTime
              ? lastPayOrderTime.substring(0, lastPayOrderTime.length - 4)
              : '-'
          }
        />

        <Column
          title="业务代表"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />
        <Column
          title="白鲸管家"
          key="managerName"
          dataIndex="managerName"
          render={(managerName) => (managerName ? managerName : '-')}
        />
        <Column
          title="操作"
          render={(rowInfo) => {
            return (
              <div>
                <AuthWrapper functionName="f_customer_edit">
                  <a
                    href="javascript:void(0)"
                    onClick={() => onShowUpdateRelatedModal(true, rowInfo)}
                  >
                    编辑
                  </a>
                  &nbsp;&nbsp;
                </AuthWrapper>
                {!rowInfo['myCustomer'] && (
                  <AuthWrapper functionName="f_customer_2">
                    <Popconfirm
                      title="确定删除该用户？"
                      onConfirm={() => deleteRelated(rowInfo['customerId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="javascript:void(0);">删除</a>
                    </Popconfirm>
                  </AuthWrapper>
                )}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}

const styles = {
  rescolor: {
    color: '#f56c1d'
  }
};
