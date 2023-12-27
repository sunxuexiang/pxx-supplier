import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';
import { List } from 'immutable';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchConfirm: Function;
      onBatchDestory: Function;
      selected: List<string>;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: [],
    onBatchConfirm: noop,
    onBatchDestory: noop,
    onAdd: noop
  };

  render() {
    const { onBatchDestory, onBatchConfirm } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <Button onClick={() => onBatchConfirm()}>批量确认</Button>
        <Button onClick={() => onBatchDestory()}>批量作废</Button>
      </div>
    );
  }
}
