import React, { Component } from 'react';
import { Button } from 'antd';

export default class Header extends Component<any, any> {
  props: {
    // 首条开始信息
    preTxt?: string;
    // 首条尾部信息
    postTxt?: string;
    // 底部文字
    text?: string;
    // 蓝色
    errTxt?: string;
    // 底部蓝色
    bottomErrTxt?: string;
    // 按钮是否展示
    btnShow?: boolean;
    // 按钮文本
    btnTxt?: string;
    //按钮事件
    btnClick?: Function;
  };

  render() {
    const {
      postTxt = '',
      preTxt = '',
      text = '',
      errTxt = '',
      bottomErrTxt = '',
      btnShow = false,
      btnTxt = '确定',
      btnClick
    } = this.props;
    return (
      <div>
        <div className="shopHeader">
          <div>
            <div>
              {preTxt}
              {errTxt && <span>{errTxt}</span>} {postTxt}
            </div>
            {text && (
              <div>
                {text}
                {bottomErrTxt && <span>{bottomErrTxt}</span>}
              </div>
            )}
          </div>
          {btnShow && (
            <Button type="primary" onClick={() => btnClick()}>
              {btnTxt}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
