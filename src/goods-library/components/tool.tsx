import * as React from 'react';
import { Relax } from 'plume2';
import { Button, message, Modal } from 'antd';
import { IList } from 'typings/globalType';
import { noop } from 'qmkit';

const confirm = Modal.confirm;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      onImport: Function;
      onImportAll: Function;

      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    onImport: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    onImportAll: noop
  };

  render() {
    return (
      <div className="handle-bar">
        <Button onClick={this._spuCheckedFunc}>批量导入</Button>
        <Button onClick={this._spuCheckedAllFunc}>全部导入</Button>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { onImport, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量导入选中的商品？',
      onOk() {
        onImport(selectedSpuKeys);
      }
    });
  };

  _spuCheckedAllFunc = () => {
    const { onImportAll } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '是否确定导入全部商品，此操作可能花费您几秒到几分钟的时间',
      onOk() {
        onImportAll();
      }
    });
  };
}
