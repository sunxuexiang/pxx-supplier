import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
      dataList: IList;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    onAdd: noop
  };

  render() {
    const { onAdd, dataList } = this.props.relaxProps;
    let num = 0;
    if (dataList && dataList.toJS()) {
      num = dataList.toJS().length;
    }
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_live_manage_add'}>
          <Button
            type="primary"
            onClick={() => onAdd()}
            disabled={util.isThirdStore() && num > 0}
          >
            新增直播间
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
