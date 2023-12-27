import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface MenuType {
  label?: string;
  icon?: string;
  path?: string;
  children?: Array<MenuType>;
}

// 菜单
const menuList: Array<MenuType> = [
  {
    label: '商品',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717948349.jpg',
    path: '/goods-list',
    children: [
      {
        label: '商品管理',
        children: [
          { label: '商品列表', path: '/goods-list' },
          { label: '店铺分类', path: '/goods-cate' },
          { label: '商品品牌', path: '/goods-brand' }
        ]
      }
    ]
  },
  {
    label: '订单',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717305053.jpg',
    path: '/order-list',
    children: [
      {
        label: '订单管理',
        children: [
          { label: '订单列表', path: '/order-list' },
          { label: '退单列表', path: '/order-return-list' }
        ]
      }
    ]
  },
  {
    label: '客户',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717980431.jpg',
    path: '/customer-list',
    children: [
      {
        label: '客户管理',
        children: [
          { label: '客户列表', path: '/customer-list' },
          { label: '客户等级', path: '/customer-level' }
        ]
      }
    ]
  },
  {
    label: '财务',
    icon: 'http://kstoreimages.b0.upaiyun.com/sys/03.jpg',
    path: '/finance-account-receivable',
    children: [
      // {
      //   label: '收款账户',
      //   children: [
      //     {label: '收款账户', path: '/finance-account-receivable'}
      //   ]
      // },
      {
        label: '资金管理',
        children: [
          // {label: '订单收款', path: '/finance-order-receive'},
          // {label: '退单退款', path: '/finance-refund'},
          // {label: '收款明细', path: '/finance-receive-detail'},
          // {label: '退款明细', path: '/finance-refund-detail'},
          { label: '财务对账', path: '/finance-manage-check' },
          { label: '财务结算', path: '/finance-manage-settle' }
        ]
      },
      {
        label: '开票管理',
        children: [
          { label: '订单开票', path: '/finance-order-ticket' },
          // {label: '增值税专用发票', path: '/finance-val-added-tax'},
          { label: '开票项目', path: '/finance-ticket-manage' }
        ]
      }
      // {
      //   label: '对账报表',
      //   children: [
      //     {label: '收支明细', path: '/billing-details'},
      //     {label: '财务对账', path: '/finance-manage-check'},
      //     {label: '财务结算', path: '/finance-manage-settle'}
      //   ]
      // }
    ]
  },
  {
    label: '员工',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717980431.jpg',
    path: '/employee-list',
    children: [
      {
        label: '员工管理',
        children: [
          { label: '员工列表', path: '/employee-list' },
          { label: '权限分配', path: '/authority-allocating' }
        ]
      }
    ]
  },
  {
    label: '统计',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717980431.jpg',
    path: '/flow-statistics',
    children: [
      {
        label: '统计报表',
        children: [
          { label: '流量统计', path: '/flow-statistics' },
          { label: '交易统计', path: '/trade-statistics' },
          { label: '业务员统计', path: '/employee-statistics' },
          { label: '商品统计', path: '/goods-statistics' },
          { label: '客户统计', path: '/customer-statistics' },
          { label: '报表下载', path: '/download-report' }
        ]
      }
    ]
  },
  {
    label: '设置',
    icon: 'http://kstoreimages.b0.upaiyun.com/1472717894116.jpg',
    path: '/no-page'
  }
];

export default class SlideMenu extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      firstActive: 0,
      secondActive: 0
    };
  }

  render() {
    return (
      <div className="side-menu">
        <Sider width={90} style={styles.firstMenu}>
          <a style={styles.logo} href="/">
            <img
              style={styles.logoImg}
              src="http://kstoreimages.b0.upaiyun.com/sys/02.jpg"
            />
          </a>
          <Menu style={styles.menu} onClick={this._selectFirstMenu as any}>
            {menuList.map((v, i) => {
              return (
                <Menu.Item style={styles.menuItem} key={i}>
                  <Link style={styles.menuLink} to={v.path}>
                    {v.label}
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Sider width={100} style={styles.secondMenu}>
          <Menu
            style={{ borderRight: 'none' }}
            defaultOpenKeys={['0']}
            mode="inline"
          >
            {(menuList[this.state.firstActive] as any).children.map(
              (item, index) => {
                return (
                  <Menu.SubMenu
                    className="sub-menu"
                    title={<span style={styles.subMenuItem}>{item.label}</span>}
                    key={index}
                  >
                    {item.children.map((v, i) => {
                      return (
                        <Menu.Item
                          key={i}
                          style={{ paddingLeft: 0, textAlign: 'center' }}
                        >
                          <Route
                            path={v.path}
                            children={({ match }) => (
                              <Link
                                className={match ? 'active' : ''}
                                style={match && { color: '#d64635' }}
                                to={v.path}
                              >
                                {v.label}
                              </Link>
                            )}
                          />
                        </Menu.Item>
                      );
                    })}
                  </Menu.SubMenu>
                );
              }
            )}
          </Menu>
        </Sider>
      </div>
    );
  }

  _selectFirstMenu = (params) => {
    this.setState({
      firstActive: params.key
    });
  };
}

const styles = {
  firstMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#414141',
    height: '100%'
  },
  secondMenu: {
    position: 'fixed',
    top: 0,
    left: 90,
    backgroundColor: '#fff',
    height: '100%',
    borderRight: '1px solid #efefef'
  },
  logo: {
    display: 'block',
    height: 40,
    padding: 10
  },
  logoImg: {
    width: '100%'
  },
  menu: {
    height: 'calc(100% - 50px)',
    borderRight: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: 'transparent'
  },
  menuItem: {
    height: 36,
    lineHeight: '36px'
  },
  menuLink: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14
  },
  subMenuItem: {
    display: 'block',
    color: '#fff',
    backgroundColor: '#d64635'
  }
} as any;
