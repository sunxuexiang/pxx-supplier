import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Radio,
  TreeSelect,
  InputNumber,
  message,
  Tree,
  Icon
} from 'antd';
import '../add-product.less';
import moment from 'moment';
import {
  getCateList,
  getBrandList,
  // getGoodsUnit,
  getStoreCate
} from '../webapi';
import {
  Const,
  PhotoGallery,
  Tips,
  VideoLibrary,
  ImgPreview,
  VideoPreview
} from 'qmkit';

const BaseInfo = forwardRef((props: any, ref) => {
  // 已选择图片列表
  const [imageList, setImages] = useState([] as any);
  // 平台类目
  const [allCateList, setCateList] = useState([] as any);
  // 商品品牌
  const [brandList, setBrandList] = useState([]);
  // 计量单位
  const [goodsUnitData, setGoodsUnitData] = useState([]);
  // 商品分类
  const [goodsCateData, setGoodsCateData] = useState([]);
  // 图片库显示
  const [imageModalShow, setImageModalShow] = useState(false);
  // 视频库显示
  const [videoModalShow, setVideoModalShow] = useState(false);
  // 图片预览显示
  const [openPreview, setOpenPreview] = useState(false);
  // 预览图片数据
  const [imgPreviewList, setPreviewList] = useState([]);
  // 预览视频显示
  const [showVideoPre, setShowVideoPre] = useState(false);
  useImperativeHandle(ref, () => ({
    baseInfoSubmit
  }));
  const { getFieldDecorator } = props.form;
  useEffect(() => {
    getCateData();
    getBrandData();
    // getGoodsUnitData();
    getStoreCateData();
  }, []);
  useEffect(() => {
    if (props.openEdit) {
      setImages([...props.goodsDetail.images]);
      props.form.setFieldsValue({
        goodsVideo: props.goodsDetail.goods.goodsVideo,
        images: props.goodsDetail.images
      });
    }
  }, [props.goodsDetail]);
  // 获取平台类目
  const getCateData = () => {
    getCateList()
      .then((res) => {
        if (res.res.code !== Const.SUCCESS_CODE) {
          message.error('获取商品类目列表失败');
          return;
        }
        console.warn(res, '商品类目');
        // 改变数据形态，变为层级结构
        const dataList = res.res.context;
        const newDataList = dataList
          .filter((item) => item.cateParentId === 0)
          .map((data) => {
            const children = dataList
              .filter((item) => item.cateParentId === data.cateId)
              .map((childrenData) => {
                const lastChildren = dataList.filter(
                  (item) => item.cateParentId === childrenData.cateId
                );
                if (lastChildren.length) {
                  childrenData['children'] = lastChildren;
                }
                return childrenData;
              });

            if (children.length) {
              data['children'] = children;
            }
            return data;
          });
        setCateList(newDataList);
      })
      .catch((err) => {
        message.error('获取商品类目列表失败');
      });
  };
  //处理分类的树形图结构数据
  const renderTree = (cateList) => {
    return cateList.map((item) => {
      if (item.children && item.children.length) {
        // 一二级类目不允许选择
        return (
          <TreeSelect.TreeNode
            key={item.cateId}
            disabled={true}
            value={item.cateId}
            title={item.cateName}
          >
            {renderTree(item.children)}
          </TreeSelect.TreeNode>
        );
      } else {
        return (
          <TreeSelect.TreeNode
            key={item.cateId}
            value={item.cateId}
            title={item.cateName}
          ></TreeSelect.TreeNode>
        );
      }
    });
  };
  // 商品品牌
  const getBrandData = () => {
    getBrandList()
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取商品品牌列表失败');
          return;
        }
        console.warn(data, '商品品牌');
        setBrandList(data.res.context);
      })
      .catch((err) => {
        message.error('获取商品品牌列表失败');
      });
  };
  // 计量单位
  // const getGoodsUnitData = () => {
  //   getGoodsUnit()
  //     .then((data) => {
  //       if (data.res.code !== Const.SUCCESS_CODE) {
  //         message.error('获取计量单位列表失败');
  //         return;
  //       }
  //       console.warn(data, '计量单位');
  //       setGoodsUnitData(data.res.context.goodsUnitVos);
  //     })
  //     .catch((err) => {
  //       message.error('获取计量单位列表失败');
  //     });
  // };
  // 商品分类
  const getStoreCateData = () => {
    getStoreCate()
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取商品分类列表失败');
          return;
        }
        console.warn(data, '商品分类');
        const allCate = data.res.context;
        // 改变数据形态，变为层级结构(目前最多2层)
        const newDataList = allCate
          .filter((item) => item.cateParentId === 0)
          .map((data) => {
            const children = allCate.filter(
              (item) => item.cateParentId === data.storeCateId
            );
            if (children.length > 0) {
              data['children'] = children;
            }
            return data;
          });
        setGoodsCateData(newDataList);
      })
      .catch((err) => {
        console.warn(err);

        message.error('获取商品分类列表失败');
      });
  };
  //处理分类的树形图结构数据
  const renderGoodsCate = (cateList) => {
    return cateList.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            key={item.storeCateId}
            value={item.storeCateId}
            title={item.cateName}
            disabled={item.cateGrade === 1}
          >
            {renderGoodsCate(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          key={item.storeCateId}
          value={item.storeCateId}
          title={item.cateName}
          disabled={item.cateGrade === 1}
        />
      );
    });
  };
  // 图片渲染
  const renderImgList = () => {
    return (
      <div className="upload-img-list">
        {imageList.map((item, index) => {
          return (
            <div className="img-box" key={index}>
              <div className="img-mask">
                <Icon
                  type="eye"
                  theme="filled"
                  onClick={() => {
                    setPreviewList([item.artworkUrl]);
                    setOpenPreview(true);
                  }}
                />
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    delImg(index);
                  }}
                />
              </div>
              <img className="upload-img-item" src={item.artworkUrl}></img>
            </div>
          );
        })}
      </div>
      // </Draggable>
    );
  };
  // 删除已上传图片
  const delImg = (index) => {
    const list = [...imageList];
    list.splice(index, 1);
    setImages([...list]);
    props.form.setFieldsValue({ images: list });
  };
  // 提交基本信息
  const baseInfoSubmit = async () => {
    const info = await props.form.validateFieldsAndScroll();
    if (info.errors) {
      message.error('请填写正确的商品基本信息');
      return false;
    } else {
      const spuNo =
        'P' +
        new Date()
          .getTime()
          .toString()
          .slice(4, 10) +
        Math.random()
          .toString()
          .slice(2, 5);
      const imgList = info.images.map((item) => {
        const { artworkUrl } = item;
        return { checkFlag: 1, artworkUrl };
      });
      return {
        ...info,
        // goodsSubtitle: info.goodsSubtitleNew,
        // vip_price: info.marketPrice,
        goodsNo: spuNo,
        shelflife: Number(info.shelflife),
        goodDate: info.goodDate
          ? moment(info.goodDate).format('YYYY-MM-DD HH:mm:ss')
          : '',
        storeCateIds: [info.storeCateIds],
        images: imgList
      };
    }
  };
  return (
    <div className="new-product-card">
      <Card title="基本信息" headStyle={{ color: '#F56C1D' }} bordered={false}>
        <Form
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          <Row type="flex">
            <Col span={10} style={{ display: 'none' }}>
              <Form.Item label="ERP编码">
                {getFieldDecorator('erpNo', {
                  rules: [{ required: false, message: '请输入ERP编码' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.erpNo
                      : ''
                })(
                  <Input
                    placeholder={
                      props.openEdit ? '请输入ERP编码' : '保存后自动生成'
                    }
                    disabled={true}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商品名称">
                {getFieldDecorator('goodsName', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.goodsName
                      : ''
                })(
                  <Input
                    style={{ width: '70%' }}
                    placeholder="请输入商品名称"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="平台类目">
                {getFieldDecorator('cateId', {
                  rules: [{ required: false, message: '请选择商品名称' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.cateId
                      : ''
                })(
                  <TreeSelect
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    placeholder="请选择分类"
                    notFoundContent="暂无分类"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                  >
                    {renderTree(allCateList)}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商品品牌">
                {getFieldDecorator('brandId', {
                  rules: [{ required: false, message: '请选择商品品牌' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.brandId
                      : ''
                })(
                  <Select
                    style={{ width: '70%' }}
                    placeholder="请选择商品品牌"
                    notFoundContent="暂无品牌"
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    showSearch
                    filterOption={(input, option: any) => {
                      return typeof option.props.children == 'string'
                        ? option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        : true;
                    }}
                  >
                    {brandList.map((item) => {
                      return (
                        <Select.Option key={item.brandId} value={item.brandId}>
                          {item.brandName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商品类目">
                {getFieldDecorator('storeCateIds', {
                  rules: [{ required: true, message: '请选择商品类目' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.storeCateIds[0] || ''
                      : ''
                })(
                  <TreeSelect
                    // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                    // multiple
                  >
                    {renderGoodsCate(goodsCateData)}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            {/* <Col span={10}>
              <Form.Item label="商品副标题">
                {getFieldDecorator('goodsSubtitleNew', {
                  rules: [{ required: true, message: '请输入商品副标题' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.goodsSubtitleNew
                      : ''
                })(
                  <Input
                    style={{ width: '70%' }}
                    placeholder="请输入商品副标题"
                  />
                )}
              </Form.Item>
            </Col> */}
            {/* <Col span={10}>
              <Form.Item label="计量单位">
                {getFieldDecorator('goodsUnit', {
                  rules: [{ required: true, message: '请选择计量单位' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.goodsUnit
                      : ''
                })(
                  <Select
                    style={{ width: '50%' }}
                    placeholder="请选择计量单位"
                    notFoundContent="暂无计量单位"
                  >
                    {goodsUnitData.map((item) => {
                      return (
                        <Select.Option
                          key={item.storeGoodsUnitId}
                          value={item.unit}
                        >
                          {item.unit}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            {/* <Col span={10}>
              <Form.Item label="门店价">
                {getFieldDecorator('marketPrice', {
                  rules: [{ required: true, message: '请输入门店价' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.marketPrice
                      : ''
                })(
                  <InputNumber
                    min={0}
                    max={9999999}
                    style={{ width: '100%' }}
                    placeholder="请输入门店价"
                  />
                )}
              </Form.Item>
            </Col> */}
            <Col span={10}>
              <Form.Item label="生产日期">
                {getFieldDecorator('goodDate', {
                  // rules: [{ required: true, message: '请选择生产日期' }],
                  initialValue:
                    props.openEdit &&
                    props.goodsDetail.goods &&
                    props.goodsDetail.goods.goodDate
                      ? moment(props.goodsDetail.goods.goodDate)
                      : null
                })(<DatePicker placeholder="生产日期" format={'YYYY-MM-DD'} />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="保质期">
                {getFieldDecorator('shelflife', {
                  rules: [{ required: true, message: '请输入保质期' }],
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.shelflife
                      : ''
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '80%', marginRight: 10 }}
                    placeholder="请输入保质期"
                  />
                )}
                天
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="包装类型">
                {getFieldDecorator('isScatteredQuantitative', {
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.isScatteredQuantitative
                      : ''
                })(
                  <Radio.Group>
                    <Radio value={0}>散称</Radio>
                    <Radio value={1}>定量</Radio>
                    <Radio value={2}>其他</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="上下架">
                {getFieldDecorator('addedFlag', {
                  initialValue:
                    props.openEdit && props.goodsDetail.goods
                      ? props.goodsDetail.goods.addedFlag
                      : 1
                })(
                  <Radio.Group>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商品图片">
                {getFieldDecorator('images', {
                  rules: [{ required: true, message: '请上传商品图片' }]
                })(
                  <div>
                    {imageList.length > 0 && renderImgList()}
                    <div
                      className="photo-gallery-upload"
                      onClick={() => {
                        setImageModalShow(true);
                      }}
                    >
                      <Icon type="plus" />
                    </div>
                    <Tips title="建议尺寸:800*800px,单张大小不超过2M,最多可上传10张" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商品视频">
                {getFieldDecorator('goodsVideo')(
                  <div>
                    {/* 已上传视频 */}
                    {props.form.getFieldValue('goodsVideo') && (
                      <div className="video-box">
                        <div className="video-mask">
                          <Icon
                            type="eye"
                            theme="filled"
                            onClick={() => {
                              setShowVideoPre(true);
                            }}
                          />
                          <Icon
                            type="delete"
                            theme="filled"
                            style={{ marginLeft: 15 }}
                            onClick={() => {
                              props.form.setFieldsValue({ goodsVideo: null });
                            }}
                          />
                        </div>
                        <img src={require('../img/video.png')} />
                      </div>
                    )}
                    <div
                      className="photo-gallery-upload"
                      onClick={() => {
                        setVideoModalShow(true);
                      }}
                    >
                      <Icon type="plus" />
                    </div>
                    <Tips title="商品视频大小推荐30M，最大限制50M，支持文件类型：mp4，推荐时长小于等于90s，大于等于6s，推荐视频比例7：9" />
                  </div>
                )}
              </Form.Item>
            </Col>
            {/* 图片库 */}
            <PhotoGallery
              show={imageModalShow}
              hide={() => {
                setImageModalShow(false);
              }}
              setImg={(data) => {
                setImages(data);
                const list = imageList;
                list.push(...data);
                setImages([...list]);
                props.form.setFieldsValue({ images: list });
              }}
            />
            {/* 视频库 */}
            <VideoLibrary
              videoVisible={videoModalShow}
              hideModal={(data) => {
                if (data && data.length > 0) {
                  console.warn(data);
                  props.form.setFieldsValue({ goodsVideo: data[0].artworkUrl });
                }
                setVideoModalShow(false);
              }}
            />
            {/* 图片预览 */}
            <ImgPreview
              visible={openPreview}
              imgList={imgPreviewList}
              close={() => {
                setOpenPreview(false);
              }}
            />
            {/* 视频预览 */}
            <VideoPreview
              showPreview={showVideoPre}
              videoUrl={props.form.getFieldValue('goodsVideo')}
              hidePreview={() => {
                setShowVideoPre(false);
              }}
            />
          </Row>
        </Form>
      </Card>
    </div>
  );
});

const BaseInfoTemplate = Form.create()(BaseInfo) as any;

export default BaseInfoTemplate;
