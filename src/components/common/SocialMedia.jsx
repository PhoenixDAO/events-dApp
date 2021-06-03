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
import {  Email, Twitter, LinkedIn, Telegram, WhatsApp } from "@material-ui/icons";
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    socialMediaIcons: {
        display: "flex",
        [theme.breakpoints.down("xs")]: {
            marginTop: "40px",
            "& .MuiSvgIcon-root": {
                fontSize: "18px",
                display: "content"
            },
            display: "inherit"
        },

    },
}));

const SocialMedia = ({ title }) => {
    const classes = useStyles();
    let shareUrl = window.location;
    return (
        <Grid  justify="flex-end" className={classes.socialMediaIcons}>
            <EmailShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <Email />
            </EmailShareButton>

            <FacebookShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <i class="fab fa-facebook-f" ></i>
            </FacebookShareButton>


            <LinkedinShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <i class="fab fa-instagram" ></i>
            </LinkedinShareButton>

            <TwitterShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <Twitter />
            </TwitterShareButton>

            <LinkedinShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <LinkedIn />
            </LinkedinShareButton>
            <TelegramShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <Telegram />
            </TelegramShareButton>

            <WhatsappShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <WhatsApp />
            </WhatsappShareButton>

            <RedditShareButton
                className="iconHolder"
                url={shareUrl}
                title={title}
                resetButtonStyle={false}
            >
                <i class="fab fa-reddit" ></i>
            </RedditShareButton>

        </Grid>
    );
};

export default SocialMedia;