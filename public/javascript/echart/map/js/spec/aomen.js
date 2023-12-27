(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'echarts'], factory);
  } else if (
    typeof exports === 'object' &&
    typeof exports.nodeName !== 'string'
  ) {
    // CommonJS
    factory(exports, require('echarts'));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
})(this, function(exports, echarts) {
  var log = function(msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg);
    }
  };
  if (!echarts) {
    log('ECharts is not Loaded');
    return;
  }
  if (!echarts.registerMap) {
    log('ECharts Map is not loaded');
    return;
  }
  echarts.registerMap('澳门', {
    type: 'FeatureCollection',
    features: [
      {
        geometry: {
          coordinates: [
            ['@@LADC^umZ@DONWE@DALBBF@H@DFBBTC'],
            ['@@P@LC@AGM@OECMBABBTCD@DDH'],
            ['@@MK@CA@AAGDEB@NVFJG'],
            ['@@EGOB@DNLHE@C'],
            ['@@YMVAN@BFCBBDAFHDBBFDHIJJEFDPCHHlYJQ'],
            ['@@JICGAECACGEBAAEDBFNXB@'],
            ['@@ ZNWRquZCBCC@AEA@@ADCDCAACEAGBQ@INEL'],
            ['@@MOIAIEI@@GE@AAUCBdCFIFR@HAFBBDDBDCBC@@FB@BDDDA\\M'],
            ['@@DKMMa_GC_COD@dVDBBF@@HJ@JFJBNPZK']
          ],
          encodeOffsets: [
            [[116285, 22746]],
            [[116303, 22746]],
            [[116281, 22734]],
            [[116285, 22729]],
            [[116313, 22707]],
            [[116266, 22728]],
            [[116265, 22694]],
            [[116316, 22676]],
            [[116329, 22670]]
          ],
          type: 'MultiPolygon'
        },
        id: '820000',
        properties: {
          childNum: 1,
          cp: [113.558783, 22.154124],
          name: '澳门特别行政区'
        },
        type: 'Feature'
      }
    ],
    UTF8Encoding: true
  });
});
