import * as React from 'react';
import { Button, InputNumber, Form } from 'antd';
import { AuthWrapper, DataGrid, ValidConst } from 'qmkit';
const { Column } = DataGrid;
const FormItem = Form.Item;

import CouponsModal from './coupons-modal';

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

/**
 * 选择优惠券组件
 */
export default class ChooseCoupons extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // 弹出框可见性
      modalVisible: false
    };
  }

  render() {
    const { coupons, invalidCoupons, form, type } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Button
          type="primary"
          icon="plus"
          onClick={() => this.changeModalVisible(true)}
        >
          选择优惠券
        </Button>
        &nbsp;&nbsp;
        <span style={{ color: '#999' }}>
          {'最多可选10张' + (type == 3 ? '，选择多张时成组发放' : '')}
        </span>
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.couponId}
            dataSource={coupons}
            pagination={false}
            rowClassName={(record) => {
              if (invalidCoupons.includes(record.couponId)) {
                return 'red';
              }
              return '';
            }}
          >
            <Column
              title="优惠券名称"
              dataIndex="couponName"
              key="couponName"
              width="15%"
            />

            <Column
              title="优惠券面值（元）"
              dataIndex="denominationStr"
              key="denominationStr"
              width="15%"
            />

            <Column
              title="有效期"
              dataIndex="validity"
              key="validity"
              width="30%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
            />

            <Column
              title={
                <div style={{ minWidth: 140 }}>
                  <p>
                    <span style={{ color: 'red' }}>*</span>
                    {type == 0 ? '总张数' : '每组赠送张数'}
                  </p>
                  <p style={{ color: '#999' }}>
                    (1-10张)
                    {/*{type == 0 ? '（1-999999999张）' : '(1-10张)'}*/}
                  </p>
                </div>
              }
              key="totalCount"
              dataIndex="totalCount"
              width="20%"
              render={(value, rowData, index) => {
                const message = '请输入1-10的整数';
                // type == 0 ? '请输入1-999999999的整数' : '请输入1-10的整数';
                return (
                  <FormItem>
                    {getFieldDecorator(
                      'couponId_' + (rowData as any).couponId,
                      {
                        rules: [
                          {
                            pattern: ValidConst.noZeroNineNumber,
                            message: message
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (!value) {
                                callback('请填写赠送张数');
                                return;
                              }
                              if (value > 10) {
                                callback('请输入1-10的整数');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: (val) => {
                          this.props.onChangeCouponTotalCount(index, val);
                        },
                        initialValue: value
                      }
                    )(<InputNumber min={1} max={10} />)}
                  </FormItem>
                );
              }}
            />

            <Column
              title="操作"
              key="operate"
              width="10%"
              render={(row) => {
                return (
                  <div>
                    <AuthWrapper functionName={'f_coupon_detail'}>
                      <a
                        style={{ textDecoration: 'none' }}
                        href={`/coupon-detail/${row.couponId}`}
                        target="_blank"
                      >
                        详情
                      </a>
                    </AuthWrapper>
                    &nbsp;&nbsp;
                    <a onClick={() => this.props.onDelCoupon(row.couponId)}>
                      删除
                    </a>
                  </div>
                );
              }}
            />
          </DataGrid>
        </TableRow>
        {this.state.modalVisible && (
          <CouponsModal
            selectedRows={coupons}
            onOk={(coupons) => {
              this.changeModalVisible(false);
              this.props.onChosenCoupons(coupons);
            }}
            onCancel={() => this.changeModalVisible(false)}
          />
        )}
      </div>
    );
  }

  /**
   * 设置优惠券弹窗可见性
   */
  changeModalVisible = (flag) => {
    this.setState({
      modalVisible: flag
    });
  };
}
