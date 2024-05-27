import React from "react";

const FileUploadIcon = ({
  fill = 'currentColor',
  size,
  height,
  width,
  label,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.92 11.59L11.41 8.1V18H12.59V8.1L16.08 11.59L17.5 10.17L12 4.67L6.5 10.17L7.92 11.59ZM6 4C5.44772 4 5 4.44772 5 5V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V5C19 4.44772 18.5523 4 18 4H6Z"
        fill={fill}
      />
    </svg>
  );
};

export default FileUploadIcon;
