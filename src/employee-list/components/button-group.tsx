import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, Dropdown, Menu, Icon, message, Checkbox } from 'antd';
import { AuthWrapper, noop, history, cache } from 'qmkit';
import { List } from 'immutable';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import { IMap, IList } from 'typings/globalType';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchDelete: Function;
      onBatchEnable: Function;
      toggleAdjustModal: Function;
      toggleConnectModal: Function;
      onBatchDissmiss: Function;
      switchModal: Function;
      selected: List<string>;
      onAdd: Function;
      onBatchSetEmployee: Function;
      hide: boolean;
      toggleHide: Function;
      onBatchActivateAccount: Function;
      onFormChange: Function;
      searchForm: IMap
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: 'selected',
    onBatchEnable: noop,
    switchModal: noop,
    onAdd: noop,
    toggleAdjustModal: noop,
    toggleConnectModal: noop,
    onBatchDissmiss: noop,
    onBatchSetEmployee: noop,
    hide: 'hide',
    toggleHide: noop,
    onBatchActivateAccount: noop,
    onFormChange: noop,
    searchForm: 'searchForm'
  };

  render() {
    const { onAdd, toggleHide, onFormChange, searchForm } = this.props.relaxProps;

    return (
      <div
        // className="handle-bar"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <AuthWrapper functionName={'updateEmployee'}>
            <Button type="primary" onClick={() => onAdd()}>
              新增
            </Button>
          </AuthWrapper>

          {checkMenu('enableDisableEmployee,deleteEmployee') && (
            <Dropdown
              overlay={this._menu()}
              getPopupContainer={() => document.getElementById('page-content')}
            >
              <Button style={{ marginLeft: 10 }}>
                批量操作
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}
        </div>

        <div style={styles.box}>
          <Checkbox id="hide-employee" checked={searchForm.get('isHiddenDimission')} onChange={(e) => {
            toggleHide((e.target as any).checked ? '1' : '0');
            onFormChange({
              field: 'isHiddenDimission',
              value: (e.target as any).checked ? 1 : 0
            });
          }}>
            隐藏离职员工
          </Checkbox>
        </div>
      </div>
    );
  }

  _menu = () => {
    return (
      <Menu>
        <Menu.Item key={0}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href="javascript:;" onClick={() => this._batchEnable()}>
              批量启用
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={1}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href="javascript:;" onClick={() => this._batchDisable()}>
              批量停用
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={2}>
          <AuthWrapper functionName={'deleteEmployee'}>
            <a href="javascript:;" onClick={() => this._batchDelete()}>
              批量删除
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={3}>
          <AuthWrapper functionName={'f_batch_ajust_department'}>
            <a href="javascript:;" onClick={() => this._batchAdjust()}>
              调整部门
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={4}>
          <AuthWrapper functionName={'f_batch_set_employee'}>
            <a href="javascript:;" onClick={() => this._batchSetEmployee()}>
              批量设为业务员
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={5}>
          <AuthWrapper functionName={'f_batch_employee_dismiss'}>
            <a href="javascript:;" onClick={() => this._batchSetLeave()}>
              批量设为离职
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={6}>
          <AuthWrapper functionName={'f_batch_employee_active'}>
            <a href="javascript:;" onClick={() => this._batchActive()}>
              会员账户激活
          </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={7}>
          <AuthWrapper functionName={'f_batch_employee_connect'}>
            <a href="javascript:;" onClick={() => this._batchConnect()}>
              业务员交接
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item key={8}>
          <a
            href="javascript:;"
            onClick={() => {
              history.push({
                pathname: '/employee-import'
              });
            }}
          >
            批量导入
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  _batchEnable = () => {
    const { onBatchEnable, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    this.showConfirm('批量启用', '是否确认启用已选员工?', onBatchEnable);
  };

  _batchDisable = () => {
    const { switchModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    switchModal('');
  };

  _batchDelete = () => {
    const { onBatchDelete, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    this.showConfirm(
      '批量删除',
      '是否确认删除已选员工和他的账号？删除后将无法登录。',
      onBatchDelete
    );
  };

  _batchAdjust = () => {
    const { toggleAdjustModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    } else {
      toggleAdjustModal();
    }
  };

  _batchConnect = () => {
    const { toggleConnectModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    } else {
      toggleConnectModal();
    }
  };

  _batchSetEmployee = () => {
    const { onBatchSetEmployee, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    this.showConfirm(
      '批量设为业务员',
      '业务员可绑定会员，并只能查看自己会员相关的数据，确定设为业务员？',
      onBatchSetEmployee
    );
  };

  _batchSetLeave = () => {
    const { onBatchDissmiss, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    this.showConfirm(
      '批量设为离职',
      '设为离职后，员工只能查看和删除，如需交接，请提前操作',
      onBatchDissmiss
    );
  };

  _batchActive = () => {
    const { onBatchActivateAccount, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    this.showConfirm(
      '会员账户激活',
      '激活会员账户将会以员工手机号为准给所选员工创建商城账户，并发送一条短信通知，确定要激活？',
      onBatchActivateAccount
    );
  };

  showConfirm(title: string, content: string, onOk: Function) {
    confirm({
      title: title,
      content: content,
      onOk() {
        onOk();
      }
    });
  }
}

const styles = {
  box: {
    padding: 10,
    paddingLeft: 20
  },
}
