import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import moment from 'moment';
import { AuthWrapper, Const, DataGrid, noop, util } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Table } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponActivityList: IList;
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

    deleteActivity: noop,
    init: noop,
    pauseActivity: noop,
    startActivity: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponActivityList,
      init
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.activityId}
        dataSource={couponActivityList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Table.Column
          title="囤货场次名称"
          dataIndex="activityName"
          key="activityName"
        />
        <Table.Column
          title="囤货类型"
          dataIndex="pileActivityType"
          key="pileActivityType"
          render={(text) => {
            return '全款囤货';
          }}
        />
        <Table.Column
          title="场次开始时间"
          dataIndex="startTime"
          key="startTime"
          render={(text, record) => {
            return (
              <div>
                {moment(text)
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </div>
            );
          }}
        />
        <Table.Column
          title="场次结束时间"
          dataIndex="endTime"
          key="endTime"
          render={(text, record) => {
            return (
              <div>
                {moment(text)
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </div>
            );
          }}
        />
        <Table.Column
          title="场次状态"
          dataIndex="pauseFlag"
          key="pauseFlag"
          render={(text) => {
            console.log(text, 'text');
            return Const.activityStatus[text];
          }}
        />
        <Table.Column
          title="操作"
          key="operate"
          dataIndex="pauseFlag"
          className={'operation-th'}
          render={(text, record) => {
            return this.operator(text, record);
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  private operator(text, record: any) {
    const { pauseActivity, deleteActivity } = this.props.relaxProps;
    const url = '';
    return (
      <div className="operation-box">
        <AuthWrapper functionName={'f_stock_activity_detailf'}>
          <Link
            to={`/stock-activity-dis/${record.activityId}`}
            style={{ marginRight: '5px' }}
          >
            查看
          </Link>
        </AuthWrapper>
        <AuthWrapper functionName={'f_stock_activity_editorf'}>
          {record.pauseFlag != 4 && (
            <Link
              to={`/stock-activity-goods/${record.activityId}`}
              style={{ marginRight: '5px' }}
            >
              添加商品
            </Link>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_stock_activity_editorf'}>
          {text == 1 || text == 3 ? (
            <Popconfirm
              title="确定关闭该活动？"
              onConfirm={() => pauseActivity(record.activityId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">关闭</a>
            </Popconfirm>
          ) : null}
          {record.pauseFlag != 4 && (
            <Link
              to={`/stock-activity-edit/${record.activityId}`}
              style={{ marginLeft: '5px' }}
            >
              编辑
            </Link>
          )}
          {/* {text == 3 && (
            <Popconfirm
              title="确定删除该活动？"
              onConfirm={() => deleteActivity(record.activityId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">删除</a>
            </Popconfirm>
          )} */}
        </AuthWrapper>
      </div>
    );
  }
}
