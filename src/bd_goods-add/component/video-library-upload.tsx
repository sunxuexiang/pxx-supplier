import React, { Component } from 'react';

import 'video.js/dist/video-js.css';
import { Icon } from 'antd';
import { IMap } from 'typings/globalType';
const defaultImg = require('../image/video.png');

export default class VideoLibraryUpload extends Component<any, any> {
  props: {
    video: IMap;
    imgType: number;
    skuId: string;
    modalVisible: Function;
    removeVideo: Function;
  };
  render() {
    const { video, modalVisible, removeVideo } = this.props;
    return video &&
      JSON.stringify(video) !== '{}' &&
      video.get('artworkUrl') ? (
      <div key={video.get('resourceId')}>
        <div className="ant-upload-list ant-upload-list-picture-card">
          <div className="ant-upload-list-item ant-upload-list-item-done">
            <div className="ant-upload-list-item-info">
              <span>
                <a
                  className="ant-upload-list-item-thumbnail"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={defaultImg} />
                </a>
              </span>
            </div>
            <span className="ant-upload-list-item-actions">
              <i
                className="anticon anticon-eye-o"
                onClick={() => this._videoDetail(video.get('artworkUrl'))}
              >
                <Icon type="eye" />
              </i>
              <i
                title="Remove file"
                onClick={() => removeVideo()}
                className="anticon anticon-delete"
              >
                <Icon type="delete" />
              </i>
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div
          onClick={() => {
            modalVisible(1, 3, '');
          }}
          style={styles.addImg}
        >
          <div style={styles.imgBox}>
            <Icon type="plus" style={styles.plus} />
          </div>
        </div>
      </div>
    );
  }

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };
}

const styles = {
  plus: {
    color: '#999',
    fontSize: '28px'
  } as any,
  addImg: {
    border: '1px dashed #d9d9d9',
    width: 96,
    height: 96,
    borderRadius: 4,
    textAlign: 'center',
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fbfbfb'
  } as any,
  imgBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '32px 0'
  } as any
};
