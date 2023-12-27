import React from 'react';
import { Form, Modal, Radio, Alert, Checkbox } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';

const RadioGroup = Radio.Group;

export default class ExportTradeModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  props: {
    data: any;
    onHide: Function;
    handleByParams: Function;
    handleByIds: Function;
    handleBySonTrade: Function;
    alertInfo?: any;
    alertVisible?: boolean;
    handleBySonDetail?: Function;
  };

  static defaultProps = {
    data: {},
    onHide: noop,
    handleByParams: noop,
    handleByIds: noop,
    handleBySonTrade: noop,
    alertInfo: {},
    alertVisible: false,
    handleBySonDetail: noop
  };

  state = {
    posting: false
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ExportForm as any);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, alertInfo, alertVisible } = this.props;

    let visible, byParamsTitle, byIdsTitle, alertMessage, alertDescription, bySonTradesTitle, disabled, detailFlag, byDetailTitle;
    if (data.get) {
      visible = data.get('visible');
      byParamsTitle = data.get('byParamsTitle');
      byIdsTitle = data.get('byIdsTitle');
      bySonTradesTitle = data.get('bySonTradesTitle');
      disabled = data.get('disabled');
      detailFlag = data.get('detailFlag');
      byDetailTitle = data.get('byDetailTitle');
    } else {
      visible = data.visible;
      byParamsTitle = data.byParamsTitle;
      byIdsTitle = data.byIdsTitle;
      bySonTradesTitle = data.bySonTradesTitle;
      disabled = data.disabled;
      detailFlag = data.detailFlag;
      byDetailTitle = data.byDetailTitle;
    }

    if (alertInfo.get) {
      alertMessage = alertInfo.get('message');
      alertDescription = alertInfo.get('description');
    } else {
      alertMessage = alertInfo.message;
      alertDescription = alertInfo.description;
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
        {alertVisible && (
          <Alert
            message={alertMessage}
            description={
              <div>
                <p>{alertDescription}</p>
              </div>
            }
            type="info"
          />
        )}
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...{
            byParamsTitle: byParamsTitle,
            byIdsTitle: byIdsTitle,
            bySonTradesTitle: bySonTradesTitle,
            disabled: disabled,
            byDetailTitle: byDetailTitle,
            detailFlag: detailFlag,
            handleBySonTrade: this.props.handleBySonTrade,
            handleBySonDetail: this.props.handleBySonDetail,
          }}
        />
      </Modal>
    );
  }

  _handleOk() {
    const { onHide, handleByParams, handleByIds } = this.props;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.setState({ posting: true });
        const callback =
          values.exportType === 'byParams' ? handleByParams : handleByIds;
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
              <Radio value="byParams">{this.props.byParamsTitle}</Radio>
              <Radio value="byIds">{this.props.byIdsTitle}</Radio>
            </RadioGroup>

          )}
        </FormItem>
        <FormItem style={{ textAlign: 'left', marginLeft: '19%' }}>
          {this.props.byDetailTitle && (
            <Checkbox checked={this.props.detailFlag} onChange={this.props.handleBySonDetail}>{this.props.byDetailTitle}</Checkbox>
          )}
          <Checkbox checked={this.props.disabled} onChange={this.props.handleBySonTrade}>{this.props.bySonTradesTitle}</Checkbox>
        </FormItem>
      </Form>
    );
  }
}
