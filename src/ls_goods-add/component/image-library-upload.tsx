import React, { Component } from 'react';
import { DraggableArea } from 'react-draggable-tags';

import { List } from 'immutable';
import { Icon } from 'antd';

export default class ImageLibraryUpload extends Component<any, any> {
  props: {
    images: List<any>;
    imgCount: number;
    imgType: number;
    skuId: string;

    modalVisible: Function;
    clickImg: Function;
    editImages: Function;
    removeImg: Function;
  };

  render() {
    const {
      images,
      modalVisible,
      clickImg,
      removeImg,
      editImages,
      imgCount,
      imgType,
      skuId
    } = this.props;
    const imageslist = images.toJS().map((item, index) => {
      item.id = index + 1;
      return item;
    });
    return (
      <div>
        <DraggableArea
          tags={imageslist}
          render={({ tag, index }) => <div>{this.imgRender(tag)}</div>}
          onChange={(tags) => editImages(tags)}
        />
        {images.count() < imgCount ? (
          <div
            onClick={() => modalVisible(imgCount, imgType, skuId)}
            style={styles.addImg}
          >
            <div style={styles.imgBox}>
              <Icon type="plus" style={styles.plus} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
  imgRender(tag) {
    const { clickImg, removeImg, skuId } = this.props;
    return (
      <div key={tag.resourceId}>
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
                  <img src={tag.artworkUrl || tag.url} alt={tag.resourceName} />
                </a>
              </span>
            </div>
            <span className="ant-upload-list-item-actions">
              <i
                className="anticon anticon-eye-o"
                onClick={() => clickImg(tag.artworkUrl || tag.url)}
              >
                <Icon type="eye" />
              </i>
              <i
                title="Remove file"
                onClick={() =>
                  removeImg({
                    type: skuId ? 1 : 0,
                    id: skuId ? skuId : tag.uid
                  })
                }
                className="anticon anticon-delete"
              >
                <Icon type="delete" />
              </i>
            </span>
          </div>
        </div>
      </div>
    );
  }
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
