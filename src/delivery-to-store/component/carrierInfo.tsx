import React, { useEffect, useState } from 'react';
import { message, Table } from 'antd';
import { fetchCarrierInfo } from '../webapi';
import { cache } from 'qmkit';
import '../index.less';

const CarrierInfo = (props) => {
  const { carrierName, list } = props;
  const columns = [
    {
      title: '接货点名称',
      dataIndex: 'siteName',
      width: '15%'
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      width: '15%'
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: '10%'
    },
    {
      title: '所在市区街道',
      dataIndex: 'provinceName',
      width: '25%',
      render: (_, record) =>
        `${record.provinceName}${record.cityName}${record.districtName}${record.street}`
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      width: '35%'
    }
  ];
  return (
    <div className="dts-carrier">
      <div className="dts-carrier-title">承运商名称：{carrierName}</div>
      <Table dataSource={list} columns={columns} pagination={false} />
    </div>
  );
};

export default CarrierInfo;
