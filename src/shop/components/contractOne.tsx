import React from 'react';
import { Form, Input, Row, Col, DatePicker, Button } from 'antd';
import { ValidConst } from 'qmkit';
import { IMap } from 'typings/globalType';
import moment from 'moment';

export default class ContractOne extends React.Component {
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
        <article className="shop-contract-title">入驻商家签约条款</article>
        <article>甲方（平台方）：湖南喜吖吖商业服务有限公司</article>
        <article>
          <span>地址：</span>
          <span className="shop-contract-underline">
            湖南省长沙市雨花区高桥酒水食品城57栋超级喜吖吖
          </span>
        </article>
        <article>
          <span>联系方式：</span>
          <span className="shop-contract-underline">4008-319-899</span>
        </article>
        <br />
        <article>
          <span>乙方：</span>
          <Form.Item>
            {getFieldDecorator('companyName', {
              initialValue: contractInfo.get('companyName'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          <span>地址：</span>
          <Form.Item>
            {getFieldDecorator('address', {
              initialValue: contractInfo.get('address'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 600 }} />)}
          </Form.Item>
        </article>
        <article>
          <span>联系方式：</span>
          <Form.Item>
            {getFieldDecorator('contractPhone', {
              initialValue: contractInfo.get('contractPhone'),
              rules: [
                { required: true, message: '请填写' },
                {
                  pattern: ValidConst.phoneortele,
                  message: '请输入正确的联系方式'
                }
              ]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
        </article>
        <article>
          <span>代表人：</span>
          <Form.Item>
            {getFieldDecorator('representative', {
              initialValue: contractInfo.get('representative'),
              rules: [{ required: true, message: '请填写' }]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
        </article>
        <article>
          <span>公民身份号码：</span>
          <Form.Item>
            {getFieldDecorator('idCardNo', {
              initialValue: contractInfo.get('idCardNo'),
              rules: [
                { required: true, message: '请填写' },
                { pattern: ValidConst.idCard, message: '请输入正确的身份号码' }
              ]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
        </article>
        <br />
        <article>
          一、入驻商家需提供资料：真实的营业执照、法定代表人身份证、法定代表人联系方式、仓库地址及上传仓库照片；
        </article>
        <article>二、禁止违法经营；</article>
        <article>
          三、禁止违反平台规则与平台服务条款（细则详见附件超级大白鲸服务条款）；
        </article>
        <article className="shop-contract-doubleindent">
          1、商品一箱起卖，不得另设起卖要求
        </article>
        <article className="shop-contract-doubleindent">
          2、配送到店（自费）大众物流平台会设置好（城、乡）起配要求
        </article>
        <article className="shop-contract-doubleindent">
          3、不得主动要求客户加微信或私下交易，不得提供其它联系方式给客户（平台有权停店或永久关店）
        </article>
        <article className="shop-contract-doubleindent">
          4、南北干货、农副产品等，必须要有产品的视频介绍（非标品没有视频介绍谁敢买）
        </article>
        <article className="shop-contract-doubleindent">
          5、上传商品资料不能缺斤少两，净重是多少就写多少，不得短斤少两，不得写毛重欺骗客户，非标品要有产品视频为证，不得以次充好；
        </article>
        <article>
          四、禁止售卖假货、劣质货、不合格的货、以次充好的货及收了款不发货等情况；
        </article>
        <article>五、严禁用新日期的价格发老日期的货及有问题不处理；</article>
        <article>六、禁止商户出现反平台政府及舆论；</article>
        <article>七、大白鲸将向您收取6‰交易金额的技术服务费用；</article>
        <br />
        <article className="shop-contract-bold">
          违反以上条款，大白鲸将会关闭商户账户终止合作或店铺排序最后，如因此造成他人损失或其他法律责任的，由商户自行承担损失与责任。
        </article>
        <article className="shop-contract-bold">
          如您的行为使大白鲸遭受损失，您应根据本协议的约定承担损失的10倍赔偿责任。
        </article>
        <article className="shop-contract-bold">
          商户承诺所签合同上提供的信息全面、真实、准确，如有弄虚作假情形及后续出现相关问题及纠纷，均由商户公司及其法定代表人以及收益人承担相关法律责任，均与超级大白鲸无关。
        </article>
        <article className="shop-contract-bold">
          您同意并认可如双方出现争议，应由甲方所在地的法院管辖。
        </article>
        <br />
        <article>
          <Row type="flex" justify="space-between">
            <Col span={12}>甲方（公章）： </Col>
            <Col span={12}>乙方（授权单位盖章）：</Col>
          </Row>
        </article>
        <article>
          <Row type="flex" justify="space-between">
            <Col offset={12} span={12}>
              代表人（签字）：
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
            </Col>
          </Row>
        </article>
        <article>
          <span>签署时间：</span>
          <Form.Item>
            {getFieldDecorator('signTime', {
              initialValue: contractInfo.get('signTime')
                ? moment(contractInfo.get('signTime'))
                : '',
              rules: [{ required: true, message: '请填写' }]
            })(<DatePicker format="YYYY年MM月DD日" style={{ width: 125 }} />)}
          </Form.Item>
        </article>
        <br />
        <br />
      </div>
    );
  }
}
