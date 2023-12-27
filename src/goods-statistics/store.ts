/**
 * Created by feitingting on 2017/10/18.
 */
import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import BrandActor from './actor/brand-actor';
import TotalActor from './actor/total-actor';
import SkuActor from './actor/sku-actor';
import CateActor from './actor/cate-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new BrandActor(),
      new TotalActor(),
      new SkuActor(),
      new CateActor()
    ];
  }

  /**
   * 选择不同报表类型时
   * @param flag
   * @returns {Promise<void>}
   */
  changeTableFlag = async (flag: number) => {
    this.dispatch('table:flag', flag);
    const type = this.state().get('dateFlag');
    this.transaction(() => {
      //隐藏弹框
      this.dispatch('download:hide');
      //输入的商品名称清空
      this.dispatch('goods:emptyName');
      //品牌和分类ID清空
      this.dispatch('cate:emptyCateId');
      this.dispatch('brand:emptyBrandId');
      this.dispatch('cate:cateName', '全部分类');
      this.dispatch('brand:brandName', '全部品牌');
    });
    //将全部的排序指标恢复成默认
    await this.selectIndicatorsOrder(null, '2', '1');
    await this.getTableByDate(flag, type);
  };

  /**
   * 初始化
   * @returns {Promise<void>}
   */
  init = async (defaultSkuColumns, defaultCateColumns, defaultBrandColumns) => {
    //获取商品的全部分类和品牌的全部分类
    const { res: cates } = await webapi.getAllCates();
    const { res: brands } = await webapi.getAllBrands();
    this.transaction(() => {
      this.dispatch('cate:list', fromJS(cates.context));
      this.dispatch('brand:list', fromJS(brands.context));
      //日期的type值
      this.dispatch('date:flag', 0);
      this.dispatch('goods:columns', defaultSkuColumns);
      this.dispatch('cate:columns', defaultCateColumns);
      this.dispatch('brand:columns', defaultBrandColumns);
    });
    //获取当天的商品概况和商品报表
    const { res: goodsGeneral } = await webapi.getGoodsTotal({ selectType: 0 });
    if (goodsGeneral.code == Const.SUCCESS_CODE) {
      //商品概况
      this.dispatch('goods:total', goodsGeneral.context);
    } else {
      message.error('商品概况获取失败');
    }
    const { res: skuTable } = await webapi.getskuList({
      selectType: 0,
      pageNum: 1,
      pageSize: this.state().get('skuPageSize'),
      sortCol: this.state().get('skuSortCol'),
      sortType: this.state().get('skuSortType'),
      keyword: this.state().get('skuName'),
      wareId:this.state().get('wareId'),

    });

    if (skuTable.code == Const.SUCCESS_CODE) {
      //商品报表
      this.transaction(() => {
        this.dispatch('cate:columns', defaultCateColumns);
        this.dispatch('brand:columns', defaultBrandColumns);
        this.dispatch('goods:skuCurrent', 1);
        this.dispatch(
          'goods:skuTotal',
          skuTable.context.totalPages * this.state().get('skuPageSize')
        );
        this.dispatch('goods:skuTable', skuTable.context);
      });
    } else {
      message.error('获取商品报表失败');
    }
  };

  /**
   * 获取商品概况
   * @param param
   * @returns {Promise<void>}
   */
  getGoodsInfo = async (param) => {
    // const [type] = param;
    let type;
    if (param) {
      type = param[2];
    } else {
      type = this.state().get('dateFlag');
    }
    this.transaction(() => {
      //隐藏弹框
      this.dispatch('download:hide');
      //日期的type值
      this.dispatch('date:flag', type);
      //输入的商品名称清空
      this.dispatch('goods:emptyName');
      //品牌和分类ID清空
      this.dispatch('cate:emptyCateId');
      this.dispatch('brand:emptyBrandId');
      this.dispatch('cate:cateName', '全部分类');
      this.dispatch('brand:brandName', '全部品牌');
    });

    //获取商品概况
    const { res: goodTotal } = await webapi.getGoodsTotal({
      selectType: type == 0 || type == 1 || type == 2 || type == 3 ? type : 0,
      dateStr: type != 0 && type != 1 && type != 2 && type != 3 ? type : '',
      wareId:this.state().get('wareId'),
    });
    if (goodTotal.code == Const.SUCCESS_CODE) {
      this.dispatch('goods:total', goodTotal.context);
    } else {
      message.error('商品概况获取失败');
    }
    //获取报表（根据分类标记flag的值决定获取哪一个报表,0:商品报表，1:分类报表，2:品牌报表）
    const tableFlag = this.state().get('tableFlag');
    //使用哪种页码
    await this.getTableByDate(tableFlag, type);
  };

  /**
   * 获取商品报表
   * @param type
   * @returns {Promise<void>}
   */
  getskuTable = async (type, pageNum, pageSize) => {
    let pageNo = this.state().get('skuPageSize') == pageSize ? pageNum : 1;
    const { res } = await webapi.getskuList({
      selectType: type == 0 || type == 1 || type == 2 || type == 3 ? type : 0,
      dateStr: type != 0 && type != 1 && type != 2 && type != 3 ? type : '',
      pageNum: pageNo,
      pageSize: pageSize,
      sortCol: this.state().get('skuSortCol'),
      //type为空，默认为1
      sortType: this.state().get('skuSortType'),
      keyword: this.state().get('skuName'),
      wareId:this.state().get('wareId'),
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('goods:skuCurrent', pageNo);
        this.dispatch('goods:pageSize', pageSize);
        this.dispatch('cate:pageSize', pageSize);
        this.dispatch('brand:pageSize', pageSize);
        this.dispatch('goods:skuTotal', res.context.totalPages * pageSize);
        this.dispatch('goods:skuTable', res.context);
      });
    } else {
      message.error('商品报表获取失败');
    }
  };

  /**
   * 获取分类报表
   * @param type
   * @returns {Promise<void>}
   */
  getcateTable = async (type, pageNum, pageSize) => {
    let pageNo = this.state().get('catePageSize') == pageSize ? pageNum : 1;
    const { res } = await webapi.getcateList({
      selectType: type == 0 || type == 1 || type == 2 || type == 3 ? type : 0,
      dateStr: type != 0 && type != 1 && type != 2 && type != 3 ? type : '',
      pageNum: pageNo,
      pageSize: pageSize,
      sortCol: this.state().get('cateSortCol'),
      sortType: this.state().get('cateSortType'),
      id: this.state().get('cateId') == 0 ? '' : this.state().get('cateId'),
      wareId:this.state().get('wareId'),
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('goods:cateCurrent', pageNo);
        this.dispatch('goods:pageSize', pageSize);
        this.dispatch('cate:pageSize', pageSize);
        this.dispatch('brand:pageSize', pageSize);
        this.dispatch('goods:cateTotal', res.context.totalPages * pageSize);
        this.dispatch('goods:cateTable', res.context);
      });
    } else {
      message.error('分类报表获取失败');
    }
  };

  /**
   * 获取品牌报表
   * @param type
   * @returns {Promise<void>}
   */
  getbrandTable = async (type, pageNum, pageSize) => {
    let pageNo = this.state().get('brandPageSize') == pageSize ? pageNum : 1;
    const { res } = await webapi.getbrandList({
      selectType: type == 0 || type == 1 || type == 2 || type == 3 ? type : 0,
      dateStr: type != 0 && type != 1 && type != 2 && type != 3 ? type : '',
      pageNum: pageNo,
      pageSize: pageSize,
      sortCol: this.state().get('brandSortCol'),
      sortType: this.state().get('brandSortType'),
      wareId:this.state().get('wareId'),
      id: this.state().get('brandId') == '-1' ? '' : this.state().get('brandId'),
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('goods:brandCurrent', pageNo);
        this.dispatch('goods:pageSize', pageSize);
        this.dispatch('cate:pageSize', pageSize);
        this.dispatch('brand:pageSize', pageSize);
        this.dispatch('goods:brandTotal', res.context.totalPages * pageSize);
        this.dispatch('goods:brandTable', res.context);
      });
    } else {
      message.error('品牌报表获取失败');
    }
  };

  async warehouseBut(){
    // const {res:warehouse} = await webapi.wareHousePage({pageNum:0,pageSize:10000});
    // this.dispatch('form:warehouseList', warehouse.context.wareHouseVOPage.content);
    this.dispatch('form:warehouseList', []);
  };

  getChangeWare=async(value)=>{
    this.dispatch('goods:wareId', value);
    //获取当天的商品概况和商品报表
    this.getGoodsInfo(null);
    const flag = this.state().get('flag');
    const type = this.state().get('dateFlag');
    await this.getTableByDate(flag, type);
  }

  /**
   * 根据适当的报表和日期类型请求恰当的接口
   * @param flag
   * @param type
   * @returns {Promise<void>}
   */
  getTableByDate = async (flag, type) => {
    //根据不同的报表类型传递不同的pageSize和pageNum
    if (flag == 0) {
      //商品报表
      await this.getskuTable(
        type,
        this.state().get('skuPageNum'),
        this.state().get('skuPageSize')
      );
    }
    if (flag == 1) {
      //分类报表
      await this.getcateTable(
        type,
        this.state().get('catePageNum'),
        this.state().get('catePageSize')
      );
    }
    if (flag == 2) {
      //品牌报表
      await this.getbrandTable(
        type,
        this.state().get('brandPageNum'),
        this.state().get('brandPageSize')
      );
    }
  };

  /**
   * 分页
   * @param pageNum
   * @param pageSize
   * @returns {Promise<void>}
   */
  onPagination = async (pageNum, pageSize) => {
    const tableFlag = this.state().get('tableFlag');
    const dateFlag = this.state().get('dateFlag');
    if (tableFlag == 0) {
      await this.getskuTable(dateFlag, pageNum, pageSize);
    }
    if (tableFlag == 1) {
      await this.getcateTable(dateFlag, pageNum, pageSize);
    }
    if (tableFlag == 2) {
      await this.getbrandTable(dateFlag, pageNum, pageSize);
    }
  };

  /**
   * 排序事件
   * @param pagination
   * @param filters
   * @param soter
   * @private
   */
  changeOrder = async (pagination, _filters, sorter, sortedInfo) => {
    const tableFlag = this.state().get('tableFlag');
    //组合排序规则
    const field = sorter.field;
    let sortCol = await this.getSortColByValue(field);
    let sortType = '';
    //若非空对象
    sortType =
      sorter.order == 'descend' ? '1' : sorter.order == 'ascend' ? '0' : '1';
    if (tableFlag == 0) {
      //商品统计排序类型
      this.transaction(() => {
        this.dispatch('goods:sortCol', sortCol);
        this.dispatch('goods:sortType', sortType);
      });
    } else if (tableFlag == 1) {
      //分类统计排序类型
      this.transaction(() => {
        this.transaction(() => {
          this.dispatch('cate:sortCol', sortCol);
          this.dispatch('cate:sortType', sortType);
        });
      });
    } else {
      //品牌统计排序类型
      this.transaction(() => {
        this.transaction(() => {
          this.dispatch('brand:sortCol', sortCol);
          this.dispatch('brand:sortType', sortType);
        });
      });
    }
    //排序，请求第一页
    if (sortedInfo) {
      if (
        sortedInfo.columnKey != sorter.field ||
        sortedInfo.order != sorter.order
      ) {
        this.onPagination(1, pagination.pageSize);
      } else {
        this.onPagination(pagination.current, pagination.pageSize);
      }
    } else {
      this.onPagination(pagination.current, pagination.pageSize);
    }
  };

  /**
   * 监听商品名称或SKU编码状态值
   * @param name
   */
  changeSkuName = (name: string) => {
    this.dispatch('goods:skuName', name);
  };

  /**
   * 分类名称下拉框内容改变触发事件
   * @param name
   */
  // cateName = async (name: string) => {
  //   await this.dispatch('cate:cateName', name)
  //   this.onPagination(this.state().get('catePageNum'), this.state().get('catePageSize'))
  // }

  /**
   * 品牌名称下拉框内容改变触发事件
   * @param name
   */
  // brandName = async (name: string) => {
  //   await this.dispatch('brand:brandName', name)
  //   this.onPagination(this.state().get('brandPageNum'), this.state().get('brandPageSize'))
  // }

  /**
   *根据商品名称或SKU查询
   */
  searchSkuName = () => {
    this.onPagination(
      this.state().get('skuPageNum'),
      this.state().get('skuPageSize')
    );
  };

  /**
   * 改变自定义指标
   * @param tableflag
   */
  changeColumns = async (tableflag: number, value: any) => {
    //判断有无选中默认指标
    let count = 0;
    let sortType = '';
    let sortCol = '';
    value.map((v) => {
      v.dataIndex = v.key;
      if (v.key == 'orderNum') {
        count++;
      }
    });
    if (count == 0) {
      //默认按选择的第一个指标降序排列
      sortCol = await this.getSortColByValue(value[0].key);
      sortType = '1';
    } else {
      //仍然按默认的排列(下单件数降序)
      sortCol = '2';
      sortType = '1';
    }
    //每次选择的时候进行重新排序
    await this.selectIndicatorsOrder(tableflag, sortCol, sortType);
    //商品报表自定义指标
    if (tableflag == 0) {
      this.dispatch('goods:columns', value);
    } else if (tableflag == 1) {
      this.dispatch('cate:columns', value);
    } else {
      this.dispatch('brand:columns', value);
    }
  };

  /**
   * 根据分类名称搜索
   * @param value
   */
  searchByCateName = (key, value) => {
    const dateFlag = this.state().get('dateFlag');
    this.transaction(() => {
      this.dispatch('cate:cateId', key && key != '全部分类' ? key : '0');
      this.dispatch('cate:cateName', key ? value : '全部分类');
    });
    this.getcateTable(
      dateFlag,
      this.state().get('catePageNum'),
      this.state().get('catePageSize')
    );
  };

  /**
   * 根据品牌名称搜索
   * @param name
   */
  searchByBrandName = (value) => {
    const dateFlag = this.state().get('dateFlag');
    //全部的特殊处理
    if (value == '-1') {
      this.transaction(() => {
        this.dispatch('brand:brandId', '-1');
        this.dispatch('brand:brandName', '全部品牌');
      });
    } else {
      this.transaction(() => {
        this.dispatch('brand:brandId', value.split('_')[0]);
        this.dispatch('brand:brandName', value.split('_')[1]);
      });
    }
    this.getbrandTable(
      dateFlag,
      this.state().get('brandPageNum'),
      this.state().get('brandPageSize')
    );
  };

  /**
   * 根据value返回sortCol的值
   */
  getSortColByValue = (value) => {
    let sortCol = '';
    switch (value) {
      //下单笔数
      case 'orderCount':
        sortCol = '0';
        break;
      //下单金额
      case 'orderAmt':
        sortCol = '1';
        break;
      //下单件数
      case 'orderNum':
        sortCol = '2';
        break;
      //付款商品数
      case 'payNum':
        sortCol = '3';
        break;
      //退单笔数
      case 'returnOrderCount':
        sortCol = '4';
        break;
      //退单金额
      case 'returnOrderAmt':
        sortCol = '5';
        break;
      //退单件数
      case 'returnOrderNum':
        sortCol = '6';
        break;
      //转化率
      case 'orderConversion':
        sortCol = '7';
        break;
      // 付款金额
      case 'payAmt':
        sortCol = '8';
        break;
      default:
        //默认为2
        sortCol = '2';
        break;
    }
    return sortCol;
  };

  /**
   * 每次选择自定义指标的时候都重新排序
   */
  selectIndicatorsOrder = async (
    tableFlag: number,
    sortCol: string,
    sortType: string
  ) => {
    if (tableFlag == 0) {
      this.transaction(() => {
        this.dispatch('goods:sortCol', sortCol);
        this.dispatch('goods:sortType', sortType);
      });
      //都从第一页开始
      await this.onPagination(1, this.state().get('skuPageSize'));
    } else if (tableFlag == 1) {
      this.transaction(() => {
        this.dispatch('cate:sortCol', sortCol);
        this.dispatch('cate:sortType', sortType);
      });
      await this.onPagination(1, this.state().get('catePageSize'));
    } else {
      this.transaction(() => {
        this.dispatch('brand:sortCol', sortCol);
        this.dispatch('brand:sortType', sortType);
      });
      await this.onPagination(1, this.state().get('brandPageSize'));
    }
  };

  /**
   * 报表下载弹框
   */
  showModal = () => {
    this.dispatch('download:show');
  };

  hideModal = () => {
    this.dispatch('download:hide');
  };
}
