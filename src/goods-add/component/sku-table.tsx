import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Form, Button, message } from 'antd';
import { IList } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst, cache } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import QrcodeLibraryUpload from './qrcode-library-upload';
import goods from '@/goods-add/component/goods';

const FormItem = Form.Item;

const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
      editGoodsItem: Function;
      editGoodsStock: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateChecked: Function;
      synchValue: Function;
      clickImg: Function;
      removeImg: Function;
      removeQrImg: Function;
      modalVisible: Function;
      isEditGoods: boolean;
      isProviderGoods: boolean;
      syncErpStock: Function;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    stockChecked: 'stockChecked',
    marketPriceChecked: 'marketPriceChecked',
    specSingleFlag: 'specSingleFlag',
    spuMarketPrice: ['goods', 'marketPrice'],
    priceOpt: 'priceOpt',
    editGoodsItem: noop,
    editGoodsStock: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    removeQrImg: noop,
    modalVisible: noop,
    isEditGoods: 'isEditGoods',
    isProviderGoods: 'isProviderGoods',
    syncErpStock: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { updateSkuForm } = this.props.relaxProps;

    return (
      <WrapperForm
        ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { goodsList } = this.props.relaxProps;
    let goodsId;
    if (goodsList) {
      goodsId = goodsList.get(0).get('goodsId');
    }
    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20, overflowX: 'scroll' }}>
        <Form>
          <Table
            rowKey="id"
            dataSource={goodsList.toJS()}
            columns={columns}
            pagination={false}
          />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    //商家权限数据
    const authInfo = JSON.parse(sessionStorage.getItem(cache.AUTHINFO));
    const { presellState } = authInfo;
    const { getFieldDecorator } = this.props.form;
    const {
      goodsSpecs,
      marketPriceChecked,
      modalVisible,
      clickImg,
      removeImg,
      removeQrImg,
      specSingleFlag,
      spuMarketPrice,
      priceOpt,
      syncErpStock
    } = this.props.relaxProps;

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId')
          };
        })
        .toList();
    }

    columns = columns.unshift({
      title: '图片',
      key: 'img',
      className: 'goodsImg',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return (
          <ImageLibraryUpload
            images={images}
            modalVisible={modalVisible}
            clickImg={clickImg}
            removeImg={removeImg}
            imgCount={1}
            imgType={1}
            skuId={rowInfo.id}
          />
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          SKU编码
        </div>
      ),
      key: 'goodsInfoNo',
      width: '13%',
      render: (rowInfo) => {
        return (
          <Row>
            <Col>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写SKU编码'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20字符'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'goodsInfoNo'
                  ),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          ERP编码
        </div>
      ),
      key: 'erpGoodsInfoNo',
      width: '10%',
      render: (rowInfo) => {
        return (
          <Row>
            <Col>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('erpGoodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写erp编码'
                    },
                    {
                      min: 1,
                      max: 200,
                      message: '1-200字符'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'erpGoodsInfoNo'
                  ),
                  initialValue: rowInfo.erpGoodsInfoNo
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          门店价
          <br />
          {/*<Checkbox*/}
          {/*disabled={(isEditGoods && isProviderGoods) || priceOpt === 0}*/}
          {/*checked={marketPriceChecked}*/}
          {/*onChange={(e) => this._synchValue(e, 'marketPrice')}*/}
          {/*>*/}
          {/*全部相同&nbsp;*/}
          {/*<Tooltip placement="top" title={'勾选后所有SKU都使用相同的门店价'}>*/}
          {/*<a style={{ fontSize: 14 }}>*/}
          {/*<Icon type="question-circle-o" />*/}
          {/*</a>*/}
          {/*</Tooltip>*/}
          {/*</Checkbox>*/}
        </div>
      ),
      key: 'marketPrice',
      width: '8%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('marketPrice_' + rowInfo.id, {
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
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'marketPrice'
                ),
                initialValue: rowInfo.marketPrice || 0
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          大客户价
          <br />
        </div>
      ),
      key: 'vipPrice',
      width: '9%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('vipPrice_' + rowInfo.id, {
                rules: [
                  {
                    required: true,
                    message: '请填写大客户价'
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
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'vipPrice'
                ),
                initialValue: rowInfo.vipPrice || 0
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          条形码
        </div>
      ),
      key: 'goodsInfoBarcode',
      width: '12%',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('goodsInfoBarcode_' + rowInfo.id, {
                rules: [
                  // {
                  //   pattern: ValidConst.thirteenNineNumber,
                  //   message: '不超过20位'
                  // }
                ],
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'goodsInfoBarcode'
                ),
                initialValue: rowInfo.goodsInfoBarcode
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          步长
        </div>
      ),
      key: 'addStep',
      width: '8%',
      render: (rowInfo) => (
        <Row>
          <Col>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('addStep_' + rowInfo.id, {
                // rules: [
                //   {
                //     pattern: ValidConst.noZeroNumber,
                //     required: true,
                //     message: '数字'
                //   }
                // ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'addStep'),
                initialValue: rowInfo.addStep ? rowInfo.addStep : 1
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          库存
          <br />
        </div>
      ),
      key: 'goodsWareStocks',
      width: '12%',
      render: (rowInfo) => {
        const goodsWareStocks = fromJS(
          rowInfo.goodsWareStocks ? rowInfo.goodsWareStocks : []
        );
        return (
          <Row>
            <Col>
              {goodsWareStocks.size == 0
                ? '暂无数据'
                : goodsWareStocks.map((item) => {
                    return (
                      <FormItem
                        key={item.get('id')}
                        style={styles.tableFormItem}
                      >
                        <span>{item.get('wareName')}</span> &nbsp;&nbsp;
                        {getFieldDecorator(
                          'goodsWareStocks_' + item.get('id'),
                          {
                            rules: [
                              {
                                pattern: ValidConst.enterpriseRange,
                                required: true,
                                message: '请输入库存数量'
                              }
                            ],
                            onChange: this._editGoodsStockWare.bind(
                              this,
                              rowInfo.id,
                              item.get('id'),
                              'stock'
                            ),
                            initialValue: item.get('stock')
                          }
                        )(<Input style={styles.wareStock} />)}
                      </FormItem>
                    );
                  })}
            </Col>
          </Row>
        );
      }
    });

    if (presellState === 1) {
      columns = columns.push({
        title: (
          <div>
            <span
              style={{
                color: 'red',
                fontFamily: 'SimSun',
                marginRight: '4px',
                fontSize: '12px'
              }}
            >
              *
            </span>
            预售库存
          </div>
        ),
        key: 'presellStock',
        width: '10%',
        render: (rowInfo) => (
          <Row>
            <Col>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('presellStock' + rowInfo.id, {
                  rules: [
                    {
                      pattern: ValidConst.number,
                      required: true,
                      message: '请输入正整数'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'presellStock'
                  ),
                  initialValue:
                    rowInfo.presellStock || rowInfo.presellStock === 0
                      ? rowInfo.presellStock
                      : ''
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        )
      });
    }

    // columns = columns.push({
    //   title: '二维码',
    //   key: 'goodsInfoQrcode',
    //   className: 'goodsInfoQrcode',
    //   render: (rowInfo) => {
    //     const qrcodeImages = fromJS(
    //       rowInfo.qrcodeImages ? rowInfo.qrcodeImages : []
    //     );
    //     return (
    //       <Col span={12}>
    //         <FormItem style={styles.tableFormItem}>
    //           {getFieldDecorator('goodsInfoQrcode_' + rowInfo.id, {
    //             rules: []
    //           })(
    //             <QrcodeLibraryUpload
    //               qrcodeImages={qrcodeImages}
    //               modalVisible={modalVisible}
    //               clickImg={clickImg}
    //               removeQrImg={removeQrImg}
    //               imgCount={1}
    //               imgType={-1000}
    //               skuId={rowInfo.id}
    //             />
    //           )}
    //         </FormItem>
    //       </Col>
    //     );
    //   }
    // });

    columns = columns.push({
      title: '操作',
      key: 'opt',
      render: (rowInfo) => (
        <div>
          {specSingleFlag ? null : (
            <Button onClick={() => this._deleteGoodsInfo(rowInfo.id)}>
              删除
            </Button>
          )}

          <a
            onClick={() =>
              syncErpStock(rowInfo.erpGoodsInfoNo, rowInfo.goodsInfoId)
            }
          >
            库存同步
          </a>
        </div>
      )
    });

    return columns.toJS();
  };

  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小必须小于2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }
    editGoodsItem(id, key, e);

    if (key == 'stock' || key == 'marketPrice') {
      // 是否同步库存
      if (checked) {
        // 修改store中的库存或门店价
        synchValue(key);
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步库存/门店价
        let values = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          if (field.indexOf(`${key}_`) === 0) {
            values[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(values);
      }
    }
  };

  /**
   * 修改商品库存
   */
  _editGoodsStockWare = (
    id: string,
    storeWareId: number,
    key: string,
    e: any
  ) => {
    const { editGoodsStock } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    editGoodsStock(id, storeWareId, key, e);
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (
          file.status == 'done' &&
          file.response != null &&
          file.response.message != null
        ) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter(
          (file) =>
            file.status == 'done' &&
            file.response != null &&
            file.response.message == null
        );
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };

  /**
   * 同步库存
   */
  _synchValue = async (e, key) => {
    const { updateChecked, goodsList } = this.props.relaxProps;
    await updateChecked(key, e.target.checked);
    const goodsInfo = goodsList.get(0);
    if (goodsInfo) {
      this._editGoodsItem(goodsInfo.get('id'), key, goodsInfo.get(key));
    }
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
  tableFormItem: {
    marginBottom: '0px'
  },
  wareStock: {
    width: '80px'
  },
  syncStock: {
    backgroundColor: '#F56C1D',
    borderColor: '#fff',
    textDecorationColor: '#FFF'
  }
};
