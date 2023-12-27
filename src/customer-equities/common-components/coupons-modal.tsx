import * as React from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { AuthWrapper, Const, DataGrid, SelectGroup } from 'qmkit';
import moment from 'moment';
import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const { Column } = DataGrid;

/**
 * 优惠券选择弹窗
 */
export default class CouponsModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // 优惠券分页数据
      couponInfos: {},
      // 搜索条件
      searchParams: {
        // 分页-当前页
        pageNum: 0,
        // 分页-每页数量
        pageSize: 10,
        // 优惠券名称
        likeCouponName: '',
        // 使用范围
        scopeType: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: ''
      },
      // 是否正在加载数据
      loading: false,
      // 选择的优惠券集合
      selectedRows: props.selectedRows
    };
  }

  componentDidMount() {
    this._pageSearch();
  }

  render() {
    return (
      <Modal
        maskClosable={false}
        visible={true}
        title={
          <div>
            选择优惠券&nbsp;
            <small>
              已选
              <span style={{ color: 'red' }}>
                {this.state.selectedRows.length}
              </span>
              张优惠券
            </small>
          </div>
        }
        width={1200}
        onOk={() => this._onOk()}
        onCancel={() => this._onCancel()}
        okText="确认"
        cancelText="取消"
      >
        {/*search*/}
        {this._renderSearchForm()}
        {this._renderGrid()}
      </Modal>
    );
  }

  /**
   * 构建搜索表单虚拟dom
   */
  _renderSearchForm = () => {
    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="优惠券名称"
              onChange={(e) =>
                this._onSearchParamChange({ likeCouponName: e.target.value })
              }
            />
          </FormItem>

          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="使用范围"
              defaultValue="不限"
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(val) => this._onSearchParamChange({ scopeType: val })}
            >
              <Option value="">不限</Option>
              <Option value="0">{Const.couponScopeType[0]}</Option>
              <Option value="1">{Const.couponScopeType[1]}</Option>
              <Option value="2">{Const.couponScopeType[2]}</Option>
            </SelectGroup>
          </FormItem>

          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              onChange={(e) => {
                let startTime = '';
                let endTime = '';
                if (e.length > 0) {
                  startTime = e[0].format(Const.DAY_FORMAT);
                  endTime = e[1].format(Const.DAY_FORMAT);
                  if (startTime) {
                    startTime = startTime + ' 00:00:00';
                  }
                  if (endTime) {
                    endTime = endTime + ' 23:59:59';
                  }
                }
                this._onSearchParamChange({
                  startTime: startTime,
                  endTime: endTime
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              htmlType="submit"
              onClick={() => this._pageSearch(0)}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  };

  /**
   * 构建表格虚拟dom
   */
  _renderGrid = () => {
    const { couponInfos, selectedRows } = this.state;
    return (
      <DataGrid
        isScroll={false}
        loading={false}
        rowKey={(record) => record.couponId}
        dataSource={couponInfos.content}
        rowSelection={{
          selectedRowKeys: selectedRows.map((row) => row.couponId),
          onChange: (_selectedRowKeys, selectedTableRows) => {
            this._onSelectRow(selectedTableRows);
          },
          getCheckboxProps: (record) => ({
            disabled:
              record.couponStatus == 'NOT_START' ||
              record.couponStatus == 'ENDED'
          })
        }}
        pagination={{
          total: couponInfos.totalElements,
          current: couponInfos.number + 1,
          pageSize: couponInfos.size,
          onChange: (pageNum, pageSize) => {
            this._onPageSearch({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="优惠券名称"
          dataIndex="couponName"
          key="couponName"
          width="15%"
        />

        <Column
          title="面值"
          dataIndex="denominationStr"
          key="denominationStr"
          width="10%"
        />

        <Column
          title="有效期"
          dataIndex="validity"
          key="validity"
          width="15%"
        />

        <Column
          title="优惠券分类"
          key="cateNamesStr"
          dataIndex="cateNamesStr"
          width="15%"
          render={(value) =>
            value.length > 12 ? `${value.substring(0, 12)}...` : value
          }
        />

        <Column
          title="使用范围"
          key="scopeNamesStr"
          dataIndex="scopeNamesStr"
          width="15%"
          render={(value) =>
            value.length > 12 ? `${value.substring(0, 12)}...` : value
          }
        />

        <Column
          title="优惠券状态"
          key="couponStatusStr"
          dataIndex="couponStatusStr"
          width="15%"
        />

        <Column
          title="操作"
          key="operate"
          width="15%"
          render={(row) => {
            return (
              <div>
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <a
                    style={{ textDecoration: 'none' }}
                    href={`/coupon-detail/${row.couponId}`}
                    target="_blank"
                  >
                    详情
                  </a>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  };

  /**
   * 搜索条件改变
   */
  _onSearchParamChange = (param) => {
    let searchParams = this.state.searchParams;
    for (let key in param) {
      searchParams[key] = param[key];
    }
    return new Promise((resolve) => {
      this.setState({ searchParams }, () => resolve());
    });
  };

  /**
   * 分页切换搜索
   */
  _onPageSearch = async (param) => {
    await this._onSearchParamChange(param);
    this._pageSearch();
  };

  /**
   * 勾选优惠券
   */
  _onSelectRow = (selectedTableRows) => {
    // 1.找出非当前页的选中项
    const currentPageCouponIds = this.state.couponInfos.content.map(
      (coupon) => coupon.couponId
    );
    const otherPageSelectedRows = this.state.selectedRows.filter(
      (selectRow) => !currentPageCouponIds.includes(selectRow.couponId)
    );
    // 2.合并当前页选中项与非当前页选中项
    this.setState({
      selectedRows: otherPageSelectedRows.concat(selectedTableRows)
    });
  };

  /**
   * 确认选择优惠券
   */
  _onOk = () => {
    const selectedRows = this.state.selectedRows;
    if (selectedRows.length > 10) {
      message.error('最多可选10张优惠券');
    } else {
      this.props.onOk(selectedRows);
    }
  };

  /**
   * 取消选择优惠券
   */
  _onCancel = () => {
    this.props.onCancel();
  };

  /**
   * 分页查询
   */
  _pageSearch = async (page?) => {
    // 1.从state中获取查询条件
    const params = this.state.searchParams;
    if (page != null) {
      await this._onSearchParamChange({ pageNum: page });
    }
    if (params.scopeType == '') delete params.scopeType;
    if (params.startTime == '') delete params.startTime;
    if (params.endTime == '') delete params.endTime;
    // 2.调用查询接口
    params.isMarketingChose = 1;
    let { res } = (await webapi.fetchCouponPage(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let couponInfos = res.context.couponInfos;
      couponInfos.content.forEach((coupon) => {
        // 3.1.面值
        coupon.denominationStr =
          coupon.fullBuyType == 0
            ? `满0减${coupon.denomination}`
            : `满${coupon.fullBuyPrice}减${coupon.denomination}`;
        // 3.2.有效期
        if (coupon.rangeDayType == 0) {
          // 按起止时间
          let startTime = moment(coupon.startTime)
            .format(Const.DAY_FORMAT)
            .toString();
          let endTime = moment(coupon.endTime)
            .format(Const.DAY_FORMAT)
            .toString();
          coupon.startTime = coupon.validity = `${startTime} 至 ${endTime}`;
        } else {
          // 按N天有效
          coupon.validity = `领取当天${coupon.effectiveDays}日内有效`;
        }
        // 3.3.优惠券分类
        coupon.cateNamesStr =
          coupon.cateNames.length != 0
            ? coupon.cateNames.reduce((a, b) => `${a},${b}`, '').substr(1)
            : '其他';
        // 3.4.使用范围
        if ([0, 4].indexOf(coupon.scopeType) != -1) {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        } else {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            ':' +
            (coupon.scopeNames.length != 0
              ? coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1)
              : '-');
        }
        // 3.5.优惠券状态
        coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
        //3.6 使用范围
        coupon.scopeNamesStr =
          coupon.scopeType == 0 ? '全部商品' : coupon.scopeNamesStr;
      });
      // 4.设置couponInfos
      this.setState({ couponInfos });
    }
  };
}
