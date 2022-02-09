import React from "react"
import Skeleton from '@material-ui/lab/Skeleton';

export function pricingFormatter(num, currencyType, isPHNX) {
	if (typeof num === "string" && currencyType == "$") {
		if (num == "" || num == "0" || num == "$0" || num == "0.00000") {
			return null;
		}
		if (num.includes("$")) {
			num = num.split("$");
			return formatting(num[1], currencyType,isPHNX);
		}
		return formatting(num, currencyType,isPHNX);
	} else if (typeof num === "string" && currencyType == "PHNX") {
		if (
			num == "FREE" ||
			num == "0.000000" ||
			num == "0.00000"||
			num == "0.000000PHNX" ||
			num == "0.000" ||
			num == "0.000PHNX"
		) {
			return "Free";
		}
		// num = parseInt(num.split("PHNX")[0]);
		// return formatting(num,currencyType);
		return formatting(parseFloat(num), currencyType,isPHNX);
	} else if (typeof num === "number") {
		return formatting(num, currencyType,isPHNX);
	} else {
		return null;
	}
}
function formatting(number, type,isPHNX) {
	let num = isPHNX?number:number * 1.02;
	if (type == "$") {
		if (num > 999 && num < 1000000) {
			return type + roundingPrice(num, 1000) + "K";
		} else if (num > 999999 && num < 1000000000) {
			return type + roundingPrice(num, 1000000) + "M";
		} else if (num > 999999999 && num < 1000000000000) {
			return type + roundingPrice(num, 1000000000) + "B";
		} else if (num > 999999999999 && num < 1000000000000000) {
			return type + roundingPrice(num, 1000000000000) + "T";
		} else if (num < 999) {
			return type + roundingPrice(num * 1000000, 1000000);
		} else if (num > 999999999999999) {
			return type + roundingPrice(num, 1000000000000000) + "P";
		} else {
			return type + Math.round(num * 1000000) / 1000000;
		}
	} else {
		if (num > 999 && num < 1000000) {
			return roundingPrice(num, 1000) + "K ";
		} else if (num > 999999 && num < 1000000000) {
			return roundingPrice(num, 1000000) + "M ";
		} else if (num > 999999999 && num < 1000000000000) {
			return roundingPrice(num, 1000000000) + "B ";
		} else if (num > 999999999999 && num < 1000000000000000) {
			return roundingPrice(num, 1000000000000) + "T ";
		} else if (num < 999) {		
			if(num<=0.0001){
				return roundingPrice(num * 100000000, 100000000) + " ";
			} 
			return roundingPrice(num * 100000, 100000) + " ";
		} else if (num > 999999999999999) {
			return roundingPrice(num, 1000000000000000) + "P ";
		} else {
			return roundingPrice(num, 1) + " ";
		}
	}
}

function roundingPrice(num, limit) {
	return (
		Math.round((num / limit + Number.EPSILON) * 1000000) / 1000000 ?
		(((Math.round((num / limit + Number.EPSILON) * 1000000) / 1000000).toFixed(2) == 0.00)?(Math.round((num / limit + Number.EPSILON) * 1000000) / 1000000).toFixed(6):(Math.round((num / limit + Number.EPSILON) * 1000000) / 1000000).toFixed(2)):"- "
	);
}