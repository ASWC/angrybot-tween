import { BaseDispatcher } from "../events/BaseDispatcher";
import { InnerTweenProperty } from "../../../flash/utils/tweens/InnerTweenProperty";
import { Linear } from "../../../flash/utils/tweens/easing/Linear";
import { Timer } from "../../../flash/utils/Timer";
import { ContextTweenEvent } from "../../../flash/events/ContextTweenEvent";

export class ContextTween extends BaseDispatcher
{
	private static ContextTweenCache:ContextTween[] = [];
	private static ContextTweenDestructorQueue:ContextTween[] = [];
	private static activeTweens:ContextTweenReference = {};
	public target:any;
	private func:Function;
	private _duration:number = 0;
	private _time:number = 0;
	private _startTime:number = 0;
	private prevTime:number = 0;
	private properties:InnerTweenProperty[];
	private needEndDispatch:boolean;
	private needChangeDispatch:boolean;

	constructor(target:any, duration:number, props:Object, easing:Function = null)
	{
		super();
		if(!target)
		{
			return;
		}
		this.reset(target, duration, props, easing);
	}

	public destructor():void
	{
		delete ContextTween.activeTweens[this.instanceName];
		Timer.unRegisterRunnable(this);
		this.removeListeners();
		this.target = null;		
		if(this.properties.length)
		{
			while(this.properties.length)
			{
				let itp:InnerTweenProperty = this.properties.shift();
				itp.destructor();
			}
		}		
		let index:number = ContextTween.ContextTweenCache.indexOf(this);
		if(index < 0)
		{
			ContextTween.ContextTweenCache.unshift(this);
		}		
	}

	public reset(target:any, duration:number, props:Object, easing:Function = null):void
	{		
		if(!target)
		{
			return;
		}
		this.target = target;
		if (easing instanceof Function)
		{
			this.func = easing;
		}
		else
		{
			this.func = Linear.easeNone;
		}
		this.properties = []
		for (var value in props)
		{
			var property:InnerTweenProperty = InnerTweenProperty.getInnerTweenProperty(target, value, target[value], props[value] - target[value], props[value], this.func);
			this.properties.push(property);
		}
		this._duration = (duration <= 0) ? Infinity : duration;
		this._time = 0;
		this._startTime = Timer.getTimer();
		this.prevTime = 0;
		Timer.registerRunnable(this);
	}

	public static getContextTween(target:any, duration:number, props:Object, easing:Function = null):ContextTween
	{
		if(ContextTween.ContextTweenCache.length)
		{
			let dt:ContextTween = ContextTween.ContextTweenCache[ContextTween.ContextTweenCache.length - 1];
			ContextTween.ContextTweenCache.length -= 1;
			dt.reset(target, duration, props, easing);
			ContextTween.activeTweens[dt.instanceName] = dt;
			return dt;
		}
		let dt:ContextTween = new ContextTween(target, duration, props, easing);
		ContextTween.activeTweens[dt.instanceName] = dt;
		return dt;
	}

	public run():void
	{		
		var currentTime:number = (Timer.getTimer() - this._startTime) / 1000;
		this.prevTime = this._time;
		if(this.target == null)
		{
			return;
		}
		if (currentTime > this._duration)
		{
			ContextTween.stopActiveTween(this);
			for (var i:number = 0; i < this.properties.length; i++)
			{
				this.properties[i].finalize();
			}			
			if(this.hasEventListener(ContextTweenEvent.MOTION_END))
			{
				var endEvent:ContextTweenEvent = ContextTweenEvent.getContextTweenEvent(ContextTweenEvent.MOTION_END);
				endEvent.contextTarget = this.target;
				this.dispatchEvent(endEvent);
			}
			if(this.hasEventListener(ContextTweenEvent.MOTION_UPDATE))
			{
				var change:number = (currentTime / this._duration) * 100;
				if(change > 100)
				{
					change = 100;
				}
				var changeEvent:ContextTweenEvent = ContextTweenEvent.getContextTweenEvent(ContextTweenEvent.MOTION_UPDATE);
				changeEvent.contextTarget = this.target;
				changeEvent.percent = change;
				this.dispatchEvent(changeEvent);
			}
			ContextTween.destroyTween(this);
		}
		else
		{
			this._time = currentTime;
			for (i = 0; i < this.properties.length; i++)
			{
				this.properties[i].update(this._time, this._duration);
			}
			if(this.hasEventListener(ContextTweenEvent.MOTION_UPDATE))
			{
				change = (currentTime / this._duration) * 100;
				if(change > 100)
				{
					change = 100;
				}
				changeEvent = ContextTweenEvent.getContextTweenEvent(ContextTweenEvent.MOTION_UPDATE);
				changeEvent.contextTarget = this.target;
				changeEvent.percent = change;
				this.dispatchEvent(changeEvent);
			}
		}
	}

	public static stop(obj:any = -1):void
	{				
		let tweendeletedconfirm:boolean = false;
		for(var key in ContextTween.activeTweens)
		{
			var currentTween:ContextTween = ContextTween.activeTweens[key];
			if(obj != null)
			{
				if(currentTween.target == obj)
				{
					tweendeletedconfirm = true;
					ContextTween.destroyTween(currentTween);
				}
			}
			else if(obj == -1)
			{
				ContextTween.destroyTween(currentTween);
			}
		}
	}

	public static to(obj:any, duration:number, props:Object, easing:Function = null, stopPrevious:boolean = true):ContextTween
	{
		if(stopPrevious)
		{
			ContextTween.stop(obj);
		}	
		return ContextTween.getContextTween(obj, duration, props, easing);
	}	

	private static stopActiveTween(tween:ContextTween)
	{
		Timer.unRegisterRunnable(tween);		
		delete ContextTween.activeTweens[tween.instanceName];	
	}

	private static destroyTween(tween:ContextTween)
	{		
		ContextTween.stopActiveTween(tween);
		tween.destructor();		
	}

}

interface ContextTweenReference
{
	[name:string] : ContextTween;
}
