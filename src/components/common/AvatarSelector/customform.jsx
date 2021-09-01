import React, { useCallback, useMemo, useState } from "react";
import "./customform.css";
import roundlogo from "../../Images/roundlogo.svg";
import ipfs from "../../../utils/ipfs";
import { IconButton } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";

const CustomForm = React.memo((props) => {
	const [file, setFile] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};

	const handleFile = (e) => {
		console.log(e.target.files);
		if (
			e.target.files[0] !== undefined &&
			e.target.files[0].size < 3 * 1024 * 1024
		) {
			setFile(e.target.files);
		} else {
			setError("File should be be less then 3mb!");
			setOpen(true);
		}
	};
	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const uploadImage = async (e) => {
		e.preventDefault();
		let pinit = process.env.NODE_ENV === "production";
		const base64Img = await getBase64(file[0]);
		setLoading(true);
		if (file[0] !== undefined) {
			let ipfsData = JSON.stringify({
				image0: base64Img,
			});
			let buffer = Buffer.from(ipfsData);
			console.log("buffer", buffer);
			ipfs.add(buffer, { pin: pinit })
				.then((hash) => {
					setLoading(false);
					console.log("hash", hash);
					props.handleCustomAvatar(true);
					props.handleAvatar(hash[0].hash);
					props.handleClose();
					if (props.origin === "App") {
						props.updateUserInfo();
					}
				})
				.catch((err) => {
					setLoading(false);
					console.log(err);
				});
		}
	};

	const showImage = useCallback(() => {
		if (file.length > 0) {
			return URL.createObjectURL(file[0]);
		}
	}, [file, setFile]);

	return (
		<div className="idn-hldr">
			<IconButton
				aria-label="delete"
				className="backArrow"
				onClick={props.toggleForm}
			>
				<KeyboardBackspaceIcon
					fontSize="40px"
					style={{ fill: "#1E1E22" }}
				/>
			</IconButton>
			<div className="idn-head">
				<div>
					<img
						style={{ height: "21px" }}
						src={roundlogo}
						alt="phnx logo"
					/>
				</div>
				<div>
					<p className="idn-heading">PhoenixDAO</p>
				</div>
			</div>
			<div className="idn-sub">
				<h5 className="idn-subhead1"> Choose your identity</h5>
				<p className="idn-subhead2">Create your own custom Avatar</p>
				{}
				<div>
					{file.length > 0 ? (
						<div
							className="custom-img-hldr"
							// style={{
							// 	backgroundImage: `url(${showImage()})`,
							// }}
						>
							<img className="custom-img" src={showImage()} />
						</div>
					) : (
						<div>
							<label
								for="file-upload"
								className="custom-file-upload1"
							>
								<span
									style={{
										display: "block",
										color: "#1E1E22",
									}}
								>
									+{" "}
								</span>
							</label>
							<input
								id="file-upload"
								type="file"
								accept="image/*"
								name="file"
								onChange={handleFile}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="upload-text">
				Click to upload an image. Max Size 3MB
			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<div className="frm-single" style={{ width: "76%" }}>
					<p className="avatar-name-heading">AVATAR NAME</p>
					<input
						className="avatar-name-inpt"
						onChange={(e) => props.handleName(e.target.value)}
					/>
					<p className="org-subheading" style={{ marginTop: "4px" }}>
						Use a fun and playful name{" "}
					</p>
				</div>
			</div>
			<div
				className=""
				style={{
					marginTop: "20px",
					justifyContent: "center",
					display: "flex",
				}}
			>
				<button
					className="avatar-select-btn"
					onClick={uploadImage}
					disabled={loading}
				>
					{loading ? (
						<CircularProgress
							style={{
								color: "white",
								width: "15px",
								height: "15px",
							}}
						/>
					) : (
						"Save"
					)}
				</button>
			</div>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={open}
				onClose={handleClose}
				message={error}
				autoHideDuration={3000}
				key={"bottom" + "center"}
				className="snackbar"
			/>
		</div>
	);
});
export default CustomForm;
