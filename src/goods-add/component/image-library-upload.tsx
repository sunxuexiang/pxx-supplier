import React, { Component } from 'react';
import { DraggableArea } from 'react-draggable-tags';

import { List } from 'immutable';
import { Icon, Modal, Form, Input, Checkbox } from 'antd';
import { nextTick } from 'process';
import { QMMethod } from 'qmkit';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 13
  }
};

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
    imgName?: string;
    onCheckChange: Function;
  };

  state = {
    isModalVisible: false,
    text: '默认文字',
    price: '0.00',
    imageUrl: null,
    imageslist: []
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps,'nextProps111111')
    // if(nextProps.imgName==this.props.imgName){
    //   this.setState({
    //     imageslist:nextProps.images.toJS().map((item, index) => {
    //       item.id = index + 1;
    //       item.checked=item.checked||false;
    //       return item;
    //     }),
    //   })
    //   this.forceUpdate();
    // }
  }

  render() {
    const {
      images,
      modalVisible,
      clickImg,
      removeImg,
      editImages,
      imgCount,
      imgType,
      skuId,
      imgName
    } = this.props;
    const { isModalVisible } = this.state;
    const imageslist = images.toJS().map((item, index) => {
      item.checked = item.checked || false;
      // item.uid=index;
      item.id = (item.checked ? 'a' : 'b') + index; //id不同就可刷新
      return item;
    });
    console.log(imageslist, 'imageslist');
    return (
      <div>
        <DraggableArea
          tags={imageslist}
          render={({ tag, index }) => <div>{this.imgRender(tag)}</div>}
          onChange={(tags) => {
            console.warn(tags);
            editImages(tags);
          }}
        />
        {images.count() < imgCount ? (
          <div
            onClick={() =>
              modalVisible(imgCount, imgType, skuId, imgName || '')
            }
            style={styles.addImg}
          >
            <div style={styles.imgBox}>
              <Icon type="plus" style={styles.plus} />
            </div>
          </div>
        ) : null}

        <Modal
          title="编辑图片样式"
          width="70%"
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={styles.lisngs}>
            <div>
              <canvas style={styles.canvass} id="canvas" />
              <div style={styles.widhts}>
                <div
                  id="downLoad"
                  style={styles.download}
                  onClick={this.onxiaz}
                >
                  下载图片
                </div>
              </div>
            </div>
            <div>
              <Form>
                <FormItem
                  {...formItemLayout}
                  rules={[
                    {
                      required: true,
                      message: '文字'
                    }
                  ]}
                  label="文字"
                >
                  <Input
                    placeholder="超出俩行自动...显示"
                    style={{ width: 160 }}
                    onBlur={(e) => {
                      this.onChangeText(e.currentTarget.value);
                    }}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  rules={[
                    {
                      required: true,
                      message: '价格'
                    }
                  ]}
                  label="价格"
                >
                  <Input
                    placeholder="输入价格"
                    style={{ width: 160 }}
                    onBlur={(e) => {
                      this.onChangeTextPrice(e.currentTarget.value);
                    }}
                  />
                </FormItem>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
  onChangeTextPrice = (value) => {
    this.setState({ price: value });
    this.setall();
  };
  onChangeText = (value) => {
    this.setState({ text: value });
    this.setall();
  };
  montrue = async (url) => {
    this.setState({ imageUrl: url });
    await this.setState({ isModalVisible: true });
    setTimeout(() => {
      this.setall();
    });
  };
  // 画
  async setall() {
    const { imageUrl, text, price } = this.state;
    let c = document.getElementById('canvas') as HTMLCanvasElement;
    // c.width = 400;
    // c.height = 600;
    c.width = 500;
    c.height = 570;
    let ctx = c.getContext('2d');

    // 背景图
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 500, 690);
    let img = new Image();

    /**
    图片地址：https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2678442700,156868259&fm=26&gp=0.jpg
    */
    // img.src = "https://xyytest-image.oss-cn-zhangjiakou.aliyuncs.com/202110281536099185.jpg";
    img.src = imageUrl;
    // img.crossOrigin = 'Anonymous';
    // img.src = "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2678442700,156868259&fm=26&gp=0.jpg";

    img.onload = function () {
      // ctx.drawImage(img, 0, 0, 400, 500);
      ctx.drawImage(img, 0, 0, 500, 570);

      // 二维码 (20, 301)
      let img1 = new Image();
      /**
        二维码：https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594961923525&di=99cf960ab3534c72c4ef87f65cf7369b&imgtype=0&src=http%3A%2F%2Fwww.99xz.net%2Fd%2Ftubiao2%2F1912pc3%2F201911301508%2F103451_98377785.jpg
        */
      img1.src = require('../image/price-way.png');
      // img1.crossOrigin = 'Anonymous';

      img1.onload = function () {
        ctx.drawImage(img1, 380, 480, 80, 80);
        // 标题
        let name = text;
        ctx.font = 'bold 18px arial';
        ctx.fillStyle = '#222';
        ctx.textBaseline = 'top';
        drawText(ctx, name, 20, 520, 300, 24, 2);

        ctx.fillStyle = '#dd4a24';
        ctx.font = '28px Arial';
        ctx.fillText('￥' + price, 20, 480);
      };
    };

    // img1.crossOrigin = 'Anonymous';

    /**
    context 获取的canvas
    txt文字内容
    x 画布x轴起始位置
    y 画布y轴起始位置
    Linewidth 行的宽度
    lineHeight 文字行高
    maxLineNum 文字行数
    */
    function drawText(context, txt, x, y, Linewidth, lineHeight, maxLineNum) {
      let LineHeight = lineHeight || 24;
      let maxlineNum = maxLineNum || 2;
      let chr = txt.split('');
      let temp = '';
      let row = [];

      for (let a = 0; a < chr.length; a++) {
        //context.measureText(text).width  测量文本text的宽度
        if (
          context.measureText(temp).width < Linewidth &&
          context.measureText(temp + chr[a]).width <= Linewidth
        ) {
          temp += chr[a];
        } else {
          row.push(temp);
          temp = chr[a];
        }
      }
      row.push(temp);

      for (let b = 0; b < row.length; b++) {
        if (b < maxlineNum - 1) {
          context.fillText(row[b], x, y + b * LineHeight);
        } else if (b == maxlineNum - 1) {
          context.fillText(row[b] + '...', x, y + b * LineHeight);
        }
      }
    }
  }
  onxiaz = () => {
    console.log('下载图片');
    // window.onload = function () {
    // let downLoadEl = document.getElementById('downLoad') as HTMLCanvasElement;
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let url = canvas.toDataURL('image/png');
    let oA = document.createElement('a');
    oA.download = '产品'; // 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
    // }
  };
  handleOk = () => {
    //   var image = new Image();
    // image.src = canvas.toDataURL("image/png");
    this.setState({ isModalVisible: false });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };
  imgRender(tag) {
    const { clickImg, removeImg, skuId, onCheckChange, imgName } = this.props;
    return (
      <div key={tag.id} style={{ position: 'relative' }}>
        {imgName ? (
          <div style={styles.checkbox}>
            <Checkbox
              checked={tag.checked}
              // disabled={tag.disabled}
              onChange={(eve) => {
                onCheckChange(tag, eve.target.checked, imgName);
              }}
            ></Checkbox>
          </div>
        ) : null}
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
              {!tag.checked ? (
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
              ) : null}
            </span>
          </div>
          {/* <div style={styles.bjk} onClick={() => this.montrue(tag.artworkUrl || tag.url)}>编辑图片样式</div> */}
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
  } as any,
  bjk: {
    width: '100%',
    textAlign: 'center',
    color: '#F56C1D'
  } as any,
  canvass: {
    // backgroundColor: 'pink'
    display: 'block',
    // width: '300px',
    // height: '600px',
    border: '1px solid black'
  } as any,
  download: {
    width: '100px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    color: '#fff',
    backgroundColor: '#F56C1D',
    borderColor: '#F56C1D',
    textShadow: '0 -1px 0 rgb(0 0 0 / 12%)',
    boxShadow: '0 2px 0 rgb(0 0 0 / 5%)',
    marginTop: 20,
    borderRadius: 10
  } as any,
  widhts: {
    width: '500px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
  } as any,
  lisngs: {
    display: 'flex'
  },
  checkbox: {
    position: 'absolute',
    right: '17px',
    top: '-5px',
    zIndex: 99999
  }
};
