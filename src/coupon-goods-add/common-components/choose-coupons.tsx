import * as React from 'react';
import { Button, Form, InputNumber, Input } from 'antd';
import { AuthWrapper, DataGrid, ValidConst } from 'qmkit';
import CouponsModal from './coupons-modal';

import styled from 'styled-components';
import { listenerCount } from 'stream';
import { nextTick } from 'process';

const { Column } = DataGrid;
const FormItem = Form.Item;

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;
const HasError = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .ant-select-selection {
    border-color: #d9d9d9 !important;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-select-selection .ant-select-arrow {
    color: #d9d9d9;
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
      modalVisible: false,
      isFullCount: props.isFullCount ? props.isFullCount : true,
      isisFullCount: props.isisFullCount ? props.isisFullCount : false,
      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [],
      wareId: props.wareId ? props.wareId : null,
      coupons: props.coupons ? props.coupons : []
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, 'fullGiftLevelListfullGiftLevelList123');

    nextTick(() => {
      this.setState({
        fullGiftLevelList: nextProps.fullGiftLevelList,
        isFullCount: nextProps.isFullCount,
        isisFullCount: nextProps.isisFullCount,
        wareId: nextProps.wareId ? nextProps.wareId : null,
        coupons: nextProps.coupons ? nextProps.coupons : []
      });
    });
  }

  render() {
    const { invalidCoupons, form, type } = this.props;
    const { isFullCount, fullGiftLevelList, isisFullCount, wareId, coupons } =
      this.state;
    console.log('====================================');
    console.log(
      coupons,
      fullGiftLevelList,
      'fullGiftLevelList1231111',
      isisFullCount
    );
    console.log('====================================');
    const { getFieldDecorator } = form;
    return (
      <div>
        {fullGiftLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.giftLevelId}>
              <HasError>
                {isisFullCount == false && (
                  <React.Fragment>
                    <span>满&nbsp;</span>
                    <FormItem>
                      {getFieldDecorator(`level_rule_value_${index}`, {
                        rules: [
                          { required: true, message: '必须输入规则' },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!isFullCount) {
                                  if (
                                    !ValidConst.price.test(value) ||
                                    !(value < 100000000 && value > 0)
                                  ) {
                                    callback('请输入0.01-99999999.99间的数字');
                                  }
                                } else {
                                  if (
                                    !ValidConst.noZeroNumber.test(value) ||
                                    !(value < 10000 && value > 0)
                                  ) {
                                    callback('请输入1-9999间的整数');
                                  }
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: isFullCount
                          ? level.fullAmount
                          : level.fullCount
                      })(
                        <Input
                          style={{ width: 200 }}
                          placeholder={
                            isFullCount
                              ? '0.01-99999999.99间的数字'
                              : '1-9999间的数字'
                          }
                          onChange={(e) => {
                            this.ruleValueChange(index, e.target.value);
                          }}
                        />
                      )}
                    </FormItem>
                    <span>
                      &nbsp;{isFullCount ? '元' : '件'}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  </React.Fragment>
                )}
                <Button
                  type="primary"
                  icon="plus"
                  onClick={(e) => {
                    console.log('打开', level.key);
                    e.stopPropagation();
                    this.changeModalVisible(true, index);
                  }}
                >
                  添加优惠券
                </Button>
                {index > 0 && (
                  <a
                    style={{ marginLeft: '20px' }}
                    onClick={() => this.deleteLevels(index)}
                  >
                    删除
                  </a>
                )}
              </HasError>
              <TableRow>
                <DataGrid
                  scroll={{ y: 500 }}
                  size="small"
                  rowKey={(record) => level.couponId}
                  // dataSource={coupons}
                  // dataSource={level.fullGiftDetailList}
                  dataSource={
                    isisFullCount ? coupons : level.fullGiftDetailList
                  }
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
                    title="适用区域"
                    dataIndex="wareName"
                    key="wareName"
                    width="15%"
                  />

                  <Column
                    title={
                      <div style={{ minWidth: 140 }}>
                        <p>
                          <span style={{ color: 'red' }}>*</span>{' '}
                          {type == 0 ? '总张数' : '每组赠送张数'}
                        </p>
                        <p style={{ color: '#999' }}>
                          {' '}
                          {type == 0 ? '（1-999999999张）' : '(1-10张)'}
                        </p>
                      </div>
                    }
                    key="totalCount"
                    dataIndex="totalCount"
                    width="20%"
                    render={(value, rowData, index) => {
                      const message =
                        type == 0
                          ? '请输入1-999999999的整数'
                          : '请输入1-10的整数';
                      return (
                        <FormItem>
                          {getFieldDecorator(
                            'couponId_' +
                              (rowData as any).couponId +
                              this.makeRandom(),
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入优惠券的的数量'
                                },
                                {
                                  pattern: ValidConst.noZeroNineNumber,
                                  message: message
                                },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (type != 0 && value > 10) {
                                      callback('请输入1-10的整数');
                                    }
                                    callback();
                                  }
                                }
                              ],
                              onChange: (val) => {
                                // this.onChangeCouponTotalCount(index, val, level.key);
                                this.props.onChangeCouponTotalCount(
                                  index,
                                  val,
                                  level.key
                                );
                              },
                              initialValue: value
                            }
                          )(<InputNumber min={1} max={999999999} />)}
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
                          <a
                            onClick={() =>
                              this.props.onDelCoupon(row.couponId, index)
                            }
                          >
                            删除
                          </a>
                        </div>
                      );
                    }}
                  />
                </DataGrid>
              </TableRow>
              {level.modalVisible && (
                <CouponsModal
                  wareId={wareId}
                  selectedRows={
                    isisFullCount ? coupons : level.fullGiftDetailList
                  }
                  keysa={level.key}
                  onOk={(coupons, key) => {
                    this.changeModalVisible(false, index);
                    const idList = [];
                    let arrCoupon = [];
                    level.fullGiftDetailList.forEach((iv, index) => {
                      idList.push(iv.couponId);
                    });
                    coupons.forEach((isv, index) => {
                      if (idList.indexOf(isv.couponId) === -1) {
                        arrCoupon.push(isv);
                      }
                    });
                    console.log(
                      coupons,
                      'couponscouponscouponscoupons',
                      key,
                      arrCoupon
                    );
                    this.changecouponList(key, arrCoupon);
                    this.props.onChosenCoupons(coupons);
                  }}
                  onCancel={() => this.changeModalVisible(false, index)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
  onChangeCouponTotalCount(index, totalCount, keys) {
    const { fullGiftLevelList } = this.state;
    fullGiftLevelList.forEach((element) => {
      if (element.key == keys) {
        console.log(element, 'element.key1231');
        if (element.fullGiftDetailList[index]) {
          element.fullGiftDetailList[index].totalCount = totalCount;
        }
      }
    });
    console.log(fullGiftLevelList, 'shuaklsnfsg', index, totalCount, keys);

    this.setState({ fullGiftLevelList });
  }

  changecouponList(key, coupons) {
    let { fullGiftLevelList } = this.state;
    console.log(fullGiftLevelList, '12322222222');

    fullGiftLevelList.forEach((element) => {
      if (key == element.key) {
        element.fullGiftDetailList.push(...coupons);
      }
    });
    this.setState({
      coupons: coupons
    });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  }

  /**
   * 删除等级
   * @param index
   */
  deleteLevels = (index) => {
    let { fullGiftLevelList } = this.state;
    //重置表单的值
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullGiftLevelList.length - 1}`]: null
    });
    fullGiftLevelList.splice(index, 1);
    this.setState({ fullGiftLevelList: fullGiftLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 整个表单内容变化方法
   * @param index
   * @param props
   * @param value
   */
  onChange = (index, props, value) => {
    const { fullGiftLevelList } = this.state;
    fullGiftLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullGiftLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullGiftLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullGiftLevelList: fullGiftLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 规则变更
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.state;
    this.onChange(index, isFullCount ? 'fullAmount' : 'fullCount', value);
  };
  /**
   * 设置优惠券弹窗可见性
   */
  changeModalVisible = (flag, index) => {
    const { fullGiftLevelList } = this.state;
    fullGiftLevelList[index].modalVisible = flag;
    this.setState({ fullGiftLevelList: fullGiftLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };
}
