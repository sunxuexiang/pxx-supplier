import React from 'react';
import { Relax, IMap } from 'plume2';

import { fromJS } from 'immutable';
import { Button, Pagination } from 'antd';
import { history, noop, checkAuth } from 'qmkit';

import FreightList from './freight-list';

/**
 * 店铺运费模板
 */
@Relax
export default class StoreSetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // 店铺模板
      storeFreight: IMap;
      pageType: number;
      // 分页
      freightTemplateStore: Function;
    };
  };

  static relaxProps = {
    // 店铺模板
    storeFreight: 'storeFreight',
    // 来源 0 快递到家 1同城配送
    pageType: 'pageType',
    // 分页
    freightTemplateStore: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      storeFreight,
      freightTemplateStore,
      pageType
    } = this.props.relaxProps;
    const { content, number, totalElements, size } = (
      storeFreight ||
      fromJS({
        content: [],
        number: 0,
        size: 10,
        totalElements: 0
      })
    ).toJS();
    return [
      checkAuth('f_store_temp_edit') ? (
        <Button
          type="primary"
          onClick={() =>
            history.push({ pathname: '/store-freight', state: { pageType } })
          }
          key="button"
        >
          新增店铺运费模板
        </Button>
      ) : null,
      <FreightList key="freightList" data={content} isStore={true} />,
      <Pagination
        key="Pagination"
        onChange={(pageNum, pageSize) =>
          freightTemplateStore(pageNum - 1, pageSize)
        }
        current={number}
        total={totalElements}
        pageSize={size}
      />
    ];
  }
}
