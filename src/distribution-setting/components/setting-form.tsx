import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Switch, Form, InputNumber } from 'antd';
import { Tips, AuthWrapper } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const formTailLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21, offset: 3 }
};

export default class settingForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const state = this._store.state();
    const store = this._store as any;
    const setting = state.get('setting');

    if (!state.get('loading')) return null;

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 950 }}
        onSubmit={this._handleSubmit}
      >
        <FormItem required={true} {...formItemLayout} label="社交分销">
          <div className="clearfix logoImg">
            {getFieldDecorator('openFlag')(
              <Switch
                defaultChecked={setting.get('openFlag')}
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={(e) => store.changeFormValue('openFlag', e.valueOf())}
              />
            )}
          </div>
          <Tips title="您可以给自己的商品设置分销佣金比例，让用户帮你推广商品。社交分销开关开启时，您设置的分销商品按照分销规则销售，关闭时，分销商品在前台按原有规则销售。" />
        </FormItem>
        <FormItem {...formTailLayout}>
          <div className="clearfix logoImg">
            <Checkbox
              onChange={async (e) => {
                let checked = e.target.checked;
                await store.changeFormValue('commissionFlag', checked);
                if (!checked) {
                  this.props.form.setFieldsValue({ commissionRate: null });
                  store.changeFormValue('commissionRate', null);
                }
                this.props.form.validateFields(['commissionRate'], {
                  force: true
                });
              }}
              defaultChecked={setting.get('commissionFlag')}
            >
              通用分销佣金比例
            </Checkbox>
            {getFieldDecorator('commissionRate', {
              initialValue: setting.get('commissionRate'),
              onChange: (val) => {
                store.changeFormValue('commissionRate', val);
              },
              rules: [
                {
                  required: setting.get('commissionFlag'),
                  message: '请填写通用分销佣金比例'
                }
              ]
            })(
              <InputNumber
                disabled={!setting.get('commissionFlag')}
                style={{ maxWidth: 170 }}
                max={99}
                min={1}
              />
            )}{' '}
            %
          </div>
          <Tips title="您可以在此设置通用的分销佣金比例，可另外设置单品的佣金比例，请输入1-99间的整数。" />
        </FormItem>
        <AuthWrapper functionName={'f_store_distribution_setting_edit'}>
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, _values) => {
      if (!errs) {
        (this._store as any).editSetting();
      }
    });
  };
}
