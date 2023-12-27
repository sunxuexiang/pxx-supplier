import React from 'react';
import { Modal, Form } from 'antd';
import { Relax } from 'plume2';
import FreightForm from './freight-form';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IList, IMap } from 'typings/globalType';

const WrapperForm = Form.create({})(FreightForm as any);
@Relax
export default class FreightModal extends React.Component<any, any> {
  _form: any;
  props: {
    history?: any;
    relaxProps?: {
      feightVisible: boolean;
      setFeightVisible: Function;
      freightList: IList;
      setFreightTempId: Function;
      freightTempId: number;
      selectTemp: IMap;
      selectTempExpress: IMap;
      setGoodsFreight: Function;
      submitBatchFreight: Function;
    };
  };

  static relaxProps = {
    feightVisible: 'feightVisible',
    setFeightVisible: noop,
    freightList: 'freightList',
    setFreightTempId: noop,
    freightTempId: 'freightTempId',
    selectTemp: 'selectTemp',
    selectTempExpress: 'selectTempExpress',
    setGoodsFreight: noop,
    submitBatchFreight: noop
  };
  render() {
    const { feightVisible } = this.props.relaxProps;
    return (
      <div>
        {feightVisible ? (
          <Modal  maskClosable={false}
            title="设置运费模板"
            visible={feightVisible}
            onOk={() => this._handleOK()}
            onCancel={() => this._onCancel()}
          >
            <WrapperForm
              ref={form => (this._form = form)}
              {...{ relaxProps: this.props.relaxProps }}
            />
          </Modal>
        ) : null}
      </div>
    );
  }

  /**
   * 提交商品关联运费模板数据
   */
  _handleOK = () => {
    const { submitBatchFreight } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        submitBatchFreight(values.freightTempId);
      } else {
        return false;
      }
    });
  };
  /**
   * 取消设置并关闭modal
   */
  _onCancel = () => {
    const { setFeightVisible, setFreightTempId } = this.props.relaxProps;
    setFeightVisible(false);
    setFreightTempId(null);
  };
}
