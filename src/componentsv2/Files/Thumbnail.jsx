import React from "react";
import { Row } from "../layout";
import styles from "./Files.module.css";
import { Button, classNames, P } from "pi-ui";


const FilesThumbnail = ({ value, errors, onClick, viewOnly = false }) => {
	const files = value.filter(f => f.name !== "index.md");
	return (
		<>
		{errors ? (					
			<>
				{errors.map(err => {
					return (
						<P className={styles.fileErrorText}>
							{Object.values(err)[0]}
						</P>
					)
				})}
			</>
		) : null }
		<Row className={styles.thumbnailWrapper} justify="left" topMarginSize={errors ? "s" : "m"}>
			{files.map(f => f.mime.includes("image") ? (
				<div className={styles.thumbnailWrapper}>
					<img
						className={classNames(styles.imageThumbnail, errors && styles.fileError)}
						alt={f.name}
						src={`data:${f.mime};base64,${f.payload}`}
					/>
					{!viewOnly && RemoveButton(f, onClick)}
				</div>
			) : (
				<div className={styles.thumbnailWrapper}>
					<div className={classNames(styles.fileThumbnail, errors && styles.fileError)}>
						<P className={styles.fileThumbnailText}>.txt</P>	
					</div>
					{!viewOnly && RemoveButton(f, onClick)}
				</div>
			))}
		</Row>
		</>
	)
}

const RemoveButton = (file, onClick) => (
	<Button	
		className={styles.removeFileIcon} 
		onClick={(e) => {
			e.preventDefault();
			onClick(file)
		}} 
		kind="primary" 
		size="sm" 
	/>
)

export default FilesThumbnail;