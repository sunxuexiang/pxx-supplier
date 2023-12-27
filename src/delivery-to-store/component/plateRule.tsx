import React, { useEffect, useState } from 'react';
import { Table, Tabs, message, Form, Switch, Button } from 'antd';
import { Const } from 'qmkit';
import { fetchPlateInfo } from '../webapi';
import '../index.less';
import { divide } from 'lodash';

export default function PlateRule(props) {
  const { carrierName, freight } = props;
  const costRule = freight.costRule ? JSON.parse(freight.costRule) : [];
  console.warn(costRule, 'costRule');
  // 获取表头
  const columns = [
    {
      title: '配送地址',
      dataIndex: 'isDefaultArea',
      key: 'isDefaultArea',
      render: (isDefaultArea, record) => {
        if (isDefaultArea === 'true') {
          return '默认除指定地区外，其余地区的运费采用“默认运费”';
        } else {
          const result = [];
          record.areaCodes.forEach((item) => {
            result.push(item.label);
          });
          return result.join(',');
        }
      }
    },
    {
      title: '收费标准',
      dataIndex: 'start',
      key: 'start',
      render: (start, record) => {
        return `3箱起配${start}元/箱，乡镇件5箱起配加收${record.increase}元/单票`;
      }
    }
  ];
  return (
    <div className="dts-carrier">
      <div className="dts-carrier-title">承运商名称：{carrierName}</div>
      {costRule.length > 0 && (
        <Table
          className="dts-content"
          columns={columns}
          dataSource={costRule}
          bordered
          pagination={false}
          title={() => freight.name}
        />
      )}
    </div>
  );
}
