import React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Tooltip,
  Icon,
  Button
} from 'antd';
import { List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import styled from 'styled-components';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

type TList = List<any>;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const ServiceDiv = styled.div`
  .service-list {
    display: flex;
    flex-direction: row;
    .ant-row {
      width: 45%;
      .ant-form-item-label {
        float: left;
        width: 37%;
      }
      .ant-form-item-control-wrapper {
        float: left;
        width: 55%;
      }
    }
    .del {
      line-height: 40px;
      margin-left: 9px;
      font-size: 12px;
    }
  }
`;

/**
 * 生效终端
 * @type {{label: string; value: string}[]}
 */
const plainOptions = [
  { label: 'PC', value: 'pc' },
  { label: 'APP', value: 'app' },
  { label: '移动端', value: 'mobile' }
];

@Relax
export default class QQModal extends React.Component<any, any> {
  _form: any;

  constructor(props) {
    super(props);

    /*this.state = {
      //是否需要校验
      checkFlag: false
    };*/
  }

  props: {
    form: any;
    relaxProps?: {
      smsVisible: boolean;
      smsCancel: Function;
      onlineServer: IMap;
      onlineServerList: TList;
      onFormChange: Function;
      onAddOnlineServer: Function;
      onSetOnlineServer: Function;
      onDelOnlineServer: Function;
      onSaveOnlineServer: Function;
      setOneFlag: string;
      checkFlag: boolean;
    };
  };

  static relaxProps = {
    smsVisible: 'smsVisible',
    smsCancel: noop,
    onlineServer: 'onlineServer',
    onlineServerList: 'onlineServerList',
    onFormChange: noop,
    onAddOnlineServer: noop,
    onSetOnlineServer: noop,
    onDelOnlineServer: noop,
    onSaveOnlineServer: noop,
    setOneFlag: 'setOneFlag',
    checkFlag: 'checkFlag'
  };

  render() {
    const {
      smsVisible,
      smsCancel,
      onlineServer,
      onlineServerList,
      onSetOnlineServer,
      onDelOnlineServer,
      setOneFlag,
      checkFlag
    } = this.props.relaxProps;

    if (!smsVisible) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;

    const initTerminal = [];
    if (onlineServer.get('effectivePc') == '1') {
      initTerminal.push('pc');
    }
    if (onlineServer.get('effectiveApp') == '1') {
      initTerminal.push('app');
    }
    if (onlineServer.get('effectiveMobile') == '1') {
      initTerminal.push('mobile');
    }

    return (
      <Modal  maskClosable={false}
        title="编辑QQ客服"
        visible={smsVisible}
        onOk={this._handleOK}
        onCancel={() => smsCancel()}
        width="600px"
      >
        <Form className="login-form">
          <FormItem {...formItemLayout} label="启用开关">
            <RadioGroup
              value={onlineServer.get('serverStatus')}
              onChange={this._handleChange}
            >
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="生效终端">
            {getFieldDecorator('effectTerminal', {
              initialValue: initTerminal,
              rules: [{ required: checkFlag, message: '启用时请选择生效终端' }]
            })(
              <CheckboxGroup
                options={plainOptions}
                onChange={this._onCheckedChange}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="客服列表">
            {getFieldDecorator('setOneFlag', {
              initialValue: setOneFlag,
              rules: [
                { required: checkFlag, message: '启用时至少设置一个客服' }
              ]
            })(
              <div>
                <Button
                  disabled={onlineServerList && onlineServerList.size > 9}
                  onClick={this._onAddOnlineServer}
                >
                  添加客服
                </Button>
                <Tooltip
                  placement="right"
                  title={this._renderListTitle}
                  overlayClassName={'qq-tooltip'}
                >
                  <a style={{ fontSize: 14, marginLeft: 10 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </div>
            )}
          </FormItem>
          <ServiceDiv>
            {onlineServerList &&
              onlineServerList.toJS().map((v, k) => {
                return (
                  <div className="service-list" key={v.key}>
                    <FormItem
                      {...formItemLayout}
                      label="客服昵称"
                      required={true}
                    >
                      {getFieldDecorator(`${v.key}_customerServiceName`, {
                        initialValue: v.customerServiceName,
                        rules: [{ validator: this.checkCustomerAccountName }]
                      })(
                        <Input
                          placeholder="最多10个字符"
                          onChange={(e) =>
                            onSetOnlineServer({
                              index: k,
                              field: 'customerServiceName',
                              text: e.target.value
                            })
                          }
                        />
                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="客服账号"
                      required={true}
                    >
                      {getFieldDecorator(`${v.key}_customerServiceAccount`, {
                        initialValue: v.customerServiceAccount,
                        rules: [{ validator: this.checkCustomerAccount }]
                      })(
                        <Input
                          placeholder="请输入5-11位数字"
                          onChange={(e) =>
                            onSetOnlineServer({
                              index: k,
                              field: 'customerServiceAccount',
                              text: e.target.value
                            })
                          }
                        />
                      )}
                    </FormItem>
                    <a onClick={() => onDelOnlineServer(k)} className="del">
                      删除
                    </a>
                  </div>
                );
              })}
          </ServiceDiv>
        </Form>
      </Modal>
    );
  }

  /**
   * 启用时请选择生效终端
   * @param _rule
   * @param value
   * @param callback
   */
  _handleChange = async (e) => {
    const { onFormChange } = this.props.relaxProps;
    await onFormChange({ field: 'serverStatus', value: e.target.value });

    //是否校验
    let checkFlag = e.target.value == 1;
    if (checkFlag) {
      this.props.form.validateFields(['effectTerminal'], {
        force: true
      });
    } else {
      this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
    }
  };

  /**
   * CheckBox 选择事件
   * 启用时请选择生效终端
   * @param checkedValues
   * @private
   */
  _onCheckedChange = (checkedValues) => {
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'effectTerminal', value: checkedValues });
  };

  /**
   * 添加客服
   * @private
   */
  _onAddOnlineServer = () => {
    const { onAddOnlineServer } = this.props.relaxProps;
    onAddOnlineServer();
    this.props.form.resetFields(['setOneFlag']);
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const {
      onSaveOnlineServer,
      onlineServer,
      onlineServerList
    } = this.props.relaxProps;
    if (onlineServer.get('serverStatus') == 0) {
      this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
    } else {
      if (onlineServerList.size < 1) {
        this.props.form.setFields({
          setOneFlag: {
            value: '',
            errors: [new Error('启用时至少设置一个客服')]
          }
        });
      }
    }

    form.validateFields(null, (errs, values) => {
      if (onlineServer.get('serverStatus') == 0) {
        this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
      } else {
        if (values.effectTerminal.length < 1) {
          this.props.form.setFields({
            effectTerminal: {
              value: [],
              errors: [new Error('启用时请选择生效终端')]
            }
          });
        }
      }
      // console.log('--------------->', errs, values);
      //如果校验通过
      if (!errs) {
        onSaveOnlineServer();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 提示
   * @returns {any}
   * @private
   */
  _renderListTitle = () => {
    return (
      <div style={{ fontSize: 12, color: '#666' }}>
        <p>1.最多添加10个客服</p>
        <p>2.添加的客服QQ，需要开启QQ推广功能</p>
      </div>
    );
  };

  /**
   * 校验客服账号
   * @param _rule
   * @param value
   * @param callback
   */
  checkCustomerAccount = (_rule, value, callback) => {
    if (!value.trim()) {
      callback('客服账号不能为空');
      return;
    } else {
      const regex = /^\d{5,11}$/;
      if (!regex.test(value)) {
        callback('请输入5-11位数字');
      } else {
        callback();
      }
    }
  };

  /**
   * 校验客服昵称
   * @param _rule
   * @param value
   * @param callback
   */
  checkCustomerAccountName = (_rule, value, callback) => {
    if (!value.trim()) {
      callback('客服昵称不能为空');
      return;
    } else {
      if (!ValidConst.noChar.test(value)) {
        callback('客服昵称只允许中英文和数字');
        return;
      }

      if (value.trim().length > 10) {
        callback('客服昵称不可超过10个字符');
        return;
      }
    }
    callback();
  };
}
