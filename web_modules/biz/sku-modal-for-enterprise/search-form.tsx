import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup, InputGroupCompact } from 'qmkit';

import * as webapi from './webapi';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      searchParams: {
        // 模糊条件-商品名称
        likeGoodsName: '',
        // 模糊条件-SKU编码
        likeGoodsInfoNo: '',
        // 店铺分类
        storeCateId: 0,
        // 上下架状态
        addedFlag: null,
        // 门店价范围参数1
        salePriceFirst: null,
        // 门店价范围参数2
        salePriceLast: null,
        // 库存范围参数1
        stockFirst: null,
        // 库存范围参数2
        stockLast: null,
        //销售类型
        saleType: 1
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          // 模糊条件-商品名称
          likeGoodsName: '',
          // 模糊条件-SKU编码
          likeGoodsInfoNo: '',
          // 店铺分类
          storeCateId: 0,
          // 上下架状态
          addedFlag: null,
          // 门店价范围参数1
          salePriceFirst: null,
          // 门店价范围参数2
          salePriceLast: null,
          // 库存范围参数1
          stockFirst: null,
          // 库存范围参数2
          stockLast: null,
          // 销售类型
          saleType: 1
        }
      }, () => this.searchBackFun());
    }
  }

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (cateList, cateParentId) =>
    cateList
      .filter((cate) => cate.get('cateParentId') === cateParentId)
      .map((item) => {
        const childCates = cateList.filter(
          (cate) => cate.get('cateParentId') == item.get('storeCateId')
        );
        if (childCates && childCates.count()) {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            >
              {this.loop(childCates, item.get('storeCateId'))}
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

  render() {
    const { searchParams } = this.state;
    const { cates } = this.state;

    return (
      this.props.visible && <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              placeholder="商品名称"
              value={searchParams.likeGoodsName}
              onChange={(e) =>
                this.paramsOnChange('likeGoodsName', e.target.value)
              }
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="SKU编码"
              placeholder="SKU编码"
              value={searchParams.likeGoodsInfoNo}
              onChange={(e) =>
                this.paramsOnChange('likeGoodsInfoNo', e.target.value)
              }
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="店铺分类"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={(value) => this.paramsOnChange('storeCateId', value)}
              value={searchParams.storeCateId}
            >
              <TreeNode key="0" value="0" title="全部">
                {this.loop(fromJS(cates), 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="上下架"
              defaultValue="全部"
              onChange={(value) => this.paramsOnChange('addedFlag', value)}
            >
              <Option key="" value="">
                全部
              </Option>
              <Option key="0" value="0">
                下架
              </Option>
              <Option key="1" value="1">
                上架
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="门店价"
              precision={2}
              startMin={0}
              start={searchParams.salePriceFirst}
              onStartChange={(val) =>
                this.paramsOnChange('salePriceFirst', val)
              }
              endMin={0}
              end={searchParams.salePriceLast}
              onEndChange={(val) => this.paramsOnChange('salePriceLast', val)}
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="库存"
              startMin={0}
              start={searchParams.stockFirst}
              onStartChange={(val) => this.paramsOnChange('stockFirst', val)}
              endMin={0}
              end={searchParams.stockLast}
              onEndChange={(val) => this.paramsOnChange('stockLast', val)}
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

  /**
   * 初始化弹窗数据
   * @returns {Promise<void>}
   */
  init = async () => {
    const fetchCates = await webapi.fetchCateList();

    const { res: catesRes } = fetchCates as any;
    const { context: cates } = catesRes;
    this.setState({ cates: cates});
  };

  /**
   * 查询条件变更
   * @param key
   * @param value
   */
  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams: searchParams });
  };

  /**
   * 条件搜索
   */
  searchBackFun = () => {
    this.checkSwapInputGroupCompact();

    let { searchParams } = this.state;
    this.props.searchBackFun(searchParams);
  };

  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const { searchParams } = this.state;
    const {
      salePriceFirst,
      salePriceLast,
      stockFirst,
      stockLast
    } = searchParams;

    if (parseFloat(salePriceFirst) > parseFloat(salePriceLast)) {
      searchParams['salePriceFirst'] = salePriceLast;
      searchParams['salePriceLast'] = salePriceFirst;
    }
    if (stockFirst > stockLast) {
      searchParams['stockFirst'] = stockLast;
      searchParams['stockLast'] = stockFirst;
    }

    this.setState({ searchParams: searchParams });
  };
}
