import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { Const } from 'qmkit';
import moment from 'moment';
import styled from 'styled-components';

const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-bottom: 20px;
  margin-left: -28px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@Relax
export default class Info extends React.Component<any, any> {
  props: {
    relaxProps?: {
      storeInfo: any;
      applyEnterTime: any;
    };
  };

  static relaxProps = {
    storeInfo: 'storeInfo',
    applyEnterTime: 'applyEnterTime'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { storeInfo } = this.props.relaxProps;
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>店铺名称：</span>
              {storeInfo.get('storeName')}
            </Col>
            <Col span={16}>
              <span>入驻时间：</span>
              {storeInfo.get('applyEnterTime')
                ? moment(storeInfo.get('applyEnterTime')).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : '无'}
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span>商家编号：</span>
              {storeInfo.get('supplierCode')}
            </Col>
            <Col span={16}>
              <span>合同有效期：</span>
              {moment(storeInfo.get('contractStartDate'))
                .format(Const.DAY_FORMAT)
                .toString()}
              ---{moment(storeInfo.get('contractEndDate'))
                .format(Const.DAY_FORMAT)
                .toString()}
            </Col>
          </Row>
        </GreyBg>
      </div>
    );
  }
}
