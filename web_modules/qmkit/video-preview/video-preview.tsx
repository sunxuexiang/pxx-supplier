import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import 'video.js/dist/video-js.css';

const VideoPreview = (props) => {
  // 视频地址
  const [videoUrl, setVideoUrl] = useState('');
  const videoPlayer = useRef(null);

  useEffect(() => {
    if (props.showPreview) {
      setVideoUrl(props.videoUrl);
      videoPlayer.current.src = videoUrl;
    }
  }, [props.showPreview]);

  return (
    <Modal
      title="视频预览"
      width={880}
      visible={props.showPreview}
      forceRender
      footer={false}
      onCancel={() => {
        setVideoUrl('');
        props.hidePreview();
      }}
    >
      <video
        style={{
          width: '100%',
          height: 500
        }}
        ref={videoPlayer}
        controls
        src={videoUrl}
      ></video>
    </Modal>
  );
};

export default VideoPreview;
