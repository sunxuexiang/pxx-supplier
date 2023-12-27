import * as React from 'react';
import { Relax } from 'plume2';
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Form,
  InputNumber,
  Checkbox
} from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, ValidConst } from 'qmkit';

const { Column } = Table;
const FormItem = Form.Item;
const Search = Input.Search;

@Relax
export default class UserPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      userList: IList;
      userPrice: IMap;
      editUserPriceItem: Function;
      editUserPrice: Function;
      deleteUserPrice: Function;
      updateUserPriceForm: Function;
      searchUserList: Function;
      //客户起订量同步
      userCountChecked: boolean;
      userCountDisable: boolean;
      updateUserCountChecked: Function;
      synchUserCount: Function;
      //客户限订量同步
      userMaxCountChecked: boolean;
      userMaxCountDisable: boolean;
      updateUserMaxCountChecked: Function;
      synchUserMaxCount: Function;
    };
  };

  static relaxProps = {
    // 用户列表
    userList: 'userList',
    // 用户价格Map
    userPrice: 'userPrice',
    // 修改用户价格单个属性
    editUserPriceItem: noop,
    // 修改用户价格
    editUserPrice: noop,
    // 删除级别价
    deleteUserPrice: noop,
    updateUserPriceForm: noop,
    //搜索用户
    searchUserList: noop,
    //客户起订量同步
    userCountChecked: 'userCountChecked',
    userCountDisable: 'userCountDisable',
    updateUserCountChecked: noop,
    synchUserCount: noop,
    //客户起订量同步
    userMaxCountChecked: 'userMaxCountChecked',
    userMaxCountDisable: 'userMaxCountDisable',
    updateUserMaxCountChecked: noop,
    synchUserMaxCount: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(UserPriceForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateUserPriceForm } = relaxProps;
    return (
      <WrapperForm
        ref={(form) => updateUserPriceForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class UserPriceForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      userList,
      userPrice,
      userCountChecked,
      userCountDisable,
      userMaxCountChecked,
      userMaxCountDisable
    } = this.props.relaxProps;
    const userPriceData = userPrice
      .valueSeq()
      .toList()
      .toJS();
    return (
      <div style={{ paddingTop: 20 }}>
        <Row>
          <Col span={4}>
            <div style={{ padding: 10, backgroundColor: '#f3f3f3' }}>
              <Search
                placeholder=" 请输入客户名"
                onChange={this._searchUserList.bind(this)}
                // onSearch={this._searchUserList.bind(this)}
              />
              {/*用户table*/}
              <div style={{ height: 300, overflowY: 'scroll' }}>
                <Table
                  rowClassName={() => {
                    return 'boxsite';
                  }}
                  dataSource={userList.toJS()}
                  pagination={false}
                  showHeader={false}
                  rowKey="customerId"
                >
                  <Column
                    key="customerName"
                    render={(rowInfo) => {
                      const checkedColor = userPrice.get(rowInfo.customerId)
                        ? '#F56C1D'
                        : '';
                      return (
                        <Button
                          style={{
                            color: checkedColor,
                            borderColor: checkedColor
                          }}
                          onClick={this._editUserPrice.bind(
                            this,
                            rowInfo.customerId,
                            rowInfo.customerName,
                            rowInfo.customerLevelName
                          )}
                        >
                          {rowInfo.customerName}
                        </Button>
                      );
                    }}
                  />
                </Table>
              </div>
            </div>
          </Col>
          {/*用户价格table*/}
          <Col span={20}>
            <div>
              <Table
                dataSource={userPriceData}
                scroll={{ y: 298 }}
                pagination={false}
                rowKey="customerId"
              >
                <Column
                  title="客户名称"
                  key="userName"
                  dataIndex="userName"
                  width="30%"
                />
                <Column
                  title="客户级别"
                  key="userLevelName"
                  dataIndex="userLevelName"
                  width="10%"
                />
                <Column
                  title={
                    <div>
                      <span
                        style={{
                          color: 'red',
                          fontFamily: 'SimSun',
                          marginRight: '4px',
                          fontSize: '12px'
                        }}
                      >
                        *
                      </span>订货价
                    </div>
                  }
                  key="price"
                  width={80}
                  render={(rowInfo) => (
                    <FormItem style={{ marginBottom: '0px' }}>
                      {getFieldDecorator('userprice_' + rowInfo.customerId, {
                        rules: [
                          {
                            required: true,
                            message: '请填写价格'
                          },
                          {
                            pattern: ValidConst.zeroPrice,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            type: 'number',
                            max: 9999999.99,
                            message: '最大值为9999999.99',
                            transform: function(value) {
                              return isNaN(parseFloat(value))
                                ? 0
                                : parseFloat(value);
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(
                          this,
                          rowInfo.customerId,
                          'price'
                        ),
                        initialValue: rowInfo.price
                      })(<Input />)}
                    </FormItem>
                  )}
                />
                <Column
                  title={
                    <div>
                      起订量<br />{' '}
                      <Checkbox
                        checked={userCountChecked}
                        onChange={this._synchUserCount}
                      >
                        全部相同
                      </Checkbox>
                    </div>
                  }
                  key="count"
                  width={80}
                  render={(rowInfo, _l, index) => (
                    <FormItem style={{ marginBottom: '0px' }}>
                      {getFieldDecorator('usercount_' + rowInfo.customerId, {
                        rules: [
                          {
                            pattern: ValidConst.number,
                            message: '0或正整数'
                          },
                          {
                            customer: rowInfo.customerId,
                            validator: (rule, value, callback) => {
                              let count = userPrice.get(rule.customer)
                                ? userPrice.get(rule.customer).get('maxCount')
                                : '';

                              // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                              const fieldsValue = this.props.form.getFieldsValue();
                              // 同步值
                              let levelPriceFields = {};
                              Object.getOwnPropertyNames(fieldsValue).forEach(
                                (field) => {
                                  // 级别价的表单字段以levelcount_开头
                                  if (
                                    field ===
                                    'usermaxcount_' + rule.customer
                                  ) {
                                    levelPriceFields[field] = count;
                                  }
                                }
                              );
                              // update
                              this.props.form.setFieldsValue(levelPriceFields);

                              if (
                                count != null &&
                                count != '' &&
                                value != '' &&
                                value != null &&
                                value > count
                              ) {
                                callback('不可大于限订量');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(
                          this,
                          rowInfo.customerId,
                          'count'
                        ),
                        initialValue: rowInfo.count
                      })(
                        <InputNumber disabled={index > 0 && userCountDisable} />
                      )}
                    </FormItem>
                  )}
                />
                <Column
                  title={
                    <div>
                      限订量<br />{' '}
                      <Checkbox
                        checked={userMaxCountChecked}
                        onChange={this._synchUserMaxCount}
                      >
                        全部相同
                      </Checkbox>
                    </div>
                  }
                  key="maxCount"
                  width={80}
                  render={(rowInfo, _l, index) => (
                    <FormItem style={{ marginBottom: '0px' }}>
                      {getFieldDecorator('usermaxcount_' + rowInfo.customerId, {
                        rules: [
                          {
                            pattern: ValidConst.number,
                            message: '正整数'
                          },
                          {
                            customer: rowInfo.customerId,
                            validator: (rule, value, callback) => {
                              let count = userPrice.get(rule.customer)
                                ? userPrice.get(rule.customer).get('count')
                                : '';

                              // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                              const fieldsValue = this.props.form.getFieldsValue();
                              // 同步值
                              let levelPriceFields = {};
                              Object.getOwnPropertyNames(fieldsValue).forEach(
                                (field) => {
                                  // 级别价的表单字段以levelcount_开头
                                  if (field === 'usercount_' + rule.customer) {
                                    levelPriceFields[field] = count;
                                  }
                                }
                              );
                              // update
                              this.props.form.setFieldsValue(levelPriceFields);

                              if (
                                count != null &&
                                count != '' &&
                                value != '' &&
                                value != null &&
                                value < count
                              ) {
                                callback('不可小于起订量');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(
                          this,
                          rowInfo.customerId,
                          'maxCount'
                        ),
                        initialValue: rowInfo.maxCount
                      })(
                        <InputNumber
                          min={1}
                          disabled={index > 0 && userMaxCountDisable}
                        />
                      )}
                    </FormItem>
                  )}
                />
                <Column
                  title="操作"
                  key="opt"
                  width={80}
                  render={(rowInfo) => {
                    return (
                      <Button
                        onClick={this._deleteUserPrice.bind(
                          this,
                          rowInfo.customerId
                        )}
                      >
                        删除
                      </Button>
                    );
                  }}
                />
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * 修改用户价格
   */
  _editUserPrice = (
    userId: string,
    userName: string,
    userLevelName: string
  ) => {
    const { editUserPrice } = this.props.relaxProps;
    editUserPrice(userId, userName, userLevelName);
  };

  /**
   * 删除级别价
   */
  _deleteUserPrice = (userId: string) => {
    const { deleteUserPrice } = this.props.relaxProps;
    deleteUserPrice(userId);
  };

  /**
   * 修改价格表属性
   */
  _editPriceItem = (userLevelId: string, key: string, e) => {
    const {
      editUserPriceItem,
      userCountChecked,
      synchUserCount,
      userMaxCountChecked,
      synchUserMaxCount
    } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    editUserPriceItem(userLevelId, key, e);

    if (key == 'count') {
      synchUserCount();
      // 是否同步值
      if (userCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以usercount_开头
          if (field.indexOf('usercount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    } else if (key == 'maxCount') {
      synchUserMaxCount();
      // 是否同步值
      if (userMaxCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以usermaxcount_开头
          if (field.indexOf('usermaxcount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    }
  };

  /**
   * 搜索客户
   */
  _searchUserList = (e) => {
    const { searchUserList } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    searchUserList(e);
  };

  /**
   * 同步客户起订量库存
   */
  _synchUserCount = (e) => {
    const { updateUserCountChecked, synchUserCount } = this.props.relaxProps;
    updateUserCountChecked(e.target.checked);
    synchUserCount();
  };

  /**
   * 同步客户起订量库存
   */
  _synchUserMaxCount = (e) => {
    const {
      updateUserMaxCountChecked,
      synchUserMaxCount
    } = this.props.relaxProps;
    updateUserMaxCountChecked(e.target.checked);
    synchUserMaxCount();
  };
}
