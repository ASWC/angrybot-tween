import { Event } from './Event';

export interface IEventDispatcher
{
    dispatchEvent(event: Event):void;
    removeEventListener(type: string, method: Function);
    addEventListener(type: string, method: Function, scope:any);
    hasEventListener(type:String):boolean;
    getType():string;
}