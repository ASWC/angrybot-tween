import { Event } from './Event';

export class TimerEvent extends Event
{
    private static TimerEventCache:TimerEvent[] = [];
    public static TIMER:string = "timer";
    public static TIMER_COMPLETE:string = "timerComplete";
    public static STABLE_RATE:string = "stablerate";

    public rate:number;

    constructor(type:string, bubble:boolean = true, cancelable:boolean = true)
    {
        super(type, bubble, cancelable);
    }

    public clone():Event
	{
		var event:TimerEvent = TimerEvent.getTimerEvent(this.type, this.bubbles, this.cancelable);
		event.rate = this.rate;		
		return event;
	}

    public destructor():void
    {
        super.destructor();
        let index:number = TimerEvent.TimerEventCache.indexOf(this);
        if(index < 0)
        {
            TimerEvent.TimerEventCache.push(this);
        }
    }

    public static getTimerEvent(type:string, bubble:boolean = true, cancelable:boolean = true):TimerEvent
    {
        if(TimerEvent.TimerEventCache.length)
        {
            let te:TimerEvent = TimerEvent.TimerEventCache[TimerEvent.TimerEventCache.length - 1];
            TimerEvent.TimerEventCache.length -= 1;
            te.reset(type, bubble, cancelable);
            return te;
        }
        return new TimerEvent(type, bubble, cancelable);
    }

    public get isDisposable():boolean
    {
        return true;
    }

    public updateAfterEvent():void
    {
        
    }
}