import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
	content: {
		backgroundColor: "white",
		margin: "40px 0px",
		padding: "50px",
		borderRadius: "8px",
		paddingBottom: "80px",
		[theme.breakpoints.down("xs")]: {
			padding: "10px",
		},
	},
	menuPaper: {
		maxHeight: "200px",
		right: "10% !important",
	},
	formControls: {
		"@media (max-width: 600px)": {
			width: "120px",
		},
		"@media (min-width: 1024px)": {
			flex: "0 0 20% !important",
			marginLeft: "5%",
		},
		justifyContent: "space-around",
		// alignItems: "center",
		// minWidth: 120,
		"& .MuiInputBase-formControl": {
			"@media (max-width: 575px)": {
				marginLeft: "50px",
				maxWidth: "100%",
			},
		},
		"& .MuiSelect-root.MuiSelect-select": {
			fontWeight: 700,
			padding: "10px",
			paddingRight: "20px",
			background: "#fff",
		},
		"& option": {
			padding: "10px",
		},
	},
	select: {
		width: "170px",
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
			paddingRight: "25px !important",
			"@media (max-width: 600px)": {
				width: "120px",
			},
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
		},
	},
	row: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		marginBottom: "25px",
		"@media (max-width: 970px)": {
			display: "grid",
		},
	},
	emptyContent: {
		// padding: "0 !important",
	},
	EmptyRow: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		marginBottom: "25px",
		[theme.breakpoints.down("xs")]: {
			display: "grid",
		},
		"& > div": {
			flex: "0 0 100%",
		},
	},
	heading: {
		display: "flex",
		alignItems: "center",
		color: "#413AE2",
		fontSize: "28px",
		fontWeight: "600",
		alignItems: "center",
	},
	graphFontSize: {
		fontSize:()=>{
			return 16;
		},
		"@media (max-width: 600px)": {
			fontSize: () => {
				return 10;
			},
		},
	},
	box: {
		border: "1px solid #E4E4E7",
		borderRadius: "8px",
		padding: "30px 20px",
		"@media (max-width:450px)": {
			padding: "30px 5px",
		},
		backgroundColor: "white",
		textAlign: "inherit",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "40px",
		width: "100%",
	},
	heading2: {
		fontSize: "20px",
		fontWeight: "700",
	},
	row2: {
		display: "flex",
		justifyContent: "space-between",
		padding: "10px",
		"& span": {
			color: "#73727D",
			fontSize: "18px",
			marginBottom: "15px",
		},
	},
	city: {
		fontSize: "18px",
		fontWeight: "600",
		letterSpacing: "0.5px",
		wordBreak: "break-word",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: "2",
		overflow: "hidden",
		display: "flex",
		alignItems: "baseline",
		[theme.breakpoints.down("xs")]: {
			fontSize: "16px",
		},
	},
	ticketSold: {
		color: "#4E4E55",
		paddingRight: "10px",
		fontSize: "18px",
		[theme.breakpoints.down("xs")]: {
			fontSize: "16px",
		},
	},
	row3: {
		display: "flex",
		justifyContent: "space-between",
		padding: "15px 0px",
		borderBottom: "1px solid #E4E4E7",
		margin: "0px 10px",
		"&:last-child": {
			borderBottom: "none",
		},
	},
	chartDiv: {
		// background: `url('/images/graph.svg') no-repeat center 87px`,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			marginTop: "35px",
			// background: `url('/images/graph.svg') no-repeat center`,
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: "35px",
			// background: `url('/images/graph.svg') no-repeat center`,
			backgroundSize: "300px 100px",
		},
	},
	highlighter: {
		width: "10px",
		height: "10px",
		display: "flex",
		borderRadius: "50%",
		marginRight: "12px",
	},
	Top5Events: {
		marginTop: "60px",
		width: "100%",
	},
	header: {
		color: "#73727D",
		fontSize: "18px",
		marginBottom: "15px",
	},
	image: {
		position: "absolute",
		paddingTop: "25px",
		width: "14%",
		zIndex: 0,
		[theme.breakpoints.down("xl")]: {
			width: "7%",
		},
		[theme.breakpoints.down("lg")]: {
			width: "14%",
		},
		[theme.breakpoints.down("md")]: {
			width: "14%",
		},
		[theme.breakpoints.down("sm")]: {
			width: "30%",
		},
		[theme.breakpoints.down("xs")]: {
			width: "20%",
			paddingTop: "13px",
		},
	},
	noTicket: {
		fontSize: "18px",
		fontWeight: "600",
		letterSpacing: "0.5px",
		padding: "10px",
	},
	button: {
		"@media screen and (max-width: 1200px) and (min-width: 900px)": {
			width: "30%",
			height: "45px",
		},
		margin: theme.spacing(1),
		fontFamily: "'Aeonik', sans-serif",
		background: "#413AE2",
		color: "white",
		textTransform: "Capitalize",
		// maxHeight: 54,
		// maxWidth: 230,
		"&:focus": {
			outline: "none",
		},
	},
	sortBy: {
		position: "absolute",
		left: "-50px",
		color: "#73727D",
		fontSize: "18px",
		"@media (max-width: 575px)": {
			left: "0",
		},
	},
	selectWidth: {
		width: "170px",
	},
}));
