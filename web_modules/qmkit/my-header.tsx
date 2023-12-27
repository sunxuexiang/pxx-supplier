import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon, message } from 'antd';
const { Header } = Layout;
import { history, cache, util, Const } from 'qmkit';
import QRCode from 'qrcode';

export default class MyHeader extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      storeName: '',
    }
  }

  componentDidMount() {
    history.listen((location, action) => {
      if(location.pathname === '/store-info'){
        const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
        this.setState({storeName: loginInfo.storeName});
      }
    })
  }

  render() {
    const { storeName } = this.state;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (!loginInfo) {
      return null;
    }

    const accountName = loginInfo && loginInfo.accountName;
    const isMasterAccount = loginInfo && loginInfo.isMasterAccount;
    const mobile = loginInfo && loginInfo.mobile;
    const localStoreName = loginInfo && loginInfo.storeName;
    

    //解析sessionStorage中的baseConfig
    let baseConfig,
      h5Dom,
      miniProgramDom,
      pcDom = null;
    if (sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)) {
      baseConfig = JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG));
    }

    //获取程序二维码
    let miniProgramUrl = localStorage.getItem(cache.MINI_QRCODE);
    if (miniProgramUrl) {
      miniProgramDom = (
        <Menu.Item key="2">
          <a href={undefined} className="previewCode">
            <img src={miniProgramUrl} alt="二维码" width="80" height="80" />
            <p>小程序</p>
            <div className="previewImg">
              <img src={miniProgramUrl} alt="二维码" />
            </div>
          </a>
        </Menu.Item>
      );
    }

    if (baseConfig) {
      if (baseConfig['pcWebsite']) {
        let url = '';
        if (baseConfig['pcWebsite'].endsWith('/')) {
          url = `${baseConfig['pcWebsite']}store-main/${loginInfo.storeId}`;
        } else {
          url = `${baseConfig['pcWebsite']}/store-main/${loginInfo.storeId}`;
        }
        let pcCodeUrl =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDQ0E2NTM4MzMzRjQxMUU5QTM5MUY5ODk5ODhCQTBCMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDQ0E2NTM4NDMzRjQxMUU5QTM5MUY5ODk5ODhCQTBCMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNDQTY1MzgxMzNGNDExRTlBMzkxRjk4OTk4OEJBMEIzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNDQTY1MzgyMzNGNDExRTlBMzkxRjk4OTk4OEJBMEIzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Ira84wAAAaBJREFUeNrs3LFKw1AYxXGjteIkqLOoOHVwin0EQUFBF0FXFzfRx3BwqYIPIDjoIiKCr5BB8QHUXYQuClWJp3AHh1Rpemvycf8HDoGE3jQ/btKElkZpmg6Q/BmEAEAAAQSQAAgggAASAAEEEEACIIAAAkgABNBCKj4Hi+O49AecJAkzMIRTeFK9VFtqWmA/1At1wsQp/CPH6kpJLlHrbqKsWQJcdMtX9bFAwBl1XF22NgPH3PJG3SoQ8FTdVKvcxnAfCCABEEAAASQAAggggARAAAEEkAAIIIC2U+nz+HX1pMDjq1sHnHPNk/bXkk/qtBpxCneffXVW3Q3xGtj0MMadW957GKtlDfDWwxgNN/saHsa6tnYN3FFH1KUe9lFTD3t8H5/qlbptDfBFXc352in1OWP9vPrAhwg30gRAQzfSnbKnbqhDGds6/RDoTH3PWP+lnqsHoQCOuoPtdvbXftm2oB6pbyGcwtU+7Lf9qDccygxslvnZlg+Rf07EXz8xAwEEEEACIIAAAkgABBBAAAmAAAIIIAEQQAABJH/lW4ABAOc7TB5B8zqiAAAAAElFTkSuQmCC';
        pcDom = (
          <Menu.Item key="0">
            <a target="_blank" href={url}>
              <div className="firstBorder">
                <img src={pcCodeUrl} alt="PC" width="80" height="80" />
              </div>
              <p style={{ paddingRight: 15 }}>PC端</p>
            </a>
          </Menu.Item>
        );
      }
      if (baseConfig['mobileWebsite']) {
        let url = '';
        if (baseConfig['mobileWebsite'].endsWith('/')) {
          url = `${baseConfig['mobileWebsite']}store-main/${loginInfo.storeId}`;
        } else {
          url = `${baseConfig['mobileWebsite']}/store-main/${loginInfo.storeId
            }`;
        }
        let qrCodeUrl = null;
        QRCode.toDataURL(url, { errorCorrectionLevel: 'H' }, function (
          _err,
          url
        ) {
          qrCodeUrl = url;
        });
        h5Dom = (
          <Menu.Item key="1">
            <a target="_blank" href={url} className="previewMobile">
              <img src={qrCodeUrl} alt="二维码" width="80" height="80" />
              <p>移动端</p>
              <div className="previewImg">
                <img src={qrCodeUrl} alt="二维码" />
              </div>
            </a>
          </Menu.Item>
        );
      }
    }

    let menuPreview = null;
    if (pcDom || h5Dom || miniProgramDom) {
      menuPreview = (
        <Menu className="menuPreview">
          {pcDom && pcDom}
          {h5Dom && h5Dom}
          {miniProgramDom && miniProgramDom}
        </Menu>
      );
    } else {
      menuPreview = (
        <Menu className="menuPreview">
          <Menu.Item key="1">
            <a>请先在基本设置中配置预览链接</a>
          </Menu.Item>
        </Menu>
      );
    }

    const menu = (
      <Menu>
        {isMasterAccount == '1' ? (
          <Menu.Item key="0">
            <Link to={'/account-manage'}>
              <Icon type="user" /> 账户管理
            </Link>
          </Menu.Item>
        ) : null}

        <Menu.Item key="1">
          <a
            href={undefined}
            onClick={() =>
              mobile && mobile != ''
                ? history.push({
                  pathname: '/find-password',
                  state: {
                    phone: mobile
                  }
                })
                : message.error('请先绑定手机号')
            }
          >
            <Icon type="lock" /> 修改密码
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href={undefined} onClick={() => this._handleLogout()}>
            <Icon type="logout" /> 退出
          </a>
        </Menu.Item>
      </Menu>
    );
    const userImg = 'data:image/png;base64,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';
    return (
      <Header className="header">
        <div style={styles.headerLeft}>
          <a href="/" style={styles.logoBg}>
            <img
              style={styles.logoImg}
              src={
                sessionStorage.getItem(cache.SITE_LOGO)
                  ? sessionStorage.getItem(cache.SITE_LOGO)
                  : util.requireLocalSrc('sys/02.jpg')
              }
            />
          </a>

          {baseConfig && (
            <Dropdown overlay={menuPreview} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="eye-o" /><span style={styles.dropdownText}>预览</span><Icon type="down" />
              </a>
            </Dropdown>
          )}
        </div>
        <div>
          <span style={styles.storeName}>
            {storeName || localStoreName}
          </span>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              {/* <Icon type="user" /> */}
              <img src={userImg} alt="" />
              <span style={{...styles.dropdownText, minWidth: 100}}>{accountName}</span>
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
    );
  }

  /**
   * 退出登录
   */
  _handleLogout = () => {
    try {
      // @ts-ignore
      const ifDom = window.ifDom
      if (ifDom && ifDom.contentWindow) {
        ifDom.contentWindow.postMessage({msgType: 'exitIM'}, Const.IM_URL);
      }
    } catch (error) {
      console.warn('退出登录==>', error)
    } finally {
      setTimeout(() => {
        util.logout();
      }, 500);
    }
  };
}

const styles = {
  logoBg: {
    width: 140,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  storeName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: "#F56C1D"
  },
  logoImg: {
    display: 'block',
    width: 120,
    // height: 30
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: 98
  },
} as any;
