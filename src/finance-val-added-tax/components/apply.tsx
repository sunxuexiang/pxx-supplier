import React from 'react';
import { Switch } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class ReceiveApply extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      invoiceConfig: any;
      onChangeSwitch: Function;
    };
  };

  static relaxProps = {
    invoiceConfig: 'invoiceConfig',
    onChangeSwitch: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { invoiceConfig, onChangeSwitch } = this.props.relaxProps;

    const status = invoiceConfig && invoiceConfig.get('status');

    return (
      <div style={styles.applyBox}>
        <div>
          <div style={styles.toptitle}>是否接受增值税专用发票申请?</div>
          <p>开启后客户可申请开具增值税专用发票</p>
          <p>关闭后客户只可开具普通发票</p>
        </div>
        <Switch
          checkedChildren={'已启用'}
          unCheckedChildren={'未启用'}
          checked={status == 1}
          onChange={(e) => onChangeSwitch(e)}
        />
      </div>
    );
  }
}

const styles = {
  applyBox: {
    background: '#f7f7f7',
    padding: 10,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as any,
  toptitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any
};
