import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Carousel } from 'antd';
import { IList } from 'typings/globalType';

const banner = [
  {
    url: require('../img/banner1.png')
  },
  {
    url: require('../img/banner2.png')
  }
];

/**
 * 登录页banner
 */
@Relax
export default class Banner extends Component<any, any> {
  props: {
    relaxProps?: {
      businessBanner: IList;
      businessCustom: string;
    };
  };

  static relaxProps = {
    businessBanner: 'businessBanner',
    businessCustom: 'businessCustom'
  };

  render() {
    const { businessBanner, businessCustom } = this.props.relaxProps;
    //banner图片路径集合
    const urls = (businessBanner && businessBanner.toJS()) || [];
    return (
      <div>
        {urls.length > 0 ? (
          <div>
            <Carousel autoplay>
              {urls.map((url, i) => (
                <div key={i}>
                  <div
                    className="main-banner"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div>
            <Carousel autoplay>
              {banner.map((v, k) => (
                <div key={k}>
                  <div
                    className="main-banner"
                    style={{ backgroundImage: `url(${v.url})` }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}
        <div
          className="supplier-agreement"
          dangerouslySetInnerHTML={{ __html: businessCustom }}
        />
      </div>
    );
  }
}
