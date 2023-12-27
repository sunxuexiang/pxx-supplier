import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Breadcrumb, Button, Form, Input, message } from 'antd';
import { noop } from 'qmkit';
import VideoList from './video-list';
import VidelDetail from './video-detail';

import '../index.less';

const FormItem = Form.Item;
const { Search } = Input;
declare type IList = List<any>;

@Relax
export default class VidelTab extends React.Component<any, any> {
  WrapperForm: any;
  props: {
    showBackBtn: boolean;
    backPage: Function;
    relaxProps?: {
      defaultCheckedKey: any; //默认选中节点
      selectVideoCate: Function; //选中视频分类
      cateAllList: IList; //扁平的分类列表信息
      visible: boolean; // 是否显示视频详情
      queryVideoPage: Function; //查询视频信息分页列表
      resourceName: string; // 视频搜索条件
      searchChange: Function; //搜索条件change
    };
  };

  static relaxProps = {
    defaultCheckedKey: 'defaultCheckedKey',
    visible: 'visible',
    cateAllList: 'cateAllList',
    resourceName: 'resourceName',
    selectVideoCate: noop,
    queryVideoPage: noop,
    searchChange: noop
  };

  getBreadcrumb = () => {
    const {
      defaultCheckedKey,
      cateAllList,
      selectVideoCate
    } = this.props.relaxProps;
    const current = cateAllList
      .toJS()
      .filter((item) => item.cateId === defaultCheckedKey);
    let list = current[0].catePath.split('|');
    list.shift();
    list.pop();
    list.push(current[0]);
    return list.map((item, index) => {
      let opt: any = '';
      if (index !== list.length - 1 && list.length > 1) {
        cateAllList.toJS().forEach((cd) => {
          if (cd.cateId === item) {
            opt = (
              <Breadcrumb.Item>
                <span
                  onClick={() => selectVideoCate(cd.cateId)}
                  className="vt-bread-item"
                >
                  {cd.cateName}
                </span>
              </Breadcrumb.Item>
            );
          }
        });
      } else {
        opt = (
          <Breadcrumb.Item>
            <span
              onClick={() => selectVideoCate(item.cateId)}
              className="vt-bread-item"
            >
              {item.cateName}
            </span>
          </Breadcrumb.Item>
        );
      }
      return opt;
    });
  };

  render() {
    const { showBackBtn, backPage, relaxProps } = this.props;
    const {
      defaultCheckedKey,
      visible,
      queryVideoPage,
      resourceName,
      searchChange
    } = relaxProps;
    return (
      <div>
        <div className="vt-tab-title">
          <span>视频教程</span>
          <SearchForm
            queryVideoPage={queryVideoPage}
            resourceName={resourceName}
            searchChange={searchChange}
          />
        </div>
        <div className="vt-tab-breadcrumb">
          {defaultCheckedKey && <Breadcrumb>{this.getBreadcrumb()}</Breadcrumb>}
          {showBackBtn && (
            <Button onClick={() => backPage()}>返回操作页面</Button>
          )}
        </div>

        <div className="vt-tab">
          {visible && <VidelDetail />}
          {!visible && <VideoList />}
        </div>
      </div>
    );
  }
}

class SearchForm extends React.Component<any, any> {
  props: {
    queryVideoPage: Function;
    resourceName: string;
    searchChange: Function;
  };

  onSearch = (value) => {
    const { queryVideoPage } = this.props;
    if (!value) {
      message.error('请输入视频名称');
      return;
    }
    queryVideoPage();
  };

  render(): React.ReactNode {
    const { searchChange, resourceName } = this.props;
    return (
      <Form layout="inline">
        <FormItem>
          <Search
            enterButton="搜索"
            placeholder="请输入视频名称"
            value={resourceName}
            onSearch={this.onSearch}
            onChange={(e) => searchChange(e)}
          />
        </FormItem>
      </Form>
    );
  }
}
