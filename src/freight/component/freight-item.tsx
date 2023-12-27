import React from 'react';
import { Relax, IMap } from 'plume2';

import { Table, Modal, message } from 'antd';
import { history, noop, QMFloat, AuthWrapper, checkAuth } from 'qmkit';
import styled from 'styled-components';
const TableDiv = styled.div`
  margin-top: 20px;
  #freightTempName {
    width: 50%;
  }
  .ant-table-thead > tr > th {
    background-color: #fff;
  }
  .ant-table-title {
    background-color: #fafafa;
    .table-title-box {
      display: flex;
      justify-content: space-between;
      .operat-box {
        a {
          margin-left: 15px;
        }
      }
    }
  }
`;

const operateWay = {
  0: { label: '件', unit: '件' },
  1: { label: '重', unit: 'kg' },
  2: { label: '体积', unit: 'm³' },
  3: { unit: 'kg', label: '重', options: '重量' }
};
const confirm = Modal.confirm;

/**
 * 运费模板Item
 */
@Relax
export default class FreightItem extends React.Component<any, any> {
  props: {
    // 展示数据
    data: any;
    // 展示标题
    title: string;
    // 是否默认
    isDefault?: boolean;
    // 运费模板类型 false: 店铺运费模板(不展示'关联商品') ture: 单品运费模板(展示'关联商品')
    typeFlag?: boolean;
    // 计价方式 0:件数 1:重量 2:体积
    valuationType?: number;
    // 模板Id
    freightId: number;
    // 是否为店铺模板
    isStore?: boolean;
    relaxProps?: {
      // 单品运费模板
      goodsFreights: IMap;

      // 复制方法
      copy: Function;
      // 删除方法
      del: Function;
      // 来源页面
      pageType: number;
    };
  };

  static relaxProps = {
    // 单品运费模板
    goodsFreights: 'goodsFreights',

    // 复制方法
    copy: noop,
    // 删除方法
    del: noop,
    pageType: 'pageType'
  };

  static defaultProps = {
    isDefault: false,
    typeFlag: false,
    operateMode: 0,
    // 是否为店铺模板
    isStore: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
      data,
      title,
      isDefault,
      typeFlag,
      valuationType,
      freightId,
      isStore
    } = this.props;
    console.log(data, 'datadata');

    let columns = [
      {
        title: '快递方式',
        width: typeFlag ? '20%' : '30%',
        dataIndex: 'deliverWay',
        render: (text) => {
          return text == 2 ? '快递' : '';
        }
      } as any,
      {
        title: '发货仓',
        width: '14%',
        dataIndex: 'wareName',
        render: (value) => {
          return value;
        }
      } as any,
      {
        title: '运送至',
        width: typeFlag ? '20%' : '35%',
        dataIndex: 'destinationAreaName',
        render: (text) => {
          return text.replace(',', ' ');
        }
      }
    ];
    // 单品
    if (typeFlag) {
      columns = columns.concat([
        {
          title: `首${operateWay[valuationType].label}(${operateWay[valuationType].unit})`,
          dataIndex: 'freightStartNum',
          width: '9%'
        },
        {
          title: '首费(元)',
          dataIndex: 'freightStartPrice',
          width: '10%'
        },
        {
          title: `续${operateWay[valuationType].label}(${operateWay[valuationType].unit})`,
          dataIndex: 'freightPlusNum',
          width: '10%'
        },
        {
          title: '续费(元)',
          dataIndex: 'freightPlusPrice',
          width: '15%'
        }
      ]);
    } else {
      // 店铺
      columns = columns.concat([
        {
          title: '计费规则',
          width: '35%',
          dataIndex: 'freightType',
          render: (text, record) => {
            if (text == 0) {
              return (
                <div>
                  订单不满{QMFloat.addZero(record.satisfyPrice)}元, 运费
                  {QMFloat.addZero(record.satisfyFreight)}元
                </div>
              );
            } else {
              return (
                <div>固定运费{QMFloat.addZero(record.fixedFreight)}元</div>
              );
            }
          }
        }
      ]);
    }

    let params = {
      columns,
      dataSource: data,
      bordered: true,
      pagination: false,
      title: () => {
        return (
          <div className="table-title-box">
            {title}
            {!isStore && isDefault && '（未设置运费模板的商品均使用默认模板）'}
            <div className="operat-box">
              {typeFlag && (
                <AuthWrapper functionName="f_goods_temp_copy">
                  <a
                    href="javascript:void(0);"
                    onClick={() => this._copy(freightId)}
                  >
                    复制
                  </a>
                </AuthWrapper>
              )}
              {((checkAuth('f_store_temp_edit') && isStore) ||
                (checkAuth('f_goods_temp_edit') && !isStore)) && (
                <a
                  href="javascript:;"
                  onClick={() => this._edit(freightId, isStore)}
                >
                  编辑
                </a>
              )}
              {typeFlag && (
                <AuthWrapper functionName="f_goods_rela_list">
                  <a
                    href="javascript:;"
                    onClick={() => {
                      const routerName =
                        this.props.relaxProps.pageType == 1
                          ? '/freight-with-same-city-goods/'
                          : '/freight-with-goods/';
                      history.push(`${routerName}${freightId}`);
                    }}
                  >
                    关联
                  </a>
                </AuthWrapper>
              )}
              {!isDefault &&
                ((checkAuth('f_store_temp_del') && isStore) ||
                  (checkAuth('f_goods_temp_del') && !isStore)) && (
                  <a
                    href="javascript:;"
                    onClick={() => this._del(freightId, isStore)}
                  >
                    删除
                  </a>
                )}
            </div>
          </div>
        );
      }
    } as any;
    return (
      <TableDiv>
        <Table
          rowKey={(record: any) => record.id || record.freightTempId}
          {...params}
        />
      </TableDiv>
    );
  }

  /**
   * 复制
   */
  _copy = (freightId) => {
    const { goodsFreights, copy } = this.props.relaxProps;
    if (goodsFreights.count() < 20) {
      copy(freightId);
    } else {
      message.error('最多只能添加20个运费模板');
    }
  };

  /**
   * 编辑
   */
  _edit = (freightId, isStore) => {
    if (isStore) {
      const routerName =
        this.props.relaxProps.pageType == 1
          ? '/store-freight-same-city-edit/'
          : '/store-freight-edit/';
      history.push({
        pathname: `${routerName}${freightId}`,
        state: { pageType: this.props.relaxProps.pageType }
      });
    } else {
      const routerName =
        this.props.relaxProps.pageType == 1
          ? '/goods-freight-same-city-edit/'
          : '/goods-freight-edit/';
      history.push(`${routerName}${freightId}`);
    }
  };

  /**
   * 删除
   */
  _del = (freightId, isStore) => {
    const { del } = this.props.relaxProps;
    confirm({
      content: '确定要删除该模板吗？',
      iconType: 'exclamation-circle',
      onOk() {
        del(freightId, isStore);
      }
    });
  };
}
