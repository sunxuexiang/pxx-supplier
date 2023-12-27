import React from 'react';

import 'video.js/dist/video-js.css';
import { WMVideo } from 'qmkit';

export default class VideoDetail extends React.Component<any, any> {
  render() {
    const videoUrl = this.props.location.search.split('?videoUrl=')[1];
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: videoUrl,
          type: 'video/mp4'
        }
      ]
    };

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <WMVideo {...videoJsOptions} />
      </div>
    );
  }
}
