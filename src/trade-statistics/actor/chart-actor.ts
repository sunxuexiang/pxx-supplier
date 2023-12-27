/**
 * Created by feitingting on 2017/10/18.
 */
import { Actor, Action } from 'plume2';

export default class ChartActor extends Actor {
  defaultState() {
    return {
      tradeCharts: '',
      defaultDesc: [],
      multiYAxis: true,
      weekly: false
    };
  }

  @Action('trade:chart')
  chart(state, context: any) {
    context.map(v => {
      //格式化百分率
      v.orderConversionRate = parseFloat(v.orderConversionRate).toFixed(2);
      v.payOrderConversionRate = parseFloat(v.payOrderConversionRate).toFixed(
        2
      );
      v.wholeStoreConversionRate = parseFloat(
        v.wholeStoreConversionRate
      ).toFixed(2);
    });
    return state.set('tradeCharts', context);
  }

  /**
   * 更改图例
   * @param state
   * @param context
   */
  @Action('trade:desc')
  desc(state, context) {
    return state.set('defaultDesc', context);
  }

  /**
   * 是否支持多纵轴显示
   * @param state
   * @param multiY
   */
  @Action('trade:multiYaxis')
  multiYaxis(state, multiY) {
    return state.set('multiYAxis', multiY);
  }

  @Action('trade:setChartWeekly')
  setWeekly(state, weekly) {
    return state.set('weekly', weekly);
  }
}
