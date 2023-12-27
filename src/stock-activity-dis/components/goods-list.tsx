import React from 'react';

import { Relax } from 'plume2';
import { Table,Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { nextTick } from 'process';
import { noop } from 'qmkit';
import { string } from 'prop-types';
const {TabPane}=Tabs;
const {Column}=Table;
@Relax
export default class GoodsList extends React.Component<any, any> {
    props: {
        relaxProps?: {
            pageNum:number,
            pageSize:number,
            total:number,
            goodsInfoList: IList;
            onTabChange:Function;
            wareId:string;
            goodsInits:Function;
            //   couponActivity: IMap;
        };
        type?: any;
    };

    static relaxProps = {
        goodsInfoList: 'goodsInfoList',
        wareId:'wareId',
        pageNum:'pageNum',
        pageSize:'pageSize',
        total:'total',
        onTabChange:noop,
        goodsInits:noop,
    };

    render() {
        const { goodsInfoList,pageNum,pageSize,total,wareId,onTabChange ,goodsInits} = this.props.relaxProps;
        const { type } = this.props;
        // console.log(type, '11111111111111', goodsList ? goodsList.toJS() : goodsList,);
        const wareHouseVOPage = JSON.parse(localStorage.getItem('warePage')) || [];
        return (
            <div>
                <Tabs activeKey={String(wareId)} onChange={(key) => onTabChange(key)} tabPosition="top">
                {wareHouseVOPage.map((item, i) => (
                    <TabPane tab={item.wareName} key={String(item.wareId)} >
                    </TabPane>
                ))}
                </Tabs>
                 <Table
                        dataSource={goodsInfoList.toJS()}
                        scroll={{ x: true, y: 500 }}
                        rowKey="id"
                        pagination={{
                            current: pageNum,
                            pageSize,
                            total,
                            // showSizeChanger:true,
                            // pageSizeOptions:["10","40","60","80","100"],
                            onChange: (pageNum, pageSize) => {
                                goodsInits({ pageNum: pageNum, pageSize });
                            },
                            // onShowSizeChange:(current,pageSize)=>{
                            //   const param = {
                            //     pageNum: 0,
                            //     pageSize: pageSize,
                            //   };
                            //   init(param);
                            // }
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
                        
                    />
                    {/* <Column
                        title="操作"
                        key="operate"
                        width={100}
                        render={(row) => {
                        return (
                            <a onClick={() => deleteSelectedSku(0,row.id)}>删除</a>
                        );
                        }}
                    /> */}
                </Table>
            </div>
        );
    }
}
