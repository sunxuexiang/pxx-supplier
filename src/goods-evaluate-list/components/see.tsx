import * as React from 'react';
import { Modal, Input } from 'antd';
import { Relax, IMap } from 'plume2';
import { noop } from 'qmkit';
import moment from 'moment';
import { message } from 'antd';
import GoodsImage from '../../goods-detail/components/image';
const defaultImg = require('../img/none.png');

const { TextArea } = Input;

@Relax
export default class See extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      modal: Function;
      arrowVisible: boolean;
      arrow: Function;
      goodsEvaluate: IMap;
      onFormFieldChange: Function;
      goodsEditEvaluate: IMap;
      saveAnswer: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    arrowVisible: 'arrowVisible',
    // 关闭弹窗
    modal: noop,
    arrow: noop,
    goodsEvaluate: 'goodsEvaluate',
    onFormFieldChange: noop,
    goodsEditEvaluate: 'goodsEditEvaluate',
    saveAnswer: noop
  };

  render() {
    const {
      modalVisible,
      arrowVisible,
      goodsEvaluate,
      onFormFieldChange
    } = this.props.relaxProps as any;
    if (!modalVisible) {
      return null;
    }
    const goodsImg = goodsEvaluate.goodsImg;
    return (
      <Modal  maskClosable={false}
        title={'评论详情'}
         
        visible={modalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        onOk={
          goodsEvaluate.evaluateAnswer
            ? this._handleModelCancel
            : this._handleSubmit
        }
      >
        <div className="comment-Detail-box">
          <div className="left-container">
            <div className="product">
              {goodsImg ? (
                <img className="img" src={goodsImg} />
              ) : (
                <img src={defaultImg} className="img" />
              )}
            </div>
          </div>
          <div className="right-container">
            <label className="title">{goodsEvaluate.goodsInfoName}</label>
            {goodsEvaluate.isEdit == 1 ? (
              <div className="compuctor-detail">
                <img
                  className={arrowVisible ? 'up-arrow' : 'down-arrow'}
                  src={require('../img/down-arrow.png')}
                  onClick={this._clickArrow}
                />
                <label className="title mar-top-12">修改前</label>
                {arrowVisible && (
                  <div>
                    <div className="detail">
                      <span className="evaluate">评价</span>
                      <span className="text">
                        发表人：{goodsEvaluate.customerName}
                      </span>
                      <span className="text mar-lr">
                        时间：{goodsEvaluate.historyEvaluateTime}
                      </span>
                      <span className="text">
                        {goodsEvaluate.historyEvaluateScore}星
                      </span>
                    </div>
                    <div className="compuctor-content">
                      内容：{goodsEvaluate.historyEvaluateContent}
                    </div>
                    <div className="compuctor-content">
                      回复：{goodsEvaluate.historyEvaluateAnswer}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            {goodsEvaluate.evaluateAnswer ? (
              <div className="compuctor-detail border-b">
                <div className="detail">
                  <span className="evaluate">评价</span>
                  <span className="text">
                    发表人：{goodsEvaluate.customerName}
                  </span>
                  <span className="text mar-lr">
                    时间：{moment(goodsEvaluate.evaluateTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </span>
                  <span className="text">{goodsEvaluate.evaluateScore}星</span>
                </div>
                <div className="compuctor-content">
                  内容：{goodsEvaluate.evaluateContent}
                </div>
                {goodsEvaluate.evaluateAnswer ? (
                  <div className="compuctor-content">
                    回复：{goodsEvaluate.evaluateAnswer}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="compuctor-detail border-b">
                <div className="detail">
                  <span className="evaluate">评价</span>
                  <span className="text">
                    发表人：{goodsEvaluate.customerName}
                  </span>
                  <span className="text mar-lr">
                    时间：{moment(goodsEvaluate.evaluateTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </span>
                  <span className="text">{goodsEvaluate.evaluateScore}星</span>
                </div>
                <div className="compuctor-content">
                  内容：{goodsEvaluate.evaluateContent}
                </div>
                <div className="detail">
                  <span className="evaluate">回复</span>
                  {/*<div className="reply-text">回复</div>*/}
                </div>
                <div className="compuctor-content">
                  <TextArea
                    rows={4}
                    placeholder="最多可输入500个字"
                    maxLength={500}
                    defaultValue=""
                    onChange={(e) =>
                      onFormFieldChange('evaluateAnswer', e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {goodsEvaluate.evaluateImageList &&
            goodsEvaluate.evaluateImageList.length ? (
              <div className="compuctor-detail mar-top-22">
                {
                  <ul className="drying-list">
                    <li className="dry-name">晒单</li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map(
                        (v, k) =>
                          k < 5 ? (
                            <div key={k}>
                              <GoodsImage url={v.artworkUrl} />
                            </div>
                          ) : null
                      )}
                    </li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map(
                        (v, k) =>
                          k >= 5 ? (
                            <div key={k}>
                              <GoodsImage url={v.artworkUrl} />
                            </div>
                          ) : null
                      )}
                    </li>
                  </ul>
                }
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { saveAnswer, goodsEditEvaluate } = this.props.relaxProps;
    if (
      !goodsEditEvaluate.get('evaluateAnswer') ||
      !goodsEditEvaluate.get('evaluateAnswer').trim()
    ) {
      message.error('请输入评价回复！');
      return;
    }
    saveAnswer(
      goodsEditEvaluate.get('evaluateId'),
      goodsEditEvaluate.get('evaluateAnswer'),
      goodsEditEvaluate.get('isShow')
    );
  };

  _clickArrow = () => {
    const { arrowVisible, arrow } = this.props.relaxProps;
    arrow(!arrowVisible);
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal(false);
  };
}
