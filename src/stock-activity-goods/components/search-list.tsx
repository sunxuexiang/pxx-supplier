import React from 'react';

import { Tabs } from 'antd';
import { noop,history } from 'qmkit';
import { Relax } from 'plume2';
import List from './list';
import { SelectedGoodsModal } from 'biz';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';
import SearchHead from './search-head';
import ListButton from './list-button'
const {TabPane}=Tabs;

@Relax
export default class StockActivityGoodsTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      wareId: string;
      marketingId:string;
      onTabChange: Function;
      selectedRows:IList;
      selectedSkuIds:IList;
      skuSelectedBackFun:Function;
      onChange:Function;
      openGoodsModal:Function;
      modalVisible:boolean;
    };
  };

  static relaxProps = {
    wareId: 'wareId',
    marketingId:'marketingId',
    modalVisible:'modalVisible',
    onTabChange: noop,
    onChange:noop,
    skuSelectedBackFun:noop,
    openGoodsModal:noop,
  };

  render() {
    const { onTabChange, wareId,marketingId,skuSelectedBackFun,onChange,modalVisible} = this.props.relaxProps;
    const wareHouseVOPage = JSON.parse(localStorage.getItem('warePage')) || [];
    return (
      <div>
        <Tabs activeKey={String(wareId)} onChange={(key) => onTabChange(key)} tabPosition="top">
          {wareHouseVOPage.map((item, i) => (
            <TabPane tab={item.wareName} key={String(item.wareId)} >
            </TabPane>
          ))}
        </Tabs>
        <SearchHead />
        <ListButton />
        <List />
        <SelectedGoodsModal
          visible={modalVisible}
          marketingId={marketingId}
          wareId={Number(wareId)}
          selectedSkuIds={fromJS([])}
          selectedRows={fromJS([])}
          onOkBackFun={(e)=>skuSelectedBackFun(e)}
          onCancelBackFun={()=>{onChange('modalVisible',false)}}
          limitNOSpecialPriceGoods={true}
        />
      </div>
    );
  }




}
