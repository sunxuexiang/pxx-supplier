import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Form,
  Input,
  Divider,
  Switch,
  message,
  notification
} from 'antd';
import './user-instructions-edit.less';
import html2canvas from 'html2canvas';
import { uploadBase64File, addInstructions, editInstructions } from './webapi';
import { RichText, Const } from 'qmkit';
import { SketchPicker } from 'react-color';

const UserInstructionsEdit = (props) => {
  // 关于商品Ref
  const aboutGoods = useRef(null);
  // 关于物流Ref
  const aboutLogistics = useRef(null);
  // 关于售后Ref
  const aboutAfterSales = useRef(null);
  // 编辑状态
  const [isEdit, setEdit] = useState(false);
  // 当前编辑信息
  const [currentInfo, setInfo] = useState({} as any);
  // 颜色选择
  const [selectColor, setSelectColor] = useState({
    displayColorPicker: false,
    color: '#fff'
  });
  // 开关初始值
  const [initSwitch, setInitSwitch] = useState({
    serviceTimeSwitch: false,
    aboutProductSwitch: false,
    aboutLogisticsSwitch: false,
    aboutSalesSwitch: false
  });
  // 保存loading
  const [saveLoading, setLoading] = useState(false);
  // 初始化
  useEffect(() => {
    console.warn(history);
    if (history.state.state && history.state.state.data) {
      const initInfo = history.state.state.data;
      setInfo(initInfo);
      setSelectColor({
        ...selectColor,
        color: history.state.state.data.backgroundColor || '#F56C1D'
      });
      setEdit(true);
      setInitSwitch({
        serviceTimeSwitch: initInfo.serviceTimeSwitch === 1,
        aboutProductSwitch: initInfo.aboutProductSwitch === 1,
        aboutLogisticsSwitch: initInfo.aboutLogisticsSwitch === 1,
        aboutSalesSwitch: initInfo.aboutSalesSwitch === 1
      });
    }
  }, []);
  // 验证
  const verifyData = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const el = document.getElementById('editInfo');
        html2canvas(el, {
          allowTaint: false,
          useCORS: true,
          width: el.offsetWidth,
          height: el.offsetHeight
        }).then((canvas) => {
          const dataUrl = canvas.toDataURL();
          if (dataUrl) {
            // 上传Base64
            uploadBase64File({ content: dataUrl }).then((data) => {
              if (data && data.res.length > 0) {
                const {
                  servicePhone,
                  serviceTime,
                  aboutProduct,
                  aboutLogistics,
                  aboutSales,
                  backgroundColor,
                  serviceTimeSwitch,
                  descSwitch,
                  aboutProductSwitch,
                  aboutLogisticsSwitch,
                  aboutSalesSwitch
                } = value;
                let params = {
                  imageUrl: data.res[0],
                  servicePhone,
                  aboutProduct,
                  aboutLogistics,
                  aboutSales,
                  serviceTime,
                  backgroundColor,
                  serviceTimeSwitch: serviceTimeSwitch ? 1 : 0,
                  descSwitch: descSwitch ? 1 : 0,
                  aboutProductSwitch: aboutProductSwitch ? 1 : 0,
                  aboutLogisticsSwitch: aboutLogisticsSwitch ? 1 : 0,
                  aboutSalesSwitch: aboutSalesSwitch ? 1 : 0
                } as any;
                if (isEdit) {
                  // 编辑
                  params = {
                    ...params,
                    positionId: currentInfo.positionId,
                    storeId: currentInfo.storeId
                  };
                  editData(params);
                } else {
                  // 新增
                  params = {
                    ...params,
                    type: 0,
                    delFlag: 0
                  };
                  addData(params);
                }
              }
            });
          }

          // const link = document.createElement('a'); // 建立一个超连接对象实例
          // const event = new MouseEvent('click'); // 建立一个鼠标事件的实例
          // link.download = 'img.png'; // 设置要下载的图片的名称
          // link.href = canvas.toDataURL(); // 将图片的URL设置到超连接的href中
          // link.dispatchEvent(event); // 触发超连接的点击事件
        });
      }
    });
  };
  // 新增
  const addData = (params) => {
    setLoading(true);
    addInstructions(params)
      .then((res) => {
        setLoading(false);
        if (res.res.code !== Const.SUCCESS_CODE) {
          message.error('新增失败');
          return;
        }
        console.warn(res);
        notification.success({
          message: '新增成功',
          description: '操作成功'
        });
        history.back();
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
        message.error('新增失败');
      });
  };
  // 编辑
  const editData = (params) => {
    setLoading(true);
    editInstructions(params)
      .then((res) => {
        setLoading(false);
        if (res.res.code !== Const.SUCCESS_CODE) {
          message.error('编辑失败');
          return;
        }
        notification.success({
          message: '编辑成功',
          description: '操作成功'
        });
        history.back();
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
        message.error('编辑失败');
      });
  };
  const colorChange = ({ hex }: any) => {
    console.warn(hex);
    props.form.setFieldsValue({ backgroundColor: hex });
    setSelectColor({ ...selectColor, color: hex });
  };
  // 开关校验
  const switchChange = (key, checked) => {
    setInitSwitch({ ...initSwitch, [key]: checked });
  };
  const { getFieldDecorator } = props.form;
  return (
    <div className="user-instructions-edit-container">
      <div className="user-instructions-header">用户须知</div>
      <div className="user-instructions-operate">
        <Button
          icon="edit"
          type="primary"
          style={{ marginRight: 20 }}
          onClick={verifyData}
          loading={saveLoading}
        >
          {saveLoading ? '正在保存信息' : '保存'}
        </Button>
        <Button
          icon="redo"
          type="primary"
          onClick={() => {
            history.back();
          }}
        >
          取消
        </Button>
      </div>
      <div className="user-instructions-content">
        {/* 编辑区域 */}
        <div className="user-instructions-edit-info">
          <Form>
            <Form.Item style={{ marginBottom: 15 }} label="客服热线">
              {getFieldDecorator('servicePhone', {
                rules: [{ required: true, message: '请输入客服热线' }],
                initialValue: isEdit ? currentInfo.servicePhone : ''
              })(<Input placeholder="请输入客服热线" />)}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15, display: 'flex' }}
              required={initSwitch.serviceTimeSwitch}
              label="客服工作时间"
            >
              {getFieldDecorator('serviceTimeSwitch', {
                valuePropName: 'checked',
                initialValue: initSwitch.serviceTimeSwitch
              })(
                <Switch
                  onChange={(checked) =>
                    switchChange('serviceTimeSwitch', checked)
                  }
                />
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: 15 }}>
              {getFieldDecorator('serviceTime', {
                rules: [
                  {
                    required: initSwitch.serviceTimeSwitch,
                    message: '请输入客服工作时间'
                  }
                ],
                initialValue: isEdit ? currentInfo.serviceTime : ''
              })(<Input placeholder="请输入客服工作时间" />)}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15, display: 'flex' }}
              required
              label="客服热线描述"
            >
              {getFieldDecorator('descSwitch', {
                valuePropName: 'checked',
                initialValue: isEdit ? currentInfo.descSwitch === 1 : false
              })(<Switch />)}
            </Form.Item>
            <Form.Item style={{ marginBottom: 15 }} label="背景色">
              {getFieldDecorator('backgroundColor', {
                rules: [{ required: true, message: '请选择背景色' }],
                initialValue: isEdit ? currentInfo.backgroundColor : '#fff'
              })(
                <div>
                  <SketchPicker
                    color={selectColor.color}
                    onChange={colorChange}
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15, display: 'flex' }}
              required={initSwitch.aboutProductSwitch}
              label="商品"
            >
              {getFieldDecorator('aboutProductSwitch', {
                valuePropName: 'checked',
                initialValue: initSwitch.aboutProductSwitch
              })(
                <Switch
                  onChange={(checked) =>
                    switchChange('aboutProductSwitch', checked)
                  }
                />
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: 15 }}>
              {getFieldDecorator('aboutProduct', {
                rules: [
                  {
                    required: initSwitch.aboutProductSwitch,
                    message: '请输入商品内容'
                  }
                ]
              })(
                <RichText
                  defaultContent={isEdit ? currentInfo.aboutProduct : ''}
                  contentChange={(data) => {
                    aboutGoods.current.innerHTML = data;
                    props.form.setFieldsValue({
                      aboutProduct: data === '<p></p>' ? '' : data
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15, display: 'flex' }}
              required={initSwitch.aboutLogisticsSwitch}
              label="快递/物流"
            >
              {getFieldDecorator('aboutLogisticsSwitch', {
                valuePropName: 'checked',
                initialValue: initSwitch.aboutLogisticsSwitch
              })(
                <Switch
                  onChange={(checked) =>
                    switchChange('aboutLogisticsSwitch', checked)
                  }
                />
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: 15 }}>
              {getFieldDecorator('aboutLogistics', {
                rules: [
                  {
                    required: initSwitch.aboutLogisticsSwitch,
                    message: '请输入快递/物流内容'
                  }
                ]
              })(
                <RichText
                  defaultContent={isEdit ? currentInfo.aboutLogistics : ''}
                  contentChange={(data) => {
                    aboutLogistics.current.innerHTML = data;
                    props.form.setFieldsValue({
                      aboutLogistics: data === '<p></p>' ? '' : data
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15, display: 'flex' }}
              required={initSwitch.aboutSalesSwitch}
              label="售后"
            >
              {getFieldDecorator('aboutSalesSwitch', {
                valuePropName: 'checked',
                initialValue: initSwitch.aboutSalesSwitch
              })(
                <Switch
                  onChange={(checked) =>
                    switchChange('aboutSalesSwitch', checked)
                  }
                />
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: 15 }}>
              {getFieldDecorator('aboutSales', {
                rules: [
                  {
                    required: initSwitch.aboutSalesSwitch,
                    message: '请输入售后内容'
                  }
                ]
              })(
                <RichText
                  defaultContent={isEdit ? currentInfo.aboutSales : ''}
                  contentChange={(data) => {
                    aboutAfterSales.current.innerHTML = data;
                    props.form.setFieldsValue({
                      aboutSales: data === '<p></p>' ? '' : data
                    });
                  }}
                />
              )}
            </Form.Item>
          </Form>
        </div>
        <div className="user-instructions-preivew">
          {/* 内容图片 */}
          <div className="preivew-content" id="editInfo">
            <div
              style={{
                backgroundColor: selectColor.color
              }}
            >
              <img
                className="preivew-header"
                src={require('./img/header-img.png')}
              />
            </div>

            <div className="preview-service">
              <img
                className="preview-service-img"
                src={require('./img/service-img.png')}
              />
              <div className="preview-service-info">
                <p className="service-info-hot">
                  客服热线：
                  <span>{props.form.getFieldValue('servicePhone')}</span>
                </p>
                {props.form.getFieldValue('serviceTimeSwitch') && (
                  <p className="service-info-time">
                    客服工作时间：
                    <span>{props.form.getFieldValue('serviceTime')}</span>
                  </p>
                )}

                {/* <p className="service-info-desc"></p> */}
                {props.form.getFieldValue('descSwitch') && (
                  <Divider>
                    <span className="service-info-desc">
                      特殊节假日请以平台公示为准
                    </span>
                  </Divider>
                )}
              </div>
            </div>
            <div
              className={
                props.form.getFieldValue('aboutProductSwitch')
                  ? 'preivew-info-box'
                  : 'preivew-info-box-hidden'
              }
            >
              <p
                className="preivew-info-title"
                style={{
                  backgroundColor: selectColor.color
                }}
              >
                商&nbsp;品
              </p>
              <div ref={aboutGoods} className="preivew-info-content"></div>
            </div>

            <div
              className={
                props.form.getFieldValue('aboutLogisticsSwitch')
                  ? 'preivew-info-box'
                  : 'preivew-info-box-hidden'
              }
            >
              <p
                className="preivew-info-title"
                style={{
                  backgroundColor: selectColor.color
                }}
              >
                快&nbsp;递&nbsp;/&nbsp;物&nbsp;流
              </p>
              <div ref={aboutLogistics} className="preivew-info-content"></div>
            </div>
            <div
              className={
                props.form.getFieldValue('aboutSalesSwitch')
                  ? 'preivew-info-box'
                  : 'preivew-info-box-hidden'
              }
            >
              <p
                className="preivew-info-title"
                style={{
                  backgroundColor: selectColor.color
                }}
              >
                售&nbsp;后
              </p>
              <div ref={aboutAfterSales} className="preivew-info-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserInstructionsEditTemplate = Form.create()(UserInstructionsEdit);

export default UserInstructionsEditTemplate;
