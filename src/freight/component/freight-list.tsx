import React from 'react';

import FreightItem from './freight-item';

/**
 * 运费模板List
 */
export default class FreightList extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, isStore } = this.props;
    return data.map((d) => (
      <FreightItem
        key={Math.random()}
        data={
          isStore
            ? [d]
            : (d.freightTemplateGoodsExpresses || []).map((f) => {
                f.wareName = d.wareName;
                f.deliverWay = d.deliverWay;
                return f;
              })
        }
        title={d.freightTempName}
        isDefault={d.defaultFlag == 1}
        typeFlag={!isStore}
        freightId={d.freightTempId}
        isStore={isStore}
        valuationType={d.valuationType}
      />
    ));
  }
}
