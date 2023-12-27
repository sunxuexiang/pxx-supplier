import React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Spin, Pagination } from 'antd';
import moment from 'moment';
import { IList } from 'typings/globalType';
import { Const, noop } from 'qmkit';
const defaultImg = require('../img/none.png');

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      orderList: IList;
      onAudit: Function;
      apply: Function;
      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',
    // 当前页数
    currentPage: 'currentPage',
    //当前的订单列表
    orderList: 'orderList',
    // 申请退单
    apply: noop,
    init: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      currentPage,
      apply,
      init
    } = this.props.relaxProps;

    let orderList = this.props.relaxProps.orderList || [];

    return (
      <div className="ant-table-wrapper">
        <div className="ant-table ant-table-large ant-table-scroll-position-left">
          <div className="ant-table-content">
            <div className="ant-table-body">
              <table
                style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}
              >
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ width: '300' }}>商品</th>
                    <th style={{ width: '10%' }}>客户名称</th>
                    <th style={{ width: '15%' }}>收件人</th>
                    <th style={{ width: '10%' }}>
                      金额
                      <br />
                      数量
                    </th>
                    <th style={{ width: '10%' }}>发货状态</th>
                    <th style={{ width: '10%' }}>订单状态</th>
                    <th style={{ width: '10%' }}>发货仓</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>
                      付款状态
                    </th>
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {loading
                    ? this._renderLoading()
                    : this._renderContent(orderList, apply)}
                </tbody>
              </table>
            </div>
            {total == 0 ? (
              <div className="ant-table-placeholder">
                <span>
                  <i className="anticon anticon-frown-o" />
                  暂无数据
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {total > 0 ? (
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={(pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize: pageSize });
            }}
          />
        ) : null}
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={7}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(orderList, apply) {
    return orderList.map((v) => {
      const id = v.get('id');
      const tradePrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
      const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
      const num =
        v
          .get('tradeItems')
          .concat(gifts)
          .map((v) => v.get('num'))
          .reduce((a, b) => {
            a = a + b;
            return a;
          }, 0) || 0;
      const canReturnFlag = v.get('canReturnFlag');

      return (
        <>
          {canReturnFlag && (
            <tr className="ant-table-row  ant-table-row-level-0" key={id}>
              <td colSpan={8} style={{ padding: 0 }}>
                <table
                  className="ant-table-self"
                  style={{ border: '1px solid #ddd' }}
                >
                  <thead>
                    <tr>
                      <td colSpan={12} style={{ color: '#999' }}>
                        <div
                          style={{
                            marginTop: 12,
                            borderBottom: '1px solid #ddd',
                            height: 36
                          }}
                        >
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {id}
                          </span>
                          <span style={{ marginLeft: 60 }}>
                            下单时间：
                            {moment(
                              v.getIn(['tradeState', 'createTime'])
                            ).format(Const.TIME_FORMAT)}
                          </span>
                          <span style={{ marginRight: 20, float: 'right' }}>
                            {v.getIn(['tradeState', 'flowState']) != 'AUDIT' ? (
                              <a
                                href="javascript:void(0)"
                                onClick={() => {
                                  apply(id);
                                }}
                              >
                                申请
                              </a>
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: '1%' }} />
                      <td
                        style={{
                          textAlign: 'left',
                          width: '300',
                          padding: '16px 0'
                        }}
                      >
                        {/*商品图片*/}
                        {v
                          .get('tradeItems')
                          .concat(gifts)
                          .map((v, k) => {
                            if (k < 3) {
                              const imageSrc = v.get('pic')
                                ? v.get('pic')
                                : defaultImg;
                              return (
                                <img
                                  src={imageSrc}
                                  key={k}
                                  style={styles.imgItem}
                                />
                              );
                            } else if (k == 4) {
                              return <label>...</label>;
                            }
                          })}

                        {/*第4张特殊处理*/
                        //@ts-ignore
                        v.get('tradeItems').concat(gifts).size > 3 ? (
                          <div style={styles.imgBg}>
                            <img
                              //@ts-ignore
                              src={
                                v
                                  .get('tradeItems')
                                  .concat(gifts)
                                  .get(3)
                                  .get('pic')
                                  ? v
                                      .get('tradeItems')
                                      .concat(gifts)
                                      .get(3)
                                      .get('pic')
                                  : defaultImg
                              }
                              style={styles.imgFourth}
                            />
                            //@ts-ignore
                            <div style={styles.imgNum}>
                              共{v.get('tradeItems').concat(gifts).size}件
                            </div>
                          </div>
                        ) : null}
                      </td>
                      <td style={{ width: '10%' }}>
                        {/*客户名称*/}
                        {v.getIn(['buyer', 'name'])}
                      </td>
                      <td style={{ width: '15%' }}>
                        {/*收件人姓名*/}
                        收件人：{v.getIn(['consignee', 'name'])}
                        <br />
                        {/*收件人手机号码*/}
                        {v.getIn(['consignee', 'phone'])}
                      </td>
                      <td style={{ width: '10%' }}>
                        {tradePrice.toFixed(2)}
                        <br />（{num}箱)
                      </td>
                      {/*发货状态*/}
                      <td style={{ width: '10%' }}>
                        {
                          Const.deliverStatus[
                            v.getIn(['tradeState', 'deliverStatus'])
                          ]
                        }
                      </td>
                      {/*订单状态*/}
                      <td style={{ width: '10%' }}>
                        {Const.flowState[v.getIn(['tradeState', 'flowState'])]}
                      </td>
                      <td style={{ width: '10%' }}>长沙仓</td>
                      {/*支付状态*/}
                      <td
                        style={{
                          width: '10%',
                          textAlign: 'right',
                          paddingRight: 20
                        }}
                      >
                        {Const.payState[v.getIn(['tradeState', 'payState'])]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </>
      );
    });
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  }
} as any;
