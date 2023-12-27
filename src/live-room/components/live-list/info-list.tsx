import React from 'react';
import { Relax, Store } from 'plume2';
import { noop, Const, history } from 'qmkit';
import { Modal, Table } from 'antd';
import { fromJS } from 'immutable';
import Moment from 'moment';
import { IList } from 'typings/globalType';
import GoodsModal from './select-goods-modal/goods-modal';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      liveListGoodsDataList: IList;
      chooseSkuIds: IList;
      disabledSkuIds: IList;
      goodsRows: IList;
      goodsModalVisible: boolean;
      current: number;
      goodsInfoList: IList;
      fieldsValue: Function;
      queryPage: Function;
      onCancelBackFun: Function;
      onOkBackFun: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    chooseSkuIds: 'chooseSkuIds',
    disabledSkuIds: 'disabledSkuIds',
    goodsRows: 'goodsRows',
    liveListGoodsDataList: 'liveListGoodsDataList',
    current: 'current',
    goodsModalVisible: 'goodsModalVisible',
    goodsInfoList: 'goodsInfoList',
    fieldsValue: noop,
    queryPage: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      chooseSkuIds,
      disabledSkuIds,
      goodsRows,
      goodsModalVisible,
      current,
      queryPage,
      onCancelBackFun,
      goodsInfoList
    } = this.props.relaxProps;

    return (
      <div>
        <Table
          rowKey="list"
          loading={loading}
          dataSource={dataList.toJS()}
          columns={this._columns}
          pagination={{
            total,
            pageSize,
            current: current,
            onChange: (pageNum, pageSize) => {
              queryPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
        />
        <GoodsModal
          visible={goodsModalVisible}
          onCancelBackFun={onCancelBackFun}
          showValidGood={true}
          selectedSkuIds={chooseSkuIds.toJS()}
          disabledSkuIds={disabledSkuIds.toJS()}
          selectedRows={goodsRows.toJS()}
          onOkBackFun={this._onOkBackFun}
          skuLimit={200}
          goodsInfoList={goodsInfoList}
        />
      </div>
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '直播标题',
      render: (rowInfo) => {
        return <div>{rowInfo ? rowInfo : '-'}</div>;
      }
    },
    {
      key: 'startTime',
      dataIndex: 'startTime',
      title: '直播时间',
      render: (text, record) => {
        return (
          <div>
            {record.startTime && record.endTime ? (
              <div>
                <div>
                  {Moment(record.startTime)
                    .format(Const.TIME_FORMAT)
                    .toString() + '~'}
                </div>
                <div>
                  {' '}
                  {Moment(record.endTime).format(Const.TIME_FORMAT).toString()}
                </div>
              </div>
            ) : (
              '-'
            )}
          </div>
        );
      }
    },
    {
      key: 'anchorName',
      dataIndex: 'anchorName',
      title: '主播昵称',
      reder: (rowInfo) => {
        return <div>{rowInfo ? rowInfo : '-'}</div>;
      }
    },
    {
      key: 'liveGoods',
      dataIndex: 'liveGoods',
      title: '直播商品',
      render: (row, rowInfo) => {
        const { liveListGoodsDataList } = this.props.relaxProps;
        const data = liveListGoodsDataList.toJS()[rowInfo.roomId].slice(0, 5);
        return (
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {data.length > 0 ? (
              data.map((item) => {
                return (
                  <img
                    src={item.coverImgUrl}
                    style={{ width: 40, height: 40, marginLeft: 5 }}
                  />
                );
              })
            ) : (
              <div>-</div>
            )}
          </div>
        );
      }
    },
    {
      // 0: 直播中, 3: 未开始, 4: 已结束, 5: 禁播, 1: 暂停中, 2: 异常, 6: 已过期
      key: 'liveStatus',
      dataIndex: 'liveStatus',
      title: '直播状态',
      render: (data) => {
        let liveStatus = '-';
        switch (data) {
          case 0:
            liveStatus = '直播中';
            break;
          case 1:
            liveStatus = '暂停中';
            break;
          case 2:
            liveStatus = '异常';
            break;
          case 3:
            liveStatus = '未开始';
            break;
          case 4:
            liveStatus = '已结束';
            break;
          case 5:
            liveStatus = '禁播';
            break;
          case 6:
            liveStatus = '已过期';
            break;
          default:
            break;
        }

        return liveStatus;
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    const status = rowInfo.liveStatus;
    return (
      <div>
        {(status == 0 || status == 1 || status == 3) && (
          <a style={styles.edit} onClick={() => this._add(rowInfo)}>
            添加商品
          </a>
        )}
        <a
          onClick={() =>
            history.push({ pathname: `/live-detail/${rowInfo.id}` })
          }
        >
          查看
        </a>
      </div>
    );
  };

  _add = (rowInfo) => {
    const { liveListGoodsDataList } = this.props.relaxProps;
    const data = liveListGoodsDataList.toJS()[rowInfo.roomId];

    //编辑id和详细信息
    let skuIds = [];
    let goodsRows = [];
    data.map((item) => {
      console.log('debug88 data=', item);
      skuIds.push(item.goodsId);
      goodsRows.push(item);
    });

    //开模态框
    this.props.relaxProps.fieldsValue({
      field: 'goodsModalVisible',
      value: true
    });

    //设置点击的房间号
    this.props.relaxProps.fieldsValue({
      field: 'roomId',
      value: rowInfo.roomId
    });

    //选中的内容
    this.props.relaxProps.fieldsValue({
      field: 'chooseSkuIds',
      value: fromJS(skuIds)
    });
    this.props.relaxProps.fieldsValue({
      field: 'disabledSkuIds',
      value: fromJS(skuIds)
    });
    this.props.relaxProps.fieldsValue({
      field: 'goodsRows',
      value: fromJS(goodsRows)
    });
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    // this.props.form.validateFields((_errs) => {});
    this.props.relaxProps.onOkBackFun(skuIds, rows);
  };
}
