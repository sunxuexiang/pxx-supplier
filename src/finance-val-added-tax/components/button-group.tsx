import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Modal } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onAdd: Function;
      batchConfirm: Function;
      searchForm: IMap;
    };
  };

  static relaxProps = {
    onAdd: noop,
    batchConfirm: noop,
    searchForm: 'searchForm'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onAdd, searchForm } = this.props.relaxProps;
    const checkState = searchForm.get('checkState');

    return (
      <div className="handle-bar">
        <Button type="primary" onClick={() => onAdd()}>
          新增资质
        </Button>
        {checkState === '0' && (
          <Button onClick={() => this._showBatchAudit()}>批量审核</Button>
        )}
      </div>
    );
  }

  _showBatchAudit = () => {
    const { batchConfirm } = this.props.relaxProps;
    const confirm = Modal.confirm;
    confirm({
      title: '通过增票资质',
      content: '是否确认通过已选增票资质？',
      onOk() {
        batchConfirm();
      },
      onCancel() {}
    });
  };
}
