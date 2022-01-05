import React from "react";
import RichTextEditor from "react-rte";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	editor: {},
}));

export default function BodyTextEditor({
	value,
	setValue,
	readOnly,
	name,
	id,
}) {
	const classes = useStyles();

	const [editorValue, setEditorValue] = React.useState(
		RichTextEditor.createValueFromString(value, "html")
	);

	const handleChange = (value) => {
		setEditorValue(value);
		setValue(value.toString("html"));
	};

	const toolbarConfig = {
		// Optionally specify the groups to display (displayed in the order listed).
		display: [
			"IMAGE_BUTTON",
			'LINK_BUTTONS',
			"INLINE_STYLE_BUTTONS",
			"BLOCK_TYPE_BUTTONS",
			"BLOCK_TYPE_DROPDOWN",
			"HISTORY_BUTTONS",
		],
		INLINE_STYLE_BUTTONS: [
			{ label: "Bold", style: "BOLD", className: "custom-css-class" },
			{ label: "Italic", style: "ITALIC" },
			{ label: "Underline", style: "UNDERLINE" },
		],
		BLOCK_TYPE_DROPDOWN: [
			{ label: "Normal", style: "unstyled" },
			{ label: "Heading Large", style: "header-one" },
			{ label: "Heading Medium", style: "header-two" },
			{ label: "Heading Small", style: "header-three" },
		],
		BLOCK_TYPE_BUTTONS: [
			{ label: "UL", style: "unordered-list-item" },
			{ label: "OL", style: "ordered-list-item" },
		],
	};

	return (
		<div className="editor-demo">
			<RichTextEditor
				autoFocus
				toolbarConfig={toolbarConfig}
				readOnly={readOnly}
				value={editorValue}
				onChange={handleChange}
				onBlur={handleChange}
				required
				id={id}
				name={name}
				type="string"
				multiline
				variant="filled"
				className="editor"
				// className={classes.editor}
				placeholder="Tell us about your event....."
			/>
		</div>
	);
}
