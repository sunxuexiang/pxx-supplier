import React from 'react';
import {
  Breadcrumb,
  Alert,
  Button,
  Icon,
  message,
  Spin,
  Steps,
  Upload
} from 'antd';
import { Const, Fetch, util, BreadCrumb } from 'qmkit';
import { any } from 'prop-types';

const Dragger = Upload.Dragger;
const Step = Steps.Step;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

const steps = [
  {
    title: '下载商品导入模板',
    content: 'First-content'
  },
  {
    title: '上传数据',
    content: 'Second-content'
  }
  // {
  //   title: '完成',
  //   content: 'Third-content'
  // }
];

const importGoods = (ext) => {
  return Fetch('/trade/importGoodsInfos' + ext, {
    method: 'GET'
  });
};
const importGoodserror = (ext) => {
  return Fetch('/trade/exportGoodsInfos/' + ext, {
    method: 'GET'
  });
};

export default class GoodsModifyImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      ext: '',
      fileName: '',
      err: false,
      errBtn: false,
      loading: false,
      isImport: true
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current, fileName, err, isImport, errBtn } = this.state;
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>商品批量导入下单</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品修改</Breadcrumb.Item>
          <Breadcrumb.Item>商品修改导入</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <div>
            <Alert
              message="操作说明："
              type="info"
              description={
                <ul>
                  <li>
                    1、请先下载商品导入模板，并按照批注中的要求填写商品修改数据，未按要求填写将会导致导入失败。
                  </li>
                  <li>
                    2、请选择 .xlsx或
                    .xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条商品修改数据。
                  </li>
                </ul>
              }
            />
            <div style={styles.uploadTit}>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </div>
            {current == 0 ? (
              <div style={styles.center}>
                <Button
                  type="primary"
                  icon="download"
                  style={{ marginTop: 10 }}
                  onClick={this.toDownTempl}
                >
                  下载商品导入模板
                </Button>
                <div style={{ marginTop: 40 }}>
                  <Button type="primary" onClick={this._next}>
                    下一步
                  </Button>
                </div>
              </div>
            ) : null}
            {current == 1 ? (
              <Spin spinning={this.state.loading}>
                <div className="steps-content" style={styles.center}>
                  <Dragger
                    name="file"
                    multiple={false}
                    showUploadList={false}
                    accept=".xls,.xlsx"
                    headers={header}
                    action={Const.HOST + '/trade/importGoodsInfos'}
                    onChange={this.changeImage}
                  >
                    <div style={styles.content}>
                      <p
                        className="ant-upload-hint"
                        style={{ fontSize: 14, color: 'black' }}
                      >
                        {' '}
                        <Icon type="upload" />
                        选择文件上传
                      </p>
                    </div>
                  </Dragger>
                  <div style={styles.tip}>{fileName}</div>
                  {err ? (
                    <div style={styles.tip}>
                      <span style={styles.error}>导入失败！</span>
                      您可以<a onClick={this.toExcel}>下载错误表格</a>
                      ，查看错误原因，修改后重新导入。
                    </div>
                  ) : null}

                  <p style={styles.grey}>
                    请选择 .xlsx或
                    .xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条商品修改数据。
                  </p>

                  {errBtn ? (
                    <Button
                      type="primary"
                      onClick={this._importGoods}
                      disabled={isImport}
                    >
                      重新导入
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={this._importGoods}
                      disabled={isImport}
                    >
                      确认导入
                    </Button>
                  )}
                </div>
              </Spin>
            ) : null}
            {/* {current == 2 ? (
              <div className="steps-content" style={styles.center}>
                <div style={styles.center}>
                  <p style={styles.greyBig}>导入成功！</p>
                  <p style={styles.grey1}>
                    您可以前往商品修改列表查看已导入的修改。
                  </p>
                </div>
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    );
  }

  _init = () => {
    let err = false;
    let ext = '';
    let fileName = '';
    let loading = false;
    let isImport = true;
    let errBtn = false;
    this.setState({ err, ext, fileName, loading, isImport, errBtn });
    this.prev();
  };

  _next = () => {
    this.next();
  };

  toDownTempl() {
    const token = (window as any).token;
    if (token) {
      const base64 = new util.Base64();
      let result = JSON.stringify({ token: token });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref =
        Const.HOST + `/goods/goodsBatchImport/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  }

  _importGoods = async () => {
    const { ext } = this.state;
    console.log(ext);

    if (ext == '') {
      message.error('请上传文件');
      return;
    }

    let loading = true;
    this.setState({ loading });
    const importRes: any = await importGoods(ext);
    if (importRes.res.code == 'K-030404') {
      loading = false;
      let err = true;
      let errBtn = true;
      this.setState({ loading, err, errBtn });
    } else if (importRes.res.code == Const.SUCCESS_CODE) {
      loading = false;
      this.setState({ loading });
      this.next();
    } else {
      loading = false;
      this.setState({ loading });
      message.error(importRes.res.message);
    }
  };

  changeImage = async (info) => {
    const status = info.file.status;
    let loading = true;
    let err = false;
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        console.log(isImport, '---------', ext);
        // this.next();
        message.success(fileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          // this._importGoods(info.file.response.message);
          this._importerror(info.file.response.message);
          err = true;
          let uuid = info.file.response.message;
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, fileName, loading, err, uuid });
    } else if (status === 'error') {
      message.error('上传失败');
      loading = false;
      this.setState({ loading, err });
    }
  };

  _importerror = async (uuid) => {
    console.log(uuid);
    const { ext } = this.state;
    // console.log(ext);
    // if (ext == '') {
    //   message.error('请上传文件');
    //   return;
    // }

    let loading = true;
    this.setState({ loading });
    const importRes: any = await importGoodserror(uuid);
    console.log(importRes);

    if (importRes.res.code == 'K-030404') {
      loading = false;
      let err = true;
      let errBtn = true;
      this.setState({ loading, err, errBtn });
    } else if (importRes.res.code == Const.SUCCESS_CODE) {
      loading = false;
      this.setState({ loading });
      this.next();
    } else {
      loading = false;
      this.setState({ loading });
      message.error(importRes.res.message);
    }
  };

  toExcel = () => {
    const { ext, uuid } = this.state;
    console.log(uuid);

    // 参数加密
    let base64 = new util.Base64();
    const atoken = (window as any).token;
    if (atoken != '') {
      let encrypted = base64.urlEncode(JSON.stringify({ token: atoken }));

      // 新窗口下载
      const exportHref =
        Const.HOST + `/trade/exportGoodsInfos/${uuid}/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
}

const styles = {
  uploadTit: {
    margin: '40px 200px'
  },
  content: {
    background: '#fcfcfc',
    padding: '50px 0'
  },
  grey: {
    color: '#999999',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  tip: {
    marginTop: 10,
    marginLeft: 10,
    color: '#333'
  },
  error: {
    color: '#e10000'
  },
  grey1: {
    color: '#666666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10
  },
  center: {
    textAlign: 'center'
  },
  greyBig: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold'
  }
} as any;
