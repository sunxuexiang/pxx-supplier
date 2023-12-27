import React from 'react';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Modal } from 'antd';
import styled from 'styled-components';

import moment from 'moment';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const formItemPhoto = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;
  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company } = this.props.relaxProps;
    const info = company ? company.get('info') : {};
    const businessLicence = info.get('businessLicence')
      ? JSON.parse(info.get('businessLicence'))
      : [];
    const backIDCard = info.get('backIDCard')
      ? JSON.parse(info.get('backIDCard'))
      : [];
    const frontIDCard = info.get('frontIDCard')
      ? JSON.parse(info.get('frontIDCard'))
      : [];
    const warehouseImage = info.get('warehouseImage')
      ? JSON.parse(info.get('warehouseImage'))
      : [];
    const doorImage = info.get('doorImage')
      ? JSON.parse(info.get('doorImage'))
      : [];
    let IDImages = new Array();

    if (backIDCard.length > 0) {
      backIDCard.map((v) => {
        IDImages.push(v);
      });
    }

    if (frontIDCard.length > 0) {
      frontIDCard.map((v) => {
        IDImages.push(v);
      });
    }

    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label="统一社会信用代码"
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('socialCreditCode')
                    ? info.get('socialCreditCode')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={true} label="企业名称">
                <p style={{ color: '#333' }}>
                  {company && info.get('companyName')
                    ? info.get('companyName')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法定代表人">
                <p style={{ color: '#333' }}>
                  {company && info.get('legalRepresentative')
                    ? info.get('legalRepresentative')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem required={true} {...formItemLayout} label="法人电话">
                <p style={{ color: '#333' }}>
                  {company && info.get('corporateTelephone')
                    ? info.get('corporateTelephone')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            {/* <Col span={12}>
              <FormItem {...formItemLayout} label="注册资本">
                <p style={{ color: '#333' }}>
                  {company && info.get('registeredCapital')
                    ? info.get('registeredCapital') + '万元'
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="成立日期">
                <p style={{ color: '#333' }}>
                  {company && info.get('foundDate')
                    ? moment(info.get('foundDate')).format('YYYY年MM月DD日')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限自">
                <p style={{ color: '#333' }}>
                  {company && info.get('businessTermStart')
                    ? moment(info.get('businessTermStart')).format(
                        'YYYY年MM月DD日'
                      )
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限至">
                <p style={{ color: '#333' }}>
                  {company && info.get('businessTermEnd')
                    ? moment(info.get('businessTermEnd')).format(
                        'YYYY年MM月DD日'
                      )
                    : '无'}
                </p>
              </FormItem>
            </Col> */}
            <Col span={12}>
              <FormItem {...formItemLayout} label="住所">
                <p style={{ color: '#333' }}>
                  {company && info.get('address') ? info.get('address') : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem required={true} {...formItemLayout} label="仓库地址">
                <p style={{ color: '#333' }}>
                  {company && info.get('warehouseAddress')
                    ? info.get('warehouseAddress')
                    : '无'}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem required={true} {...formItemLayout} label="经营范围">
                <p style={{ color: '#333' }}>
                  {company && info.get('businessScope')
                    ? info.get('businessScope')
                    : '无'}
                </p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                required={true}
                {...formItemPhoto}
                label="营业执照副本电子版"
              >
                <PicBox>{this._renderBussinessLicence(businessLicence)}</PicBox>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法人身份证">
                <PicBox>{this._renderBussinessLicence(IDImages)}</PicBox>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemPhoto} required label="仓库照片">
                <PicBox>{this._renderBussinessLicence(warehouseImage)}</PicBox>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemPhoto} required label="招牌照片">
                <PicBox>{this._renderBussinessLicence(doorImage)}</PicBox>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Modal
          maskClosable={false}
          visible={this.state.showImg}
          footer={null}
          onCancel={() => this._hideImgModal()}
        >
          <div>
            <div>
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.imgUrl}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  //附件
  _renderBussinessLicence = (encloses) => {
    if (encloses.length == 0 || encloses[0] == '') {
      return <span>无</span>;
    }
    return encloses.map((v, k) => {
      return (
        <img
          key={'p-' + k}
          src={v.url}
          width="100%"
          onClick={() => this.setState({ showImg: true, imgUrl: v.url })}
        />
      );
    });
  };

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };
}
