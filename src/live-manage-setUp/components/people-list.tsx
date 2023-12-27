import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber, Button } from 'antd';
import { IList } from 'typings/globalType';
import { noop, history } from 'qmkit';

const { Column } = Table;

@Relax
export default class PeopleList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      LivePeopleList: IList;
      onLivePeopleList: Function;
      changeLiveInfo: Function;
      onPeopleSave: Function;
      peopleValue: any;
    };
  };

  static relaxProps = {
    LivePeopleList: 'LivePeopleList',
    peopleValue: 'peopleValue',
    onLivePeopleList: noop,
    changeLiveInfo: noop,
    onPeopleSave: noop
  };
  render() {
    const {
      LivePeopleList,
      onLivePeopleList,
      changeLiveInfo,
      onPeopleSave,
      peopleValue
    } = this.props.relaxProps;
    return (
      <div>
        <Table
          rowKey="title"
          dataSource={LivePeopleList.toJS()}
          pagination={false}
        >
          <Column
            key="title"
            align="center"
            dataIndex="title"
            title="真实在线人数范围值"
          />
          <Column
            key="value"
            align="center"
            title="在线人数增长系数"
            render={(_row, row, index) => {
              return (
                <InputNumber
                  min={0}
                  max={99999}
                  precision={0}
                  value={_row.value}
                  onChange={(val) => {
                    onLivePeopleList('value', val, index);
                  }}
                />
              );
            }}
          />
        </Table>

        <div style={{ marginTop: '10px' }}>
          <span>基础在线人数：</span>
          <InputNumber
            min={0}
            max={99999}
            precision={0}
            value={peopleValue}
            onChange={(val) => {
              changeLiveInfo('peopleValue', val);
            }}
          />
          <span style={{ fontSize: '12px', color: 'red' }}>
            该人数为设置的固定人数，设置后将会在已有规则的基础上再增加这部分人数
          </span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Button type="primary" onClick={() => onPeopleSave()}>
            保存
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => (history as any).go(-1)}
          >
            返回
          </Button>
        </div>
      </div>
    );
  }
}
