import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Form, Icon, Tooltip, message } from 'antd';
import { AreaSelect, QMMethod } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 6 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 19 }
  }
};

export default class InfoForm extends React.Component<any, any> {
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
    const _state = this._store.state();
    const infoForm = _state.get('infomation');

    let companyName = {
      initialValue: infoForm.get('companyName')
    };

    const area = infoForm.get('provinceId')
      ? [
          infoForm.get('provinceId').toString(),
          infoForm.get('cityId').toString(),
          infoForm.get('areaId').toString()
        ]
      : [];

    let detailAddress = {
      initialValue: infoForm.get('detailAddress')
    };
    let contactName = {
      initialValue: infoForm.get('contactName')
    };
    let contactPhone = {
      initialValue: infoForm.get('contactPhone')
    };
    let copyright = {
      initialValue: infoForm.get('copyright')
    };
    let companyDescript = {
      initialValue: infoForm.get('companyDescript')
    };

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50, maxWidth: 950 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="公司名称"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('companyName', {
                ...companyName,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '公司名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="公司名称既是您前台商城（包括PC商城、移动商城）的名称也是您管理后台的名称。"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              required={false}
              label="所在地区"
              hasFeedback
            >
              {getFieldDecorator('area', {
                initialValue: area
              })(
                <AreaSelect
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                />
              )}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的地址信息将会在您的PC商城底部展示"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="详细地址"
              required={false}
              hasFeedback
            >
              {getFieldDecorator('detailAddress', {
                ...detailAddress,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '详细地址',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的地址信息将会在您的PC商城底部展示"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="联系人"
              required={false}
              hasFeedback
            >
              {getFieldDecorator('contactName', {
                ...contactName,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系人',
                        1,
                        200
                      );
                    }
                  }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的联系信息将会在您的PC商城底部展示"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="联系方式"
              required={false}
              hasFeedback
            >
              {getFieldDecorator('contactPhone', {
                ...contactPhone,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系方式',
                        1,
                        200
                      );
                    }
                  }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的联系信息将会在您的PC商城底部展示"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="版权信息"
              required={false}
              hasFeedback
            >
              {getFieldDecorator('copyright', {
                ...copyright,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '版权信息',
                        1,
                        100
                      );
                    }
                  }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的版权信息将会在您的PC商城底部展示"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              required={false}
              label="公司简介"
              hasFeedback
            >
              {getFieldDecorator('companyDescript', {
                ...companyDescript,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '公司简介',
                        1,
                        200
                      );
                    }
                  }
                ]
              })(<Input.TextArea />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="您的公司简介将会在您的PC商城底部展示输入字数限制200字以内"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }

  /**
   * 提交
   * @param e
   * @private
   */
  _handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        const provinceId = values.area[0];
        const detailAddress = values.detailAddress ? values.detailAddress : '';
        if (detailAddress == '' && provinceId) {
          message.error('请填写详细地址');
          return;
        } else if (detailAddress != '' && !provinceId) {
          message.error('请先选择所在地区');
          return;
        }
        (this._store as any).editInfo(values);
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
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
