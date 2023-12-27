import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, noop, AuthWrapper, Const } from 'qmkit';
const defaultImg = require('../img/none.png');
import Moment from 'moment';

declare type IList = List<any>;
const { Column } = DataGrid;

const isShowFunction = (status) => {
  if (status == '0') {
    return '否';
  } else if (status == '1') {
    return '是';
  } else {
    return '-';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      modal: Function;
      goodsEvaluateDetail: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    modal: noop,
    goodsEvaluateDetail: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      goodsEvaluateDetail
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        className="resetTable"
        rowKey="evaluateId"
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
          title="商品名称"
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          width={150}
          render={(goodsInfoName, rowData: any) => {
            return (
              <div style={styles.goodsName}>
                {/*/!*商品图片*!/*/}
                {rowData.goodsImg ? (
                  <img
                    src={rowData.goodsImg ? rowData.goodsImg : defaultImg}
                    style={styles.imgItem}
                  />
                ) : (
                  <img src={defaultImg} style={styles.imgItem} />
                )}
                {goodsInfoName ? goodsInfoName : '-'}
              </div>
            );
          }}
        />
        <Column
          title="订单号"
          key="orderNo"
          width={150}
          dataIndex="orderNo"
          render={(orderNo) => (orderNo ? orderNo : '-')}
        />
        <Column
          title="发表人"
          key="customerName,"
          dataIndex="customerName"
          width={120}
          render={(customerName, rowData) => {
            return (
              <div>
                {customerName}
                <br />
                {rowData['customerAccount']}
              </div>
            );
          }}
        />
        <Column
          title="商品评分"
          key="evaluateScore"
          dataIndex="evaluateScore"
          width={50}
          render={(evaluateScore) =>
            evaluateScore ? evaluateScore + '星' : '-'
          }
        />
        <Column
          title="评价内容"
          key="evaluateContent"
          dataIndex="evaluateContent"
          width={150}
          render={(evaluateContent) => {
            if (evaluateContent) {
              if (evaluateContent.length > 20) {
                return (
                  <span style={{ wordBreak: 'break-word' }}>
                    {evaluateContent.substring(0, 20) + '...'}
                  </span>
                );
              }
              return (
                <span style={{ wordBreak: 'break-word' }}>
                  {evaluateContent}
                </span>
              );
            }
            return '-';
          }}
        />
        <Column
          title="晒单"
          key="evaluateImageList"
          dataIndex="evaluateImageList"
          width={252}
          render={(evaluateImageList) => {
            let countFlag = false;
            return (
              <div style={styles.goodsImg}>
                {/*/!*商品图片*!/*/}
                {evaluateImageList
                  ? evaluateImageList.map(
                      (v, k) =>
                        k < 3 ? (
                          <img
                            src={v.artworkUrl ? v.artworkUrl : defaultImg}
                            key={k}
                            style={styles.imgItem}
                          />
                        ) : (
                          (countFlag = true)
                        )
                    )
                  : '-'}

                {countFlag && '...'}
              </div>
            );
          }}
        />
        <Column
          title="展示"
          key="isShow"
          dataIndex="isShow"
          render={(isShow) => (isShow ? isShowFunction(isShow) : '否')}
        />
        <Column
          title="发表时间"
          key="evaluateTime"
          dataIndex="evaluateTime"
          width={102}
          render={(evaluateTime) =>
            evaluateTime
              ? Moment(evaluateTime)
                  .format(Const.TIME_FORMAT)
                  .toString()
              : ''
          }
        />

        <DataGrid.Column
          title="操作"
          key="evaluateId"
          dataIndex="evaluateId"
          className="operation-th"
          render={(evaluateId) => {
            return (
              <div className="operation-th">
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <span
                    style={styles.see}
                    onClick={() => goodsEvaluateDetail(evaluateId, true)}
                  >
                    查看
                  </span>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  /**
   * 查看
   */
  // _showDetailModal = (evaluateId) => {
  //   const { modal,goodsEvaluateDetail } = this.props.relaxProps;
  //  goodsEvaluateDetail(evaluateId);
  //   //查询
  //   modal(true);
  // };
}

const styles = {
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff'
  },
  goodsName: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center'
  },
  goodsImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  see: {
    color: '#F56C1D',
    cursor: 'pointer'
  }
} as any;
