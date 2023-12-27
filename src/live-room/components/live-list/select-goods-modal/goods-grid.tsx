import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from '../../../webapi';
const defaultImg = require('../../../../images/none.png');

const Column = DataGrid;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood
    };
  }

  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : {});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {}
      });
      this.init(nextProps.searchParams ? nextProps.searchParams : {});
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      loading,
      goodsInfoPage,
      selectedRowKeys,
      selectedRows
    } = this.state;
    const {
      rowChangeBackFun,
      visible,
      disabledSkuIds,
      goodsInfoList
    } = this.props;
    console.log('debug88 goodsInfoList', goodsInfoList);
    return (
      <div className="content">
        {/*search*/}
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsId}
          dataSource={goodsInfoPage.content}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
                .concat(fromJS(selectedTableRows).toSet())
                .toList();
              rows = selectedRowKeys
                .map((key) =>
                  rows.filter((row) => row.get('goodsId') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              disabled: disabledSkuIds.find((id) => id == record.goodsId)
            })
          }}
        >
          <Column
            key="goodsInfoName"
            dataIndex="goodsInfoName"
            title="商品"
            render={(name, rowInfo) => {
              const goodsInfo = goodsInfoList.find(
                (e) => e.goodsInfoId == rowInfo.goodsInfoId
              );
              return (
                <div style={styles.item}>
                  <div>
                    <img
                      src={
                        rowInfo.coverImgUrl ? rowInfo.coverImgUrl : defaultImg
                      }
                      style={styles.imgItem}
                    />
                  </div>
                  <div style={styles.goodsInfoRight}>
                    <div>{rowInfo.name ? rowInfo.name : '-'}</div>
                    <div style={styles.specText}>
                      {goodsInfo && goodsInfo.specText
                        ? goodsInfo.specText
                        : '-'}
                    </div>
                  </div>
                </div>
              );
            }}
          />

          <Column
            title="价格"
            key="marketPrice"
            dataIndex="marketPrice"
            render={(row, rowInfo) => {
              let comps = [];
              switch (rowInfo.priceType) {
                case 1:
                  comps = [<div>￥{rowInfo.price}</div>];
                  break;
                case 2:
                  comps = [
                    <div>
                      ￥{rowInfo.price}~{rowInfo.price2}
                    </div>
                  ];
                  break;
                case 3:
                  comps = [
                    <div>
                      ￥{rowInfo.price2}
                      <del
                        style={{
                          color: 'rgba(153, 153, 153, 1)',
                          fontSize: '12px'
                        }}
                      >
                        {rowInfo.price}
                      </del>
                    </div>
                  ];
                  break;
                default:
                  comps = [<div>--</div>];
                  break;
              }
              return comps;
            }}
          />

          <Column
            title="库存"
            dataIndex="stock"
            key="stock"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }

    //查已审核状态
    params.auditStatus = '2';

    let { res } = await webapi.getLiveGoodsPage({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;

      this.setState({
        goodsInfoPage: res['liveGoodsVOPage'],
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    if (this.props.searchParams) {
      searchParams = { ...searchParams, ...this.props.searchParams };
    }
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
const styles = {
  edit: {
    paddingRight: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgItem: {
    width: 40,
    height: 40,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  goodsInfoRight: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  }
} as any;
