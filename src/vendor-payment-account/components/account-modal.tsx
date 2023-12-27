import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Row, Col, Input, Select } from 'antd';
import { noop, QMMethod, ValidConst } from 'qmkit';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

@Relax
export default class AccountModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      accountVisible: boolean;
      accountModal: Function;
      accountModalContent: any;
      //变更账户信息
      onAccountChange: Function;
      //保存编辑
      saveAccountEdit: Function;
      allBanks: any;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    accountVisible: 'accountVisible',
    // 关闭弹框
    accountModal: noop,
    accountModalContent: 'accountModalContent',
    onAccountChange: noop,
    saveAccountEdit: noop,
    allBanks: 'allBanks'
  };

  render() {
    const {
      accountVisible,
      accountModalContent,
      onAccountChange
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (!accountVisible) {
      return null;
    }
    return (
      <div>
        <Modal  maskClosable={false}
          title="变更当前账号"
           
          visible={accountVisible}
          onCancel={this._handleModelCancel}
          okText="保存"
          onOk={this._handleOK}
          width={400}
        >
          <Form>
            <Row type="flex" justify="start">
              <Col span={24}>
                <FormItem {...formItemLayout} label="银行">
                  {getFieldDecorator('bankName', {
                    initialValue: accountModalContent.get('bankName'),
                    rules: [{ required: true, message: '请选择银行' }]
                  })(
                    <Select
                      showSearch
                      placeholder="选择或输入银行名称"
                      optionFilterProp="children"
                      onChange={(value: any) =>
                        onAccountChange({
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
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={24}>
                <FormItem {...formItemLayout} label="账户名">
                  {getFieldDecorator('accountName', {
                    initialValue: accountModalContent.get('accountName'),
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorTrimMinAndMax(
                            rule,
                            value,
                            callback,
                            '账户名',
                            1,
                            20
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onAccountChange({
                          field: 'accountName',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={24}>
                <FormItem {...formItemLayout} label="账号">
                  {getFieldDecorator('bankNo', {
                    initialValue: accountModalContent.get('bankNo'),
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
                      onChange={(e) =>
                        onAccountChange({
                          field: 'bankNo',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={24}>
                <FormItem {...formItemLayout} label="支行">
                  {getFieldDecorator('bankBranch', {
                    initialValue: accountModalContent.get('bankBranch'),
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorTrimMinAndMax(
                            rule,
                            value,
                            callback,
                            '支行名称',
                            1,
                            30
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onAccountChange({
                          field: 'bankBranch',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { accountModal } = this.props.relaxProps;
    //重置表单域各项值
    this.props.form.resetFields();
    accountModal();
  };

  /**
   * 支行名称校验
   * @param rule
   * @param value
   * @param callback
   * @private
   */
  _checkBranchName = (_rule, value, callback) => {
    if (value && value.length > 30) {
      callback(new Error('支行名称为5-60个字符'));
      return;
    }
    callback();
  };

  /**
   * 保存事件
   * @private
   */
  _handleOK = () => {
    //校验表单各项输入
    this.props.form.validateFields((err) => {
      if (!err) {
        const { saveAccountEdit } = this.props.relaxProps;
        saveAccountEdit();
      }
    });
  };

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
}
