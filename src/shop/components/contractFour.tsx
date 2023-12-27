import React from 'react';
import { Form, Input, Button, DatePicker, Radio } from 'antd';
import { IMap } from 'typings/globalType';
import { ValidConst } from 'qmkit';
import { validatorBank, validatorBankChild } from './staticContractInfo';
import moment from 'moment';

export default class ContractFour extends React.Component {
  props: {
    form;
    showModal: Function;
    signImage: string;
    contractInfo: IMap;
  };
  render() {
    const { form, signImage, showModal, contractInfo } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <article className="shop-contract-title-left">附件7：</article>
        <article className="shop-contract-title">
          市场方/参与分账方授权书
        </article>
        <article className="shop-contract-title-left">
          致：中国建设银行股份有限公司
          <span className="shop-contract-underline">长沙芙蓉支行</span>
        </article>
        <article>
          本单位
          <Form.Item>
            {getFieldDecorator('companyName', {
              initialValue: contractInfo.get('companyName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          ，统一社会信用代码证号
          <Form.Item>
            {getFieldDecorator('creditCode', {
              initialValue: contractInfo.get('creditCode'),
              rules: [
                { required: true, message: '请填写' },
                {
                  pattern: ValidConst.socialCode,
                  message: '请输入正确的统一社会信用代码证号'
                }
              ]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
          因业务发展需要，同意将
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          （被授权单位名称），统一社会信用代码证号
          <span className="shop-contract-underline">91430111MA4M0DGB17</span>
          结算账号作为中国建设银行惠市宝产品收款结算账户。
        </article>
        <article>账户信息如下：</article>
        <article>
          户名：
          <Form.Item>
            {getFieldDecorator('accountName', {
              initialValue: contractInfo.get('accountName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          账号：
          <Form.Item>
            {getFieldDecorator('account', {
              initialValue: contractInfo.get('account'),
              rules: [
                { required: true, message: '请填写' },
                { pattern: ValidConst.bankNo, message: '请输入正确的账号' }
              ]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          开户行名称：
          {/* <Form.Item>
            {getFieldDecorator('bank', {
              initialValue: contractInfo.get('bank'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item> */}
          <Form.Item>
            {getFieldDecorator('bank', {
              rules: [
                { required: true, message: '请填写' },
                { validator: validatorBank }
              ]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          <span>银行</span>
          <Form.Item>
            {getFieldDecorator('bankChild', {
              rules: [
                { required: true, message: '请填写' },
                { validator: validatorBankChild }
              ]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          <Form.Item>
            （
            {getFieldDecorator('bankType', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Radio.Group>
                <Radio value={1}>支行</Radio>
                <Radio value={2}>分行</Radio>
              </Radio.Group>
            )}
            ）
          </Form.Item>
          <span className="shop-contract-tips">
            （请填写详细的开户支行，例如：xx银行xx支行）
          </span>
        </article>
        <article>因此造成的一切经济纠纷，由本单位自行承担。</article>
        <article>
          <span>授权单位法定代表人（负责人）签字：</span>
          {signImage && (
            <React.Fragment>
              <img alt="" src={signImage} />
              <Button type="link" onClick={() => showModal()}>
                重新签名
              </Button>
            </React.Fragment>
          )}
          {!signImage && (
            <Button type="link" onClick={() => showModal()}>
              点击签名
            </Button>
          )}
        </article>
        <article>授权单位盖章：</article>
        <article>
          日期：
          <Form.Item>
            {getFieldDecorator('signTime', {
              initialValue: contractInfo.get('signTime')
                ? moment(contractInfo.get('signTime'))
                : '',
              rules: [{ required: true, message: '请填写' }]
            })(
              <DatePicker
                format="YYYY年MM月DD日"
                placeholder="      年   月   日"
                style={{ width: 125 }}
              />
            )}
          </Form.Item>
        </article>
        <br />
        <br />
        <article className="shop-contract-title">结算账户使用授权书</article>
        <article>
          致：中国建设银行股份有限公司
          <span className="shop-contract-underline">长沙芙蓉支行</span>
          <span></span>
        </article>
        <article>
          本单位
          <Form.Item>
            {getFieldDecorator('companyName', {
              initialValue: contractInfo.get('companyName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          ，统一社会信用代码证号
          <Form.Item>
            {getFieldDecorator('creditCode', {
              initialValue: contractInfo.get('creditCode'),
              rules: [
                { required: true, message: '请填写' },
                {
                  pattern: ValidConst.socialCode,
                  message: '请输入正确的统一社会信用代码证号'
                }
              ]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
          授权
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          （被授权单位名称），统一社会信用代码证号
          <span className="shop-contract-underline">91430111MA4M0DGB17</span>
          使用我单位结算账户作为中国建设银行惠市宝产品收款结算账户。
        </article>
        <article>账户信息如下：</article>
        <article>
          户名：
          <Form.Item>
            {getFieldDecorator('accountName', {
              initialValue: contractInfo.get('accountName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          账号：
          <Form.Item>
            {getFieldDecorator('account', {
              initialValue: contractInfo.get('account'),
              rules: [
                { required: true, message: '请填写' },
                { pattern: ValidConst.bankNo, message: '请输入正确的账号' }
              ]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          开户行名称：
          {/* <Form.Item>
            {getFieldDecorator('bank', {
              initialValue: contractInfo.get('bank'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item> */}
          <Form.Item>
            {getFieldDecorator('bank', {
              rules: [
                { required: true, message: '请填写' },
                { validator: validatorBank }
              ]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          <span>银行</span>
          <Form.Item>
            {getFieldDecorator('bankChild', {
              rules: [
                { required: true, message: '请填写' },
                { validator: validatorBankChild }
              ]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          <Form.Item>
            （
            {getFieldDecorator('bankType', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Radio.Group>
                <Radio value={1}>支行</Radio>
                <Radio value={2}>分行</Radio>
              </Radio.Group>
            )}
            ）
          </Form.Item>
          <span className="shop-contract-tips">
            （请填写详细的开户支行，例如：xx银行xx支行）
          </span>
        </article>
        <article>因此造成的一切经济纠纷，由本单位自行承担。</article>
        <article>
          <span>授权单位法定代表人（负责人）签字：</span>
          {signImage && (
            <React.Fragment>
              <img alt="" src={signImage} />
              <Button type="link" onClick={() => showModal()}>
                重新签名
              </Button>
            </React.Fragment>
          )}
          {!signImage && (
            <Button type="link" onClick={() => showModal()}>
              点击签名
            </Button>
          )}
        </article>
        <article>授权单位盖章：</article>
        <article>
          日期：
          <Form.Item>
            {getFieldDecorator('signTime', {
              initialValue: contractInfo.get('signTime')
                ? moment(contractInfo.get('signTime'))
                : '',
              rules: [{ required: true, message: '请填写' }]
            })(
              <DatePicker
                format="YYYY年MM月DD日"
                placeholder="      年   月   日"
                style={{ width: 125 }}
              />
            )}
          </Form.Item>
        </article>
      </div>
    );
  }
}
