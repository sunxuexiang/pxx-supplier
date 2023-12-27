import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { message, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthWrapper, Const, DataGrid, FindBusiness, noop } from 'qmkit';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

const STATUS = (status) => {
  if (status === 0) {
    return 1;
  } else if (status === 1) {
    return 0;
  }
};

const STATUS_OPERATE = (status) => {
  if (status === 0) {
    return '禁用';
  } else if (status === 1) {
    return '启用';
  }
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
      onSelect: Function;
      selected: IList;
      init: Function;
      onDelete: Function;
      //审核客户
      onCustomerStatus: Function;
      //启用/禁用
      onCheckStatus: Function;
      form: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
      setRejectModalVisible: Function;
      setForbidModalVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onSelect: noop,
    init: noop,
    onDelete: noop,
    onCustomerStatus: noop,
    onCheckStatus: noop,
    form: 'form',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop,
    setRejectModalVisible: noop,
    setForbidModalVisible: noop
  };

  componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      selected,
      onSelect,
      init,
      form,
      supplierNameMap
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
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
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
          render={(customerAccount, rowData) =>
            fromJS(rowData).get('isDistributor') == 1 ? (
              <div>
                <p>{customerAccount ? customerAccount : '-'}</p>
                <span style={styles.platform}>分销员</span>
              </div>
            ) : (
              <p>{customerAccount ? customerAccount : '-'}</p>
            )
          }
        />

        <Column
          title="公司性质"
          key="businessNatureType"
          dataIndex="businessNatureType"
          render={(businessNatureType) =>
            businessNatureType
              ? FindBusiness.findBusinessNatureName(businessNatureType)
              : '-'
          }
        />

        <Column
          title="公司名称"
          key="enterpriseName"
          dataIndex="enterpriseName"
          render={(enterpriseName) => (enterpriseName ? enterpriseName : '-')}
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
          title="平台等级"
          key="customerLevelName"
          dataIndex="customerLevelName"
          render={(customerLevelName) =>
            customerLevelName ? customerLevelName : '-'
          }
        />
        <Column
          title="成长值"
          key="growthValue"
          dataIndex="growthValue"
          render={(growthValue) => (growthValue ? growthValue : 0)}
        />

        <Column
          title="审核状态"
          key="enterpriseCheckState"
          dataIndex="enterpriseCheckState"
          render={(enterpriseCheckState, record) => {
            let statusString = <div>-</div>;
            if (enterpriseCheckState == 1) {
              statusString = <div>待审核</div>;
            } else if (enterpriseCheckState == 2) {
              statusString = <div>已审核</div>;
            } else if (enterpriseCheckState == 3) {
              statusString = (
                <div>
                  <p>审核未通过</p>
                  <Tooltip
                    placement="top"
                    title={record['enterpriseCheckReason']}
                  >
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            }
            return statusString;
          }}
        />

        {form.get('enterpriseCheckState') === '' ||
        form.get('enterpriseCheckState') === '-1' ||
        form.get('enterpriseCheckState') === '2' ? (
          <Column
            title="账号状态"
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('enterpriseCheckState') == 2) {
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
              } else {
                return <span>-</span>;
              }
            }}
          />
        ) : null}

        <Column
          title="业务员"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />
      </DataGrid>
    );
  }
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
