import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, AuthWrapper, SelectGroup } from 'qmkit';
import { GoodsLiveModal } from 'biz';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onGoodsChange: Function;
      onAddGoodsChange: Function;
      selectedSkuIds: IList;
      selectedRows: IList;
      modalVisible: Button;
      onDelGoods: Function;
      onCancelLiveStreamSendStatus: Function;
      LiveGoodsSearchData: any;
      onSearchLiveGoods: Function;
      queryLiveGoodsPage: Function;
      liveRoomId: any;
    };
  };

  static relaxProps = {
    onGoodsChange: noop,
    onAddGoodsChange: noop,
    selectedSkuIds: 'selectedSkuIds',
    selectedRows: 'selectedRows',
    modalVisible: 'modalVisible',
    onDelGoods: noop,
    LiveGoodsSearchData: 'LiveGoodsSearchData',
    liveRoomId: 'liveRoomId',
    onCancelLiveStreamSendStatus: noop,
    onSearchLiveGoods: noop,
    queryLiveGoodsPage: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      selectedSkuIds,
      selectedRows,
      LiveGoodsSearchData,
      onSearchLiveGoods,
      queryLiveGoodsPage,
      modalVisible,
      onDelGoods,
      onCancelLiveStreamSendStatus,
      liveRoomId,
      onGoodsChange
    } = this.props.relaxProps;

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'ERP编码'}
              value={LiveGoodsSearchData.get('likeGoodsInfoNo')}
              onChange={(e) => {
                onSearchLiveGoods('likeGoodsInfoNo', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              value={LiveGoodsSearchData.get('likeGoodsName')}
              onChange={(e) => {
                onSearchLiveGoods('likeGoodsName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="直播商品状态"
              value={LiveGoodsSearchData.get('goodsStatus')}
              onChange={(value) => {
                onSearchLiveGoods('goodsStatus', value);
              }}
            >
              <Select.Option key="" value="">
                全部
              </Select.Option>
              <Select.Option key="0" value="0">
                下架
              </Select.Option>
              <Select.Option key="1" value="1">
                上架
              </Select.Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={() => {
                queryLiveGoodsPage();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <AuthWrapper functionName="f_live_list_management_add1">
          <Button
            type="primary"
            onClick={() => {
              this.openGoodsModal();
            }}
            style={{ marginRight: '10px' }}
          >
            添加商品
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_live_list_management_push1">
          <Button
            type="primary"
            onClick={() => {
              onCancelLiveStreamSendStatus([], 1);
            }}
            style={{ marginRight: '10px' }}
          >
            批量上架
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              onCancelLiveStreamSendStatus([], 0);
            }}
          >
            批量下架
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_live_list_management_del1">
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              onDelGoods([]);
            }}
          >
            批量移除
          </Button>
        </AuthWrapper>

        <GoodsLiveModal
          visible={modalVisible}
          isWare={true}
          liveId={liveRoomId}
          showValidGood={true}
          checkAddedGood={true}
          // wareId={null}
          selectedSkuIds={selectedSkuIds.toJS()}
          selectedRows={selectedRows.toJS()}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </div>
    );
  }

  openGoodsModal = () => {
    const { onGoodsChange } = this.props.relaxProps;
    onGoodsChange('modalVisible', true);
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIdsList, selectedRowsList) => {
    const { onAddGoodsChange } = this.props.relaxProps;
    console.log(selectedRowsList, 'selectedRowsList');
    let list = selectedRowsList.size ? selectedRowsList.toJS() : [];
    // list[0]?.goods?.goodsType
    onAddGoodsChange(fromJS([...new Set(selectedSkuIdsList)]));
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    const { onGoodsChange } = this.props.relaxProps;
    onGoodsChange('modalVisible', false);
  };
}
