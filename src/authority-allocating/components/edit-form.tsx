import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
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

  //声明上下文依赖
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

    let roleName = {};

    //如果是编辑状态
    if (_state.get('edit')) {
      roleName = {
        initialValue: _state.getIn(['editForm', 'roleName'])
      };
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="角色名称" hasFeedback>
          {getFieldDecorator('roleName', {
            ...roleName,
            rules: [
              // { required: true, message: '请输入角色名称' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '角色名称',
                    1,
                    10
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
