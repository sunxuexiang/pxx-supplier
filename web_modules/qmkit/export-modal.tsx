import React from 'react';
import { Form, Modal, Radio } from 'antd';
import { noop } from 'qmkit';
import { IMap } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';

const RadioGroup = Radio.Group;

export default class ExportModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  props: {
    data: any;
    onHide: Function;
    handleByParams: Function;
    handleByIds: Function;
    handleByAll?:Function;
    extraDom: any;
  };

  static defaultProps = {
    data: {},
    onHide: noop,
    handleByParams: noop,
    handleByIds: noop,
    handleByAll:noop,
    extraDom: null
  };

  state = {
    posting: false
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(ExportForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide,extraDom } = this.props;

    let visible, byParamsTitle, byIdsTitle,byAllTitle;
    if (data.get) {
      visible = data.get('visible');
      byParamsTitle = data.get('byParamsTitle');
      byIdsTitle = data.get('byIdsTitle');
      byAllTitle=data.get('byAllTitle');
    } else {
      visible = data.visible;
      byParamsTitle = data.byParamsTitle;
      byIdsTitle = data.byIdsTitle;
      byAllTitle = data.byAllTitle;
    }

    if (!visible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title={'批量导出'}
        visible={visible}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk()}
          >
            导出
          </Button>
        ]}
      >
        {extraDom}
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...{
            byParamsTitle: byParamsTitle,
            byIdsTitle: byIdsTitle,
            byAllTitle:byAllTitle,
          }}
        />
      </Modal>
    );
  }

  _handleOk() {
    const { onHide, handleByParams, handleByIds,handleByAll } = this.props;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.setState({ posting: true });
        const callback =values.exportType === 'byParams' ? handleByParams : (values.exportType === 'byIds'?handleByIds:handleByAll);
        callback().then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

const FormItem = Form.Item;

/**
 * 批量导出 form
 */
class ExportForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form style={{ textAlign: 'center' }}>
        <FormItem>
          {getFieldDecorator('exportType', {
            rules: [
              {
                required: true,
                message: '请选择导出方式'
              }
            ]
          })(
            <RadioGroup>
              {this.props.byParamsTitle&&<Radio value="byParams">{this.props.byParamsTitle}</Radio>}
              {this.props.byIdsTitle&&<Radio value="byIds">{this.props.byIdsTitle}</Radio>}
              {this.props.byAllTitle&&<Radio value="byAll">{this.props.byAllTitle}</Radio>}
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }
}
