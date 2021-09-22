import React from "react";
import { drizzleConnect } from "drizzle-react";
import { withStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	imageBanner: {
		position: "absolute",
		marginLeft: "-100px",
		marginRight: "0%",
		marginTop: "8%",
		"@media (max-width: 800px)": {
			marginLeft: "-90px",
			"& img": {
				// transform:"scale(1.4)"
			},
		},
		"@media (min-width: 1540px)": {
			marginLeft: "-150px",
			width: "100%",
		},
		"@media (min-width: 1590px)": {
			marginLeft: "-330px",
		},
	},
}));
function TravallaBannerFooter() {
    const classes = useStyles();
	return (
		<a href="https://www.travala.com/?ref=phoenixdao" target="_blank">
			<div style={{		position: "absolute",
		marginLeft: "-90px",
		marginRight: "0%",
		marginTop: "8%",
		bottom: 0,
		"@media (max-width: 800px)": {
			marginLeft: "-90px",
			"& img": {
				// transform:"scale(1.4)"
			},
		},
		"@media (min-width: 1540px)": {
			marginLeft: "-150px",
			width: "100%",
		},
		"@media (min-width: 1590px)": {
			marginLeft: "-330px",
		},}}>
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
		</a>
	);
}

export default TravallaBannerFooter;
