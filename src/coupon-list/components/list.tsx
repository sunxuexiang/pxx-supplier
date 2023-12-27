import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, history } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';
const { Column } = DataGrid;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      deleteCoupon: Function;
      init: Function;
      copyCoupon: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponList,
      deleteCoupon,
      init,
      copyCoupon
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.couponId}
        dataSource={couponList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column
          title="优惠券名称"
          dataIndex="couponName"
          key="couponName"
        />
        <DataGrid.Column
          title="面值"
          dataIndex="denominationStr"
          key="denominationStr"
        />
        <DataGrid.Column title="有效期" dataIndex="validity" key="validity" />
        <DataGrid.Column
          title="优惠券分类"
          dataIndex="cateNamesStr"
          key="cateNamesStr"
          render={(value) =>
            value.length > 12 ? `${value.substring(0, 12)}...` : value
          }
        />
        <DataGrid.Column
          title="提示文案"
          dataIndex="prompt"
          key="prompt"
          render={(value) => (value && value.length > 0 ? value : '-')}
        />
        <DataGrid.Column
          title="优惠券状态"
          dataIndex="couponStatusStr"
          key="couponStatusStr"
        />
        <Column
          title="适用区域"
          width="10%"
          key="wareName"
          dataIndex="wareName"
        />
        <DataGrid.Column
          title="操作"
          key="operate"
          className={'operation-th'}
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <Link
                    to={`/coupon-detail/${(record as any).couponId}`}
                    style={{ marginRight: 10 }}
                  >
                    查看
                  </Link>
                </AuthWrapper>
                <AuthWrapper functionName={'f_coupon_editor'}>
                  {text == 1 && (
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: `/coupon-edit/${(record as any).couponId}`,
                          state: {
                            couponType: '1'
                          }
                        })
                      }
                    >
                      编辑 &nbsp;&nbsp;
                    </a>
                  )}

                  <a
                    href="javascript:void(0);"
                    onClick={() => {
                      copyCoupon((record as any).couponId);
                    }}
                  >
                    复制
                  </a>

                  {text == 1 && (
                    <Popconfirm
                      title="确定删除该优惠券？"
                      onConfirm={() => deleteCoupon((record as any).couponId)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="javascript:void(0);">删除</a>
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
