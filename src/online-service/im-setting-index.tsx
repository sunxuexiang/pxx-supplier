import React from 'react';
import { Row, Col } from 'antd';
import './im-setting.less';
import { BreadCrumb, Const, Headline } from 'qmkit';
import { IMSettingMenuList } from './components/im-setting-menu-list';
import { IMFastReplySetting } from './components/fast-reply-setting';
// import { IMAutoReplySetting } from './components/im-auto-reply-setting';
import IMConvLimitSetting from './components/im-conv-limit-setting';
import { produce } from 'immer';
import { IMOfflineSetting } from './components/im-offline-setting';
import { IMAccountManager } from './components/im-account-manager';
import IMSettingModal from './components/im-setting-modal';

export default class IMSettingIndex extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectKeys: ['0'],
      modalVisible: false,
      // 0: 添加分组，1：编辑分组, 2:添加回复内容, 3:编辑回复内容
      modalType: 0,
      modalData: '',
      // 当前选中的节点
      selectNodeInfo: {
        isSelect: false,
        level: 0,
        groupId: 0,
        parentGroupId: 0,
        name: ''
      },
      onSelect: (selectedKeys, info) => {
        if (selectedKeys.length == 0) {
          return;
        }
        this.setState(
          produce(this.state, (draft) => {
            draft.selectKeys = selectedKeys;
          })
        );
      },
      onModalVisible: (visible: Boolean, type: Number, extData: any) => {
        this.setState(
          produce(this.state, (draft) => {
            draft.modalType = type || 0;
            draft.modalData = extData;
            draft.modalVisible = visible;
          })
        );
      },
      updateSelectNodeInfo: (node) => {
        this.setState(
          produce(this.state, (draft) => {
            draft.selectNodeInfo = node;
          })
        );
      }
    };
  }

  render() {
    // 自动回复已经移动到运营后台 <IMAutoReplySetting />,
    const rightViews = [
      <IMFastReplySetting {...this.state} />,
      <IMOfflineSetting />,
      <IMConvLimitSetting />,
      <IMAccountManager />
    ];
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="功能设置" />
          <Row>
            <Col span={4}>
              <IMSettingMenuList {...this.state} />
            </Col>
            <Col span={20}>{rightViews[this.state.selectKeys[0]]}</Col>
          </Row>
        </div>
        <IMSettingModal {...this.state} />
      </div>
    );
  }
}
