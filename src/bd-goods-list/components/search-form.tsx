import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree, AutoComplete } from 'antd';
import {
  noop,
  SelectGroup,
  TreeSelectGroup,
  InputGroupCompact,
  AutoCompleteGroup
} from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { string } from 'prop-types';
import { convertCompilerOptionsFromJson } from 'typescript';
import { fromJS } from 'immutable';
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
const AutoOption = AutoComplete.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeErpNo: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      goodsType: string;
      specialPriceFirst: any;
      specialPriceLast: any;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    likeErpNo: 'likeErpNo',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    onSearch: noop,
    onFormFieldChange: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    goodsType: 'goodsType',
    specialPriceFirst: 'specialPriceFirst',
    specialPriceLast: 'specialPriceLast'
  };

  render() {
    const {
      likeGoodsName,
      likeErpNo,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onEditSkuNo,
      goodsType,
      specialPriceFirst,
      specialPriceLast
    } = this.props.relaxProps;
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('storeCateId')}
            value={item.get('storeCateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={likeGoodsName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="ERP编码"
              value={likeErpNo}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeErpNo',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="SPU编码"
              value={likeGoodsNo}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsNo',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="SKU编码"
              value={likeGoodsInfoNo}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsInfoNo',
                  value: e.target.value
                });
                onEditSkuNo(e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="店铺分类"
              defaultValue="全部"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={(value) => {
                onFormFieldChange({ key: 'storeCateId', value });
              }}
            >
              <TreeNode key="-1" value="-1" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="品牌"
                defaultValue="全部"
                showSearch
                // optionFilterProp="children"
                onChange={(value) => {
                  onFormFieldChange({ key: 'brandId', value });
                }}
              >
                <Option key="-1" value="-1"> 全部 </Option>
                {brandList.map((v,i) => {
                  return (
                    <Option  value={v.get('brandId') + ''} key={`${v.get('brandId')}_${i}`}>
                      {v.get('brandName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="销售类型"
                defaultValue="全部"
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'saleType', value });
                }}
              >
                <Option value="-1">全部</Option>
                <Option value="0">批发</Option>
                <Option value="1">零售</Option>
                <Option value="2">散批</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="商品类型"
                defaultValue="全部"
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'goodsType', value });
                }}
              >
                <Option value="">全部</Option>
                <Option value="1">特价商品</Option>
                <Option value="0">普通商品</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          {/* <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="囤货状态"
                defaultValue=""
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'stockUp', value });
                }}
              >
                <Option value="">全部</Option>
                <Option value="3">全部囤货状态</Option>
                <Option value="1">囤货中</Option>
                <Option value="2">已囤完</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem> */}
          <FormItem>
            <InputGroupCompact
              title="价格范围"
              precision={2}
              startMin={0}
              start={specialPriceFirst}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'specialPriceFirst', value: val })
              }
              endMin={0}
              end={specialPriceLast}
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
              // dataSource={this._renderOption(storeMap.toJS())}
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
          {/* <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="排序商品"
                defaultValue="全部"
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'goodsSeqFlag', value });
                }}
              >
                <Option value="">全部</Option>
                <Option value="0">未排序</Option>
                <Option value="1">已排序</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem> */}
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                onSearch();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
