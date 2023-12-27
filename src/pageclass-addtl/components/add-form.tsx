import * as React from 'react';
import { Button, Col, Form, Input, Row, Icon, message, Radio } from 'antd';
import PropTypes from 'prop-types';
import { Store, Relax } from 'plume2';
import styled from 'styled-components';
import GoodsModal from './modoul/goods-modal';
import { Const, history, QMMethod, ValidConst, QMUpload, Tips } from 'qmkit';
import { fromJS } from 'immutable';
import SelectedGoodsGrid from './selected-goods-grid';

const FormItem = Form.Item;

const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const FILE_MAX_SIZE = 5 * 1024 * 1024;
// @Relax
export default class RegisteredAddForm extends React.Component<any, any> {
  // props;
  props: {
    form?: any;
    relaxProps?: {
      // 退货说明
      description: any;
      // 附件信息
      images: any;
      editItem: Function;
      editImages: Function;
      editImages1: Function;
    };
  };
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([]),
      selectedSkuIds1: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows1: fromJS([]),
      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [], // 规则长度
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      statusa: 1
    };
  }
  static relaxProps = {
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images',
    images1: 'images1'
  };

  componentWillReceiveProps(nextpops) {
    console.log(
      this._store
        .state()
        .get('activity')
        .toJS(),
      'activityactivity132456'
    );
    const actvie = this._store
      .state()
      .get('activity')
      .toJS();
    const ids = actvie.selectedRows.map((item) => item.pageCode);
    console.log(ids, 'idsidsids');
    this.setState({
      selectedRows: fromJS(actvie.selectedRows),
      selectedRows1: fromJS(actvie.selectedRows1),
      goodsModal: {
        _selectedRows: actvie.selectedRows,
        _selectedSkuIds: ids
      }
    });
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const images = store
      .state()
      .get('images')
      .toJS();
    const images1 = store
      .state()
      .get('images1')
      .toJS();
    const imageUrl = store
      .state()
      .get('activity')
      .get('imageUrl');
    const imageUrl1 = store
      .state()
      .get('activity')
      .get('imageUrl1');
    const isSuit = activity.get('jumpLink').toJS().isSuit
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    const isSuit1 = activity.get('jumpLink1').toJS().isSuit1
      ? activity.get('jumpLink1').toJS().isSuit1
      : 0;
    const { getFieldDecorator } = form;
    const {
      skuExists,
      selectedRows,
      skuExists1,
      selectedRows1,
      statusa
    } = this.state;
    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="序号">
            {getFieldDecorator('sortNum', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写序号'
                }
              ],
              onChange: (e) => {
                store.changeFormField({ sortNum: e.target.value });
              },
              initialValue: activity.get('sortNum') + ''
            })(<Input placeholder="请输入序号" style={{ width: 360 }} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('advertisingName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写活动名称'
                },
                { min: 1, max: 40, message: '活动名称不超过40个字符' }
              ],
              onChange: (e) => {
                store.changeFormField({ advertisingName: e.target.value });
              },
              initialValue: activity.get('advertisingName')
            })(<Input placeholder="请输入活动名称" style={{ width: 360 }} />)}
          </FormItem>

          {/* 左 */}
          <FormItem {...formItemLayout} label="左侧图">
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              rules: [
                {
                  required: true,
                  message: '请上传左侧图'
                }
              ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您左侧图上传,建议尺寸：346*278，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="设置左侧跳转页面">
            {getFieldDecorator('isSuit', {
              initialValue: isSuit ? isSuit : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink: {
                      isSuit: e.target.value
                    }
                  });
                  store.changeFormField({
                    selectedRows: []
                  });
                }}
              >
                <Radio value={0}>海报页</Radio>
                {/* <Radio value={3}>拆箱散批</Radio> */}
                <Radio value={2}>直播列表</Radio>
                <Radio value={1}>不跳转</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {isSuit == 0 ? (
            <FormItem
              {...formItemLayout}
              label="左侧图跳转链接"
              required={true}
            >
              {getFieldDecorator(
                'jumpLink',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(1)}
                    >
                      添加左侧图跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku}
                    cheBOx={this.cheBOx}
                    purChange={this.purChange}
                  />
                </div>
              )}
            </FormItem>
          ) : (
            ''
          )}
          <div
            style={{ height: '2px', background: '#ccc', margin: '10px 0' }}
          ></div>
          {/* 右 */}

          <FormItem {...formItemLayout} label="右侧图">
            {getFieldDecorator('imageUrl1', {
              initialValue: imageUrl1,
              rules: [
                {
                  required: true,
                  message: '请上传右侧图'
                }
              ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages1}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images1}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images1.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您右侧图上传,建议尺寸：346*278，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="设置右侧跳转页面">
            {getFieldDecorator('isSuit1', {
              // onChange: (e) => {
              //   store.changeFormField({ advertisingName: e.target.value });
              // },
              initialValue: isSuit1 ? isSuit1 : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink1: {
                      isSuit1: e.target.value
                    }
                  });
                  store.changeFormField({
                    selectedRows1: []
                  });
                }}
              >
                <Radio value={0}>海报页</Radio>
                <Radio value={2}>直播列表</Radio>
                <Radio value={1}>不跳转</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {isSuit1 == 0 ? (
            <FormItem
              {...formItemLayout}
              label="右侧图跳转链接"
              required={true}
            >
              {getFieldDecorator(
                'jumpLink1',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(2)}
                    >
                      添加右侧图跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows1}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku1}
                    cheBOx={this.cheBOx1}
                    purChange={this.purChange1}
                  />
                </div>
              )}
            </FormItem>
          ) : (
            ''
          )}
          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={() => this._onSave()}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>取消</Button>
            </Col>
          </Row>
          <GoodsModal
            visible={this.state.goodsModal._modalVisible}
            // marketingId={marketingId}
            selectedSkuIds={this.state.goodsModal._selectedSkuIds}
            selectedRows={this.state.goodsModal._selectedRows}
            onOkBackFun={this.skuSelectedBackFun}
            onCancelBackFun={this.closeGoodsModal}
            // searchForm={{ wareId: wareId }}
            limitNOSpecialPriceGoods={true}
          />
        </Form>
      </NumBox>
    );
  }
  /**
   * 打开货品选择modal
   */
  openGoodsModal = (statusa) => {
    // const { selectedRows, selectedSkuIds } = this.state;
    this.setState({
      statusa,
      goodsModal: {
        _modalVisible: true
        // _selectedSkuIds: selectedSkuIds,
        // _selectedRows: selectedRows
      }
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
    const store = this._store as any;
    const activity = store.state().get('activity');
    const isSuit = activity.get('jumpLink').toJS().isSuit
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    store.changeFormField({
      jumpLink: {
        isSuit,
        title: '',
        pageCode: ''
      }
    });
    store.changeFormField({
      selectedRows: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('pageCode') == skuId)
      )
    });
  };

  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku1 = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows1, selectedSkuIds1 } = this.state;
    selectedSkuIds1.splice(
      selectedSkuIds1.findIndex((item) => item == skuId),
      1
    );
    const store = this._store as any;
    const activity = store.state().get('activity');
    const isSuit1 = activity.get('jumpLink1').toJS().isSuit1
      ? activity.get('jumpLink1').toJS().isSuit1
      : 0;
    store.changeFormField({
      jumpLink1: {
        isSuit1,
        title: '',
        pageCode: ''
      }
    });
    store.changeFormField({
      selectedRows1: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds1: selectedSkuIds1,
      selectedRows1: selectedRows1.delete(
        selectedRows1.findIndex((row) => row.get('pageCode') == skuId)
      )
    });
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
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
    const store = this._store as any;

    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    const activity = store.state().get('activity');
    console.log(activity.toJS(), '55555', this.state.statusa);
    const isSuit = activity.get('jumpLink').toJS()
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    const isSuit1 = activity.get('jumpLink1').toJS().isSuit1
      ? activity.get('jumpLink1').toJS().isSuit1
      : 0;
    if (selectedSkuIds.length > 0) {
      if (this.state.statusa == 1) {
        store.changeFormField({
          jumpLink: {
            isSuit,
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        });
        store.changeFormField({
          selectedRows: [
            {
              title: selectedRows.toJS()[0].title,
              pageCode: selectedRows.toJS()[0].pageCode
            }
          ]
        });
        this.setState({
          selectedSkuIds,
          selectedRows,
          goodsModal: { _modalVisible: false }
        });
      } else {
        console.log(
          selectedRows.toJS()[0].title,
          'selectedRows.toJS()[0].title'
        );

        store.changeFormField({
          jumpLink1: {
            isSuit1,
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        });
        store.changeFormField({
          selectedRows1: [
            {
              title: selectedRows.toJS()[0].title,
              pageCode: selectedRows.toJS()[0].pageCode
            }
          ]
        });
        this.setState({
          selectedSkuIds1: selectedSkuIds,
          selectedRows1: selectedRows,
          goodsModal: { _modalVisible: false }
        });
      }
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
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

  purChange1 = (value, id) => {
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
    const { selectedRows1 } = this.state;
    const goodslk = selectedRows1.toJS();
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
  cheBOx1 = (id) => {
    console.log(id, '22222222222222');
    const { selectedRows1 } = this.state;
    console.log(selectedRows1.toJS(), '66666666666666');
    const goodslk = selectedRows1.toJS();
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
        message.error('文件大小不能超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages(fromJS(fileList));
  };
  /**
   * 改变图片
   */
  _editImages1 = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages1(fromJS(fileList));
  };

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs) {
        // 3.验证通过，保存
        store.save();
      }
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };
}
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  } as any,

  avatar: {
    width: 150,
    height: 150
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any,
  imgPlus: {
    width: 88,
    height: 88,
    border: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
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
