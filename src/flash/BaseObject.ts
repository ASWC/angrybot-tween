import { InstanceManager } from "./system/InstanceManager";
import { trace } from "./trace";

export class BaseObject
{
    private static nameCount:number = 0;    
    public countID:number;
    protected _name:string;
    protected _instanceName:string;
    protected _tracked:boolean;

    constructor()
    {
        this._tracked = true;
        BaseObject.nameCount++;
        this._name = "instance-" + this.className + "-" + BaseObject.nameCount;
        this._instanceName = "instance-" + this.className + "-" + BaseObject.nameCount;
        InstanceManager.constructorCalled(this);
    }    

    public static getInstanceName(classname:string):string
    {
        BaseObject.nameCount++;
        return "instance-" + classname + "-" + BaseObject.nameCount;
    }

    public get instanceName():string
    {
        return this._instanceName;
    }

    public set instanceName(value:string)
    {
        this._instanceName = value;
    } 

    public get name():string
    {
        return this._name;
    }

    public set name(value:string)
    {
        this._name = value;
    } 
    
    public destructor():void
    {
        InstanceManager.destructorCalled(this);
    }

    public stopTracking():void
    {
        this._tracked = false;
        // InstanceManager.unregister(this);
    }

    public getType():string
    {
        return this.constructor['name'];
    }

    public get className():string
    {
        return this.constructor['name'];
    }
}