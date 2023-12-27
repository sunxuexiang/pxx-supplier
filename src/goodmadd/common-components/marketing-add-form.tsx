import * as React from 'react';
import { fromJS, List } from 'immutable';

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Icon
} from 'antd';
import {
  Const,
  history,
  QMMethod,
  util,
  QMUpload,
  Tips,
  ValidConst
} from 'qmkit';
import moment from 'moment';
// import GiftLevels from '../full-gift/components/gift-levels';
// import DiscountLevels from '../full-discount/components/discount-levels';
// import ReductionLevels from '../full-reduction/components/reduction-levels';
import GoodsModal from '../full-discount/components/modoul/goods-modal';
import SelectedGoodsGrid from './selected-goods-grid';

import * as webapi from '../webapi';
import * as Enum from './marketing-enum';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

export default class MarketingAddForm extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    const relaxProps = props.store.state();
    // console.log(relaxProps.toJS(),'relaxPropsrelaxPropsrelaxProps',relaxProps.get('marketingBean').toJS)
    console.log(
      relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList,
      '7894343'
    );
    let storeLogo = relaxProps.getIn(['marketingBean', 'suitMarketingBanner']); //套装logo
    let suitTopImage = relaxProps.getIn(['marketingBean', 'suitTopImage']); //套装logo

    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //营销活动已选的商品信息
      selectedSkuIds: [],
      selectedRows: fromJS(
        relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList
          ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList
          : []
      ),
      //全部等级
      customerLevel: [],
      //选择的等级
      selectedLevelIds: [],
      //营销实体
      marketingBean: relaxProps.get('marketingBean'),
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //满金额还是满数量还是订单满赠 （4：满金额，5：满数量，6：满订单，7:满订单减，8:满订单折）
      isFullCount: null,
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      saveLoading: false,
      storeLogoImage:
        storeLogo && storeLogo
          ? [
              {
                uid: 'store-logo-1',
                name: storeLogo,
                size: 1,
                status: 'done',
                url: storeLogo
              }
            ]
          : [],
      //用于storeLogo图片校验
      storeLogo: storeLogo,
      suitTopImageImage:
        suitTopImage && suitTopImage
          ? [
              {
                uid: 'store-logo-1',
                name: suitTopImage,
                size: 1,
                status: 'done',
                url: suitTopImage
              }
            ]
          : [],
      //用于storeLogo图片校验
      suitTopImage: suitTopImage
    };
  }

  componentDidMount() {
    // this.init();
  }

  render() {
    const { marketingType, form, marketingId } = this.props;

    const { getFieldDecorator } = form;
    const {
      customerLevel,
      selectedRows,
      marketingBean,
      level,
      isFullCount,
      skuExists,
      saveLoading
    } = this.state;
    console.log(selectedRows.toJS(), '123123123');
    const IiemList = marketingBean.toJS();
    console.log(IiemList, '00000');
    const isShowOverlap =
      (Enum.GET_MARKETING_STRING(marketingType) == '减' && isFullCount != 2) ||
      (Enum.GET_MARKETING_STRING(marketingType) == '赠' && isFullCount != 2);
    return (
      <Form
        onSubmit={(e) => this.handleSubmit(e, isShowOverlap)}
        style={{ marginTop: 20 }}
      >
        <FormItem {...smallformItemLayout} label="套装名称">
          {getFieldDecorator('marketingName', {
            rules: [
              { required: true, whitespace: true, message: '请填写套装名称' },
              { min: 1, max: 40, message: '1-14字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '套装名称');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(
            <Input
              placeholder="请填写套装，不超过14个字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...smallformItemLayout} label="下单数量">
          {getFieldDecorator('suitBuyNum', {
            rules: [
              {
                required: true,
                pattern: ValidConst.number,
                message: '请填写下单数量',
                min: 1,
                max: 40
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '下单数量');
                }
              }
            ],
            onChange: (e) => this.onBeanChange({ suitBuyNum: e.target.value }),
            initialValue: marketingBean.get('suitBuyNum')
          })(
            <Input
              placeholder="请填写数字，必须是整数"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...smallformItemLayout} label="限购数量">
          {getFieldDecorator('suitLimitNum', {
            rules: [
              {
                required: true,
                pattern: ValidConst.number,
                message: '请填写限购数量',
                min: 1,
                max: 40
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '限购数量');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ suitLimitNum: e.target.value }),
            initialValue: marketingBean.get('suitLimitNum')
          })(
            <Input
              placeholder="请填写数字，必须是整数"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date())
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix() > value[0].unix()
                  ) {
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                this.onBeanChange({
                  beginTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },
            initialValue: marketingBean.get('beginTime') &&
              marketingBean.get('endTime') && [
                moment(marketingBean.get('beginTime')),
                moment(marketingBean.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format={Const.DATE_FORMAT}
              placeholder={['起始时间', '结束时间']}
              showTime={{ format: 'HH:mm' }}
            />
          )}
        </FormItem>
        <FormItem {...smallformItemLayout} label="优惠标签">
          {getFieldDecorator('suitCouponLabel', {
            rules: [
              // { required: true, whitespace: true, message: '请填写优惠标签' },
              { min: 1, max: 10, message: '1-10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '优惠标签');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ suitCouponLabel: e.target.value }),
            initialValue: marketingBean.get('suitCouponLabel')
          })(
            <Input
              placeholder="请填写优惠标签，不超过10个字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...smallformItemLayout} label="优惠文案">
          {getFieldDecorator('suitCouponDesc', {
            rules: [
              // { required: true, whitespace: true, message: '请填写优惠文案' },
              { min: 1, max: 20, message: '1-20字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '优惠文案');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ suitCouponDesc: e.target.value }),
            initialValue: marketingBean.get('suitCouponDesc')
          })(
            <Input
              placeholder="请填写优惠标签，不超过20个字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>

        <FormItem required={false} {...formItemLayout} label="营销头图">
          <div className="clearfix logoImg">
            <QMUpload
              style={styles.box}
              action={Const.HOST + '/store/uploadStoreResource'}
              listType="picture-card"
              name="uploadFile"
              onChange={this._editStoreLogo}
              fileList={this.state.storeLogoImage}
              accept={'.jpg,.jpeg,.png,.gif'}
              beforeUpload={this._checkUploadFile.bind(this, 1)}
            >
              {this.state.storeLogoImage.length >= 1 ? null : (
                <div>
                  <Icon type="plus" style={styles.plus} />
                </div>
              )}
            </QMUpload>
            {getFieldDecorator('suitMarketingBanner', {
              initialValue: this.state.storeLogo
            })(<Input type="hidden" />)}
          </div>
          <Tips title="建议尺寸682px*365px，大小不超过1M" />
        </FormItem>
        <FormItem required={false} {...formItemLayout} label="顶部头图">
          <div className="clearfix logoImg">
            <QMUpload
              style={styles.box}
              action={Const.HOST + '/store/uploadStoreResource'}
              listType="picture-card"
              name="uploadFile"
              onChange={this._editStoreLogoas}
              fileList={this.state.suitTopImageImage}
              accept={'.jpg,.jpeg,.png,.gif'}
              beforeUpload={this._checkUploadFileas.bind(this, 1)}
            >
              {this.state.suitTopImageImage.length >= 1 ? null : (
                <div>
                  <Icon type="plus" style={styles.plus} />
                </div>
              )}
            </QMUpload>
            {getFieldDecorator('suitTopImage', {
              initialValue: this.state.suitTopImage
            })(<Input type="hidden" />)}
          </div>
          <Tips title="建议尺寸750px*750px，大小不超过1M" />
        </FormItem>
        {/* {isFullCount != null && (
          <FormItem {...formItemLayout} label="设置规则" required={true}>
            {marketingType == Enum.MARKETING_TYPE.FULL_GIFT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <GiftLevels
                  form={this.props.form}
                  selectedRows={this.makeSelectedRows(null)}
                  fullGiftLevelList={
                    marketingBean.get('fullGiftLevelList') &&
                    marketingBean.get('fullGiftLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <DiscountLevels
                  form={this.props.form}
                  fullDiscountLevelList={
                    marketingBean.get('fullDiscountLevelList') &&
                    marketingBean.get('fullDiscountLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <ReductionLevels
                  form={this.props.form}
                  fullReductionLevelList={
                    marketingBean.get('fullReductionLevelList') &&
                    marketingBean.get('fullReductionLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
          </FormItem>
        )} */}
        {isFullCount !== 2 && (
          <FormItem {...formItemLayout} label="活动" required={true}>
            {getFieldDecorator(
              'goods',
              {}
            )(
              <div>
                <div style={{ display: 'flex' }}>
                  <Button
                    type="primary"
                    icon="plus"
                    onClick={this.openGoodsModal}
                  >
                    添加活动
                  </Button>
                  &nbsp;&nbsp;
                  <div>每个套装至少1个活动</div>
                </div>
                &nbsp;&nbsp;
                <SelectedGoodsGrid
                  selectedRows={selectedRows}
                  skuExists={skuExists}
                  itmelist={IiemList}
                  deleteSelectedSku={this.deleteSelectedSku}
                  cheBOx={this.cheBOx}
                  purChange={this.purChange}
                />
              </div>
            )}
          </FormItem>
        )}

        <Row type="flex" justify="start">
          <Col span={3} />
          <Col span={10}>
            <Button type="primary" htmlType="submit" loading={saveLoading}>
              保存
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}>
              返回
            </Button>
          </Col>
        </Row>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          marketingId={marketingId}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </Form>
    );
  }

  _editStoreLogoas = ({ file, fileList }) => {
    this.setState({ suitTopImageImage: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ suitTopImage: '' });
      this.props.form.setFieldsValue({ suitTopImage: this.state.suitTopImage });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileListas(fileList);
    console.log(fileList[0].url, '000012312310');
    if (fileList && fileList.length > 0) {
      this.setState({ suitTopImage: fileList[0].url });
      this.props.form.setFieldsValue({ suitTopImage: this.state.suitTopImage });
    }
  };

  _buildFileListas = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        return {
          uid: file.uid,
          status: file.status,
          url: file.response ? file.response[0] : file.url
        };
      });
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
  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        return {
          uid: file.uid,
          status: file.status,
          url: file.response ? file.response[0] : file.url
        };
      });
  };

  /**
   * 检查文件格式以及大小
   */
  _checkUploadFileas = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  /**
   * 检查文件格式以及大小
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.setState({ customerLevel: levelList });

    let { marketingBean } = this.state;
    const subType = marketingBean.get('subType');
    console.info('================ subType: ' + subType + ' ============= ');
    if (subType != undefined && subType != null) {
      this.setState({
        isFullCount:
          subType == 6 || subType == 7 || subType == 8 ? 2 : subType % 2
      });
    } else {
      this.setState({ isFullCount: 0 });
    }
    this.levelInit(marketingBean.get('joinLevel'));
    // render selectedRows
    const scopeArray = marketingBean.get('marketingScopeList');
    if (scopeArray && !scopeArray.isEmpty()) {
      const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
      this.setState({
        selectedRows: this.makeSelectedRows(scopeIds),
        selectedSkuIds: scopeIds.toJS()
      });
    }
    this.setState({
      marketingBean: this.state.marketingBean.set('isOverlap', 1)
    });
    this.setState({
      marketingBean: this.state.marketingBean.set('isAddMarketingName', 0)
    });
  };

  /**
   * 等级初始化
   * @param joinLevel
   */
  levelInit = (joinLevel) => {
    if (joinLevel == undefined || joinLevel == null) {
      const { customerLevel } = this.state;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      this.setState({
        level: {
          _indeterminate: false,
          _checkAll: true,
          _checkedLevelList: levelIds,
          _allCustomer: true,
          _levelPropsShow: false
        }
      });
    } else {
      if (+joinLevel === 0) {
        //店铺内客户全选
        this.allLevelChecked(true);
      } else if (+joinLevel === -1) {
        //全平台客户
        this.levelRadioChange(-1);
      } else {
        //勾选某些等级
        this.levelGroupChange(joinLevel.split(','));
      }
    }
  };
  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType1 = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.REDUCTION_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.REDUCTION_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.REDUCTION_FULL_ORDER;
    }
  };
  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType2 = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.DISCOUNT_FULL_ORDER;
    }
  };
  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e, isShowOverlap) => {
    e.preventDefault();
    let {
      marketingBean,
      level,
      isFullCount,
      selectedSkuIds,
      selectedRows
    } = this.state;
    console.log(
      selectedRows.toJS(),
      'selectedRowsselectedRowsselectedRowsasdasd'
    );

    let bundleSalesSkuIds = [];
    selectedRows.toJS().forEach((item, index) => {
      console.log(item.marketingId);
      //为下面的多级条件校验加入因子
      bundleSalesSkuIds.push(
        item.marketingVO ? item.marketingVO.marketingId : item.marketingId
      );
    });
    let levelList = fromJS([]);
    let errorObject = {};

    const { marketingType, form } = this.props;
    form.resetFields();

    //判断设置规则
    marketingBean = marketingBean.set('subType', 9);

    //判断目标等级
    marketingBean = marketingBean.set('joinLevel', -1);
    console.log(
      selectedSkuIds,
      'selectedSkuIdsselectedSkuIdsselectedSkuIds789',
      bundleSalesSkuIds
    );
    // marketingBean = marketingBean.set(
    //   'suitMarketingBanner',
    //   this.state.storeLogo
    // );
    // marketingBean = marketingBean.set(
    //   'suitTopImage',
    //   this.state.suitTopImage
    // );
    if (this.state.storeLogo) {
      marketingBean = marketingBean.set(
        'suitMarketingBanner',
        this.state.storeLogo
      );
    } else {
      message.error('请上传营销头图');
      return false;
    }
    if (this.state.suitTopImage) {
      marketingBean = marketingBean.set(
        'suitTopImage',
        this.state.suitTopImage
      );
    } else {
      message.error('请上传顶部头图');
      return false;
    }
    //判断选择商品
    if (bundleSalesSkuIds.length >= 1) {
      marketingBean = marketingBean.set(
        'marketingIds',
        fromJS(bundleSalesSkuIds)
      );
    } else {
      message.error('每个套装至少1个活动');
      return false;
    }
    console.log(errorObject, 'errorObjecterrorObjecterrorObject');
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        console.log('成功');
        this.setState({ saveLoading: true });
        //组装营销类型
        marketingBean = marketingBean
          .set('marketingType', 3)
          .set('scopeType', 1);
        // .set('bundleSalesSkuIds', bundleSalesSkuIds);

        marketingBean = marketingBean.set('isOverlap', 0);
        marketingBean = marketingBean.set('isAddMarketingName', 0);
        console.log(marketingBean, 'marketingBeanmarketingBeanmarketingBean');
        // this.props.store
        //   .submitFullDiscount(marketingBean.toJS())
        //   .then((res) => this._responseThen(res));
        // if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
        //   this.props.store
        //     .submitFullGift(marketingBean.toJS())
        //     .then((res) => this._responseThen(res));
        // } else if (
        //   marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT
        // ) {
        //   // marketingBean = marketingBean.set(
        //   //   'fullDiscountLevelList',
        //   //   marketingBean
        //   //     .get('fullDiscountLevelList')
        //   //     .map((item) =>
        //   //       item.set('discount', item.get('discount') / 10)
        //   //     )
        //   // );
        //   console.log(marketingBean,'marketingBeanmarketingBeanmarketingBean')
        //   this.props.store
        //     .submitFullDiscount(marketingBean.toJS())
        //     .then((res) => this._responseThen(res));
        // } else {
        //   this.props.store
        //     .submitFullReduction(marketingBean.toJS())
        //     .then((res) => this._responseThen(res));
        // }

        //商品已经选择 + 时间已经选择 => 判断  同类型的营销活动下，商品是否重复
        if (marketingBean.get('beginTime') && marketingBean.get('endTime')) {
          webapi
            .skuExists({
              // skuIds: selectedSkuIds,
              marketingIds: bundleSalesSkuIds,
              marketingType: 3,
              startTime: marketingBean.get('beginTime'),
              endTime: marketingBean.get('endTime'),
              marketingId: marketingBean.get('marketingId'),
              marketingSubType: 9
              // isOverlap: 0,
              // isAddMarketingName: 0
            })
            .then(({ res }) => {
              if (res.code == Const.SUCCESS_CODE) {
                if (res.context.length > 0) {
                  if (res.context.length == 1 && res.context[0] == 'all') {
                    this.setState({ skuExists: res.context });
                    message.error(
                      '订单满减、订单满折、订单满赠不可在同一时间存在'
                    );
                    this.setState({ saveLoading: false });
                  } else {
                    this.setState({ skuExists: res.context });
                    const errArr = [];
                    selectedRows.toJS().forEach((item) => {
                      if (res.context.includes(item.goodsInfoId)) {
                        errArr.push(item.goodsInfoName);
                      }
                    });
                    message.error(
                      <div>
                        <p>{`${res.context.length}款商品活动时间冲突，请删除后再保存`}</p>
                        {errArr.map((item) => (
                          <p>{item}</p>
                        ))}
                      </div>,
                      4
                    );
                    // message.error(
                    //   `${res.context.length}款商品活动时间冲突，请删除后再保存`
                    // );
                    this.setState({ saveLoading: false });
                  }
                } else {
                  this.props.store
                    .submitFullDiscount(marketingBean.toJS())
                    .then((res) => this._responseThen(res));
                }
              } else {
                message.error(res.message);
                this.setState({ saveLoading: false });
              }
            });
        }
      }
    });
  };

  /**
   * 获取满系营销的类型
   * @param isFullCount
   */
  setSubType = (isFullCount) => {
    if (isFullCount == 0) {
      return Enum.SUB_TYPE.GIFT_FULL_AMOUNT;
    }
    if (isFullCount == 1) {
      return Enum.SUB_TYPE.GIFT_FULL_COUNT;
    }
    if (isFullCount == 2) {
      return Enum.SUB_TYPE.GIFT_FULL_ORDER;
    }
  };

  /**
   * 满系类型改变
   * @param marketingType
   * @param e
   */
  subTypeChange = (marketingType, e) => {
    const _thisRef = this;
    let levelType = '';
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelType = 'fullReductionLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelType = 'fullDiscountLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelType = 'fullGiftLevelList';
    }
    const { marketingBean, isFullCount } = this.state;
    if (levelType == '' || !marketingBean.get(levelType)) return;
    if (marketingBean.get(levelType).size > 0) {
      Confirm({
        title: '切换类型',
        content: '切换类型会清空已经设置的规则，是否继续？',
        onOk() {
          for (let i = 0; i < marketingBean.get(levelType).size; i++) {
            _thisRef.props.form.resetFields(`level_${i}`);
          }
          let beanObject = {
            [levelType]: fromJS([]),
            subType: marketingType * 2 + e.target.value
          };
          _thisRef.onBeanChange(beanObject);
          _thisRef.setState({ isFullCount: e.target.value });

          // _thisRef.setState({
          //   isFullCount: marketingType * 2 + e.target.value
          // });
        },
        onCancel() {
          _thisRef.props.form.setFieldsValue({ subType: isFullCount });
        }
      });
    }
  };

  /**
   * 勾选全部等级
   * @param checked
   */
  allLevelChecked = (checked) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    this.setState({
      level: {
        _indeterminate: false,
        _checkAll: checked,
        _checkedLevelList: checked ? levelIds : [],
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * 全部客户 ～ 全部等级  选择
   * @param value
   */
  levelRadioChange = (value) => {
    this.props.form.resetFields('targetCustomer');
    let { level, customerLevel } = this.state;
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    level._allCustomer = value === -1;
    level._levelPropsShow = value === 0;
    if (value == 0 && level._checkedLevelList.length == 0) {
      level._indeterminate = false;
      level._checkAll = true;
      level._checkedLevelList = levelIds;
    }
    this.setState(level);
  };

  /**
   * 勾选部分等级方法
   * @param checkedList
   */
  levelGroupChange = (checkedList) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
    this.setState({
      level: {
        _indeterminate:
          !!checkedList.length && checkedList.length < customerLevel.length,
        _checkAll: checkedList.length === customerLevel.length,
        _checkedLevelList: checkedList,
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * 规则变化方法
   * @param rules
   */
  onRulesChange = (rules) => {
    const { marketingType } = this.props;
    this.props.form.resetFields('rules');
    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      this.onBeanChange({ fullGiftLevelList: rules });
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      this.onBeanChange({ fullDiscountLevelList: rules });
    } else {
      this.onBeanChange({ fullReductionLevelList: rules });
    }
  };

  /**
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    this.setState({ marketingBean: this.state.marketingBean.merge(params) });
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedSkuIds, selectedRows'
    );
    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    if (selectedSkuIds.length > 0) {
      this.props.form.resetFields('goods');
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
  };

  // arrayRemoveArray(Arr, cut) {
  //   let newArr = []
  //   for (let a of Arr) {
  //     if (!cut.includes(a)) {
  //       newArr.push(a)
  //     }
  //   }
  //   return newArr
  // };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    selectedRows.toJS().forEach((item) => {
      if (selectedSkuIds.indexOf(item.marketingId) == -1) {
        selectedSkuIds.push(
          item.marketingVO ? item.marketingVO.marketingId : item.marketingId
        );
      }
    });

    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
  renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    const { marketingBean } = this.state;
    console.log(marketingBean, 'marketingBeanmarketingBean');
    const goodsList = marketingBean.get('goodsList');
    if (goodsList) {
      const goodsList = marketingBean.get('goodsList');
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('marketingId')));
      } else {
        selectedRows = goodsList.get('content');
      }
      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          const cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(goodsList.get('cates') || []).find(
            (s) => s.get('cateId') === cId
          );
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find(
            (s) => s.get('brandId') === bId
          );
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          return goodInfo;
        })
      );
    } else {
      return fromJS([]);
    }
  };

  purChange = (value, id) => {
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.purchaseNum = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  cheBOx = (id) => {
    console.log(id, '22222222222222');
    const { selectedRows } = this.state;
    console.log(selectedRows.toJS(), '66666666666666');
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    console.log(
      selectedSkuIds,
      '这是什么',
      selectedSkuIds.findIndex((item) => item == skuId)
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('marketingId') == skuId)
      )
    });
  };

  /**
   * 处理返回结果
   * @param response
   * @private
   */
  _responseThen = (response) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.push('/goodm');
    } else {
      message.error(response.res.message);
    }
    this.setState({ saveLoading: false });
  };
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
  } as any
};
