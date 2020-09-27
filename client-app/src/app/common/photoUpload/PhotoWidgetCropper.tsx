import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
  setImage: (file: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropperRef.current && typeof cropper.getCroppedCanvas() === "undefined")
      return;
    cropperRef &&
      cropperRef.current &&
      cropper.getCroppedCanvas({ fillColor: "#ffffff" }).toBlob((blob: any) => {
        setImage(blob);
      }, "image/jpeg");
  };

  return (
    <Cropper
      src={imagePreview}
      style={{ height: 300, width: "100%" }}
      // Cropper.js options
      aspectRatio={1 / 1} // Define the fixed aspect ratio of the crop box. By default, the crop box is free ratio.
      preview=".img-preview" // Add extra elements (containers) for preview.
      initialAspectRatio={16 / 9} // Define the initial aspect ratio of the crop box. By default, it is the same as the aspect ratio of the canvas (image wrapper).
      guides={true} // Show the dashed lines above the crop box.
      crop={onCrop}
      ref={cropperRef}
      dragMode="move" // Define the dragging mode of the cropper.
      scalable={true} // Enable to scale the image.
      // zoomable={true} // Enable to zoom the image.
      // rotatable={true} // Enable to rotate the image.
      // zoomOnWheel={true} // Enable to zoom the image by wheeling mouse.
      cropBoxMovable={true} // Enable to move the crop box by dragging.
      cropBoxResizable={true} // Enable to resize the crop box by dragging.
      // responsive={true} // Re-render the cropper when resizing the window.
      // restore={true} // Restore the cropped area after resizing the window.
      // center={true} // Show the center indicator above the crop box.
      // background={false} // Show the grid background of the container.
    />
  );
};

export default PhotoWidgetCropper;
