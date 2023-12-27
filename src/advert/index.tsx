import React, { useRef, useState, useEffect } from 'react';
import {
  message,
  Form,
  Upload,
  DatePicker,
  Radio,
  Select,
  Icon,
  Modal,
  Button,
  Spin,
  Row,
  Col
} from 'antd';
import {
  Headline,
  BreadCrumb,
  Const,
  util,
  cache,
  FindArea,
  history
} from 'qmkit';
import './index.less';
import {
  queryAvailableTime,
  saveAd,
  getMallData,
  getMarkets,
  queryCustomerWallet,
  fetchAd,
  adActivityPay
} from './webapi';
import NP from 'number-precision';
import moment from 'moment';
import * as _ from 'lodash';

const FILE_MAX_SIZE = 20 * 1024 * 1024;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 3,
    xl: { span: 3 },
    xs: { span: 12 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 21,
    xl: { span: 21 },
    xs: { span: 12 },
    sm: { span: 18 }
  }
};
const noLabelForm = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  }
};
const Advert = (porps) => {
  const { form, location } = porps;
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    getFieldsValue,
    validateFields
  } = form;
  const logInfo = sessionStorage.getItem(cache.LOGIN_DATA)
    ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
    : {};
  // 广告位列表
  const [spaceList, setSpaceList] = useState([]);
  // 广告素材
  const [materiaFile, setMateria] = useState([]);
  const [previewVisible, setVisible] = useState(false);
  const [previewImage, setImg] = useState('');
  // 鲸币余额
  const [balance, setBalance] = useState('' as string | number);
  // 广告单价
  const [priceList, setPriceList] = useState([]);
  // 广告总价
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState('提交中...');
  // 批发市场及省份数据
  const [provinceList, setProvinceList] = useState(
    FindArea.findProvinceArea([])
  );
  const [data, setData] = useState({} as any);
  // 商城数据
  const [mallList, setMallList] = useState([{ id: 0, tabName: '推荐' }]);
  // 获取商城列表
  const getMallList = async () => {
    const { res } = await getMallData({ pageNum: 0, pageSize: 9999 });
    if (res && res.code === Const.SUCCESS_CODE) {
      setMallList(mallList.concat(res.context?.content || []));
    } else {
      message.error(res.message || '');
    }
  };
  // 获取鲸币余额
  const getBalance = async () => {
    const params = {
      storeFlag: true,
      storeId: logInfo.storeId
    };
    const { res } = await queryCustomerWallet(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      setBalance(res.context?.balance || '');
    } else {
      message.error(res.message || '');
    }
  };
  // 编辑时初始化
  const init = async () => {
    if (location && location.state && location.state.id) {
      const { res } = await fetchAd(location.state.id);
      if (res && res.code === Const.SUCCESS_CODE) {
        const newData = res.context || {};
        setData(newData);
        const newPriceList = [];
        newData.detailList.forEach((item) => {
          const opt = { ...item };
          const times = [];
          for (let i = 0; i < item.days; i++) {
            times.push(moment(item.startTime).add(i, 'd'));
          }
          opt.times = times;
          newPriceList.push(opt);
        });
        setPriceList(newPriceList);
        setTotalPrice(newData.totalPrice);
        if (newData.provinceId) {
          areaChange(newData.provinceId, true);
        }
        if (newData.materialUrl) {
          setMateria([
            {
              name: res.context.materialKey,
              url: res.context.materialUrl,
              uid: res.context.materialUrl,
              status: 'done',
              response: {
                code: Const.SUCCESS_CODE,
                context: res.context.materialUrl
              }
            }
          ]);
        }
        if (location.state.isEdit === 1) {
          setTimeout(() => {
            getSpaceList();
          }, 100);
        }
      } else {
        message.error(res.message || '');
      }
    }
  };
  useEffect(() => {
    getMallList();
    getBalance();
    init();
  }, []);

  // 省份change
  const areaChange = async (val, initFlag = false) => {
    if (!initFlag) {
      setFieldsValue({ marketId: '' });
      setPriceList([]);
    }
    let flag = true;
    provinceList.forEach((item) => {
      if (item.value === val && item.markets) {
        flag = false;
        return;
      }
    });
    if (!flag) {
      return;
    }
    const { res } = await getMarkets({
      provinceId: val,
      pageNum: 0,
      pageSize: 999
    });
    if (res && res.code === Const.SUCCESS_CODE) {
      const newList = provinceList.map((item) => {
        const opt = { ...item };
        if (item.value === (initFlag ? val.toString() : val)) {
          opt.markets = res.context?.content || [];
        }
        return opt;
      });
      setProvinceList(newList);
      if (initFlag) {
        setFieldsValue({ provinceId: val.toString() });
      }
    } else {
      message.error(res.message || '');
    }
  };

  // 广告类型变化 清空位置、时间等数据
  const clearInfo = () => {
    setPriceList([]);
    setFieldsValue({ slotGroupSeq: '', time: '' });
  };
  const spaceListQuestId = useRef(null);
  // 根据不同条件 获取广告位列表数据
  const getSpaceList = async () => {
    const values = getFieldsValue();
    let params = {
      slotGroupSeq: values.slotGroupSeq,
      slotType: values.slotType
    } as any;
    if (!(values.slotType || values.slotType === 0)) {
      return;
    }
    if (values.slotType !== 2 && !values.slotGroupSeq) {
      return;
    }
    if (values.slotType === 2) {
      if (
        !(
          values.provinceId &&
          values.marketId &&
          (values.mallTabId || values.mallTabId === 0) &&
          values.slotGroupSeq
        )
      ) {
        return;
      } else {
        params.marketId = values.marketId;
        params.mallTabId = values.mallTabId;
      }
    }
    const timeId = new Date().getTime();
    spaceListQuestId.current = timeId;
    const { res } = await queryAvailableTime(params);
    //spaceListQuestId timeId 保证只处理最后一次返回的数据
    if (spaceListQuestId.current !== timeId) {
      return;
    }
    if (res && res.code === Const.SUCCESS_CODE) {
      setSpaceList(res.context || []);
      if (res.context && res.context.length === 0) {
        message.warning('此条件下无广告位');
      }
    } else {
      message.error(res.message || '');
    }
  };
  // 广告位置选项render方法
  const renderSeq = (slotType) => {
    let start = 1;
    let end;
    switch (slotType) {
      case 0:
        end = 1;
        break;
      case 1:
        end = 4;
        break;
      case 2:
        start = 4;
        end = 12;
        break;
      default:
        break;
    }
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(
        <Option key={i} value={i}>
          位置{i}
        </Option>
      );
    }
    return result;
  };
  const uploadProps = {
    name: 'file',
    multiple: false,
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    action: Const.HOST + '/advertising/uploadFile',
    accept: '.jpg,.jpeg,.png',
    beforeUpload(file) {
      let fileName = file.name.toLowerCase();

      if (!fileName.trim()) {
        message.error('请输入文件名');
        return false;
      }

      //支持的文件格式,最大限制
      if (
        !(
          fileName.endsWith('.jpg') ||
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png')
        )
      ) {
        message.error('文件格式错误,只能是.jpg,.jpeg,.png格式文件');
        return false;
      }
      if (file.size > FILE_MAX_SIZE) {
        message.error('文件大小不能超过20M');
        return false;
      }
      return new Promise<void>((resolve, reject) => {
        let _URL = window.URL || window.webkitURL;
        let width = getFieldValue('slotType') === 1 ? 710 : 654;
        let height = getFieldValue('slotType') === 1 ? 246 : 828;
        let img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = () => {
          if (img.width !== width || img.height !== height) {
            message.error(`上传尺寸必须是${width}px * ${height}px!`);
            reject();
          } else {
            resolve();
          }
        };
      });
    }
  };
  // 上传文件change
  const fileChange = (info) => {
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
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
    }
    setMateria([...fileList]);
  };
  // 鲸币支付
  const payByJingbi = async (id) => {
    const params = {
      id,
      payType: 1
    };
    setLoading(true);
    setLoadingTip('鲸币支付中');
    const { res } = await adActivityPay(params);
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('鲸币支付成功', () => {
        history.push('/advert-list');
      });
    } else {
      message.error(res.message || '', () => {
        history.push('/advert-list');
      });
    }
  };
  // 提交
  const submit = async () => {
    validateFields(async (errs, values) => {
      if (errs) {
        return;
      }
      if (values.slotType !== 2 && materiaFile.length < 1) {
        message.error('请上传广告素材');
        return;
      }
      const detailList = [];
      priceList.forEach((item) => {
        if (item.times && item.times.length > 0) {
          detailList.push({
            slotId: item.slotId,
            days: item.times.length,
            startTime: moment(item.times[0])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(item.times[item.times.length - 1])
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss'),
            unit: '0',
            unitPrice: item.unitPrice
          });
        }
      });
      const parmas = {
        ...values,
        activityType: '0',
        totalPrice,
        detailList,
        realPrice: totalPrice,
        storeId: logInfo.storeId,
        storeName: logInfo.storeName
      } as any;
      if (location?.state?.isEdit === 1) {
        parmas.id = data.id;
      }
      if (values.slotType !== 2) {
        parmas.materialUrl = materiaFile[0].response.context;
        parmas.materialKey = materiaFile[0].response.name;
      } else {
        parmas.mallTabName = mallList.filter(
          (item) => item.id === values.mallTabId
        )[0].tabName;
        provinceList.forEach((item) => {
          if (item.value === values.provinceId) {
            item.markets.forEach((cd) => {
              if (cd.marketId === values.marketId) {
                parmas.marketName = cd.marketName;
                return;
              }
            });
            return;
          }
        });
      }
      if (values.time && values.time.length === 2) {
        parmas.startTime = moment(values.time[0])
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        parmas.endTime = moment(values.time[1])
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        parmas.days = values.time[1].diff(values.time[0], 'days') + 1;
        delete parmas.time;
      }
      setLoading(true);
      setLoadingTip('提交中');
      const { res } = await saveAd(parmas);
      setLoading(false);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('提交成功', () => {
          if (values.payType === 0) {
            history.push({
              pathname: '/advert-pay',
              state: { id: res.context }
            });
          }
        });
        if (values.payType === 1) {
          payByJingbi(res.context);
        }
      } else {
        message.error(res.message || '');
      }
    });
  };
  return (
    <Spin spinning={loading} tip={loadingTip}>
      <BreadCrumb />

      <div className="container">
        <Headline title="新增广告" />
        <Form {...formItemLayout}>
          <FormItem label="广告类型">
            {getFieldDecorator('slotType', {
              rules: [{ required: true, message: '请选择广告类型' }],
              initialValue:
                data.slotType || data.slotType === 0 ? data.slotType : ''
            })(
              <Radio.Group
                onChange={clearInfo}
                disabled={location?.state?.isEdit === 0}
              >
                <Radio value={1}>banner广告</Radio>
                <Radio value={2}>商城广告</Radio>
                <Radio value={0}>开屏广告</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {getFieldValue('slotType') === 2 && (
            <React.Fragment>
              <FormItem label="选择批发市场" required>
                <Row gutter={16} className="advert-markets">
                  <Col span={12} style={{ width: 176 }}>
                    <FormItem {...noLabelForm}>
                      {getFieldDecorator('provinceId', {
                        initialValue: '',
                        rules: [{ required: true, message: '请选择省份' }]
                      })(
                        <Select
                          showSearch
                          onChange={(val) => areaChange(val)}
                          filterOption={(input, option: any) =>
                            option.props.children.indexOf(input) >= 0
                          }
                          disabled={location?.state?.isEdit === 0}
                        >
                          {provinceList.map((item) => (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ width: 176 }}>
                    <FormItem {...noLabelForm}>
                      {getFieldDecorator('marketId', {
                        initialValue: data.marketId || '',
                        rules: [{ required: true, message: '请选择批发市场' }]
                      })(
                        <Select
                          showSearch
                          onChange={() => setTimeout(() => getSpaceList(), 10)}
                          filterOption={(input, option: any) =>
                            option.props.children.indexOf(input) >= 0
                          }
                          disabled={location?.state?.isEdit === 0}
                        >
                          {(
                            (
                              provinceList.filter(
                                (item) =>
                                  item.value === getFieldValue('provinceId')
                              )[0] || {}
                            ).markets || []
                          ).map((item) => (
                            <Option key={item.marketId} value={item.marketId}>
                              {item.marketName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="选择商城">
                {getFieldDecorator('mallTabId', {
                  initialValue:
                    data.mallTabId || data.mallTabId === 0
                      ? data.mallTabId
                      : '',
                  rules: [{ required: true, message: '请选择商城' }]
                })(
                  <Select
                    showSearch
                    style={{ width: 160 }}
                    onChange={() => setTimeout(() => getSpaceList(), 10)}
                    filterOption={(input, option: any) =>
                      option.props.children.indexOf(input) >= 0
                    }
                    disabled={location?.state?.isEdit === 0}
                  >
                    {mallList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.tabName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </React.Fragment>
          )}
          <FormItem label="广告位置">
            {getFieldDecorator('slotGroupSeq', {
              rules: [{ required: true, message: '请选择广告位置' }],
              initialValue: data.slotGroupSeq || ''
            })(
              <Select
                style={{ width: 160 }}
                onChange={() => setTimeout(() => getSpaceList(), 10)}
                disabled={location?.state?.isEdit === 0}
              >
                {renderSeq(getFieldValue('slotType'))}
              </Select>
            )}
          </FormItem>
          {getFieldValue('slotType') !== 2 && (
            <React.Fragment>
              <FormItem label="链接至">
                {getFieldDecorator('clickJumpType', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: data.clickJumpType || 1
                })(
                  <Radio.Group disabled={location?.state?.isEdit === 0}>
                    {/* <Radio value={0}>无动作</Radio> */}
                    <Radio value={1}>商城首页</Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem label="广告素材" required>
                <Upload
                  {...uploadProps}
                  listType="picture-card"
                  disabled={location?.state?.isEdit === 0}
                  onChange={(info) => fileChange(info)}
                  onRemove={() => setMateria([])}
                  onPreview={async (file) => {
                    console.warn(file);
                    let preview;
                    if (!file.url) {
                      preview = await util.getBase64(file.originFileObj);
                    }
                    setImg(file.url || preview);
                    setVisible(true);
                  }}
                  fileList={materiaFile}
                >
                  {materiaFile.length === 0 && (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">点击上传文件</div>
                    </div>
                  )}
                </Upload>
                <div>
                  图片格式仅限jpg、jpeg、png，尺寸
                  {getFieldValue('slotType') === 1
                    ? '710px*246px'
                    : '654px*828px'}
                </div>
              </FormItem>
            </React.Fragment>
          )}
          <FormItem label="选择展示时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择展示时间' },
                {
                  validator: (rule, value, callback) => {
                    if (value && value.length === 2) {
                      const startTime = moment(value[0]);
                      const endTime = moment(value[1]);
                      const diff = endTime.diff(startTime, 'days');
                      let total = 0;
                      const newList = spaceList.map((item) => {
                        return {
                          unitPrice: item.unitPrice || 0,
                          slotId: item.id,
                          times: []
                        };
                      });
                      for (let num = 0; num <= diff; num++) {
                        const checkTime = moment(startTime).add(num, 'd');
                        let flag = false;
                        for (let i = 0; i < spaceList.length; i++) {
                          const item = spaceList[i];
                          if (
                            checkTime >=
                              moment(item.applicableTime1).startOf('day') &&
                            checkTime <=
                              moment(item.applicableTime2).endOf('day')
                          ) {
                            flag = true;
                            total = NP.plus(total, item.unitPrice || 0);
                            newList[i].times.push(checkTime);
                            break;
                          }
                        }
                        if (!flag) {
                          callback('存在不可新增时间，请重新选择');
                          return;
                        }
                      }
                      setPriceList(newList);
                      setTotalPrice(total);
                      callback();
                    }
                    callback();
                  }
                }
              ],
              initialValue: ''
              // data.startTime && data.endTime
              // ? [moment(data.startTime), moment(data.endTime)]
              // : ''
            })(
              <RangePicker
                dropdownClassName="advert-datePicker"
                onChange={(dates) => {
                  if (dates && dates.length === 0) {
                    setPriceList([]);
                    setTotalPrice(0);
                    setFieldsValue({ payType: '' });
                  }
                }}
                disabled={location?.state?.isEdit === 0}
                disabledDate={(current) => {
                  if (current && current < moment().endOf('day')) {
                    return true;
                  }
                  let flag = true;
                  spaceList.forEach((item) => {
                    if (
                      current &&
                      current > moment(item.applicableTime1).startOf('day') &&
                      current < moment(item.applicableTime2).endOf('day')
                    ) {
                      flag = false;
                    }
                  });
                  return flag;
                }}
                dateRender={(current) => {
                  let price = 0;
                  spaceList.forEach((item) => {
                    if (
                      current &&
                      current > moment(item.applicableTime1).startOf('day') &&
                      current < moment(item.applicableTime2).endOf('day')
                    ) {
                      price = item.unitPrice;
                    }
                  });
                  return (
                    <div
                      className="ant-calendar-date"
                      style={{ height: 'auto', width: 56 }}
                    >
                      {current.date()}
                      <div className="advert-price">¥{price}</div>
                    </div>
                  );
                }}
              />
            )}
          </FormItem>
          <FormItem label="广告单价">
            {priceList.map((item, index) =>
              item.times.length > 0 ? (
                <div key={index}>
                  位置{getFieldValue('slotGroupSeq')}-
                  {item.times.length > 1
                    ? `${moment(item.times[0]).format(
                        'YYYY年MM月DD日'
                      )}至${moment(item.times[item.times.length - 1]).format(
                        'YYYY年MM月DD日'
                      )}`
                    : moment(item.times[0]).format('YYYY年MM月DD日')}
                  -{item.unitPrice}元/天;
                </div>
              ) : (
                ''
              )
            )}
          </FormItem>
          <FormItem label="广告总价">{totalPrice}元</FormItem>
          <FormItem label="支付方式">
            {getFieldDecorator('payType', {
              rules: [{ required: true, message: '请选择支付方式' }],
              initialValue: 1
              // data.payType || data.payType === 0 ? data.payType : '1'
            })(
              <Radio.Group disabled={location?.state?.isEdit === 0}>
                {/* <Radio value={0} disabled={!totalPrice}>
                  线上支付
                </Radio> */}
                <Radio
                  value={1}
                  disabled={!(balance && totalPrice && +balance >= totalPrice)}
                >
                  鲸币支付
                </Radio>
              </Radio.Group>
            )}
            <span>鲸币余额：{balance}</span>
          </FormItem>
        </Form>
        <div>
          {!(location?.state?.isEdit === 0) && (
            <Button type="primary" onClick={submit}>
              提交并去支付
            </Button>
          )}
        </div>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => {
            setVisible(false);
            setImg('');
          }}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    </Spin>
  );
};

const AdvertForm = Form.create()(Advert);
export default AdvertForm;
