import React from 'react';
import { Relax } from 'plume2';
import { Modal, Alert } from 'antd';
import { noop } from 'qmkit';
import styled from 'styled-components';

const ListText = styled.div`
  line-height: 20px;
  color: #333333;
  span {
    color: #666666;
  }
  p {
    margin-top: 15px;
  }
`;

@Relax
export default class DeleteModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      deleteVisible: boolean;
      deleteModal: Function;
      deleteModalContent: any;
      doDelete: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    deleteVisible: 'deleteVisible',
    // 关闭弹框
    deleteModal: noop,
    deleteModalContent: 'deleteModalContent',
    doDelete: noop
  };

  render() {
    const {
      deleteVisible,
      deleteModalContent,
      doDelete
    } = this.props.relaxProps;
    if (!deleteVisible) {
      return null;
    }
    return (
      <div>
        <Modal  maskClosable={false}
          title="确认删除账号"
           
          visible={deleteVisible}
          onCancel={this._handleModelCancel}
          onOk={() => doDelete()}
          okText="确认删除"
          width={360}
        >
          {//已经确认过的，删除时候显示提示
          deleteModalContent.get('isReceived') == 1 ? (
            <Alert
              message="该收款账号经平台确认，如果您删除该账号，可能影响您店铺和平台的结算或者影响您的收款"
              style={{
                backgroundColor: '#fff',
                color: '#999',
                paddingRight: 0,
                marginLeft: -16,
                marginRight: -5
              }}
              banner
            />
          ) : null}
          <ListText>
            <p>
              <span>银行：</span>
              {deleteModalContent.get('bankName')}
            </p>
            <p>
              <span>账户名：</span>
              {deleteModalContent.get('accountName')}
            </p>
            <p>
              <span>账号：</span>
              {deleteModalContent.get('bankNo')}
            </p>
            <p>
              <span>支行：</span>
              {deleteModalContent.get('bankBranch')}
            </p>
          </ListText>
        </Modal>
      </div>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { deleteModal } = this.props.relaxProps;
    deleteModal();
  };
}
