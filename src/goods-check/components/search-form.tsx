import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';

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

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
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
    cateList: 'cateList'
  };

  render() {
    const {
      likeGoodsName,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onEditSkuNo
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
              // defaultValue="全部"
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
              </SelectGroup>
            </SelectBox>
          </FormItem>
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
