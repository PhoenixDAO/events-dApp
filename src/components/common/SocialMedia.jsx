import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	RedditShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	InstapaperShareButton,
} from "react-share";
import {
	Email,
	Twitter,
	LinkedIn,
	Telegram,
	WhatsApp,
} from "@material-ui/icons";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	socialMediaIcons: {
		display: "flex",
		[theme.breakpoints.down("xs")]: {
			marginTop: "40px",
			"& .MuiSvgIcon-root": {
				fontSize: "18px",
				display: "content",
			},
			display: "inherit",
		},
	},
}));

const SocialMedia = ({ disabled, shareUrl }) => {
	const classes = useStyles();

	return (
		<Grid container justify="center" className={classes.socialMediaIcons}>
			<EmailShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<Email />
			</EmailShareButton>

			<FacebookShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<i className="fab fa-facebook-f"></i>
			</FacebookShareButton>

			<InstapaperShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<i className="fab fa-instagram"></i>
			</InstapaperShareButton>

			<TwitterShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<Twitter />
			</TwitterShareButton>

			<LinkedinShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<LinkedIn />
			</LinkedinShareButton>
			<TelegramShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<Telegram />
			</TelegramShareButton>

			<WhatsappShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<WhatsApp />
			</WhatsappShareButton>

			<RedditShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
			>
				<i className="fab fa-reddit"></i>
			</RedditShareButton>
		</Grid>
	);
};

export default SocialMedia;
