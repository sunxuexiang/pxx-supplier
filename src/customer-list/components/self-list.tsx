import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { DataGrid, noop, FindArea } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

@withRouter
@Relax
export default class SelfCustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      selfDataList: IList;
      selfTotal: number;
      selfPageSize: number;
      selfCurrentPage: number;
      initForSelf: Function;
      selfForm: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selfTotal: 'selfTotal',
    selfPageSize: 'selfPageSize',
    selfCurrentPage: 'selfCurrentPage',
    selfDataList: 'selfDataList',
    initForSelf: noop,
    selfForm: 'selfForm',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop
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
      selfDataList,
      selfPageSize,
      selfTotal,
      selfCurrentPage,
      initForSelf,
      selfForm,
      supplierNameMap
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="customerId"
        className="resetTable"
        pagination={{
          current: selfCurrentPage,
          pageSize: selfPageSize,
          total: selfTotal,
          onChange: (pageNum, pageSize) => {
            initForSelf({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={selfDataList.toJS()}
      >
        <Column
          title="客户名称"
          // key="customerName"
          // dataIndex="customerName"
          // render={(customerName) => (customerName ? customerName : '-')}
          render={(vlaue) => {
            if (vlaue.beaconStar) {
              return <span style={styles.rescolor}>{vlaue.customerName}*</span>
            } else {
              return (vlaue.customerName ? vlaue.customerName : '-')
            }
          }}
        />
        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />
        {/*<Column*/}
        {/*title="平台等级"*/}
        {/*key='customerLevelName'*/}
        {/*dataIndex='customerLevelName'*/}
        {/*render={(customerLevelName) => customerLevelName ? customerLevelName : '-'}*/}
        {/*/>*/}
        {/*<Column*/}
        {/*title="成长值"*/}
        {/*key='growthValue'*/}
        {/*dataIndex='growthValue'*/}
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
          key="customerType"
          dataIndex="customerType"
          render={(customerType, record) =>
            customerType == 1 ? (
              <div>
                <p>商家客户</p>
                <Tooltip
                  placement="top"
                  title={
                    supplierNameMap.get((record as any).customerId)
                      ? supplierNameMap.get((record as any).customerId)
                      : ''
                  }
                  visible={
                    this.state.tooltipVisible[(record as any).customerId]
                      ? this.state.tooltipVisible[(record as any).customerId]
                      : false
                  }
                >
                  <a
                    href="javascript:void(0);"
                    onMouseEnter={() =>
                      this._renderToolTips((record as any).customerId, true)
                    }
                    onMouseOut={() =>
                      this._renderToolTips((record as any).customerId, false)
                    }
                  >
                    查看
                  </a>
                </Tooltip>
              </div>
            ) : (
              <div>平台客户</div>
            )
          }
        />
        {/*<Column*/}
        {/*title="审核状态"*/}
        {/*key="checkState"*/}
        {/*dataIndex="checkState"*/}
        {/*render={(checkState, record) => {*/}
        {/*let statusString = <div>-</div>;*/}
        {/*if (checkState == 0) {*/}
        {/*statusString = <div>待审核</div>;*/}
        {/*} else if (checkState == 1) {*/}
        {/*statusString = <div>已审核</div>;*/}
        {/*} else if (checkState == 2) {*/}
        {/*statusString = (*/}
        {/*<div>*/}
        {/*<p>审核未通过</p>*/}
        {/*<Tooltip placement="top" title={record['rejectReason']}>*/}
        {/*<a href="javascript:void(0);">原因</a>*/}
        {/*</Tooltip>*/}
        {/*</div>*/}
        {/*);*/}
        {/*}*/}
        {/*return statusString;*/}
        {/*}}*/}
        {/*/>*/}
        {selfForm.get('checkState') === '' ||
          selfForm.get('checkState') === '-1' ||
          selfForm.get('checkState') === '1' ? (
          <Column
            title="账号状态"
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('checkState') == 1) {
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
          title="最近登录时间"
          key="lastLoginTime"
          dataIndex="lastLoginTime"
          render={(lastLoginTime) => (lastLoginTime ? lastLoginTime.substring(0, lastLoginTime.length - 4) : '-')}
        />

        <Column
          title="最近支付订单时间"
          key="lastPayOrderTime"
          dataIndex="lastPayOrderTime"
          render={(lastPayOrderTime) => (lastPayOrderTime ? lastPayOrderTime.substring(0, lastPayOrderTime.length - 4) : '-')}
        />
      </DataGrid>
    );
  }

  _renderToolTips = async (customerId, visible) => {
    let { tooltipVisible } = this.state;
    const {
      supplierNameMap,
      getSupplierNameByCustomerId
    } = this.props.relaxProps;
    let newState = {};
    if (visible && !supplierNameMap.get(customerId)) {
      await getSupplierNameByCustomerId(customerId);
    }
    tooltipVisible[customerId] = visible;
    newState['tooltipVisible'] = tooltipVisible;
    this.setState(newState);
  };
}
const styles = {
  rescolor: {
    color: '#f56c1d'
  }
}