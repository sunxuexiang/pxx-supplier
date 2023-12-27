import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Checkbox, Button, Switch } from 'antd';
import styled from 'styled-components';
import { noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;
const TicketBg = styled.div`
  padding: 15px;
  background-color: #f5f5f5;
  position: relative;
  margin-bottom: 16px;
  .ant-form {
    .saveButton {
      margin-right: 0;
      position: absolute;
      right: 15px;
    }
  }
`;

@Relax
export default class Info extends React.Component<any, any> {
  props: {
    relaxProps?: {
      invoiceType: IMap;
      onChange: Function;
      onSwitchChange: Function;
      onSaveInvoiceType: Function;
    };
  };

  static relaxProps = {
    invoiceType: 'invoiceType',
    onChange: noop,
    onSwitchChange: noop,
    onSaveInvoiceType: noop
  };

  render() {
    const {
      invoiceType,
      onChange,
      onSwitchChange,
      onSaveInvoiceType
    } = this.props.relaxProps;

    return (
      <AuthWrapper functionName="f_invo_type_set">
        <TicketBg>
          <Form layout="inline">
            <FormItem>
              <label>支持的开票类型:&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <Switch
                checked={invoiceType.get('isSupportInvoice') == 0}
                onChange={(e) => onSwitchChange(e.valueOf())}
              />&nbsp;&nbsp; 不支持开票
            </FormItem>

            <FormItem>
              <Checkbox
                disabled={invoiceType.get('isSupportInvoice') == 0}
                checked={invoiceType.get('isPaperInvoice') == 1}
                onChange={(e) =>
                  onChange({
                    field: 'isPaperInvoice',
                    value: e.target.checked
                  })
                }
              >
                普通发票
              </Checkbox>
            </FormItem>

            <FormItem>
              <Checkbox
                disabled={invoiceType.get('isSupportInvoice') == 0}
                checked={invoiceType.get('isValueAddedTaxInvoice') == 1}
                onChange={(e) =>
                  onChange({
                    field: 'isValueAddedTaxInvoice',
                    value: e.target.checked
                  })
                }
              >
                增值税专用发票
              </Checkbox>
            </FormItem>

            <FormItem className="saveButton">
              <Button type="primary" onClick={() => onSaveInvoiceType()}>
                保存设置
              </Button>
            </FormItem>
          </Form>
        </TicketBg>
      </AuthWrapper>
    );
  }
}
