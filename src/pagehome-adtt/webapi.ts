import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

const mockFetch = async (data) => {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 50);
  });
  return { res };
};
/**
 * 获取首页列表
 */
export function couponList(params) {
  return Fetch<TResult>('/home/page/advertising/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
  // const mockData = {
  //   code: 'K-000000',
  //   message: null,
  //   errorData: null,
  //   context: {
  //     advertisingPage: {
  //       number: 0,
  //       size: 10,
  //       total: 6,
  //       content: [
  //         {
  //           advertisingId: '2c9afcf37f5b19dc017f6d4bbd590010',
  //           advertisingName: '每日新品',
  //           advertisingType: 1,
  //           delFlag: 0,
  //           sortNum: 6,
  //           createTime: '2022-03-09 14:09:15.000',
  //           createPerson: '18390882751',
  //           updateTime: '2023-01-09 11:35:08.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c9fb80f857c2ff1018594989df7000c',
  //               advertisingId: '2c9afcf37f5b19dc017f6d4bbd590010',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202207211414547877.png',
  //               jumpLink: '',
  //               moFangAdvertisingName: '长沙仓弹窗',
  //               moFangPageCode: '1661169107635',
  //               isSuit: 0
  //             },
  //             {
  //               advertisingConfigId: '2c9fb80f857c2ff1018594989df9000d',
  //               advertisingId: '2c9afcf37f5b19dc017f6d4bbd590010',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202208041013559030.png',
  //               jumpLink: '',
  //               moFangAdvertisingName: '每日新品-长沙',
  //               moFangPageCode: '1607064256955',
  //               isSuit: 0
  //             }
  //           ]
  //         },
  //         {
  //           advertisingId: '2c9afcf3816f56af0181fc24ba8e0030',
  //           advertisingName: '超级大牌日',
  //           advertisingType: 0,
  //           delFlag: 0,
  //           sortNum: 5,
  //           createTime: '2022-07-14 17:57:54.000',
  //           createPerson: 'system',
  //           updateTime: '2022-11-17 09:39:33.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c9fb80f846eee4a0184833dc1260021',
  //               advertisingId: '2c9afcf3816f56af0181fc24ba8e0030',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202208030950579410.jpg',
  //               jumpLink: '',
  //               moFangAdvertisingName: '长沙超级大牌日无尽',
  //               moFangPageCode: '1659317206228',
  //               isSuit: 0
  //             }
  //           ]
  //         },
  //         {
  //           advertisingId: '2c9afcf4816877dc01816f23af710009',
  //           advertisingName: '长沙白鲸闪购',
  //           advertisingType: 0,
  //           delFlag: 0,
  //           sortNum: 4,
  //           createTime: '2022-06-17 08:50:19.000',
  //           createPerson: 'system',
  //           updateTime: '2023-01-12 15:05:47.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c9fb80f857c2ff10185a4cc8ef2000e',
  //               advertisingId: '2c9afcf4816877dc01816f23af710009',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202301121505458678.png',
  //               jumpLink: '',
  //               moFangAdvertisingName: '长沙白鲸闪购',
  //               moFangPageCode: '1659581028968',
  //               isSuit: 0
  //             }
  //           ]
  //         },
  //         {
  //           advertisingId: '2c9fb80f841753e2018421776bc90013',
  //           advertisingName: '散批专场首页通栏测试',
  //           advertisingType: 0,
  //           delFlag: 0,
  //           sortNum: 1,
  //           createTime: '2022-10-29 09:59:45.000',
  //           createPerson: 'system',
  //           updateTime: '2023-05-18 02:32:57.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c97d6e287cb13b001882cb40c740013',
  //               advertisingId: '2c9fb80f841753e2018421776bc90013',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202211261003438044.gif',
  //               jumpLink: '',
  //               moFangAdvertisingName: '',
  //               moFangPageCode: '',
  //               isSuit: 3
  //             }
  //           ]
  //         },
  //         {
  //           advertisingId: '2c9fb80f8485889f018486b2d5f90000',
  //           advertisingName: '散批专场首页分栏测试',
  //           advertisingType: 1,
  //           delFlag: 0,
  //           sortNum: 3,
  //           createTime: '2022-11-18 01:46:18.000',
  //           createPerson: 'system',
  //           updateTime: '2023-05-18 02:33:14.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c97d6e287cb13b001882cb44d2a0015',
  //               advertisingId: '2c9fb80f8485889f018486b2d5f90000',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202211180145143175.jpeg',
  //               jumpLink: '',
  //               moFangAdvertisingName: null,
  //               moFangPageCode: null,
  //               isSuit: 3
  //             },
  //             {
  //               advertisingConfigId: '2c97d6e287cb13b001882cb44d2b0016',
  //               advertisingId: '2c9fb80f8485889f018486b2d5f90000',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202211180145185768.jpeg',
  //               jumpLink: '',
  //               moFangAdvertisingName: null,
  //               moFangPageCode: null,
  //               isSuit: 3
  //             }
  //           ]
  //         },
  //         {
  //           advertisingId: '2c9fb80f857c2ff101859493e0fb0004',
  //           advertisingName: '通知广告',
  //           advertisingType: 0,
  //           delFlag: 0,
  //           sortNum: 2,
  //           createTime: '2023-01-09 11:29:57.000',
  //           createPerson: 'system',
  //           updateTime: '2023-05-18 02:33:07.000',
  //           updatePerson: 'system',
  //           delTime: null,
  //           delPerson: null,
  //           wareId: 1,
  //           advertisingConfigList: [
  //             {
  //               advertisingConfigId: '2c97d6e287cb13b001882cb4329c0014',
  //               advertisingId: '2c9fb80f857c2ff101859493e0fb0004',
  //               advertisingImage:
  //                 'https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202301091129546422.gif',
  //               jumpLink: '',
  //               moFangAdvertisingName: '',
  //               moFangPageCode: '',
  //               isSuit: 1
  //             }
  //           ]
  //         }
  //       ],
  //       first: true,
  //       sort: null,
  //       numberOfElements: 6,
  //       totalPages: 1,
  //       totalElements: 6,
  //       last: true,
  //       empty: false
  //     }
  //   }
  // };
  // return mockFetch(mockData);
}

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>('/home/page/advertising', {
    method: 'DELETE',
    body: JSON.stringify({ advertisingId: id })
  });
}

/**
 * 查询storeId
 */
export const getStore = () => {
  return fetch(Const.HOST + '/store/storeInfo', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (window as any).token
    }
  }).then((res: any) => {
    return res.json();
  });
};
