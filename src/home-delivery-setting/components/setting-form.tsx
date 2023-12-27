import React from 'react';
import { Row, Col, Button, Form } from 'antd';

import PropTypes from 'prop-types';
import { AuthWrapper, util, noop, UEditor, cache } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IMap } from '../../../typings/globalType';
import Store from '../store';
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
    this._store = ctx['_plume$Store'];
  }

  props: {
    relaxProps?: {
      settings: IMap;
      imgType: number;
      refEditor: Function;
      setVisible: Function;
    };
  };

  static relaxProps = {
    imgType: 'imgType',
    settings: 'settings',
    refEditor: noop,
    setVisible: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');
    const store = this._store as any;
    const isThrid = util.isThirdStore();
    const loginData = sessionStorage.getItem(cache.LOGIN_DATA)
      ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      : '';
    const deliveryTypeList = loginData?.deliveryTypeList || [];

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="配送费用说明" required={true}>
              {getFieldDecorator(
                'expensesCostContent',
                {}
              )(
                <UEditor
                  key="expensesCostContent"
                  ref={(UEditor) => {
                    store.refexpensesCostContent(
                      (UEditor && UEditor.editor) || {}
                    );
                  }}
                  id="equities"
                  height="320"
                  content={settingForm.get('expensesCostContent')}
                  insertImg={() => store.setVisible(1, 2)}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={500}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        {/* 第三方商家隐藏免费店配 */}
        {!isThrid && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="免费店配" required={true}>
                {getFieldDecorator(
                  'content',
                  {}
                )(
                  <UEditor
                    key="content"
                    ref={(UEditor) => {
                      store.refEditor((UEditor && UEditor.editor) || {});
                    }}
                    id="equities"
                    height="320"
                    content={settingForm.get('content')}
                    insertImg={() => store.setVisible(1, 2)}
                    chooseImgs={[]}
                    imgType={store.state().get('imgType')}
                    maximumWords={500}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        {(deliveryTypeList.includes(2) || deliveryTypeList.includes(8)) && (
          <Row>
            <Col span={30}>
              <FormItem
                {...formItemLayout}
                label="托运部或指定专线"
                required={true}
              >
                {getFieldDecorator(
                  'logisticsContent',
                  {}
                )(
                  <UEditor
                    key="logisticsContent"
                    ref={(UEditor) => {
                      store.refLogisticsContent(
                        (UEditor && UEditor.editor) || {}
                      );
                    }}
                    id="equities"
                    height="320"
                    content={settingForm.get('logisticsContent')}
                    insertImg={() => store.setVisible(1, 2)}
                    chooseImgs={[]}
                    imgType={store.state().get('imgType')}
                    maximumWords={500}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        {(deliveryTypeList.includes(4) || deliveryTypeList.includes(9)) && (
          <Row>
            <Col span={30}>
              <FormItem
                {...formItemLayout}
                label="快递到家或同城配送"
                required={true}
              >
                {getFieldDecorator(
                  'expressContent',
                  {}
                )(
                  <UEditor
                    key="expressContent"
                    ref={(UEditor) => {
                      store.refExpressContent(
                        (UEditor && UEditor.editor) || {}
                      );
                    }}
                    id="equities"
                    height="320"
                    content={settingForm.get('expressContent')}
                    insertImg={() => store.setVisible(1, 2)}
                    chooseImgs={[]}
                    imgType={store.state().get('imgType')}
                    maximumWords={500}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        {deliveryTypeList.includes(3) && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="自提文案" required={true}>
                {getFieldDecorator(
                  'pickSelfContent',
                  {}
                )(
                  <UEditor
                    key="pickSelfContent"
                    ref={(UEditor) => {
                      store.refPickSelfContent(
                        (UEditor && UEditor.editor) || {}
                      );
                    }}
                    id="equities"
                    height="320"
                    content={settingForm.get('pickSelfContent')}
                    insertImg={() => store.setVisible(1, 2)}
                    chooseImgs={[]}
                    imgType={store.state().get('imgType')}
                    maximumWords={500}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        <AuthWrapper functionName="f_homeDeliverySetting_1">
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

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
