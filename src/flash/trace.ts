
export const trace = function(value:any) 
{
    try
    {
        if(!value)
        {
            var result:string = "show: null";
        }
        else
        {
            var result:string = "show: " + value.toString();
        }		
        console.log(result);
    }
    catch(e)
    {

    }
}

export const revealMethods = function(value:any) 
{
    try
    {
        if(!value)
        {
            var result:string = "reveal methods: null";
        }
        else
        {
            var result:string = "reveal methods: ";
        }
        for(var key in value)
        {
            var instanceItem:any = value[key];
            if(instanceItem instanceof Function)
            {
                result += 'method: ' + key + ' : ' + value[key] + "\n";
                
            }       	
        }
        console.log(result);
    }
    catch(e)
    {

    }		   
}

export const reveal = function(value:any) 
{
    if(!value)
    {
        var result:string = "reveal: null";
        console.log(result);
        return;
    }
    if(value === undefined)
    {
        var result:string = "reveal: undefined";
        console.log(result);
        return;
    }
    var result:string = "reveal: ";			
    for(var key in value)
    {
        var instanceItem:any = getValue(key, value);
        if(instanceItem)
        {
            if(instanceItem instanceof Function)
            {
                result += 'method: ' + key + "\n";				
            }
            else
            {
                try
                {
                    result += key + ' : ' + instanceItem + "\n";
                }
                catch(e)
                {

                }
                                                    
            } 
        }	
    }
    console.log(result);	   
}

const getValue = function(key:string, value:any):any
{
    var valueResult:any = null;
    try
    {
        valueResult = value[key];
    }
    catch(e)
    {

    }
    return valueResult;
}