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
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      erpNos: string;
      ffskus: string;
      onSearch: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',

    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    erpNos: 'erpNos',
    ffskus: 'ffskus',
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
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      erpNos,
      ffskus
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
    const wareList = JSON.parse(localStorage.getItem('warePageList')) || [];
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
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="所属仓库"
                defaultValue="0"
                showSearch
                onChange={(value) => {
                  onFormFieldChange({
                    key: 'wareId',
                    value: value != '0' ? value : null
                  });
                }}
              >
                {wareList.map((ware) => {
                  return <Option value={ware.wareId}>{ware.wareName}</Option>;
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <Input.TextArea
              placeholder="请输入spu的erp编码"
              value={ffskus}
              style={{ width: 956 }}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'ffskus',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input.TextArea
              placeholder="请输入sku的erp编码"
              value={erpNos}
              style={{ width: 956 }}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'erpNos',
                  value: e.target.value
                });
              }}
            />
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
