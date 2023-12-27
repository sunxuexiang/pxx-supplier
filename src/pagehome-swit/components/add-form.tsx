import * as React from 'react';
import { Button, Col, Form, Input, Row, Icon, message, Radio } from 'antd';
import PropTypes from 'prop-types';
import { Store, Relax } from 'plume2';
import styled from 'styled-components';
import { Const, history, QMMethod, ValidConst, QMUpload, Tips } from 'qmkit';
import { fromJS } from 'immutable';
import GoodsModal from '../../pageclass-addtl/components/modoul/goods-modal';
import SelectedGoodsGrid from '../../pageclass-addtl/components/selected-goods-grid';

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
      selectedSkuIds2: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows2: fromJS([]),
      selectedSkuIds3: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows3: fromJS([]),
      selectedSkuIds4: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows4: fromJS([]),
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
    // console.log(this._store.state().get('activity').toJS(), 'activityactivity132456');
    const actvie = this._store
      .state()
      .get('activity')
      .toJS();
    const ids = actvie.selectedRows.map((item) => item.pageCode);
    console.log(ids, 'idsidsids');
    this.setState({
      selectedRows: fromJS(actvie.selectedRows),
      selectedRows1: fromJS(actvie.selectedRows1),
      selectedRows2: fromJS(actvie.selectedRows2),
      selectedRows3: fromJS(actvie.selectedRows3),
      selectedRows4: fromJS(actvie.selectedRows4),
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
    const images2 = store
      .state()
      .get('images2')
      .toJS();
    const imageUrl2 = store
      .state()
      .get('activity')
      .get('imageUrl2');
    const images3 = store
      .state()
      .get('images3')
      .toJS();
    const imageUrl3 = store
      .state()
      .get('activity')
      .get('imageUrl3');
    const images4 = store
      .state()
      .get('images4')
      .toJS();
    const imageUrl4 = store
      .state()
      .get('activity')
      .get('imageUrl4');

    const isSuit = activity.get('jumpLink').toJS().isSuit
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    const isSuit1 = activity.get('jumpLink1').toJS().isSuit1
      ? activity.get('jumpLink1').toJS().isSuit1
      : 0;
    const isSuit2 = activity.get('jumpLink2').toJS().isSuit2
      ? activity.get('jumpLink2').toJS().isSuit2
      : 0;
    const isSuit3 = activity.get('jumpLink3').toJS().isSuit3
      ? activity.get('jumpLink3').toJS().isSuit3
      : 0;
    const isSuit4 = activity.get('jumpLink4').toJS().isSuit4
      ? activity.get('jumpLink4').toJS().isSuit4
      : 0;
    const { getFieldDecorator } = form;
    const {
      skuExists,
      selectedRows,
      skuExists1,
      selectedRows1,
      statusa,
      selectedRows2,
      selectedRows3,
      selectedRows4
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
          <FormItem {...formItemLayout} label="设置图1套装跳转">
            {getFieldDecorator('isSuit', {
              // onChange: (e) => {
              //   store.changeFormField({ advertisingName: e.target.value });
              // },
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
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 图1 */}
          <FormItem {...formItemLayout} label={'图1'}>
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              rules: [
                {
                  required: true,
                  message: '请上传图1'
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
                <Tips title="请将您图1上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          {isSuit == 0 ? (
            <FormItem {...formItemLayout} label="图1跳转链接" required={true}>
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
                      添加图1跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku}
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

          <FormItem {...formItemLayout} label="设置图2套装跳转">
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
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 图2 */}
          <FormItem {...formItemLayout} label="图2">
            {getFieldDecorator('imageUrl1', {
              initialValue: imageUrl1
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传图2'
              //   }
              // ]
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
                <Tips title="请将您图2上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          {isSuit1 == 0 ? (
            <FormItem {...formItemLayout} label="图2跳转链接">
              {getFieldDecorator(
                'jumpLink',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(2)}
                    >
                      添加图2跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows1}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku1}
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

          <FormItem {...formItemLayout} label="设置图3套装跳转">
            {getFieldDecorator('isSuit2', {
              // onChange: (e) => {
              //   store.changeFormField({ advertisingName: e.target.value });
              // },
              initialValue: isSuit2 ? isSuit2 : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink2: {
                      isSuit2: e.target.value
                    }
                  });
                  store.changeFormField({
                    selectedRows2: []
                  });
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 图3 */}
          <FormItem {...formItemLayout} label="图3">
            {getFieldDecorator('imageUrl2', {
              initialValue: imageUrl2
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传图2'
              //   }
              // ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages2}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images2}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images2.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您图3上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          {isSuit2 == 0 ? (
            <FormItem {...formItemLayout} label="图3跳转链接">
              {getFieldDecorator(
                'jumpLink',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(3)}
                    >
                      添加图3跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows2}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku2}
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

          <FormItem {...formItemLayout} label="设置图4套装跳转">
            {getFieldDecorator('isSuit3', {
              // onChange: (e) => {
              //   store.changeFormField({ advertisingName: e.target.value });
              // },
              initialValue: isSuit3 ? isSuit3 : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink3: {
                      isSuit3: e.target.value
                    }
                  });
                  store.changeFormField({
                    selectedRows3: []
                  });
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 图4 */}
          <FormItem {...formItemLayout} label="图4">
            {getFieldDecorator('imageUrl3', {
              initialValue: imageUrl3
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传图4'
              //   }
              // ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages3}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images3}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images3.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您图4上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          {isSuit3 == 0 ? (
            <FormItem {...formItemLayout} label="图4跳转链接">
              {getFieldDecorator(
                'jumpLink',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(4)}
                    >
                      添加图4跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows3}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku3}
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

          <FormItem {...formItemLayout} label="设置图5套装跳转">
            {getFieldDecorator('isSuit4', {
              // onChange: (e) => {
              //   store.changeFormField({ advertisingName: e.target.value });
              // },
              initialValue: isSuit4 ? isSuit4 : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink4: {
                      isSuit4: e.target.value
                    }
                  });
                  store.changeFormField({
                    selectedRows4: []
                  });
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 图5 */}
          <FormItem {...formItemLayout} label="图5">
            {getFieldDecorator('imageUrl4', {
              initialValue: imageUrl4
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传图5'
              //   }
              // ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages4}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images4}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images4.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您图5上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          {isSuit4 == 0 ? (
            <FormItem {...formItemLayout} label="图5跳转链接">
              {getFieldDecorator(
                'jumpLink',
                {}
              )(
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={() => this.openGoodsModal(5)}
                    >
                      添加图5跳转链接
                    </Button>
                    &nbsp;&nbsp;
                    <div>只能添加1个添加跳转链接</div>
                  </div>
                  <SelectedGoodsGrid
                    selectedRows={selectedRows4}
                    skuExists={skuExists}
                    itmelist={[]}
                    deleteSelectedSku={this.deleteSelectedSku4}
                  />
                </div>
              )}
            </FormItem>
          ) : (
            ''
          )}
          <div className="bar-button">
            <Button
              onClick={() => this._onSave()}
              type="primary"
              htmlType="submit"
            >
              保存
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.goBack()}>取消</Button>
          </div>
        </Form>
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
    console.log('99999999999999----删除1231', skuId);
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
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku2 = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows2, selectedSkuIds2 } = this.state;
    selectedSkuIds2.splice(
      selectedSkuIds2.findIndex((item) => item == skuId),
      1
    );
    const store = this._store as any;
    const activity = store.state().get('activity');
    const isSuit2 = activity.get('jumpLink2').toJS().isSuit2
      ? activity.get('jumpLink2').toJS().isSuit2
      : 0;
    store.changeFormField({
      jumpLink2: {
        isSuit2,
        title: '',
        pageCode: ''
      }
    });
    store.changeFormField({
      selectedRows2: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds2: selectedSkuIds2,
      selectedRows2: selectedRows2.delete(
        selectedRows2.findIndex((row) => row.get('pageCode') == skuId)
      )
    });
  };
  deleteSelectedSku3 = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows3, selectedSkuIds3 } = this.state;
    selectedSkuIds3.splice(
      selectedSkuIds3.findIndex((item) => item == skuId),
      1
    );
    const store = this._store as any;
    const activity = store.state().get('activity');
    const isSuit3 = activity.get('jumpLink3').toJS().isSuit3
      ? activity.get('jumpLink3').toJS().isSuit3
      : 0;
    store.changeFormField({
      jumpLink3: {
        isSuit3,
        title: '',
        pageCode: ''
      }
    });
    store.changeFormField({
      selectedRows3: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds3: selectedSkuIds3,
      selectedRows3: selectedRows3.delete(
        selectedRows3.findIndex((row) => row.get('pageCode') == skuId)
      )
    });
  };
  deleteSelectedSku4 = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows4, selectedSkuIds4 } = this.state;
    selectedSkuIds4.splice(
      selectedSkuIds4.findIndex((item) => item == skuId),
      1
    );
    const store = this._store as any;
    const activity = store.state().get('activity');
    const isSuit4 = activity.get('jumpLink4').toJS().isSuit4
      ? activity.get('jumpLink4').toJS().isSuit4
      : 0;
    store.changeFormField({
      jumpLink4: {
        isSuit4,
        title: '',
        pageCode: ''
      }
    });
    store.changeFormField({
      selectedRows4: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds4: selectedSkuIds4,
      selectedRows4: selectedRows4.delete(
        selectedRows4.findIndex((row) => row.get('pageCode') == skuId)
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
    const isSuit = activity.get('jumpLink').toJS().isSuit
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    const isSuit1 = activity.get('jumpLink1').toJS().isSuit1
      ? activity.get('jumpLink1').toJS().isSuit1
      : 0;
    const isSuit2 = activity.get('jumpLink2').toJS().isSuit2
      ? activity.get('jumpLink2').toJS().isSuit2
      : 0;
    const isSuit3 = activity.get('jumpLink3').toJS().isSuit3
      ? activity.get('jumpLink3').toJS().isSuit3
      : 0;
    const isSuit4 = activity.get('jumpLink4').toJS().isSuit4
      ? activity.get('jumpLink4').toJS().isSuit4
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
      } else if (this.state.statusa == 2) {
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
      } else if (this.state.statusa == 3) {
        store.changeFormField({
          jumpLink2: {
            isSuit2,
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        });
        store.changeFormField({
          selectedRows2: [
            {
              title: selectedRows.toJS()[0].title,
              pageCode: selectedRows.toJS()[0].pageCode
            }
          ]
        });
        this.setState({
          selectedSkuIds2: selectedSkuIds,
          selectedRows2: selectedRows,
          goodsModal: { _modalVisible: false }
        });
      } else if (this.state.statusa == 4) {
        store.changeFormField({
          jumpLink3: {
            isSuit3,
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        });
        store.changeFormField({
          selectedRows3: [
            {
              title: selectedRows.toJS()[0].title,
              pageCode: selectedRows.toJS()[0].pageCode
            }
          ]
        });
        this.setState({
          selectedSkuIds3: selectedSkuIds,
          selectedRows3: selectedRows,
          goodsModal: { _modalVisible: false }
        });
      } else if (this.state.statusa == 5) {
        store.changeFormField({
          jumpLink4: {
            isSuit4,
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        });
        store.changeFormField({
          selectedRows4: [
            {
              title: selectedRows.toJS()[0].title,
              pageCode: selectedRows.toJS()[0].pageCode
            }
          ]
        });
        this.setState({
          selectedSkuIds4: selectedSkuIds,
          selectedRows4: selectedRows,
          goodsModal: { _modalVisible: false }
        });
      }
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
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
  _editImages2 = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages2(fromJS(fileList));
  };

  /**
   * 改变图片
   */
  _editImages3 = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages3(fromJS(fileList));
  };

  /**
   * 改变图片
   */
  _editImages4 = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages4(fromJS(fileList));
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
