export default function ticketSoldQuantityFormatter(num){
      if(num > 999 && num < 1000000){
          return  + (Math.round(((num/1000)+ Number.EPSILON)* 10000)/10000) + 'K';
      }else if(num > 999999 && num < 1000000000){
          return  + (Math.round(((num/1000000)+ Number.EPSILON)* 10000)/10000) + 'M';
      }
      else if(num > 999999999&& num < 1000000000000){
          return  + (Math.round(((num/1000000000)+ Number.EPSILON)* 10000)/10000) + 'B';
      }
      else if(num > 999999999999 && num < 1000000000000000){
          return  + (Math.round(((num/1000000000000)+ Number.EPSILON)* 10000)/10000) + 'T';
      }
      else if(num < 999){
          return + (Math.round((num)* 1000000)/1000000); 
      }
      else if(num > 999999999999999){
          return  + (Math.round(((num / 1000000000000000)+ Number.EPSILON)* 10000)/10000) + 'P'
      }
      else {
          return  +  (Math.round(((num))* 1000000)/1000000);
      }
}