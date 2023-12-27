import * as React from 'react';
import { Relax } from 'plume2';
import {
  Alert,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tree,
  TreeSelect,
  Button,
  Icon
} from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, QMMethod, Tips, ValidConst, QMUpload, Const } from 'qmkit';
import { fromJS, Map } from 'immutable';

import ImageLibraryUpload from './image-library-upload';
import CanvasModal from './canvas-modal';
import VideoLibraryUpload from './video-library-upload';
import { makeCreateNormalizedMessageFromEsLintFailure } from 'fork-ts-checker-webpack-plugin/lib/NormalizedMessageFactories';

const { Option } = Select;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const FILE_MAX_SIZE = 2 * 1024 * 1024;
const confirm = Modal.confirm;

@Relax
export default class Info extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      isEditGoods: boolean;
      goods: IMap;
      editGoods: Function;
      statusHelpMap: IMap;
      cateList: IList;
      sourceCateList: IList;
      labelList: IList;
      storeCateList: IList;
      sourceStoreCateList: IList;
      brandList: IList;
      images: IList;
      salesPromotionImages: IList;
      video: IMap;
      maxCount: number;
      goodsImg: string;
      salesPromotionImg: string;
      editImages: Function;
      onImgChange: Function;
      salesPromotionEditImages: Function;
      showGoodsPropDetail: Function;
      updateGoodsForm: Function;
      showBrandModal: Function;
      showCateModal: Function;
      modalVisible: Function;
      canvasModalVisible: boolean;
      onCanvasModal: Function;
      clickImg: Function;
      removeImg: Function;
      salesPromotionRemoveImg: Function;
      removeVideo: Function;
      onCheckChange: Function;
      onDelSynthesisImages: Function;
      cateDisabled: boolean;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      synthesisImages: any;
    };
  };

  static relaxProps = {
    isEditGoods: 'isEditGoods',
    // 商品基本信息
    labelList: 'labelList',
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop,
    // 签约平台类目信息
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // 店铺分类信息
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    // 品牌信息
    brandList: 'brandList',
    // 商品图片
    images: 'images',
    //促销图片
    salesPromotionImages: 'salesPromotionImages',
    // 视频
    video: 'video',
    maxCount: 'maxCount',
    // 合成图片
    goodsImg: 'goodsImg',
    salesPromotionImg: 'salesPromotionImg',
    canvasModalVisible: 'canvasModalVisible',
    synthesisImages: 'synthesisImages',
    onCanvasModal: noop,
    onImgChange: noop,
    // 修改图片
    editImages: noop,
    salesPromotionEditImages: noop,
    showGoodsPropDetail: noop,
    updateGoodsForm: noop,
    // 显示品牌窗口
    showBrandModal: noop,
    showCateModal: noop,
    modalVisible: noop,
    imgVisible: 'imgVisible',
    clickImg: noop,
    removeImg: noop,
    salesPromotionRemoveImg: noop,
    removeVideo: noop,
    onCheckChange: noop,
    onDelSynthesisImages: noop,
    cateDisabled: 'cateDisabled',
    checkFlag: 'checkFlag',
    enterpriseFlag: 'enterpriseFlag',
    flashsaleGoods: 'flashsaleGoods'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(GoodsForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return (
      <div>
        <Alert
          message={
            <div>
              <p>操作说明：</p>
              <p>
                1、平台开启了商品审核后，首次新增的商品默认为待审核状态，已审核并且上架的商品才可出售；
              </p>
              <p>2、如果不需设置价格或者订货量可在编辑基础信息后直接保存；</p>
              <p>
                3、您可通过编辑SKU对单个SKU的门店价、上下架状态、价格及订货量进行设置；
              </p>
            </div>
          }
          type="info"
        />
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          基本信息
        </div>
        <div>
          <WrapperForm
            ref={(form) => (this['_form'] = form)}
            //ref={(form) => updateGoodsForm(form)}
            {...{ relaxProps: relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class GoodsForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateGoodsForm } = this.props.relaxProps;
    updateGoodsForm(this.props.form);
  }

  constructor(props) {
    super(props);
    this.state = {
      storeCateIds: props.relaxProps.goods.get('storeCateIds') // 店铺分类id列表
    };
  }

  componentWillReceiveProps(nextProps) {
    const storeCateIds = nextProps.relaxProps.goods.get('storeCateIds');
    if (this.state.storeCateIds != storeCateIds) {
      this.setState({ storeCateIds: storeCateIds });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      goods,
      images,
      salesPromotionImages,
      sourceCateList,
      cateList,
      isEditGoods,
      modalVisible,
      canvasModalVisible,
      onCanvasModal,
      showCateModal,
      storeCateList,
      editImages,
      synthesisImages,
      salesPromotionEditImages,
      goodsImg,
      salesPromotionImg,
      clickImg,
      removeImg,
      salesPromotionRemoveImg,
      brandList,
      cateDisabled,
      removeVideo,
      onCheckChange,
      onImgChange,
      onDelSynthesisImages,
      video
    } = this.props.relaxProps;
    let synthesisImagesList = this.props.relaxProps.synthesisImages.toJS();
    const storeCateIds = this.state.storeCateIds;
    const storeCateValues =
      (storeCateIds &&
        storeCateIds.toJS().map((id) => {
          return { value: id };
        })) ||
      [];

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // 一二级类目不允许选择
          return (
            <TreeNode
              key={item.get('cateId')}
              disabled={true}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });
    let brandExists = false;
    if (goods.get('brandId') != null) {
      brandList.map((item) => {
        if (item.get('brandId') + '' == goods.get('brandId').toString()) {
          brandExists = true;
        }
      });
    }

    return (
      <Form>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator('goodsName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请填写商品名称'
                  },
                  {
                    min: 1,
                    max: 40,
                    message: '1-40字符'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(
                        rule,
                        value,
                        callback,
                        '商品名称'
                      );
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsName'),
                initialValue: goods.get('goodsName')
              })(<Input placeholder="请填写商品名称，不超过40字" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="SPU编码">
              {getFieldDecorator('goodsNo', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请填写SPU编码'
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '1-20字符'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'SPU编码');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: goods.get('goodsNo')
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="平台类目">
              {getFieldDecorator('cateId', {
                rules: [
                  {
                    required: true,
                    message: '请选择平台商品类目'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (!value) {
                        callback();
                        return;
                      }

                      let overLen = false;
                      sourceCateList.forEach((val) => {
                        if (val.get('cateParentId') + '' == value)
                          overLen = true;
                        return;
                      });

                      if (overLen) {
                        callback(new Error('请选择最末级的分类'));
                        return;
                      }

                      callback();
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'cateId'),
                initialValue:
                  goods.get('cateId') && goods.get('cateId') != ''
                    ? goods.get('cateId')
                    : undefined
              })(
                <TreeSelect
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  placeholder="请选择分类"
                  notFoundContent="暂无分类"
                  // disabled={cateDisabled}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {loop(cateList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="店铺分类">
              {getFieldDecorator('storeCateIds', {
                rules: [
                  {
                    required: true,
                    message: '请选择店铺分类'
                  }
                ],
                onChange: this.storeCateChange,
                initialValue: storeCateValues
              })(
                <TreeSelect
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  placeholder="请选择店铺分类"
                  notFoundContent="暂无分类"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                  showSearch={false}
                >
                  {this.generateStoreCateTree(storeCateList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <a
              href="javascript:;"
              onClick={showCateModal}
              style={{ marginLeft: 10, lineHeight: '40px' }}
            >
              新增店铺分类
            </a>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品品牌">
              {getFieldDecorator(
                'brandId',
                brandExists
                  ? {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId'),
                      initialValue: goods.get('brandId').toString()
                    }
                  : {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId')
                    }
              )(this._getBrandSelect())}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="计量单位">
              {getFieldDecorator('goodsUnit', {
                rules: [
                  {
                    required: true,
                    min: 1,
                    max: 10,
                    message: '1-10字符'
                  },
                  {
                    pattern: ValidConst.noNumber,
                    message: '只能输入中文或英文'
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsUnit'),
                initialValue: goods.get('goodsUnit')
              })(<Input placeholder="请填写计量单位，不超过10字" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品副标题">
              {getFieldDecorator('goodsSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 40,
                    message: '1-40字符'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(
                        rule,
                        value,
                        callback,
                        '商品副标题'
                      );
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsSubtitle'),
                initialValue: goods.get('goodsSubtitle')
              })(
                <Input
                  placeholder="请填商品副标题，不超过40字"
                  disabled={cateDisabled}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="划线价">
              {getFieldDecorator('linePrice', {
                rules: [
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'linePrice'),
                initialValue: goods.get('linePrice')
              })(<Input placeholder="请填写商品划线价" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品标签">
              {getFieldDecorator('labelIdStr', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value.length > 3) {
                        callback(new Error('最多选择3个标签'));
                        return;
                      }

                      callback();
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'labelIdStr'),
                initialValue:
                  goods.get('labelIdStr') === null ||
                  goods.get('labelIdStr') === undefined
                    ? []
                    : goods.get('labelIdStr').toJS()
              })(this._getLabelSelect(goods.get('labelIdStr')))}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="锁定库存">
              {getFieldDecorator('lockStock', {
                rules: [
                  {
                    pattern: ValidConst.numbezzs,
                    message: '请输入整数，合法数字'
                  },
                  {
                    type: 'number',
                    max: 9999999,
                    message: '最大值为9999999',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'lockStock'),
                initialValue: goods.get('lockStock')
              })(<Input placeholder="请填写锁定库存" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="仓库">
              {getFieldDecorator('goodsSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 40,
                    message: '1-40字符'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, '仓库');
                    }
                  }
                ],
                // onChange: this._editGoods.bind(this, 'goodsSubtitle'),
                initialValue: goods.get('wareName')
              })(<Input placeholder="请填仓库，不超过40字" disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="销售类型">
              {getFieldDecorator('saleType', {
                rules: [
                  {
                    required: true,
                    message: '请选择销售类型'
                  }
                ],
                onChange: this._editGoods.bind(this, 'saleType'),
                initialValue: goods.get('saleType')
              })(
                <RadioGroup>
                  <Radio value={0}>批发</Radio>
                  <Radio value={1}>零售</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        {/* <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="门店价">
              {getFieldDecorator('marketPrice', {
                rules: [
                  {
                    required: true,
                    message: '请填写门店价'
                  },
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'marketPrice'),
                initialValue: goods.get('marketPrice')
              })(<Input placeholder="请填写商品统一门店价，单位“元”" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="成本价">
              {getFieldDecorator('costPrice', {
                rules: [
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'costPrice'),
                initialValue: goods.get('costPrice')
              })(<Input placeholder="请填写商品统一成本价，单位“元”" />)}
            </FormItem>
          </Col>
        </Row> */}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="上下架">
              {getFieldDecorator('addedFlag', {
                rules: [
                  {
                    required: true,
                    message: '请选择上下架状态'
                  }
                ],
                onChange: this._editGoods.bind(this, 'addedFlag'),
                initialValue: goods.get('addedFlag')
              })(
                <RadioGroup>
                  <Radio value={1}>上架</Radio>
                  <Radio value={0}>下架</Radio>
                  {/* {isEditGoods && (
                    <Radio value={2} disabled={true}>
                      部分上架
                    </Radio>
                  )} */}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品图片">
              <div style={{ width: 550 }}>
                <ImageLibraryUpload
                  images={images}
                  modalVisible={modalVisible}
                  editImages={editImages}
                  clickImg={clickImg}
                  removeImg={removeImg}
                  onCheckChange={onCheckChange}
                  imgName="images"
                  imgType={0}
                  imgCount={20}
                  skuId=""
                />
              </div>
              <Tips title="建议尺寸:800*800px,单张大小不超过2M,最多可上传10张" />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="促销图片">
              <div style={{ width: 550 }}>
                <ImageLibraryUpload
                  images={salesPromotionImages}
                  modalVisible={modalVisible}
                  editImages={salesPromotionEditImages}
                  clickImg={clickImg}
                  removeImg={salesPromotionRemoveImg}
                  onCheckChange={onCheckChange}
                  imgType={0}
                  imgName="salesPromotionImages"
                  imgCount={20}
                  skuId=""
                />
              </div>
              <Tips title="建议尺寸:800*800px,单张大小不超过2M,最多可上传10张" />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="合成图片">
              <div style={{ width: 550 }}>
                <QMUpload
                  style={styles.box}
                  name="uploadFile"
                  fileList={synthesisImagesList}
                  disabled={true}
                  action={
                    Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
                  }
                  listType="picture-card"
                  accept={'.jpg,.jpeg,.png,.gif'}
                  onChange={this._editImages}
                  beforeUpload={this._checkUploadFile}
                >
                  {synthesisImagesList.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Button
                  type="primary"
                  onClick={(e) => {
                    if (goodsImg && salesPromotionImg) {
                      onCanvasModal(true);
                    } else {
                      message.error('请先选好图片，再合图');
                    }
                  }}
                >
                  合成图片
                </Button>
                <Button
                  style={{ marginLeft: '8px' }}
                  onClick={(e) => {
                    onDelSynthesisImages();
                    // onImgChange('synthesisImages',fromJS([]));
                  }}
                >
                  删除图片
                </Button>
              </div>
              <Tips title="建议尺寸:800*800px,单张大小不超过2M,最多可上传10张" />
            </FormItem>
          </Col>
        </Row>
        <CanvasModal
          goodsImages={goodsImg}
          salesPromotionImages={salesPromotionImg}
          modalVisible={canvasModalVisible}
          handleOk={(blob) => {
            onCanvasModal(5, blob);
          }}
          handleCancel={() => {
            onCanvasModal(false);
          }}
        />
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品视频">
              <div style={{ width: 550 }}>
                <VideoLibraryUpload
                  modalVisible={modalVisible}
                  video={video}
                  removeVideo={removeVideo}
                  imgType={3}
                  skuId=""
                />
              </div>
              <Tips title="商品视频大小推荐30M，最大限制50M，支持文件类型：mp4，推荐时长小于等于90s，大于等于6s，推荐视频比例7：9" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    const { onImgChange } = this.props.relaxProps;
    if (file.status == 'error' || fileList == null) {
      onImgChange('synthesisImages', fromJS([]));
      message.error('上传失败');
      return;
    }
    //删除图片
    if (file.status == 'removed') {
      onImgChange('synthesisImages', fromJS([]));
      return;
    }

    onImgChange(
      'synthesisImages',
      fromJS(
        fileList.map((file) => {
          return {
            uid: file.uid,
            status: file.status,
            url: file.response ? file.response[0] : file.url
          };
        }) || []
      )
    );
  };

  /**
   * 选中平台类目时，实时显示对应类目下的所有属性信息
   */
  _onChange = (value) => {
    const { showGoodsPropDetail } = this.props.relaxProps;
    showGoodsPropDetail(value);
  };
  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const {
      editGoods,
      showBrandModal,
      showCateModal,
      checkFlag,
      enterpriseFlag,
      flashsaleGoods,
      updateGoodsForm
    } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;
    if (e && e.target) {
      e = e.target.value;
    }

    if (key === 'cateId') {
      this._onChange(e);
      if (e === '-1') {
        showCateModal();
      }
    } else if (key === 'brandId' && e === '0') {
      showBrandModal();
    }

    if (key === 'saleType' && e == 0) {
      if (!flashsaleGoods.isEmpty()) {
        message.error('该商品正在参加秒杀活动，不可更改销售类型！', 3, () => {
          let goods = Map({
            [key]: fromJS(1)
          });
          editGoods(goods);
          setFieldsValue({ saleType: 1 });
        });
      } else {
        let message = '';
        //1:分销商品和企业购商品  2：企业购商品  3：分销商品  4：普通商品
        if (checkFlag == 'true') {
          if (enterpriseFlag) {
            //分销商品和企业购商品
            message =
              '该商品正在参加企业购和分销活动，切换为批发模式，将会退出企业购和分销活动，确定要切换？';
          } else {
            //分销商品
            message =
              '该商品正在参加分销活动，切换为批发模式，将会退出分销活动，确定要切换？';
          }
        } else {
          if (enterpriseFlag) {
            message =
              '该商品正在参加企业购活动，切换为批发模式，将会退出企业购活动，确定要切换？';
          }
        }
        if (message != '') {
          confirm({
            title: '提示',
            content: message,
            onOk() {
              let goods = Map({
                [key]: fromJS(e)
              });
              editGoods(goods);
            },
            onCancel() {
              let goods = Map({
                [key]: fromJS(1)
              });
              editGoods(goods);
              setFieldsValue({ saleType: 1 });
            },
            okText: '确定',
            cancelText: '取消'
          });
        } else {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
        }
      }
    } else {
      let goods = Map({
        [key]: fromJS(e)
      });
      updateGoodsForm(this.props.form);
      editGoods(goods);
    }
  };

  /**
   * 修改店铺分类
   */
  storeCateChange = (value, _label, extra) => {
    const { editGoods } = this.props.relaxProps;
    // 店铺分类，结构如 [{value: 1, label: xx},{value: 2, label: yy}]

    // 店铺分类列表
    const sourceStoreCateList =
      this.props.relaxProps.sourceStoreCateList || fromJS([]);

    // 勾选的店铺分类列表
    let originValues = fromJS(value.map((v) => v.value));

    // 如果是点x清除某个节点或者是取消勾选某个节点，判断清除的是一级还是二级，如果是二级可以直接清；如果是一级，连带把二级的清了
    if (extra.clear || !extra.checked) {
      sourceStoreCateList.forEach((cate) => {
        // 删的是某个一级的
        if (
          extra.triggerValue == cate.get('storeCateId') &&
          cate.get('cateParentId') == 0
        ) {
          // 找到此一级节点下的二级节点
          const children = sourceStoreCateList.filter(
            (ss) => ss.get('cateParentId') == extra.triggerValue
          );
          // 把一级的子节点也都删了
          originValues = originValues.filter(
            (v) => children.findIndex((c) => c.get('storeCateId') == v) == -1
          );
        }
      });
    }

    // 如果子节点被选中，上级节点也要被选中
    // 为了防止extra对象中的状态api变化，业务代码未及时更新，这里的逻辑不放在上面的else中
    originValues.forEach((v) => {
      sourceStoreCateList.forEach((cate) => {
        // 找到选中的分类，判断是否有上级
        if (v == cate.get('storeCateId') && cate.get('cateParentId') != 0) {
          // 判断上级是否已添加过，如果没有添加过，添加
          let exist = false;
          originValues.forEach((vv) => {
            if (vv == cate.get('cateParentId')) {
              exist = true;
            }
          });
          if (!exist) {
            originValues = originValues.push(cate.get('cateParentId'));
          }
        }
      });
    });

    const storeCateIds = originValues;
    const goods = Map({
      ['storeCateIds']: storeCateIds
    });

    // 强制刷新店铺分类的选中视图
    this.setState({ storeCateIds }, () => {
      this.props.form.resetFields(['storeCateIds']);
    });

    editGoods(goods);
  };

  /**
   * 获取品牌标签
   */
  _getLabelSelect = (lable) => {
    const { brandList, labelList } = this.props.relaxProps;
    return (
      <Select
        mode="multiple"
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择标签"
        optionFilterProp={'children'}
        notFoundContent="暂无标签"
        allowClear={true}
      >
        {labelList?.map((item) => {
          return (
            <Option key={item.get('id')} value={item.get('id')}>
              {item.get('name')}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 获取品牌下拉框
   */
  _getBrandSelect = () => {
    const { brandList, isEditGoods } = this.props.relaxProps;
    return (
      <Select
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择品牌"
        notFoundContent="暂无品牌"
        allowClear={true}
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string'
            ? option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : true;
        }}
      >
        {brandList.map((item) => {
          return (
            <Option key={item.get('brandId')} value={item.get('brandId') + ''}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
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
  };

  /**
   * 店铺分类树形下拉框
   * @param storeCateList
   */
  generateStoreCateTree = (storeCateList) => {
    return storeCateList.map((item) => {
      if (item.get('children') && item.get('children').count()) {
        return (
          <TreeNode
            key={item.get('storeCateId')}
            value={item.get('storeCateId')}
            title={item.get('cateName')}
          >
            {this.generateStoreCateTree(item.get('children'))}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.get('storeCateId')}
          value={item.get('storeCateId')}
          title={item.get('cateName')}
        />
      );
    });
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
  }
};
