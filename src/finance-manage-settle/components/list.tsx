import React from 'react';

import { Relax } from 'plume2';
import { DataGrid, Const, noop, history, util, AuthWrapper } from 'qmkit';
import moment from 'moment';

import { IMap } from 'typings/globalType';

const { Column } = DataGrid;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlePage: IMap;
      setCheckedSettleIds: Function;
      changeSettleStatus: Function;
      queryParams: IMap;
      fetchSettleList: Function;
    };
  };

  static relaxProps = {
    settlePage: 'settlePage',
    setCheckedSettleIds: noop,
    changeSettleStatus: noop,
    queryParams: 'queryParams',
    fetchSettleList: noop
  };

  render() {
    const { settlePage, fetchSettleList, queryParams } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey="settleId"
        dataSource={
          settlePage.get('content') ? settlePage.get('content').toJS() : []
        }
        pagination={{
          total: settlePage.get('totalElements'),
          pageSize: settlePage.get('size'),
          current: settlePage.get('number') + 1
        }}
        onChange={(pagination) =>
          fetchSettleList(pagination['current'] - 1, 10)
        }
      >
        {queryParams.get('settleStatus') == 1 && (
          <Column
            title="结算时间"
            key="settleTime"
            dataIndex="settleTime"
            render={(value) => {
              return moment(value)
                .format(Const.DAY_FORMAT)
                .toString();
            }}
          />
        )}

        <Column
          title="生成时间"
          key="createTime"
          dataIndex="createTime"
          render={(value) => {
            return moment(value)
              .format(Const.DAY_FORMAT)
              .toString();
          }}
        />
        <Column title="结算单号" key="statementNo" dataIndex="settlementCode" />

        <Column
          title="结算时间段"
          key="statementTime"
          render={(row) => {
            return `${row.startTime}～${row.endTime}`;
          }}
        />

        <Column title="店铺名称" key="storeName" dataIndex="storeName" />

        <Column
          title="商品实付总额"
          key="splitPayPrice"
          dataIndex="splitPayPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="运费总额"
          key="deliveryPrice"
          dataIndex="deliveryPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="通用券优惠总额"
          key="commonCouponPrice"
          dataIndex="commonCouponPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="积分抵扣总额"
          key="pointPrice"
          dataIndex="pointPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="平台佣金总额"
          key="platformPrice"
          dataIndex="platformPrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          title="分销佣金总额"
          key="commissionPrice"
          dataIndex="commissionPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="供货总额"
          key="providerPrice"
          dataIndex="providerPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="店铺应收总额"
          key="storePrice"
          dataIndex="storePrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          title="操作"
          key="operation"
          render={(row) => {
            return (
              <AuthWrapper functionName="f_billing_details">
                <a
                  onClick={() =>
                    history.push(`/billing-details/${row.settleId}`)
                  }
                >
                  查询明细
                </a>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  // /**
  //  * 批量操作
  //  * @param status
  //  * @private
  //  */
  // _handleBatchOption = (settleId, status) => {
  // 	const {changeSettleStatus} = this.props.relaxProps;
  // 	changeSettleStatus([settleId], status);
  // }
}
