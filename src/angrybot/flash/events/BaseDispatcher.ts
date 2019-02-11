import { EventDispatcher } from "../../../flash/events/EventDispatcher";

export class BaseDispatcher extends EventDispatcher
{
	protected isDestroyed:boolean;

	constructor()
	{
		super();
	}

	public set tracking(value:boolean)
	{
		
	}

	public get destroyed():boolean
	{
		return this.isDestroyed;
	}

	public destructor():void
	{
		super.destructor();
		if(this.isDestroyed)
		{
			return;
		}
		this.isDestroyed = true;
	}


}
