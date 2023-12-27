import React from 'react';
import {Relax} from 'plume2';
import {AuthWrapper, DataGrid, noop} from 'qmkit';
import {List} from 'immutable';
import {Modal} from 'antd';

const confirm = Modal.confirm;

const { Column } = DataGrid;

type TList = List<any>;

/**
 * 组件装饰@Relax注解
 */
@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      data: TList;
      pageSize: number;
      total: number;
      currentPage: number;
      loading: boolean;
      init: Function;
      onEdit: Function;
      onDelete: Function;
      lastData:string
    };
  };

  static relaxProps = {
    loading: 'loading',
    pageSize: 'pageSize',
    total: 'total',
    currentPage: 'currentPage',
    data: ['dataList'],
    init: noop,
    onEdit: noop,
    onDelete: noop,
    lastData:"lastData"
  };

  render() {
    const {
      data,
      loading,
      onEdit,
      lastData
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="storeLevelId"
        dataSource={data.toJS()}
        pagination={false}
      >
        <Column
          title="等级名称"
          key="levelName"
          dataIndex="levelName"
        />

        <Column
          title="折扣率"
          key="discountRate"
          dataIndex="discountRate"
          render={discountRate =>
            parseFloat(discountRate).toFixed(2)
          }
        />

        <Column
          title="升级条件"
          render={rowInfo =>
            this.renderColumn(rowInfo)
          }
        />

        <Column
          title="操作"
          render={rowInfo =>
          {
            return (
              <div>
                <AuthWrapper functionName="f_customer_level_1">
                  <a
                    href="javascript:void(0);"
                    onClick={() => onEdit(rowInfo)}
                  >
                    设置
                  </a>
                </AuthWrapper>
                {
                  ( lastData == rowInfo.storeLevelId  &&  data.toJS().length >1 )?
                  <AuthWrapper functionName="f_customer_level_2">
                  <a
                  href="javascript:void(0);"
                  style={{marginLeft: 10}}
                  onClick={() => this._delete(rowInfo.storeLevelId)}
                  >
                  删除
                  </a>
                  </AuthWrapper> :null
                }
              </div>
            )
          }
          }

        />
      </DataGrid>
    );
  }
  renderColumn =(rowInfo)=>{
    let amountConditions =  rowInfo.amountConditions ? "累计消费金额"+rowInfo.amountConditions+"元":"";
    let orderConditions =  rowInfo.orderConditions ? "累计支付"+rowInfo.orderConditions+"笔" :"";
    if(orderConditions == "" || amountConditions == ""){
      return orderConditions +amountConditions;
    }
    return orderConditions + "或"+amountConditions;
  }


  /**
   * 删除
   */
  _delete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      content: '确认删除当前等级吗?',
      onOk() {
        onDelete(id);
      }
    });
  };







}


