import React from "react";
import { Row } from "../layout";
import styles from "./Files.module.css";
import { classNames, P, Button } from "pi-ui";


const ThumbnailGrid = ({ value, onClick, errors = [], viewOnly = false }) => {
  const files = value.filter(f => f.name !== "index.md");
  const filesWithErrors = files.map((file, key) => 
    errors.files && errors.files[key] ?
      { ...file, error: true } : { ...file, error: false }
  );
	return (
		<>
		<ThumbnailGridErrors errors={errors} />
    
    <Row 
      className={styles.thumbnailGrid} 
      justify="left" 
      topMarginSize={errors ? "s" : "m"}
    >
			{filesWithErrors.map( (f, key) => f.mime.includes("image") ? (
				<ImageThumbnail
          key={`img-${key}`}
					file={f}
					viewOnly={viewOnly}
					onClick={onClick}
				/>
			) : (
        <TextThumbnail 
          key={`txt-${key}`}      
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
  // Unique errors is used to remove duplicate error messages from Yup
  const errs = fileErrors.reduce((acc, err) => {
    return err ? acc.concat(Object.values(err)) : acc;
  }, []);
  const uniqueErrors = [...new Set(errs)];

  return uniqueErrors.map(err => err && (
    <p key={err} className={styles.fileErrorText}>
      {err}
    </p>
  ))
};

const ImageThumbnail = ({ file, viewOnly, onClick }) => (
  <div 
    className={classNames(styles.imageThumbnailWrapper, viewOnly && styles.marginRight)}
  >
		<img
			className={classNames(styles.imageThumbnail, file.error && styles.fileError)}
			alt={file.name}
			src={`data:${file.mime};base64,${file.payload}`}
		/>
		{!viewOnly && RemoveButton(file, onClick)}
	</div>
);

const TextThumbnail = ({ file, viewOnly, onClick }) => (
  <div 
    className={classNames(styles.fileThumbnailWrapper, viewOnly && styles.marginRight)}
  >
		<div className={classNames(styles.fileThumbnail, file.error && styles.fileError)}>
			<P className={styles.fileThumbnailText}>.txt</P>	
		</div>
		{!viewOnly && RemoveButton(file, onClick)}
	</div>
);

const RemoveButton = (file, onClick) => (
  <Button 
    className={styles.removeFileIcon} 
    onClick={(e) => {
      e.preventDefault();
      onClick(file);
    }}
    kind="secondary"
    size="sm"
    icon
  >
		&times;
	</Button>
);

export default ThumbnailGrid;