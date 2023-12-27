import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Popconfirm, Modal, message } from 'antd';
import './metering-unit.less';
import { Const, BreadCrumb } from 'qmkit';
import moment from 'moment';
import {
  getGoodsUnit,
  addGoodsUnit,
  editGoodsUnit,
  delGoodsUnit
} from './webapi';

const MeteringUnit = (props) => {
  const { getFieldDecorator } = props.form;
  const tableColums = [
    {
      title: '编号',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => {
        return pageParams.pageSize * pageParams.pageNum + index + 1;
      }
    },
    {
      title: '单位名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'unit',
      key: 'unit'
    },
    // {
    //   title: '创建人/时间',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'time',
    //   key: 'time',
    //   render: (text, record) => {
    //     return (
    //       <p className="metering-unit-table-text">
    //         {record.createPerson || '-'}
    //         <br />
    //         {moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
    //       </p>
    //     );
    //   }
    // },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        // 运营后台配置的数据不可修改
        if (record.companyInfoId !== -1) {
          return (
            <div className="market-table-btn">
              <Button
                type="link"
                onClick={() => {
                  openModal(true, record);
                }}
              >
                修改
              </Button>
              <Popconfirm
                placement="topRight"
                title={'确认删除该条数据？'}
                onConfirm={() => {
                  delUnit(record);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </div>
          );
        } else {
          return '--';
        }
      }
    }
  ];
  // 计量单位数据
  const [meteringUnitData, setMeteringUnitData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 总数
  const [tableTotal, setTotal] = useState(0);
  // 表格loading
  const [tableLoading, setTableLoading] = useState(false);
  // 弹窗显示
  const [showModal, setShowModal] = useState(false);
  // 是否编辑
  const [isEdit, setEdit] = useState(false);
  // 弹窗按钮loading
  const [confirmLoading, setModalLoading] = useState(false);
  // 当前编辑数据
  const [currentUnitInfo, setCurrentUnitInfo] = useState({} as any);
  // 初始化
  useEffect(() => {
    getMeteringUnitData();
  }, [pageParams]);
  // 获取计量单位数据
  const getMeteringUnitData = () => {
    setTableLoading(true);
    getGoodsUnit(pageParams)
      .then((data) => {
        setTableLoading(false);
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取计量单位数据失败');
          return;
        }
        setMeteringUnitData(data.res.context.goodsUnitVos.content);
        setTotal(data.res.context.goodsUnitVos.totalElements);
      })
      .catch((err) => {
        setTableLoading(false);
        message.error('获取计量单位数据失败');
        console.warn(err);
      });
  };
  // 翻页
  const changeTablePage = (pageNum) => {
    changePage({ ...pageParams, pageNum });
  };
  // 弹窗显示
  const openModal = (openEdit = false, data = {}) => {
    props.form.resetFields();
    setEdit(openEdit);
    setCurrentUnitInfo(data);
    setShowModal(true);
  };
  // 弹窗确认
  const confirmOperate = () => {
    setModalLoading(true);
    props.form.validateFieldsAndScroll((err, value) => {
      setModalLoading(false);
      if (!err) {
        console.warn(value);
        if (isEdit) {
          const params = {
            storeGoodsUnitId: currentUnitInfo.storeGoodsUnitId,
            delFlag: 0,
            ...value
          };
          editUnitData(params);
        } else {
          addUnitData(value);
        }
      }
    });
  };
  // 新增
  const addUnitData = (data) => {
    addGoodsUnit(data)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error(data.res.message || '新增失败');
          return;
        }
        message.success('新增成功');
        setShowModal(false);
        getMeteringUnitData();
      })
      .catch((err) => {
        console.warn(err);
        message.error('新增失败');
        setShowModal(false);
        getMeteringUnitData();
      });
  };
  // 修改
  const editUnitData = (data) => {
    editGoodsUnit(data)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error(data.res.message || '修改失败');
          return;
        }
        message.success('修改成功');
        setShowModal(false);
        getMeteringUnitData();
      })
      .catch((err) => {
        console.warn(err);
        message.error('修改失败');
        setShowModal(false);
      });
  };
  // 删除
  const delUnit = (data) => {
    const params = {
      storeGoodsUnitId: data.storeGoodsUnitId,
      delFlag: 0
    };
    delGoodsUnit(params)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
        getMeteringUnitData();
      })
      .catch((err) => {
        console.warn(err);
        message.error('删除失败');
        getMeteringUnitData();
      });
  };
  return (
    <div>
      <BreadCrumb />
      <div className="metering-unit-container">
        <p className="metering-unit-header">计量单位</p>
        <div className="metering-unit-operate">
          <Button
            type="primary"
            onClick={() => {
              openModal(false);
            }}
          >
            新增
          </Button>
        </div>
        <div className="metering-unit-table">
          <Table
            rowKey={(record: any) => record.storeGoodsUnitId}
            loading={tableLoading}
            columns={tableColums}
            dataSource={meteringUnitData}
            pagination={{
              current: pageParams.pageNum + 1,
              pageSize: pageParams.pageSize,
              total: tableTotal,
              onChange: (pageNum) => {
                changeTablePage(pageNum - 1);
              }
            }}
          />
        </div>
      </div>
      <Modal
        title={`${isEdit ? '编辑' : '新建计量单位'}`}
        width={500}
        visible={showModal}
        onOk={confirmOperate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setShowModal(false);
          setCurrentUnitInfo({});
        }}
      >
        <Form
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          <Form.Item style={{ marginBottom: 15 }} label="单位名称">
            {getFieldDecorator('unit', {
              rules: [{ required: true, message: '请输入单位名称' }],
              initialValue: isEdit ? currentUnitInfo.unit : ''
            })(<Input placeholder="请输入单位名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const MeteringUnitTemplate = Form.create()(MeteringUnit);

export default MeteringUnitTemplate;
