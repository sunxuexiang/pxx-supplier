import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

type TList = List<IMap>;

const { Column } = DataGrid;

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
  8: '订单满折'
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
    onTermination: noop
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
      onTermination
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="marketingId"
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
          title="套餐名称"
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
          title="商品数量"
          // key="suitBuyNum"
          width="10%"
          // dataIndex="suitBuyNum"
          render={(suitBuyNum) => {
            return <div className="line-two">{suitBuyNum.marketingSuitDetialList.length}</div>;
          }}
        />

        {/* <Column
          title="套餐价格"
          key="suitPrice"
          dataIndex="suitPrice"
          width="20%"
          render={(suitPrice) => {
            return (
              <div className="line-two">{!suitPrice ? '0.00' : suitPrice}</div>
            );
          }}
        /> */}

        <Column
          title="优惠标签"
          width="10%"
          key="suitCouponLabel"
          dataIndex="suitCouponLabel"
          render={(suitCouponLabel) => {
            return <div>{suitCouponLabel}</div>;
          }}
        />

        <Column
          title="活动状态"
          width="10%"
          key="marketingStatus"
          render={(rowInfo) => {
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
                    onClick={() =>
                      history.push({
                        pathname: `/goodmdlist/?${rowInfo['marketingId']}`
                      })
                    }
                  >
                    查看
                  </a>
                </AuthWrapper>
                <AuthWrapper functionName="f_marketing_operate">
                  {rowInfo['marketingStatus'] == 3 && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0)"
                      onClick={() =>
                        history.push({
                          pathname: `/goodmadd/${rowInfo['marketingId']}`
                        })
                      }
                    >
                      编辑
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 2 && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0);"
                      onClick={() => onStart(rowInfo['marketingId'])}
                    >
                      开启
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 1 && (
                    <a
                      style={{ marginRight: 10 }}
                      href="javascript:void(0);"
                      onClick={() => onPause(rowInfo['marketingId'])}
                    >
                      暂停
                    </a>
                  )}
                  {/* 非终止状态-都显示终止按钮 */}
                  {!(
                    rowInfo['marketingStatus'] == 4 ||
                    rowInfo['terminationFlag'] == 1
                  ) && (
                    <Popconfirm
                      title="是否提前终止此活动，终止后无法恢复？"
                      onConfirm={() => onTermination(rowInfo['marketingId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }} href="javascript:void(0);">
                        终止
                      </a>
                    </Popconfirm>
                  )}
                  {rowInfo['marketingStatus'] == 3 && (
                    <Popconfirm
                      title="确定删除该活动？"
                      onConfirm={() => onDelete(rowInfo['marketingId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }} href="javascript:void(0);">
                        删除
                      </a>
                    </Popconfirm>
                  )}
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
