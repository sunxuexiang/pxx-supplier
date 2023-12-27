const routes = [
  //首页
  { path: '/', exact: true, asyncComponent: () => import('./home') },
  //订单列表
  {
    path: '/order-list',
    exact: true,
    asyncComponent: () => import('./order-list')
  },
  //囤货订单列表
  {
    path: '/th_order-list',
    exact: true,
    asyncComponent: () => import('./th_order-list')
  },
  //分销记录
  {
    path: '/distribution-record',
    exact: true,
    asyncComponent: () => import('./distribution-record')
  },
  {
    path: '/message-release',
    asyncComponent: () => import('./message-release')
  },
  //订单-新增/编辑
  {
    path: '/order-edit/:tid',
    exact: true,
    asyncComponent: () => import('./order-add')
  },
  {
    path: '/order-add',
    exact: true,
    asyncComponent: () => import('./order-add')
  },
  //订单-详情
  {
    path: '/order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail')
  },
  //囤货订单-详情
  {
    path: '/th_order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./th_order-detail')
  },
  //订单-详情-打印
  {
    path: '/order-detail-print/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail-print')
  },
  // 面单打印
  {
    path: '/express-order-print/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail-print/express-order-print')
  },
  //囤货订单-详情-打印
  {
    path: '/th_order-detail-print/:tid',
    exact: true,
    asyncComponent: () => import('./th_order-detail-print')
  },
  //订单-退单列表
  {
    path: '/order-return-list',
    exact: true,
    asyncComponent: () => import('./order-return-list')
  },
  //订单-退单列表
  {
    path: '/th_order-return-list',
    exact: true,
    asyncComponent: () => import('./th_order-return-list')
  },
  //订单-退单列表-发起售后申请
  {
    path: '/order-return-apply-list',
    exact: true,
    asyncComponent: () => import('./order-return-apply-list')
  },
  //代客订单-退单列表-发起售后申请
  {
    path: '/th_daike_order_list',
    exact: true,
    asyncComponent: () => import('./th_daike_order_list')
  },
  //囤货订单-退单列表-发起售后申请
  {
    path: '/th-order-return-apply-list',
    exact: true,
    asyncComponent: () => import('./th_order-return-apply-list')
  },
  //订单-订单管理-订单列表-新增退单
  {
    path: '/order-return-add',
    exact: true,
    asyncComponent: () => import('./order-return-add')
  },
  //囤货订单-投入和订单管理-订单列表-囤货新增退单
  {
    path: '/th_order-return-add',
    exact: true,
    asyncComponent: () => import('./th_order-return-add')
  },
  //订单-订单管理-退单列表-修改退单
  {
    path: '/order-return-edit/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-edit')
  },
  //囤货订单-订单管理-退单列表-修改退单
  {
    path: '/th_order-return-edit/:rid',
    exact: true,
    asyncComponent: () => import('./th_order-return-edit')
  },
  //订单-订单管理-退单详情
  {
    path: '/order-return-detail/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-detail')
  },
  //囤货订单-订单管理-退单详情
  {
    path: '/th_order_return_detail/:rid',
    exact: true,
    asyncComponent: () => import('./th_order_return_detail')
  },
  //财务-收款账户
  {
    path: '/finance-account-receivable',
    asyncComponent: () => import('./finance-account-receivable')
  },
  //订单收款
  {
    path: '/finance-order-receive',
    asyncComponent: () => import('./finance-order-receive')
  },
  //退单退款
  {
    path: '/finance-refund',
    asyncComponent: () => import('./finance-refund')
  },
  //收款详情
  {
    path: '/finance-receive-detail',
    asyncComponent: () => import('./finance-receive-detail')
  },
  //退款明细
  {
    path: '/finance-refund-detail',
    asyncComponent: () => import('./finance-refund-detail')
  },
  //增值税资质审核
  {
    path: '/finance-val-added-tax',
    asyncComponent: () => import('./finance-val-added-tax')
  },
  //订单开票
  {
    path: '/finance-order-ticket',
    asyncComponent: () => import('./finance-order-ticket')
  },
  //财务-开票管理
  {
    path: '/finance-ticket-manage',
    asyncComponent: () => import('./finance-ticket-manage')
  },
  // 员工列表
  {
    path: '/employee-list',
    asyncComponent: () => import('./employee-list')
  },
  // 员工导入
  {
    path: '/employee-import',
    asyncComponent: () => import('./employee-import')
  },
  // 部门管理
  {
    path: '/department-mangement',
    asyncComponent: () => import('./department-mangement')
  },
  // 部门导入
  {
    path: '/department-import',
    asyncComponent: () => import('./department-import')
  },
  // 角色列表
  {
    path: '/role-list',
    asyncComponent: () => import('./role-list')
  },
  // 权限分配
  {
    path: '/authority-allocating/:roleInfoId/:roleName',
    asyncComponent: () => import('./authority-allocating')
  },
  // 店铺分类
  { path: '/goods-cate', asyncComponent: () => import('./goods-cate') },
  // 详情模板
  {
    path: '/goods-detail-template',
    asyncComponent: () => import('./goods-detail-tab')
  },
  // 商品添加
  { path: '/goods-add', asyncComponent: () => import('./goods-add') },
  // 审核通过的商品编辑
  {
    path: '/goods-edit/:gid/:pageNum',
    asyncComponent: () => import('./goods-add')
  },
  // 审核通过的商品编辑
  {
    path: '/ls_goods-edit/:gid/:pageNum',
    asyncComponent: () => import('./ls_goods-add')
  },
  // 审核通过的商品编辑(散批)
  {
    path: '/bd_goods-edit/:gid/:pageNum',
    asyncComponent: () => import('./bd_goods-add')
  },
  // 审核不通过的商品编辑
  {
    path: '/goods-check-edit/:gid',
    asyncComponent: () => import('./goods-add')
  },
  // 审核通过的商品sku编辑
  {
    path: '/ls_goods-sku-edit/:pid',
    asyncComponent: () => import('./ls_goods-sku-edit')
  },
  // 审核通过的商品sku编辑（散批）
  {
    path: '/bd_goods-sku-edit/:pid',
    asyncComponent: () => import('./bd_goods-sku-edit')
  },
  // 审核通过的商品sku编辑
  {
    path: '/goods-sku-edit/:pid',
    asyncComponent: () => import('./goods-sku-edit')
  },
  // 审核不通过的商品sku编辑
  {
    path: '/goods-sku-check-edit/:pid',
    asyncComponent: () => import('./goods-sku-edit')
  },
  // 商品详情
  {
    path: '/goods-detail/:gid',
    asyncComponent: () => import('./goods-detail')
  },
  // 商品详情SKU
  {
    path: '/goods-sku-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },
  // 商品列表
  {
    path: '/goods-list',
    asyncComponent: () => import('./goods-list')
  },
  // 商品列表(零售)
  { path: '/ls-goods-list', asyncComponent: () => import('./ls-goods-list') },
  // 商品列表（散批）
  { path: '/bd-goods-list', asyncComponent: () => import('./bd-goods-list') },
  // 待审核商品列表
  {
    path: '/goods-check',
    asyncComponent: () => import('./goods-check')
  },
  //特价商品
  {
    path: '/goods-special-list',
    asyncComponent: () => import('./goods-special-list')
  },
  // 客户列表
  {
    path: '/customer-list',
    asyncComponent: () => import('./customer-list')
  },
  // 客户等级
  {
    path: '/customer-level',
    asyncComponent: () => import('./customer-level')
  },
  // 基本设置
  {
    path: '/basic-setting',
    asyncComponent: () => import('./basic-setting')
  },
  // 散批凑箱设置
  {
    path: '/gather-together-setting',
    asyncComponent: () => import('./gather-together-setting')
  },
  // 套装设置
  {
    path: '/suit-setting',
    asyncComponent: () => import('./suit-setting')
  },
  // 店铺信息
  {
    path: '/store-info/:tabKey?',
    asyncComponent: () => import('./shop/store-info-index')
  },
  //店铺信息编辑
  {
    path: '/store-info-edit',
    asyncComponent: () => import('./shop/store-info-edit')
  },
  // 图片库
  {
    path: '/picture-store',
    asyncComponent: () => import('./picture-store')
  },
  // 视频库
  {
    path: '/video-store',
    asyncComponent: () => import('./video-store')
  },
  // 图片分类
  {
    path: '/picture-cate',
    asyncComponent: () => import('./picture-cate')
  },
  // 素材分类
  {
    path: '/resource-cate',
    asyncComponent: () => import('./resource-cate')
  },
  // 账号管理
  {
    path: '/account-manage',
    asyncComponent: () => import('./account-manage')
  },
  // 物流公司管理
  {
    path: '/logistics-manage',
    asyncComponent: () => import('./logistics-manage')
  },
  // 商品导入
  {
    path: '/goods-import',
    asyncComponent: () => import('./goods-import')
  },
  // 商品导入
  {
    path: '/goods-update-import',
    asyncComponent: () => import('./goods-update-import')
  },
  // 代客下单 商品导入
  {
    path: '/goods_import',
    asyncComponent: () => import('./goods_import')
  },
  //资金管理-财务对账
  {
    path: '/finance-manage-check',
    asyncComponent: () => import('./finance-manage-check')
  },
  //资金管理-财务对账-明细
  //{ path: '/finance-manage-refund/:sid/income', asyncComponent: () => import('./finance-manage-refund') },
  //资金管理-财务结算
  {
    path: '/finance-manage-settle',
    asyncComponent: () => import('./finance-manage-settle')
  },
  // 商品-指定区域限购
  {
    path: '/sale-area',
    asyncComponent: () => import('./sale-area')
  },
  // 商品-指定区域限购 新增/编辑
  {
    path: '/sale-area-form',
    asyncComponent: () => import('./sale-area-form')
  },
  //结算明细
  {
    path: '/billing-details/:settleId',
    asyncComponent: () => import('./billing-details')
  },
  //收款账户-商家收款账户
  {
    path: '/vendor-payment-account',
    asyncComponent: () => import('./vendor-payment-account')
  },
  //收款账户-商家收款账户-新增账号
  {
    path: '/vendor-new-accounts',
    asyncComponent: () => import('./vendor-new-accounts')
  },
  //提现账户-商家提现账户
  {
    path: '/withdrawal-account',
    asyncComponent: () => import('./withdrawal-account')
  },
  //开票管理-开票项目
  {
    path: '/finance-ticket-new',
    asyncComponent: () => import('./finance-ticket-new')
  },
  //发布商品
  {
    path: '/release-products',
    asyncComponent: () => import('./release-products')
  },
  //资金管理-财务对账-明细
  {
    path: '/finance-manage-refund/:sid/:kind',
    asyncComponent: () => import('./finance-manage-refund')
  },
  //流量统计
  {
    path: '/flow-statistics',
    asyncComponent: () => import('./flow-statistics')
  },
  //交易统计
  {
    path: '/trade-statistics',
    asyncComponent: () => import('./trade-statistics')
  },
  //商品统计
  {
    path: '/goods-statistics',
    asyncComponent: () => import('./goods-statistics')
  },
  //客户统计
  {
    path: '/customer-statistics',
    asyncComponent: () => import('./customer-statistics')
  },
  //业务员统计
  {
    path: '/employee-statistics',
    asyncComponent: () => import('./employee-statistics')
  },
  //报表下载
  {
    path: '/download-report',
    asyncComponent: () => import('./download-report')
  },
  //编辑营销-满赠
  {
    path: '/marketing-full-gift/:marketingId?/:type?',
    asyncComponent: () => import('./marketing-add/full-gift')
  },
  //编辑营销-满折
  {
    path: '/marketing-full-discount/:marketingId?/:type?',
    asyncComponent: () => import('./marketing-add/full-discount')
  },
  //新增 / 编辑营销-满减
  {
    path: '/marketing-full-reduction/:marketingId?/:type?',
    asyncComponent: () => import('./marketing-add/full-reduction')
  },
  //营销列表
  {
    path: '/marketing-list',
    asyncComponent: () => import('./marketing-list')
  },
  //返鲸币活动
  {
    path: '/jinbi-return-list',
    asyncComponent: () => import('./jinbi-return-list')
  },
  //返鲸币活动详情
  {
    path: '/jinbi-return-details/:activityId/:pageNum?/:have?',
    asyncComponent: () => import('./jinbi-return-details')
  },
  //购买套餐
  {
    path: '/goodm',
    asyncComponent: () => import('./goodm')
  },
  //营销-满赠详情
  {
    path: '/marketing-details/:marketingId/:pageNum?/:have?',
    asyncComponent: () => import('./marketing-details')
  },
  //营销中心
  {
    path: '/marketing-center',
    asyncComponent: () => import('./marketing-center')
  },
  //营销中心-指定商品返鲸币
  {
    path: '/jinbi-return',
    asyncComponent: () => import('./jinbi-return')
  },
  // 商品库导入
  {
    path: '/goods-library',
    asyncComponent: () => import('./goods-library')
  },
  // 供应商商品库列表
  {
    path: '/goods-library-provider-list',
    asyncComponent: () => import('./goods-library-provider-list')
  },
  // 运费模板
  {
    path: '/freight',
    asyncComponent: () => import('./freight')
  },
  // 运费模版（同城配送）
  {
    path: '/freight-same-city',
    asyncComponent: () => import('./freight/same-city-index')
  },
  // 新增店铺运费模板
  {
    path: '/store-freight',
    asyncComponent: () => import('./freight-store')
  },
  // 编辑店铺运费模板
  {
    path: '/store-freight-edit/:freightId',
    asyncComponent: () => import('./freight-store')
  },
  // 编辑同城配送店铺运费模板
  {
    path: '/store-freight-same-city-edit/:freightId',
    asyncComponent: () => import('./freight-store')
  },
  // 新增单品运费模板
  {
    path: '/goods-freight',
    asyncComponent: () => import('./freight-goods')
  },
  // 新增同城配送单品运费模板
  {
    path: '/goods-same-city-freight',
    asyncComponent: () => import('./freight-goods/same-city-index')
  },
  // 编辑单品运费模板
  {
    path: '/goods-freight-edit/:freightId',
    asyncComponent: () => import('./freight-goods')
  },
  // 编辑同城配送单品运费模板
  {
    path: '/goods-freight-same-city-edit/:freightId',
    asyncComponent: () => import('./freight-goods/same-city-index')
  },
  // 运费模板关联商品
  {
    path: '/freight-with-goods/:freightId',
    asyncComponent: () => import('./freight-with-goods')
  },
  // 同城配送运费模板关联商品
  {
    path: '/freight-with-same-city-goods/:freightId',
    asyncComponent: () => import('./freight-with-goods/same-city-index')
  },
  //在线客服
  {
    path: '/online-service',
    asyncComponent: () => import('./online-service')
  },
  //操作日志
  {
    path: '/operation-log',
    asyncComponent: () => import('./operation-log')
  },
  // 优惠券列表
  {
    path: '/coupon-list',
    asyncComponent: () => import('./coupon-list')
  },
  // 优惠券详情
  {
    path: '/coupon-detail/:cid',
    asyncComponent: () => import('./coupon-detail')
  },
  // 营销中心 - 创建优惠券
  {
    path: '/coupon-add',
    asyncComponent: () => import('./coupon-add')
  },
  {
    path: '/goodmadd/:marketingId?',
    asyncComponent: () => import('./goodmadd/full-discount')
  },
  {
    path: '/goodmdlist',
    asyncComponent: () => import('./goodmdlist')
  },
  // 营销中心 - 编辑优惠券
  {
    path: '/coupon-edit/:cid',
    asyncComponent: () => import('./coupon-add')
  },
  // 囤货活动
  {
    path: '/stock-activity',
    asyncComponent: () => import('./stock-activity')
  },
  // 囤货活动-商品
  {
    path: '/stock-activity-goods/:activityId',
    asyncComponent: () => import('./stock-activity-goods')
  },
  // 囤货活动详情
  {
    path: '/stock-activity-dis/:marketingId',
    asyncComponent: () => import('./stock-activity-dis')
  },
  // 囤货活动编辑
  {
    path: '/stock-activity-edit/:marketingId?/:type?',
    asyncComponent: () => import('./stock-activity-edit')
  },
  // 优惠券活动
  {
    path: '/coupon-activity-list',
    asyncComponent: () => import('./coupon-activity-list')
  },
  // 优惠券活动详情
  {
    path: '/coupon-activity-detail/:id/:type',
    asyncComponent: () => import('./coupon-activity-detail')
  },
  // 创建/编辑全场赠券活动
  {
    path: '/coupon-activity-all-present/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/all-present')
  },
  //创建/编辑指定商品赠券
  {
    path: '/coupon-goods-add/:activityId?',
    asyncComponent: () => import('./coupon-goods-add')
  },
  //创建/编辑进店赠券活动
  {
    path: '/coupon-activity-store/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/store')
  },
  //创建/编辑精准发券活动
  {
    path: '/coupon-activity-specify/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/specify')
  },
  //分销设置
  {
    path: '/distribution-setting',
    asyncComponent: () => import('./distribution-setting')
  },
  //分销商品
  {
    path: '/distribution-goods-list',
    asyncComponent: () => import('./distribution-goods-list')
  },
  //企业购商品
  {
    path: '/enterprise-goods-list',
    asyncComponent: () => import('./enterprise-goods-list')
  },
  //商品分销素材列表
  {
    path: '/distribution-goods-matter-list',
    asyncComponent: () => import('./distribution-goods-matter-list')
  },
  //商品评价管理
  {
    path: '/goods-evaluate-list',
    asyncComponent: () => import('./goods-evaluate-list')
  },
  //积分订单列表
  {
    path: '/points-order-list',
    exact: true,
    asyncComponent: () => import('./points-order-list')
  },
  //积分订单详情
  {
    path: '/points-order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./points-order-detail')
  },
  //拼团活动列表
  {
    path: '/groupon-activity-list',
    asyncComponent: () => import('./groupon-activity-list')
  },
  // 添加拼团活动
  {
    path: '/groupon-add',
    asyncComponent: () => import('./groupon-add')
  },
  // 编辑拼团活动
  {
    path: '/groupon-edit/:activityId',
    asyncComponent: () => import('./groupon-add')
  },
  // 拼团活动详情
  {
    path: '/groupon-detail/:activityId',
    asyncComponent: () => import('./groupon-detail')
  },
  //添加秒杀商品
  {
    path: '/add-flash-sale/:activityDate/:activityTime',
    exact: true,
    asyncComponent: () => import('./flash-sale-goods-add')
  },
  //秒杀活动列表
  {
    path: '/flash-sale-list',
    exact: true,
    asyncComponent: () => import('./flash-sale')
  },
  //秒杀商品列表
  {
    path: '/flash-sale-goods-list/:activityDate/:activityTime',
    exact: true,
    asyncComponent: () => import('./flash-sale-goods-list')
  },
  //页面管理
  {
    path: '/page-manage/weixin',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/weixin',
    asyncComponent: () => import('./template-manage')
  },
  //页面管理
  {
    path: '/page-manage/pc',
    asyncComponent: () => import('./page-manage')
  },
  //页面投放
  {
    path: '/page-manage-drop/:pageCode/:pageId/:pageType/:platform',
    asyncComponent: () => import('./page-manage-drop')
  },
  //模板管理
  {
    path: '/template-manage/pc',
    asyncComponent: () => import('./template-manage')
  },
  // 企业会员列表
  {
    path: '/enterprise-customer-list',
    asyncComponent: () => import('./enterprise-customer-list')
  },
  //仓库
  {
    path: '/ware-house-list',
    asyncComponent: () => import('./ware-house-list')
  },
  //缺货
  {
    path: '/stockout-list',
    asyncComponent: () => import('./stockout-list')
  },
  // 小程序直播
  {
    path: '/live-room/:currentTab',
    asyncComponent: () => import('./live-room')
  },
  // 创建直播
  {
    path: '/live-add',
    asyncComponent: () => import('./live-add')
  },
  // 直播详情
  {
    path: '/live-detail/:id',
    asyncComponent: () => import('./live-detail')
  },
  // 添加直播商品
  {
    path: '/live-goods-add',
    asyncComponent: () => import('./live-goods-add')
  },
  // 配送到家
  {
    path: '/home-delivery',
    asyncComponent: () => import('./home-delivery')
  },
  // 物流列表(配送方式合并后菜单)
  {
    path: '/logistics-tabs',
    asyncComponent: () => import('./logistics-tabs')
  },
  // 托运部(配送方式菜单合并后废弃)
  {
    path: '/logistics-company',
    asyncComponent: () => import('./logistics-company')
  },
  // 指定物流(配送方式菜单合并后废弃)
  {
    path: '/appoint-company',
    asyncComponent: () => import('./logistics-company')
  },
  // 配送文案
  {
    path: '/home-delivery-setting',
    asyncComponent: () => import('./home-delivery-setting')
  },
  // 乡镇件地址列表
  {
    path: '/pieces-list',
    asyncComponent: () => import('./pieces-list')
  },
  //首页广告列表
  {
    path: '/pagehome-adtt',
    asyncComponent: () => import('./pagehome-adtt')
  },
  //新增轮播图推荐位表
  {
    path: '/pagehome-swit/:advertisingId?',
    asyncComponent: () => import('./pagehome-swit')
  },
  //新增分栏推荐位表
  {
    path: '/pageclass-addtl/:advertisingId?',
    asyncComponent: () => import('./pageclass-addtl')
  },
  //新增通栏推荐位表
  {
    path: '/pagehome-addtl/:advertisingId?',
    asyncComponent: () => import('./pagehome-addtl')
  },
  // 乡镇件地址配置
  {
    path: '/pieces',
    asyncComponent: () => import('./pieces')
  },
  // 设置-帮助中心-视频教程
  {
    path: '/video-tutorial/:menuId?/:backUrl?/:first?/:second?/:third?',
    asyncComponent: () => import('./video-tutorial')
  },
  // 财务-鲸币管理-鲸币账户
  {
    path: '/jinbi-account',
    asyncComponent: () => import('./jinbi-account')
  },
  // 财务-鲸币管理-鲸币账户-鲸币充值
  {
    path: '/jinbi-recharge',
    asyncComponent: () => import('./jinbi-recharge')
  },
  // 财务-鲸币管理-鲸币账户-鲸币提现
  {
    path: '/jinbi-withdrawal',
    asyncComponent: () => import('./jinbi-withdrawal')
  },
  // 新增商品
  {
    path: '/add-product',
    asyncComponent: () => import('./add-product')
  },
  // 新增商品（简化版本）
  {
    path: '/add-product-simple',
    asyncComponent: () => import('./add-product-simple')
  },
  // 编辑商品（简化版本）
  {
    path: '/edit-product-simple',
    asyncComponent: () => import('./add-product-simple')
  },
  // 推荐分类
  {
    path: '/recommended-classification',
    asyncComponent: () => import('./recommended-classification')
  },
  // 推荐商品
  {
    path: '/recommend-goods',
    asyncComponent: () => import('./recommend-goods')
  },
  // 计量单位
  {
    path: '/metering-unit',
    asyncComponent: () => import('./metering-unit')
  },
  //设置-用户须知设置
  {
    path: '/user-instructions',
    asyncComponent: () => import('./user-instructions')
  },
  // 直播间管理
  {
    path: '/live-manage',
    asyncComponent: () => import('./live-manage')
  },
  // 直播管理
  {
    path: '/live-manage-list/:liveRoomId',
    asyncComponent: () => import('./live-manage-list')
  },
  // 直播管理设置
  {
    path: '/live-manage-setUp/:liveRoomId',
    asyncComponent: () => import('./live-manage-setUp')
  },
  // app直播详情
  {
    path: '/app-live-dis/:id',
    asyncComponent: () => import('./app-live-dis')
  },
  // 厂商管理
  {
    path: '/goods-add-vendor',
    asyncComponent: () => import('./goods-add-vendor')
  },
  // logo库
  {
    path: '/logo-library',
    asyncComponent: () => import('./logo-library')
  },
  // 设置 -> 上门自提(配送方式菜单合并后废弃)
  {
    path: '/self-pickup',
    asyncComponent: () => import('./self-pickup')
  },
  // 用户须知编辑
  {
    path: '/user-instructions-edit',
    asyncComponent: () => import('./user-instructions-edit')
  },
  // 托运部-批量导入
  {
    path: '/logistics-company-import',
    asyncComponent: () => import('./logistics-company-import')
  },
  // 小视频管理
  {
    path: '/video-setting',
    asyncComponent: () => import('./video-setting')
  },
  // 小视频发布
  {
    path: '/video-create/:videoId',
    asyncComponent: () => import('./video-create')
  },
  // 小视频详情
  {
    path: '/video-set-detail/:videoId',
    asyncComponent: () => import('./video-set-detail')
  },
  // IM设置
  {
    path: '/im-setting-index',
    asyncComponent: () => import('./online-service/im-setting-index')
  },
  // 第三方商家 商品新增导入
  {
    path: '/goods-add-import',
    asyncComponent: () => import('./goods-add-import')
  },
  // 快递到家(自费)(配送方式菜单合并后废弃)
  {
    path: '/delivery-to-home',
    asyncComponent: () => import('./delivery-to-home')
  },
  // 快递到家(到付)(配送方式菜单合并后废弃)
  {
    path: '/delivery-to-home-collect',
    asyncComponent: () => import('./delivery-to-home-collect')
  },
  // 同城配送(配送方式菜单合并后废弃)
  {
    path: '/delivery-to-same-city',
    asyncComponent: () => import('./delivery-to-home-collect')
  },
  // 配送到店(配送方式菜单合并后废弃)
  {
    path: '/delivery-to-store',
    asyncComponent: () => import('./delivery-to-store')
  },
  // 第三方商家 商品新增导入
  {
    path: '/goods-add-import',
    asyncComponent: () => import('./goods-add-import')
  },
  // 广告投放管理-广告列表
  {
    path: '/advert-list',
    asyncComponent: () => import('./advert-list')
  },
  // 广告投放管理-新增/编辑广告
  {
    path: '/advert',
    asyncComponent: () => import('./advert')
  },
  // 广告投放管理-广告支付
  {
    path: '/advert-pay',
    asyncComponent: () => import('./advert-pay')
  }
];

const homeRoutes = [
  { path: '/login', asyncComponent: () => import('./login') },
  {
    path: '/find-password',
    asyncComponent: () => import('./find-password')
  },
  {
    path: '/lackcompetence',
    asyncComponent: () => import('./lackcompetence')
  },
  {
    path: '/pay-help-doc',
    asyncComponent: () => import('./pay-help-doc')
  },
  // 运费模板计算公式说明
  {
    path: '/freight-instruction',
    asyncComponent: () => import('./freight-instruction')
  },
  //视频详情
  {
    path: '/video-detail',
    asyncComponent: () => import('./video-detail')
  },
  //商家注册
  {
    path: '/company-register',
    asyncComponent: () => import('./company-register')
  },
  //商家注册协议
  {
    path: '/supplier-agreement',
    asyncComponent: () => import('./company-register/component/agreement')
  },
  //信息详情页面
  {
    path: '/info-detail/:id',
    asyncComponent: () => import('./info-detail')
  },
  //合同签署完成 h5页面
  {
    path: '/contract-h5',
    asyncComponent: () => import('./contract-h5')
  },
  //商家实名认证完成 h5页面
  {
    path: '/auth-h5',
    asyncComponent: () => import('./auth-h5')
  }
];

// 审核未通过下的, 包括未开店
const auditDidNotPass = [
  //开店流程
  {
    path: '/shop-process',
    asyncComponent: () => import('./shop/process-index')
  },
  //店铺信息 审核中/审核未通过
  {
    path: '/shop-info',
    asyncComponent: () => import('./shop/info-index')
  },
  //编辑店铺信息 审核未通过编辑页面
  {
    path: '/shop-info-edit',
    asyncComponent: () => import('./shop/info-edit')
  },
  // 视频教程
  {
    path: '/video-tutorial-notpass',
    asyncComponent: () => import('./video-tutorial')
  }
];

export { routes, homeRoutes, auditDidNotPass };
