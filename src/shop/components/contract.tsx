import React, { createRef } from 'react';
import { Relax } from 'plume2';
import SignatureCanvas from 'react-signature-canvas';

import { Form, Button, Modal, message } from 'antd';
import { noop, history, Const } from 'qmkit';
import Header from './head';

import ContractOne from './contractOne';
import ContractTwo from './contractTwo';
import ContractThree from './contractThree';
import ContractFour from './contractFour';
import staticData from './staticContractInfo';
import '../index.less';
import { uploadBase64File } from '../webapi';
import moment from 'moment';
import { IMap } from 'plume2/es5/typings';

@Relax
export default class Contract extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ContractForm as any);
  }

  props: {
    relaxProps?: {
      isPerson: string | number;
      saveContractInfo: Function;
      contractInfo: IMap;
      signImage: string;
      changeCommonState: Function;
      saveContractLoading: boolean;
      backToPass: Function;
    };
  };

  static relaxProps = {
    isPerson: 'isPerson',
    saveContractInfo: noop,
    contractInfo: 'contractInfo',
    signImage: 'signImage',
    changeCommonState: noop,
    saveContractLoading: 'saveContractLoading',
    backToPass: noop
  };

  render() {
    const {
      isPerson,
      saveContractInfo,
      contractInfo,
      signImage,
      changeCommonState,
      saveContractLoading,
      backToPass
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
        <div className="shop-contract-content">
          <WrapperForm
            ref={(form) => (this._form = form)}
            isPerson={isPerson}
            saveContractInfo={saveContractInfo}
            contractInfo={contractInfo}
            signImage={signImage}
            changeCommonState={changeCommonState}
            saveContractLoading={saveContractLoading}
            backToPass={backToPass}
          />
        </div>
      </div>
    );
  }
  goVideo = () => {
    history.push('/video-tutorial-notpass');
  };
}

class ContractForm extends React.Component<any, any> {
  props: {
    form;
    isPerson: string | number;
    saveContractInfo: Function;
    contractInfo: IMap;
    signImage: string;
    changeCommonState: Function;
    saveContractLoading: boolean;
    backToPass: Function;
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  signatureRef: any = createRef();

  handleOk = async () => {
    const { changeCommonState } = this.props;
    const signatureData = this.signatureRef.current.toDataURL();
    const { res } = await uploadBase64File({ content: signatureData });
    if (res && res[0]) {
      changeCommonState({ field: 'signImage', value: res[0] });
      this.handleCancel();
    } else {
      message.error('操作失败');
    }
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.handleClearSignature();
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleClearSignature = () => {
    this.signatureRef.current.clear();
  };

  saveContractData = () => {
    const { form, saveContractInfo, isPerson, signImage } = this.props;
    form.validateFieldsAndScroll(
      { scroll: { offsetTop: 80 } },
      (errs, values) => {
        if (!errs) {
          if (!signImage) {
            message.error('请上传签名');
            return;
          }
          const params = {
            ...values,
            ...staticData,
            signImage,
            isPerson,
            accountType: '2'
          };
          params.signTime = moment(values.signTime).format('YYYY-MM-DD');
          params.bank = `${params.bank}银行${params.bankChild}${
            params.bankType === 1 ? '支行' : '分行'
          }`;
          delete params.bankChild;
          delete params.bankType;
          console.log(params);
          saveContractInfo(params);
        }
      }
    );
  };

  render() {
    const { visible } = this.state;
    const {
      form,
      isPerson,
      contractInfo,
      signImage,
      saveContractLoading,
      backToPass
    } = this.props;

    return (
      <Form layout="inline" className="shop-contract">
        <ContractOne
          form={form}
          contractInfo={contractInfo}
          showModal={this.showModal}
          signImage={signImage}
        />
        {isPerson === 2 && (
          <ContractTwo form={form} contractInfo={contractInfo} />
        )}
        {isPerson === 1 && (
          <ContractThree
            form={form}
            showModal={this.showModal}
            signImage={signImage}
            contractInfo={contractInfo}
          />
        )}
        <ContractFour
          form={form}
          showModal={this.showModal}
          signImage={signImage}
          contractInfo={contractInfo}
        />
        <div className="shop-contract-footer">
          <Button
            type="primary"
            onClick={() => backToPass()}
            style={{ marginRight: '12px' }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            loading={saveContractLoading}
            onClick={this.saveContractData}
          >
            下一步
          </Button>
        </div>
        <Modal
          title="签名"
          centered
          maskClosable={false}
          visible={visible}
          onCancel={this.handleCancel}
          footer={
            <div>
              <Button onClick={this.handleClearSignature}>清空</Button>
              <Button type="primary" onClick={this.handleOk}>
                保存
              </Button>
            </div>
          }
          width={700}
        >
          <SignatureCanvas
            ref={this.signatureRef}
            penColor="black" // 可以设置笔的颜色
            canvasProps={{
              width: 652,
              height: 280,
              className: 'signature-canvas'
            }} // 设置Canvas的尺寸和样式
          />
        </Modal>
      </Form>
    );
  }
}
