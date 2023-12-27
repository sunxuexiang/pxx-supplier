import {Action, Actor, IMap} from "plume2";
import {fromJS} from "immutable";

export default class SettlementActor extends Actor {
    defaultState() {
        return {
            settlement:[]
        }}


    @Action('settlement: set')
    onHeaderChange(state: IMap, data) {
        return state.set('settlement', fromJS(data))
    }
}