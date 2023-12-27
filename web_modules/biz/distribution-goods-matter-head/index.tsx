import React from 'react';

const defaultImg = require('./img/none.png');
export default class DistributionGoodsMatterHead extends React.Component<
  any,
  any
  > {
  props: {
    skuImageUrl: string;
    skuName: string;
    skuSpe: string;
    skuNo: string;
  };

  render() {
    const { skuImageUrl, skuName, skuNo, skuSpe } = this.props;
    return (
      <div>
        <div>
          <img
            src={skuImageUrl ? skuImageUrl : defaultImg}
            style={styles.imgItem}
          />
          <p style={styles.title}>{skuName}</p>
          <p style={styles.spec}>{skuSpe}</p>
          <p style={styles.spec}>{skuNo}</p>
        </div>
      </div>
    );
  }
}
const styles = {
  container: {
    backgroundColor: '#fafafa',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 14,
    color: '#333'
  },
  spec: {
    fontSize: 12,
    color: '#999'
  },
  imgItem: {
    width: 60,
    height: 60,
    border: '1px solid #eee',
    marginRight: 5
  }
} as any;
