import React from 'react';
import { Relax } from 'plume2';
import { checkAuth, ExportModal } from 'qmkit';
import { Dropdown, Icon, Menu } from 'antd';

import {
  Form,
  Input,
  Button,
  Select,
  Tree,
  message,
  Modal,
  AutoComplete
} from 'antd';
import {
  noop,
  SelectGroup,
  TreeSelectGroup,
  InputGroupCompact,
  AutoCompleteGroup,
  AuthWrapper
} from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { IMap } from '../../../typings/globalType';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const AutoOption = AutoComplete.Option;

/**
 * 商品搜索项
 * @type {{"0": string; "1": string}}
 */
const GOODS_OPTION_TYPE = {
  0: 'likeGoodsName',
  1: 'likeGoodsInfoNo'
};

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      onSearch: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      storeMap: IMap;
      selectedSkuKeys: IList;
      onBatchChecked: Function;
      queryStoreByName: Function;
      onFieldChange: Function;
      switchShowModal: Function;
      onExportByIds: Function;
      synchronizeSpecialGoods: Function;
      onExportModalShow: Function;
      exportModalData: IMap;
      onExportModalHide: Function;
    };
  };

  state = {
    cateTitle: '全部'
  };

  static relaxProps = {
    // 查询条件form
    form: 'form',
    onSearch: noop,
    onFormFieldChange: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    storeMap: 'storeMap',
    selectedSkuKeys: 'selectedSkuKeys',
    exportModalData: 'exportModalData',
    queryStoreByName: noop,
    onBatchChecked: noop,
    onFieldChange: noop,
    switchShowModal: noop,
    onExportByIds: noop,
    synchronizeSpecialGoods: noop,
    onExportModalShow: noop,
    onExportModalHide: noop
  };

  render() {
    const {
      form,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      storeMap,
      synchronizeSpecialGoods,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('goodsCateList'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="商品名称"
              style={{ width: 180 }}
              dataSource={this._renderOption(storeMap.toJS())}
              // onSelect={(value) =>
              //     onFormFieldChange({ key: 'goodInfoName', value: value })
              // }
              onChange={(value) =>
                onFormFieldChange({ key: 'likeGoodsName', value: value })
              }
              allowClear={true}
              placeholder=""
            />
          </FormItem>
          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="SKU编码"
              style={{ width: 180 }}
              dataSource={this._renderOption(storeMap.toJS())}
              // onSelect={(value) =>
              //   onFormFieldChange({ key: 'goodInfoNo', value: value })
              // }
              onChange={(value) =>
                onFormFieldChange({ key: 'likeGoodsInfoNo', value: value })
              }
              allowClear={true}
              placeholder=""
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="价格范围"
              precision={2}
              startMin={0}
              start={form.get('specialPriceFirst')}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'specialPriceFirst', value: val })
              }
              endMin={0}
              end={form.get('specialPriceLast')}
              onEndChange={(val) =>
                onFormFieldChange({ key: 'specialPriceLast', value: val })
              }
            />
          </FormItem>

          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="批次号"
              style={{ width: 180 }}
              dataSource={this._renderOption(storeMap.toJS())}
              // onSelect={(value) =>
              //     onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
              // }
              onChange={(value) =>
                onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
              }
              allowClear={true}
              placeholder=""
            />
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="品牌"
                style={{ width: 180 }}
                defaultValue="全部"
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  onFormFieldChange({ key: 'brandId', value });
                }}
              >
                <Option key="-1" value="-1">
                  全部
                </Option>
                {brandList.map((v, i) => {
                  return (
                    <Option key={i} value={v.get('brandId') + ''}>
                      {v.get('brandName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="平台类目"
              style={{ width: 180 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              defaultValue={-1}
              onChange={(value) => {
                onFormFieldChange({ key: 'cateId', value });
              }}
            >
              <TreeNode key="-1" value="-1" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                onSearch();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <AuthWrapper functionName={'f_goods_special_sku_edit'}>
          <div className="handle-bar">
            <Button onClick={() => this._batchExport()}>批量导出</Button>
            <Button type="primary" onClick={this._onBatchChecked}>
              批量设价
            </Button>
            <Button
              type="primary"
              onClick={() => {
                synchronizeSpecialGoods();
              }}
            >
              同步特价仓
            </Button>
          </div>
        </AuthWrapper>

        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = (storeMap) => {
    let optionArray = [];
    for (let store in storeMap) {
      optionArray.push(<AutoOption key={store}>{storeMap[store]}</AutoOption>);
    }
    return optionArray;
  };

  _menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_setprice">
            <a
              href="javascript:;"
              onClick={() => {
                this._onBatchChecked();
              }}
            >
              批量设价
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                this._handleBatchExport();
              }}
            >
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );
  };
  /**
   * 批量设价
   * @private
   */
  _onBatchChecked = () => {
    const {
      selectedSkuKeys,
      onFieldChange,
      switchShowModal
    } = this.props.relaxProps;
    if (selectedSkuKeys.count() < 1) {
      message.error('请先选择特价商品');
      return;
    }
    onFieldChange('goodsInfoIdList', selectedSkuKeys);
    switchShowModal(true);
  };
  /*  /!**
   * 批量导出
   *!/
  _handleBatchExport = () => {
    const { selectedSkuKeys, onExportByIds } = this.props.relaxProps;
    if (selectedSkuKeys.count() < 1) {
      message.error('请先选择要导出的特价商品');
      return;
    }
    // onFieldChange('goodsInfoIdList', selectedSkuKeys);
    // switchShowModal(true);

    onExportByIds(selectedSkuKeys);
  };*/

  /**
   * 批量导出
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息'
    });
  }
}
