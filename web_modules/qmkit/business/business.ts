import { fromJS } from 'immutable';
import businessIndustries from '../json/business/businessIndustry.json';
import businessNatures from '../json/business/businessNature.json';

const businessEmployeeNums =[
  { key: 0, value: '1-49' },
  { key: 1, value: '50-99' },
  { key: 2, value: '100-499' },
  { key: 3, value: '500-999' },
  { key: 4, value: '1000以上' }
]

/**
 * 获取公司性质
 */
export function getBusinessNatures() {
  return fromJS(businessNatures);
}


/**
 * 获取公司性质名称
 */
export function findBusinessNatureName(businessNatureType) {
  const businessNature = fromJS(businessNatures).find(businessNature => businessNatureType == businessNature.get('value'));
  return businessNature.get('label');
}

/**
 * 获取公司行业
 */
export function getBusinessIndustries() {
  return fromJS(businessIndustries);
}

/**
 * 获取公司行业名称
 */
export function findBusinessIndustryName(businessIndustryType) {
  const businessIndustry = fromJS(businessIndustries).find(businessIndustry => businessIndustryType == businessIndustry.get('value'));
  return businessIndustry.get('label');
}

/**
 * 获取公司人数
 */
export function getBusinessEmployeeNums() {
  return fromJS(businessEmployeeNums);
}

/**
 * 获取公司人数描述
 */
export function findBusinessEmployeeNumValue(businessEmployeeNum) {
  return this.getBusinessEmployeeNums().find(item=>item.get('key') === businessEmployeeNum).get('value');
}
