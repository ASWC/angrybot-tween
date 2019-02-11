import { Event } from './Event';

export class ContextTweenEvent extends Event
{
	private static ContextTweenEventCache:ContextTweenEvent[] = [];

	public static MOTION_END:string = "motionEnd"
	public static MOTION_UPDATE:string = "motionUpdate"
	public contextTarget:any;
	public percent:number = 0

	constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
	{
        super(type, bubbles, cancelable);
    }
    
    public get isDisposable():boolean
    {
        return true;
    }

	public static getContextTweenEvent(type:string, bubble:boolean = true, cancelable:boolean = true):ContextTweenEvent
    {
        if(ContextTweenEvent.ContextTweenEventCache.length)
        {
            let te:ContextTweenEvent = ContextTweenEvent.ContextTweenEventCache[ContextTweenEvent.ContextTweenEventCache.length - 1];
            ContextTweenEvent.ContextTweenEventCache.length -= 1;
            te.reset(type, bubble, cancelable);
            return te;
        }
        return new ContextTweenEvent(type, bubble, cancelable);
    }

	public destructor():void
    {
        this.currentTarget = null;
        let index:number = ContextTweenEvent.ContextTweenEventCache.indexOf(this);
        if(index < 0)
        {
            ContextTweenEvent.ContextTweenEventCache.push(this);
        }
    }

}
