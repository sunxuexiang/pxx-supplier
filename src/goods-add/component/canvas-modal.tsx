import React, { Component } from 'react';
import { DraggableArea } from 'react-draggable-tags';

import { List } from 'immutable';
import { Icon, Modal, Form, Input,Checkbox } from 'antd';
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

export default class CanvasModal extends Component<any, any> {
  bgImg:any;
  codeImg:any;
  props: {
    goodsImages: string;
    salesPromotionImages:string;
    modalVisible:boolean;
    handleOk:Function;
    handleCancel:Function;
  };
  state = {
    isModalVisible: false,
    // https://img2.baidu.com/it/u=1909624617,2676699777&fm=253&fmt=auto&app=138&f=JPEG?w=703&h=500
    goodsImages:'https://xyytest-image.oss-cn-zhangjiakou.aliyuncs.com/202212261118099977.png',
    salesPromotionImages:'https://xyytest-image.oss-cn-zhangjiakou.aliyuncs.com/202212261118090761.png',
    canvasUrl:''
  };
  componentWillReceiveProps(nextProps) {
    console.log(nextProps,'nextProps')
    this.setState({
        isModalVisible:nextProps.modalVisible,
        goodsImages:nextProps.goodsImages,
        salesPromotionImages:nextProps.salesPromotionImages
    })
    // if(nextProps.modalVisible){
    //   this.downloadImg()
    // }
  }

  render() {
    const {isModalVisible,goodsImages,salesPromotionImages}=this.state;
    const {handleOk,handleCancel,}=this.props;
    return (
      <div>
        <Modal
          title="编辑图片"
          // width="400px"
          visible={isModalVisible}
          onOk={()=>this.generateCodePic()}
          onCancel={()=>handleCancel()}
        >
          <div style={{width:'400px',height:'400px',position:'relative'}}>
            <img src={goodsImages} style={{width:'400px',height:'400px'}} ref={ref => (this.bgImg = ref)} alt="" />
            <img src={salesPromotionImages} style={{width:'400px',height:'400px',position:'absolute',bottom:0,left:0}} ref={ref => (this.codeImg = ref)} alt="" />
          </div>
          {/* <img src={this.state.canvasUrl} alt="" /> */}
          {/* <div style={styles.lisngs}>
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
          
          </div> */}
        </Modal>
      </div>
    );
  }

  generateCodePic=()=>{
    this.downloadImg()
  }

  downloadImg() {
    const {handleOk}=this.props
    var canvas = document.createElement('canvas');
    let canvasUrl;
    console.log(canvas);
    canvas.width = 400;
    canvas.height = 400;
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var imgBack = new Image; // 创建img元素
    imgBack.src = this.state.goodsImages+ "?" + new Date().getTime() ;
    imgBack.setAttribute('crossOrigin', 'Anonymous');
    imgBack.onload=()=>{
      ctx.drawImage(imgBack, 0, 0, 400, 400);
      imgBack.src = this.state.salesPromotionImages+ "?" + new Date().getTime() ;
      imgBack.onload=()=>{
        ctx.drawImage(imgBack, 0, 0, 400, 400)
        canvasUrl=canvas.toBlob((blob)=>{
          handleOk(blob);
        });
        // canvasUrl=canvas.toDataURL("image/png")
        // console.log(canvasUrl,'canvasUrl')
        // let bstr = atob(canvasUrl.split(',')[1]); 
        // let n = bstr.length;
        // let u8arr = new Uint8Array(n);
        // if(n){
        //   u8arr[n] = bstr.charCodeAt(n);
        //   handleOk(u8arr);
        // }
        
        // this.setState({
        //   canvasUrl:canvasUrl
        // })
        // this.downLoad(canvasUrl)
      }
    }
    
  
    // this.downLoad(canvasUrl);
    // function downLoad(url) {
      // var oA = document.createElement('a');
      // oA.download = '二维码邀请函'; // 设置下载的文件名
      // oA.href = url;
      // document.body.appendChild(oA);
      // oA.click();
      // oA.remove(); // 下载之后把创建的元素删除
    // }
  };


  downLoad(url){
    const {handleOk}=this.props
    let aLink = document.createElement('a')
    let blob = base64ToBlob(url)
    let evt = document.createEvent('HTMLEvents')
    evt.initEvent("click",true,true)
    aLink.download ='图片名字.png'
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
    handleOk(blob);
    //图片base64转blob
    function base64ToBlob(url){
      let parts = url.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for(let i=0;i<uInt8Array;i++){
        uInt8Array[i] =raw.charCodeAt(i)
      }
      return new Blob([uInt8Array],{type:contentType})
    }
  }

  // onChangeTextPrice = (value) => {
  //   this.setState({ price: value });
  //   this.setall();
  // };
  // onChangeText = (value) => {
  //   this.setState({ text: value });
  //   this.setall();
  // };
  // montrue = async (url) => {
  //   this.setState({ imageUrl: url });
  //   await this.setState({ isModalVisible: true });
  //   setTimeout(() => {
  //     this.setall();
  //   });
  // };
  // // 画
  // async setall() {
  //   const { imageUrl, text, price } = this.state;
  //   let c = document.getElementById('canvas') as HTMLCanvasElement;
  //   // c.width = 400;
  //   // c.height = 600;
  //   c.width = 500;
  //   c.height = 570;
  //   let ctx = c.getContext('2d');

  //   // 背景图
  //   ctx.fillStyle = '#fff';
  //   ctx.fillRect(0, 0, 500, 690);
  //   let img = new Image();

  //   /**
  //   图片地址：https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2678442700,156868259&fm=26&gp=0.jpg
  //   */
  //   // img.src = "https://xyytest-image.oss-cn-zhangjiakou.aliyuncs.com/202110281536099185.jpg";
  //   img.src = imageUrl;
  //   // img.crossOrigin = 'Anonymous';
  //   // img.src = "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2678442700,156868259&fm=26&gp=0.jpg";

  //   img.onload = function () {
  //     // ctx.drawImage(img, 0, 0, 400, 500);
  //     ctx.drawImage(img, 0, 0, 500, 570);

  //     // 二维码 (20, 301)
  //     let img1 = new Image();
  //     /**
  //       二维码：https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594961923525&di=99cf960ab3534c72c4ef87f65cf7369b&imgtype=0&src=http%3A%2F%2Fwww.99xz.net%2Fd%2Ftubiao2%2F1912pc3%2F201911301508%2F103451_98377785.jpg
  //       */
  //     img1.src = require('../image/price-way.png');
  //     // img1.crossOrigin = 'Anonymous';

  //     img1.onload = function () {
  //       ctx.drawImage(img1, 380, 480, 80, 80);
  //       // 标题
  //       let name = text;
  //       ctx.font = 'bold 18px arial';
  //       ctx.fillStyle = '#222';
  //       ctx.textBaseline = 'top';
  //       drawText(ctx, name, 20, 520, 300, 24, 2);

  //       ctx.fillStyle = '#dd4a24';
  //       ctx.font = '28px Arial';
  //       ctx.fillText('￥' + price, 20, 480);
  //     };
  //   };

  //   // img1.crossOrigin = 'Anonymous';

  //   /**
  //   context 获取的canvas
  //   txt文字内容
  //   x 画布x轴起始位置
  //   y 画布y轴起始位置
  //   Linewidth 行的宽度
  //   lineHeight 文字行高
  //   maxLineNum 文字行数
  //   */
  //   function drawText(context, txt, x, y, Linewidth, lineHeight, maxLineNum) {
  //     let LineHeight = lineHeight || 24;
  //     let maxlineNum = maxLineNum || 2;
  //     let chr = txt.split('');
  //     let temp = '';
  //     let row = [];

  //     for (let a = 0; a < chr.length; a++) {
  //       //context.measureText(text).width  测量文本text的宽度
  //       if (
  //         context.measureText(temp).width < Linewidth &&
  //         context.measureText(temp + chr[a]).width <= Linewidth
  //       ) {
  //         temp += chr[a];
  //       } else {
  //         row.push(temp);
  //         temp = chr[a];
  //       }
  //     }
  //     row.push(temp);

  //     for (let b = 0; b < row.length; b++) {
  //       if (b < maxlineNum - 1) {
  //         context.fillText(row[b], x, y + b * LineHeight);
  //       } else if (b == maxlineNum - 1) {
  //         context.fillText(row[b] + '...', x, y + b * LineHeight);
  //       }
  //     }
  //   }
  // }
  // onxiaz = () => {
  //   console.log('下载图片');
  //   // window.onload = function () {
  //   // let downLoadEl = document.getElementById('downLoad') as HTMLCanvasElement;
  //   let canvas = document.getElementById('canvas') as HTMLCanvasElement;
  //   let url = canvas.toDataURL('image/png');
  //   let oA = document.createElement('a');
  //   oA.download = '产品'; // 设置下载的文件名，默认是'下载'
  //   oA.href = url;
  //   document.body.appendChild(oA);
  //   oA.click();
  //   oA.remove(); // 下载之后把创建的元素删除
  //   // }
  // };

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
  }
};
