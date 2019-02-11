import { trace, reveal } from "../trace";
import { BaseObject } from "../BaseObject";


export class InstanceManager
{
    // private static instanceCounter:any[] = [];
    // private static ignoreCategories:string[] = [];
    // private static registeringRef:any = {};
    private static constructorClassReference:any = {};
    private static constructorobjectReference:any = {};

    private static destructorClassReference:any = {};

    private static reuseClassReference:any = {};

    private static objectignoreReference:any = {};
    private static classignoreReference:any = {};
    // private static objectCreatedRef:any = {};
    // private static COUNT:any = {};   
    // protected static _traceRegistrations:boolean = false;
    // public name:string;

    constructor()
    {
        // super();
        // this.name = this.className;        
    }

    public static clear():void
    {
        InstanceManager.constructorClassReference = {};
        InstanceManager.constructorobjectReference = {};
        InstanceManager.destructorClassReference = {};
        InstanceManager.reuseClassReference = {};
        
        // InstanceManager.objectignoreReference = {};
        // InstanceManager.classignoreReference = {};
    }

    
    public static ignoreClass(value:string):void
    {
        delete InstanceManager.constructorClassReference[value];
        delete InstanceManager.destructorClassReference[value];
        for(let key in InstanceManager.objectignoreReference)
        {
            let classname:string = InstanceManager.objectignoreReference[key];
            if(classname == value)
            {
                delete InstanceManager.objectignoreReference[key];
            }
        }
        InstanceManager.classignoreReference[value] = true;
    }

    public static constructorCalled(value:ICountableObject):void
    {
        let classname:string = value.className;
        let objectname:string = value.instanceName;
        if(InstanceManager.objectignoreReference[objectname] != undefined)
        {
            return;
        }
        if(InstanceManager.classignoreReference[classname] != undefined)
        {
            return;
        }
        InstanceManager.constructorobjectReference[objectname] = objectname;
        if(InstanceManager.constructorClassReference[classname] == undefined)
        {
            InstanceManager.constructorClassReference[classname] = 0;
        }
        InstanceManager.constructorClassReference[classname]++;
    }

    public static reuseCount(value:ICountableObject):void
    {
        let classname:string = value.className;
        let objectname:string = value.instanceName;
        if(InstanceManager.reuseClassReference[classname] == undefined)
        {
            InstanceManager.reuseClassReference[classname] = 0;
        }
        InstanceManager.reuseClassReference[classname]++;
    }    

    public static destructorCalled(value:ICountableObject):void
    {        
        let classname:string = value.className;
        let objectname:string = value.instanceName;
        delete InstanceManager.constructorobjectReference[objectname];
        if(InstanceManager.destructorClassReference[classname] == undefined)
        {
            InstanceManager.destructorClassReference[classname] = 0;
        }
        InstanceManager.destructorClassReference[classname]++;
    }

    public static getCreationCount(classname:string):number
    {
        if(InstanceManager.constructorClassReference[classname] != undefined)
        {
            return InstanceManager.constructorClassReference[classname];
        }
        return -1;
    }

    public static displayobjectCreationStatus():void
    {
        trace("OBJECT CREATION/DESTRUCTION MONITORING:")
        for(let classname in InstanceManager.constructorClassReference)
        {
            let creationcount:number = InstanceManager.constructorClassReference[classname];
            let destructioncount:number = 0;            
            if(InstanceManager.destructorClassReference[classname] != undefined)
            {
                destructioncount = InstanceManager.destructorClassReference[classname];
            }
            let caption:string = classname + " status (constructor/destructor): " + creationcount + "/" + destructioncount;
            if(InstanceManager.reuseClassReference[classname] != undefined)
            {                
                caption = classname + " status (constructor/pooling): " + creationcount + "/" + InstanceManager.reuseClassReference[classname];
            }
            trace(caption)
        }
    }


    

    // public static destructorCalled(value:ICountableObject):void
    // {
    //     let classname:string = value.className;
    //     if(InstanceManager.destryoedclassref[classname] == undefined)
    //     {
    //         InstanceManager.destryoedclassref[classname] = 0;
    //     }
    //     InstanceManager.destryoedclassref[classname]++;
    // }










    // public static addInstanceCount(className:string):void
    // {
    //     if(InstanceManager.instanceCounter[className] == undefined)
    //     {
    //         InstanceManager.instanceCounter[className] = 0;
    //     }
    //     InstanceManager.instanceCounter[className]++;
    // }

    // public static getInstanceCount(className:string):number
    // {
    //     if(InstanceManager.instanceCounter[className] == undefined)
    //     {
    //         return 0;
    //     }
    //     return InstanceManager.instanceCounter[className];
    // }

    // public static revealTextures():void
	// {
    //     trace("Reveal Textures: " )
    //     for(let key in PIXI.utils.TextureCache)
    //     {
    //         let tx = PIXI.utils.TextureCache[key];
    //         trace("texture id: " + key)
    //         reveal(tx)
    //     }		
	// }

    // public static addIgnoreCategory(car:string):void
    // {
    //     InstanceManager.ignoreCategories.push(car);
    // }

    // public static clearignoreCategories():void
    // {
    //     InstanceManager.ignoreCategories = [];
    // }

    // public static showRegistration():void
    // {
    //     InstanceManager._traceRegistrations = true;
    // }

    // public static register(value:ICountableObject):void
    // {
    //     if(InstanceManager.COUNT[value.instanceName] != undefined)
    //     {
    //         return;
    //     }
    //     InstanceManager.COUNT[value.instanceName] = value;   
    //     if(InstanceManager._traceRegistrations)
    //     {
    //         if(value.className == undefined || value.className == null)
    //         {
    //             trace("Missing class name: " + value.className)
    //         }
    //         else
    //         {
    //             if(InstanceManager.registeringRef[value.className] == undefined)
    //             {
    //                 InstanceManager.registeringRef[value.className] = true;
    //                 trace("registering: " + value.className)
    //             }
    //         }    
    //     }    
    //     InstanceManager.addObjectCreation(value.className);        
    // }    

    // public static addObjectCreation(value:string):void
    // {
    //     if(!value || value.length == 0)
    //     {   
    //         return;
    //     }
    //     if(InstanceManager.objectCreatedRef[value] == undefined)
    //     {
    //         InstanceManager.objectCreatedRef[value] = 0;
    //     }
    //     InstanceManager.objectCreatedRef[value]++;
    // }

    // public static hasInstance(value:ICountableObject):boolean
    // {        
    //     if(InstanceManager.COUNT[value.instanceName] != undefined)
    //     {
    //         return true;
    //     }  
    //     return false;
    // }



    // public static unregister(value:ICountableObject):void
    // {        
        


    //     // trace("unregister: " + classname + " total: " + InstanceManager.destryoedclassref[classname])
    //     delete InstanceManager.COUNT[value.instanceName];  
    // }

    // public static unregisterClass(classname:string):void
    // {        
    //     for(let key in InstanceManager.COUNT)
    //     {
    //         var instance = InstanceManager.COUNT[key];
    //         if(instance.className == classname)
    //         {
    //             delete InstanceManager.COUNT[instance.instanceName];  
    //         }
    //     }        
    // }

    // public static getCategory(category:string):ICountableObject[]
    // {
    //     let instancecategory:ICountableObject[] = [];
    //     for(let key in InstanceManager.COUNT)
    //     {
    //         var instance = InstanceManager.COUNT[key];
    //         if(instance.className == category)
    //         {
    //             instancecategory.push(instance);
    //         }
    //     }
    //     return instancecategory;
    // }

    // public static revealCategory(category:string):void
    // {
    //     for(let key in InstanceManager.COUNT)
    //     {
    //         var instance = InstanceManager.COUNT[key];
    //         if(instance.className == category)
    //         {
    //             reveal(instance);
    //         }
    //     }
    // }

    // public static showObjectCreation(showDestruction:boolean = false):void
    // {
    //     for(let key in InstanceManager.objectCreatedRef)
    //     {
    //         let caption:string = key + " constructor called " + InstanceManager.objectCreatedRef[key] + " times.";
    //         if(showDestruction)
    //         {
    //             if(InstanceManager.destryoedclassref[key] != undefined)
    //             {
    //                 caption = key + " constructor/destructor " + InstanceManager.objectCreatedRef[key] + "/" + InstanceManager.destryoedclassref[key];
    //             }
    //         }
    //         trace(caption)
    //     }
    // }

    // public static countObject():void
    // {
    //     var categories:any = {};
    //     let count:number = 0;
    //     for(let key in InstanceManager.COUNT)
    //     {
    //         var instance = InstanceManager.COUNT[key];
    //         if(instance.className != undefined || instance.className != null)
    //         {
    //             if(categories[instance.className] == undefined)
    //             {
    //                 categories[instance.className] = 1;
    //             }
    //             else
    //             {
    //                 categories[instance.className]++;
    //             }
    //         }
    //         else
    //         {
    //             trace("Undefined class for: ");
    //             reveal(instance);
    //         }
    //         count++;
    //     }
    //     trace("Total CountableObject: " + count);
    //     for(let classname in categories)
    //     {
    //         if(InstanceManager.ignoreCategories.indexOf(classname) >= 0)
    //         {
    //             continue;
    //         }
    //         else
    //         {
    //             trace(classname + ": in memory");
    //         }            
    //     }
    //     // trace("Textures: " + InstanceManager.countCache(PIXI.utils.TextureCache))
    //     // trace("Base Textures: " + InstanceManager.countCache(PIXI.utils.BaseTextureCache))   
        
    //     for(let classname in InstanceManager.destryoedclassref)
    //     {
    //         trace(classname + " : destroyed")
    //     }

    // }

    // protected static countCache(value:any):number
    // {
    //     let count:number = 0;
    //     for(let key in value)
    //     {
    //         count++;
    //     }
    //     return count;
    // }
}

export interface ICountableObject
{
    instanceName:string;
    className:string;
    destructor():void;
}