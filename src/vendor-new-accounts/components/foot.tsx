import * as React from 'react';
import { Button } from 'antd';
import { noop, history } from 'qmkit';
import { Relax } from 'plume2';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      saveNewAccount: Function;
    };
  };

  static relaxProps = {
    saveNewAccount: noop
  };

  render() {
    return (
      <div className="bar-button">
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={this._saveAccount}
        >
          保存
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => history.push('./vendor-payment-account')}
        >
          取消
        </Button>
      </div>
    );
  }

  _saveAccount = () => {
    const form = this.props.form;
    form.validateFields(null, errs => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.saveNewAccount();
      } else {
        this.setState({});
      }
    });
  };
}
