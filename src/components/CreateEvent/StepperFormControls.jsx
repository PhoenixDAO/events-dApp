import { useState, useEffect } from "react";
import { pricingFormatter } from "../../utils/pricingSuffix";
import RichTextEditor from "react-rte";
import Geonames from "geonames.js";
import PropTypes from "prop-types";

const geonames = new Geonames({
	username: "thalesandrade",
	lan: "en",
	encoding: "JSON",
});

const PostContactForm = async (values, successCallback, errorCallback) => {
	// do stuff
	// if successful
	if (true) successCallback();
	else errorCallback();
};



// const initialFormValues= {
// 	fullName: parsedCookies.fullName && typeof(parsedCookies.fullName) !='undefined' ? parsedCookies.fullName : "",
// 	email: parsedCookies.email && typeof(parsedCookies.email) !='undefined' ? parsedCookies.email : "",
// 	message: parsedCookies.message && typeof(parsedCookies.message) !='undefined' ? parsedCookies.message : "",
// 	formSubmitted: parsedCookies.formSubmitted
// 	 && typeof(parsedCookies.formSubmitted) !='undefined'	? parsedCookies.formSubmitted
// 		: false,
// 	success: parsedCookies.success && typeof(parsedCookies.success) !='undefined' ? parsedCookies.success : false,
// 	//1st_stepper
// 	eventName: parsedCookies.eventName && typeof(parsedCookies.eventName) !='undefined' ? parsedCookies.eventName : "",
// 	eventOrganizer: parsedCookies.eventOrganizer
// 	 && typeof(parsedCookies.eventOrganizer) !='undefined'	? parsedCookies.eventOrganizer
// 		: "",
// 	eventTime: parsedCookies.eventTime
// 	 && typeof(parsedCookies.eventTime) !='undefined'	? parsedCookies.eventTime
// 		: "onedayevent",
// 	eventDate: parsedCookies.eventDate && typeof(parsedCookies.eventDate) !='undefined' ? parsedCookies.eventDate : null,
// 	eventStartTime: parsedCookies.eventStartTime
// 	 && typeof(parsedCookies.eventStartTime) !='undefined'	? parsedCookies.eventStartTime
// 		: null,
// 	eventEndTime: parsedCookies.eventEndTime
// 	 && typeof(parsedCookies.eventEndTime) !='undefined'	? parsedCookies.eventEndTime
// 		: null,
// 	eventStartDate: parsedCookies.eventStartDate
// 	 && typeof(parsedCookies.eventStartDate) !='undefined'	? parsedCookies.eventStartDate
// 		: null,
// 	eventEndDate: parsedCookies.eventEndDate
// 	 && typeof(parsedCookies.eventEndDate) !='undefined'	? parsedCookies.eventEndDate
// 		: null,
// 	//2nd_stepper
// 	eventType: parsedCookies.eventType && typeof(parsedCookies.eventType) !='undefined' ? parsedCookies.eventType : "physical",
// 	eventTopic: parsedCookies.eventTopic && typeof(parsedCookies.eventTopic) !='undefined' ? parsedCookies.eventTopic : "",
// 	eventLocation: parsedCookies.eventLocation
// 	 && typeof(parsedCookies.eventLocation) !='undefined'	? parsedCookies.eventLocation
// 		: "",
// 	eventLink: parsedCookies.eventLink && typeof(parsedCookies.eventLink) !='undefined' ? parsedCookies.eventLink : "",
// 	country: {
// 		id: parsedCookies.country == null && typeof(parsedCookies.country) != 'undefined'
// 			 && typeof(parsedCookies.country) !='undefined'	? ""
// 				: parsedCookies.country.id,
// 		name:
// 			parsedCookies.country == null && typeof(parsedCookies.country) != 'undefined'
// 			 && typeof(parsedCookies.country) !='undefined'	? ""
// 				: parsedCookies.country.name,
// 	},
// 	state: {
// 		id:
// 			parsedCookies.state == null && typeof(parsedCookies.state) != 'undefined'
// 			 && typeof(parsedCookies.state) !='undefined'	? ""
// 				: parsedCookies.state.id,
// 		name:
// 			parsedCookies.state == null && typeof(parsedCookies.state) != 'undefined'
// 			 && typeof(parsedCookies.state) !='undefined'	? ""
// 				: parsedCookies.state.name,
// 	},
// 	city: {
// 		id:
// 			parsedCookies.city == null && typeof(parsedCookies.city )!= 'undefined'
// 			 && typeof(parsedCookies.city) !='undefined'	? ""
// 				: parsedCookies.city.id,
// 		name:
// 			parsedCookies.city == null && typeof(parsedCookies.city) != 'undefined'
// 			 && typeof(parsedCookies.city) !='undefined'	? ""
// 				: parsedCookies.city.name,
// 	},
// 	images: [{ name: "" }],
// 	//3rd_stepper
// 	eventCategory: parsedCookies.eventCategory
// 	 && typeof(parsedCookies.eventCategory) !='undefined'	? parsedCookies.eventCategory
// 		: "free",
// 	restrictWallet: parsedCookies.restrictWallet
// 	 && typeof(parsedCookies.restrictWallet) !='undefined'	? parsedCookies.restrictWallet
// 		: false,
// 	ticketIndex: parsedCookies.ticketIndex && typeof(parsedCookies.ticketIndex) !='undefined' ? parsedCookies.ticketIndex : 0,
// 	ticketName: parsedCookies.ticketName && typeof(parsedCookies.ticketName) !='undefined' ? parsedCookies.ticketName : "",
// 	dollarPrice: parsedCookies.dollarPrice && typeof(parsedCookies.dollarPrice) !='undefined' ? parsedCookies.dollarPrice : "0",
// 	phnxPrice: parsedCookies.phnxPrice && typeof(parsedCookies.phnxPrice) !='undefined' ? parsedCookies.phnxPrice : "",
// 	ticketAvailability: parsedCookies.ticketAvailability
// 	 && typeof(parsedCookies.ticketAvailability) !='undefined'	? parsedCookies.ticketAvailability
// 		: "unlimited",
// 	noOfTickets: parsedCookies.noOfTickets && parsedCookies.noOfTickets !=undefined ? parsedCookies.noOfTickets : "",
// 	isCompleted: parsedCookies.isCompleted && parsedCookies.isCompleted !=undefined ? parsedCookies.isCompleted : false,
// 	ticketCategories: [
// 		{
// 			ticketName:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0	? parsedCookies.ticketCategories[0].ticketName
// 					: "",
// 			dollarPrice:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0	? parsedCookies.ticketCategories[0].dollarPrice
// 					: "0",
// 			phnxPrice:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0? parsedCookies.ticketCategories[0].phnxPrice
// 					: "",
// 			ticketAvailability:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0	? parsedCookies.ticketCategories[0].ticketAvailability
// 					: "unlimited",
// 			noOfTickets:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0	? parsedCookies.ticketCategories[0].noOfTickets
// 					: "",
// 			isShown:
// 				parsedCookies.ticketCategories != null &&
// 				parsedCookies.ticketCategories != undefined &&
// 				parsedCookies.ticketCategories.length > 0 ? parsedCookies.ticketCategories[0].isShown
// 					: false,
// 		},
// 	],
// 	token: parsedCookies.token && parsedCookies.token !=undefined ? parsedCookies.token : false, // false means free
// 	PhoenixDAO_market: parsedCookies.PhoenixDAO_market,
// 	//4th_stepper
// 	eventDescription: parsedCookies.eventDescription
// 	 && parsedCookies.eventDescription !=undefined	? parsedCookies.eventDescription
// 		: "",
// 	termsAndConditions: parsedCookies.termsAndConditions
// 	 && parsedCookies.termsAndConditions !=undefined	? parsedCookies.termsAndConditions
// 		: false,
// };
export const useFormControls = () => {
	const getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		// console.log("before being changed parts", parts);
		if (parts.length === 2) return parts.pop().split(";").shift();
	};
	
	const parsedCookies =
		getCookie("eventInfo") === undefined || null
			? {}
			: JSON.parse(getCookie("eventInfo"));
	
		
	const initialFormValues= {
		fullName: parsedCookies.fullName ? parsedCookies.fullName : "",
		email: parsedCookies.email ? parsedCookies.email : "",
		message: parsedCookies.message ? parsedCookies.message : "",
		formSubmitted: parsedCookies.formSubmitted
			? parsedCookies.formSubmitted
			: false,
		success: parsedCookies.success ? parsedCookies.success : false,
		//1st_stepper
		eventName: parsedCookies.eventName ? parsedCookies.eventName : "",
		eventOrganizer: parsedCookies.eventOrganizer
			? parsedCookies.eventOrganizer
			: "",
		eventTime: parsedCookies.eventTime
			? parsedCookies.eventTime
			: "onedayevent",
		eventDate: parsedCookies.eventDate ? parsedCookies.eventDate : null,
		eventStartTime: parsedCookies.eventStartTime
			? parsedCookies.eventStartTime
			: null,
		eventEndTime: parsedCookies.eventEndTime
			? parsedCookies.eventEndTime
			: null,
		eventStartDate: parsedCookies.eventStartDate
			? parsedCookies.eventStartDate
			: null,
		eventEndDate: parsedCookies.eventEndDate
			? parsedCookies.eventEndDate
			: null,
		//2nd_stepper
		eventType: parsedCookies.eventType ? parsedCookies.eventType : "physical",
		eventTopic: parsedCookies.eventTopic ? parsedCookies.eventTopic : "",
		eventLocation: parsedCookies.eventLocation
			? parsedCookies.eventLocation
			: "",
		eventLink: parsedCookies.eventLink ? parsedCookies.eventLink : "",
		country: {
			id:
				parsedCookies.country == null || parsedCookies.country == undefined
					? ""
					: parsedCookies.country.id,
			name:
				parsedCookies.country == null || parsedCookies.country == undefined
					? ""
					: parsedCookies.country.name,
		},
		state: {
			id:
				parsedCookies.state == null || parsedCookies.state == undefined
					? ""
					: parsedCookies.state.id,
			name:
				parsedCookies.state == null || parsedCookies.state == undefined
					? ""
					: parsedCookies.state.name,
		},
		city: {
			id:
				parsedCookies.city == null || parsedCookies.city === undefined
					? ""
					: parsedCookies.city.id,
			name:
				parsedCookies.city == null || parsedCookies.city == undefined
					? ""
					: parsedCookies.city.name,
		},
		images: [{ name: "" }],
		//3rd_stepper
		eventCategory: parsedCookies.eventCategory
			? parsedCookies.eventCategory
			: "free",
		restrictWallet: parsedCookies.restrictWallet
			? parsedCookies.restrictWallet
			: false,
		ticketIndex: parsedCookies.ticketIndex ? parsedCookies.ticketIndex : 0,
		ticketName: parsedCookies.ticketName ? parsedCookies.ticketName : "",
		dollarPrice: parsedCookies.dollarPrice ? parsedCookies.dollarPrice : "0",
		phnxPrice: parsedCookies.phnxPrice ? parsedCookies.phnxPrice : "",
		ticketAvailability: parsedCookies.ticketAvailability
			? parsedCookies.ticketAvailability
			: "unlimited",
		noOfTickets: parsedCookies.noOfTickets ? parsedCookies.noOfTickets : "",
		isCompleted: parsedCookies.isCompleted ? parsedCookies.isCompleted : false,
		ticketCategories:(parsedCookies.ticketCategories != null &&
		parsedCookies.ticketCategories != undefined &&
		parsedCookies.ticketCategories.length > 0)
			? parsedCookies.ticketCategories
			:  [
				{
					ticketName:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].ticketName
							: "",
					dollarPrice:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].dollarPrice
							: "0",
					phnxPrice:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].phnxPrice
							: "",
					ticketAvailability:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].ticketAvailability
							: "unlimited",
					noOfTickets:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].noOfTickets
							: "",
					isShown:
						parsedCookies.ticketCategories != null &&
						parsedCookies.ticketCategories != undefined &&
						parsedCookies.ticketCategories.length > 0
							? parsedCookies.ticketCategories[0].isShown
							: false,
				},
			],
		// ticketCategories: [
		// 	{
		// 		ticketName:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].ticketName
		// 				: "",
		// 		dollarPrice:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].dollarPrice
		// 				: "0",
		// 		phnxPrice:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].phnxPrice
		// 				: "",
		// 		ticketAvailability:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].ticketAvailability
		// 				: "unlimited",
		// 		noOfTickets:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].noOfTickets
		// 				: "",
		// 		isShown:
		// 			parsedCookies.ticketCategories != null &&
		// 			parsedCookies.ticketCategories != undefined &&
		// 			parsedCookies.ticketCategories.length > 0
		// 				? parsedCookies.ticketCategories[0].isShown
		// 				: false,
		// 	},
		// ],
		token: parsedCookies.token ? parsedCookies.token : false, // false means free
		PhoenixDAO_market: parsedCookies.PhoenixDAO_market,
		//4th_stepper
		eventDescription: parsedCookies.eventDescription
			? parsedCookies.eventDescription
			: "",
		termsAndConditions: parsedCookies.termsAndConditions
			? parsedCookies.termsAndConditions
			: false,
	};
	const [values, setValues] = useState(initialFormValues);
	const [errors, setErrors] = useState({});
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`
			);
			const data = await response.json();
			if (data)
				setValues({
					...values,
					PhoenixDAO_market: data.phoenixdao,
				});
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (values.ticketCategories.length == 1) {
			setValues({
				...values,
				ticketIndex: 0,
			});
		}
	}, [values.ticketCategories]);

	useEffect(() => {
		const img = values.images;
		// const tkt = values.ticketCategories;
		// tkt[0] = {
		// 	ticketName: "",
		// 	dollarPrice: "0",
		// 	phnxPrice: "",
		// 	ticketAvailability: "unlimited",
		// 	noOfTickets: "",
		// 	isShown: false,
		// };
		img[0] = { name: "" };
		setValues({
			...initialFormValues,
			images: img,
		});
	}, []);

	const clearState = () => {
		// setValues({
		// 	...initialFormValues,
		// });
	};

	const isValidDate = (d) => {
		return d instanceof Date && !isNaN(d);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };

		//1st stepper
		if ("eventName" in fieldValues)
			temp.eventName = fieldValues.eventName
				? ""
				: "This field is required.";

		if ("eventOrganizer" in fieldValues)
			temp.eventOrganizer = fieldValues.eventOrganizer
				? ""
				: "This field is required.";

		if ("eventTime" in fieldValues)
			temp.eventTime = fieldValues.eventTime
				? ""
				: "This field is required.";

		if ("eventDate" in fieldValues) {
			let eventStartTimeOneday = new Date(fieldValues.eventStartTime);
			var today = new Date();
						today.setHours(today.getHours() + 3);
			if (eventStartTimeOneday <= today) {
							temp.eventStartTime = "Event should be after 3 Hours.";
							// console.log("name ==> eventStartTime")
						}
						else{
							temp.eventStartTime = "";
						}
			temp.eventDate = fieldValues.eventDate
				? ""
				: "This field is required.";
			if (fieldValues.eventDate)
				temp.eventDate = isValidDate(fieldValues.eventDate)
					? ""
					: "Invalid Date Format";
		}

		if ("eventStartTime" in fieldValues) {
			temp.eventStartTime = fieldValues.eventStartTime
				? ""
				: "This field is required.";
			if (fieldValues.eventStartTime)
				temp.eventStartTime = isValidDate(fieldValues.eventStartTime)
					? ""
					: "Invalid Time Format";
		}

		if ("eventEndTime" in fieldValues)
			temp.eventEndTime = isValidDate(fieldValues.eventEndTime)
				? ""
				: "Invalid Time Format";

		if ("eventStartDate" in fieldValues) {
			let eventStartTimeOneday = new Date(fieldValues.eventStartTime);
			var today = new Date();
						today.setHours(today.getHours() + 3);
			if (eventStartTimeOneday <= today) {
							temp.eventStartTime = "Event should be after 3 Hours.";
							// console.log("name ==> eventStartTime")
						}
						else{
							temp.eventStartTime = "";
						}
			temp.eventStartDate = fieldValues.eventStartDate
				? ""
				: "This field is required.";
			if (fieldValues.eventStartDate)
				temp.eventStartDate = isValidDate(fieldValues.eventStartDate)
					? ""
					: "Invalid Date Format";
		}

		if ("eventEndDate" in fieldValues) {
			temp.eventEndDate = fieldValues.eventEndDate
				? ""
				: "This field is required.";
			if (fieldValues.eventEndDate)
				temp.eventEndDate = isValidDate(fieldValues.eventEndDate)
					? ""
					: "Invalid Date Format";
		}

		//2nd stepper
		if ("eventType" in fieldValues)
			temp.eventType = fieldValues.eventType
				? ""
				: "This field is required.";

		if ("eventTopic" in fieldValues)
			temp.eventTopic = fieldValues.eventTopic
				? ""
				: "This field is required.";

		if ("country" in fieldValues)
			temp.country = fieldValues.country ? "" : "This field is required.";

		if ("state" in fieldValues)
			temp.state = fieldValues.state ? "" : "This field is required.";

		if ("city" in fieldValues)
			temp.city = fieldValues.city ? "" : "This field is required.";

		if ("eventLocation" in fieldValues)
			temp.eventLocation = fieldValues.eventLocation
				? ""
				: "This field is required.";

		if ("eventLink" in fieldValues) {
			temp.eventLink = fieldValues.eventLink
				? ""
				: "This field is required.";
			if (fieldValues.eventLink)
				temp.eventLink =
					/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
						fieldValues.eventLink
					)
						? ""
						: "Is Not Valid URL.";
		}

		//3rd_stepper
		if ("ticketName" in fieldValues)
			temp.ticketName = fieldValues.ticketName
				? ""
				: "This field is required.";

		if ("dollarPrice" in fieldValues)
		{
			temp.dollarPrice = fieldValues.dollarPrice
				? ""
				: "This field is required.";
				if(temp.dollarPrice == ""){
					temp.phnxPrice = "";
				}
		}

		if ("phnxPrice" in fieldValues){
			temp.phnxPrice = fieldValues.phnxPrice
				? ""
				: "This field is required.";
			if(temp.phnxPrice == ""){
				temp.dollarPrice = "";
			}
		}

		if ("noOfTickets" in fieldValues)
			temp.noOfTickets = fieldValues.noOfTickets
				? ""
				: "This field is required.";

		//4th_stepper
		if ("eventDescription" in fieldValues) {
			let count = fieldValues.eventDescription
				.toString("html")
				.replace(/<[^>]*>/g, "").length;
			temp.eventDescription = count > 50 ? "" : `${count}/50`;
		}

		if ("termsAndConditions" in fieldValues)
			temp.termsAndConditions = fieldValues.termsAndConditions
				? ""
				: "*Please agree to all the terms and conditions before creating an event.";

		//tutotials
		if ("fullName" in fieldValues)
			temp.fullName = fieldValues.fullName
				? ""
				: "This field is required.";

		if ("email" in fieldValues) {
			temp.email = fieldValues.email ? "" : "This field is required.";
			if (fieldValues.email)
				temp.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(
					fieldValues.email
				)
					? ""
					: "Email is not valid.";
		}

		if ("message" in fieldValues)
			temp.message =
				fieldValues.message.length !== 0
					? ""
					: "This field is required.";

		setErrors({
			...temp,
		});
	};

	const formIsValid = (activeStep, fieldValues = values) => {
		const {
			eventName,
			eventOrganizer,
			eventTime,
			eventDate,
			eventStartTime,
			eventEndTime,
			eventStartDate,
			eventEndDate,
			//2nd_stepper
			eventType,
			eventTopic,
			eventLocation,
			eventLink,
			country,
			state,
			city,
			images,
			image0,
			//3rd_stepper
			eventCategory,
			ticketIndex,
			restrictWallet,
			ticketCategories,
			ticketAvailability,
			phnxPrice,
			dollarPrice,
			noOfTickets,
			isCompleted,
			eventDescription,
			termsAndConditions,
		} = fieldValues;

		if (activeStep === 0) {
			if (eventTime === "onedayevent") {
				const isValid =
					!errors["eventName"] &&
					eventName &&
					!errors["eventOrganizer"] &&
					eventOrganizer &&
					!errors["eventDate"] &&
					eventDate &&
					!errors["eventStartTime"] &&
					eventStartTime &&
					!errors["eventEndTime"];
				return isValid;
			} else {
				const isValid =
					!errors["eventName"] &&
					eventName &&
					!errors["eventOrganizer"] &&
					eventOrganizer &&
					!errors["eventStartDate"] &&
					eventStartDate &&
					!errors["eventEndDate"] &&
					eventEndDate &&
					!errors["eventStartTime"] &&
					eventStartTime;
				!errors["eventEndTime"];
				return isValid;
			}
		} else if (activeStep === 1) {
			if (eventType === "physical") {
				const isValid =
					country.name &&
					state.name &&
					city.name &&
					!errors["eventLocation"] &&
					eventLocation &&
					!errors["image0"] &&
					image0 &&
					eventTopic;
					let allImages = true;
					if(images.length>0){
						allImages = images.slice(0,3).map((image)=>{
							return image.name !="";
						})
					}
					return isValid && new Set(allImages).size ==1;
			} else {
				const isValid =
					!errors["eventLink"] &&
					eventLink &&
					!errors["image0"] &&
					image0 &&
					eventTopic;
					let allImages = true;
					if(images.length>0){
						allImages = images.slice(0,3).map((image)=>{
							return image.name !="";
						})
					}
				return isValid && new Set(allImages).size ==1;
				// return isValid;
			}
		} else if (activeStep === 2) {
			if (eventCategory === "free") {
				//free event
				if (ticketAvailability === "unlimited") {
					return true;
				} else {
					const isValid = !errors["noOfTickets"] && noOfTickets;
					return isValid;
				}
			} else if (eventCategory === "single") {
				//single paid event
				if (ticketAvailability === "unlimited") {
					const isValid =
						!errors["phnxPrice"] &&
						phnxPrice &&
						!errors["dollarPrice"] &&
						dollarPrice;
					return isValid;
				} else {
					const isValid =
						!errors["noOfTickets"] &&
						noOfTickets &&
						!errors["phnxPrice"] &&
						phnxPrice &&
						!errors["dollarPrice"] &&
						dollarPrice;
					return isValid;
				}
			} else {
				// multiple ticket type event
				if(ticketCategories.length == 1){
					const isValid = ticketCategories[0].isShown;
					return isValid;
				}
				else{
					const isValid = ticketCategories.map((ticketCategory)=>{
						return ticketCategory.isShown})
					return new Set(isValid).size ==1;
				}
			}
		} else if (activeStep === 3) {
			const isValid =
				!errors["eventDescription"] &&
				eventDescription &&
				!errors["termsAndConditions"] &&
				termsAndConditions;
			return isValid;
		}
	};

	const handleInputValue = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		validate({ [name]: value });
	};

	const handlePickerValue = (e) => {
		const { name, value } = e;
		setValues({
			...values,
			[name]: value,
		});
		// console.log("name ==> ", name)
		validate({ [name]: value });
	};

	const handleGeoValues = (e) => {
		const { name, value } = e;
		if (name === "country") {
			geonames.children({ geonameId: value.id }).then((res) => {
				if (res.totalResultsCount) {
					setValues({
						...values,
						[name]: value,
						state: { id: "", name: "" },
						city: { id: "", name: "" },
					});
				} else {
					setValues({
						...values,
						[name]: value,
						state: { id: "", name: " " },
						city: { id: "", name: " " },
					});
				}
			});
		} else if (name === "state") {
			geonames.children({ geonameId: value.id }).then((res) => {
				if (res.totalResultsCount) {
					setValues({
						...values,
						[name]: value,
						city: { id: "", name: "" },
					});
				} else {
					setValues({
						...values,
						[name]: value,
						city: { id: "", name: " " },
					});
				}
			});
		} else {
			setValues({
				...values,
				[name]: value,
			});
		}

		validate({ [name]: value });
	};

	const handleImageInput = (event, index, fieldValues = values) => {
		let temp = { ...errors };
		const file = event.target.files[0];
		let images = fieldValues.images;

		if (file) {
			if (file.size > 5000000) {
				images[index] = { name: "" };
				setValues({
					...values,
					images: [...images],
					[`image${index}`]: { name: "" },
				});
				temp[`image${index}`] =
					"Image size cannot exceed more than 5MB.";
			} else {
				images[index] = file;
				setValues({
					...values,
					images: [...images],
					[`image${index}`]: file,
				});
				temp[`image${index}`] = "";
			}
		}

		setErrors({
			...temp,
		});
	};

	const addAnotherImage = (fieldValues = values) => {
		let images = fieldValues.images;
		const len = images.length;
		const newImage = { name: "" };
		images.push(newImage);
		setValues({
			...values,
			images: [...images],
			[`image${len}`]: { name: "" },
		});
	};

	const handelRemoveImage = (index, fieldValues = values) => {
		let temp = { ...errors };

		let images = fieldValues.images;
		images.splice(index, 1);
		setValues({
			...values,
			images: [...images],
			[`image${index}`]: { name: "" },
		});
		temp[`image${index}`] = "";

		setErrors({
			...temp,
		});
	};

	//change btw free/single/multiple
	const handleEventCategory = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
			ticketIndex: 0,
			ticketName: "",
			dollarPrice: "0",
			phnxPrice: "",
			ticketAvailability: "unlimited",
			noOfTickets: "",
			ticketCategories: [
				{
					ticketName: "",
					dollarPrice: "0",
					phnxPrice: "",
					ticketAvailability: "unlimited",
					noOfTickets: "",
					isShown: false,
				},
			],
			token: value === "free" ? false : true,
		});
	};

	const isTicketCategoryValid = (fieldValues = values) => {
		const {
			ticketName,
			dollarPrice,
			phnxPrice,
			ticketAvailability,
			noOfTickets,
		} = fieldValues;

		if (ticketAvailability === "unlimited") {
			const isValid =
				!errors["ticketName"] &&
				ticketName &&
				!errors["dollarPrice"] &&
				dollarPrice &&
				!errors["phnxPrice"] &&
				phnxPrice;
			return isValid;
		} else {
			const isValid =
				!errors["ticketName"] &&
				ticketName &&
				!errors["dollarPrice"] &&
				dollarPrice &&
				!errors["phnxPrice"] &&
				phnxPrice &&
				!errors["noOfTickets"] &&
				noOfTickets;
			return isValid;
		}
	};

	const handleTicketCatogory = (event, index, fieldValues = values) => {
		const { name, value, min, max } = event.target;
		const { ticketCategories } = fieldValues;
		if (name === "dollarPrice") {
			if (value.length > 16) {
				return;
			}
			let USD = value;
			let PHNX = dollarToPhnx(value);
			ticketCategories[index]["dollarPrice"] = USD;
			ticketCategories[index]["phnxPrice"] = PHNX;
				validate({ ["phnxPrice"]: PHNX })
					validate({ ["dollarPrice"]: USD });
			setValues({
				...values,
				ticketCategories: [...ticketCategories],
				dollarPrice: USD,
				phnxPrice: PHNX,
				token: true,
			});
		} else if (name === "phnxPrice") {
			if (value.length > 16) {
				return;
			}
			let USD = phnxToDollar(value);
			let PHNX = value;
			ticketCategories[index]["dollarPrice"] = USD;
			ticketCategories[index]["phnxPrice"] = PHNX;
				// console.log("dollar price: ",USD)
				validate({ ["dollarPrice"]: USD })
					// console.log("phnx price: ",PHNX)
					validate({ ["phnxPrice"]: PHNX });
			setValues({
				...values,
				ticketCategories: [...ticketCategories],
				dollarPrice: USD,
				phnxPrice: PHNX,
				token: true,
			});
		} else {
			ticketCategories[index][name] = value;
			setValues({
				...values,
				ticketCategories: [...ticketCategories],
				[name]: value,
			});
			validate({ [name]: value });
		}
	};

	const handleSaveTicketCatogory = (ticketIndex, fieldValues = values) => {
		const { ticketCategories } = fieldValues;
		if (isTicketCategoryValid()) {
			ticketCategories[ticketIndex].isShown = true;
			let sortedCategories = ticketCategories.sort(
				(a, b) => parseFloat(a.dollarPrice) - parseFloat(b.dollarPrice)
			);
			setValues({
				...values,
				ticketName: "",
				dollarPrice: "0",
				phnxPrice: "",
				ticketAvailability: "unlimited",
				noOfTickets: "",
				isCompleted: true,
				ticketCategories: [...sortedCategories],
			});
		}
	};

	const handleAddAnotherCategory = (fieldValues = values) => {
		const { ticketCategories } = fieldValues;
		const newCat = {
			ticketName: "",
			dollarPrice: "0",
			phnxPrice: "",
			ticketAvailability: "unlimited",
			noOfTickets: "",
			isShown: false,
		};
		let index = ticketCategories.length == 0 ? 0 : ticketCategories.length;
		ticketCategories.push(newCat);
		setValues({
			...values,
			ticketIndex: index,
			ticketCategories: [...ticketCategories],
			isCompleted: false,
		});
	};

	const handleDeleteTicketCategory = (index, fieldValues = values) => {
		let ticketCategories = fieldValues.ticketCategories;
		ticketCategories.splice(index, 1);

		if (ticketCategories === undefined || ticketCategories.length == 0) {
			handleAddAnotherCategory();
		} else {
			setValues({
				...values,
				ticketCategories: [...ticketCategories],
			});
		}
	};

	const handleEditTicketCategory = (index, fieldValues = values) => {
		const { ticketCategories } = fieldValues;
		setValues({
			...values,
			ticketIndex: index,
			ticketName: ticketCategories[index].ticketName,
			dollarPrice: ticketCategories[index].dollarPrice,
			phnxPrice: ticketCategories[index].phnxPrice,
			ticketAvailability: ticketCategories[index].ticketAvailability,
			noOfTickets: ticketCategories[index].noOfTickets,
			isCompleted: false,
		});
	};

	const dollarToPhnx = (d, fieldValues = values) => {
		let value = d; //parseFloat(d);
		value = value > 0 ? value : "";
		let usd = fieldValues.PhoenixDAO_market.usd;
		let phoenixValue = value / usd;
		phoenixValue = phoenixValue.toFixed(5);
		return phoenixValue;
	};

	const phnxToDollar = (d, fieldValues = values) => {
		let value = d; //parseFloat(d);
		value = value > 0 ? value : "";
		let usd = fieldValues.PhoenixDAO_market.usd;
		let dollarValue = value * usd;
		dollarValue = dollarValue.toFixed(5);
		return dollarValue;
	};

	const handleRickTextValue = (value) => {
		setValues({
			...values,
			eventDescription: value,
		});
		validate({ eventDescription: value });
	};

	const stepperIsValid = (activeStep, callback, createEventCb) => {
		if (activeStep === 0) {
			stepperOneIsValid(activeStep, callback);
		} else if (activeStep === 1) {
			callback();
		} else if (activeStep === 2) {
			callback();
		} else if (activeStep === 3) {
			callback();
			createEventCb();
		}
	};

	const stepperOneIsValid = (activeStep, callback, fieldValues = values) => {
		let temp = { ...errors };

		const {
			eventName,
			eventOrganizer,
			eventTime,
			eventDate,
			eventStartTime,
			eventEndTime,
			eventStartDate,
			eventEndDate,
		} = fieldValues;

		if (eventTime === "onedayevent") {
			let eventDateOneDay = new Date(eventDate);
			let eventStartTimeOneday = new Date(eventStartTime);
			let eventEndTimeOneday = eventEndTime==null?eventEndTime:new Date(eventEndTime);

			// console.log("eventDateOneDay", eventDateOneDay);
			// console.log("eventStartTimeOneday", eventStartTimeOneday);
			// console.log("eventEndTimeOneday", eventEndTimeOneday);

			eventDateOneDay.setHours(
				eventStartTimeOneday.getHours(),
				eventStartTimeOneday.getMinutes(),
				eventStartTimeOneday.getSeconds(),
				0
			);
			eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
			eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
			eventStartTimeOneday.setDate(eventDateOneDay.getDate());

			var today = new Date();
			today.setHours(today.getHours() + 3);
			if (eventStartTimeOneday <= today) {
				temp.eventStartTime = "Event should be after 3 Hours.";
			} else {
				if (eventEndTimeOneday) {
					eventEndTimeOneday.setFullYear(
						eventDateOneDay.getFullYear()
					);
					eventEndTimeOneday.setMonth(eventDateOneDay.getMonth());
					eventEndTimeOneday.setDate(eventDateOneDay.getDate());
					if (eventStartTimeOneday < eventEndTimeOneday) {
						setValues({
							...values,
							eventDate: eventDateOneDay,
							eventStartTime: eventStartTimeOneday,
							eventEndTime: eventEndTimeOneday,
						});
						callback();
					} else {
						temp.eventEndTime =
							"End Time should greater than Start Time.";
					}
				} else {
					setValues({
						...values,
						eventDate: eventDateOneDay,
						eventStartTime: eventStartTimeOneday,
					});
					callback();
				}
			}
		} else {
			let eventDateOneDay = new Date(eventStartDate);
			let eventEndDateOneDay = new Date(eventEndDate);
			let eventStartTimeOneday = new Date(eventStartTime);
			let eventEndTimeOneday = eventEndTime==null?eventEndTime:new Date(eventEndTime);;
			//change date timing
			eventDateOneDay.setHours(
				eventStartTimeOneday.getHours(),
				eventStartTimeOneday.getMinutes(),
				eventStartTimeOneday.getSeconds(),
				0
			);
			eventEndDateOneDay.setHours(
				eventStartTimeOneday.getHours(),
				eventStartTimeOneday.getMinutes(),
				eventStartTimeOneday.getSeconds(),
				0
			);
			//change timing unix date
			eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
			eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
			eventStartTimeOneday.setDate(eventDateOneDay.getDate());
			var today = new Date();
			today.setHours(today.getHours() + 3);
			if (eventStartTimeOneday <= today) {
				temp.eventStartTime =
					"Event should be after three hours from current time.";
			} else {
				const diffTime = eventEndDateOneDay - eventDateOneDay;
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				if (diffDays > 0) {
					if (eventEndTimeOneday) {
						eventEndTimeOneday.setFullYear(
							eventDateOneDay.getFullYear()
						);
						eventEndTimeOneday.setMonth(eventDateOneDay.getMonth());
						eventEndTimeOneday.setDate(eventDateOneDay.getDate());
						//eventStartTimeOneday < eventEndTimeOneday
						if (true) {
							setValues({
								...values,
								eventStartDate: eventDateOneDay,
								eventEndDateOneDay: eventEndDateOneDay,
								eventStartTime: eventStartTimeOneday,
								eventEndTime: eventEndTimeOneday,
							});
							callback();
						} else {
							temp.eventEndTime =
								"End Time should greater than Start Time.";
						}
					} else {
						setValues({
							...values,
							eventStartDate: eventDateOneDay,
							eventStartTime: eventStartTimeOneday,
							eventEndDateOneDay: eventEndDateOneDay,
						});
						callback();
					}
				} else {
					temp.eventEndDate =
						"End date should be greater than start date";
				}
			}
		}

		setErrors({
			...temp,
		});
	};

	const stepperTwoIsValid = () => {
		//
	};

	const stepperThreeIsValid = () => {
		//
	};

	const stepperFourIsValid = () => {
		//
	};

	const handleSuccess = () => {
		setValues({
			...initialFormValues,
			formSubmitted: true,
			success: true,
		});
	};

	const handleError = () => {
		setValues({
			...initialFormValues,
			formSubmitted: true,
			success: false,
		});
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const isValid =
			Object.values(errors).every((x) => x === "") && formIsValid();
		if (isValid) {
			await PostContactForm(values, handleSuccess, handleError);
		}
	};

	return {
		values,
		errors,
		handleInputValue,
		handlePickerValue,
		handleGeoValues,
		handleImageInput,
		handleFormSubmit,
		formIsValid,
		stepperIsValid,
		addAnotherImage,
		handelRemoveImage,
		handleTicketCatogory,
		handleSaveTicketCatogory,
		handleRickTextValue,
		handleEventCategory,
		handleAddAnotherCategory,
		handleDeleteTicketCategory,
		handleEditTicketCategory,
		clearState,
	};
};
