import * as React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop,AuthWrapper } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popconfirm } from 'antd';

declare type IList = List<any>;
const { Column } = DataGrid;

const AUDIT_STATUS = {
  0: '即将开始',
  1: '进行中',
  2: '已结束',
  3: '待审核',
  4: '审核不通过'
};

@Relax
export default class GrouponActivityList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      onDelete: Function;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop,
    onDelete: noop
  };

  render() {
    const {
      form,
      dataList,
      init,
      pageSize,
      pageNum,
      total,
      onDelete
    } = this.props.relaxProps;
    const { tabType } = form.toJS();
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="grouponActivityId"
        pagination={{
          pageSize,
          total,
          current: pageNum + 1,
          onChange: (currentPage, pageSize) => {
            init({ pageNum: currentPage - 1, pageSize: pageSize });
          }
        }}
      >
        <Column title="商品名称" dataIndex="goodsName" key="goodsName" />
          <Column
              title="拼团分类"
              key="grouponCateName"
              dataIndex="grouponCateName"
          />
        <Column title="拼团人数" dataIndex="grouponNum" key="grouponNum" />
        <Column title="拼团价" dataIndex="grouponPrice" key="grouponPrice" />

        <Column
          title="活动开始时间"
          dataIndex="startTime"
          key="startTime"
          render={(rowInfo) => {
            return (
              <div>
                <p>
                  {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="活动结束时间"
          dataIndex="endTime"
          key="endTime"
          render={(rowInfo) => {
            return (
              <div>
                <p>
                  {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="状态"
          key="tabType"
          render={(_rowInfo) => AUDIT_STATUS[tabType]}
        />
        {tabType == '4' && (
          <Column
            title="驳回原因"
            dataIndex="auditFailReason"
            key="auditFailReason"
          />
        )}
        <Column
          title="操作"
          key="option"
          render={(rowInfo) => {
            return (
              <div>
                  <AuthWrapper functionName="f_groupon-activity-detail">
                <Link to={`/groupon-detail/${rowInfo.grouponActivityId}`}>
                  查看
                </Link>
                  </AuthWrapper>
                  &nbsp;
                {tabType != '1' &&
                  tabType != '2' && (
                    <AuthWrapper functionName="f_groupon-activity-edit">
                    <Link to={`/groupon-edit/${rowInfo.grouponActivityId}`}>
                      编辑
                    </Link>
                    </AuthWrapper>
                  )}
                  &nbsp;
                {tabType != '1' &&
                  tabType != '2' && (
                    <AuthWrapper functionName="f_groupon-activity-del">
                    <Popconfirm
                      title="确定删除？"
                      onConfirm={() => onDelete(rowInfo.grouponActivityId)}
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
