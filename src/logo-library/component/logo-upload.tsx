import React, { useEffect, useState } from 'react';
import { Modal, message, Form, TreeSelect, Upload, Icon } from 'antd';
import { Const, cache } from 'qmkit';
import { uploadLogo } from '../webapi';

function LogoUpload(props) {
  const [showModal, setShow] = useState(false);
  const [cateIdCurr, setCateId] = useState();
  const [FILE_MAX_SIZE] = useState(2 * 1024 * 1024);
  useEffect(() => {
    if (props.visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [props.visible]);
  //处理分类的树形图结构数据
  const loop = (cateList) =>
    cateList.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeSelect.TreeNode
            key={item.cateId}
            value={item.cateId}
            title={item.cateName}
          >
            {loop(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return (
        <TreeSelect.TreeNode
          key={item.cateId}
          value={item.cateId}
          title={item.cateName}
        />
      );
    });
  const { storeId, companyInfoId } = JSON.parse(
    sessionStorage.getItem(cache.LOGIN_DATA)
  );
  const uploadProps = {
    name: 'uploadFile',
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    multiple: true,
    showUploadList: { showPreviewIcon: false, showRemoveIcon: false },
    action:
      Const.HOST +
      `/store/uploadStoreResource?cateId=${cateIdCurr}&storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=LOGO`,
    accept: '.jpg,.jpeg,.png,.gif',
    beforeUpload(file) {
      if (!cateIdCurr) {
        message.error('请先选择分类!');
        return false;
      }
      let fileName = file.name.toLowerCase();

      if (!fileName.trim()) {
        message.error('请输入文件名');
        return false;
      }

      if (
        /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
          fileName
        )
      ) {
        message.error('请输入正确格式的文件名');
        return false;
      }

      if (fileName.length > 40) {
        message.error('文件名过长');
        return false;
      }

      // 支持的图片格式：jpg、jpeg、png、gif
      if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.gif')
      ) {
        if (file.size <= FILE_MAX_SIZE) {
          return true;
        } else {
          message.error('文件大小不能超过2M');
          return false;
        }
      } else {
        message.error('文件格式错误');
        return false;
      }
    },
    onChange(info) {
      const status = info.file.status;
      let fileList = info.fileList;
      if (status === 'done') {
        if (
          info.file.response &&
          info.file.response.code &&
          info.file.response.code !== Const.SUCCESS_CODE
        ) {
          message.error(`${info.file.name} 上传失败！`);
        } else {
          message.success(`${info.file.name} 上传成功！`);
          props.compeletHide();
          setShow(false);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
      //仅展示上传中和上传成功的文件列表
      fileList = fileList.filter(
        (f) =>
          f.status == 'uploading' ||
          (f.status == 'done' && !f.response) ||
          (f.status == 'done' && f.response && !f.response.code)
      );
      //   setFileList(fileList);
    }
  };
  const changeCate = (e) => {
    setCateId(e);
  };
  const confirmAdd = () => {
    props.form.validateFieldsAndScroll((err, val) => {
      console.warn(err, val);
      const params = {
        cateId: val.cateId,
        resourceType: 3
      };
      uploadLogo();
    });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      title="上传logo"
      width={500}
      visible={showModal}
      onOk={confirmAdd}
      //   confirmLoading={confirmLoading}
      onCancel={() => {
        setShow(false);
        props.hide();
      }}
      footer={null}
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
        <Form.Item label="选择分类" hasFeedback>
          {getFieldDecorator('cateId', {
            rules: [{ required: true, message: '请输入选择分类' }],
            initialValue: ''
          })(
            <TreeSelect
              // showSearch
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              allowClear
              treeDefaultExpandAll
              onChange={changeCate}
            >
              {loop(props.allCate)}
            </TreeSelect>
          )}
        </Form.Item>
        <Form.Item label="选择logo图片" required={true}>
          {getFieldDecorator('uploadFile', {
            rules: [{ required: true, message: '请输入上传logo' }],
            initialValue: ''
          })(
            <Upload.Dragger
              {...uploadProps}
              // fileList={}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖拽图片以上传</p>
              <p className="ant-upload-hint">支持一张或多张图片上传</p>
            </Upload.Dragger>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
const LogoUploadTemplate = Form.create()(LogoUpload);

export default LogoUploadTemplate;
