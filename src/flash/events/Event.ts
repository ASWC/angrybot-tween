
import { IEventDispatcher } from "./IEventDispatcher";
import { BaseObject } from "../BaseObject";

export class Event extends BaseObject
{
    private static EventCache:Event[] = [];

    public static ENTER_FRAME:string = "enterFrame";
    public static COMPLETE:string = "complete";
    public static OPEN:string = "open";
    public static INIT:string = "init";
    public static RENDER:string = "render";
    public static ACTIVATE:string = "activate";
    public static DEACTIVATE:string = "desactivate";
    public static CHANGE:string = "change";    

    public type:string;
    public bubbles:boolean;
    public cancelable:boolean;
    public currentTarget:IEventDispatcher;
    public which:number;
    public altKey:boolean;
    public ctrlKey:boolean;
    public metaKey:boolean;
    public shiftKey:boolean;

    constructor(type:string, bubble:boolean = true, cancelable:boolean = true)
    {
        super();
        this.reset(type, bubble, cancelable);
    }

    public clone():Event
    {
        return Event.getEvent(this.type, this.bubbles, this.cancelable);
    }

    protected reset(type:string, bubble:boolean = true, cancelable:boolean = true):void
    {
        this.type = type;
        this.bubbles = bubble;
        this.cancelable = cancelable;
    }

   public static getEvent(type:string, bubble:boolean = true, cancelable:boolean = true):Event
    {
        if(Event.EventCache.length)
        {
            let te:Event = Event.EventCache[Event.EventCache.length - 1];
            Event.EventCache.length -= 1;
            te.reset(type, bubble, cancelable);
            return te;
        }
        return new Event(type, bubble, cancelable);
    }

	public destructor():void
    {
        this.currentTarget = null;
        let index:number = Event.EventCache.indexOf(this);
        if(index < 0)
        {
            Event.EventCache.push(this);
        }
    }

	public get isDisposable():boolean
    {
        return true;
    }

    public stopPropagation()
    {

    }

    public stopImmediatePropagation()
    {

    }

    public preventDefault()
    {

    }
}