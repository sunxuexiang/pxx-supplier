import React from 'react';
import { Form, Input, DatePicker, Button, Radio } from 'antd';
import moment from 'moment';
import { ValidConst } from 'qmkit';
import { validatorBank, validatorBankChild } from './staticContractInfo';
import { IMap } from 'typings/globalType';

export default class ContractThree extends React.Component {
  props: {
    form;
    contractInfo: IMap;
    showModal: Function;
    signImage: string;
  };
  render() {
    const { form, contractInfo, showModal, signImage } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <article className="shop-contract-title-left">附件5-1：</article>
        <article className="shop-contract-title">
          中国建设银行“惠市宝—对公专业结算综合服务平台”加入申请书
        </article>
        <article className="shop-contract-center">
          （个体工商户或个人版）
        </article>
        <article className="shop-contract-noindent">
          中国建设银行股份有限公司
          <span className="shop-contract-underline">长沙芙蓉支行：</span>
        </article>
        <article>
          鉴于贵行与
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          共同完成了
          <span className="shop-contract-underline">喜吖吖惠市宝</span>
          （市场管理方或平台经营者给该系统的命名）系统，签署了编号为
          <span className="shop-contract-underline">202301</span>
          的《中国建设银行“惠市宝—对公专业结算综合服务平台”业务合作协议》（以下称业务合作协议），我方在此申请加入“惠市宝—对公专业结算综合服务平台”：
        </article>
        <article className="shop-contract-bold">
          1.我方自愿加入该平台，并已知悉并同意业务合作协议以及为实现惠市宝产品及服务已经及/或将要签署的具体协议（包括但不限于业务合作协议附件、各类客户服务协议、系统使用协议、产品使用协议、业务协议以及其他相关的法律性文件及其不时修订）的全部内容，对全部条款的含义及相应的法律后果已全部通晓并充分理解，同意以签署本申请书的方式加入该平台，我方承诺遵守业务合作协议、具体协议等惠市宝相关协议及本申请书的全部要求。
        </article>
        <article>
          2.我方确保向贵行提供的所有证件、资料均合法、真实、准确、完整和有效。
        </article>
        <article>
          3.我方确保通过该平台所发生的营业资金具有真实交易背景，确保经营行为合法、合规。承诺在本申请书有效期内不存在任何违反有关支付结算、现金管理业务等相关法律、法规和规章的行为或情形，不参与洗钱、套取现金、传销、逃避自身债务、刷单、违反国际金融制裁及任何其它违法违规行为。
        </article>
        <article className="shop-contract-bold">
          4.本申请书是我方的真实意思表示，我方确保与贵行进行业务往来并签约本申请书的经办人具有相应的权限。因我方无权与贵行进行业务往来或签署相关协议而产生的一切责任均由我方承担，包括但不限于全额赔偿贵行因此遭受的损失。
        </article>
        <article>
          5.我方同意并不可撤销地授权：贵行按照国家相关规定采集并向金融信用信息基础数据库及其他依法成立的征信机构提供我方及我方经营者信息和包括信贷信息在内的信用信息（包含我方及我方经营者因未及时履行合同义务产生的不良信息）；在办理涉及我方的业务时，有权向金融信用信息基础数据库及其他依法成立的征信机构查询、打印、保存我方及我方经营者的信用信息，用于“惠市宝—对公专业结算综合服务平台”相关服务的提供。若涉及我方在贵行业务未获批准办理，本授权书及我方经营者信用报告等资料无须退回我方。
        </article>
        <article>
          6.我方参与“惠市宝—对公专业结算综合服务平台”并用于营业资金收款分账的账户信息如下：
        </article>
        <article>
          户名：
          <Form.Item>
            {getFieldDecorator('accountName', {
              initialValue: contractInfo.get('accountName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 240 }} />)}
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
            })(<Input style={{ width: 240 }} />)}
          </Form.Item>
        </article>
        <article>
          开户行：
          {/* <Form.Item>
            {getFieldDecorator('bank', {
              initialValue: contractInfo.get('bank'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 240 }} />)}
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
        <article>
          同意营业款按照T+<span className="shop-contract-underline">4</span>日{' '}
          <span className="shop-contract-underline">按规则</span>
          入账该账户。
          <span className="shop-contract-bold">
            上述信息真实有效，因上述信息不完整、不真实或不及时等非归责于贵行的原因而产生的一切责任由我方承担。
          </span>
        </article>
        <article>
          7.
          我方同意自贵行收到我方提交的本申请书并在惠市宝平台或系统中确认之日起，我方及或前述指定账户正式加入“惠市宝—对公专业结算综合服务平台”。
        </article>
        <article>
          8.我方同意贵行根据惠市宝相关协议中的《中国建设银行网络特约商户及网络支付业务合作协议》的约定，按照交易结算金额的一定比例向我方或向
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          收取支付业务手续费，具体收费标准和方式如下
        </article>
        <article>
          <span className="shop-contract-underline">
            按交易结算金额的0.6%收费
          </span>
        </article>
        <article className="shop-contract-bold">
          9.如有违反业务合作协议、具体协议等惠市宝相关协议或本申请书承诺事项，我方同意贵行有权单方面停止任一及/或全部惠市宝产品及服务，并解除“惠市宝—对公专业结算综合服务平台”签约关系。如因我方自身原因或因我方违背业务合作协议、具体协议等惠市宝相关协议或本申请书承诺导致的损失，与贵行无关，由我方承担全部责任。
        </article>
        <article>
          10.我方同意贵行按有权按照司法机关要求执行查询、冻结、扣划操作，不对此提出异议。
        </article>
        <article className="shop-contract-bold">
          11.我方同意
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          作出的惠市宝相关签约、解约、交易、使用等行为或指令，，同意其设置、修改、变更基本信息、合约信息、分账规则等惠市宝相关信息，同意在我方主动解约时授权
          <span className="shop-contract-underline">
            湖南喜吖吖商业服务有限公司
          </span>
          代理我方填写《中国建设银行惠市宝参与分账方维护申请表》申请解约，同意其填写的全部内容并同意贵行采取的相应措施。
        </article>
        <article className="shop-contract-bold">
          12. 如本申请书采用线上方式签署，则本申请书具体签署方式为
          <span className="shop-contract-underline">线上法大大</span>
          我方确认在
          <span className="shop-contract-underline">法大大</span>
          平台或系统中所使用的电子签名方式为符合各方约定的可靠的电子签名方式；我方登入贵行
          <span className="shop-contract-underline">喜吖吖惠市宝</span>
          平台或系统的方式为我方认可的身份认证方式，凡通过该身份认证方式后的操作均视为我方（或其授权代理人）所为，我方承诺对由此产生的法律后果承担责任。
        </article>
        <article>
          该申请有效期：本申请书签署日期到
          <span className="shop-contract-underline">
            {moment()
              .add(10, 'y')
              .endOf('day')
              .format('YYYY年MM月DD日')}
          </span>
          （截止日期应为市场管理方/平台经营者签约的第一份三方协议日期，或上一次自动延期后的截止日期）
        </article>
        <article>
          <span>参与分账方个体工商户经营者或自然人本人（签字）： </span>
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
        <br />
        <article>授权单位盖章（如有）：</article>
        <br />
        <article>
          营业执照名称：
          <Form.Item>
            {getFieldDecorator('businessLicenseName', {
              initialValue: contractInfo.get('businessLicenseName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          社会统一信用代码证号：
          <Form.Item>
            {getFieldDecorator('creditCode', {
              initialValue: contractInfo.get('creditCode'),
              rules: [
                { required: true, message: '请填写' },
                {
                  pattern: ValidConst.socialCode,
                  message: '请输入正确的统一信用代码证号'
                }
              ]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          其他证件及证明材料名称：
          <Form.Item>
            {getFieldDecorator('otherProve', {
              initialValue: contractInfo.get('otherProve')
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          其他证件号码：
          <Form.Item>
            {getFieldDecorator('otherDocment', {
              initialValue: contractInfo.get('otherDocment')
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          经营者：
          <Form.Item>
            {getFieldDecorator('legalPersonName', {
              initialValue: contractInfo.get('legalPersonName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          经营者身份证号码：
          <Form.Item>
            {getFieldDecorator('legalIdCardNo', {
              initialValue: contractInfo.get('legalIdCardNo'),
              rules: [
                { required: true, message: '请填写' },
                { pattern: ValidConst.idCard, message: '请输入正确的身份证号' }
              ]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          经营地址：
          <Form.Item>
            {getFieldDecorator('businessAddress', {
              initialValue: contractInfo.get('businessAddress'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          经营范围：
          <Form.Item>
            {getFieldDecorator('businessScope', {
              initialValue: contractInfo.get('businessScope'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          手机号码：
          <Form.Item>
            {getFieldDecorator('phone', {
              initialValue: contractInfo.get('phone'),
              rules: [
                { required: true, message: '请填写' },
                { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
              ]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article style={{ textAlign: 'right' }}>
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
        <article>
          我方同意
          <Form.Item>
            {getFieldDecorator('unitConsent', {
              initialValue: contractInfo.get('unitConsent'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 160 }} />)}
          </Form.Item>
          及/或指定的账户加入“惠市宝—对公专业结算综合服务平台”，请你行协助办理相关手续。
        </article>
        <article>
          我方已充分了解业务合作协议、具体协议等惠市宝相关协议和本申请书的内容，对惠市宝相关协议和前述申请及承诺事项的真实性、合法性及有效性已进行必要审查，同时连带承担由此产生的一切责任。
        </article>
        <article className="shop-contract-bold">
          如采用线上方式签署，则我方具体签署方式为
          <span className="shop-contract-underline">线上法大大</span>
          我方确认在
          <span className="shop-contract-underline">法大大</span>
          平台或系统中所使用的电子签名方式为符合各方约定的可靠的电子签名方式；我方登入贵行
          <span className="shop-contract-underline">喜吖吖惠市宝</span>
          平台或系统的方式为我方认可的身份认证方式，凡通过该身份认证方式后的操作均视为我方（或其授权代理人）所为，我方承诺对由此产生的法律后果承担责任。
        </article>
        <article>市场管理方/平台经营者名称（公章）：</article>
        <article>法定代表人（负责人）或授权代理人（签字或盖章）：</article>
        <article style={{ textAlign: 'right' }}>
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
      </div>
    );
  }
}
