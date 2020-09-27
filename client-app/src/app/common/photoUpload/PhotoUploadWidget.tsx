import React, { Fragment, useEffect, useState } from "react";
import { Header, Grid, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface IProps {
  uploadPhoto: (file: Blob) => void;
  uploadingPhoto: boolean;
}

export const PhotoUploadWidget: React.FC<IProps> = ({
  uploadPhoto,
  uploadingPhoto,
}) => {
  const [files, setFiles] = useState<any[]>([]); // Will cause memory leak
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={16}>
          {files.length === 0 && (
            <Fragment>
              <Header color="teal" sub content="Step 1 - Add Photo" />
              <PhotoWidgetDropzone setFiles={setFiles} />
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={8}>
          {files.length > 0 && (
            <Fragment>
              <Header sub color="teal" content="Step 2 - Resize image" />
              <PhotoWidgetCropper
                setImage={setImage}
                imagePreview={files[0].preview}
              />
            </Fragment>
          )}
        </Grid.Column>
        <Grid.Column width={8}>
          {files.length > 0 && (
            <Fragment>
              <Header sub color="teal" content="Step 3 - Preview & Upload" />
              <div
                className="img-preview"
                style={{
                  minHeight: "300px",
                  overflow: "hidden",
                  border: "1px solid #000000",
                  borderRadius: "300px",
                }}
              />
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
      {files.length > 0 && (
        <Grid>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Button.Group fluid widths={2}>
              <Button
                positive
                icon="check"
                loading={uploadingPhoto}
                content="Submit"
                onClick={() => uploadPhoto(image!)}
              />
              <Button
                icon="close"
                disabled={uploadingPhoto}
                content="Cancel"
                onClick={() => setFiles([]!)}
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      )}
    </Fragment>
  );
};

export default observer(PhotoUploadWidget);
