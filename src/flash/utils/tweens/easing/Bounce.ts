//import: import Bounce = require("angrybot/flash/tweens/easing/Bounce");

export class Bounce
{

	public static easeOut(t:number, b:number, c:number, d:number):number
	{
		if ((t /= d) < (1 / 2.75))
		return c * (7.5625 * t * t) + b;
		else if (t < (2 / 2.75))
		return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		else if (t < (2.5 / 2.75))
		return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		else
		return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
	}

	public static easeIn(t:number, b:number, c:number, d:number):number
	{
		return c - Bounce.easeOut(d - t, 0, c, d) + b;
	}

	public static easeInOut(t:number, b:number, c:number, d:number):number
	{
		if (t < d/2)
		return Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
		else
		return Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	}

}
