import React from 'react';
import { Relax } from 'plume2';

import styled from 'styled-components';
import GoodsList from './goods-list';
import VouchersList from './vouchers-list';
import BagList from './bag-list';
import TotalList from './total-list';

const GreyBox = styled.div`
  background: #f7f7f7;
  padding: 15px;

  p {
    color: #333333;
    line-height: 25px;
  }
`;

@Relax
export default class BasicInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: any;
      currentLiveListTab: string;
    };
  };

  static relaxProps = {
    detail: 'detail',
    currentLiveListTab: 'currentLiveListTab'
  };

  render() {
    const { detail, currentLiveListTab } = this.props.relaxProps;

    return (
      <div>
        <GreyBox>
          <p>标题：{detail.roomName}</p>
          <p>直播时间：{detail.dateTime}</p>
          <p>
            主播昵称/账号：{detail.anchorName}/{detail.customerAccount}
          </p>
        </GreyBox>
        <div style={{ marginTop: 20 }}>
          {currentLiveListTab == '1' && <GoodsList />}
          {currentLiveListTab == '2' && <VouchersList />}
          {currentLiveListTab == '3' && <BagList />}
          {currentLiveListTab == '4' && <TotalList />}
        </div>
      </div>
    );
  }
}
