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
//         num = item ? (num / item.value).toFixed(4).replace(rx, "$1") + item.symbol : "0";
//         return num + " PHNX"
//     }
//     else{
//         return null
//     }
//   }
  

export function pricingFormatter(num, currencyType){
    if(typeof(num) === "string" && currencyType == "$"){
        if (num == "FREE"){
            return "FREE"
        }
            if(num.includes("$")){
                num = num.split("$")
                return formatting(num[1],currencyType);
            }
            
            return formatting(num,currencyType);
    }
    else if (typeof(num) === "string" && currencyType == "PHNX"){
        if (num == "FREE"){
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
            return type + (num/1000).toFixed(4) + 'K';
        }else if(num > 1000000){
            return type + (num/1000000).toFixed(4) + 'M';
        }else if(num < 900){
            return type+(num); 
        }
      }else{
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(4) + 'K ' + type;
        }else if(num > 1000000){
            return (num/1000000).toFixed(4) + 'M ' + type;
        }else if(num < 999){
            return num +" "+ type; 
        }
      }
   
  }