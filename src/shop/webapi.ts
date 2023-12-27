import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询商家工商信息
 */
export const findOne = () => {
  return Fetch('/company');
};

/**
 * 保存商家基本信息
 * @param info
 */
export const saveCompanyInfo = (info) => {
  return Fetch<TResult>('/company', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 获取全部分类
 */
export const fetchAllCates = () => {
  return Fetch<TResult>('/goods/goodsCatesTree');
};

/**
 * 获取商家签约分类
 */
export const getCateList = () => {
  return Fetch<TResult>('/contract/cate/list');
};

/**
 * 保存签约分类
 * @param params
 */
export const saveSignCate = (params) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 检查是否存在
 * @param param0
 */
export const checkExsit = (cateId) => {
  return Fetch<TResult>(`/contract/cate/del/verify/${cateId}`);
};

/**
 * 获取品牌分类
 */
export const getBrandList = () => {
  return Fetch<TResult>('/contract/brand/list', {
    method: 'GET'
  });
};

/**
 * 获取所有品牌
 */
export const getAllBrands = (params: any) => {
  return Fetch<TResult>(
    `/goods/allGoodsBrands?likeBrandName=${(params as any).likeBrandName}`,
    {
      method: 'GET'
    }
  );
};

/**
 * 获取商品品牌详细信息
 * @param id
 */
export const fetchBrandInfo = (id: number) => {
  return Fetch<TResult>(`/goods/goodsBrand/${id}`, {
    method: 'GET'
  });
};

/**
 * 品牌编辑事件
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateBrands = (params: {}) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询店铺基本信息
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreInfo() {
  return Fetch<TResult>('/store/storeInfo');
}

/**
 * 保存商家基本信息
 * @param info
 */
export const saveStoreInfo = (info) => {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 编辑商家基本信息
 * @param info
 */
export const editStoreInfo = (info) => {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 查询店铺结算日
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountDay() {
  return Fetch<TResult>('/store/info');
}

/**
 * 查询结算银行账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountList() {
  return Fetch<TResult>('/account/list');
}

/**
 * 结算银行账户事件
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateAccounts = (params: {}) => {
  return Fetch<TResult>('/account/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取配置银行列表
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchBaseBank() {
  return Fetch<TResult>('/account/base/bank');
}

/**
 * 保存商家的类型
 */
export function saveCompayType() {
  return Fetch<TResult>('');
}

/**
 * 查询自营商家所有的仓库信息
 */
export function fetchAllSelfWareHouse() {
  return Fetch<TResult>('/ware/house/list-all-self');
}

/**
 * 修改商家的类型
 * @param params
 */
export function saveCompanyTypeAndWareHouse(params) {
  return Fetch<TResult>('/company/modifyCompanyType', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询企业信息/fadada/viewContractStatus
 * @param params
 */
export function queryCompanyInfo() {
  return Fetch<TResult>('/fadada/queryCompanyInfo', {
    method: 'POST',
    body: ''
  });
}

/**
 * 查看合同签署状态
 * @param params
 */
export function viewContractStatus() {
  return Fetch<TResult>('/fadada/viewContractStatus', {
    method: 'POST',
    body: ''
  });
}

/**
 * 注册法大大平台账户，返回填写企业信息链接
 * @param params
 */
export function fadadaRegister(params) {
  return Fetch<TResult>('/fadada/saveContractInfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查找商家签约的tab和商城

 */
export const getMarketList = (params) => {
  return Fetch<TResult>('/contract/company-mall/into-platform-relation/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取所有批发市场
 */
export const getAllMarkets = (params) => {
  return Fetch<TResult>('/company/into-mall/mall-market/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取所有商城分类
 */
export const getAllStores = (params) => {
  return Fetch<TResult>('/company/into-mall/supplier-tab/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 保存商家签约的批发市场和商城分类
 * @param params
 */
export function companyMallSave(params) {
  return Fetch<TResult>('/contract/company-mall/into-platform-relation/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 重新发送签署合同短信
 * @param params
 */
export function returnRegister(params) {
  return Fetch<TResult>(`/fadada/returnRegister?${params}`, {
    method: 'GET'
  });
}

/**
 * 获取招商经理列表
 */
export const fetchManagerList = () => {
  return Fetch<TResult>('/customer/employee/list-cm-manager', {
    method: 'GET'
  });
};

/**
 * 上传Base64图片
 */
export const uploadBase64File = (data = {}) => {
  return Fetch<TResult>('/uploadBase64File?cateId=34343&resourceType=IMAGE', {
    method: 'POST',
    body: JSON.stringify({
      ...data
    })
  });
};

/**
 * 获取线上合同信息
 */
export const findByEmployeeId = () => {
  return Fetch<TResult>('/wordedit/findByEmployeeId', {
    method: 'POST'
  });
};

/**
 * 保存线上合同信息
 * @param params
 */
export function eidtWord(params) {
  return Fetch<TResult>('/wordedit/eidtWord', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 营业执照ocr识别
 * @param params
 */
export function fetchOcrInfo(params) {
  return Fetch<TResult>('/license/analysisLicense', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
