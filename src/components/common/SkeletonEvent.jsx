import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
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
	skeletonRoot: {
		marginTop: "70px",
	},
	row1: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

const SkeletonEvent = (props) => {
	const classes = useStyles();

	return (
		<div classNAme={classes.root}>
			<Box>
				<Box width="100%" style={{ height: "170px" }}>
					<div
						style={{
							paddingTop: "65px",
							borderBottom: "1px solid #e4e4e7",
						}}
					>
						<div className={classes.row1}>
							<Skeleton width="30%" height={50}>
								<Typography>.</Typography>
							</Skeleton>
							<Skeleton width="20%" height={50}>
								<Typography>.</Typography>
							</Skeleton>
						</div>
					</div>
				</Box>
				<Skeleton variant="rect" width="100%">
					<div style={{ paddingTop: "33%" }} />
				</Skeleton>
				<Box style={{ paddingTop: "20px" }}>
					<div className={classes.row1}>
						<Skeleton width="40%" />
						<Skeleton width="20%" />
					</div>
					<div className={classes.row1}>
						<Skeleton width="40%" />
						<Skeleton width="20%" />
					</div>
					<div
						style={{
							float: "right",
							clear: "both",
							width: "20%",
						}}
					>
						<Skeleton />
					</div>
					<div
						style={{
							float: "right",
							clear: "both",
							width: "20%",
						}}
					>
						<Skeleton />
					</div>
					<div style={{ clear: "both" }}>
						<Skeleton width="50%" />
					</div>
					<div>
						<Skeleton width="50%" />
					</div>
					<div>
						<Skeleton width="60%" />
					</div>
				</Box>
			</Box>
			{/* <Card>
				<CardActionArea className={classes.skeletonRoot}>
					<div>
						<Skeleton
							variant="rect"
							component="img"
							height={500}
							width="100%"
							src={"/images/skeleton.svg"}
							style={{ backgroundColor: "#F7F7F7" }}
						/>
					</div>
					<CardContent>
						<div className={classes.row1}>
							<Skeleton width="40%" />
							<Skeleton width="10%" />
						</div>
						<div
							style={{
								float: "right",
								clear: "both",
								width: "20%",
							}}
						>
							<Skeleton />
						</div>
						<div
							style={{
								float: "right",
								clear: "both",
								width: "10%",
							}}
						>
							<Skeleton />
						</div>
						<div style={{ clear: "both" }}>
							<Skeleton width="50%" />
						</div>
						<div>
							<Skeleton width="50%" />
						</div>
						<div>
							<Skeleton width="60%" />
						</div>
					</CardContent>
				</CardActionArea>
			</Card> */}
		</div>
	);
};

export default SkeletonEvent;
