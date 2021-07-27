import React from "react";
import RichTextEditor from "react-rte";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	editor: {
		minHeight: 430,
		width: "100%",
		overflow: "auto",
		overflowX: "auto",
		overflowY: "auto",
		zIndex: 2,
	},
}));

export default function BodyTextEditor({ value, setValue, readOnly }) {
	const classes = useStyles();

	const [editorValue, setEditorValue] = React.useState(
		RichTextEditor.createValueFromString(value, "html")
	);

	const handleChange = (value) => {
		setEditorValue(value);
		setValue(value.toString("html"));
	};

	return (
		<RichTextEditor
			readOnly={readOnly}
			value={editorValue}
			onChange={handleChange}
			required
			id="body-text"
			name="bodyText"
			type="string"
			multiline
			variant="filled"
			className={classes.editor}
		/>
	);
}
