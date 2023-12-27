import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { message, Popconfirm, Tooltip,Table } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

type TList = List<IMap>;

const { Column } = Table;

//默认每页展示的数量
const SUB_TYPE = {
  0: '满金额减',
  1: '满数量减',
  2: '满金额折',
  3: '满数量折',
  4: '满金额赠',
  5: '满数量赠',
  6: '订单满赠',
  7: '订单满减',
  8: '订单满折',
  9: '套装购买'
};

//默认每页展示的数量
const MARKETING_STATUS = {
  0: '全部',
  1: '进行中',
  2: '暂停中',
  3: '未开始',
  4: '已结束'
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
      form: any;
      onPause: Function;
      customerLevels: TList;
      onStart: Function;
      onTermination: Function;
      checkedIds:IList;
      onSelect:Function;
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
    form: 'form',
    onPause: noop,
    customerLevels: ['customerLevels'],
    onStart: noop,
    onTermination: noop,
    checkedIds:'checkedIds',
    onSelect:noop
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
      customerLevels,
      onPause,
      onStart,
      onTermination,
      form,
      checkedIds,
      onSelect
    } = this.props.relaxProps;
    const type = 1;
    return (
      <DataGrid
        loading={loading}
        rowKey="marketingId"
        pagination={{
          current: currentPage,
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
          key="marketingName"
          dataIndex="marketingName"
          render={(marketingName) => {
            return marketingName ? (
              <div className="line-two">{marketingName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />

        <Column
          title="活动类型"
          key="subType"
          width="10%"
          dataIndex="subType"
          render={(subType) => {
            return SUB_TYPE[subType];
          }}
        />

        <Column
          title={
            <p>
              开始
              <br />
              结束时间
            </p>
          }
          width="20%"
          render={(rowData) => {
            return (
              <div>
                {moment(rowData['beginTime'])
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
          title="目标客户"
          width="10%"
          key="joinLevel"
          dataIndex="joinLevel"
          render={(joinLevel) => {
            if (joinLevel == '-1') {
              return '全平台客户';
            } else if (joinLevel == '0') {
              return '全部等级';
            } else if (joinLevel != '') {
              return (
                <Tooltip
                  title={joinLevel
                    .split(',')
                    .map((info) =>
                      customerLevels
                        .filter((v) => v.get('customerLevelId') == info)
                        .getIn([0, 'customerLevelName'])
                    )
                    .filter((v) => v)
                    .join('，')}
                >
                  <div className="line-two">
                    {joinLevel
                      .split(',')
                      .map((info) =>
                        customerLevels
                          .filter((v) => v.get('customerLevelId') == info)
                          .getIn([0, 'customerLevelName'])
                      )
                      .filter((v) => v)
                      .join('，')}
                  </div>
                </Tooltip>
              );
            }
          }}
        />

        <Column
          title="活动状态"
          width="10%"
          key="marketingStatus"
          render={(rowInfo) => {
            if(rowInfo['isDraft']){
              return '草稿'
            }
            if (
              rowInfo['marketingStatus'] == 4 &&
              rowInfo['terminationFlag'] == 1
            ) {
              return <span>已终止</span>;
            } else {
              return (
                <span>{MARKETING_STATUS[rowInfo['marketingStatus']]}</span>
              );
            }
          }}
        />
        <Column
          title="适用区域"
          width="10%"
          dataIndex="wareName"
          key="wareName"
        />

        <Column
          title="操作"
          width="20%"
          className={'operation-th'}
          render={(rowInfo) => {
            let url = '';
            if (
              rowInfo['subType'] === 0 ||
              rowInfo['subType'] === 1 ||
              rowInfo['subType'] === 7
            ) {
              url = `/marketing-full-reduction/${rowInfo['marketingId']}`;
            } else if (
              rowInfo['subType'] === 2 ||
              rowInfo['subType'] === 3 ||
              rowInfo['subType'] === 8
            ) {
              url = `/marketing-full-discount/${rowInfo['marketingId']}`;
            } else if (
              rowInfo['subType'] === 4 ||
              rowInfo['subType'] === 5 ||
              rowInfo['subType'] === 6
            ) {
              url = `/marketing-full-gift/${rowInfo['marketingId']}`;
            }

            return (
              <div className="operation-box">
                <AuthWrapper functionName="f_marketing_view">
                  <a
                    style={{ marginRight: 10 }}
                    href="javascript:void(0)"
                    onClick={() => {
                      console.log();
                      if (rowInfo['subType'] == 9) {
                        history.push({
                          pathname: `/goodmdlist/?${rowInfo['marketingId']}`
                        });
                      } else {
                        history.push({
                          pathname: `/marketing-details/${rowInfo['marketingId']
                            }/${currentPage > 0 ? currentPage - 1 : currentPage}`
                        });
                      }
                    }}
                  >
                    查看
                  </a>
                </AuthWrapper>
                <AuthWrapper functionName="f_marketing_operate">
                  <a
                    style={{ marginRight: 10 }}
                    href="javascript:void(0)"
                    onClick={() => {
                      if (rowInfo['subType'] != 9) {
                        history.push({
                          pathname: url + '/' + type
                        });
                      } else {
                        history.push({
                          pathname: `/goodmadd/${rowInfo['marketingId']}`
                        });
                      }
                    }}
                  >
                    复制
                  </a>
                  {rowInfo['marketingStatus'] == 3 && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0)"
                      onClick={() => {
                        if (rowInfo['subType'] != 9) {
                          history.push({
                            pathname: url
                          });
                        } else {
                          history.push({
                            pathname: `/goodmadd/${rowInfo['marketingId']}`
                          });
                        }
                      }}
                    >
                      编辑
                    </a>
                  )}
                  {/* {(rowInfo['marketingStatus'] == 2&&rowInfo['isDraft']==0) && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0);"
                      onClick={() => onStart(rowInfo['marketingId'])}
                    >
                      开启
                    </a>
                  )} */}
                  {/* {(rowInfo['marketingStatus'] == 1&&rowInfo['isDraft']==0) && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0);"
                      onClick={() => onPause(rowInfo['marketingId'])}
                    >
                      暂停
                    </a>
                  )} */}
                  {rowInfo['marketingStatus'] == 1 ? (
                    <a style={{ marginRight: 10 }}
                      onClick={() => {
                        console.log();
                        if (rowInfo['subType'] == 9) {
                          message.error('套餐活动进行中不能编辑')
                        } else {
                          history.push({
                            pathname: `/marketing-details/${rowInfo['marketingId']
                              }/${currentPage > 0 ? currentPage - 1 : currentPage}/9`
                          });
                        }
                      }}
                      href="javascript:void(0);">
                      编辑
                    </a>
                  ):null}
                  {/* 非终止状态-都显示终止按钮 */}
                  {
                    rowInfo['marketingStatus'] == 1&&rowInfo['isDraft']==0? (
                      <Popconfirm
                        title={<div>终止后活动将结束，终止后活动将无法<div>再次开启，确认后将终止成功！</div></div>}
                        onConfirm={() => onTermination(rowInfo['marketingId'])}
                        okText="确定"
                        cancelText="取消"
                      >
                        <a style={{ marginRight: 10 }} href="javascript:void(0);"> 终止 </a>
                      </Popconfirm>
                    ):null}
                  {(rowInfo['marketingStatus'] == 3||rowInfo['isDraft'])? (
                    <Popconfirm
                      title="删除后不可恢复，请谨慎操作！"
                      onConfirm={() => onDelete(rowInfo['marketingId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }} href="javascript:void(0);">
                        删除
                      </a>
                    </Popconfirm>
                  ):null}
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
