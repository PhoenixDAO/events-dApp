// export function pricingFormatter(num) {
//     const lookup = [
//       { value: 1, symbol: "" },
//       { value: 1e3, symbol: "k" },
//       { value: 1e6, symbol: "M" },
//       { value: 1e9, symbol: "G" },
//       { value: 1e12, symbol: "T" },
//       { value: 1e15, symbol: "P" },
//       { value: 1e18, symbol: "E" }
//     ];
//     if(typeof(num) === "string"){
//         if (num == "FREE"){
//             return "FREE"
//         }
//         // const number = num.split("PHNX")
//         // const price = parseInt(number[0]);
//         num = parseInt(num.split("PHNX")[0]);
//         const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
//         var item = lookup.slice().reverse().find(function(item) {
//             return num >= item.value;
//         });
//         num = item ? (num / item.value) .replace(rx, "$1") + item.symbol : "0";
//         return num + " PHNX"
//     }
//     else{
//         return null
//     }
//   }
  

export function pricingFormatter(num, currencyType){
    if(typeof(num) === "string" && currencyType == "$"){
        if (num == "" || num == "0"){
            return null
        }
            if(num.includes("$")){
                num = num.split("$")
                return formatting(num[1],currencyType);
            }
            
            return formatting(num,currencyType);
    }
    else if (typeof(num) === "string" && currencyType == "PHNX"){
        if (num == "FREE" || num == "0.00"){
            return "FREE"
        }
        // num = parseInt(num.split("PHNX")[0]);
        // return formatting(num,currencyType);
        return formatting(parseFloat(num), currencyType);
    }
    else if(typeof(num) === "number"){
        return formatting(num, currencyType);
    }
    else{
        return null
    }
  }

  function formatting(num, type){
      if(type =="$"){
        if(num > 999 && num < 1000000){
            return type + (Math.round(((num/1000)+ Number.EPSILON)* 10000)/10000) + 'K';
        }else if(num > 999999 && num < 1000000000){
            return type + (Math.round(((num/1000000)+ Number.EPSILON)* 10000)/10000) + 'M';
        }
        else if(num > 999999999&& num < 1000000000000){
            return type + (Math.round(((num/1000000000)+ Number.EPSILON)* 10000)/10000) + 'B';
        }
        else if(num > 999999999999 && num < 1000000000000000){
            return type + (Math.round(((num/1000000000000)+ Number.EPSILON)* 10000)/10000) + 'T';
        }
        else if(num < 999){
            return type+ (Math.round((num)* 1000)/1000); 
        }
        else if(num > 999999999999999){
            return type + (Math.round(((num / 1000000000000000)+ Number.EPSILON)* 10000)/10000) + 'P'

        }
        else {
            return type +  (Math.round(((num))* 10000)/10000);
        }
        
      }else{
        if(num > 999 && num < 1000000){
            return (Math.round(((num/1000)+ Number.EPSILON)* 10000)/10000) + 'K ' + type;
        }else if(num > 999999 && num < 1000000000){
            return (Math.round(((num/1000000)+ Number.EPSILON)* 10000)/10000) + 'M ' + type;
        }
        else if(num > 999999999 && num < 1000000000000){
            return (Math.round(((num/1000000000)+ Number.EPSILON)* 10000)/10000) + 'B ' + type;
        }
        else if(num > 999999999999 && num < 1000000000000000){
            return (Math.round(((num/1000000000000)+ Number.EPSILON)* 10000)/10000) + 'T ' + type;
        }
        else if(num < 999){
            return (Math.round((num)* 10000)/10000) +" "+ type; 
        }
        else if(num > 999999999999999){
            return (Math.round(((num / 1000000000000000)+ Number.EPSILON)* 10000)/10000)+'P '+ type;
            
        }
        else {
            return (Math.round(((num))* 10000)/10000) +" " + type;
        }
        
      }
   
  }