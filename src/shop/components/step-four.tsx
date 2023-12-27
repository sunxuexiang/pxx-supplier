import React from 'react';
import { IMap, Relax } from 'plume2';

import { fromJS } from 'immutable';

import { Form, Input, Button, Select, Icon } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid, QMMethod, ValidConst } from 'qmkit';

const { Column } = DataGrid;
const FormItem = Form.Item;
const Option = Select.Option;

const Content = styled.div`
  padding-bottom: 20px;
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
`;

const ButtonBox = styled.div`
  padding: 16px 8px;
  width: 23%;
  button {
    width: 100%;
  }
`;

const NoBorder = styled.div`
  tr > td {
    border-bottom: none;
  }
`;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      setCurrentStep: Function;
      addNewAccounts: Function;
      onAccountInputChange: Function;
      onBankNameChange: Function;
      deleteAccount: Function;
      saveNewAccount: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    //设置当前页
    setCurrentStep: noop,
    addNewAccounts: noop,
    onAccountInputChange: noop,
    onBankNameChange: noop,
    deleteAccount: noop,
    saveNewAccount: noop
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      company,
      addNewAccounts,
      onAccountInputChange,
      deleteAccount,
      onBankNameChange
    } = this.props.relaxProps;
    const offlineAccount = company.get('offlineAccount');

    return (
      <div>
        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
            <GreyText>
              请录入您的建行结算账户，如需修改请在财务模块操作
              {/* 商家入驻需求 默认为建设银行 */}
              {/* 已添加{offlineAccount ? offlineAccount.count() : 0}个结算账户，最多可添加5个结算账户，如需修改结算账户请在财务模块操作 */}
            </GreyText>
          </div>
        </Content>

        <Content>
          <NoBorder>
            <DataGrid
              dataSource={
                offlineAccount.toJS().length > 0 ? offlineAccount.toJS() : []
              }
              rowKey="key"
              pagination={false}
            >
              <Column
                title="序号"
                width="5%"
                render={(_text, _rowData: any, index) => {
                  return index + 1;
                }}
              />
              <Column
                title="银行"
                width="15%"
                dataIndex="bankCode"
                key="bankCode"
                render={(text, rowData: any, index) => {
                  return (
                    <div>
                      <FormItem>
                        {getFieldDecorator(`${rowData.key}_bankCode`, {
                          initialValue: text,
                          rules: [{ required: true, message: '请选择开户银行' }]
                        })(
                          <Select
                            showSearch
                            allowClear={true}
                            style={{ width: 180 }}
                            placeholder="选择或输入银行名称"
                            optionFilterProp="children"
                            onChange={(v) =>
                              onBankNameChange({ id: index, value: v })
                            }
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toString()
                                .indexOf(inputValue) !== -1
                            }
                          >
                            {this._renderOption()}
                          </Select>
                        )}
                      </FormItem>
                    </div>
                  );
                }}
              />
              <Column
                title="账户名"
                width="15%"
                dataIndex="accountName"
                key="accountName"
                render={(text, rowData: any, index) => {
                  return (
                    <div>
                      <FormItem>
                        {getFieldDecorator(`${rowData.key}_accountName`, {
                          initialValue: text,
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                QMMethod.validatorTrimMinAndMax(
                                  rule,
                                  value,
                                  callback,
                                  '账户名称',
                                  1,
                                  20
                                );
                              }
                            }
                          ]
                        })(
                          <Input
                            placeholder="不超过20个字符"
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: index,
                                field: 'accountName',
                                value: e.target.value
                              })
                            }
                          />
                        )}
                      </FormItem>
                    </div>
                  );
                }}
              />
              <Column
                title="账号"
                width="25%"
                dataIndex="bankNo"
                key="bankNo"
                render={(_text, rowData: any, index) => {
                  return (
                    <div>
                      <FormItem>
                        {getFieldDecorator(`${rowData.key}_bankNo`, {
                          initialValue: rowData.bankNo,
                          rules: [
                            {
                              pattern: ValidConst.noChinese,
                              message: '银行账号格式不正确'
                            },
                            {
                              validator: (rule, value, callback) => {
                                this.checkBlankSpace(rule, value, callback);
                              }
                            }
                          ]
                        })(
                          <Input
                            placeholder="数字+字母+特殊符不超过50个字符"
                            style={{ width: 240 }}
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: index,
                                field: 'bankNo',
                                value: e.target.value
                              })
                            }
                          />
                        )}
                      </FormItem>
                    </div>
                  );
                }}
              />
              <Column
                title="支行"
                width="25%"
                dataIndex="bankBranch"
                key="bankBranch"
                render={(_text, rowData: any, index) => {
                  return (
                    <div>
                      <FormItem>
                        {getFieldDecorator(`${rowData.key}_bankBranch`, {
                          initialValue: rowData.bankBranch,
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                QMMethod.validatorTrimMinAndMax(
                                  rule,
                                  value,
                                  callback,
                                  '支行',
                                  1,
                                  20
                                );
                              }
                            }
                          ]
                        })(
                          <Input
                            placeholder="例如：南京市雨花区雨花支行"
                            style={{ width: 240 }}
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: index,
                                field: 'bankBranch',
                                value: e.target.value
                              })
                            }
                          />
                        )}
                      </FormItem>
                    </div>
                  );
                }}
              />
              <Column
                title=" "
                width="5%"
                render={(_text, _rowData: any, index) => {
                  return (
                    <div>
                      {offlineAccount.toJS().length == 1 ? null : (
                        <a
                          href="javascript:;"
                          onClick={() => deleteAccount(index)}
                        >
                          <Icon
                            type="minus-circle-o"
                            style={{ color: '#999', fontSize: 24 }}
                          />
                        </a>
                      )}
                    </div>
                  );
                }}
              />
            </DataGrid>
          </NoBorder>
          {/* 商家入驻需求 默认为建设银行 故此处隐藏 */}
          <ButtonBox>
            <Button type="dashed" onClick={() => addNewAccounts()}>
              <Icon type="plus" />
              增加
            </Button>
          </ButtonBox>
        </Content>

        <Content>
          <Button onClick={this._prev}>上一步</Button>
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            onClick={this._save}
          >
            保存
          </Button>
        </Content>
      </div>
    );
  }

  /**
   *下拉栏里内容填充
   * @private
   */
  _renderOption = () => {
    const { company } = this.props.relaxProps;
    return (company.get('bankList') || fromJS([])).toJS().map((v) => {
      return (
        <Option value={v.bankCode} key={v.bankCode}>
          {v.bankName}
        </Option>
      );
    });
  };

  /**
   * 下一步
   */
  _save = () => {
    const form = this.props.form;
    const { saveNewAccount } = this.props.relaxProps;
    //对非空的进行校验
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveNewAccount();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 上一步
   */
  _prev = () => {
    const { setCurrentStep } = this.props.relaxProps;
    setCurrentStep(2);
  };

  checkBlankSpace = (_rule, value, callback) => {
    const val = value.toString();
    if (val.trim().length <= 0) {
      callback('银行账号不能为空');
      return;
    }

    callback();
  };
}
