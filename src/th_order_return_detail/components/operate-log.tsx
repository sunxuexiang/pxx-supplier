import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Table, Button, Collapse } from 'antd';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';

enum operatorDic {
  BOSS = '平台',
  CUSTOMER = '客户',
  THIRD = '第三方',
  SUPPLIER = '商家',
  PLATFORM = '平台'
}

const columns = [
  {
    title: '操作方',
    dataIndex: 'operator',
    key: 'operator',
    render: operator => {
      return operatorDic[operator.platform];
    }
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operatorName',
    // render: operator =>  operator.name.substr(0,3) + "****" + operator.name.substr(7)
    render: operator => operator.name
  },
  {
    title: '时间',
    dataIndex: 'eventTime',
    key: 'eventTime',
    render: t => moment(t).format(Const.TIME_FORMAT)
  },
  {
    title: '操作类别',
    dataIndex: 'eventType',
    key: 'eventType'
  },
  {
    title: '操作日志',
    dataIndex: 'eventDetail',
    key: 'eventDetail',
    width: '50%',
    // render: (val) => val.substring(0,val.length-8) + '****'
  }
];

const customPanelStyle = {
  paddingRight: 10
};

/**
 * 操作日志
 */
@Relax
export default class OperateLog extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail'
  };

  constructor(props) {
    super(props);
  }

  state = {
    showLogs: false
  };

  render() {
    const { detail } = this.props.relaxProps;
    const detailObj = detail.toJS();
    const logs = detailObj.returnEventLogs || [];
    const Panel = Collapse.Panel;
    return (
      <div style={styles.container}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Collapse>
            <Panel header="操作日志" key="1" style={customPanelStyle}>
              <Table
                bordered
                rowKey={() => Math.random().toString()}
                columns={columns}
                dataSource={logs}
                pagination={false}
              />
            </Panel>
          </Collapse>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  },

  table: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  }
} as any;
