import React from 'react';
import { Relax } from 'plume2';
import { Modal } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class MainModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      mainVisible: boolean;
      deleteModal: Function;
      deleteModalContent: any;
      doDelete: Function;
      mainModal: Function;
      setMainVisible: Function; //关闭弹框
    };
  };

  static relaxProps = {
    // 弹框是否显示
    mainVisible: 'mainVisible',
    // 关闭弹框
    deleteModal: noop,
    deleteModalContent: 'deleteModalContent',
    doDelete: noop,
    mainModal: noop,
    setMainVisible: noop
  };

  render() {
    const { mainVisible } = this.props.relaxProps;
    if (mainVisible) {
      Modal.warning({
        title: '提示',
        content:
          '您当前还未设置主账号，请设置主账号，主账号用于与店铺之间结算打款，非常重要！',
        okText: '现在设置',
        onOk: () => {
          this._closeModal();
        }
      });
    }
    return <div />;
    // const {mainVisible} = this.props.relaxProps;
    // if (!mainVisible) {
    //   return null;
    // }
    // return (
    //   <div>
    //     <Modal  maskClosable={false}
    //       title="提示"
    //        
    //       visible={mainVisible}
    //       onCancel={noop}
    //       closable={false}
    //       onOk={() =>this._handleOK()}
    //       okText="现在设置"
    //       width={360}
    //     >
    //       <Alert
    //         message="您当前还未设置主账号，请设置主账号，主账号用于与店铺之间结算打款，非常重要！"
    //         style={{backgroundColor: '#fff', color: '#999', paddingRight: 10, marginLeft: -16,}}
    //         banner
    //       />
    //     </Modal>
    //   </div>
    // );
  }

  // /**
  //  * 设置（即关闭）
  //  * @private
  //  */
  // _handleOK=()=>{
  //   const { mainModal } =this.props.relaxProps
  //   mainModal()
  // }

  /**
   * 关闭
   * @private
   */
  _closeModal = () => {
    const { setMainVisible } = this.props.relaxProps;
    setMainVisible();
  };
}
