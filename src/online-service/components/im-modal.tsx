import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  message,
  Row,
  Col,
  Select,
  Button
} from 'antd';
import { saveIMConfig, getIMConfig, getAllEmployees } from '../webapi';
import { cache, Const, util, ValidConst } from 'qmkit';
import { produce } from 'immer';

let serviceKey = 0;
function ImModal(props) {
  // 终端类型
  const [plainOptions] = useState([
    { label: 'APP', value: 'app' },
    { label: 'PC', value: 'pc' }
    // { label: '小程序', value: 'mini' },
    // { label: 'h5', value: 'h5' }
  ]);
  // 终端字段映射
  const [effectData] = useState({
    app: 'effectiveApp',
    pc: 'effectivePc',
    mini: 'effectiveMiniProgram',
    h5: 'effectiveH5'
  });
  // 是否显示添加按钮
  const [showAddButton, setShowAddButton] = useState(true);
  // 已选择终端类型
  const [checkData, setCheckData] = useState([]);
  // 客服配置信息
  const [chatConfig, setConfig] = useState({} as any);
  // 账号信息
  const [accountConfig, setAccountConfig] = useState({} as any);
  // 当前用户的登录信息
  const [loginInfo, setLogoinInfo] = useState({} as any);
  // 员工列表
  const [employeesList, setEmployeesList] = useState([]);
  // 添加参数
  const [addParams, setAddParams] = useState({} as any);
  // 保存按钮loading
  const [saveLoading, setSaveLoading] = useState(false);

  const loginData = util.getLoginData();

  useEffect(() => {
    if (props.show) {
      getIMConfigData();
      getAllEmployeesList();
    }
  }, [props.show]);
  // 终端选择
  const changeCheck = () => {};
  // 获取所有员工
  const getAllEmployeesList = () => {
    getAllEmployees()
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('查询员工列表信息失败');
          return;
        }
        setEmployeesList(data.res.context.context.employeeList);
      })
      .catch((err) => {
        message.error('查询员工列表信息失败');
      });
  };

  /**
   * 生成客服名称
   * @param serviceList 客服列表
   * @param type 类型 0: 默认类型，1：添加类型，2：删除类型
   * @returns 名称 string
   */
  const getServiceName = (serviceList, type = 0) => {
    let index = serviceList.length + 1;
    if (type == 1) {
      const matchs = parseInt(
        addParams.customerServiceName.match(/(\d+)/g)[0],
        10
      );
      index = matchs + 1;
      if (index == 4) {
        index = 5;
      }
    }
    if (type == 2) {
      const matchs = parseInt(
        addParams.customerServiceName.match(/(\d+)/g)[0],
        10
      );
      index = matchs - 1;
      if (index == 4) {
        index = 3;
      }
    }
    const suffix = index < 10 ? `0${index}` : index;
    return `${loginData.storeName}客服${suffix}号`;
  };

  // 获取IM配置
  const getIMConfigData = () => {
    getIMConfig()
      .then((data) => {
        console.warn(data);
        if (data.res.code !== Const.SUCCESS_CODE) {
          return;
        }
        // 终端类型选择默认值
        const configData = data.res.context.imOnlineServerRop;
        const checkArr = [];
        for (let key in effectData) {
          if (
            configData[effectData[key]] &&
            configData[effectData[key]] === 1
          ) {
            checkArr.push(key);
          }
        }
        const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
        // loginInfo.isMasterAccount = 0;

        if (loginInfo.isMasterAccount === 1) {
          const serviceList = data.res.context.imOnlineServerItemRopList.map(
            (item) => {
              let account = '';
              if (
                item.customerServiceAccount.indexOf(
                  `${loginInfo.companyInfoId}_`
                ) !== -1
              ) {
                const accountArr = item.customerServiceAccount.split(
                  `${loginInfo.companyInfoId}_`
                );
                account = accountArr[1];
              } else {
                account = item.customerServiceAccount || '';
              }
              const listItem = {
                ...item,
                customerServiceAccount: account,
                serviceKey: serviceKey++,
                disabled: true
              };
              return listItem;
            }
          );
          const configParams = {
            imOnlineServerRop: { ...data.res.context.imOnlineServerRop },
            imOnlineServerItemRopList: [...serviceList]
          };
          setConfig({ ...configParams });
          setAddParams({
            ...addParams,
            customerServiceName: getServiceName(
              configParams.imOnlineServerItemRopList
            )
          });
        } else {
          const currentServiceInfo = data.res.context.imOnlineServerItemRopList.find(
            (item) => {
              return item.phoneNo === loginInfo.mobile;
            }
          );
          let account = '';
          if (
            currentServiceInfo.customerServiceAccount.indexOf(
              `${loginInfo.companyInfoId}_`
            ) !== -1
          ) {
            const accountArr = currentServiceInfo.customerServiceAccount.split(
              `${loginInfo.companyInfoId}_`
            );
            account = accountArr[1];
          } else {
            account = currentServiceInfo.customerServiceAccount || '';
          }
          currentServiceInfo.customerServiceAccount = account;
          console.warn(currentServiceInfo, '当前客服信息');
          setAccountConfig(currentServiceInfo || {});
          setConfig({ ...data.res.context });
        }
        setLogoinInfo(loginInfo);
        // 设置选择终端类型
        setCheckData(checkArr);
      })
      .catch((err) => {});
  };
  // 保存
  const confirmOperate = () => {
    const isValidAddParam = () => {
      if (Object.keys(addParams).length < 3) {
        return false;
      }
      for (let key in addParams) {
        const val = `${addParams[key]}`;
        if (val.trim().length === 0) {
          return false;
        }
      }
      return true;
    };

    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        // 生效终端
        const effectParams = {
          [effectData.app]: 1,
          [effectData.pc]: 1,
          serverStatus: 1
        };
        // value.effectTerminal.forEach((item) => {
        //   if (effectData[item]) {
        //     effectParams[effectData[item]] = 1;
        //   }
        // });
        const imOnlineServerRop = chatConfig.imOnlineServerRop;
        const params = {
          imOnlineServerRop: {
            ...imOnlineServerRop,
            serverStatus: value.serverStatus,
            ...effectParams
          },
          imOnlineServerItemRopList: []
        };
        if (loginInfo.isMasterAccount === 1) {
          console.warn(chatConfig.imOnlineServerItemRopList, '-------');
          const onlineRopList = [...chatConfig.imOnlineServerItemRopList];
          // 管理员保存
          const transformNewItem = (item) => {
            const idx = employeesList.findIndex((el) => {
              return (
                el.employeeMobile === value[`phoneNo${item.serviceKey}`] ||
                (isValidAddParam() && el.employeeMobile == addParams.phoneNo)
              );
            });
            const newItem = { ...item };
            newItem.customerServiceName =
              value[`customerServiceName${item.serviceKey}`];
            // 账号拼接 公司id+输入的账号
            const phoneNo = value[`phoneNo${item.serviceKey}`];
            newItem.customerServiceAccount = `${loginInfo.companyInfoId}_${phoneNo}`;
            // value[`customerServiceAccount${item.serviceKey}`]
            newItem.phoneNo = phoneNo;
            newItem.employeeId =
              idx !== -1 ? employeesList[idx].employeeId : '';
            return newItem;
          };
          const serviceList = onlineRopList.map(transformNewItem);
          params.imOnlineServerItemRopList = serviceList;

          if (
            isValidAddParam() &&
            serviceList[serviceList.length - 1].phoneNo != addParams.phoneNo
          ) {
            const lastData = serviceList[serviceList.length - 1];
            const idx = employeesList.findIndex((el) => {
              return el.employeeMobile == addParams.phoneNo;
            });
            serviceList.push({
              customerServiceAccount: `${lastData.companyInfoId}_${addParams.customerServiceAccount}`,
              customerServiceName: addParams.customerServiceName,
              employeeId: employeesList[idx].employeeId,
              phoneNo: addParams.phoneNo,
              serviceKey: lastData.serviceKey + 1
            });
          }
        } else {
          // 商家保存
          const serviceList = chatConfig.imOnlineServerItemRopList;
          serviceList.map((item) => {
            if (item.phoneNo === value.phoneNo) {
              item['customerServiceName'] = value.customerServiceName;
              item[
                'customerServiceAccount'
              ] = `${loginInfo.companyInfoId}_${value.customerServiceAccount}`;
              item['phoneNo'] = value.phoneNo;
            }
            return item;
          });
          params.imOnlineServerItemRopList = serviceList;
        }
        setSaveLoading(true);
        saveIMConfig(params)
          .then((data) => {
            setSaveLoading(false);
            if (data.res.code !== Const.SUCCESS_CODE) {
              message.error(data.res.message || '保存失败');
              return;
            }
            console.warn(data);
            message.success('保存成功');
            props.form.resetFields();
            serviceKey = 0;
            setAddParams({});
            props.closeModal(true, params.imOnlineServerItemRopList);
          })
          .catch((err) => {
            console.warn(err);
            setSaveLoading(false);
            message.error('保存失败');
            props.form.resetFields();
            serviceKey = 0;
            props.closeModal(false);
          });
      }
    });
  };

  const changeOnlineServerItems = (index) => {
    setConfig(
      produce(chatConfig, (draft) => {
        for (let i = 0; i < draft.imOnlineServerItemRopList.length; i++) {
          const element = draft.imOnlineServerItemRopList[i];
          element.managerFlag = index === i ? 1 : 0;
        }
      })
    );
  };

  // 根据登录身份渲染客服部分内容
  const renderService = () => {
    if (loginInfo.isMasterAccount === 1) {
      return (
        <Row>
          {chatConfig.imOnlineServerItemRopList.map((item, index) => {
            return (
              <Row gutter={24} key={item.serviceKey}>
                <Col span={8}>
                  <Form.Item style={{ marginBottom: 15 }} label="昵称">
                    {getFieldDecorator(
                      `customerServiceName${item.serviceKey}`,
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入客服昵称'
                          }
                        ],
                        initialValue: item.customerServiceName || ''
                      }
                    )(<Input disabled placeholder="请输入客服昵称" />)}
                  </Form.Item>
                </Col>
                {/* <Col span={5}>
                  <Form.Item style={{ marginBottom: 15 }} label="账号">
                    {getFieldDecorator(
                      `customerServiceAccount${item.serviceKey}`,
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入客服账号'
                          }
                        ],
                        initialValue: item.customerServiceAccount || ''
                      }
                    )(<Input disabled placeholder="请输入客服账号" />)}
                  </Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item style={{ marginBottom: 15 }} label="客服账号">
                    {getFieldDecorator(`phoneNo${item.serviceKey}`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入客服手机号'
                        },
                        {
                          pattern: ValidConst.phone,
                          message: '请输入正确的手机号'
                        },
                        {
                          validator: (_, value, callback) => {
                            if (value) {
                              // 判断手机号不可重复
                              let findCount = 0;
                              for (const item of chatConfig.imOnlineServerItemRopList) {
                                if (item.phoneNo === value) {
                                  findCount++;
                                }
                              }
                              if (findCount >= 2) {
                                callback('手机号不可重复');
                                return;
                              }
                            }
                            callback();
                          }
                        }
                      ],
                      initialValue: item.phoneNo || ''
                    })(
                      // <Select
                      //   showSearch
                      //   optionFilterProp="children"
                      //   filterOption={(input, option: any) => {
                      //     return option.props.children.indexOf(input) >= 0;
                      //   }}
                      // >
                      //   {employeesList.map((el) => {
                      //     return (
                      //       <Select.Option
                      //         value={el.employeeMobile}
                      //         key={el.employeeId}
                      //       >
                      //         {el.employeeMobile}
                      //       </Select.Option>
                      //     );
                      //   })}
                      // </Select>

                      <Input
                        disabled={item.disabled}
                        placeholder="请输入手机号"
                        onChange={(e) => {
                          const value = e.target.value;
                          props.form.setFieldsValue({
                            [`customerServiceAccount${item.serviceKey}`]: value
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    type="link"
                    onClick={() => delService(item.serviceKey)}
                  >
                    删除
                  </Button>
                  <Radio
                    value={item.serviceKey}
                    style={{ color: '#F56C1D' }}
                    checked={item.managerFlag == 1}
                    onChange={async (e) => {
                      changeOnlineServerItems(index);
                    }}
                  >
                    设为管理员
                  </Radio>
                </Col>
              </Row>
            );
          })}
        </Row>
      );
    } else {
      return (
        <Row>
          <Form.Item style={{ marginBottom: 15 }} label="客服昵称">
            {getFieldDecorator('customerServiceName', {
              rules: [{ required: true, message: '请输入客服昵称' }],
              initialValue: accountConfig.customerServiceName || ''
            })(<Input placeholder="请输入客服昵称" />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="客服账号">
            {getFieldDecorator('customerServiceAccount', {
              rules: [{ required: true, message: '请输入客服账号' }],
              initialValue: accountConfig.customerServiceAccount || ''
            })(<Input placeholder="请输入客服账号" />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="客服账号">
            {getFieldDecorator('phoneNo', {
              rules: [{ required: true, message: '请选择客服手机号' }],
              initialValue: accountConfig.phoneNo || ''
            })(
              // <Select
              //   showSearch
              //   optionFilterProp="children"
              //   filterOption={(input, option: any) => {
              //     return option.props.children.indexOf(input) >= 0;
              //   }}
              // >
              //   {employeesList.map((el) => {
              //     return (
              //       <Select.Option
              //         value={el.employeeMobile}
              //         key={el.employeeId}
              //       >
              //         {el.employeeMobile}
              //       </Select.Option>
              //     );
              //   })}
              // </Select>
              <Input placeholder="请输入手机号" />
            )}
          </Form.Item>
        </Row>
      );
    }
  };
  // 客服账号输入控制
  const serviceAccountDeal = (value) => {
    const mustStr = `${loginInfo.companyInfoId}_`;
    if (value.indexOf(mustStr) < 0) {
      return mustStr;
    } else {
      return value;
    }
  };

  /**
   * 是否隐藏添加客服按钮
   * @param type 0:默认类型 1 添加 2 删除
   */
  const checkCanAdd = (type) => {
    const len = chatConfig.imOnlineServerItemRopList.length;
    if (!util.isSelfStore()) {
      // 非自营
      let show = true;
      if (type == 0 && len >= 5) {
        show = false;
      }
      if (type == 1 && len >= 4) {
        show = false;
      } else if (type == 2) {
        show = true;
      }
      setShowAddButton(show);
    }
  };

  // 添加客服
  const addService = () => {
    // if (!ValidConst.phone.test(addParams.phoneNo)) {
    //   message.error('请输入正确的手机号');
    //   return false;
    // }
    setConfig(
      produce(chatConfig, (draft) => {
        draft.imOnlineServerItemRopList.push({
          ...addParams,
          serviceKey: serviceKey++
        });
      })
    );
    setAddParams({
      ...addParams,
      customerServiceName: getServiceName(
        chatConfig.imOnlineServerItemRopList,
        1
      )
    });
    // checkCanAdd(1);
  };

  // 删除
  const delService = (serviceKey) => {
    const list = chatConfig.imOnlineServerItemRopList;
    const arr = list.filter((item) => {
      return item.serviceKey !== serviceKey;
    });
    setConfig({ ...chatConfig, imOnlineServerItemRopList: [...arr] });

    const name = getServiceName(arr, 2);
    const findNames = arr.filter((item) => {
      return item.customerServiceName === name;
    });
    if (findNames.length == 0) {
      setAddParams({
        ...addParams,
        customerServiceName: name
      });
    }
    // checkCanAdd(2);
  };

  const { getFieldDecorator } = props.form;
  return (
    <Modal
      maskClosable={false}
      destroyOnClose={true}
      title="IM商家客服"
      visible={props.show}
      confirmLoading={saveLoading}
      okText={saveLoading ? '正在保存' : '保存'}
      onOk={confirmOperate}
      onCancel={() => {
        props.form.resetFields();
        props.closeModal();
      }}
      width={loginInfo.isMasterAccount === 1 ? 900 : 700}
    >
      <Form
        labelCol={{
          span: 10
        }}
        wrapperCol={{
          span: 14
        }}
        autoComplete="off"
      >
        {chatConfig.imOnlineServerItemRopList && renderService()}
        {/* <Row>
          <Col span={loginInfo.isMasterAccount === 1 ? 9 : 24}>
            <Form.Item style={{ marginBottom: 15 }} label="启用开关">
              {getFieldDecorator('serverStatus', {
                rules: [{ required: true, message: '请选择启用状态' }],
                initialValue: chatConfig.imOnlineServerRop
                  ? chatConfig.imOnlineServerRop.serverStatus
                  : ''
              })(
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={loginInfo.isMasterAccount === 1 ? 12 : 24}>
            <Form.Item style={{ marginBottom: 15 }} label="生效终端">
              {getFieldDecorator('effectTerminal', {
                initialValue: checkData.length ? checkData : [],
                rules: [
                  {
                    required: true,
                    message: '请选择生效终端'
                  }
                ]
              })(
                <Checkbox.Group options={plainOptions} onChange={changeCheck} />
              )}
            </Form.Item>
          </Col>
        </Row> */}
        {loginInfo.isMasterAccount === 1 && (
          <Row gutter={20}>
            {/* <Col span={8}>
              <Form.Item style={{ marginBottom: 15 }} label="昵称">
                <Input
                  disabled
                  placeholder="请输入客服昵称"
                  value={addParams.customerServiceName}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      customerServiceName: e.target.value
                    });
                  }}
                />
              </Form.Item>
            </Col> */}
            {/* <Col span={5}>
              <Form.Item style={{ marginBottom: 15 }} label="账号">
                <Input
                  disabled
                  placeholder="客服账号"
                  value={addParams.customerServiceAccount}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      customerServiceAccount: e.target.value
                    });
                  }}
                />
              </Form.Item>
            </Col> */}
            {/* <Col span={6}>
              <Form.Item style={{ marginBottom: 15 }} label="客服账号">
                {/* <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) => {
                    return option.props.children.indexOf(input) >= 0;
                  }}
                  value={addParams.phoneNo}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      phoneNo: e
                    });
                  }}
                >
                  {employeesList.map((el) => {
                    return (
                      <Select.Option
                        value={el.employeeMobile}
                        key={el.employeeId}
                      >
                        {el.employeeMobile}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col> */}
            {/* <Input
                  placeholder="请输入手机号"
                  onChange={(e) =>
                    setAddParams({ ...addParams, phoneNo: e.target.value })
                  }
                /> */}
            {showAddButton && (
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" icon="plus" onClick={addService}>
                  添加
                </Button>
              </Col>
            )}
          </Row>
        )}
      </Form>
    </Modal>
  );
}
const ImModalTemplate = Form.create<any>()(ImModal);
export default ImModalTemplate;
