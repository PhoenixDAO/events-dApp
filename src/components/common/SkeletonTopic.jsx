import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Button,
	Divider,
	Grid,
	Typography,
	Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	row1: {
		paddingBottom: "20px",
	},
}));

const SkeletonLayout = (props) => {
	const classes = useStyles();

	return (
		<div>
			<Card className={classes.root}>
				<CardActionArea>
					<div>
						<Skeleton
							variant="rect"
							component="img"
							height={200}
							width="100%"
							src={"/images/skeleton.svg"}
							style={{ backgroundColor: "#F7F7F7" }}
						/>
					</div>
					<CardContent>
						<div className={classes.row1}>
							<Skeleton width="60%" />
						</div>
						<div>
							<Skeleton width="30%" />
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
		</div>
	);
};

export default SkeletonLayout;
