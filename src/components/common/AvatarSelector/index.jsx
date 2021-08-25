import React, {useState, useEffect} from 'react'

const AvatarSelector = ()=>{
    const [open, setOpen] = useState(false);
    const [nextForm, setNextForm] = useState(false);
	const [name, setName] = useState("Bennu");
	const [avatarNumber, setAvatarNumber] = useState(0);
	const [avatarCustom, setAvatarCustom] = useState(false);

	const handleName = (value) => {
		setName(value);
	};

    const handleAvatar = (value) => {
		setAvatar(value);
	};

    const handleCustomAvatar = (value) => {
		setAvatarCustom(value);
	};

    const handleClose = () => {
		setNextForm(false);
		setOpen(false);
	};

    const handleAvatarNumber = (value) => {
		setAvatarNumber(value);
	};


}

export default AvatarSelector