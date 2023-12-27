import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tag } from 'antd';
import styled from 'styled-components';
import { DataGrid } from 'qmkit';

const { Column } = DataGrid;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
`;

const NoBorder = styled.div`
  tr > td {
    border-bottom: none;
  }
`;

const AddBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  h2 {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
  }

  > div {
    width: 500px;
  }
`;
const BlueText = styled.span`
  color: #f56c1d;
  font-weight: bold;
`;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const offlineAccount = company.get('offlineAccount');
    const info = company.get('storeInfo').toJS();

    return (
      <div>
        <Content>
          <div>
            <Red>*</Red>
            <H2>
              建行商家编号：
              {info && info.constructionBankMerchantNumber
                ? info.constructionBankMerchantNumber
                : '--'}
            </H2>
          </div>
          <div style={{ marginTop: 20 }}>
            <Red>*</Red>
            <H2>
              交易手续费：
              {info && info.shareRatio ? `${info.shareRatio}%` : '--'}
            </H2>
          </div>

          <div style={{ marginTop: 20 }}>
            <Red>*</Red>
            <H2>
              结算周期：
              {info && info.settlementCycle
                ? `${info.settlementCycle}天`
                : '--'}
            </H2>
          </div>
        </Content>

        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
          </div>
        </Content>

        <Content>
          <NoBorder>
            <DataGrid
              dataSource={offlineAccount.toJS()}
              pagination={false}
              rowKey="accountId"
            >
              <Column
                title="序号"
                dataIndex="accountId"
                key="accountId"
                render={(_text, _rowData: any, index) => {
                  return index + 1;
                }}
              />
              <Column title="银行" dataIndex="bankName" key="bankName" />
              <Column
                title="账户名"
                dataIndex="accountName"
                key="accountName"
              />
              <Column title="账号" dataIndex="bankNo" key="bankNo" />
              <Column
                title="支行/分行"
                dataIndex="bankBranch"
                key="bankBranch"
              />
              <Column
                title="收到平台打款"
                dataIndex="isReceived"
                key="isReceived"
                render={(isReceived) => (isReceived == 1 ? '已验证' : '未验证')}
              />
              <Column
                title="主账号"
                align="center"
                dataIndex="isDefaultAccount"
                key="isDefaultAccount"
                render={(isDefaultAccount) =>
                  isDefaultAccount == 1 ? '是' : '否'
                }
              />
            </DataGrid>
          </NoBorder>
        </Content>
      </div>
    );
  }
}
