import { Actor, Action, IMap } from 'plume2';



export default class ListActor extends Actor {
  defaultState() {
    return {
        storeEvaluateSum:{},
        storeEvaluateNumList: [],
	      evaluateCount:0,
	      compositeScore:0,
		    //当前的数据总数
		    storeTotal: 0,
		    //当前的分页条数
		    storePageSize: 10,
		    //当前的记录列表
		    storeDataList: [],
		    //当前页
	      storeCurrentPage: 1,
    };
  }

  @Action('storeEvaluateSum:init')
  storeEvaluateSumInit(state: IMap, res) {
    return state.withMutations(state => {
      state.set('storeEvaluateSum', res);
    });
  }

	@Action('storeEvaluateNum:init')
	storeEvaluateNumInit(state: IMap, res) {
		return state.withMutations(state => {
			state.set('storeEvaluateNumList', res.storeEvaluateNumVOList)
				.set('evaluateCount',res.evaluateCount)
				.set('compositeScore',res.compositeScore);
		});
	}

	@Action('storeEvaluateList:init')
	storeEvaluateListInit(state: IMap, res) {
		const { content, total } = res;

		return state.withMutations((state) => {
			state.set('storeTotal', total).set('storeDataList', content);
		});
	}

	@Action('storeEvaluateList:currentPage')
	storeEvaluateCurrentPage(state: IMap, current) {
		return state.set('storeCurrentPage', current);
	}
}
