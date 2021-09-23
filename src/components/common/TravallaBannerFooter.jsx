import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	imageBanner: {
		display: "none",
		"@media (min-width:550px)":{
			display:"block",
		},
		position: "absolute",
		marginLeft: "-45px",
		marginRight: "0%",
		marginTop: "8%",
		bottom: 0,
		"@media (min-width: 550px)": {
			marginLeft: "-90px",
		},
		"@media (min-width: 1540px)": {
			marginLeft: "-150px",
			width: "100%",
		},
		"@media (min-width: 1590px)": {
			marginLeft: "-100px",
		},},
		imageMobileBanner:{
		display: "block",
		"@media (min-width:550px)":{
			display:"none",
		},
		position: "absolute",
		marginLeft: "-45px",
		marginRight: "0%",
		marginTop: "8%",
		bottom: 0,
		"@media (min-width: 550px)": {
			marginLeft: "-90px",
		},
		"@media (min-width: 1540px)": {
			marginLeft: "-150px",
			width: "100%",
		},
		"@media (min-width: 1590px)": {
			marginLeft: "-100px",
		},
		}
}));
function TravallaBannerFooter() {
    const classes = useStyles();
	return (
		<a href="https://www.travala.com/?ref=phoenixdao" target="_blank">
			<div className={classes.imageBanner}>
				<img
					style={{
						width: "100%",
						height: "auto",
						float: "left",
					}}
					src={"/images/footer.jpg"}
					className="img-fluid w-100"
				/>
			</div>
			<div className={classes.imageMobileBanner}>
				<img
					style={{
						width: "100%",
						height: "auto",
						float: "left",
					}}
					src={"/images/footerMobile.jpg"}
					className="img-fluid w-100"
				/>
			</div>
		</a>
	);
}

export default TravallaBannerFooter;
