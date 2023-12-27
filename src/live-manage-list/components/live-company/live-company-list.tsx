import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, DataGrid, AuthWrapper } from 'qmkit';
import { Popconfirm, Table } from 'antd';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
// import FormItem from 'antd/lib/form/FormItem';
import Moment from 'moment';

const { Column } = Table;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const ErrorText = styled.p`
  color: #f04134;
`;

const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  _rejectForm;
  props: {
    relaxProps?: {
      liveCompanyLoading: boolean;
      liveCompanyTotal: number;
      liveCompanyPageSize: number;
      liveCompanyDataList: IList;
      liveCompanyCurrent: number;
      queryLiveCompanyPage: Function;
      onIsCouponsModal: Function;
      onDelCoupons: Function;
    };
  };

  static relaxProps = {
    liveCompanyLoading: 'liveCompanyLoading',
    liveCompanyTotal: 'liveCompanyTotal',
    liveCompanyPageSize: 'liveCompanyPageSize',
    liveCompanyDataList: 'liveCompanyDataList',
    liveCompanyCurrent: 'liveCompanyCurrent',
    queryLiveCompanyPage: noop,
    onIsCouponsModal: noop,
    onDelCoupons: noop
  };

  render() {
    const {
      liveCompanyLoading,
      liveCompanyTotal,
      liveCompanyPageSize,
      liveCompanyDataList,
      liveCompanyCurrent,
      queryLiveCompanyPage,
      onIsCouponsModal,
      onDelCoupons
    } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          dataSource={liveCompanyDataList.toJS()}
          loading={liveCompanyLoading}
          pagination={{
            total: liveCompanyTotal,
            pageSize: liveCompanyPageSize,
            current: liveCompanyCurrent,
            onChange: (pageNum, pageSize) => {
              queryLiveCompanyPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
          rowKey={'liveCompanyList'}
        >
          <Column
            title="优惠券活动名称"
            dataIndex="activityName"
            key="activityName"
            render={(text, row: any) => row.couponActivity.activityName}
          />
          <Column
            title="活动时间"
            dataIndex="createTime"
            key="createTime"
            render={(time, rowInfo: any) => (
              <div>
                <div>
                  {Moment(rowInfo.couponActivity.createTime)
                    .format(Const.TIME_FORMAT)
                    .toString() + '~'}
                </div>
                <div>
                  {Moment(rowInfo.couponActivity.endTime)
                    .format(Const.TIME_FORMAT)
                    .toString()}
                </div>
              </div>
            )}
          />
          <Column
            title="每人限领次数"
            dataIndex="receiveCount"
            key="receiveCount"
            render={(text, row: any) =>
              row.couponActivity.receiveType
                ? row.couponActivity.receiveCount
                : '不限'
            }
          />
          <Column
            title="目标客户"
            dataIndex="joinLevel"
            key="joinLevel"
            render={(text, row: any) =>
              row.couponActivity.joinLevel == '-1' ? '全平台客户' : '其他'
            }
          />
          <Column
            title="活动状态"
            dataIndex="couponActivity.pauseFlag"
            key="pauseFlag"
            render={(text) => {
              console.log(text);
              return Const.activityStatus[text];
            }}
          />
          <Column
            title="操作"
            dataIndex="option"
            key="option"
            render={(_row, rowInfo: any) => {
              // if (currentLiveCompanyTab == '2') {
              return (
                <div>
                  <AuthWrapper functionName="f_app_live_goods_push1">
                    {rowInfo.couponActivity.pauseFlag != 4 ? (
                      <a
                        style={styles.edit}
                        onClick={() =>
                          onIsCouponsModal(
                            rowInfo.couponActivity.activityId,
                            'edit'
                          )
                        }
                      >
                        发放
                      </a>
                    ) : null}
                  </AuthWrapper>
                  <a
                    style={styles.edit}
                    onClick={() =>
                      onIsCouponsModal(rowInfo.couponActivity.activityId, 'dis')
                    }
                  >
                    查看
                  </a>
                  <AuthWrapper functionName="f_app_live_goods_del1">
                    <Popconfirm
                      title="移除后该活动不参与直播，是否确认该操作"
                      onConfirm={() => {
                        onDelCoupons(rowInfo.couponActivity.activityId);
                      }}
                      onCancel={() => {}}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={styles.edit}>移除</a>
                    </Popconfirm>
                  </AuthWrapper>
                </div>
              );
            }}
          />
        </DataGrid>
      </TableBox>
    );
  }
}
