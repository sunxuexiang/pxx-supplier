import React from 'react';

import { Row, Col, Button, Modal } from 'antd';
import { history, util } from 'qmkit';

import '../index.less';

function DetailModal(props) {
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
          商家账号：
        </Col>
        <Col span={19}> {currentDetail?.customerAccount} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          用户账号：
        </Col>
        <Col span={19}> {currentDetail?.customerAccount} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          充值人：
        </Col>
        <Col span={19}> {currentDetail?.operatorName} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          充值金额：
        </Col>
        <Col span={19}> {currentDetail?.rechargeBalance} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          订单号：
        </Col>
        <Col span={19}> {currentDetail?.orderNo} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          退单号：
        </Col>
        <Col span={19}> {currentDetail?.returnOrderNo} </Col>
      </Row>
      <Row className="ja-detail-modal-row">
        <Col span={5} className="ja-detail-modal-title">
          备注：
        </Col>
        <Col span={19}> {currentDetail?.remark} </Col>
      </Row>
    </Modal>
  );
}

export default DetailModal;
