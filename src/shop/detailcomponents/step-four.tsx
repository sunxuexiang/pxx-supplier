import React from 'react';
import styled from 'styled-components';
import { DataGrid } from 'qmkit';
import { Relax, IMap } from 'plume2';

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
    return (
      <div>
        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
            <GreyText>
              请录入您的建行结算账户，如需修改请在财务模块操作
            </GreyText>
          </div>

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
            <Column title="账户名" dataIndex="accountName" key="accountName" />
            <Column title="账号" dataIndex="bankNo" key="bankNo" />
            <Column title="支行/分行" dataIndex="bankBranch" key="bankBranch" />
          </DataGrid>
        </Content>
      </div>
    );
  }
}
