import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import moment from 'moment';
import { AuthWrapper, Const, DataGrid, noop, util } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm,Table,InputNumber } from 'antd';

const {Column}=Table
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      deleteSelectedSku: Function;
      init: Function;
      activityGoodsList:IList;
      purchChange:Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    activityGoodsList: 'activityGoodsList',
    deleteSelectedSku: noop,
    init: noop,
    purchChange:noop,
  };

  render() {
    const { total, pageNum, pageSize, activityGoodsList, init,deleteSelectedSku,purchChange } =
      this.props.relaxProps;
 
    return (
      <DataGrid
        rowKey="id"
        dataSource={activityGoodsList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showSizeChanger:true,
          showQuickJumper:true,
          pageSizeOptions:["10","40","60","80","100"],
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum, pageSize });
          },
          onShowSizeChange:(current,pageSize)=>{
            const param = {
              pageNum: 0,
              pageSize: pageSize,
            };
            init(param);
          }
        }}
      >
        <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width={140}
          />

          <Column
            title="ERP编码"
            dataIndex="erpNo"
            key="erpNo"
            width={140}
          />
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={140}
          />
          <Column
            title="适用区域"
            dataIndex="wareId"
            key="wareId"
            width={100}
            render={(value) => {
              let warePage = JSON.parse(localStorage.getItem('warePage')) || [];
              let index=warePage.findIndex(item=>value==item.wareId)
              return index>-1?warePage[index].wareName:null;
            }}
          />

          <Column title="分类" key="cateName" dataIndex="cateName"  width={100} />

          <Column
            title="品牌"
            key="brandName"
            dataIndex="brandName"
            width={100}
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="单价"
            key="goodsInfoPrice"
            dataIndex="goodsInfoPrice"
            width={90}
            render={(data) => {
              // let { specialPrice, marketPrice } = data;
              // marketPrice = specialPrice ? specialPrice : marketPrice;
              return `¥${data}`;
            }}
          />

          <Column
            title="虚拟库存"
            key="virtualStock"
            dataIndex='virtualStock'
            width={120}
            render={(text,row:any,index) => {
              let obj={
                id:row.id,
                key:'virtualStock',
                index:index
              }
              return (
                <InputNumber min={0} max={999999} defaultValue={0} value={row.virtualStock} 
                  onBlur={(e)=>{
                    purchChange(e.target.value,obj,'virtualStock');
                  }} />
              );
            }}
          />
          <Column
            title="操作"
            key="operate"
            width={100}
            render={(row) => {
              return (
                <a onClick={() => deleteSelectedSku(0,row.id)}>删除</a>
              );
            }}
          />
      </DataGrid>
    );
  }


 

}
