import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button, Modal } from 'antd';
import { Const, util } from 'qmkit';
import { getGoodsList } from '../webapi';

const GoodsModal = (props) => {
  const {
    form,
    selectedGoods,
    setSelectedGoods,
    visible,
    setVisible,
    allCateList
  } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [allGoodsData, setGoodsData] = useState([]);
  const [loading, setLoading] = useState(false);
  // 所有商品总数
  const [allGoodsTotal, setAllGoodsTotal] = useState(0);
  // 弹窗列表选择
  const [checkGoods, setCheckGoods] = useState([]);
  // 弹窗分页参数
  const [listPageParams, setListPageParams] = useState({
    pageNum: 0,
    pageSize: 5,
    auditStatus: 1,
    goodsInfoType: 0,
    areaFlag: 0
  });
  // 弹窗列表keys选择
  const allGoodsSelection = {
    selectedRowKeys: checkGoods.map((item) => item.goodsInfoId),
    onChange: (selectedRowKeys, selectedRows) => {
      const addRows = [];
      selectedRows.forEach((item) => {
        let addFlag = true;
        for (let i = 0; i < checkGoods.length; i++) {
          if (checkGoods[i].goodsInfoId === item.goodsInfoId) {
            addFlag = false;
            break;
          }
        }
        if (addFlag) {
          addRows.push(item);
        }
      });
      const newData = checkGoods
        .filter((item) => selectedRowKeys.includes(item.goodsInfoId))
        .concat(addRows);
      setCheckGoods(newData);
    }
  };
  // 弹窗翻页
  const changeGoodsPage = (pageNum) => {
    setListPageParams({ ...listPageParams, pageNum });
  };
  // 获取所有商品
  const getGoodsListData = () => {
    setLoading(true);
    getGoodsList(listPageParams)
      .then((data) => {
        setLoading(false);
        console.warn(data);
        if (data.res.code !== Const.SUCCESS_CODE) {
          return;
        }
        let listData = data?.res?.context?.goodsInfoPage?.content || [];
        if (!util.isThirdStore()) {
          // 非第三方商家规格数据
          const goodses = data?.res?.context?.goodses || [];
          listData = listData.map((item) => {
            const newItem = item;
            for (let i = 0; i < goodses.length; i++) {
              if (item.goodsId === goodses[i].goodsId) {
                newItem.specText = goodses[i].goodsSubtitle;
                break;
              }
            }
            return newItem;
          });
        }
        setGoodsData(listData);
        setAllGoodsTotal(data?.res?.context?.goodsInfoPage?.totalElements || 0);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  };
  // 搜索
  const searchGoods = () => {
    validateFieldsAndScroll((err, value) => {
      if (!err) {
        setListPageParams({ ...listPageParams, ...value, pageNum: 0 });
      }
    });
  };
  useEffect(() => {
    getGoodsListData();
  }, [listPageParams]);
  const columns = [
    {
      title: '商品名称',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoName',
      key: 'goodsInfoName'
    },
    {
      title: '规格',
      align: 'center' as 'center',
      dataIndex: 'specText',
      key: 'specText',
      render: (text, row: any) => {
        if (util.isThirdStore()) {
          const result = [];
          row.goodsAttributeKeys?.forEach((item) => {
            result.push(item.goodsAttributeValue);
          });
          return result.join('-');
        } else if (text) {
          return text;
        } else {
          return '-';
        }
      }
    },
    {
      title: '分类',
      width: 200,
      align: 'center' as 'center',
      dataIndex: 'storeCateIds',
      key: 'storeCateIds',
      render: (storeCateIds) => {
        const cateName = [];
        allCateList.forEach((item) => {
          if (storeCateIds.includes(item.storeCateId)) {
            cateName.push(item.cateName);
          }
        });
        return cateName.length ? cateName.join(',') : '-';
      }
    },
    {
      title: '销售价',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    }
  ];
  useEffect(() => {
    if (visible) {
      setCheckGoods(selectedGoods);
    }
  }, [visible]);
  // 确认选择商品
  const onOk = () => {
    setSelectedGoods(checkGoods);
    setVisible(false);
  };
  return (
    <Modal
      title="选择商品"
      width={1200}
      visible={visible}
      centered
      maskClosable={false}
      onOk={onOk}
      onCancel={() => setVisible(false)}
    >
      <Form className="filter-content" layout="inline">
        <Form.Item>
          {getFieldDecorator('likeGoodsName', {
            initialValue: ''
          })(<Input addonBefore="商品名称" placeholder="请输入商品名称" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" onClick={searchGoods}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey={(record: any) => record.goodsInfoId}
        loading={loading}
        columns={columns}
        dataSource={allGoodsData}
        rowSelection={allGoodsSelection}
        pagination={{
          current: listPageParams.pageNum + 1,
          pageSize: listPageParams.pageSize,
          total: allGoodsTotal,
          onChange: (pageNum) => {
            changeGoodsPage(pageNum - 1);
          }
        }}
      />
    </Modal>
  );
};

const GoodsModalForm = Form.create<any>()(GoodsModal);
export default GoodsModalForm;
