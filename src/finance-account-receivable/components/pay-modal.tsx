import * as React from 'react';
import PropTypes from 'prop-types';
import { IMap, Relax } from 'plume2';
import { Modal, Form, Alert, Input, Switch, Tooltip } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class PayModal extends React.Component<any, any> {
  _form;
  GateWaysForm: any;

  constructor(props) {
    super(props);
    this.GateWaysForm = Form.create({})(GateWaysForm);
  }

  props: {
    relaxProps?: {
      channel_visible: boolean;
      onSaveChannel: Function;
      onCancelChannel: Function;
      channelJson: IMap;
      onFormValueChange: Function;
    };
  };

  static relaxProps = {
    channel_visible: 'channel_visible',
    onSaveChannel: noop,
    onCancelChannel: noop,
    channelJson: 'channelJson',
    onFormValueChange: noop
  };

  render() {
    const {
      channel_visible,
      onCancelChannel,
      channelJson,
      onFormValueChange
    } = this.props.relaxProps;

    const GateWaysForm = this.GateWaysForm;

    if (!channel_visible) {
      return null;
    }

    const channelValue = channelJson.get('channelItemList');

    return (
      <Modal  maskClosable={false}
        width={1100}
        title={'配置聚合支付'}
        visible={true}
        onOk={() => this._handleOk()}
        onCancel={() => onCancelChannel()}
      >
        <div>
          <Alert
            message={
              <ul>
                <li>
                  1、我们已经接入了ping++聚合支付，接入的渠道有支付宝、微信、银联，您可注册并登录<a
                    href="https://dashboard.pingxx.com/login"
                    target="_blank"
                  >
                    ping++管理平台
                  </a>获取您的相关参数。
                </li>
                <li>
                  2、在ping++管理平台开通支付渠道后，您可在此控制相应渠道的开启或关闭。
                </li>
                <li>3、参数配置在点击保存后生效。</li>
              </ul>
            }
            type="info"
          />
          <div>
            <div className="pay-title">
              <h2>ping++聚合支付接口</h2>
              <span>重要参数请谨慎配置，填写错误将无法正常使用在线支付</span>
              <a href="/pay-help-doc" target="_blank">
                查看帮助
              </a>
            </div>
            <div style={{ width: 640, marginTop: 20 }}>
              <GateWaysForm ref={form => (this._form = form)} />
            </div>
            <div className="pay-title">
              <h2>支付渠道设置</h2>
              <span>在ping++管理平台已开通的渠道开启后才会生效</span>
            </div>
            <div>
              <table className="pay-table">
                <tbody>
                  <tr>
                    <th>支付渠道</th>
                    <th>操作</th>
                    <th>应用场景</th>
                    <th>生效示例</th>
                  </tr>
                  <tr className="pay-ways">
                    <td>
                      <h2>PC网页</h2>
                      <span>PC订货站点的支付，若您未部署PC站，无需设置</span>
                    </td>
                  </tr>
                  {channelValue.get('alipay_qr') ? (
                    <tr>
                      <td>支付宝当面付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.alipay_qr.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('alipay_qr').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>扫描支付宝收款码支付</td>
                      <td>
                        <Tooltip
                          arrowPointAtCenter={true}
                          title={this._renderExample('alipay_qr')}
                        >
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('alipay_pc_direct') ? (
                    <tr>
                      <td>支付宝电脑网站支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.alipay_pc_direct.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue
                              .get('alipay_pc_direct')
                              .get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>打开支付宝电脑网站支付</td>
                      <td>
                        <Tooltip
                          title={this._renderExample('alipay_pc_direct')}
                        >
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('wx_pub_qr') ? (
                    <tr>
                      <td>微信公众号支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.wx_pub_qr.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('wx_pub_qr').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>扫描微信收款码支付</td>
                      <td>
                        <Tooltip title={this._renderExample('wx_pub_qr')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('upacp_pc') ? (
                    <tr>
                      <td>银联网关支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.upacp_pc.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('upacp_pc').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>打开银联电脑网站支付</td>
                      <td>
                        <Tooltip title={this._renderExample('upacp_pc')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  <tr className="pay-ways">
                    <td>
                      <h2>手机网页</h2>
                      <span>生效于H5订货站点，若您未部署H5站，无需设置</span>
                    </td>
                  </tr>
                  {channelValue.get('alipay_wap') ? (
                    <tr>
                      <td>支付宝手机网站支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.alipay_wap.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('alipay_wap').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>打开支付宝手机网站支付</td>
                      <td>
                        <Tooltip title={this._renderExample('alipay_wap')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('wx_pub') ? (
                    <tr>
                      <td>微信公众号</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.wx_pub.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('wx_pub').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>微信内打开H5订货站点时，可唤起微信APP支付</td>
                      <td>
                        <Tooltip title={this._renderExample('wx_pub')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('upacp_wap') ? (
                    <tr>
                      <td>银联手机支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.upacp_wap.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('upacp_wap').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>打开银联手机网站支付</td>
                      <td>
                        <Tooltip title={this._renderExample('upacp_wap')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  <tr className="pay-ways">
                    <td>
                      <h2>APP</h2>
                      <span>生效于APP订货站点，若您未部署APP站，无需设置</span>
                    </td>
                  </tr>
                  {channelValue.get('alipay') ? (
                    <tr>
                      <td>支付宝APP支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.alipay.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('alipay').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>唤起支付宝APP支付</td>
                      <td>
                        <Tooltip title={this._renderExample('alipay')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('wx') ? (
                    <tr>
                      <td>微信APP支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.wx.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('wx').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>唤起微信APP支付</td>
                      <td>
                        <Tooltip title={this._renderExample('wx')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {channelValue.get('upacp') ? (
                    <tr>
                      <td>银联手机支付</td>
                      <td>
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          onChange={e => {
                            onFormValueChange(
                              'channelItemList.upacp.isOpen',
                              e ? 1 : 0
                            );
                          }}
                          defaultChecked={
                            channelValue.get('upacp').get('isOpen') == 1
                          }
                        />
                      </td>
                      <td>打开银联手机网页支付</td>
                      <td>
                        <Tooltip title={this._renderExample('upacp')}>
                          <a>示例</a>
                        </Tooltip>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  _handleOk() {
    const gatewayForm = this._form as WrappedFormUtils;
    const { onSaveChannel } = this.props.relaxProps;
    gatewayForm.validateFields(null, errs => {
      if (!errs) {
        onSaveChannel();
      }
    });
  }

  _renderExample(code) {
    let height;
    let width;
    if (
      ['alipay_qr', 'alipay_pc_direct', 'wx_pub_qr', 'upacp_pc'].indexOf(
        code
      ) != -1
    ) {
      height = 180;
      width = 220;
    } else {
      height = 400;
      width = 200;
    }
    return (
      <div style={{ width: width, height: height }}>
        <img
          style={{ width: '100%', height: '100%' }}
          src={require('.././img/' + code + '.png')}
        />
      </div>
    );
  }
}

class GateWaysForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const channelJson = this._store.state().get('channelJson');
    if (!channelJson) return;
    const onFormValueChange = this._store.onFormValueChange;

    const fromValue = channelJson.get('payGatewayConfig');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="App ID" required={true}>
          {getFieldDecorator('appId', {
            initialValue: fromValue.get('appId'),
            rules: [
              { required: true, message: '请输入App ID' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="请填写您在ping++平台的应用ID（App ID）"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.appId',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Live Secret Key" required={true}>
          {getFieldDecorator('apiKey', {
            initialValue: fromValue.get('apiKey'),
            rules: [
              { required: true, message: '请输入Live Secret Key' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="请填写您在ping++管理平台获取的Live Secret Key"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.apiKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="ping++公钥" required={true}>
          {getFieldDecorator('publicKey', {
            initialValue: fromValue.get('publicKey'),
            rules: [
              { required: true, message: '请输入商户公钥' },
              { max: 1200, message: '最多1200字符' }
            ]
          })(
            <Input.TextArea
              placeholder="请填写您在ping++管理平台配置的商户公钥"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.publicKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="商户私钥" required={true}>
          {getFieldDecorator('privateKey', {
            initialValue: fromValue.get('privateKey'),
            rules: [
              { required: true, message: '请输入商户私钥' },
              { max: 1200, message: '最多1200字符' }
            ]
          })(
            <Input.TextArea
              placeholder="请填写您在ping++管理平台配置的商户私钥"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.privateKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="微信公众号App ID" required={false}>
          {getFieldDecorator('appId2', {
            initialValue: fromValue.get('appId2'),
            rules: [
              { required: false, message: '请输入微信公众号App ID' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="开通微信公众号支付需在此配置您的微信公众号App ID"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.appId2',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="微信公众号 App Secret"
          required={false}
        >
          {getFieldDecorator('secret', {
            initialValue: fromValue.get('secret'),
            rules: [
              { required: false, message: '请输入微信公众号Secret Key' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="开通微信公众号支付需在此配置您的微信公众号 App Secret"
              onChange={e => {
                onFormValueChange(
                  'payGatewayConfig.secret',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否启用" required={true}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={e => {
              onFormValueChange('isOpen', e ? 1 : 0);
            }}
            defaultChecked={channelJson.get('isOpen') == 1}
          />
        </FormItem>
      </Form>
    );
  }
}
