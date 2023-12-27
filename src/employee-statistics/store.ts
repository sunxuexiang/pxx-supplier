/**
 * Created by feitingting on 2017/10/21.
 */

import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import { message } from 'antd';
import ClientActor from './actor/client-actor';
import AchieveActor from './actor/achieve-acotr';
import * as webapi from './webapi';

//业务员业绩报表默认展示的列
const defalutAchieveColumns = [
  { title: '下单笔数', key: 'orderCount' },
  { title: '下单人数', key: 'customerCount' },
  { title: '下单金额', key: 'amount' },
  { title: '付款订单数', key: 'payCount' },
  { title: '付款人数', key: 'payCustomerCount' },
  { title: '付款金额', key: 'payAmount' }
];

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ClientActor(), new AchieveActor()];
  }

  /**
   * 初始化获取当天的数据
   * @returns {Promise<void>}
   */
  init = async () => {
    //全局时间类型
    this.dispatch('client:dateType', 0);
    this.dispatch('achieve:columns', defalutAchieveColumns);
    //初始化当天的数据
    await this.employeeStatistics(0);
  };

  /**
   * 获取业务员统计各项报表
   */
  employeeStatistics = async (params) => {
    let dateType;
    //接受数组的时候，取第三个值作为Type，非数组时候，type值为0
    if (params instanceof Array) {
      //获取日期标识，0:今天，1：昨天，2：近7天，3：近30天
      dateType = params[2];
      //特殊处理，年月格式21709而非2017-09
      if (dateType != 0 && dateType != 1 && dateType != 2 && dateType != 3) {
        dateType = dateType.split('-')[0] + dateType.split('-')[1];
      }
    } else {
      dateType = 0;
    }
    this.transaction(() => {
      //全局时间类型
      this.dispatch('client:dateType', dateType);
      //业绩报表搜索关键字清空
      this.dispatch('client:emptyName');
      //获客报表搜索关键字清空
      this.dispatch('achieve:emptyName');
    });
    if (dateType == 0 || dateType == 1) {
      await this.onClientPagination(
        1,
        this.state().get('clientPageSize'),
        this.state().get('clientSort')
      );
    } else {
      await this.onClientPagination(
        1,
        this.state().get('clientPageSize'),
        this.state().get('newlySort')
      );
    }
    const sort = await this.getAchieveSortName(
      this.state().get('achieveSortName'),
      this.state().get('achieveSortType')
    );
    await this.onAchievePagination(
      1,
      this.state().get('achievePageSize'),
      sort
    );
  };

  /**
   *获取业务员获客报表搜索关键词
   */
  changeClientEmployeeName = (value) => {
    this.dispatch('client:employeeName', value);
  };

  /**
   *获取业务员获客报表搜索关键词
   */
  changeAchieveEmployeeName = (value) => {
    this.dispatch('achieve:employeeName', value);
  };

  /**
   * 根据关键词查询
   */
  searchKeyWords = async (type) => {
    const dateType = this.state().get('dateType');
    if (type == 1) {
      const sort = await this.getAchieveSortName(
        this.state().get('achieveSortName'),
        this.state().get('achieveSortOrder')
      );
      //业绩报表
      await this.onAchievePagination(
        1,
        this.state().get('achievePageSize'),
        sort
      );
    } else {
      //获客报表(日期为今天或者昨天，获客报表的排序按照总数排序)
      if (dateType == 0 || dateType == 1) {
        await this.onClientPagination(
          1,
          this.state().get('clientPageSize'),
          this.state().get('clientSort')
        );
      } else {
        //选择其他的日期类型时，按照新增客户排序
        await this.onClientPagination(
          1,
          this.state().get('clientPageSize'),
          'NEWLY_DESC'
        );
      }
    }
  };

  /**
   * 业绩报表分页
   * @param pageNum
   * @param pageSize
   * @param sort
   * @returns {Promise<void>}
   */
  onAchievePagination = async (pageNum, pageSize, sort) => {
    const dateType = this.state().get('dateType');
    let pageNo = pageSize == this.state().get('achievePageSize') ? pageNum : 1;
    //给定时间范围内的获客报表
    const { res } = await webapi.getAchieveTable({
      dataCycle:
        dateType == 0 || dateType == 1 || dateType == 2 || dateType == 3
          ? dateType
          : 0,
      yearMonth:
        dateType != 0 && dateType != 1 && dateType != 2 && dateType != 3
          ? dateType
          : '',
      sort: sort == '' ? 'ORDER_AMT_DESC' : sort,
      pageNo: pageNo,
      pageSize: pageSize,
      keywords: this.state().get('achieveEmployeeName')
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        //总数
        this.dispatch('achieve:total', res.context.count);
        //当前页码
        this.dispatch('achieve:current', pageNo);
        //pageSize
        this.dispatch('achieve:pageSize', pageSize);
        this.dispatch('achieve:table', res.context.viewList);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   *获客报表分页
   * @param pageNum
   * @param pageSize
   * @param sort
   * @returns {Promise<void>}
   */
  onClientPagination = async (pageNum, pageSize, sort) => {
    const dateType = this.state().get('dateType');
    let pageNo = pageSize == this.state().get('clientPageSize') ? pageNum : 1;
    let clientSort =
      sort == ''
        ? dateType == 0 || dateType == 1
          ? 'TOTAL_DESC'
          : 'NEWLY_DESC'
        : sort;
    //给定时间范围内的获客报表
    const { res } = await webapi.getClientTable({
      dataCycle:
        dateType == 0 || dateType == 1 || dateType == 2 || dateType == 3
          ? dateType
          : 0,
      sort: clientSort,
      pageNo: pageNo,
      pageSize: pageSize,
      keywords: this.state().get('clientEmployeeName'),
      yearMonth:
        dateType != 0 && dateType != 1 && dateType != 2 && dateType != 3
          ? dateType
          : ''
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (dateType == 0 || dateType == 1) {
          //排序规则存储
          this.dispatch('client:sort', clientSort);
        } else {
          this.dispatch('clientNewly:sort', clientSort);
        }
        //当前页码
        this.dispatch('client:current', pageNo);
        //pageSize
        this.dispatch('client:pageSize', pageSize);
        //总数
        this.dispatch('client:total', res.context.count);
        this.dispatch('client:table', res.context.viewList);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 排序事件
   * @param pagination
   * @param filters
   * @param soter
   * @private
   */
  changeOrder = async (current, pageSize, sorter) => {
    let sort = '';
    if (sorter.field) {
      sort = await this.getAchieveSortName(sorter.field, sorter.order);
    } else {
      sort = await this.getAchieveSortName('amount', 'descend');
    }
    await this.onAchievePagination(current, pageSize, sort);
    this.transaction(() => {
      //保存sortName和sortType
      this.dispatch('achieve:sortName', sorter.field ? sorter.field : 'amount');
      this.dispatch(
        'achieve:sortOrder',
        sorter.field ? sorter.order : 'descend'
      );
    });
  };

  /**
   * 改变自定义指标
   * @param tableflag
   */
  changeColumns = async (value: any) => {
    let count = 0;
    let sortName = '';
    let sortType = '';
    let sort = '';
    value.map((v) => {
      v.dataIndex = v.key;
      if (v.key == 'amount') {
        count++;
      }
    });
    //未选中默认的下单金额指标，则按第一个指标降序
    if (count == 0) {
      sortName = value[0].key;
      sortType = 'descend';
      sort = await this.getAchieveSortName(sortName, sortType);
      this.onAchievePagination(1, this.state().get('achievePageSize'), sort);
    } else {
      //选中的指标含有下单金额时，按此降序
      sortName = 'amount';
      sortType = 'descend';
      sort = await this.getAchieveSortName(sortName, sortType);
      this.onAchievePagination(1, this.state().get('achievePageSize'), sort);
    }
    this.transaction(() => {
      this.dispatch('achieve:sortName', sortName);
      this.dispatch('achieve:sortOrder', sortType);
      this.dispatch('achieve:columns', value);
    });
  };

  /**
   * 排序规则枚举
   * @param achieveSortName
   * @param achieveSortOrder
   * @returns {string}
   */
  getAchieveSortName = (achieveSortName, achieveSortOrder) => {
    let sortName = '';
    let sortType = '';
    switch (achieveSortName) {
      case 'orderCount':
        sortName = 'ORDER_COUNT';
        break;
      case 'customerCount':
        sortName = 'ORDER_CUSTOMER';
        break;
      case 'amount':
        sortName = 'ORDER_AMT';
        break;
      case 'payCount':
        sortName = 'PAY_COUNT';
        break;
      case 'payCustomerCount':
        sortName = 'PAY_CUSTOMER';
        break;
      case 'payAmount':
        sortName = 'PAY_AMT';
        break;
      case 'customerUnitPrice':
        sortName = 'CUSTOMER_UNIT_PRICE';
        break;
      case 'orderUnitPrice':
        sortName = 'ORDER_UNIT_PRICE';
        break;
      case 'returnCount':
        sortName = 'RETURN_COUNT';
        break;
      case 'returnCustomerCount':
        sortName = 'RETURN_CUSTOMER';
        break;
      case 'returnAmount':
        sortName = 'RETURN_AMT';
        break;
      default:
        //默认按下单金额
        sortName = 'ORDER_AMT';
        break;
    }
    sortType = achieveSortOrder == 'ascend' ? 'ASC' : 'DESC';
    let sort = sortName + '_' + sortType;
    return sort;
  };

  /**
   * 隐藏获客报表下载弹框
   */
  hideClientModal = () => {
    this.dispatch('client:hide');
  };

  /**
   * 显示获客报表下载弹框
   */
  showClientModal = () => {
    this.dispatch('client:show');
  };

  /**
   * 隐藏业绩报表下载弹框
   */
  hideAchieveModal = () => {
    this.dispatch('achieve:hide');
  };

  /**
   * 显示业绩报表下载弹框
   */
  showAchieveModal = () => {
    this.dispatch('achieve:show');
  };
}
