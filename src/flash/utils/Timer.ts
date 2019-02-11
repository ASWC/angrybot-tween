import { TimerEvent } from '../events/TimerEvent';
import { IRateDelegate } from './IRateDelegate';
import { EventDispatcher } from '../events/EventDispatcher';
import { IRunnable } from './IRunnable';

export class Timer extends EventDispatcher
{
    private static TimerCache:Timer[] = [];
    private static runnables:IRunnable[] = [];

    private static started:boolean = false;
    private static stopped:boolean = false;

    public static rateDelegate:IRateDelegate;
    private static newTime:number = 0;
    private static currentTime:number = 0;
    private static currentRate:number = 0;
    private static average:number = 0;
    private static stableRateMaxLength:number = 20;
    private static rateCheck:number = 20;    
    private static stableRate:number[];
    private static timertrackStarted:boolean;
    private static timerStartTime:number;
    private static activeTimers:Timer[] = [];
    protected static _animationRequest:boolean;
    protected static _animationRate:number = 60;
    private _currentCount:number;
    private _delay:number;
    private _repeatCount:number;
    private _running:boolean;
    private infinite:boolean;
    private timerStartTime:number;
    public name:string;
    

    constructor(delay:number, repeatCount:number = 0)
    {
        super();
        this.init(delay, repeatCount);     
    }

    public static getTimerInstance(delay:number, repeatCount:number = 0):Timer
	{
		if(Timer.TimerCache.length)
		{
			let t:Timer = Timer.TimerCache[Timer.TimerCache.length - 1];
			Timer.TimerCache.length -= 1;
			t.init(delay, repeatCount);
			return t;
        }
		return new Timer(delay, repeatCount);
	}

    public destructor():void
    {
        this.removeListeners();
        Timer.unregisterTimer(this);
        let index:number = Timer.TimerCache.indexOf(this);
		if(index < 0)
		{
			Timer.TimerCache.push(this);
		}
    }

    public init(delay:number, repeatCount:number = 0):void
    {
        this.name = null;
        this.delay = delay;
        this.repeatCount = repeatCount;
        this._currentCount = 0;
    }

    private run():void
    {        
        var timeLimit:number = parseInt(this.timerStartTime.toString()) + parseInt(this._delay.toString())        
        if(timeLimit < Timer.getTimer())
        {             
            this.timerStartTime = Timer.getTimer();
            this._currentCount += 1;  
            if(this.repeatCount > 0)
            {
                if(this._currentCount == this.repeatCount)
                {
                    let ce:TimerEvent = TimerEvent.getTimerEvent(TimerEvent.TIMER_COMPLETE);
                    ce.currentTarget = this;
                    this.dispatchEvent(ce);
                    this.stop();                   
                    return;
                }
            }    
            let te:TimerEvent = TimerEvent.getTimerEvent(TimerEvent.TIMER);
            te.currentTarget = this;
            this.dispatchEvent(te);
        }
    }

    public stop():void
    {
        this._running = false;
        Timer.unregisterTimer(this);
    }

    public start():void
    {
        if(this._running == true)
        {
            return;
        }
        this._running = true;
        this.timerStartTime = Timer.getTimer();
        Timer.registerTimer(this);  
    }

    public reset():void
    {
        this.stop();
        this._running = false;
        this.timerStartTime = Timer.getTimer();
        this._currentCount = 0; 
        this.delay = this._delay;
        this.repeatCount = this._repeatCount;
    }

    public set repeatCount(value:number)
    {
        this._repeatCount = value;
        if(this._repeatCount <= 0)
        {
            this.infinite = true;
        }
        else
        {
            this.infinite = false;
        }
    }

    public set delay(value:number)
    {
        this._delay = value;
    }

    public get repeatCount():number
    {
        return this._repeatCount;
    }

    public get delay():number
    {
        return this._delay;
    }

    public get currentCount():number
    {
        return this._currentCount;
    }

    public get running():boolean
    {
        return this._running;
    }

    public static checkFramerate():void
    {
        var interval:number = Timer.getTimer();
		Timer.newTime = interval- Timer.currentTime;
		Timer.currentTime = interval;
		Timer.currentRate = 1000 / Timer.newTime;
        Timer.average = Timer.currentRate;
        if(Timer.stableRate)
		{
			Timer.stableRate.unshift(Timer.currentRate);
			if(Timer.stableRate.length > Timer.stableRateMaxLength)
			{
				Timer.stableRate.length = Timer.stableRateMaxLength;
				var rateCheck:number = 0;
				for(var i:number = 0; i < Timer.stableRate.length; i++)
				{
					rateCheck += Timer.stableRate[i];
				}
                rateCheck = rateCheck / Timer.stableRate.length;		
                Timer.rateCheck = rateCheck;
                if(Timer.rateDelegate)
                {
                    Timer.rateDelegate.onStableRate(Timer.rateCheck);
                }
			}			
        }
        else
        {
            this.stableRate = [];
        }
    }

    public static get framerate():number
    {
        return Timer.rateCheck;
    }

    public static runTimers():void
    {
        Timer.checkFramerate();
        for(var i:number = 0; i < Timer.activeTimers.length; i++)
        {
            Timer.activeTimers[i].run();
        }
    }

    public static getTimer():number
    {
        if(!Timer.timertrackStarted)
        {
            Timer.timertrackStarted = true;
            Timer.timerStartTime = Timer.getCurrentTime();
        }
        return Math.floor(Timer.getCurrentTime() - Timer.timerStartTime);
    }

    private static getCurrentTime():number
    {
        if(window['performance'] && window['performance']['now'])
        {
            return performance.now();
        }        
        return Date.now();
    }

    private static registerTimer(timer:Timer):void
    {
        var index:number = Timer.activeTimers.indexOf(timer);
        if(index < 0)
        {
            Timer.activeTimers.push(timer);
        }
    }

    private static unregisterTimer(timer:Timer):void
    {
        var index:number = Timer.activeTimers.indexOf(timer);
        if(index >= 0)
        {
            Timer.activeTimers.splice(index, 1);
        }
    }

    public static unRegisterRunnable(runnable:IRunnable):void
	{
		if(runnable == null)
		{
			return;
		}
		var index:number = Timer.runnables.indexOf(runnable);
		if(index < 0)
		{
			return;
		}
		Timer.runnables.splice(index, 1);
    }
    
    public static stop():void
    {
        Timer.stopped = true;
        Timer.started = false;
    }

    public static start():void
    {
        if(Timer.started)
        {
            return;
        }
        Timer.stopped = false;
        Timer.started = true;
        Timer.enterFrame();
    }

	public static registerRunnable(runnable:IRunnable):void
	{
        Timer.start();
		if(runnable == null)
		{
			return;
		}
		var index:number = Timer.runnables.indexOf(runnable);
		if(index < 0)
		{
			Timer.runnables.push(runnable);
		}
    }
    
    protected static run()
    {
		for(var i:number = 0; i < Timer.runnables.length; i++)
		{
			Timer.runnables[i].run();
		}
    }
    
    protected static enterFrame():void
    {
        if(Timer._animationRequest)
        {
            requestAnimationFrame(Timer.enterFrame);
        }
        else
        {
            setTimeout(function() 
            {
                requestAnimationFrame(Timer.enterFrame);
            }, 1000 / Timer._animationRate);
        }
        Timer.run();
        Timer.runTimers();  
    }
}