import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { history, util, Const } from 'qmkit';
import { goodsSpecificationOperate } from '../webapi';

const GoodsSpecification = (props) => {
  const tableStyle = {
    tableContainer: {
      // paddingRight: 138
    },
    tableCell: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tableImg: {
      width: 60,
      height: 60
    }
  };
  const [tableLoading, setLoading] = useState(false);
  // 规格数据
  const [specificationData, setData] = useState([]);
  // 规格动态表头
  const [activeColums, setActiveColums] = useState([]);
  const specificationColums = [
    {
      title: 'SKU图片',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoImg',
      key: 'goodsInfoImg',
      render: (goodsInfoImg) => {
        return (
          <div style={tableStyle.tableCell}>
            <img style={tableStyle.tableImg} src={goodsInfoImg} />
          </div>
        );
      }
    },
    {
      title: 'SKU编码',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo',
      render: (text, record) => {
        return record.hostSku === 1 ? (
          <div>
            <span
              style={{
                backgroundColor: ' #f56c1d',
                color: '#fff',
                padding: 2,
                borderRadius: 2,
                marginRight: 3
              }}
            >
              主
            </span>
            {record.goodsInfoNo}
          </div>
        ) : (
          record.goodsInfoNo
        );
      }
    },
    ...activeColums,
    {
      title: '销售价（元）',
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    },
    {
      title: '销售数量',
      align: 'center' as 'center',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '条形码',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoBarcode',
      key: 'goodsInfoBarcode'
    },
    {
      title: '上下架状态',
      align: 'center' as 'center',
      dataIndex: 'addedFlag',
      key: 'addedFlag',
      render: (addedFlag) => {
        // console.warn(record, '状态');

        return addedFlag === 0 ? '下架' : '上架';
      }
    },
    {
      title: '操作',
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      fixed: 'right',
      width: 100,
      render: (text, record, index) => {
        if (util.isThirdStore()) {
          // 第三方商家
          return (
            <Button
              type="link"
              onClick={() => {
                changeData(record.goodsInfoId, record.addedFlag, index);
              }}
            >
              {record.addedFlag === 0 ? '上架' : '下架'}
            </Button>
          );
        } else {
          // 自营商家
          return (
            <Button
              type="link"
              onClick={() => {
                let searchCacheForm =
                  JSON.parse(sessionStorage.getItem('searchCacheForm')) || {};
                sessionStorage.setItem(
                  'searchCacheForm',
                  JSON.stringify({
                    ...searchCacheForm,
                    goodsForm: props.searchData || {}
                  })
                );
                history.push({
                  pathname: `/goods-sku-edit/${record.goodsInfoId}`,
                  state: { tab: 'main' }
                });
              }}
            >
              编辑
            </Button>
          );
        }
      }
    }
  ];
  useEffect(() => {
    if (props.tableData.length > 0) {
      tableInit();
    }
  }, [props.tableData]);
  const tableInit = () => {
    const allData = [...props.tableData];
    const activeCol = [];
    let goodsAttributeKeys = [];
    allData.forEach((item) => {
      if (item.goodsAttributeKeys.length > goodsAttributeKeys.length) {
        goodsAttributeKeys = item.goodsAttributeKeys;
      }
    });
    // 根据选择属性添加动态表头
    goodsAttributeKeys.forEach((el) => {
      const { attribute } = el;
      const newCol = {
        title: attribute.attribute,
        width: 100,
        align: 'center' as 'center',
        dataIndex: attribute.attributeId,
        key: attribute.attributeId,
        render: (text) => text || '-'
      };
      activeCol.push(newCol);
    });
    console.warn(allData[0], activeCol);

    // 根据属性id新增对应key val 数据
    allData.forEach((item) => {
      item.goodsAttributeKeys.forEach((el) => {
        item[el.attribute.attributeId] = el.goodsAttributeValue;
      });
    });
    setActiveColums([...activeCol]);
    setData([...allData]);
  };
  // 上下架
  const changeData = (id, status, idx) => {
    setLoading(true);
    const params = {
      goodsInfoIds: [id],
      goodsInfoType: props.goodsInfoType,
      addedFlag: status === 0 ? 1 : 0
    };
    goodsSpecificationOperate(params)
      .then((data) => {
        setLoading(false);
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error(data.res.message || '操作失败');
          return;
        }
        const list = specificationData;
        list[idx].addedFlag = status === 0 ? 1 : 0;
        setData([...list]);
        message.success('操作成功');
      })
      .catch((err) => {
        setLoading(false);
        message.error('操作失败');
      });
  };
  return (
    <div style={tableStyle.tableContainer}>
      <Table
        loading={tableLoading}
        columns={specificationColums}
        dataSource={specificationData}
        rowKey={(record: any) => record.marketId}
        scroll={{ x: true }}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default GoodsSpecification;
