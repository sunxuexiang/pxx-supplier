import React, { useState, useEffect } from 'react';
import './recommend-goods.less';
import {
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  Modal,
  message,
  TreeSelect,
  Select
} from 'antd';
import { Const, BreadCrumb, TreeSelectGroup, DragTable } from 'qmkit';
import {
  getRecommendGoods,
  getGoodsList,
  addRecommendGoods,
  getCateList,
  getBrandList,
  delRecommendGoods,
  changeGoodsSort
} from './webapi';
import SortModal from './component/sort-modal';

const RecommendGoods = (props) => {
  const tableColums = [
    {
      title: '排序',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'sort',
      key: 'sort',
      fixed: 'left' as 'left',
      render: (text, record, index) => (
        <Button
          type="link"
          onClick={() => {
            settMerchantInfo({
              ...record,
              sort: pageParams.pageSize * pageParams.pageNum + index + 1
            });
            setShowSortModal(true);
          }}
        >
          {pageParams.pageSize * pageParams.pageNum + index + 1}
        </Button>
      )
    },
    {
      title: '图片',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoImg',
      key: 'goodsInfoImg',
      render: (goodsInfoImg) => {
        return goodsInfoImg ? (
          <div className="recommend-goods-img-box">
            <img className="recommend-goods-img" src={goodsInfoImg} />
          </div>
        ) : (
          '-'
        );
      }
    },
    {
      title: '商品编码',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo'
    },
    {
      title: '商品名称',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoName',
      key: 'goodsInfoName'
    },
    {
      title: '分类',
      width: 100,
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
      title: '品牌',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'brandId',
      key: 'brandId',
      render: (brandId) => {
        if (!brandId) {
          return '-';
        }
        const currentCate = brandList.find((item) => item.brandId === brandId);
        return currentCate ? currentCate.brandName : '-';
      }
    },
    {
      title: '门店价',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      render: (marketPrice) => {
        return marketPrice ? `¥${marketPrice}` : '-';
      }
    },
    {
      title: '大客户价',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'vipPrice',
      key: 'vipPrice',
      render: (vipPrice) => {
        return vipPrice >= 0 ? `¥${vipPrice}` : '-';
      }
    },
    {
      title: '操作',
      width: 120,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      fixed: 'right' as 'right',
      render: (text, record) => {
        return (
          <div className="market-table-btn">
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                delRecommendGoodsData([record.merchantRecommendId]);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  const goodsListColums = [
    {
      title: 'SKU编码',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo'
    },
    {
      title: '商品名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'goodsInfoName',
      key: 'goodsInfoName'
    },
    {
      title: '分类',
      width: 100,
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
      title: '品牌',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'brandId',
      key: 'brandId',
      render: (brandId) => {
        const current = brandList.find((item) => {
          return item.brandId === brandId;
        });
        return current ? current.brandName : '-';
      }
    },
    {
      title: '门店价',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    },
    {
      title: '大客户价',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'vipPrice',
      key: 'vipPrice'
    },
    {
      title: '店铺名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'storeName',
      key: 'storeName'
    }
  ];
  // 推荐商品表格数据
  const [recommendGoodsData, setRecommendGoodsData] = useState([]);
  // 总数
  const [tableTotal, setTotal] = useState(0);
  // 推荐商品表格loading
  const [tableLoading, setTableLoading] = useState(false);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 弹窗显示
  const [showGoodsModal, setShowGoodsModal] = useState(false);
  // 所有商品列表
  const [allGoodsData, setAllGoodsData] = useState([]);
  // 所有商品总数
  const [allGoodsTotal, setAllGoodsTotal] = useState(0);
  // 弹窗列表选择
  const [checkGoodsKeys, setCheckGoodsKeys] = useState([]);
  // 弹窗分页参数
  const [listPageParams, setListPageParams] = useState({
    pageNum: 0,
    pageSize: 5,
    auditStatus: 1,
    goodsInfoType: 0
  });
  // 弹窗确认loading
  const [cofirmLoading, setConfirmLoading] = useState(false);
  // 分类
  const [allCateList, setCateList] = useState([] as any);
  // 处理后的树形结构分类
  const [treeCateData, setTreeCateData] = useState([] as any);
  // 商品品牌
  const [brandList, setBrandList] = useState([]);
  // 弹窗表格加载
  const [goodsListLoading, setGoodsListLoading] = useState(false);
  // 已选择添加商品
  const [checkGoodsList, setChecklist] = useState([]);
  // 推荐商品选择keys
  const [checkRecommendGoodsKeys, setCheckRecommendGoodsKeys] = useState([]);
  // 批量删除数据
  const [delRecommendData, setDelRecommendData] = useState([]);
  // 排序弹窗显示
  const [showSortModal, setShowSortModal] = useState(false);
  // 当前编辑商品信息
  const [currentMerchantInfo, settMerchantInfo] = useState({} as any);
  useEffect(() => {
    getRecommendGoodsData();
    getCateData();
    getBrandData();
  }, []);
  useEffect(() => {
    getGoodsListData();
  }, [listPageParams]);
  useEffect(() => {
    getRecommendGoodsData();
  }, [pageParams]);
  // 弹窗显示
  const openModal = () => {
    setShowGoodsModal(true);
    setAllGoodsData([]);
    setCheckGoodsKeys([]);
    setChecklist([]);
    getGoodsListData();
  };
  // 获取所有商品
  const getGoodsListData = () => {
    setGoodsListLoading(true);
    getGoodsList(listPageParams)
      .then((data) => {
        setGoodsListLoading(false);
        console.warn(data);
        if (data.res.code !== Const.SUCCESS_CODE) {
          return;
        }
        setAllGoodsData(data.res.context.goodsInfoPage.content);
        setAllGoodsTotal(data.res.context.goodsInfoPage.totalElements);
      })
      .catch((err) => {
        console.warn(err);
        setGoodsListLoading(false);
      });
  };
  // 弹窗翻页
  const changeGoodsPage = (pageNum) => {
    setListPageParams({ ...listPageParams, pageNum });
  };
  // 列表keys选择
  // const recommendGoodsSelection = {
  //   selectedRowKeys: checkRecommendGoodsKeys,
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setCheckRecommendGoodsKeys(selectedRowKeys);
  //     setDelRecommendData([...selectedRows]);
  //   }
  // };
  // 弹窗列表keys选择
  const allGoodsSelection = {
    selectedRowKeys: checkGoodsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setCheckGoodsKeys(selectedRowKeys);
      // setChecklist(selectedRows);
    }
  };
  // 确认添加
  const confirAdd = () => {
    setConfirmLoading(true);
    addRecommendGoods({ goodsInfoId: checkGoodsKeys })
      .then((data) => {
        setConfirmLoading(false);
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('添加失败');
          return;
        }
        message.success('添加成功');
        setShowGoodsModal(false);
        getRecommendGoodsData();
      })
      .catch((err) => {
        message.error('添加失败');
        setConfirmLoading(false);
      });
  };
  // 获取平台类目
  const getCateData = () => {
    getCateList().then((res) => {
      console.warn(res, '商品类目');
      // 改变数据形态，变为层级结构
      const cateList = res.res.context;
      const newDataList = cateList
        .filter((item) => item.cateParentId === 0)
        .map((data) => {
          const children = cateList.filter(
            (item) => item.cateParentId === data.storeCateId
          );
          if (children.length > 0) {
            data.children = children;
          }
          return data;
        });
      setTreeCateData(newDataList);
      setCateList(cateList);
    });
  };
  //处理分类的树形图结构数据
  const renderTree = (cateList) => {
    return cateList.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeSelect.TreeNode
            key={item.storeCateId}
            value={item.storeCateId}
            title={item.cateName}
          >
            {renderTree(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return (
        <TreeSelect.TreeNode
          key={item.storeCateId}
          value={item.storeCateId}
          title={item.cateName}
        />
      );
    });
  };
  // 商品品牌
  const getBrandData = () => {
    getBrandList().then((data) => {
      console.warn(data, '商品品牌');
      setBrandList(data.res.context);
    });
  };
  // 搜索
  const searchGoods = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        setListPageParams({ ...listPageParams, ...value });
      }
    });
  };
  // 获取推荐商品
  const getRecommendGoodsData = () => {
    setTableLoading(true);
    getRecommendGoods(pageParams)
      .then((data) => {
        setTableLoading(false);
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取推荐商品失败');
          return;
        }
        console.warn(data);
        const goodList = data.res.context.goodsRecommendGoodsVOPage.content.map(
          (item) => {
            const goodsItem = { ...item, ...item.goodsInfo };
            return goodsItem;
          }
        );
        // 排序
        goodList.sort((a, b) => {
          return a.sort - b.sort;
        });
        setRecommendGoodsData(goodList);
        setTotal(data.res.context.goodsRecommendGoodsVOPage.totalElements);
      })
      .catch((err) => {
        message.error('获取推荐商品失败');
        console.warn(err);
        setTableLoading(false);
      });
  };
  // 推荐商品翻页
  const changeTablePage = (pageNum) => {
    changePage({ ...pageParams, pageNum });
  };
  // 批量删除推荐商品
  const delRecommendGoodsData = (ids = []) => {
    const params = { recommendIdList: [] };
    if (!ids.length) {
      // 批量删除
      params.recommendIdList = delRecommendData.map((item) => {
        return item.merchantRecommendId;
      });
    } else {
      // 列表操作删除
      params.recommendIdList = ids;
    }
    console.warn(params);
    setTableLoading(true);
    delRecommendGoods(params)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('删除失败');
          return;
        }
        message.success('删除成功');
        getRecommendGoodsData();
        setDelRecommendData([]);
        setCheckRecommendGoodsKeys([]);
      })
      .catch((err) => {
        message.error('删除失败');
      });
  };
  // 修改排序
  const changeTableSort = (dragIndex, targetIndex) => {
    // 当前拖拽数据
    const curentData = {
      merchantRecommendId: recommendGoodsData[dragIndex].merchantRecommendId,
      sort: recommendGoodsData[targetIndex].sort
    };
    // 需要交换目标位置数据
    const targetData = {
      merchantRecommendId: recommendGoodsData[targetIndex].merchantRecommendId,
      sort: recommendGoodsData[dragIndex].sort
    };
    console.warn(curentData, targetData);
    const params = { sortList: [curentData, targetData] };
    changeGoodsSort(params)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('操作失败');
          return;
        }
        message.success('操作成功');
        getRecommendGoodsData();
      })
      .catch((err) => {
        message.error('操作失败');
      });
  };
  const { getFieldDecorator } = props.form;
  return (
    <div>
      <BreadCrumb />
      <div className="recommend-goods-container">
        <p className="recommend-goods-header">推荐商品</p>
        <div className="recommend-goods-operate">
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              openModal();
            }}
          >
            选择商品
          </Button>
          <Button
            type="primary"
            disabled={!checkRecommendGoodsKeys.length}
            onClick={() => {
              delRecommendGoodsData();
            }}
          >
            批量删除
          </Button>
        </div>
        <div className="recommend-goods-table">
          {/* <DragTable
            rowKeyName={'goodsInfoId'}
            rowSelection={true}
            loading={tableLoading}
            dragColumns={tableColums}
            dragData={recommendGoodsData}
            pagination={pageParams}
            total={tableTotal}
            changeData={(pageNum) => {
              changeTablePage(pageNum - 1);
            }}
            changeSort={(dragIndex, targetIndex) => {
              changeTableSort(dragIndex, targetIndex);
            }}
            changeTableSelect={(
              selectedRowKeys,
              checkRowKeys,
              selectedRows
            ) => {
              setCheckRecommendGoodsKeys(selectedRowKeys);
              setDelRecommendData(selectedRows);
            }}
          /> */}
          <Table
            loading={tableLoading}
            columns={tableColums}
            dataSource={recommendGoodsData}
            pagination={{
              showQuickJumper: false,
              current: pageParams.pageNum + 1,
              pageSize: pageParams.pageSize,
              total: tableTotal,
              onChange: (pageNum) => {
                changeTablePage(pageNum - 1);
              }
            }}
            rowKey="goodsInfoId"
          />
        </div>
      </div>
      <Modal
        title="选择商品"
        width={1200}
        visible={showGoodsModal}
        onOk={confirAdd}
        confirmLoading={cofirmLoading}
        onCancel={() => {
          setShowGoodsModal(false);
        }}
        okButtonProps={{ disabled: !checkGoodsKeys.length }}
      >
        <div className="recommend-goods-search">
          <Form className="filter-content" layout="inline">
            <Form.Item>
              {getFieldDecorator('likeGoodsName', {
                initialValue: ''
              })(<Input addonBefore="商品名称" placeholder="请输入商品名称" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('likeGoodsNo', {
                initialValue: ''
              })(<Input addonBefore="SPU编码" placeholder="请输入SPU编码" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('likeGoodsInfoNo', {
                initialValue: ''
              })(<Input addonBefore="SKU编码" placeholder="请输入SKU编码" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('storeCateId')(
                <TreeSelectGroup
                  placeholder="请选择分类"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="分类"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {renderTree(treeCateData)}
                </TreeSelectGroup>
              )}
            </Form.Item>
            <Form.Item label="商品品牌">
              {getFieldDecorator('brandId')(
                <Select
                  placeholder="请选择商品品牌"
                  notFoundContent="暂无品牌"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  style={{ width: 200 }}
                >
                  {brandList.map((item) => {
                    return (
                      <Select.Option key={item.brandId} value={item.brandId}>
                        {item.brandName}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon="search" onClick={searchGoods}>
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowKey={(record: any) => record.goodsInfoId}
          loading={goodsListLoading}
          columns={goodsListColums}
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
        ></Table>
      </Modal>
      {/* 排序弹窗 */}
      <SortModal
        showSort={showSortModal}
        currentData={currentMerchantInfo}
        hideSort={(isRefresh) => {
          if (isRefresh) {
            getRecommendGoodsData();
          }
          setShowSortModal(false);
        }}
      />
    </div>
  );
};

const RecommendGoodsTemplate = Form.create()(RecommendGoods);
export default RecommendGoodsTemplate;
