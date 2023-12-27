import React from 'react';
import { Relax } from 'plume2';

import {
  Button,
  Checkbox,
  Modal,
  Form,
  Row,
  Radio,
  Select,
  message
} from 'antd';
import { noop, history, Const } from 'qmkit';
import styled from 'styled-components';
import Header from './head';
import { fetchManagerList, fadadaRegister } from '../webapi';
import '../index.less';

const { Option } = Select;

const Box = styled.div`
  border: 1px solid #e9e9e9;
  padding: 20px;
  margin-bottom: 25px;
  min-height: calc(100vh - 430px);
  overflow: auto;
  h4 {
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
  p {
    color: #666666;
    font-size: 12px;
    margin-top: 20px;
    span {
      display: block;
    }
  }
`;

const BottomCon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-checkbox-wrapper {
    color: #333333;
    margin-bottom: 25px;
  }
`;
@Relax
export default class AgreementContent extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(contractTypeForm as any);
  }

  props: {
    relaxProps?: {
      signType: string | number;
      investemntManagerId: string;
      investmentManager: string;
      hasChoose: boolean;
      isPerson: string | number;
      businessEnter: string;
      passAgree: Function;
    };
  };

  static relaxProps = {
    // 商家入驻协议详情
    businessEnter: 'businessEnter',
    signType: 'signType',
    investemntManagerId: 'investemntManagerId',
    investmentManager: 'investmentManager',
    hasChoose: 'hasChoose',
    isPerson: 'isPerson',
    // 通过注册协议
    passAgree: noop
  };

  state = {
    managerList: []
  };

  componentDidMount() {
    this.getList();
  }

  render() {
    const { managerList } = this.state;
    const {
      signType,
      investemntManagerId,
      investmentManager,
      hasChoose,
      isPerson
    } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <div>
        <Header
          postTxt="入驻商家签约"
          btnShow
          btnTxt="商家入驻教程"
          btnClick={this.goVideo}
        />
        <div className="shopContent">
          <h1>入驻商家签约条款</h1>
          <Box>
            <WrapperForm
              ref={(form) => (this._form = form)}
              signType={signType}
              investemntManagerId={investemntManagerId}
              investmentManager={investmentManager}
              hasChoose={hasChoose}
              isPerson={isPerson}
              managerList={managerList}
            />
          </Box>
          <BottomCon>
            <Button type="primary" size="large" onClick={this.handleOk}>
              下一步
            </Button>
          </BottomCon>
        </div>
      </div>
    );
  }
  getList = async () => {
    const { res } = await fetchManagerList();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.setState({ managerList: res.context?.employeeList || [] });
    } else {
      message.error(res.message || '');
    }
  };

  goVideo = () => {
    history.push('/video-tutorial-notpass');
  };

  handleOk = () => {
    const { passAgree } = this.props.relaxProps;
    this._form.validateFields((errs, values) => {
      if (!errs) {
        const params = {
          signType: values.signType,
          investemntManagerId: values.investemntManagerId.key,
          investmentManager: values.investemntManagerId.label,
          accountType: '2',
          isPerson: values.isPerson
        };
        passAgree(params, () => {
          // this.setState({ visible: false });
          if (values.signType === 1) {
            message.warning('已选择线下签约，请尽快签约并完成协议上传', 4);
          }
        });
      }
    });
  };
}

class contractTypeForm extends React.Component {
  props: {
    form;
    managerList: Array<any>;
    signType: string;
    investemntManagerId: string;
    investmentManager: string;
    hasChoose: boolean;
    isPerson: string | number;
  };

  render() {
    const {
      form,
      managerList,
      signType,
      investemntManagerId,
      investmentManager,
      hasChoose,
      isPerson
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row>
          <Form.Item label="签约类型">
            {getFieldDecorator('signType', {
              initialValue: signType || 0,
              rules: [{ required: true, message: '请选择签约类型' }]
            })(
              <Radio.Group disabled={hasChoose}>
                <Radio value={0}>在线签署</Radio>
                <Radio value={1}>线下签署</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="入驻商家业务代表">
            {getFieldDecorator('investemntManagerId', {
              initialValue:
                investemntManagerId && investmentManager
                  ? { label: investmentManager, key: investemntManagerId }
                  : undefined,
              rules: [{ required: true, message: '请选择入驻商家业务代表' }]
            })(
              <Select
                style={{ width: 200 }}
                placeholder="请选择入驻商家业务代表"
                labelInValue
              >
                {managerList.map((item) => (
                  <Option key={item.accountName} value={item.employeeId}>
                    {item.employeeName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="商家性质">
            {getFieldDecorator('isPerson', {
              initialValue: isPerson,
              rules: [{ required: true, message: '请选择商家性质' }]
            })(
              <Radio.Group>
                <Radio value={1}>个体工商户</Radio>
                <Radio value={2}>企事业单位</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Row>
      </Form>
    );
  }
}
