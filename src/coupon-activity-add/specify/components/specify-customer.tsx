import * as React from 'react';
import { DataGrid } from 'qmkit';
import styled from 'styled-components';
import { Row, Col, Button } from 'antd';
import { CustomerModel } from 'biz';

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const { Column } = DataGrid;

/**
 * 选择客户组件
 */
export default class ChooseCustomer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // 弹出框可见性
      modalVisible: false
    };
  }

  render() {
    const {
      chooseCustomerList,
      selectedCustomerIds,
      chooseCustomerBackFun,
      onDelCustomer,
      maxLength
    } = this.props;
    // const { getFieldDecorator } = form;
    return (
      <div>
        <Button
          type="primary"
          icon="plus"
          onClick={() => this.changeModalVisible(true)}
        >
          添加客户
        </Button>
        <Row type="flex" justify="start" style={styles.box}>
          {chooseCustomerList &&
            chooseCustomerList.map((record) => {
              return (
                <Col span={4} key={record.customerId}>
                  <p style={styles.item}>
                    {/* {record.customerName}
                  &nbsp; */}
                    {record.customerAccount}
                    <a
                      style={{ margin: 10 }}
                      href="javascript:void(0)"
                      onClick={() => onDelCustomer(record.customerId)}
                    >
                      删除
                    </a>
                  </p>
                </Col>
              );
            })}
        </Row>

        <CustomerModel
          limitChildFlag={true}
          maxLength={maxLength}
          visible={this.state.modalVisible}
          selectedCustomerIds={selectedCustomerIds}
          selectedRows={chooseCustomerList}
          onOkBackFun={(customerIds, rows) => {
            this.changeModalVisible(false);
            chooseCustomerBackFun(customerIds, rows);
          }}
          onCancelBackFun={() => this.changeModalVisible(false)}
        />
      </div>
    );
  }

  /**
   * 设置弹窗可见性
   */
  changeModalVisible = (flag) => {
    this.setState({
      modalVisible: flag
    });
  };
}

const styles = {
  title: {
    background: '#f7f7f7',
    height: 32,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  } as any,
  box: {
    padding: 20,
    paddingBottom: 0
  },
  item: {
    height: 40
  }
};
