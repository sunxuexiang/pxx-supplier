import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { cache } from '../index';
import { fromJS } from 'immutable';
import { history } from 'qmkit';

export default class BreadCrumb extends React.Component<any, any> {
  props: {
    first?: string;
    second?: string;
    third?: string;
    children?: any;
    //自动化几个层级，默认3个，即3个层级的自动显示，最少应该是2个层级
    //自动显示2个层级的，传2，后面的层级由页面处理，作为children传递
    autoLevel?: number;
    //页面中添加层级
    thirdLevel?: boolean;
  };

  render() {
    //选中的一级菜单索引
    const firstIndex = sessionStorage.getItem(cache.FIRST_ACTIVE);
    //选中的二级菜单索引
    const secondIndex = sessionStorage.getItem(cache.SECOND_ACTIVE);
    //选中的三级菜单索引
    const thirdIndex = sessionStorage.getItem(cache.THIRD_ACTIVE);
    //所有菜单
    const allGradeMenus = fromJS(
      JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS))
    );
    let first = allGradeMenus.get(firstIndex).get('title') || '';
    let firstUrl = allGradeMenus.getIn([
      firstIndex,
      'children',
      0,
      'children',
      0,
      'url'
    ]) || '';

    let second =
      allGradeMenus
        .get(firstIndex)
        .get('children')
        .get(secondIndex)
        .get('title') || '';
    let third =
      allGradeMenus
        .get(firstIndex)
        .get('children')
        .get(secondIndex)
        .get('children')
        .get(thirdIndex)
        .get('title') || '';
    let thirdUrl =
      allGradeMenus.getIn([
        firstIndex,
        'children',
        secondIndex,
        'children',
        thirdIndex,
        'url'
      ]) || '';
    return (
      <Breadcrumb >
        <Breadcrumb.Item><a onClick={() => this.switchUrl(firstUrl)} href={undefined}>{first}</a></Breadcrumb.Item>
        <Breadcrumb.Item>{this.props.thirdLevel ? <a onClick={() => this.switchUrl(thirdUrl)} href={undefined}>{third}</a> : third}</Breadcrumb.Item>
        {this.props.children}
        {/* {this.renderVideoBtn()} */}
      </Breadcrumb>
    );
  }

  switchUrl = (url) => {
    history.push(url);
  }

  renderVideoBtn = () => {
    //选中的一级菜单索引
    const firstIndex = sessionStorage.getItem(cache.FIRST_ACTIVE);
    //选中的二级菜单索引
    const secondIndex = sessionStorage.getItem(cache.SECOND_ACTIVE);
    //选中的三级菜单索引
    const thirdIndex = sessionStorage.getItem(cache.THIRD_ACTIVE);
    //所有菜单
    const allGradeMenus = fromJS(
      JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS))
    );
    let third =
      allGradeMenus.getIn([
        firstIndex,
        'children',
        secondIndex,
        'children',
        thirdIndex
      ]);
    third = third ? third.toJS() : '';
    const { thirdLevel } = this.props;
    if (!thirdLevel && third) {
      let flag = false;
      const cateList = JSON.parse(sessionStorage.getItem('cateList')) || [];
      cateList.forEach(item => {
        item.children.forEach(cd => {
          if (cd.id === third.id && cd.uploadFlag === 1 && third.url !== '/video-tutorial') {
            flag = true;
            return
          }
        });
        if (flag) {
          return;
        }
      });
      if (flag) {
        let vtFirst;
        let vtSecond;
        let vtThird;
        allGradeMenus.toJS().forEach((item, index1) => {
          item.children && item.children.forEach((cd, index2) => {
            cd.children.forEach((opt, index3) => {
              if(opt.url === '/video-tutorial'){
                vtFirst = index1;
                vtSecond = index2;
                vtThird = index3;
              }
            })
          })
        })
        return (
          <Button
            onClick={() => {
              sessionStorage.setItem(cache.FIRST_ACTIVE, vtFirst);
              sessionStorage.setItem(cache.SECOND_ACTIVE, vtSecond);
              sessionStorage.setItem(cache.THIRD_ACTIVE, vtThird);
              history.push(`/video-tutorial/${third.id}/${third.url.replace('/', '')}`)
            }}
            type='link'
            icon='youtube'
            style={{float: 'right'}}
          >
            查看视频教程
          </Button>
        )
      }
    }
  }
}
