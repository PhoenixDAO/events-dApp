import React from "react"
import Skeleton from '@material-ui/lab/Skeleton';

export function pricingFormatter(num, currencyType) {
	if (typeof num === "string" && currencyType == "$") {
		if (num == "" || num == "0" || num == "$0" || num == "0.00000") {
			return null;
		}
		if (num.includes("$")) {
			num = num.split("$");
			return formatting(num[1], currencyType);
		}
		return formatting(num, currencyType);
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
		return formatting(parseFloat(num), currencyType);
	} else if (typeof num === "number") {
		return formatting(num, currencyType);
	} else {
		return null;
	}
}
function formatting(num, type) {
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
			return roundingPrice(num, 1000) + "K " + type;
		} else if (num > 999999 && num < 1000000000) {
			return roundingPrice(num, 1000000) + "M " + type;
		} else if (num > 999999999 && num < 1000000000000) {
			return roundingPrice(num, 1000000000) + "B " + type;
		} else if (num > 999999999999 && num < 1000000000000000) {
			return roundingPrice(num, 1000000000000) + "T " + type;
		} else if (num < 999) {
			return roundingPrice(num * 1000000, 1000000) + " " + type;
		} else if (num > 999999999999999) {
			return roundingPrice(num, 1000000000000000) + "P " + type;
		} else {
			return roundingPrice(num, 1) + " " + type;
		}
	}
}

function roundingPrice(num, limit) {
	return (
		Math.round((num / limit + Number.EPSILON) * 10000) / 10000 ?
		Math.round((num / limit + Number.EPSILON) * 10000) / 10000:"- "
	);
}
