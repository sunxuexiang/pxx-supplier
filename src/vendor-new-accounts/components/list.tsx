import React from 'react';
import { Relax } from 'plume2';
import { Icon, Button, Input, Form, Select } from 'antd';
import { DataGrid, history, noop, QMMethod, ValidConst } from 'qmkit';
import styled from 'styled-components';

const { Column } = DataGrid;
const FormItem = Form.Item;
const Option = Select.Option;

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
export default class List extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      allBanks: any;
      newAccounts: any;
      addNewAccounts: Function;
      onAccountInputChange: Function;
      deleteAccount: Function;
      saveNewAccount: Function;
    };
  };

  static relaxProps = {
    addNewAccounts: noop,
    onAccountInputChange: noop,
    deleteAccount: noop,
    newAccounts: 'newAccounts',
    allBanks: 'allBanks',
    saveNewAccount: noop
  };

  render() {
    const {
      newAccounts,
      addNewAccounts,
      onAccountInputChange,
      deleteAccount
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <NoBorder>
          <Form layout="inline">
            <DataGrid
              dataSource={
                newAccounts.toJS().length > 0 ? newAccounts.toJS() : []
              }
              rowKey="key"
              pagination={false}
            >
              <Column
                title="序号"
                width="10%"
                dataIndex="index"
                key="index"
                render={(_text, _rowData: any, index) => {
                  return index + 1;
                }}
              />
              <Column
                title="银行"
                width="20%"
                dataIndex="bankCode"
                key="bankCode"
                render={(text, rowData: any) => {
                  return (
                    <div>
                      <FormItem>
                        {getFieldDecorator(`${rowData.key}_bankName`, {
                          initialValue: text,
                          rules: [{ required: true, message: '请选择银行' }]
                        })(
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="选择或输入银行名称"
                            optionFilterProp="children"
                            onChange={(value) =>
                              onAccountInputChange({
                                id: rowData.key,
                                field: 'bankName',
                                value: value
                              })
                            }
                            filterOption={(input, option) =>
                              (option as any).props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
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
                width="20%"
                dataIndex="accountName"
                key="accountName"
                render={(text, rowData: any) => {
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
                            style={{ width: '150px' }}
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: rowData.key,
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
                width="20%"
                dataIndex="bankNo"
                key="bankNo"
                render={(_text, rowData: any) => {
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
                                QMMethod.validatorTrimMinAndMax(
                                  rule,
                                  value,
                                  callback,
                                  '银行账号',
                                  1,
                                  50
                                );
                              }
                            }
                          ]
                        })(
                          <Input
                            placeholder="数字+字母+特殊符不超过50个字符"
                            style={{ width: '250px' }}
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: rowData.key,
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
                width="20%"
                dataIndex="bankBranch"
                key="bankBranch"
                render={(_text, rowData: any) => {
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
                                  30
                                );
                              }
                            }
                          ]
                        })(
                          <Input
                            placeholder="例如：南京市雨花区雨花支行"
                            style={{ width: '250px' }}
                            onChange={(e: any) =>
                              onAccountInputChange({
                                id: rowData.key,
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
                width="10%"
                render={(_text, rowData: any) => {
                  return (
                    <div>
                      {newAccounts.toJS().length == 1 ? null : (
                        <a
                          href="javascript:;"
                          onClick={() => deleteAccount(rowData.key)}
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
          </Form>
        </NoBorder>
        <ButtonBox>
          <Button type="dashed" onClick={() => addNewAccounts()}>
            <Icon type="plus" />增加
          </Button>
        </ButtonBox>
        <div className="bar-button">
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={this._saveAccount}
          >
            保存
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => history.push('./vendor-payment-account')}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }

  /**
   *下拉栏里内容填充
   * @private
   */
  _renderOption = () => {
    const { allBanks } = this.props.relaxProps;
    return allBanks.toJS().map((v) => {
      return (
        <Option value={v.bankName + '_' + v.bankCode} key={v.bankCode}>
          {v.bankName}
        </Option>
      );
    });
  };

  _saveAccount = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.saveNewAccount();
      } else {
        this.setState({});
      }
    });
  };
}
