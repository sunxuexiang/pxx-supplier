import React from 'react';
import videojs from 'video.js';

import './css/style.css';

/**
 * 公共video组件
 */
export default class WMVideo extends React.Component<any, any> {
  player: any;
  videoNode: any;

  // static defaultProps = {
  //   //选中值
  //   checked: 0,
  //   //样式
  //   style: {},
  //   //选项数据
  //   data: [],
  //   //按钮在文本前
  //   beforeTxt: false,
  // }

  componentDidMount() {
    // 实例化 Video.js
    this.player = videojs(
      this.videoNode,
      this.props,
      function onPlayerReady() {}
    );
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div className="wm-video-js">
        <div className="videoBox">
          <div data-vjs-player>
            <video
              ref={(node) => (this.videoNode = node)}
              className="video-js vjs-big-play-centered vjs-paused"
            />
          </div>
        </div>
      </div>
    );
  }
}
