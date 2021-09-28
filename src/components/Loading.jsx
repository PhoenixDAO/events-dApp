import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme) => ({
	skeletonRoot: {
		marginTop: "70px",
	},
	row1: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

function Loading() {
	const classes = useStyles();
	return (
		// <div className="text-center"><span role="img" aria-label="dino">🦖</span> We are loading data...</div>
		<div style={{width:"100%"}}>
				<Skeleton width="90%" />
				<Skeleton width="90%" />
				<Skeleton width="90%" />
				<Skeleton width="90%" />
				<Skeleton width="70%" />
		</div>
	);
}

export default Loading;
