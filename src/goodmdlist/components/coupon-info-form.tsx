import React, { Component } from 'react';

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Tree,
  TreeSelect,
  Upload,
  Modal,
  Icon
} from 'antd';
import GoodsList from './goods-list';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { Store } from 'plume2';
import { Const, noop, QMMethod, ValidConst, history, QMUpload } from 'qmkit';
import moment from 'moment';
import SelectedGoodsGrid from './selected-goods-grid';
import { fromJS } from 'immutable';
import { GoodsModal } from 'biz';
import GoodsModals from './select-goods-modal/goods-modal';
const ErrorDiv = styled.div`
  margin-top: -15px;
  margin-bottom: -25px;
  .ant-form-explain {
    margin-top: 0;
  }
  .ant-col-xl-8 {
    min-width: 330px;
  }
`;

const RightContent = styled.div`
  width: calc(100% - 320px);
`;
const GreyText = styled.span`
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
`;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xl: { span: 5 }
  },
  wrapperCol: {
    xl: { span: 18 }
  }
};
const formItemSmall = {
  labelCol: {
    xl: { span: 5 }
  },
  wrapperCol: {
    xl: { span: 8 }
  }
};

const Option = Select.Option;

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class CouponInfoForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      // 优惠券Id
      couponId: string;
      // 优惠券名称
      couponName: string;
      // 优惠券分类
      couponCates: IList;
      // 优惠券分类选中Id
      couponCateIds: IList;
      // 起止时间类型 0：按起止时间，1：按N天有效
      rangeDayType: Number;
      // 优惠券开始时间
      startTime: string;
      // 优惠券结束时间
      endTime: string;
      // 有效天数
      effectiveDays: Number;
      // 优惠券面值
      denomination: Number;
      // 购满类型 0：无门槛，1：满N元可使用
      fullBuyType: Number;
      // 购满多少钱
      fullBuyPrice: Number;
      // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
      scopeType: Number;
      // 商品品牌
      brands: IList;
      // 商品分类
      cates: IList;
      // 选中的品牌
      chooseBrandIds: IList;
      // 选中的分类
      chooseCateIds: IList;
      // 选中的商品
      chooseSkuIds: IList;
      // 优惠券
      couponDesc: string;
      goodsModalVisible: boolean;
      goodsRows: IList;
      // 按钮禁用
      btnDisabled: boolean;
      // 聚合分类Ids
      reducedCateIds: IList;

      // 键值设置方法
      fieldsValue: Function;
      // 修改时间区间方法
      changeDateRange: Function;
      // 修改营销类型方法
      chooseScopeType: Function;
      // 新增优惠券
      addCoupon: Function;
      // 修改优惠券
      editCoupon: Function;
      onCancelBackFun: Function;
      onOkBackFun: Function;
      dealErrorCode: Function;
      changeBtnDisabled: Function;
      prompt: string;
    };
  };

  static relaxProps = {
    couponId: 'couponId',
    couponName: 'couponName',
    couponCates: 'couponCates',
    couponCateIds: 'couponCateIds',
    rangeDayType: 'rangeDayType',
    startTime: 'startTime',
    endTime: 'endTime',
    effectiveDays: 'effectiveDays',
    denomination: 'denomination',
    fullBuyType: 'fullBuyType',
    fullBuyPrice: 'fullBuyPrice',
    scopeType: 'scopeType',
    brands: 'brands',
    cates: 'cates',
    chooseBrandIds: 'chooseBrandIds',
    chooseCateIds: 'chooseCateIds',
    couponDesc: 'couponDesc',
    chooseSkuIds: 'chooseSkuIds',
    goodsModalVisible: 'goodsModalVisible',
    goodsRows: 'goodsRows',
    btnDisabled: 'btnDisabled',
    reducedCateIds: 'reducedCateIds',
    prompt: 'prompt',

    fieldsValue: noop,
    changeDateRange: noop,
    chooseScopeType: noop,
    addCoupon: noop,
    editCoupon: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop,
    changeBtnDisabled: noop,
    dealErrorCode: noop
  };
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
      {
        uid: '-5',
        name: 'image.png',
        status: 'error'
      }
    ]
  };
  _store: Store;
  constructor(props, ctx) {
    super(props);
    console.log('--------------------99999999999999', this);
    this._store = ctx['_plume$Store'];
    // let storeLogo = this._store.state().getIn(['settings', 'storeLogo']); //店铺logo
    // let storeSign = this._store.state().getIn(['settings', 'storeSign']); //店铺店招

    // this.state = {
    //   //用于storeLogo图片展示
    //   storeLogoImage:
    //     storeLogo && storeLogo
    //       ? [
    //           {
    //             uid: 'store-logo-1',
    //             name: storeLogo,
    //             size: 1,
    //             status: 'done',
    //             url: storeLogo
    //           }
    //         ]
    //       : [],
    //   //用于storeLogo图片校验
    //   storeLogo: storeLogo,
    //   //用于storeSign图片展示
    //   storeSignImage:
    //     storeSign && storeSign
    //       ? [
    //           {
    //             uid: 'store-sign-1',
    //             name: storeSign,
    //             size: 1,
    //             status: 'done',
    //             url: storeSign
    //           }
    //         ]
    //       : [],
    //   //用于storeSign图片校验
    //   storeSign: storeSign
    // };
    this.state = {
      //用于图片展示
      goodsModal: {
        _modalVisible: true
      }, //模态框开关
      startTime: '', // 开始时间
      endTime: '', //结束时间
      goodsInfoList: []
    };
  }
  render() {
    const { goodsModal } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      couponName,
      couponCates,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      scopeType,
      couponDesc,
      fieldsValue,
      changeDateRange,
      chooseScopeType,
      onCancelBackFun,
      goodsModalVisible,
      chooseSkuIds,
      goodsRows,
      btnDisabled,
      prompt
    } = this.props.relaxProps;
    return (
      <RightContent>
        <Form>
          <FormItem {...formItemSmall} label="套装名称" required={true}>
            {getFieldDecorator('couponName', {
              initialValue: couponName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '套装名称',
                      1,
                      10
                    );
                  }
                }
              ]
            })(
              <Input
                placeholder="套装名称不超过10个字"
                maxLength={'10' as any}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemSmall} label="下单数量" required={true}>
            {getFieldDecorator('couponName', {
              initialValue: couponName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '下单数量',
                      1,
                      10
                    );
                  }
                }
              ]
            })(
              <Input
                placeholder="下单数量必须是整数"
                maxLength={'10' as any}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="起止时间" required={true}>
            <RadioGroup
              value={rangeDayType}
              onChange={(e) => {
                this.changeRangeDayType((e as any).target.value);
              }}
            >
              <FormItem>
                <Radio value={0} style={styles.radioStyle}>
                  {getFieldDecorator('rangeDay', {
                    initialValue: startTime &&
                      endTime && [moment(startTime), moment(endTime)],
                    rules: [
                      {
                        required: rangeDayType === 0,
                        message: '请输入起止时间'
                      }
                    ]
                  })(
                    <RangePicker
                      disabledDate={this.disabledDate}
                      disabled={rangeDayType === 1}
                      getCalendarContainer={() =>
                        document.getElementById('page-content')
                      }
                      format="YYYY-MM-DD"
                      placeholder={['起始时间', '结束时间']}
                      onChange={(e) => {
                        if (e.length > 0) {
                          changeDateRange({
                            startTime: e[0].format(Const.DAY_FORMAT),
                            endTime: e[1].format(Const.DAY_FORMAT)
                          });
                        }
                      }}
                    />
                  )}
                </Radio>
              </FormItem>
            </RadioGroup>
          </FormItem>
          {/* <ErrorDiv> */}
          <FormItem {...formItemSmall} label="  优惠标签">
            {
              <Input
                placeholder=" 优惠标签不超过10个字"
                maxLength={'10' as any}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
              />
            }
          </FormItem>
          <FormItem {...formItemSmall} label=" 优惠文案">
            {
              <Input
                placeholder="优惠文案不超过10个字"
                maxLength={'10' as any}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
              />
            }
          </FormItem>
          {/* </ErrorDiv> */}
          <FormItem {...formItemLayout} label="提示文案">
            <div className="clearfix logoImg">
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {1 >= 8 ? null : 1}
              </Upload>
              <GreyText>建议尺寸800*640px，大小不超过1M</GreyText>
              {/* <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal> */}
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="添加商品">
            <div>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.openGoodsModal();
                }}
              >
                添加商品
              </Button>
              <GreyText>每场直播最多可添加200款商品</GreyText>
              &nbsp; &nbsp;
            </div>
          </FormItem>
          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={18}>
              <GoodsList
              // goodsRows={state.get('goodsRows').toJS()}
              // deleteSelectedSku={(skuId) => store.deleteSelectedSku(skuId)}
              // goodsInfoList={this.state.goodsInfoList}
              />
            </Col>
          </Row>
          <GoodsModals
            visible={goodsModal._modalVisible}
            onCancelBackFun={this.closeGoodsModal}
            showValidGood={true}
            // selectedSkuIds={state.get('chooseSkuIds').toJS()}
            // selectedRows={state.get('goodsRows').toJS()}
            onOkBackFun={this._onOkBackFun}
            skuLimit={200}
          />
          <FormItem
            {...this._scopeBoxStyle(scopeType)}
            label="已选商品"
            id={'page-content'}
          >
            {this.chooseGoods().dom}
          </FormItem>
          <FormItem {...formItemLayout} label="使用说明">
            {getFieldDecorator('couponDesc', {
              initialValue: couponDesc,
              rules: [{ max: 500, message: '使用说明最多500个字符' }]
            })(
              <TextArea
                maxLength={'500' as any}
                placeholder={'0-500字'}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponDesc',
                    value: e.target.value
                  });
                }}
              />
            )}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button
            disabled={btnDisabled}
            type="primary"
            onClick={() => this.saveCoupon()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            取消
          </Button>
        </div>
        <GoodsModal
          limitNOSpecialPriceGoods={true}
          showValidGood={true}
          visible={goodsModalVisible}
          selectedSkuIds={chooseSkuIds.toJS()}
          selectedRows={goodsRows.toJS()}
          onOkBackFun={this._onOkBackFun}
          onCancelBackFun={onCancelBackFun}
        />
      </RightContent>
    );
  }

  /**
   * 优惠券分类选择
   */
  chooseCouponCateIds = (value) => {
    this.props.relaxProps.fieldsValue({ field: 'couponCateIds', value });
  };

  /**
   * 禁用昨天及昨天之前的日期
   */
  disabledDate = (current) => {
    return current && current.endOf('day') < moment().endOf('day');
  };

  /**
   * 品牌选择结构
   */
  _getBrandSelect = () => {
    const { brands, fieldsValue } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择品牌"
        notFoundContent="暂无品牌"
        mode="multiple"
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string'
            ? option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : true;
        }}
        onChange={(value) => {
          fieldsValue({ field: 'chooseBrandIds', value });
        }}
      >
        {brands.map((item) => {
          return (
            <Option key={item.get('brandId')} value={`${item.get('brandId')}`}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) =>
    cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter(
          (cate) => cate.get('cateParentId') == item.get('storeCateId')
        );
        if (childCates && childCates.count()) {
          return (
            <Tree.TreeNode
              key={item.get('storeCateId').toString()}
              value={item.get('storeCateId').toString()}
              title={item.get('cateName').toString()}
            >
              {this.loop(oldCateList, childCates, item.get('storeCateId'))}
            </Tree.TreeNode>
          );
        }
        return (
          <Tree.TreeNode
            key={item.get('storeCateId').toString()}
            value={item.get('storeCateId').toString()}
            title={item.get('cateName').toString()}
          />
        );
      });

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { scopeType, chooseBrandIds, chooseCateIds, cates, chooseSkuIds } =
      this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (scopeType === 0) {
      return { dom: '全部商品' };
    } else if (scopeType === 1) {
      return {
        dom: getFieldDecorator('chooseBrandIds', {
          initialValue: chooseBrandIds.toJS(),
          rules: [{ required: true, message: '请选择品牌' }]
        })(this._getBrandSelect())
      };
    } else if (scopeType === 3) {
      return {
        dom: getFieldDecorator('chooseCateIds', {
          initialValue: chooseCateIds.toJS(),
          rules: [{ required: true, message: '请选择店铺分类' }]
        })(
          <TreeSelect
            treeCheckable={true}
            getPopupContainer={() => document.getElementById('page-content')}
            placeholder="请选择店铺分类"
            notFoundContent="暂无店铺分类"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={(TreeSelect as any).SHOW_PARENT}
            onChange={(value) => {
              this.chooseCate(value);
            }}
          >
            {this.loop(fromJS(cates), fromJS(cates), 0)}
          </TreeSelect>
        )
      };
    } else if (scopeType == 4) {
      return {
        dom: getFieldDecorator('chooseSkuIds', {
          initialValue: chooseSkuIds.toJS(),
          rules: [{ required: true, message: '请选择商品' }]
        })(<SelectedGoodsGrid />)
      };
    }
  };

  /**
   * 保存优惠券
   */
  saveCoupon = () => {
    const {
      addCoupon,
      editCoupon,
      couponId,
      changeBtnDisabled,
      startTime,
      rangeDayType,
      dealErrorCode
    } = this.props.relaxProps;
    changeBtnDisabled();
    if (!couponId) {
      //强制校验创建时间
      if (
        rangeDayType == 0 &&
        moment(new Date()).hour(0).minute(0).second(0).unix() >
          moment(startTime).unix()
      ) {
        this.props.form.setFields({
          rangeDay: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        changeBtnDisabled();
        return;
      }
    }
    this.props.form.validateFields(null, async (errs) => {
      //如果校验通过
      if (!errs) {
        const res = await (couponId ? editCoupon() : addCoupon());
        //成功时候没有返回
        if (!res) {
          return;
        }
        if (res.code === 'K-080103') {
          const ids = await dealErrorCode(res);
          this.props.form.setFieldsValue({
            couponCateIds: ids.toJS()
          });
        } else {
          message.error(res.message);
        }
      } else {
        changeBtnDisabled();
      }
    });
  };

  /**
   * 修改区间天数类型
   */
  changeRangeDayType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    if (value === 0 || value === 1) {
      resetFields(['effectiveDays', 'rangeDay']);
    }
    if (value == 0) {
      setFieldsValue({ effectiveDays: '' });
    } else if (value == 1) {
      setFieldsValue({ rangeDay: [0, 0] });
    }
    fieldsValue({ field: 'rangeDayType', value });
  };

  /**
   * 修改使用门槛类型
   */
  changeFullBuyType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    resetFields('fullBuyPrice');
    if (value == 0) {
      setFieldsValue({ fullBuyPrice: null });
    }
    fieldsValue({
      field: 'fullBuyType',
      value
    });
  };
  openGoodsModal = () => {
    this.setState({
      goodsModal: {
        _modalVisible: true
      }
    });
  };
  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }

  /**
   * 改变已选商品的样式
   */
  _scopeBoxStyle = (scopeType) => {
    return scopeType === 4 ? { ...formItemLayout } : { ...formItemSmall };
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    // this.props.form.validateFields((_errs) => {});
    this.props.relaxProps.onOkBackFun(skuIds, rows);
  };

  /**
   * 选择店铺分类
   */
  chooseCate = (value) => {
    const { fieldsValue, reducedCateIds } = this.props.relaxProps;
    let ids = fromJS([]);
    fromJS(value).forEach((v) => {
      const cate = reducedCateIds.find((c) => c.get('cateId') == v);
      if (cate) {
        ids = ids.concat(cate.get('cateIds'));
      } else {
        ids = ids.push(v);
      }
    });
    fieldsValue({ field: 'chooseCateIds', value: ids });
  };
  _editStoreLogo = ({ file, fileList }) => {
    this.setState({ storeLogoImage: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ storeLogo: '' });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ storeLogo: fileList[0].url });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
    }
  };

  /**
   * 编辑店铺店招
   * @param file
   * @param fileList
   * @private
   */
  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  greyColor: {
    fontSize: 12,
    color: '#999',
    wordBreak: 'keep-all'
  },
  darkColor: {
    fontSize: 12,
    color: '#333'
  },
  radioStyle: {
    display: 'block'
  },
  lastRadioStyle: {
    display: 'block',
    marginTop: 10
  }
} as any;
