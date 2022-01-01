import React, { useCallback, useMemo, useState } from "react";
import "./customform.css";
import roundlogo from "../Images/roundlogo.svg";
import ipfs from "../../utils/ipfs";
import { IconButton } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomForm = React.memo((props) => {
	const [file, setFile] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorFile, setErrorFile] = useState("");
	const [errorName, setErrorName] = useState("");

	const handleFile = (e) => {
		if (
			e.target.files[0] !== undefined &&
			e.target.files[0].size < 3 * 1024 * 1024
		) {
			setFile(e.target.files);
			setErrorFile("");
		} else {
			setErrorFile("File should be be less than 3MB!");
		}
	};

	const handleName = (e) => {
		if (e.target.value.length <= 30) {
			props.handleName(e.target.value);
			setErrorName("");
		} else {
			setErrorName("Avatar name cant be bigger then 30 characters");
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
		if (file[0] !== undefined) {
			const base64Img = await getBase64(file[0]);
			setLoading(true);
			let ipfsData = JSON.stringify({
				image0: base64Img,
			});
			let buffer = Buffer.from(ipfsData);
			ipfs.add(buffer, { pin: pinit })
				.then((hash) => {
					setLoading(false);
					props.handleCustomAvatar(true);
					props.handleAvatar(hash[0].hash);
					props.handleClose();
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
							style={{backgroundImage:`url(${showImage()})`, height: "100px", backgroundSize: "cover", mozBackgroundSize: "cover", backgroundPosition: "center"}}
							// style={{
							// 	backgroundImage: `url(${showImage()})`,
							// }}
						>
							{/* <img className="custom-img" src={showImage()} /> */}
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
				{errorFile ? (
					<p style={{ color: "red" }}>
						Click to upload an image. Max Size 3MB
					</p>
				) : (
					<p>Click to upload an image. Max Size 3MB</p>
				)}
			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<div className="frm-single" style={{ width: "76%" }}>
					<p className="avatar-name-heading">Avatar Name</p>
					<input
						className="avatar-name-inpt"
						onChange={handleName}
						maxLength="30"
					/>
					{errorName ? (
						<p style={{ color: "red", marginTop: "4px" }}>
							{errorName}
						</p>
					) : null}
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
						"Confirm selection"
					)}
				</button>
			</div>
		</div>
	);
});
export default CustomForm;
