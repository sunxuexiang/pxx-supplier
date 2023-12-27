import React from 'react';
import { Col, Form, Radio, Row, Tabs } from 'antd';
import { Relax } from 'plume2';
import { DataGrid } from 'qmkit';

import { IList, IMap } from 'typings/globalType';

import GoodsImage from './image';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Column } = DataGrid;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const TabPane = Tabs.TabPane;
const defaultImg = require('../image/video.png');
@Relax
export default class BasicInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goods: IMap;
      cateList: IList;
      sourceCateList: IList;
      storeCateList: IList;
      sourceStoreCateList: IList;
      brandList: IList;
      goodsSpecs: IList;
      goodsList: IList;
      images: IList;
      maxCount: number;
      specSingleFlag: boolean;
      goodsTabs: IList;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    // 签约平台类目信息
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // 店铺分类信息
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    // 品牌信息
    brandList: 'brandList',
    // 规格列表
    goodsSpecs: 'goodsSpecs',
    // sku列表
    goodsList: 'goodsList',
    // 商品图片
    images: 'images',
    maxCount: 'maxCount',
    specSingleFlag: 'specSingleFlag',
    goodsTabs: 'goodsTabs'
  };

  render() {
    const {
      goods,
      images,
      goodsSpecs,
      goodsList,
      specSingleFlag,
      goodsTabs
    } = this.props.relaxProps;

    return (
      <div>
        <div style={{ marginTop: 20 }}>
          <h3>基本信息</h3>
          <Form style={{ marginTop: 20 }}>
            <Row type="flex" justify="start">
              <Col span={10}>
                <FormItem {...formItemLayout} label="商品名称" required={true}>
                  <div>{goods.get('goodsName') || '-'}</div>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="SPU编码" required={true}>
                  <div>{goods.get('goodsNo') || '-'}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="平台类目" required={true}>
                  <div>{this._getCateName() || '-'}</div>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="店铺分类" required={true}>
                  <div>{this._getStoreCateName() || '-'}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="品牌">
                  <div>{this._getBrandName() || '-'}</div>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="计量单位" required={true}>
                  <div>{goods.get('goodsUnit') || '-'}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="商品副标题">
                  <div>{goods.get('goodsSubtitle') || '-'}</div>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="划线价">
                  <div>{goods.get('linePrice') || '-'}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="上下架" required={true}>
                  <RadioGroup value={goods.get('addedFlag')} disabled>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                    <Radio value={2}>部分上架</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="销售类型" required={true}>
                  <RadioGroup value={goods.get('saleType')} disabled>
                    <Radio value={0}>批发</Radio>
                    <Radio value={1}>零售</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="商品图片">
                  <div className="smallPic">
                    {images && images.count() > 0
                      ? images.toJS().map((image) => {
                          return (
                            <GoodsImage
                              key={image.imageId}
                              url={image.artworkUrl}
                            />
                          );
                        })
                      : '-'}
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="商品视频">
                  <div>
                    {goods.get('goodsVideo') ? (
                      <a
                        href="javascript:void(0)"
                        onClick={() =>
                          this._videoDetail(goods.get('goodsVideo'))
                        }
                      >
                        <img src={defaultImg} />
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 20 }}>规格信息</h3>
          <DataGrid
            dataSource={goodsList.toJS()}
            pagination={false}
            rowKey={'goodsInfoId'}
          >
            <Column
              title="图片"
              dataIndex="goodsInfoImg"
              key="goodsInfoImg"
              render={(url) => {
                return (
                  <div className="smallCenter">
                    <GoodsImage url={url} />
                  </div>
                );
              }}
            />
            {!specSingleFlag &&
              goodsSpecs
                .map((item) => {
                  return (
                    <Column
                      title={item.get('specName')}
                      dataIndex={'specId-' + item.get('specId')}
                      key={item.get('specId')}
                    />
                  );
                })
                .toList()}
            <Column title="SKU编码" dataIndex="goodsInfoNo" key="goodsInfoNo" />
            <Column
              title="门店价"
              dataIndex="marketPrice"
              key="marketPrice"
              render={(markeetPrice) => {
                return markeetPrice == null ? 0.0 : markeetPrice.toFixed(2);
              }}
            />
            <Column title="库存" dataIndex="stock" key="stock" />
            <Column
              align="center"
              title="条形码"
              dataIndex="goodsInfoBarcode"
              key="goodsInfoBarcode"
              render={(goodsInfoBarcode) =>
                goodsInfoBarcode ? goodsInfoBarcode : '-'
              }
            />
          </DataGrid>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>物流信息</h3>
          <Form style={{ marginTop: 20 }}>
            <Row type="flex" justify="start">
              <Col span={8}>
                <FormItem {...formItemLayout} label="运费模板" required={true}>
                  <div>{goods.get('freightTempName') || '-'}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="物流重量" required={true}>
                  <div>{`${goods.get('goodsWeight')}kg`}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="物流体积" required={true}>
                  <div>{`${goods.get('goodsCubage')}m³`}</div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={{ marginTop: 20 }}>
          {/* <h3 style={{ marginBottom: 20 }}>图文详情</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: goods.get('goodsDetail') || '未设置图文详情'
            }}
          /> */}
          <Tabs defaultActiveKey="0">
            <TabPane tab="图文详情" key="0">
              <div
                dangerouslySetInnerHTML={{
                  __html: goods.get('goodsDetail') || '未设置图文详情'
                }}
              />
            </TabPane>
            {goodsTabs &&
              goodsTabs.map((val, index) => {
                return (
                  <TabPane tab={val.tabName} key={index + 1}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: val.tabDetail
                      }}
                    />
                  </TabPane>
                );
              })}
          </Tabs>
        </div>
      </div>
    );
  }

  /**
   * 获取平台分类的名称用于展示
   * @returns {string}
   * @private
   */
  _getCateName = () => {
    const { goods, sourceCateList } = this.props.relaxProps;
    const cateId = goods.get('cateId');

    if (cateId) {
      const nameArray = this.__digCateName(cateId, sourceCateList);
      return nameArray.reverse().join(' > ');
    }

    return '';
  };

  /**
   * 递归查找平台分类的名字
   * @param cateId
   * @param cateList
   * @param {string[]} nameArray
   * @returns {any}
   * @private
   */
  __digCateName = (cateId, cateList, nameArray?: string[]) => {
    let names = nameArray || [];

    const cate = cateList.find((cate) => cate.get('cateId') == cateId);
    if (cate) {
      names.push(cate.get('cateName'));

      const cateParentId = cate.get('cateParentId');

      if (cateParentId) {
        return this.__digCateName(cateParentId, cateList, names);
      }
    }

    return names;
  };

  /**
   * 获取店铺分类的名称用于展示
   * @returns {string}
   * @private
   */
  _getStoreCateName = () => {
    const { goods, sourceStoreCateList } = this.props.relaxProps;
    const storeCateIds = goods.get('storeCateIds');

    if (storeCateIds) {
      const nameArray = this.__digStoreCateName(
        storeCateIds,
        sourceStoreCateList
      );
      return nameArray.join('，');
    }

    return '';
  };

  /**
   * 查找店铺分类的名字
   * @param storeCateIds
   * @param storeCateList
   * @returns {any}
   * @private
   */
  __digStoreCateName = (storeCateIds, storeCateList) => {
    return storeCateList
      .filter((cate) =>
        storeCateIds.find((id) => id == cate.get('storeCateId'))
      )
      .map((cate) => cate.get('cateName'))
      .toJS();
  };

  /**
   * 获取品牌的名称用于展示
   * @returns {string}
   * @private
   */
  _getBrandName = () => {
    const { goods, brandList } = this.props.relaxProps;
    const brandId = goods.get('brandId');

    if (brandId) {
      const brand = brandList.find((brand) => brand.get('brandId') == brandId);
      return brand ? brand.get('brandName') : '';
    }

    return '';
  };

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };
}
