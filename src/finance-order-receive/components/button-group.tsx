import React from 'react';
import { Relax } from 'plume2';
import { Button, Popconfirm, Dropdown, Icon, Menu } from 'antd';
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
    return (
      <div className="handle-bar">
        <Dropdown
          overlay={this._menu()}
          getPopupContainer={() => document.getElementById('page-content')}
        >
          <Button>
            批量操作<Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );
  }
  _menu = () => {
    const { onBatchDestory, onBatchConfirm } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item>
          <Popconfirm
            title="是否确认批量收款？"
            onConfirm={() => {
              onBatchConfirm();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">批量确认</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="是否确认批量作废？"
            onConfirm={() => {
              onBatchDestory();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">批量作废</a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
  };
}
