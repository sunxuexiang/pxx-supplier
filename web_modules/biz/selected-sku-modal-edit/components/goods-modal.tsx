import * as React from 'react';
import { fromJS } from 'immutable';
import { StoreProvider } from 'plume2';
import { message, Modal } from 'antd';
import AppStoreSku from '../store';
import GoodsGrid from './goods-grid';
import { IList } from '../../../typings/globalType';
@StoreProvider(AppStoreSku, { debug: __DEV__ })
export default class GoodsModal extends React.Component<any, any> {
  store: AppStoreSku;
  props: {
    marketingId: String,
    selectedSkuIds: any;
    selectedRows: any;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    // 仓库id
    wareId?: number;
    //搜索参数
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
    //是否排除提价商品
    limitNOSpecialPriceGoods: boolean;
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if((this.props.visible!=nextProps.nextProps)&&nextProps.visible==true){
      this.store.onGoodsActorFormBut('selectedRows',fromJS(nextProps.selectedRows)||fromJS([]));
      this.store.onGoodsActorFormBut('selectedSkuIds',fromJS(nextProps.selectedSkuIds)||fromJS([]));
      this.store.onSeachFormBut('wareId',nextProps.wareId||null);
      this.store.onGoodsActorFormBut('visible',nextProps.visible);
      this.store.onGoodsActorFormBut('okBackFun',this.props.onOkBackFun);
      this.store.init();
    }
    // this.setState({
    //   selectedRows: nextProps.selectedRows? nextProps.selectedRows: fromJS([]),
    //   selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
    //   wareId: nextProps.wareId
    // });
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      application,
      limitNOSpecialPriceGoods,
    } = this.props;
    // const {marketingId,wareId} = this.state;
    const {selectedSkuIds,selectedRows}=this.store.state().toJS()
    return (
      <Modal  maskClosable={false}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>款商品
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          this.store.onGoodsActorFormBut('isExportModalData',0);
          onOkBackFun({
            isExportModalData:0,
            selectedSkuIds:fromJS(selectedSkuIds),
            selectedRows:fromJS(selectedRows)
          });
          // if (application === 'saleType') {
          //   onOkBackFun(selectedSkuIds, fromJS(selectedRows));
          // } else if (skuLimit && selectedSkuIds.length > skuLimit) {
          //   message.error('最多选择20种赠品');
          // } else {
          //   onOkBackFun(selectedSkuIds,fromJS(selectedRows));
          // }
        }}
        onCancel={() => { onCancelBackFun();}}
        okText="确认" cancelText="取消">
        {
          <GoodsGrid
            limitNOSpecialPriceGoods={limitNOSpecialPriceGoods}
          />
        }
      </Modal>
    );
  }
}
