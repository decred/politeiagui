import React from "react";
import { Row } from "../layout";
import styles from "./Files.module.css";
import { classNames, P } from "pi-ui";


const ThumbnailGrid = ({ value, onClick, errors = [], viewOnly = false }) => {
  const files = value.filter(f => f.name !== "index.md");
  const filesWithErrors = files.map((file, key) => errors.files && errors.files[key] ?
    { ...file, error: true } : { ...file, error: false }
  );

	return (
		<>
		<ThumbnailGridErrors errors={errors} />
		<Row className={styles.thumbnailGrid} justify="left" topMarginSize={errors ? "s" : "m"}>
			{filesWithErrors.map(f => f.mime.includes("image") ? (
				<ImageThumbnail 
					file={f}
					viewOnly={viewOnly}
					onClick={onClick}
				/>
			) : (
				<TextThumbnail 
					file={f}
					viewOnly={viewOnly}
					onClick={onClick}
				/>
			))}
		</Row>
		</>
	)
};

const ThumbnailGridErrors = ({ errors }) => {
  const fileErrors = errors.files || [];
  const imgCountError = errors.imgCount;
  const mdCountError = errors.mdCount;

  const errs = fileErrors.reduce( (acc, err) => {
    return err ? acc.concat(Object.values(err)) : acc;
  }, []);
  const uniqueErrors = [...new Set(errs)].concat(imgCountError, mdCountError);

  return uniqueErrors.map(err => err && (
    <P className={styles.fileErrorText}>
      {err}
    </P>
  ))
};

const ImageThumbnail = ({ file, viewOnly, onClick }) => (
	<div className={styles.imageThumbnailWrapper}>
		<img
			className={classNames(styles.imageThumbnail, file.error && styles.fileError)}
			alt={file.name}
			src={`data:${file.mime};base64,${file.payload}`}
		/>
		{!viewOnly && RemoveButton(file, onClick)}
	</div>
);

const TextThumbnail = ({ file, viewOnly, onClick }) => (
	<div className={styles.fileThumbnailWrapper}>
		<div className={classNames(styles.fileThumbnail, file.error && styles.fileError)}>
			<P className={styles.fileThumbnailText}>.txt</P>	
		</div>
		{!viewOnly && RemoveButton(file, onClick)}
	</div>
);

const RemoveButton = (file, onClick) => (
	<a className={styles.removeFileIcon} onClick={() => onClick(file)} href="#">
		&times;
	</a>
);

export default ThumbnailGrid;