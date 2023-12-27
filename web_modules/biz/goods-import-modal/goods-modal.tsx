import * as React from 'react';
import { fromJS } from 'immutable';
import { Const, Fetch, Headline, util, BreadCrumb } from 'qmkit';
import { message, Modal,Button,Upload,Icon,Table } from 'antd';
const Dragger = Upload.Dragger;
import * as webapi from './webapi';
import styled from 'styled-components';
// import GoodsGrid from './goods-grid';
// import { IList } from '../../../typings/globalType';
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;
export default class GoodsImportModal extends React.Component<any, any> {
  props: {
    type?:number;
    visible:boolean;
    title?:'商品导入';
    onCancelBackFun:Function;
    onOkFun:Function;
    wareId?:number;
  };

  constructor(props) {
    super(props);
    this.state = {
      type:this.props?.type,
      file:{},
      isType:1,
      selectedSkuIds:fromJS([]),
      selectedRows:fromJS([]),
      reason:[],
      errorCount:0,
      successCount:0,
      wareId:this.props?.wareId
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
      wareId:nextProps.wareId||null
    });
  }

  render() {
    const {
      visible,
      title,
      onCancelBackFun,
      onOkFun
    } = this.props;
    
    const {isType,selectedSkuIds,selectedRows,reason,file,wareId} = this.state;
    return (
      <Modal  
        maskClosable={false}
        title={title}
        width={750}
        visible={visible}
        onOk={() => {
          if(isType==2){
            this.setState({
              isType:1,
              file:{}
            })
            onOkFun(selectedSkuIds,selectedRows);
          }
        }}
        okButtonProps={{
          disabled:isType==3?true:false
        }}
        onCancel={() => {
          this.setState({
            file:{},
            isType:1,
            selectedSkuIds:fromJS([]),
            selectedRows:fromJS([]),
            reason:[]
          });
          onCancelBackFun();
        }}
        okText={isType==1||isType==2?'确认':'完成'}
        cancelText="取消"
      >
        {
          isType==1||isType==2?
          <div style={styles.flex}> 
          导入文件：
          <div style={styles.item}>
            {
              !this.state.file.status?
              <div >
              <Button type="link" onClick={this.toDownTempl} >下载模板</Button>
              <Upload
                  multiple={false}
                  showUploadList={false}
                  accept=".xls,.xlsx"
                  headers={header}
                  action={Const.HOST + `/marketing/importGoods/${wareId}`}
                  onChange={this.upload}
                  name="file"
                >
                  <a href="javascript:;">选择文件上传</a> 
                </Upload>
                <div>
                  <GreyText>仅支持 xls, xlsx 格式文件。格式可参考模板。不可上传重复的数据</GreyText>
                </div>
            </div>:null  
            }
            {
              this.state.file.status=='done'?
              <div>
                  <div style={styles.flext}>
                  <div>
                    <Icon type="upload" />
                    {this.state.file.name}
                  </div>
                  <a href="javascript:;" style={{marginLeft:'20px'}} onClick={()=>{
                    this.setState({
                      file:{},
                      isType:1,
                      selectedSkuIds:fromJS([]),
                      selectedRows:fromJS([]),
                      reason:[]
                    });
                  }}>删除</a> 
                </div>
                <div>
                      <GreyText>仅支持 xls, xlsx 格式文件。格式可参考模板</GreyText>
                </div>
              </div>
              :null  
            }
          </div>
        </div>
        :null
        }
       {
        isType==2&&this.state.file.status=='done'&&reason.length?
        <div >
          <div style={{marginBottom:'6px'}}>导入错误，以下为错误信息：</div> 
          <Table columns={this.columns}  scroll={{ y: 440 }} dataSource={reason} />
        </div>:null
       }
      </Modal>
    );
  }


  columns=[
    {
      title: 'ERP编码',
      dataIndex: 'erpName',
      key: 'erpName',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
    {
      title: '失败原因',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  // rowChangeBackFun = (selectedSkuIds, selectedRows) => {
  //   this.setState({
  //     selectedSkuIds: selectedSkuIds,
  //     selectedRows: selectedRows
  //   });
  // };


  //下载模板
  toDownTempl() {
    // 参数加密
    const token = (window as any).token;
    if (token) {
      const base64 = new util.Base64();
      const result = JSON.stringify({ token: token });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref = Const.HOST + `/marketing/downloadTemplate/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  }

  // errBut=async(val)=>{
  //   // 参数加密
  //   const token = (window as any).token;
  //   if (token) {
  //     const base64 = new util.Base64();
  //     const result = JSON.stringify({ token: token });
  //     const encrypted = base64.urlEncode(result);
  //     // 新窗口下载
  //     const exportHref = Const.HOST + `/marketing/good/excel/err/${val}/${encrypted}`;
  //     window.open(exportHref);
  //   } else {
  //     message.error('请登录');
  //   }
  // };

  //导入
  upload=({file,fileList})=>{
    console.log(file,fileList)
    if(file.status=='error'){
      this.setState({
        file:{},
        isType:1
      });
      message.error('上传失败');
      return
      // this.errBut();
    };
    if(file.status=='done'){//上传成功
      if(file?.response&&file?.response?.code==Const.SUCCESS_CODE){
        // this.setState({isType:2,file:file});
        this.doneBut(file.response,file)
      }else{
        this.setState({isType:1,file:{},selectedRows:fromJS([]) ,selectedSkuIds:fromJS([]),reason:[]});
        message.error('上传失败');
      }
    };
    
  };

  

  doneBut=async(res,file?)=>{
      this.setState({
        selectedRows:fromJS(res.context?.goods||[]),
        selectedSkuIds:fromJS(res.context?.goods.map(item=>item.goodsInfoId)||[]),
        reason:res.context?.reason,
        isType:2,
        file:file
      });
  }

}

const styles={
  flex:{
    display: 'flex',
    alignItems: 'baseline',
    marginTop:'30px'
  },
  flext:{
    display: 'flex',
    // alignItems: 'baseline',
    padding: '10px 0',
    justifyContent: 'center'
  },
  item:{
    padding: '10px 15px',
    border: '1px solid #eee',
    borderRadius: '3px',
    textAlign: 'center',
    width:'600px'
  } as any
}
