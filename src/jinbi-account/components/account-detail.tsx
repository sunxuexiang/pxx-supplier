import React from 'react';

import { Row, Col, Button } from 'antd';
import { history, util, cache } from 'qmkit';

import '../index.less';

function AccountDetail(props) {
  const { setVisible } = props;
  const isThird = util.isThirdStore();
  //商家权限数据
  const authInfo = JSON.parse(sessionStorage.getItem(cache.AUTHINFO));
  const { jingBiState } = authInfo;
  return (
    <Row type="flex" gutter={36} className="ja-detail-Row">
      <Col className="ja-detail-col">
        <p>账户鲸币余额</p>
        <span className="ja-detail-money">¥{props.accountMoney}</span>
      </Col>
      <Col className="ja-detail-col">
        <p>鲸币充值</p>
        <Button
          type="primary"
          disabled={jingBiState !== 1}
          onClick={() => history.push('/jinbi-recharge')}
        >
          充值
        </Button>
      </Col>
      <Col className="ja-detail-col">
        <p>鲸币提现</p>
        <Button
          type="primary"
          disabled={!(props.accountMoney && props.accountMoney > 0)}
          onClick={() => history.push('/jinbi-withdrawal')}
        >
          提现
        </Button>
      </Col>
      <Col className="ja-detail-col">
        <p>鲸币退款</p>
        <Button
          type="primary"
          disabled={jingBiState !== 1}
          onClick={() => setVisible(true)}
        >
          退款
        </Button>
      </Col>
    </Row>
  );
}

export default AccountDetail;
