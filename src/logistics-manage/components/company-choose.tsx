import React from 'react';

import { Row, Col, Checkbox } from 'antd';
import { Relax } from 'plume2';
import { List } from 'immutable';

import { noop } from 'qmkit';

@Relax
export default class CompanyChoose extends React.Component<any, any> {
  props: {
    relaxProps?: {
      allExpressList: List<any>;
      onChecked: Function;
    };
  };
  static relaxProps = {
    allExpressList: 'allExpressList',
    onChecked: noop
  };

  render() {
    return (
      <div>
        <div style={styles.title}>选择快递公司</div>
        <Row type="flex" justify="start" style={styles.box}>
          {this.props.relaxProps.allExpressList.toJS().map((v, i) => {
            return (
              <Col span={3} key={v.expressCompanyId}>
                <Checkbox
                  style={styles.item}
                  checked={v.isChecked}
                  onChange={(e) =>
                    this._handleOnChange(
                      i,
                      (e.target as any).checked,
                      v.expressCompanyId
                    )
                  }
                >
                  {v.expressName}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }

  _handleOnChange = (index, checked, expressCompanyId) => {
    const { onChecked } = this.props.relaxProps;
    if (checked) {
      onChecked(index, checked, expressCompanyId);
    } else {
      onChecked(index, checked, expressCompanyId);
    }
  };
}

const styles = {
  title: {
    background: '#f7f7f7',
    height: 32,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  } as any,
  box: {
    padding: 20
  },
  item: {
    height: 40
  },
  hide: {
    display: 'none'
  },
  show: {
    display: 'block'
  }
};
