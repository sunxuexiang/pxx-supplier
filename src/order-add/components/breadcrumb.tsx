import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';

export default function BreadCrumbComponent() {
  return (
    <BreadCrumb>
      <Breadcrumb.Item>代客下单2</Breadcrumb.Item>
    </BreadCrumb>
    // <Breadcrumb separator=">">
    //   <Breadcrumb.Item>订单</Breadcrumb.Item>
    //   <Breadcrumb.Item>订单管理</Breadcrumb.Item>
    //   <Breadcrumb.Item>订单列表</Breadcrumb.Item>
    //   <Breadcrumb.Item>代客下单</Breadcrumb.Item>
    // </Breadcrumb>
  );
}
