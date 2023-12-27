import React from 'react';
import { IMap, Relax } from 'plume2';
import { Checkbox } from 'antd';
import { noop } from 'qmkit';
const defaultImg = require('../../images/none.png');

@Relax
export default class GiftList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      marketingGiftList: IMap;
      getGiftList: Function;
      onCheckGift: Function;
    };
    giftMarketing: any;
    customerId: string;
  };

  static relaxProps = {
    marketingGiftList: 'marketingGiftList',
    customerId: 'customerId',
    getGiftList: noop,
    onCheckGift: noop
  };

  constructor(props) {
    super(props);
    //气泡框初始时，先触发一次赠品详细信息的获取
    props.relaxProps.getGiftList({
      marketingId: props.giftMarketing.get('marketingId'),
      customerId: props.customerId
    });
  }

  render() {
    const { giftMarketing } = this.props;
    const { marketingGiftList, onCheckGift } = this.props.relaxProps;
    const gifts = marketingGiftList.get(giftMarketing.get('marketingId'));

    //如果gifts为空，则说明初始时没有赠品详细信息
    //放弃本次渲染，等下次gifts获取完毕后再渲染
    if (gifts == undefined) return null;

    return (
      <div style={styles.giftPopover}>
        {giftMarketing.get('fullGiftLevelList').map((level) => (
          <div key={level.get('giftLevelId')}>
            <div style={{ color: '#999' }}>
              满
              {giftMarketing.get('subType') == 5
                ? `${level.get('fullCount')}箱`
                : `${level.get('fullAmount')}元`}
              可获以下赠品，可选{level.get('giftType') == 1 ? '1种' : '全部'}
            </div>
            {level.get('fullGiftDetailList').map((giftDetail) => {
              const gift = gifts
                .filter(
                  (gift) =>
                    gift.get('goodsInfoId') == giftDetail.get('productId')
                )
                .first();
              let giftDisable = false;
              let disableInfo = '';

              if (gift.get('goodsStatus') == 2) {
                giftDisable = true;
                disableInfo = '失效';
              }
              if (gift.get('stock') < 1) {
                giftDisable = true;
                disableInfo = '缺货';
              }

              return (
                <div
                  key={giftDetail.get('giftDetailId')}
                  style={styles.giftRow}
                >
                  <div style={{ display: 'inline-block', marginRight: 10 }}>
                    <Checkbox
                      checked={giftDetail.get('checked')}
                      disabled={giftDisable || !level.get('edit')}
                      onChange={(e) => {
                        onCheckGift({
                          checked: (e.target as any).checked,
                          marketingId: giftMarketing.get('marketingId'),
                          giftLevelId: level.get('giftLevelId'),
                          giftDetailId: giftDetail.get('giftDetailId')
                        });
                      }}
                    />
                  </div>
                  <div style={styles.ImgBox}>
                    <img
                      src={
                        gift.get('goodsInfoImg')
                          ? gift.get('goodsInfoImg')
                          : defaultImg
                      }
                      alt=""
                      width="58"
                      height="58"
                    />
                    {giftDisable ? (
                      <span style={styles.imgError}>{disableInfo}</span>
                    ) : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.proName}>
                      {gift.get('goodsInfoName')}
                    </div>
                    <div style={styles.proDec}>{gift.get('specText')}</div>
                  </div>
                  <div style={styles.rightColumn}>
                    <span style={styles.price}>¥{gift.get('marketPrice')}</span>
                    <span>*{giftDetail.get('productNum')}盒</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

const styles = {
  giftPopover: {
    width: 400
  },
  giftRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  ImgBox: {
    marginRight: 8,
    position: 'relative'
  },
  imgError: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 58,
    height: 58,
    textAlign: 'center',
    lineHeight: '58px',
    backgroundColor: 'rgba(0,0,0,.5)',
    color: '#fff'
  },
  rightColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    display: 'flex'
  },
  proName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 280,
    height: 21,
    color: '#333'
  },
  proDec: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 280,
    height: 21,
    color: '#999'
  },
  price: {
    color: '#cb4255',
    textAlign: 'right'
  }
} as any;
