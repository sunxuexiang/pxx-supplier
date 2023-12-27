import * as React from 'react';
import {
  Form,
  DatePicker,
  message,
  Row,
  Col,
  Button,
  Icon,
  Select,
  Input,
  Popover
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history, QMUpload, QMMethod, Tips } from 'qmkit';
import GoodsList from './goods-list';
import GoodsModal from './select-goods-modal/goods-modal';
const img01 = require('../../images/share.png');
const img02 = require('../../images/background.png');

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const GreyText = styled.span`
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
`;

export default class LiveInfo extends React.Component<any, any> {
  _store: Store;
  form;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    console.log(this._store);
    let cardImg = this._store.state().get('cardImg');
    let background = this._store.state().get('background');
    console.log(cardImg, background);
    this.state = {
      cardImg: cardImg, //分享卡片封面
      background: background, //直播间背景墙
      //用于图片展示
      cardImgShow:
        cardImg && cardImg
          ? [
              {
                uid: 'store-sign-1',
                name: cardImg,
                size: 1,
                status: 'done',
                url: cardImg
              }
            ]
          : [],
      backgroundShow:
        background && background
          ? [
              {
                uid: 'store-sign-1',
                name: background,
                size: 1,
                status: 'done',
                url: background
              }
            ]
          : [],
      goodsModal: {
        _modalVisible: false
      }, //模态框开关
      startTime: '', // 开始时间
      endTime: '', //结束时间
      goodsInfoList: []
    };
  }

  render() {
    const { cardImgShow, backgroundShow, goodsModal, startTime, endTime } =
      this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const store = this._store as any;
    let state = store.state();
    //提示图片
    const tipsImg01 = (
      <div style={{ width: 160, height: 160 }}>
        <img src={img01} alt="" style={{ width: 160, height: 160 }} />
      </div>
    );
    const tipsImg02 = (
      <div style={{ width: 160, height: 340 }}>
        <img src={img02} alt="" style={{ width: 160, height: 340 }} />
      </div>
    );

    return (
      <div>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="直播标题" required>
            {getFieldDecorator('title', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '直播标题',
                      3,
                      17
                    );
                    QMMethod.validatorEmoji(rule, value, callback, '直播标题');
                  }
                }
              ],
              initialValue: ''
            })(
              <Col span={6}>
                <Input placeholder="仅限3-17个字符" />
              </Col>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{ margin: 0 }}
            label="开播时间"
            required
          >
            {getFieldDecorator('time', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    const nowMoment = moment(new Date()).subtract(1, 'minute');
                    if (!value) {
                      callback('开播时间不能为空');
                    } else if (
                      nowMoment.add(10, 'minutes').unix() > value[0].unix()
                    ) {
                      callback('开播时间至少10分钟后');
                    } else if (value[1].diff(value[0], 'hours') >= 12) {
                      callback('开播起止时间范围必须在12小时内');
                    } else if (
                      value[0].diff(moment(new Date()), 'months') >= 6
                    ) {
                      callback('开始时间不能在6个月后');
                    } else if (value[1].diff(value[0], 'minutes') < 30) {
                      callback('开播时间和结束时间间隔不得短于30分钟');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                this.setState({
                  startTime: dateString[0],
                  endTime: dateString[1]
                });
              },
              initialValue: startTime && endTime && [startTime, endTime]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['起始时间', '结束时间']}
                showTime={{ format: 'HH:mm' }}
                disabledDate={(current) => {
                  return current && current.isBefore(moment().startOf('day'));
                }}
              />
            )}
          </FormItem>
          <Col style={{ marginBottom: 24 }}>
            <GreyText>
              <Col span={3} />
              由于审核需要时间，建议提前1天创建，开播时间范围必须在12小时内；
            </GreyText>
            <br />
            <GreyText>
              <Col span={3} />
              开播时间段仅供参考，不是实际直播间可以开播的时间。直播间在开始时间前也可以开播，并且到结束时间后不会强制结束。若到结束时间仍未开播，则直播间无法再开播；
            </GreyText>
          </Col>

          <FormItem {...formItemLayout} label="主播昵称" required>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorAnchorNick(
                      rule,
                      value,
                      callback,
                      '主播昵称'
                    );
                  }
                }
              ],
              initialValue: ''
            })(
              <Col span={6}>
                <Input placeholder="仅限2-15个汉字" />
              </Col>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="主播微信号" required>
            {getFieldDecorator('weChart', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '主播微信号',
                      1,
                      30
                    );
                  }
                }
              ],
              initialValue: ''
            })(
              <Col span={6}>
                <Input placeholder="用作核实主播身份，不会展示给观众" />
              </Col>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="分享卡片封面" required>
            <div className="clearfix cardImg">
              <Col span={2}>
                {getFieldDecorator('card', {
                  rules: [
                    {
                      required: true,
                      message: '请添加分享卡片封面'
                    }
                  ],
                  initialValue: cardImgShow
                })(
                  <QMUpload
                    style={styles.box}
                    name="uploadFile"
                    fileList={cardImgShow}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={({ file, fileList }) =>
                      this._editImages({ file, fileList }, 'cardImg')
                    }
                    beforeUpload={this._checkUploadFile.bind(this, 1)}
                  >
                    {cardImgShow.length < 1 ? (
                      <Icon type="plus" style={styles.plus} />
                    ) : null}
                  </QMUpload>
                )}
              </Col>
              <Popover
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                content={tipsImg01}
                placement="right"
              >
                <Icon
                  type="question-circle-o"
                  style={{ marginLeft: 10, color: '#FF6600' }}
                />
              </Popover>
            </div>
            <GreyText>建议尺寸800*640px，大小不超过1M</GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="直播间背景墙" required>
            <div className="clearfix background">
              <Col span={2}>
                {getFieldDecorator('background', {
                  rules: [
                    {
                      required: true,
                      message: '请添加直播间背景墙'
                    }
                  ],
                  initialValue: backgroundShow
                })(
                  <QMUpload
                    style={styles.box}
                    name="uploadFile"
                    fileList={backgroundShow}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={({ file, fileList }) =>
                      this._editImages({ file, fileList }, 'background')
                    }
                    beforeUpload={this._checkUploadFile.bind(this, 2)}
                  >
                    {backgroundShow.length < 1 ? (
                      <Icon type="plus" style={styles.plus} />
                    ) : null}
                  </QMUpload>
                )}
              </Col>

              <Popover
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                content={tipsImg02}
                placement="right"
              >
                <Icon
                  type="question-circle-o"
                  style={{ marginLeft: 10, color: '#FF6600' }}
                />
              </Popover>
            </div>
            <GreyText>建议尺寸1080*1920px，大小不超过2M</GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="商品">
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
                goodsRows={state.get('goodsRows').toJS()}
                deleteSelectedSku={(skuId) => store.deleteSelectedSku(skuId)}
                goodsInfoList={this.state.goodsInfoList}
              />
            </Col>
          </Row>
          <GoodsModal
            visible={goodsModal._modalVisible}
            onCancelBackFun={this.closeGoodsModal}
            showValidGood={true}
            selectedSkuIds={state.get('chooseSkuIds').toJS()}
            selectedRows={state.get('goodsRows').toJS()}
            onOkBackFun={this._onOkBackFun}
            skuLimit={200}
          />
        </Form>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => this._onSave()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button
            onClick={() => history.push(`/live-room/${0}`)}
            style={{ marginLeft: 10 }}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    this.setState({
      goodsModal: {
        _modalVisible: true
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
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    this.props.form.validateFields(null, (errs, values) => {
      if (!errs) {
        store.handleSave(values);
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }, type) => {
    this.setState({ [type + 'Show']: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ [type]: '' });
      this.props.form.setFieldsValue({ [type]: this.state[type] });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ [type]: fileList[0].url });
      this.props.form.setFieldsValue({ [type]: this.state[type] });
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
   * 检查文件格式
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
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows, goodsInfoList) => {
    const store = this._store as any;
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    // this.props.form.validateFields((_errs) => {});
    this.setState({ goodsInfoList: goodsInfoList });
    this.closeGoodsModal();
    store.onOkBackFun(skuIds, rows);
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
