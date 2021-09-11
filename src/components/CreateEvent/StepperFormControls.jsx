import { useState } from "react";

const PostContactForm = async (values, successCallback, errorCallback) => {
	// do stuff
	// if successful
	if (true) successCallback();
	else errorCallback();
};

const initialFormValues = {
	fullName: "",
	email: "",
	message: "",
	formSubmitted: false,
	success: false,
	//1st_stepper
	eventName: "",
	eventOrganizer: "",
	eventTime: "onedayevent",
	eventDate: null,
	eventStartTime: null,
	eventEndTime: null,
	eventStartDate: null,
	eventEndDate: null,
	//2nd_stepper
	eventType: "physical",
	eventTopic: "",
	eventLocation: "",
	eventLink: "",
	country: { id: "", name: "" },
	state: { id: "", name: "" },
	city: { id: "", name: "" },
	images: [{ name: "" }],
};

export const useFormControls = () => {
	const [values, setValues] = useState(initialFormValues);
	const [errors, setErrors] = useState({});

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
			temp.eventDate = fieldValues.eventDate
				? ""
				: "This field is required.";
			if (fieldValues.eventDate)
				temp.eventDate = isValidDate(fieldValues.eventDate)
					? ""
					: "Invalid Date Format";
		}

		if ("eventStartTime" in fieldValues)
			temp.eventStartTime = fieldValues.eventStartTime
				? ""
				: "This field is required.";

		if ("eventEndTime" in fieldValues)
			temp.eventEndTime = fieldValues.eventEndTime
				? ""
				: "This field is required.";

		if ("eventStartDate" in fieldValues) {
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
		validate({ [name]: value });
	};

	const handleGeoValues = (e) => {
		const { name, value } = e;
		if (name === "country") {
			setValues({
				...values,
				[name]: value,
				state: { id: "", name: "" },
				city: { id: "", name: "" },
			});
		} else if (name === "state") {
			setValues({
				...values,
				[name]: value,
				city: { id: "", name: "" },
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
		const file = event.target.files[0];
		console.log("file", file, "index", index);
		let images = fieldValues.images;
		images[index] = file;
		setValues({
			...values,
			images: [...images],
		});
		// if (file.size > 1024)
		//   onFileSelectError({ error: "File size cannot exceed more than 1MB" });
		// else onFileSelectSuccess(file);
	};

	const addAnotherImage = (fieldValues = values) => {
		console.log("fieldValues", fieldValues);
		let images = fieldValues.images;
		console.log("images", images);
		const newImage = { name: "" };
		images.push(newImage);
		setValues({
			...values,
			images: [...images],
		});
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

	// const formIsValid = (fieldValues = values) => {
	// 	const isValid =
	// 		fieldValues.fullName &&
	// 		fieldValues.email &&
	// 		fieldValues.message &&
	// 		Object.values(errors).every((x) => x === "");
	// 	return isValid;
	// };

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
		} = fieldValues;
		if (eventTime === "onedayevent") {
			const isValid =
				eventName &&
				eventOrganizer &&
				eventDate &&
				eventStartTime &&
				Object.values(errors).every((x) => x === "");
			return isValid;
		} else {
			const isValid =
				eventName &&
				eventOrganizer &&
				eventStartDate &&
				eventEndDate &&
				eventStartTime &&
				Object.values(errors).every((x) => x === "");
			return isValid;
		}
	};

	const stepperIsValid = (activeStep, callback) => {
		if (activeStep === 0) {
			stepperOneIsValid(callback);
		} else if (activeStep === 1) {
			//
		} else {
			//
		}
	};

	const stepperOneIsValid = (callback, fieldValues = values) => {
		let temp = { ...errors };

		const {
			eventTime,
			eventDate,
			eventStartTime,
			eventEndTime,
			eventStartDate,
			eventEndDate,
		} = fieldValues;

		if (eventTime === "onedayevent") {
			console.log("onedayevent");
			let eventDateOneDay = eventDate;
			let eventStartTimeOneday = eventStartTime;
			let eventEndTimeOneday = eventEndTime;

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
			console.log("morethanaday");
			let eventDateOneDay = eventStartDate;
			let eventEndDateOneDay = eventEndDate;
			let eventStartTimeOneday = eventStartTime;
			let eventEndTimeOneday = eventEndTime;
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
				console.log(diffDays + " days");
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
	};
};
