import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Button, Input, Form } from 'antd';
import { Const, Tips, QMUpload, cache,AuthWrapper } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};

export default class settingForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    console.log(this, '操');
    this._store = ctx['_plume$Store'];
    let skuNum = this._store.state().getIn(['settings', 'skuNum']); //店铺logo
    // let storeSign = this._store.state().getIn(['settings', 'storeSign']); //店铺店招

    this.state = {
      skuNum: skuNum?skuNum:'',
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={18}>
            <FormItem required={false} {...formItemLayout} label="">
            {getFieldDecorator('skuNum', {
                  initialValue: this.state.skuNum,
                  onChange:(e)=>{
                    this.setState({
                      skuNum:e.target.value
                    });
                    // this.props.form.setFieldsValue({ skuNum:e.target.value });
                  }
                })(
                  <div>
                    <Input style={{width:'100px'}} value={this.state.skuNum} />
                    个规格可凑一箱
                  </div>
                )}
            </FormItem>
          </Col>
        </Row>
        <AuthWrapper functionName="f_gather_together_setting_edit">             
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
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
      }
    });
  };

  


}

