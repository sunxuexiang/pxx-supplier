import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber, Button } from 'antd';
import { IList } from 'typings/globalType';
import { noop, history } from 'qmkit';

const { Column } = Table;

@Relax
export default class PraiseList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      LivePraiseList: IList;
      onLivePraiseList: Function;
      changeLiveInfo: Function;
      onPraiseSave: Function;
      praiseValue: any;
    };
  };

  static relaxProps = {
    LivePraiseList: 'LivePraiseList',
    praiseValue: 'praiseValue',
    onLivePraiseList: noop,
    changeLiveInfo: noop,
    onPraiseSave: noop
  };
  render() {
    const {
      LivePraiseList,
      onLivePraiseList,
      changeLiveInfo,
      onPraiseSave,
      praiseValue
    } = this.props.relaxProps;
    return (
      <div>
        <Table
          rowKey="title"
          dataSource={LivePraiseList.toJS()}
          pagination={false}
        >
          <Column
            key="title"
            align="center"
            dataIndex="title"
            title="真实点赞数范围值"
          />
          <Column
            key="value"
            align="center"
            title="在线点赞数增长系数"
            render={(_row, row, index) => {
              return (
                <InputNumber
                  min={0}
                  max={99999}
                  precision={0}
                  value={_row.value}
                  onChange={(val) => {
                    onLivePraiseList('value', val, index);
                  }}
                />
              );
            }}
          />
        </Table>

        <div style={{ marginTop: '10px' }}>
          <span>基础在线点赞数：</span>
          <InputNumber
            min={0}
            max={99999}
            precision={0}
            value={praiseValue}
            onChange={(val) => {
              changeLiveInfo('praiseValue', val);
            }}
          />
          <span style={{ fontSize: '12px', color: 'red' }}>
            该点赞数为设置的固定点赞数，设置后将会在已有规则的基础上再增加这部分点赞数
          </span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Button type="primary" onClick={() => onPraiseSave()}>
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
