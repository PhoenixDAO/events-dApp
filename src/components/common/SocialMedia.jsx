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
				marginTop: "-4px",
			},
			display: "inherit",
		},
	},
}));

const SocialMedia = ({ disabled, shareUrl, eventTitle }) => {
	const classes = useStyles();

	return (
		<Grid container justify="flex-end" className={classes.socialMediaIcons}>
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
				hashtag="#PHNX"
				quote={eventTitle}
			>
				<i className="fab fa-facebook-f"></i>
			</FacebookShareButton>
			<TwitterShareButton
				className="iconHolder"
				url={shareUrl}
				resetButtonStyle={false}
				disabled={disabled}
				title={eventTitle}
				hashtags={["PHNX"]}
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
