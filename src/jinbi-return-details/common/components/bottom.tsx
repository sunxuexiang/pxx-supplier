import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax, IMap } from 'plume2';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { List } from 'immutable';

type TList = List<IMap>;

const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;
@withRouter
@Relax
export default class Bottom extends React.Component<any, any> {
  props: {
    relaxProps?: {
      joinLevel: any;
      customerLevels: TList;
    };
  };

  static relaxProps = {
    joinLevel: 'joinLevel',
    customerLevels: ['customerLevels']
  };

  render() {
    const { joinLevel, customerLevels } = this.props.relaxProps;
    let levelName = '';
    if (joinLevel == '-1') {
      levelName = '全平台客户';
    } else if (joinLevel == '0') {
      levelName = '全部等级';
    } else if (joinLevel != '') {
      levelName = joinLevel
        .split(',')
        .map((info) =>
          customerLevels
            .filter((v) => v.get('customerLevelId') == info)
            .getIn([0, 'customerLevelName'])
        )
        .filter((v) => v)
        .join('，');
    }

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>目标客户：</span>
              {levelName}
            </Col>
          </Row>
        </GreyBg>
      </div>
    );
  }
}
