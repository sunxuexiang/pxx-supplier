import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import moment from 'moment';
import { AuthWrapper, Const, DataGrid, noop, util } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponActivityList: IList;
      levelList: IList;

      deleteActivity: Function;
      init: Function;
      pauseActivity: Function;
      startActivity: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponActivityList: 'couponActivityList',
    levelList: 'levelList',

    deleteActivity: noop,
    init: noop,
    pauseActivity: noop,
    startActivity: noop
  };

  render() {
    const { total, pageNum, pageSize, couponActivityList, init } =
      this.props.relaxProps;
    console.log(Const.couponActivityType);
    return (
      <DataGrid
        rowKey={(record) => record.activityId}
        dataSource={couponActivityList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showSizeChanger:true,
          showQuickJumper:true,
          pageSizeOptions:["10","40","60","80","100"],
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          },
          onShowSizeChange:(pageNum, pageSize)=>{
            init({ pageNum: 0, pageSize });
          }
        }}
      >
        <DataGrid.Column
          title="优惠券活动名称"
          dataIndex="activityName"
          key="activityName"
        />
        <DataGrid.Column
          title="活动类型"
          dataIndex="couponActivityType"
          key="couponActivityType"
          render={(text) => {
            return Const.couponActivityType[text];
          }}
        />
        <DataGrid.Column
          title={
            <p>
              开始
              <br />
              结束时间
            </p>
          }
          dataIndex="startTime"
          key="startTime"
          render={(text, record) => {
            return (
              <div>
                <p>{moment(text).format(Const.TIME_FORMAT).toString()}</p>
                <p>
                  {moment((record as any).endTime)
                    .format(Const.TIME_FORMAT)
                    .toString()}
                </p>
              </div>
            );
          }}
        />
        <DataGrid.Column
          title="目标客户"
          dataIndex="joinLevel"
          key="joinLevel"
          render={(text) => {
            return this.showTargetCustomer(text);
          }}
        />
        <DataGrid.Column
          title="适用区域"
          width="10%"
          key="wareName"
          dataIndex="wareName"
        />
        <DataGrid.Column
          title="活动状态"
          dataIndex="pauseFlag"
          key="pauseFlag"
          render={(text) => {
            return Const.activityStatus[text];
          }}
        />
        <DataGrid.Column
          title="操作"
          key="operate"
          className={'operation-th'}
          dataIndex="pauseFlag"
          render={(text, record) => {
            return this.operator(text, record);
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 展示目标客户
   */
  showTargetCustomer(text) {
    const { levelList } = this.props.relaxProps;
    if (text == null) {
      return;
    }
    if (-1 == text) {
      return util.isThirdStore() ? '全部客户' : '全平台客户';
    } else if (0 == text) {
      return '全部等级';
    } else if (-2 == text) {
      return '指定客户';
    } else {
      let str = '';
      text.split(',').forEach((item) => {
        const level = levelList.find((i) => i.get('key') == item);
        if (level == null) {
          return;
        }
        str = str + level.get('value') + ',';
      });
      str = str.substring(0, str.length - 1);
      if (str == '') {
        str = '-';
      }
      return str;
    }
  }

  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  private operator(text, record: any) {
    const { startActivity, pauseActivity, deleteActivity } =
      this.props.relaxProps;
    let activityType = 'all-present';
    if (record.couponActivityType == 1) {
      activityType = 'specify';
    } else if (record.couponActivityType == 2) {
      activityType = 'store';
    }
    let url = '';
    if (record.couponActivityType == 9) {
      url = `/coupon-goods-add/${(record as any).activityId}`;
    } else {
      url = `/coupon-activity-${activityType}/${(record as any).activityId}`;
    }
    return (
      <div className="operation-box">
        <AuthWrapper functionName={'f_coupon_activity_detail'}>
          <Link
            to={`/coupon-activity-detail/${record.activityId}/${record.couponActivityType}`}
          >
            查看
          </Link>
        </AuthWrapper>
        <AuthWrapper functionName={'f_coupon_activity_editor'}>
          {activityType != 'specify' && text == 1 && (
            <a
              href="javascript:void(0);"
              onClick={() => {
                pauseActivity(record.activityId);
              }}
            >
              暂停
            </a>
          )}
          {activityType != 'specify' && text == 2 && (
            <a
              href="javascript:void(0);"
              onClick={() => {
                startActivity(record.activityId);
              }}
            >
              开始
            </a>
          )}
          {text == 3 && <Link to={url}>编辑</Link>}
          {text == 3 && (
            <Popconfirm
              title="确定删除该活动？"
              onConfirm={() => deleteActivity(record.activityId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">删除</a>
            </Popconfirm>
          )}
        </AuthWrapper>
      </div>
    );
  }
}
