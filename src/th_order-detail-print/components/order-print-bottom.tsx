import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List, Map } from 'immutable';

/**
 * 订单打印头部
 */
@Relax
export default class OrderPrintBottom extends React.Component<any, any> {
  onAudit: any;

  props: {
    relaxProps?: {
      detail: IMap;
      printSetting: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    printSetting: 'printSetting'
  };

  render() {
    const { detail, printSetting } = this.props.relaxProps;
    return (
      <div style={{ marginLeft: 20, marginTop: 20 }}>
        <div
          dangerouslySetInnerHTML={{ __html: printSetting.get('printBottom') }}
        ></div>
      </div>
    );
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
