import React from 'react';
import { Relax } from 'plume2';
import { Button, Menu, Radio } from 'antd';
import { AuthWrapper, history, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
    };
  };

  static relaxProps = {
    form: 'form'
  };

  render() {
    const { form } = this.props.relaxProps;
    return (
      <div>
        <div className="handle-bar">
          <Button
            type="primary"
            onClick={() =>
              history.push({
                pathname: 'pagehome-addtl',
                state: {
                  homeType: '0'
                }
              })
            }
          >
            新建通栏推荐位
          </Button>
          <Button
            type="primary"
            onClick={() =>
              history.push({
                pathname: 'pageclass-addtl',
                state: {
                  couponType: '1',
                  source: 'list'
                }
              })
            }
          >
            新建分栏推荐位
          </Button>
          <Button
            type="primary"
            onClick={() =>
              history.push({
                pathname: 'pagehome-swit',
                state: {
                  couponType: '2',
                  source: 'list'
                }
              })
            }
          >
            新建轮播推荐位
          </Button>
        </div>
      </div>
    );
  }
}
