import React, { useEffect, useState } from 'react';

import {
  AuthWrapper,
  Headline,
  BreadCrumb,
  Const,
  QMUpload,
  history,
  ImgPreview
} from 'qmkit';
import {
  Button,
  Table,
  Avatar,
  message,
  Modal,
  Row,
  Col,
  Icon,
  Tooltip
} from 'antd';
import {
  getInstructionsList,
  addInstructions,
  editInstructions,
  deleteInstructions
} from './webapi';

function UserInstructions() {
  const [dataList, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editFlag, setFlag] = useState(false);
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState('');
  // 图片预览显示
  const [openPreview, setOpenPreview] = useState(false);
  // 预览图片数据
  const [imgPreviewList, setPreviewList] = useState([]);

  const getList = async () => {
    setLoading(true);
    const { res } = await getInstructionsList({ type: 0 });
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context);
    } else {
      message.error(res.message || '');
    }
  };

  useEffect(() => {
    getList();
  }, []);

  //检查文件格式
  const checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      return true;
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  //改变图片
  const editImages = ({ file, fileList }) => {
    setImages(fileList);
    console.log(fileList, 'fileList');
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
  };

  //编辑
  const edit = (row) => {
    history.push({
      pathname: '/user-instructions-edit',
      state: { data: row }
    });
    // setFlag(true);
    // setVisible(true);
    // setEditId(row.positionId);
    // setImages([
    //   {
    //     uid: 1,
    //     name: row.imageUrl,
    //     size: 1,
    //     status: 'done',
    //     url: row.imageUrl,
    //     response: [row.imageUrl]
    //   }
    // ]);
  };

  //关闭Modal
  const closeModal = () => {
    setVisible(false);
    setImages([]);
    setFlag(false);
    setEditId('');
  };

  //新增/修改提交
  const handleOk = async () => {
    if (images.length < 1) {
      message.error('请选择图片');
      return;
    }
    const params = {
      type: 0,
      imageUrl: images[0].response[0]
    };
    let result;
    if (editFlag) {
      result = await editInstructions({ ...params, positionId: editId });
    } else {
      result = await addInstructions({ ...params, delFlag: 0 });
    }
    const { res } = result;
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success(`${editFlag ? '修改' : '新增'}成功`);
      closeModal();
      getList();
    } else {
      message.error(res.message || '');
    }
  };

  //删除
  const delData = async (row) => {
    const params = {
      delFlag: 1,
      positionId: row.positionId
    };
    const { res } = await deleteInstructions(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      getList();
    } else {
      message.error(res.message || '');
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      index: 'index',
      render: (text, row, index) => index + 1
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      index: 'imageUrl',
      render: (img) => {
        return img ? (
          <div
            onClick={() => {
              setPreviewList([img]);
              setOpenPreview(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              style={{ lineHeight: 0 }}
              shape="square"
              size={64}
              src={img}
            />
          </div>
        ) : null;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      index: 'operation',
      render: (text, row) => {
        return (
          <div>
            <AuthWrapper functionName={'f_user_instructions_edit'}>
              <Button
                type="link"
                onClick={() => {
                  edit(row);
                }}
              >
                编辑
              </Button>
            </AuthWrapper>
            <AuthWrapper functionName={'f_user_instructions_delete'}>
              <Button type="link" onClick={() => delData(row)}>
                删除
              </Button>
            </AuthWrapper>
          </div>
        );
      }
    }
  ];
  return (
    <AuthWrapper functionName="f_user_instructions">
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="用户须知设置" />
          <AuthWrapper functionName={'f_user_instructions_edit'}>
            <Tooltip title="用户须知只可设置一条">
              <Button
                type="primary"
                disabled={dataList.length > 0}
                onClick={() =>
                  history.push({
                    pathname: '/user-instructions-edit'
                  })
                }
                style={{ marginBottom: '12px' }}
              >
                新增用户须知
              </Button>
            </Tooltip>
          </AuthWrapper>
          <Table
            dataSource={dataList}
            columns={columns}
            rowKey="positionId"
            loading={loading}
          />
        </div>
        <Modal
          title={editFlag ? '编辑' : '新增'}
          visible={visible}
          onOk={handleOk}
          onCancel={closeModal}
          centered
          destroyOnClose
        >
          <Row>
            <Col span={4}>选择图片</Col>
            <Col span={20}>
              <QMUpload
                name="uploadFile"
                fileList={images}
                action={
                  Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
                }
                listType="picture-card"
                accept={'.jpg,.jpeg,.png,.gif'}
                onChange={editImages}
                beforeUpload={checkUploadFile}
              >
                {images.length < 1 ? <Icon type="plus" /> : null}
              </QMUpload>
            </Col>
          </Row>
        </Modal>
        {/* 图片预览 */}
        <ImgPreview
          visible={openPreview}
          imgList={imgPreviewList}
          close={() => {
            setOpenPreview(false);
          }}
        />
      </div>
    </AuthWrapper>
  );
}

export default UserInstructions;
