import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { message, Popconfirm, Tooltip, Table } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

type TList = List<IMap>;

const { Column } = Table;

const PAUSEFLAG_STATUS = {
  1: '未开始',
  2: '进行中',
  3: '已结束',
  4: '已终止'
};

@withRouter
@Relax
export default class MarketingList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onDelete: Function;
      init: Function;
      onTermination: Function;
      checkedIds: IList;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onDelete: noop,
    init: noop,
    onTermination: noop,
    checkedIds: 'checkedIds',
    onSelect: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      onDelete,
      onTermination,
      checkedIds,
      onSelect
    } = this.props.relaxProps;
    const type = 1;
    return (
      <DataGrid
        loading={loading}
        rowKey="activityId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '40', '60', '80', '100'],
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          },
          onShowSizeChange: (pageNum, pageSize) => {
            init({ pageNum: 0, pageSize });
          }
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="活动名称"
          width="20%"
          key="activityName"
          dataIndex="activityName"
          render={(activityName) => {
            return activityName ? (
              <div className="line-two">{activityName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />

        <Column
          title="活动类型"
          key="subType"
          width="15%"
          dataIndex="subType"
          render={(subType) => {
            return '指定商品返鲸币';
          }}
        />

        <Column
          title={<p>开始/结束时间</p>}
          width="30%"
          render={(rowData) => {
            return (
              <div>
                {moment(rowData['startTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
                <br />
                {moment(rowData['endTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </div>
            );
          }}
        />

        <Column
          title="活动状态"
          width="15%"
          key="pauseFlag"
          render={(rowInfo) => {
            return <span>{PAUSEFLAG_STATUS[rowInfo['pauseFlag']]}</span>;
          }}
        />

        <Column
          title="操作"
          width="20%"
          className={'operation-th'}
          render={(rowInfo) => {
            return (
              <div className="operation-box">
                <AuthWrapper functionName="f_jinbi_return_view">
                  <a
                    style={{ marginRight: 10 }}
                    href="javascript:void(0)"
                    onClick={() => {
                      history.push({
                        pathname: `/jinbi-return-details/${
                          rowInfo['activityId']
                        }/${currentPage > 0 ? currentPage - 1 : currentPage}`
                      });
                    }}
                  >
                    查看
                  </a>
                </AuthWrapper>

                <AuthWrapper functionName="f_jinbi_return_operate">
                  {(rowInfo['pauseFlag'] === 1 ||
                    rowInfo['pauseFlag'] === 2) && (
                    <a
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        history.push({
                          pathname: `/jinbi-return-details/${
                            rowInfo['activityId']
                          }/${
                            currentPage > 0 ? currentPage - 1 : currentPage
                          }/9`
                        });
                      }}
                      href="javascript:void(0);"
                    >
                      编辑
                    </a>
                  )}
                  {/* 进行中状态-显示终止按钮 */}
                  {rowInfo['pauseFlag'] == 2 && (
                    <Popconfirm
                      title={
                        <div>
                          终止后活动将结束，终止后活动将无法
                          <div>再次开启，确认后将终止成功！</div>
                        </div>
                      }
                      onConfirm={() => onTermination(rowInfo['activityId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }} href="javascript:void(0);">
                        {' '}
                        终止{' '}
                      </a>
                    </Popconfirm>
                  )}
                  {rowInfo['pauseFlag'] === 1 ? (
                    <Popconfirm
                      title="删除后不可恢复，请谨慎操作！"
                      onConfirm={() => onDelete(rowInfo['activityId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }} href="javascript:void(0);">
                        删除
                      </a>
                    </Popconfirm>
                  ) : null}
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
