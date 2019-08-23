import React from "react";
import { Row } from "../layout";
import styles from "./Files.module.css";
import { classNames, P } from "pi-ui";


const ThumbnailGrid = ({ value, onClick, onRemove, errors = [], viewOnly = false }) => {
  const files = value.filter(f => f.name !== "index.md");
	return (
		<>
		<ThumbnailGridErrors errors={errors} />
    
    <Row 
      className={styles.thumbnailGrid} 
      justify="left" 
      topMarginSize={errors ? "s" : "m"}
    >
			{files.map( (f, key) => f.mime.includes("image") ? (
				<ImageThumbnail
          key={`img-${key}`}
					file={f}
          viewOnly={viewOnly}
          onClick={onClick}
					onRemove={onRemove}
				/>
			) : (
        <TextThumbnail 
          key={`txt-${key}`}      
					file={f}
          viewOnly={viewOnly}
          onClick={onClick}
					onRemove={onRemove}
				/>
			))}
		</Row>
		</>
	)
};

const ThumbnailGridErrors = ({ errors }) => {
  const fileErrors = errors.files || [];
  const uniqueErrors = 
    Array.isArray(fileErrors) ? [...new Set(fileErrors)] : [fileErrors];
  return uniqueErrors.map(err => err && (
    <p key={err} className={styles.fileErrorText}>
      {err}
    </p>
  ))
};

const ImageThumbnail = ({ file, viewOnly, onClick, onRemove }) => (
  <div 
    className={classNames(styles.imageThumbnailWrapper, viewOnly && styles.marginRight)}
  > 
    <span onClick={onClick(file)}>
    <img
      className={styles.imageThumbnail}
      alt={file.name}
      src={`data:${file.mime};base64,${file.payload}`}
    />
    </span>
    {!viewOnly && RemoveButton(file, onRemove)}
  </div>
);

const TextThumbnail = ({ file, viewOnly, onRemove }) => (
  <div 
    className={classNames(styles.fileThumbnailWrapper, viewOnly && styles.marginRight)}
  >
		<div className={styles.fileThumbnail}>
			<P className={styles.fileThumbnailText}>.txt</P>	
		</div>
		{!viewOnly && RemoveButton(file, onRemove)}
	</div>
);

const RemoveButton = (file, onRemove) => (
  <button 
    className={styles.removeFileIcon} 
    onClick={(e) => {
      e.preventDefault();
      onRemove(file);
    }}
  >
		&times;
	</button>
);

export default ThumbnailGrid;