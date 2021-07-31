import React, { useState } from "react";
import "./customform.css";
import roundlogo from "../Images/roundlogo.svg";
import ipfs from "../../utils/ipfs";

const CustomForm = (props) => {
	const [file, setFile] = useState([]);
	const handleFile = (e) => {
		console.log(e.target.files);
		if (
			e.target.files[0] !== undefined &&
			e.target.files[0].size < 3 * 1024 * 1024
		) {
			setFile(e.target.files);
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
		if (file[0] !== undefined) {
			let ipfsData = JSON.stringify({
				image0: base64Img,
			});
			let buffer = Buffer.from(ipfsData);
			console.log("buffer", buffer);
			ipfs.add(buffer, { pin: pinit })
				.then((hash) => {
					console.log("hash", hash);
					

					props.handleCustomAvatar(true);
					props.handleAvatar(hash[0].hash);
					props.handleClose();
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<div className="idn-hldr">
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
				{ }
				<div >
					{file.length > 0 ? (
						<div
							className="custom-img-hldr"
							style={{
								backgroundImage: `url(${URL.createObjectURL(
									file[0]
								)})`,
							}}
						></div>
					) : (
						<div>
							<label
								for="file-upload"
								className="custom-file-upload1"
							>
								<span
									style={{
										marginTop: "20px",
										display: "block",
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
				<div className="frm-single" style={{ width: "81%" }}>
					<p className="avatar-name-heading">AVATAR NAME</p>
					<input
						className="avatar-name-inpt"
						onChange={(e) => props.handleName(e.target.value)}
					/>
					<p className="org-subheading" style={{ marginTop: "4px" }}>
						Use a fun and playful name					</p>
				</div>
			</div>
			<div className="" style={{ marginTop: "20px", justifyContent: "center", display: "flex" }}>
				<button className="avatar-select-btn" onClick={uploadImage}>
					Save
				</button>
			</div>
		</div>
	);
};
export default CustomForm;
