import React, { FC, useEffect, useState } from 'react';
import './img-pre.less';
import RcViewer from '@hanyk/rc-viewer';

const ImgPreview: FC<{
  visible: boolean;
  imgList: Array<any>;
  close: Function;
  showTitlte?: boolean
}> = (props) => {
  const { visible, imgList, close, showTitlte = true } = props;
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (visible) {
      preview.viewer.show();
    }
  }, [visible]);
  const options = {
    // 是否显示标题
    title: showTitlte,
    // 是否显示下面工具栏 1 显示 0 隐藏
    toolbar: 1,
    // 关闭时的回调
    hide() {
      close();
    }
  };
  return (
    <RcViewer
      style={{ display: 'none' }}
      ref={(v) => {
        setPreview(v);
      }}
      options={options}
    >
      {imgList &&
        imgList.map((item, index) => {
          return <img src={item} key={item} alt="" />;
        })}
    </RcViewer>
  );
};

export default ImgPreview;
