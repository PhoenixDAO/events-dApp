import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		paddingTop: theme.spacing(5),
		backgroundColor: "white",
		borderRadius: "12px",
		paddingLeft: "10px",
		paddingRight: "10px",
		paddingBottom: "50px",
		"@media (min-width:400px)": {
			paddingLeft: 25,
			paddingRight: 25,
		},
		"&. MuiFormHelperText-contained": {
			marginLeft: "0px !important",
		},
	},
	publishedRoot: {
		width: "100%",
		paddingTop: theme.spacing(5),
		backgroundColor: "white",
		borderRadius: "12px",
		paddingLeft: "10px",
		paddingRight: "10px",
		"@media (min-width:400px)": {
			paddingLeft: 25,
			paddingRight: 25,
		},
		"&. MuiFormHelperText-contained": {
			marginLeft: "0px !important",
		},
	},
	selectBoxMaxWidth: {
		"& .MuiOutlinedInput-root .MuiSelect-outlined": {
			paddingLeft: "0px !important",
			paddingRight: "0px !important",
		},
	},
	deleteImageButton:{
		position: 'absolute',
		/* float:'left', */
		background: '#eb5151',
		color: 'white',
		top: '-10px',
		left: '-10px',
		border: '0px',
		borderRadius: '100%',
		width: '28px',
		// height: '20px',
		/* padding: 0px; */
		paddingBottom: '4px',
		'&:hover': {
			background: '#d33939',
		}
	},
	backButton: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
		color: "#413AE2",
		fontSize: 18,
	},
	publishIcon:{
		"@media (max-width: 530px)": {
			height: "15px",
		},
	},
	nextButton: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
		background: "#413AE2",
		color: "white",
		height: "45px",
		// width: "40%",
		width:"175px",
		fontSize: 16,
		// maxWidth: "175px",
		fontWeight: 700,
		"@media (max-width: 530px)": {
			// width: "57%",
			width:"150px",
			fontSize: 12,
		},
		"@media (max-width: 320px)": {
			// width: "57%",
			width:"100px",
			fontSize: 12,
		},
		"& .MuiButton-endIcon": {
			position: "absolute",
			right: 20,
			"@media (max-width: 530px)": {
				right: 15,
			},
		},
	},
	title: {
		color: "#413AE2",
		marginBottom: theme.spacing(1),
		fontSize: 32,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "space-between",
	},
	mainStepperContainerForPublishPage: {
		"@media (min-width:768px)": {
			marginLeft: theme.spacing(4),
			marginRight: theme.spacing(4),
		},

		"& .MuiButton-label": {
			fontFamily: "'Aeonik', sans-serif",
			fontWeight: "500",
		},
		"& .MuiFormControl-root .MuiMenuItem-root": {
			fontFamily: "'Aeonik', sans-serif",
		},
	},
	mainStepperContainer: {
		"@media (min-width:768px)": {
			marginLeft: theme.spacing(8),
			marginRight: theme.spacing(8),
		},

		"& .MuiButton-label": {
			fontFamily: "'Aeonik', sans-serif",
			fontWeight: "500",
		},
		"& .MuiFormControl-root .MuiMenuItem-root": {
			fontFamily: "'Aeonik', sans-serif",
		},
	},
	addAnotherImageBtn: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
		height: "54px",
		fontweight: "400px",
		fontSize: "20px",
		fontFamily: "'Aeonik', sans-serif",
		"@media (max-width:450px)": {
			fontSize: "90%",
		},
	},
	menuPaper: {
		position: "absolute !important",
		left: "50% !important",
		webkitTransform: "translateX(-50%) !important",
		transform: "translateX(-50%) !important",
	},
	editor: {
		height: 430,
		overflow: "auto",
		zIndex: 2,
	},
	label: {
		color: "#73727D",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		// marginBottom: "-10",
	},
	eventUrl: {
		textAlign: "center",
		fontSize: "14px",
		color: "#4E4E55",
	},
	UrlField: {
		"@media (min-width:800px)": {
			minWidth: "360px",
			maxWidth: "410px",
			width: "81%",
		},
		width: "80%",
		margin: "0px auto",
	},
	copyButton: {
		"&:focus": {
			outline: "none",
		},
	},
	SocialMediaDiv: {
		margin: "30px 0px 20px 6px",
		"@media (min-width: 425px)": {
			margin: "30px 0px 20px -11px",
		},
	},
	step: {
		justifyContent: "center",
		"& .MuiStepIcon-root text": {
			fontFamily: "'Aeonik', sans-serif",
			// fontSize: "24px",
		},
		"& .MuiStepIcon-root.MuiStepIcon-active": {
			color: "#fff",
			borderRadius: "100%",
			border: "1px solid #CECED2",
		},
		"& .MuiStepIcon-root.MuiStepIcon-active text": {
			fill: "#413AE2",
			fontWeight: "900",
			fontFamily: "'Aeonik', sans-serif",
		},
		// "& .MuiStepIcon-root": {
		// 	height: "48px",
		// 	width: "48px",
		// },
	},
	alternativeLabel: {
		"font-size": "11px",
	},
	alternativeLabelActive: {
		"font-weight": "bold !important",
	},
	stepIcon: {
		transform: "scale(0.5)",
		"font-size": "50px",
		// height: "48px",
		// width: "48px",
	},
	radioGroup: {
		"& .MuiFormControlLabel-label.MuiTypography-body1": {
			fontFamily: "'Aeonik', sans-serif",
		},
	},
	formControlDesc: {
		maxWidth: "100%",
		width: "100%",
	},
	dropdownMenu: {
		fontFamily: "'Aeonik', sans-serif",
	},
	timeContainer: {
		display: "flex",
		justifyContent: "space-between",
		[theme.breakpoints.between("xs", "sm")]: {
			flexDirection: "column",
		},
	},
	timeAndDate: {
		width: "100%",
		// [theme.breakpoints.between("xs", "sm")]: {
		// 	width: "100%",
		// },
	},
	ticketPriceContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		[theme.breakpoints.down("md")]: {
			flexDirection: "column",
		},
	},
	altImage: {
		[theme.breakpoints.between("xs", "sm", "md", "lg")]: {
			transform: `rotate(90deg)`,
		},
	},
	menuPaper: {
		maxHeight: "200px",
	},
	ticketNameCat: {
		overflow: "hidden",
		wordBreak: "break-word",
		fontSize: 20,
		fontWeight: 400,
		color: "#1E1E22",
		fontFamily: "'Aeonik', sans-serif",
	},
	ticketAvailabilityCat: {
		fontSize: 14,
		fontWeight: 400,
		color: "#73727D",
		fontFamily: "'Aeonik', sans-serif",
	},
	dollarPriceCat: {
		fontSize: 20,
		fontWeight: 700,
		color: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	phnxPriceCat: {
		fontSize: 16,
		fontWeight: 500,
		color: "#4E4E55",
		fontFamily: "'Aeonik', sans-serif",
	},
	formLocation: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	timeHelperText: {
		fontSize: 14,
		fontWeight: 400,
		color: "#73727D",
		fontFamily: "'Aeonik', sans-serif",
	},
	adornedStart: {
		backgroundColor: "#000",
	},
	stepperCircle: {
		"& .MuiSvgIcon-root": {
			width: 40,
			height: 40,
			marginTop: -8,
		},
		"& .MuiStepIcon-root.MuiStepIcon-completed": {
			color: "#413AE2",
		},
	},
	secondField: {
		[theme.breakpoints.down("md")]: {
			paddingTop: "0px !important",
		},
	},
	ticketCard: {
		padding: "18px 20px !important",
		borderRadius: "5px",
		border: "1px solid #E4E4E7",
		background: `linear-gradient(270deg, rgba(94, 91, 255, 0.12) 0%, rgba(124, 118, 255, 0) 131.25%)`,
	},
	progressStep: {
		"& $completed": {
			color: "#234d3d",
		},
		"& $active": {
			color: "#000",
		},
		"& $disabled": {
			color: "#dff",
		},
	},
	progressActive: {
		color: "rgba(94, 91, 255, 0.12)",
	},
	progressCompleted: {
		color: "rgba(94, 91, 255, 1)",
	},
	progressDisabled: {},
	travelImage: {
		marginLeft: "-10px",
		marginRight: "-10px",
		// width: "100%",
		marginTop: "60px",
		"@media (min-width:400px)": {
			marginLeft: "-25px",
			marginRight: "-25px",
		},
		"& img": {
			maxWidth: "100%",
			borderRadius: "0 0 10px 10px",
		},
	},
	viewButton: {
		backgroundColor: "#413AE2",
		textTransform: "Capitalize",
	},
	publishedEventContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyItems: "center",
	},
	progressTextStyle: {
		fontSize: 24,
		fontWeight: 700,
		color: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	flamingStepContent: {
		fontSize: 20,
		fontWeight: 500,
		color: "#4E4E55",
		fontFamily: "'Aeonik', sans-serif",
	},
	activeFlamingStepStyle: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
	},
	menuItemStyle: {
		fontFamily: "'Aeonik', sans-serif",
	},
	imageMaxStyle: {
		color: "#73727D",
		fontSize: 14,
		fontWeight: 400,
		paddingTop: "10px",
		marginBottom: 0,
	},
	imageSelectBtnStyle: {
		padding: "15px 25px",
		background: "#FFF9E5",
		left: "13px",
		textTransform: "capitalize",
	},
	restrictWalletLabel: {
		// fontSize: 20,
		fontWeight: 400,
		color: "#1E1E22",
		fontFamily: "'Aeonik', sans-serif",
	},
	termsLabel: {
		// fontSize: 20,
		fontWeight: 400,
		color: "#1E1E22",
		fontFamily: "'Aeonik', sans-serif",
	},
	dollarIconBtnStyle: {
		padding: "15px 15px",
		background: "#F2F2FD",
		left: "-13px",
	},
	phnxLogoBtnStyle: {
		padding: "15px 15px",
		background: "#F2F2FD",
		left: "-13px",
	},
	altIconStyle: {
		paddingTop:"25px",
		paddingInline:"10px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default useStyles;
