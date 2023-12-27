import * as React from 'react';
import { Modal, Table } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

const deliverWayList = [
  { key: 1, value: '第三方物流' },
  { key: 2, value: '快递到家' },
  { key: 4, value: '免费店配' }
];

@Relax
export default class PresaleModal extends React.Component {
  props: {
    relaxProps?: {
      presaleDetail: IMap;
      presaleVisible: boolean;
      loading: boolean;
      closePresaleModal: Function;
      presaleSubmit: Function;
    };
  };

  static relaxProps = {
    presaleDetail: 'presaleDetail',
    presaleVisible: 'presaleVisible',
    loading: 'loading',
    closePresaleModal: noop,
    presaleSubmit: noop
  };

  render() {
    const { relaxProps } = this.props;
    const { presaleVisible, loading, presaleDetail } = relaxProps;
    //处理赠品
    const gifts = (presaleDetail.get('gifts')
      ? presaleDetail.get('gifts')
      : fromJS([])
    ).map((gift) =>
      gift
        .set('skuName', `【赠品】${gift.get('skuName')}`)
        .set('levelPrice', 0)
        .set('isGift', true)
    );
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }
    ];
    return (
      <Modal
        maskClosable={false}
        title="订单到货"
        visible={presaleVisible}
        centered
        okText="预售到货"
        onOk={this._handleSubmit}
        onCancel={this.onClose}
        width={1200}
        destroyOnClose
        confirmLoading={loading}
      >
        {presaleVisible && (
          <Table
            bordered
            dataSource={presaleDetail
              .get('tradeItems')
              .concat(gifts)
              .toJS()}
            columns={columns}
            pagination={false}
            scroll={{ y: 550 }}
          />
        )}
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { presaleSubmit } = this.props.relaxProps;
    presaleSubmit(this.onClose);
  };

  onClose = () => {
    const { closePresaleModal } = this.props.relaxProps;
    closePresaleModal();
  };
}
