import React from 'react';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { Table, message } from 'antd';
import { IList } from 'typings/globalType';
import moment from 'moment';
@Relax
export default class CouponList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      liveCompanyDataList: IList;
      liveBagFormData: any;
      current: number; //当前页
      // liveListGoodsDataList: IList; //直播商品列表
      queryPage: Function; //分页查数据
      editFormData: Function;
      // changeRecommend: Function; //改变推荐状态
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    liveCompanyDataList: 'liveCompanyDataList',
    current: 'current',
    liveBagFormData: 'liveBagFormData',
    queryPage: noop,
    // changeRecommend: noop,
    editFormData: noop
  };
  state = {
    selectedRowKeys: []
  };

  render() {
    const { liveCompanyDataList } = this.props.relaxProps;
    return (
      <div>
        <Table
          columns={this._columns}
          loading={false}
          dataSource={liveCompanyDataList.toJS()}
          rowKey={(e: any) => e?.couponActivity?.activityId}
          scroll={{ y: 600 }}
          expandedRowRender={(record) => {
            record?.couponInfoList.forEach((coupon) => {
              // 3.1.面值
              coupon.denominationStr =
                coupon.fullBuyType == 0
                  ? `满0减${coupon.denomination}`
                  : `满${coupon.fullBuyPrice}减${coupon.denomination}`;
              // 3.2.有效期
              if (coupon.rangeDayType == 0) {
                // 按起止时间
                let startTime = moment(coupon.startTime)
                  .format(Const.DAY_FORMAT)
                  .toString();
                let endTime = moment(coupon.endTime)
                  .format(Const.DAY_FORMAT)
                  .toString();
                coupon.startTime = coupon.validity = `${startTime} 至 ${endTime}`;
              } else {
                // 按N天有效
                coupon.validity = `领取当天${coupon.effectiveDays}日内有效`;
              }
              // 3.3.优惠券分类
              coupon.cateNamesStr =
                coupon.cateNames.length != 0
                  ? coupon.cateNames.reduce((a, b) => `${a},${b}`, '').substr(1)
                  : '其他';
              // 3.4.使用范围
              if ([0, 4].indexOf(coupon.scopeType) != -1) {
                coupon.scopeNamesStr =
                  Const.couponScopeType[coupon.scopeType] +
                  coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
              } else {
                coupon.scopeNamesStr =
                  Const.couponScopeType[coupon.scopeType] +
                  ':' +
                  (coupon.scopeNames.length != 0
                    ? coupon.scopeNames
                        .reduce((a, b) => `${a},${b}`, '')
                        .substr(1)
                    : '-');
              }
              // 3.5.优惠券状态
              coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
              //3.6 使用范围
              if (coupon.scopeType == 0) {
                coupon.scopeNamesStr = '全部商品';
              } else if (coupon.scopeType == 4) {
                coupon.scopeNamesStr = '部分商品';
              }
            });
            return this.expandedRowRender(record);
          }}
          pagination={false}
          //  rowSelection={rowSelection}
          //  pagination={{
          //     total,
          //     pageSize,
          //      current: current,
          //      onChange: (pageNum, pageSize) => {
          //          queryPage({ pageNum: pageNum - 1, pageSize });
          //      }
          //  }}
        />
      </div>
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns: any = [
    {
      key: 'activityName',
      dataIndex: 'couponActivity.activityName',
      title: '优惠券活动名称',
      align: 'left',
      render: (text) => {
        return <div>{text}</div>;
      }
    },
    {
      key: 'startTime',
      dataIndex: 'startTime',
      title: '开始/结束时间',
      align: 'left',
      render: (text, record) => {
        return (
          <div>
            <div>
              {moment(record.couponActivity.createTime)
                .format(Const.TIME_FORMAT)
                .toString() + '~'}
            </div>
            <div>
              {moment(record.couponActivity.endTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </div>
          </div>
        );
      }
    },
    {
      key: 'receiveCount',
      dataIndex: 'receiveCount',
      title: '单人限领次数',
      align: 'left',
      render: (text, row) => {
        return (
          <div>
            {row.couponActivity.receiveType
              ? row.couponActivity.receiveCount
              : '不限'}
          </div>
        );
      }
    },
    {
      key: 'joinLevel',
      dataIndex: 'joinLevel',
      title: '目标客户',
      align: 'left',
      render: (text, row) => {
        return (
          <div>
            {row.couponActivity.joinLevel == '-1' ? '全平台客户' : '其他'}
          </div>
        );
      }
    },
    {
      key: 'pauseFlag',
      dataIndex: 'couponActivity.pauseFlag',
      title: '活动状态',
      align: 'left',
      render: (text) => {
        return Const.activityStatus[text];
      }
    }
  ];

  _couponInfoColumns = [
    {
      key: 'couponName',
      dataIndex: 'couponName',
      title: '优惠券名称',
      align: 'left'
    },
    {
      key: 'denominationStr',
      dataIndex: 'denominationStr',
      title: '面值',
      align: 'left'
    },
    {
      key: 'validity',
      dataIndex: 'validity',
      title: '有效期',
      align: 'left'
    },
    {
      key: 'cateNamesStr',
      dataIndex: 'cateNamesStr',
      title: '优惠券分类',
      align: 'left'
    },
    {
      key: 'scopeNamesStr',
      dataIndex: 'scopeNamesStr',
      title: '使用范围',
      align: 'left'
    },
    {
      key: 'couponStatusStr',
      dataIndex: 'couponStatusStr',
      title: '优惠券状态',
      align: 'left'
    }
  ];

  expandedRowRender = (record) => {
    const { liveBagFormData, editFormData } = this.props.relaxProps;
    return (
      <div style={{ padding: '10px', background: '#fff' }}>
        <Table
          style={{ background: '#fff' }}
          rowKey="couponId"
          dataSource={record.couponInfoList}
          columns={this._couponInfoColumns}
          rowSelection={{
            selectedRowKeys: liveBagFormData.toJS()?.selectedRowKeys || [],
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(
                'selectedRowKeys:',
                selectedRowKeys,
                'selectedRows: ',
                selectedRows
              );
              if (selectedRowKeys.length > 1) {
                message.error('暂不支持多选');
                editFormData('selectedRowKeys', []);
              } else {
                editFormData(
                  'activityId',
                  selectedRowKeys.length
                    ? record.couponActivity.activityId
                    : null
                );
                editFormData('selectedRowKeys', selectedRowKeys);
              }
              console.log(liveBagFormData.toJS());
            },
            getCheckboxProps: (record1: any) => {
              let list = liveBagFormData.toJS().selectedRowKeys;
              return {
                disabled:
                  list.length == 1 && list[0] != record1.couponId
                    ? true
                    : false,
                name: record1.couponId
              };
            }
          }}
          pagination={false}
        />
      </div>
    );
  };

  init = (couponInfos) => {
    // 3.格式化返回结构
    // let couponInfos = couponInfoList;
  };

  /**
   * 展示目标客户
   */
  showTargetCustomer(text) {
    // const { levelList } = this.props.relaxProps;
    if (text == null) {
      return;
    }
    if (-1 == text) {
      return '全平台客户';
    } else if (-2 == text) {
      return '指定客户';
    } else if (+text === -3) {
      return '指定人群';
    } else if (-4 == text) {
      return '企业会员';
    } else {
      return '其他';
    }
  }
}
