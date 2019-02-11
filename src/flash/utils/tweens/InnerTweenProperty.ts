import { BaseObject } from "../../BaseObject";

export class InnerTweenProperty extends BaseObject
{
	private static InnerTweenPropertyCache:InnerTweenProperty[] = [];

	private target:any;
	private property:string;
	private beginValue:number = 0;
	private difference:number = 0;
	private endValue:number = 0;
	private ease:Function;

	constructor(target:any, property:string, beginValue:number, difference:number, endValue:number, ease:Function)
	{
		super();
		this.reset(target, property, beginValue, difference, endValue, ease);
	}

	public destructor():void
	{
		this.target = null;
		this.property = "";
		this.beginValue = 0;
		this.difference = 0;
		this.endValue = 0;
		this.ease = null;
		let index:number = InnerTweenProperty.InnerTweenPropertyCache.indexOf(this);
		if(index < 0)
		{
			InnerTweenProperty.InnerTweenPropertyCache.push(this);
		}		
	}

	public reset(target:any, property:string, beginValue:number, difference:number, endValue:number, ease:Function):void
	{
		this.target = target;
		this.property = property;
		this.beginValue = beginValue;
		this.difference = difference;
		this.endValue = endValue;
		this.ease = ease;
	}

	public static getInnerTweenProperty(target:any, property:string, beginValue:number, difference:number, endValue:number, ease:Function):InnerTweenProperty
	{
		if(InnerTweenProperty.InnerTweenPropertyCache.length)
		{
			let dt:InnerTweenProperty = InnerTweenProperty.InnerTweenPropertyCache[InnerTweenProperty.InnerTweenPropertyCache.length - 1];
			InnerTweenProperty.InnerTweenPropertyCache.length -= 1;
			dt.reset(target, property, beginValue, difference, endValue, ease);
			return dt;
		}
		return new InnerTweenProperty(target, property, beginValue, difference, endValue, ease);
	}

	public finalize():void
	{
		this.target[this.property] = this.endValue;
	}

	public update(time:number, duration:number):void
	{
		this.target[this.property] = this.ease(time, this.beginValue, this.difference, duration);
	}

}
