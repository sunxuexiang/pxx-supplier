import React from 'react';
import 'echarts/lib/chart/map';

import { noop, Resource } from 'qmkit';

import cities from '../../../../web_modules/qmkit/area/cities.json';
import provincesJson from './province.json';
import { fromJS } from 'immutable';

//各个省的省会的经纬度，省切换的时候，可以定位到省会
const provinceDict = {
  安徽: [117.17, 31.52],
  北京: [116.24, 40.05],
  重庆: [106.54, 29.79],
  福建: [119.28, 26.05],
  甘肃: [102.634697, 37.929996],
  广东: [113.24, 23.08],
  广西: [108.29, 23.48],
  贵州: [106.52, 26.35],
  海南: [109.3, 19.02],
  河北: [114.4, 40.02],
  河南: [113.5, 34.46],
  黑龙江: [126.46, 47.44],
  湖北: [112.27, 30.95],
  湖南: [112.69, 27.82],
  吉林: [125.29, 43.54],
  江苏: [118.56, 32.53],
  江西: [115.65, 27.4],
  辽宁: [123.35, 41.48],
  内蒙古: [111.51, 43.48],
  宁夏: [106.26, 37.27],
  青海: [98.58, 35.38],
  山东: [119.1, 36.4],
  山西: [112.43, 37.54],
  陕西: [108.67, 34.77],
  上海: [121.39, 31.14],
  四川: [104.14, 30.4],
  天津: [117.22, 39.22],
  西藏: [90.18, 31.39],
  新疆: [87.46, 43.45],
  云南: [102.52, 25.04],
  浙江: [120.2, 29.46],
  香港: [114.19, 22.37],
  澳门: [113.558783, 22.154124],
  台湾: [121.4, 24.03]
};

export interface ChinaMapProps {
  //标题
  title: string;
  //画布高度
  height?: number;
  //中国地图样式
  style?: any;
  //是否显示省份名称
  showProvince?: boolean;
  //选中省份区域时
  onCheck?: Function;
  dataJson: any;
}

interface IState {
  [key: string]: any;
}

interface IParam {
  data: {
    code: number;
    name: string;
  };
}

export default class ChinaMap extends React.Component<ChinaMapProps, IState> {
  constructor(props: ChinaMapProps) {
    super(props);
  }

  chinaMap = null;
  provinceMap = null;

  static defaultProps = {
    //容器高度默认400
    height: 400,
    onCheck: noop
  };

  async componentDidMount() {
    //@ts-ignore
    if (!window.echarts) {
      await Resource.loadJS(['/javascript/echart/echarts.4.2.1.js']);
      await Resource.loadJS([
        '/javascript/echart/map/js/china.js',
        '/javascript/echart/map/js/province/jiangsu.js'
      ]);
    }

    //@ts-ignore
    this.chinaMap = window.echarts.init(document.getElementById('chinaMap'));

    this.chinaMap.on('click', this.onChartClick);

    //@ts-ignore
    this.provinceMap = window.echarts.init(
      document.getElementById('provinceMap')
    );

    this._drewCharts();

    await Resource.loadJS([
      'javascript/echart/map/js/province/anhui.js',
      'javascript/echart/map/js/province/fujian.js',
      'javascript/echart/map/js/province/gansu.js',
      'javascript/echart/map/js/province/guangdong.js',
      'javascript/echart/map/js/province/guangxi.js',
      'javascript/echart/map/js/province/guizhou.js',
      'javascript/echart/map/js/province/hainan.js',
      'javascript/echart/map/js/province/hebei.js',
      'javascript/echart/map/js/province/heilongjiang.js',
      'javascript/echart/map/js/province/henan.js',
      'javascript/echart/map/js/province/hubei.js',
      'javascript/echart/map/js/province/hunan.js',
      'javascript/echart/map/js/province/jiangsu.js',
      'javascript/echart/map/js/province/jiangxi.js',
      'javascript/echart/map/js/province/jilin.js',
      'javascript/echart/map/js/province/liaoning.js',
      'javascript/echart/map/js/province/neimenggu.js',
      'javascript/echart/map/js/province/ningxia.js',
      'javascript/echart/map/js/province/qinghai.js',
      'javascript/echart/map/js/province/shandong.js',
      'javascript/echart/map/js/province/shanxi.js',
      'javascript/echart/map/js/province/shanxi1.js',
      'javascript/echart/map/js/province/sichuan.js',
      'javascript/echart/map/js/province/taiwan.js',
      'javascript/echart/map/js/province/xinjiang.js',
      'javascript/echart/map/js/province/xizang.js',
      'javascript/echart/map/js/province/yunnan.js',
      'javascript/echart/map/js/province/zhejiang.js',

      'javascript/echart/map/js/spec/aomen.js',
      'javascript/echart/map/js/spec/beijing.js',
      'javascript/echart/map/js/spec/chongqing.js',
      'javascript/echart/map/js/spec/shanghai.js',
      'javascript/echart/map/js/spec/tianjin.js',
      'javascript/echart/map/js/spec/xianggang.js'
    ]);
  }

  componentWillReceiveProps() {
    this._drewCharts();
  }

  _drewCharts = (param: IParam = { data: { code: 320000, name: '江苏' } }) => {
    this.provinceMap&&this.provinceMap.setOption(this._makeProvinceJson(param));
    this.chinaMap&&this.chinaMap.setOption(this._makeChinaJson(param));
  };

  render() {
    const { style, height } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: `${height}px`,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <div id={'chinaMap'} style={{ height: '100%', width: '50%' }} />
          <div id={'provinceMap'} style={{ height: '100%', width: '50%' }} />
        </div>
      </div>
    );
  }

  _makeProvinceJson = (param) => {
    const { arrayCity, maxValue } = this._renderCityData(param);

    let layoutCenter = undefined;
    if (param.data.name == '海南') {
      layoutCenter = ['30%', '50%'];
    } else if (param.data.name == '香港') {
      layoutCenter = ['50%', '50%'];
    } else if (param.data.name == '澳门') {
      layoutCenter = ['50%', '50%'];
    }

    let layoutSize = undefined;
    if (param.data.name == '海南') {
      layoutSize = '600%';
    } else if (param.data.name == '香港') {
      layoutSize = '120%';
    } else if (param.data.name == '澳门') {
      layoutSize = '90%';
    }

    let provinceJson = {
      roam: true,
      visualMap: {
        min: 0,
        max: maxValue,
        left: 'right',
        top: 'bottom',
        // text: ['高', '低'],           // 文本，默认为数值文本
        calculable: true,
        itemHeight: 200
        // color: ['red', 'white']
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return params.name + '<br/>客户数量：' + params.data.value;
        }
      },
      series: [
        {
          type: 'map',
          map: param.data.name,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          zoom: 1,
          data: arrayCity,
          layoutCenter: layoutCenter,
          center: [
            provinceDict[param.data.name][0],
            provinceDict[param.data.name][1]
          ],
          layoutSize: layoutSize
        }
      ]
    };

    return provinceJson;
  };

  _makeChinaJson = (param) => {
    const { dataJson } = this.props;

    //获取城市和省的关系Json
    const cityProvinceReal = {};
    cities.forEach((city) => {
      cityProvinceReal[city.code] = city.parent_code;
    });

    //console.log('cityProvinceReal',cityProvinceReal)
    //省和值之间关系Json
    let provinceValueJson = {};
    dataJson.forEach((dataItem) => {
      if (provinceValueJson[cityProvinceReal[dataItem.cityId]]) {
        provinceValueJson[cityProvinceReal[dataItem.cityId]] += dataItem.num;
      } else {
        provinceValueJson[cityProvinceReal[dataItem.cityId]] = dataItem.num;
      }
    });

    let maxValue = 0;

    //组装所有的省和值的数组
    provincesJson.forEach((provinceItem) => {
      if (provinceValueJson[provinceItem.code]) {
        provinceItem.value = provinceValueJson[provinceItem.code];
        maxValue =
          provinceItem.value > maxValue ? provinceItem.value : maxValue;
      } else {
        // console.log(5743927594327)
        provinceItem.value = 0;
      }
      if (param.data.code == provinceItem.code) {
        // provinceItem.itemStyle = {normal: {borderWidth: 2, borderColor: '#000', color: param.color}};
        provinceItem.selected = true;
      } else {
        if (provinceItem.itemStyle) {
          delete provinceItem.itemStyle;
        }
        if (provinceItem.selected) {
          delete provinceItem.selected;
        }
      }
    });

    const chinaOption = {
      title: {
        text: this.props.title,
        left: 'center'
      },
      visualMap: {
        min: 0,
        max: this._renderMaxValue(maxValue),
        left: 'left',
        top: 'bottom',
        // text: ['高', '低'],           // 文本，默认为数值文本
        calculable: true,
        itemHeight: 200
        // color: ['red', 'white']
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (params.name != '' && params.data) {
            return params.name + '<br/>客户数量：' + params.data.value;
          } else {
            return '';
          }
        }
      },
      series: [
        {
          type: 'map',
          map: 'china',
          roam: false,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#000'
            }
          },
          data: provincesJson
        }
      ]
    };
    return chinaOption;
  };

  onChartClick = (params) => {
    if (params.name != '' && params.data) {
      this._drewCharts(params);
    }
  };

  _renderCityData = (param) => {
    const { dataJson } = this.props;
    let maxValue = 0;
    let valueJson = {};
    dataJson.forEach((value) => {
      valueJson[value.cityId] = value.num;
    });

    const provinceJson = {
      810000: {
        name: '香港特别行政区',
        code: '810000',
        value: 0,
        parent_code: '810000'
      },
      820000: {
        name: '澳门特别行政区',
        code: '820000',
        value: 0,
        parent_code: '820000'
      },
      710000: {
        name: '台湾省',
        code: '710000',
        value: 0,
        parent_code: '710000'
      }
    };

    let arrayCity = new Array();
    if (['810000', '820000', '710000'].indexOf(param.data.code) != -1) {
      let city = provinceJson[param.data.code];
      arrayCity.push(city);
      if (valueJson[city.code]) {
        city.value = valueJson[city.code];
        maxValue =
          maxValue < valueJson[city.code] ? valueJson[city.code] : maxValue;
      } else if(city.code.indexOf('710')!=-1){
        let num = 0;
        fromJS(valueJson).map((value,key) =>{
          if(key.indexOf('710')!=-1){
            num=num+value;
          }
        })
        city.value = num;
        maxValue =
          maxValue < num ? num : maxValue;
      } else {
        city.value = 0;
      }
    } else {
      for (let city of cities) {
        if (city.parent_code == param.data.code) {
          arrayCity.push(city);
          if (valueJson[city.code]) {
            city.value = valueJson[city.code];
            maxValue =
              maxValue < valueJson[city.code] ? valueJson[city.code] : maxValue;
          } else {
            city.value = 0;
          }
        }
      }
    }
    return { arrayCity: arrayCity, maxValue: this._renderMaxValue(maxValue) };
  };

  _renderMaxValue = (value) => {
    return value < 10 ? 10 : value;
  };
}
