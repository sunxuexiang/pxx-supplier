import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup } from 'qmkit';

import * as webapi from '../../webapi';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

enum LIKE_TYPE {
  LIKE_GOODS_NO = 'likeGoodsNo',
  LIKE_GOODS_INFO_NO = 'likeGoodsInfoNo'
}

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      brands: [],
      searchParams: {
        name: ''
      },
      likeType: LIKE_TYPE.LIKE_GOODS_INFO_NO
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          name: ''
        }
      });
    }
  }

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) =>
    cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter(
          (cate) => cate.get('cateParentId') == item.get('cateId')
        );
        if (childCates && childCates.count()) {
          return (
            <TreeNode
              key={item.get('cateId').toString()}
              value={item.get('cateId').toString()}
              title={item.get('cateName').toString()}
            >
              {this.loop(oldCateList, childCates, item.get('cateId'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId').toString()}
            value={item.get('cateId').toString()}
            title={item.get('cateName').toString()}
          />
        );
      });

  render() {
    const { searchParams } = this.state;
    const { cates, brands } = this.state;

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={searchParams.name}
              onChange={(e) => this.paramsOnChange('name', e.target.value)}
            />
          </FormItem>

          <Button
            type="primary"
            icon="search"
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              this.searchBackFun();
            }}
          >
            搜索
          </Button>
        </Form>
      </div>
    );
  }

  init = async () => {
    const fetchBrand = await webapi.fetchBrandList();
    const fetchCates = await webapi.fetchCateList();

    const { res: brandsRes } = fetchBrand as any;
    const { context: brands } = brandsRes;
    const { res: catesRes } = fetchCates as any;
    const { context: cates } = catesRes;

    this.setState({ brands: brands, cates: cates });
  };

  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams: searchParams });
  };

  searchBackFun = () => {
    const { searchParams, likeType } = this.state;
    let { likeValue, ...rest } = searchParams;
    rest[
      likeType == LIKE_TYPE.LIKE_GOODS_INFO_NO
        ? LIKE_TYPE.LIKE_GOODS_INFO_NO
        : LIKE_TYPE.LIKE_GOODS_NO
    ] = likeValue;
    this.props.searchBackFun(rest);
  };
}
