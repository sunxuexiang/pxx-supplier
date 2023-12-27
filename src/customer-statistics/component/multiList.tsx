import React from 'react';

import { IMap, Relax } from 'plume2';
import { Form, Input, Button, Select } from 'antd';
import { IList } from 'typings/globalType';

import { DataGrid, noop, AreaSelect, SelectGroup, FindArea } from 'qmkit';

import { IndicatorPopver, DownloadModal } from 'biz';

const { Column } = DataGrid;
const FormItem = Form.Item;
const Option = Select.Option;

enum CURRENT_QUERY_TABLE {
  CUSTOMER,
  CUSTOMER_LEVEL,
  CUSTOMER_AREA
}

const firstPopContent = {
  pop: [
    {
      title: '下单指标',
      data: [
        { title: '下单笔数', key: 'orderCount' },
        { title: '下单件数', key: 'skuCount' },
        { title: '下单金额', key: 'amount' },
        { title: '付款订单数', key: 'payOrderCount' },
        { title: '付款金额', key: 'payAmount' },
        { title: '笔单价', key: 'orderPerPrice' }
      ]
    },
    {
      title: '退单指标',
      data: [
        { title: '退单笔数', key: 'returnCount' },
        { title: '退货件数', key: 'returnSkuCount' },
        { title: '退单金额', key: 'returnAmount' }
      ]
    }
  ],
  default: [
    { title: '下单笔数', key: 'orderCount' },
    { title: '下单件数', key: 'skuCount' },
    { title: '下单金额', key: 'amount' },
    { title: '付款订单数', key: 'payOrderCount' },
    { title: '付款金额', key: 'payAmount' },
    { title: '笔单价', key: 'orderPerPrice' }
  ]
};

const secondPopContent = {
  pop: [
    {
      title: '下单指标',
      data: [
        { title: '下单笔数', key: 'orderCount' },
        { title: '下单件数', key: 'skuCount' },
        { title: '下单金额', key: 'amount' },
        { title: '付款订单数', key: 'payOrderCount' },
        { title: '付款金额', key: 'payAmount' },
        { title: '客单价', key: 'userPerPrice' },
        { title: '笔单价', key: 'orderPerPrice' }
      ]
    },
    {
      title: '退单指标',
      data: [
        { title: '退单笔数', key: 'returnCount' },
        { title: '退货件数', key: 'returnSkuCount' },
        { title: '退单金额', key: 'returnAmount' }
      ]
    }
  ],
  default: [
    { title: '下单笔数', key: 'orderCount' },
    { title: '下单件数', key: 'skuCount' },
    { title: '下单金额', key: 'amount' },
    { title: '付款订单数', key: 'payOrderCount' },
    { title: '付款金额', key: 'payAmount' },
    { title: '客单价', key: 'userPerPrice' }
  ]
};

@Relax
export default class CustomerStatisticsMultiList extends React.Component<
  any,
  any
> {
  props: {
    relaxProps?: {
      multiPageData: IMap;
      getMultiPageData: Function;
      customerLevels: IList;
      dateRange: IMap;
      pageSize: number;
      queryType: number;
      sortedInfo: IMap;
    };
  };

  static relaxProps = {
    multiPageData: 'multiPageData',
    getMultiPageData: noop,
    customerLevels: 'customerLevels',
    dateRange: 'dateRange',
    pageSize: 'secondPageSize',
    queryType: 'queryType',
    sortedInfo: 'secondSortedInfo'
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedColumns: null,
      queryText: null,
      pageSize: 10
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.dateRange.get('dateCycle') !==
      this.props.relaxProps.dateRange.get('dateCycle')
    ) {
      this.setState({
        queryText: null
      });
    }
  }

  render() {
    const { multiPageData, customerLevels, queryType } = this.props.relaxProps;
    const { checkedColumns, pageSize, queryText } = this.state;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();

    let checkedArrays = [];
    if (checkedColumns) {
      checkedArrays = checkedColumns;
    } else {
      checkedArrays = this._getDefaultCheckedColumns();
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <ul style={styles.box}>
            <li>
              <a
                className={
                  queryType == CURRENT_QUERY_TABLE.CUSTOMER
                    ? 'statisticsItemCur'
                    : 'statisticsItem'
                }
                onClick={() => this._changeChoice(CURRENT_QUERY_TABLE.CUSTOMER)}
              >
                按客户查看
              </a>
            </li>
            <li>
              <a
                className={
                  queryType == CURRENT_QUERY_TABLE.CUSTOMER_LEVEL
                    ? 'statisticsItemCur'
                    : 'statisticsItem'
                }
                onClick={() =>
                  this._changeChoice(CURRENT_QUERY_TABLE.CUSTOMER_LEVEL)
                }
              >
                按等级查看
              </a>
            </li>
            <li>
              <a
                className={
                  queryType == CURRENT_QUERY_TABLE.CUSTOMER_AREA
                    ? 'statisticsItemCur'
                    : 'statisticsItem'
                }
                onClick={() =>
                  this._changeChoice(CURRENT_QUERY_TABLE.CUSTOMER_AREA)
                }
              >
                按地区查看
              </a>
            </li>
          </ul>

          <Form className="filter-content" layout="inline">
            <FormItem>
              {queryType == CURRENT_QUERY_TABLE.CUSTOMER && (
                <Input
                  style={{ width: 300 }}
                  placeholder="输入客户名称姓名或账号查看"
                  addonBefore="客户查看"
                  onChange={(e) =>
                    this.setState({ queryText: (e.target as any).value })
                  }
                  value={queryText}
                />
              )}
              {queryType == CURRENT_QUERY_TABLE.CUSTOMER_LEVEL && (
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="等级查看"
                  placeholder="选择客户等级查看"
                  style={{ width: 180 }}
                  onChange={(value) => {
                    this.setState({ queryText: value });
                  }}
                  value={queryText}
                >
                  <Option value="">全部</Option>
                  {customerLevels.map((v) => (
                    <Option
                      key={v.get('customerLevelId').toString()}
                      value={v.get('customerLevelName').toString()}
                    >
                      {v.get('customerLevelName')}
                    </Option>
                  ))}
                </SelectGroup>
              )}

              {queryType == CURRENT_QUERY_TABLE.CUSTOMER_AREA && (
                <AreaSelect
                  label="地区查看"
                  hasNoArea={true}
                  style={{ width: 180 }}
                  placeholder={'选择客户所在地区查看'}
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  value={queryText}
                  onChange={(value) => {
                    this.setState({ queryText: value });
                  }}
                />
              )}
            </FormItem>

            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  this._onQuery();
                }}
              >
                搜索
              </Button>
            </FormItem>
            <FormItem>
              <IndicatorPopver
                popContent={this._filterPopContent()}
                maxCheckedCount={6}
                selfIndicators={this._getDefaultCheckedColumns()}
                onSubmit={(value) => this._changeCheckedColumns(value)}
                checkedArray={checkedArrays}
              />
              {/*<Button><Icon type="download"/>下载报表</Button>*/}
            </FormItem>
            <FormItem>
              <DownloadModal
                visible={false}
                reportType={
                  queryType == CURRENT_QUERY_TABLE.CUSTOMER
                    ? 6
                    : queryType == CURRENT_QUERY_TABLE.CUSTOMER_LEVEL
                      ? 7
                      : 8
                }
              />
            </FormItem>
          </Form>
        </div>

        <DataGrid
          rowKey="id"
          dataSource={
            multiPageData.get('data') ? multiPageData.get('data').toJS() : []
          }
          onChange={(pagination, filters, sorter) =>
            this._handleOnChange(pagination, filters, sorter)
          }
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40'],
            pageSize: pageSize,
            current: multiPageData.get('pageNum'),
            total: multiPageData.get('total')
          }}
        >
          <Column
            title="序号"
            key="rowNum"
            render={(_text, _record, index) => {
              return (
                (multiPageData.get('pageNum') - 1) * pageSize + (index + 1)
              );
            }}
          />
          {queryType == CURRENT_QUERY_TABLE.CUSTOMER && (
            <Column
              title="客户名称"
              key="customerName"
              dataIndex="customerName"
            />
          )}
          {queryType == CURRENT_QUERY_TABLE.CUSTOMER && (
            <Column title="客户账号" key="account" dataIndex="account" />
          )}

          {queryType == CURRENT_QUERY_TABLE.CUSTOMER_LEVEL && (
            <Column
              title="客户等级"
              key="levelName"
              dataIndex="levelName"
              render={(levelName) => {
                if (levelName) {
                  return levelName;
                } else {
                  return '-';
                }
              }}
            />
          )}

          {queryType == CURRENT_QUERY_TABLE.CUSTOMER_AREA && (
            <Column
              title="客户地区"
              key="cityId"
              dataIndex="cityId"
              render={(cityId) => {
                if (cityId == '810000') {
                  return '香港';
                } else if (cityId == '820000') {
                  return '澳门';
                } else if (cityId == '710000') {
                  return '台湾';
                } else {
                  const { name, parent_code } = FindArea.findCityAndParentId(
                    cityId
                  );
                  let provinceName;
                  if (parent_code) {
                    provinceName = FindArea.findProviceName(parent_code);
                  }

                  if (provinceName && name && provinceName === name) {
                    return provinceName;
                  }

                  return `${
                    provinceName && name ? `${provinceName}/${name}` : '其他'
                  }`;
                }
              }}
            />
          )}

          {checkedArrays.map((columns) => {
            if (
              columns.key == 'userPerPrice' &&
              queryType == CURRENT_QUERY_TABLE.CUSTOMER
            ) {
              return null;
            } else {
              return (
                <Column
                  title={columns.title}
                  key={columns.key}
                  dataIndex={columns.key}
                  sorter={true}
                  sortOrder={
                    sortedInfo &&
                    sortedInfo.columnKey === columns.key &&
                    sortedInfo.order
                  }
                  render={(value) => {
                    if (
                      [
                        'payAmount',
                        'orderPerPrice',
                        'amount',
                        'returnAmount',
                        'userPerPrice'
                      ].indexOf(columns.key) != -1
                    ) {
                      return `¥ ${value.toFixed(2)}`;
                    } else {
                      return value;
                    }
                  }}
                />
              );
            }
          })}
        </DataGrid>
      </div>
    );
  }

  /**
   * 获取默认的勾选指标
   *
   * @returns {Array}
   * @private
   */
  _getDefaultCheckedColumns = () => {
    const { queryType } = this.props.relaxProps;

    if (queryType == CURRENT_QUERY_TABLE.CUSTOMER) {
      return firstPopContent.default;
    } else {
      return secondPopContent.default;
    }
  };

  /**
   * 过滤各个报表的可选指标
   *
   * @returns {Array}
   * @private
   */
  _filterPopContent = () => {
    const { queryType } = this.props.relaxProps;

    if (queryType == CURRENT_QUERY_TABLE.CUSTOMER) {
      return firstPopContent.pop;
    } else {
      return secondPopContent.pop;
    }
  };

  /**
   * 点击查询
   *
   * @private
   */
  _onQuery = () => {
    let { queryText } = this.state;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    const { getMultiPageData, pageSize, queryType } = this.props.relaxProps;
    getMultiPageData(
      queryType,
      this._renderQueryText(queryText),
      1,
      pageSize,
      sortedInfo.columnKey,
      sortedInfo.order
    );
  };

  /**
   * 修改报表类型
   *
   * @param currentTable
   * @private
   */
  _changeChoice = (currentTable) => {
    const { getMultiPageData, pageSize } = this.props.relaxProps;
    getMultiPageData(currentTable, null, 1, pageSize, 'amount', 'descend');
    this.setState({ queryText: null, checkedColumns: null });
  };

  /**
   * 修改当前报表选中的指标类型
   *
   * @param value
   * @private
   */
  _changeCheckedColumns = (value) => {
    let checkedArrays = [];
    value.forEach((item) => {
      checkedArrays.push(item.key);
    });
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    const { getMultiPageData, pageSize, queryType } = this.props.relaxProps;
    if (checkedArrays.indexOf(sortedInfo.columnKey) == -1) {
      getMultiPageData(
        queryType,
        this._renderQueryText(this.state.queryText),
        1,
        pageSize,
        checkedArrays[0],
        'descend'
      );
    } else {
      getMultiPageData(
        queryType,
        this._renderQueryText(this.state.queryText),
        1,
        pageSize,
        sortedInfo.columnKey,
        sortedInfo.order
      );
    }
    this.setState({ checkedColumns: value });
  };

  /**
   * 当分页，排序等变化时，调用查询方法
   *
   * @param pagination
   * @param filters
   * @param sorter
   * @private
   */
  _handleOnChange = (pagination, _filters, sorter) => {
    const { pageSize, queryText } = this.state;
    const { getMultiPageData, queryType } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();

    let pageCurrent = pagination.current;
    if (sortedInfo) {
      if (sorter.columnKey && sorter.order) {
        if (
          sorter.columnKey != sortedInfo.columnKey ||
          sorter.order != sortedInfo.order
        ) {
          pageCurrent = 1;
        }
      } else {
        sorter.columnKey = sortedInfo.columnKey;
        if (sortedInfo.order == 'ascend') {
          sorter.order = 'descend';
        }
        if (sortedInfo.order == 'descend') {
          sorter.order = 'ascend';
        }
        pageCurrent = 1;
      }
    }
    if (pagination.pageSize !== pageSize) {
      pageCurrent = 1;
    }

    getMultiPageData(
      queryType,
      this._renderQueryText(queryText),
      pageCurrent,
      pagination.pageSize,
      sorter.columnKey,
      sorter.order
    );
    this.setState({ pageSize: pagination.pageSize });
  };

  /**
   * 工具方法 - 统一处理搜索条件
   *
   * @param queryText
   * @returns {any}
   * @private
   */
  _renderQueryText = (queryText) => {
    let returnText = queryText;
    if (queryText) {
      if (typeof queryText == 'object') {
        returnText = queryText.join(',');
      }
    }
    return returnText;
  };
}

const styles = {
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  }
};
