import React from 'react';
import { Relax } from 'plume2';

import { Button } from 'antd';
import { history, checkAuth } from 'qmkit';
import { IList } from 'typings/globalType';

import FreightList from './freight-list';

/**
 * 单品运费模板
 */
@Relax
export default class GoodsSetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // 单品模板
      goodsFreights: IList;
      pageType: number;
    };
  };

  static relaxProps = {
    // 单品模板
    goodsFreights: 'goodsFreights',
    // 页面来源
    pageType: 'pageType'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { goodsFreights, pageType } = this.props.relaxProps;
    return [
      goodsFreights.count() < 20 && checkAuth('f_goods_temp_edit') && (
        <Button
          type="primary"
          onClick={() => {
            const routerName =
              pageType === 1 ? '/goods-same-city-freight' : '/goods-freight';
            history.push(routerName);
          }}
          key="button"
        >
          新增单品运费模板
        </Button>
      ),
      <FreightList
        key="feightList"
        data={goodsFreights.toJS()}
        isStore={false}
      />
    ];
  }
}
