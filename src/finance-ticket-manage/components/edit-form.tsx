import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Form, Input } from 'antd';
import { QMMethod } from 'qmkit';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  // 声明上下文依赖
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
    const projectForm = _state.get('projectForm');

    let projectName = {};

    if (_state.get('edit')) {
      projectName = {
        initialValue: projectForm.get('projectName')
      };
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('projectName', {
            ...projectName,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '开票项名称',
                    1,
                    30
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
