import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
const { Column } = DataGrid;
import { List } from 'immutable';

type TList = List<any>;

@Relax
export default class SelfListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selfDataList: TList;
      onView: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selfDataList: ['selfDataList'],
    onView: noop
  };

  render() {
    const {
      selfDataList,
      loading,
      onView
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="customerLevelId"
        pagination={false}
        dataSource={selfDataList.toJS()}
      >
        <Column
          title="等级名称"
          key="customerLevelName"
          dataIndex="customerLevelName"
        />

        <Column
          title="等级徽章"
          key="rankBadgeImg"
          dataIndex="rankBadgeImg"
          render={(rankBadgeImg) =>
            rankBadgeImg ? (
              <img
                src={rankBadgeImg}
                style={{ width: 40, height: 40, display: 'inline-block' }}
              />
            ) : (
                '-'
              )}
        />

        <Column
          title="所需成长值"
          key="growthValue"
          dataIndex="growthValue"
        />

        <Column
          title="操作"
          render={(rowInfo) => {
            const { customerLevelId } = rowInfo;
            return (
              <div>
                <a
                  href="javascript:void(0);"
                  onClick={() => onView(customerLevelId)}
                // style={{ marginRight: 5 }}
                >
                  查看
                </a>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}

