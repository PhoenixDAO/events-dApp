import React from "react";
import RichTextEditor from "react-rte";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	editor: {},
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
		<div className="editor-demo">
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
				className="editor"
				// className={classes.editor}
			/>
		</div>
	);
}
