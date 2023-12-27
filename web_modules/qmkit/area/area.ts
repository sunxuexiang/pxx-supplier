import { fromJS } from 'immutable';

import provinces from './provinces.json';
import areas from './areas.json';
import cities from './cities.json';
import streets from './streets.json';

/**
 * 获取省份与地市的层级结构数据
 */
export function findProvinceCity(ids) {
  return fromJS(provinces || [])
    .map(p => {
      let pChx = false,
        cChx = false,
        pChx2 = false;
      if (fromJS(ids).find(id => id == p.get('code'))) {
        pChx = true;
      }
      let children = p.get('children').map(c => {
        cChx = pChx;
        if (!cChx && fromJS(ids).find(id => id == c.get('value'))) {
          cChx = true;
          pChx2 = true;
        }
        return fromJS({
          label: c.get('label'),
          value: c.get('value'),
          key: c.get('value'),
          disabled: cChx
        });
      });
      return fromJS({
        label: p.get('name'),
        value: p.get('code'),
        key: p.get('code'),
        children: children,
        disabled: pChx || pChx2
      });
    })
    .toJS();
}

export function findProvinceArea(ids) {
  
  return fromJS(provinces || [])
    .map(p => {
      let pChx = false,
        cChx = false,
        pChx2 = false;
      if (fromJS(ids).find(id => id == p.get('code'))) {
        pChx = true;
      }
      let children = p.get('children').map(c => {
        cChx = pChx;
        if (!cChx && fromJS(ids).find(id => id == c.get('value'))) {
          cChx = true;
          pChx2 = true;
        }
        return fromJS({
          label: c.get('label'),
          value: c.get('value'),
          key: c.get('value'),
          children: c.get('children'),
          disabled: cChx
        });
      });
      return fromJS({
        label: p.get('name'),
        value: p.get('code'),
        key: p.get('code'),
        children: children,
        disabled: pChx || pChx2
      });
    })
    .toJS();
}

/**
 * 获取省市区街道全部数据
 */
export function findProvinceCityAreaStreet() {
  return provinces.map(item => {
    const proviceItem = {...item, key: item.code, value: item.code, title: item.name}
    proviceItem.children = cities.filter(item2 => item2.parent_code == proviceItem.code).map(item2 => {
      const cityItem = {...item2, key: item2.code, value: item2.code, title: item2.name}
      cityItem.children = areas.filter(item3 => item3.parent_code == item2.code).map(item3 => {
        const areaItem = {...item3, key: item3.code, value: item3.code, title: item3.name}
        areaItem.children = streets.filter(item4 => item4.parent_code == item3.code).map(item4 => {
          const streetItem = {...item4, key: item4.code, value: item4.code, title: item4.name}
          return streetItem
        })
        return areaItem
      })
      return cityItem
    })
    return proviceItem
  })
}

export function findProvinceCityData() {
  return provinces.map(item => {
    const proviceItem = {...item, key: item.code, value: item.code, title: item.name}
    proviceItem.children = cities.filter(item2 => item2.parent_code == proviceItem.code).map(item2 => {
      const cityItem = {...item2, key: item2.code, value: item2.code, title: item2.name}
      cityItem.children = []
      return cityItem
    })
    return proviceItem
  })
}

/**
 * 查询省
 * @param code
 * @returns {string}
 */
export function findProviceName(code: string) {
  for (let p of provinces) {
    if (p.code == code) {
      return p.name;
    }
  }
  return '';
}

function findArea(code: string) {
  for (let a of areas) {
    if (code == a.code) {
      return a.name;
    }
  }
  return '';
}

function findCity(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return c.name;
    }
  }
  return '';
}

function findStreet(code: string) {
  for (let a of streets) {
    if (code == a.code) {
      return a.name;
    }
  }
  return '';
}

export function findCityAndParentId(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return { name: c.name, parent_code: c.parent_code };
    }
  }
  return { name: null, parent_code: null };
}


export function findCityArr(code: string) {
  let cityArr=[];
  for (let c of cities) {
    if (code ==  c.parent_code) {
      cityArr.push(c.code)
    }
  }
  return cityArr;
}

/**
 * 获取城市数组
 * @param code
 */
export function findCityNameArr(code: string) {
  let cityArr=[];
  for (let c of cities) {
    if (code ==  c.parent_code) {
      cityArr.push(c.name)
    }
  }
  return cityArr;
}

/**
 *  省市区字符串 返回 `江苏省/南京市/雨花台区`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressInfo(provinceCode, cityCode, areaCode) {
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;

      if (proviceName === cityName) {
        return `${cityName}${findArea(areaCode)}`;
      } else {
        return `${proviceName}${cityName}${findArea(areaCode)}`;
      }
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}

/**
 *  省市区街道字符串 返回 `江苏省/南京市/雨花台区/xx街道`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressStreetInfo(provinceCode, cityCode, areaCode, streetCode) {
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;

      if (proviceName === cityName) {
        return `${cityName}${findArea(areaCode)}${findStreet(streetCode)}`;
      } else {
        return `${proviceName}${cityName}${findArea(areaCode)}${findStreet(streetCode)}`;
      }
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}

/**
 *  省市区街道name
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressStreetName(provinceCode, cityCode, areaCode, streetCode) {
  let result = {
    proviceName: '',
    cityName: '',
    areaName: '',
    streetName: '',
  };
  if (provinceCode) {
    if (cityCode) {
      result.proviceName = `${findProviceName(provinceCode)}`;
      result.cityName = `${findCity(cityCode)}`;
      result.areaName = `${findArea(areaCode)}`;
      result.streetName = `${findStreet(streetCode)}`;
    } else {
      result.proviceName = `${findProviceName(provinceCode)}`;
    }
  }

  return result;
}

/**
 *  省市字符串 返回 `江苏省/南京市`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function twoLeveAddressInfo(provinceCode, cityCode) {
// console.log(provinceCode)
// console.log(cityCode)
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;
        return `${proviceName}/${cityName}`;
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}

/**
 *  省市字符串 返回 `江苏省/南京市,北京市/北京市`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressInfoList(wareHouseList) {
  let address='';
  for (let i=0;i<wareHouseList.length;i++){
    address += twoLeveAddressInfo(wareHouseList[i].provinceId,wareHouseList[i].cityId);
    if (i>=0 && i<wareHouseList.length-1 && wareHouseList.length >1){
      address +=','
    }
  }
  return address;
}


/**
 *  把省级code 全部转换为市级code
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function provinceCodeVOCityCode(arrArea) {
  let arrCity=[];
    for (let c of arrArea){
      if (findCity(c)!=''){
        arrCity.push(c)
      }else{
       let city = findCityArr(c)
          for (let b of city) {
              arrCity.push(b)
          }
      }
    }
 return arrCity;
}


/**
 *  转换市级名称
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function provinceCodeVOCityName(arrArea) {
  let arrCity=[];
  for (let c of arrArea){
  let name = findCity(c);
    if (name!=''){
      arrCity.push(name)
    }else{
      let city = findCityNameArr(c)
      for (let b of city) {
        arrCity.push(b)
      }
    }
  }
  return arrCity;
}



/**
 * 传递一个城市code数组，返回一个 （江苏省/南京市,北京市/北京市）格式字符串
 * @param cityCodeArr
 */
export  function  getProvinceNameAndCityName(cityCodeArr) {
  console.log(cityCodeArr)
  cityCodeArr = cityCodeArr.split(',');
  let address='';
  for (let i=0;i<cityCodeArr.length;i++){
    let provCode = findCityAndParentId(cityCodeArr[i])
    address += twoLeveAddressInfo(provCode.parent_code,cityCodeArr[i]);
    if (i>=0 && i<cityCodeArr.length-1 && cityCodeArr.length >1){
      address +='，'
    }
  }
return address;
}