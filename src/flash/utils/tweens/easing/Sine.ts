

export class Sine
{

	public static easeIn(t:number, b:number, c:number, d:number):number
	{
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	}

	public static easeOut(t:number, b:number, c:number, d:number):number
	{
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	}

	public static easeInOut(t:number, b:number, c:number, d:number):number
	{
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	}

}
