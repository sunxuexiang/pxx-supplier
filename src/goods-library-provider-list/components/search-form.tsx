import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select, Tree } from 'antd';
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
      likeProviderName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    likeProviderName: 'likeProviderName',
    goodsSource: 0,

    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    onSearch: noop,
    onFormFieldChange: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList'
  };

  render() {
    const {
      likeGoodsName,
      likeProviderName,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList
    } = this.props.relaxProps;
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
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
              addonBefore="供应商名称"
              value={likeProviderName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeProviderName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="平台类目"
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
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
