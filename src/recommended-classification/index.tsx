import React, { useState, useEffect } from 'react';
import './recommended-classification.less';
import { Form, Input, Button, Table, Popconfirm, Modal, message } from 'antd';
import {
  getRecommendClassifiy,
  getStoreCate,
  addClassify,
  delClassify,
  changeClassifySort
} from './webapi';
import { Const, BreadCrumb, DragTable } from 'qmkit';

const RecommendedClassification = (props) => {
  const tableColums = [
    {
      title: '类目名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'cateName',
      key: 'cateName'
    },
    {
      title: '类目图片',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'cateImg',
      key: 'cateImg',
      render: (cateImg) => {
        if (cateImg) {
          return (
            <div className="recommend-table-img">
              <img src={cateImg} />
            </div>
          );
        } else {
          return '-';
        }
      }
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        return (
          <div className="market-table-btn">
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                // marketOperation(record, 'del');
                const ids = [record.merchantTypeId];
                delData(ids);
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
  const classifyColums = [
    {
      title: '分类名称',
      width: '90%',
      align: 'center' as 'center',
      dataIndex: 'cateName',
      key: 'cateName'
    }
  ];
  // 推荐分类表格数据
  const [recommendData, setRecommendData] = useState([]);
  // 总数
  const [tableTotal, setTotal] = useState(0);
  // 推荐分类表格loading
  const [tableLoading, setTableLoading] = useState(false);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 选中推荐分类列表
  const [checkClassify, setCheckClassify] = useState([]);
  useEffect(() => {
    getRecommendClassifiyData();
  }, [pageParams]);
  // 已选择推荐分类key
  const [selectedRowKeys, changeSelectedRowKeys] = useState([]);
  // 弹窗显示
  const [showClassifyModal, setShowClassifyModal] = useState(false);
  // 所有分类
  const [allClassifyData, setAllClassifyData] = useState([]);
  // 弹窗已选择分类key
  const [selectedClassifyKeys, changeSelectedClassifyKeys] = useState([]);
  // 弹窗已选择分类
  const [modalClassifyCheck, setModalClassifyCheck] = useState([]);
  // 获取分类
  const getRecommendClassifiyData = () => {
    setTableLoading(true);
    getRecommendClassifiy(pageParams)
      .then((data) => {
        setTableLoading(false);
        if (data.res.code === Const.SUCCESS_CODE) {
          console.warn(data.res);
          const classifyList = data.res.context.typeVOMicroServicePage.content;
          // 排序
          classifyList.sort((a, b) => {
            return a.sort - b.sort;
          });
          setRecommendData(classifyList);
          setTotal(data.res.context.totalElements);
        }
      })
      .catch((err) => {
        setTableLoading(false);
        console.warn(err);
      });
  };
  // 显示弹窗
  const showAllClassify = () => {
    setShowClassifyModal(true);
    getStoreCate().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        console.warn(data);
        // 数据处理
        const dataList = data.res.context || [];
        const newDataList = data.res.context
          .filter((item) => item.cateParentId === 0)
          .map((data) => {
            const children = dataList.filter(
              (item) => item.cateParentId === data.storeCateId
            );
            if (children.length > 0) {
              data['children'] = children;
            }
            return data;
          });
        console.warn(newDataList);
        setAllClassifyData(newDataList);
      }
    });
  };
  // 弹窗分类选择
  const allClassifySelection = {
    columnWidth: '10%',
    selectedRowKeys: selectedClassifyKeys,
    getCheckboxProps: (record) => ({
      disabled: record.cateGrade === 1
    }),
    onChange: (selectedRowKeys, selectedRows) => {
      changeSelectedClassifyKeys(selectedRowKeys);
      setModalClassifyCheck(selectedRows);
    }
  };
  // 确认添加分类
  const confirAdd = () => {
    if (recommendData.length <= 10) {
      console.warn(modalClassifyCheck, selectedClassifyKeys);
      addClassify({
        merchantRecommendTypeId: selectedClassifyKeys
      })
        .then((data) => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success('添加成功');
            setShowClassifyModal(false);
            changeSelectedClassifyKeys([]);
            getRecommendClassifiyData();
          } else {
            message.error('添加失败');
            changeSelectedClassifyKeys([]);
            setShowClassifyModal(false);
          }
        })
        .catch((err) => {
          message.error('添加失败');
          setShowClassifyModal(false);
          changeSelectedClassifyKeys([]);
        });
    } else {
      message.warning('最多添加10个推荐分类');
    }
  };
  // 删除分类
  const delData = (ids) => {
    delClassify({ recommendIdList: ids }).then((data) => {
      console.warn(data);
      if (data.res.code === Const.SUCCESS_CODE) {
        // changeSelectedRowKeys([]);
        getRecommendClassifiyData();
      }
    });
  };
  // 修改排序
  const changeTableSort = (dragIndex, targetIndex) => {
    const params = {
      sort: targetIndex + 1,
      merchantTypeId: recommendData[dragIndex].merchantTypeId
    };
    changeClassifySort(params)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('操作失败');
          return;
        }
        message.success('操作成功');
        getRecommendClassifiyData();
      })
      .catch((err) => {
        message.error('操作失败');
      });
  };
  return (
    <div>
      <BreadCrumb />
      <div className="recommended-classification-container">
        <p className="recommended-classification-header">推荐类目</p>
        <div className="recommended-classification-operate">
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={showAllClassify}
          >
            选择类目
          </Button>
          <Button
            type="primary"
            disabled={!checkClassify.length}
            onClick={() => {
              delData(selectedRowKeys);
            }}
          >
            批量删除
          </Button>
        </div>
        <div className="recommended-classification-table">
          {/* <Table
            rowSelection={rowSelection}
            rowKey={(record: any) => record.merchantTypeId}
            loading={tableLoading}
            columns={tableColums}
            dataSource={recommendData}
            pagination={false}
          /> */}
          <DragTable
            rowKeyName={'merchantTypeId'}
            rowSelection={true}
            loading={tableLoading}
            dragColumns={tableColums}
            dragData={recommendData}
            pagination={false}
            total={tableTotal}
            changeSort={(dragIndex, targetIndex) => {
              changeTableSort(dragIndex, targetIndex);
            }}
            changeTableSelect={(
              selectedRowKeys,
              checkRowKeys,
              selectedRows
            ) => {
              changeSelectedRowKeys(selectedRowKeys);
              setCheckClassify(selectedRows);
            }}
          />
        </div>
        <Modal
          title="选择类目"
          width={700}
          visible={showClassifyModal}
          onOk={confirAdd}
          // confirmLoading={confirmLoading}
          onCancel={() => {
            changeSelectedClassifyKeys([]);
            setShowClassifyModal(false);
          }}
          okButtonProps={{ disabled: !modalClassifyCheck.length }}
        >
          <Table
            rowKey={(record: any) => record.storeCateId}
            columns={classifyColums}
            dataSource={allClassifyData}
            rowSelection={allClassifySelection}
            pagination={false}
          ></Table>
        </Modal>
      </div>
    </div>
  );
};

export default RecommendedClassification;
