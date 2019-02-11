import { Event } from './Event';
import { IEventDispatcher } from "./IEventDispatcher";
import { BaseObject } from "../BaseObject";
import { trace, reveal } from '../trace';
import { InstanceManager } from '../system/InstanceManager';

export class EventDispatcher extends BaseObject implements IEventDispatcher
{
    private static instanceCount:number = 0;
    public static VERBOSE:boolean = false;

    public instanceName:string;  
    protected registeredListeners:EventReference;
    protected _isLogAllowed:boolean;
    protected _constructed:boolean = false;

    constructor(dispatcher:IEventDispatcher = null)
    {
        super();
        this._constructed = true;
        this._name = this.instanceName;
        this.registeredListeners = {}; 
    }    

    public destructor():void
    {
        super.destructor();
        this.removeListeners();
    }

    public revealMethods(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public reveal(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public show(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public removeListeners(exceptions:any = null)
    {
        for(var i in this.registeredListeners)
        {
            var methods:MethodScope[] = this.registeredListeners[i];
            while(methods.length)
            {
                let ms:MethodScope = methods.shift();
                ms.destructor();
            }
            delete this.registeredListeners[i];       
        }
        this.registeredListeners = {};
    }

    public hasEventListener(type:string):boolean
    {      
        if(this.registeredListeners[type] != null)
        {
            var methods:MethodScope[] = this.registeredListeners[type];
            if(methods && methods.length)
            {
                return true;
            }
            return false;
        }        
        return false;
    }

    public removeEventListener(type:string, listener:Function, useCapture:boolean = false)
    {
        if(this.registeredListeners[type] != null)
        {
            var methods:MethodScope[] = this.registeredListeners[type];
            if(methods && methods.length)
            {            
                for(var i:number = 0; i < methods.length; i++)
                {
                    if(methods[i].objectFunction == listener)
                    {
                        methods[i].destructor();
                        methods.splice(i, 1);
                    }
                }
            }
            if(!methods.length)
            {
                delete this.registeredListeners[type];
            }
        }
    }

    public dispatchEvent(event:Event):void
    {     
        if(this.registeredListeners[event.type] != null)
        {            
            event.currentTarget = this;
            var methods:MethodScope[] = this.registeredListeners[event.type];  
            if(methods && methods.length)
            {
                let methodcopy:MethodScope[] = methods.concat();
                methodcopy = methodcopy.sort(this.getMethodPriority);                
                while(methodcopy.length)
                {                          
                    var method:MethodScope = methodcopy.shift();
                    if(method.eventType != event.type)
                    {
                        continue;
                    }
                    if(method)
                    {                  
                        this.trigger(method, event);                
                    }                    
                }
            }
        }
        if(event.isDisposable)
        {          
            event.destructor();
        }
        if(EventDispatcher.VERBOSE)
        {
            EventDispatcher.VERBOSE = false;
        }
    }

    protected getMethodPriority(method1:MethodScope, method2:MethodScope):number
    {
        if(method1.priority > method2.priority)
        {
            return 1;
        }
        return -1;
    }

    protected trigger(method:MethodScope, event:Event)
    {
        if(method.objectFunction)
        {
            method.objectFunction.call(method.scope, event);
        }   
    }

    protected isRegistered(type:string, listener:Function):boolean
    {
        if(!this.registeredListeners[type])
        {
            return false;
        }
        var methods:MethodScope[] = this.registeredListeners[type];
        for(var i:number = 0; i < methods.length; i++)
        {
            if(methods[i].objectFunction == listener)
            {
                return true;
            }
        }
        return false;
    }

    public addEventListener(type:string, listener:Function, scope:any = null, priority:number = 0, weakreference:boolean = false):void
    {                       
        if(this.isRegistered(type, listener))
        {
            return;
        }
        if(!this.registeredListeners[type])
        {
            this.registeredListeners[type] = [];
        }
        var methods:MethodScope[] = this.registeredListeners[type];
        var methodScope:MethodScope = MethodScope.getMethodScope();
        methodScope.eventType = type;       
        methodScope.parentDispatcher = this;
        methodScope.objectFunction = listener;
        methodScope.scope = scope;
        methodScope.priority = priority;  
        methods.push(methodScope);            
    }

    

    
}

interface EventReference
{
    [name:string]: MethodScope[];
}

class MethodScope extends BaseObject
{
    private static MethodScopeCache:MethodScope[] = [];

    public objectFunction:Function;
    public scope:any;
    public parentDispatcher:EventDispatcher;
    public priority:number;    
    public eventType:string;

    constructor()
    {
        super();
        this.reset();
    }

    public reset():void
    {
        this.objectFunction = null;
        this.scope = null;
        this.parentDispatcher = null;
        this.priority = 0;
        this.eventType = null;
    }

    public static getMethodScope():MethodScope
    {
        if(MethodScope.MethodScopeCache.length)
        {
            let te:MethodScope = MethodScope.MethodScopeCache[MethodScope.MethodScopeCache.length - 1];
            MethodScope.MethodScopeCache.length -= 1;
            te.reset();
            return te;
        }
        return new MethodScope();
    }

	public destructor():void
    {
        this.objectFunction = null;
        this.scope = null;
        this.parentDispatcher = null;
        InstanceManager.reuseCount(this);
        let index:number = MethodScope.MethodScopeCache.indexOf(this);
        if(index < 0)
        {
            MethodScope.MethodScopeCache.unshift(this);
        }
    }
}