import React from 'react';
import { Button } from 'antd';
import { noop } from 'qmkit';

interface State {
  checkCode: string;
  sendButtonText: string;
  showSendButton: boolean;
  time: number;
}

/**
 * 倒计时按钮
 */
export default class TimerButton extends React.Component<any, any> {
  timer: any;
  state: State;

  static defaultProps = {
    /*自定义按钮样式*/
    style: {},
    /*按钮press的回调*/
    disabled: false,
    time: 60,
    sendText: '获取短信验证码', // 发送按钮文本
    reSendText: '重新发送', // 发送按钮文本
    onPress: noop,
    // 倒计时前校验方法，返回false时不执行点击方法
    shouldStartCountDown: false,
    // click方法如果是结果是Promise，catch异常情况是否重置Timer
    resetWhenError: true
  };

  constructor(props) {
    super(props);
    this.state = {
      checkCode: '', // 验证码
      sendButtonText: props.sendText, // 发送按钮文本
      showSendButton: props.disabled, // 是否可以点击发送按钮
      time: props.time // 两次获取验证码间隔时间
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer); // 清除定时器, 防止内存泄露;
  }

  render() {
    return (
      <Button
        style={this.props.style}
        type="primary"
        disabled={this.state.showSendButton}
        onClick={() => this._onPress()}
      >
        {this.state.sendButtonText}
      </Button>
    );
  }

  _onPress() {
    if (!this.state.showSendButton) {
      if (
        this.props.shouldStartCountDown &&
        this.props.shouldStartCountDown() === false
      ) {
        return;
      }

      this.setState({
        showSendButton: true
      });
      const pressResult = this.props.onPress();
      if (pressResult instanceof Promise) {
        pressResult.catch((_error) => {
          // 异常情况是否重置按钮
          if (this.props.resetWhenError) {
            this._enableBtn();
          }
        });
      }
      this._timer();
    }
  }

  /**
   * 倒计时
   */
  _timer = () => {
    this.timer = setInterval(() => {
      if (this.state.time == 0) {
        this._enableBtn();
        return;
      }

      this._disableBtn();
    }, 1000);
  };

  _enableBtn() {
    this.setState({
      showSendButton: false,
      sendButtonText: this.props.reSendText,
      time: this.props.time
    });

    clearInterval(this.timer);
  }

  _disableBtn() {
    const sendButtonText = this.props.reSendText + '(' + this.state.time + ')';
    this.setState({
      showSendButton: true,
      sendButtonText: sendButtonText,
      time: --this.state.time
    });
  }
}
