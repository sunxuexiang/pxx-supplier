import React from 'react';

import { Row, Col, Modal } from 'antd';

import '../index.less';

function ReturnModal(props) {
  const { detailVisible, setDetailVisible, currentDetail } = props;
  return (
    <Modal
      title="查看详情"
      visible={detailVisible}
      footer={null}
      onCancel={() => setDetailVisible(false)}
    >
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          用户账号：
        </Col>
        <Col span={19}> {currentDetail?.customerAccount} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          赠送金额：
        </Col>
        <Col span={19}> {currentDetail?.coinNum} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          {currentDetail?.recordType === 1 ? '订单号' : '退单号'}：
        </Col>
        <Col span={19}> {currentDetail?.orderNo} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          推送金蝶单号：
        </Col>
        <Col span={19}> {currentDetail?.orderNo} </Col>
      </Row>
    </Modal>
  );
}

export default ReturnModal;
