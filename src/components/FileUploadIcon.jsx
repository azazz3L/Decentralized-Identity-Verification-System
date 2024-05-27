import React from "react";

export const FileUploadIcon = ({
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
        d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V3C19 2.44772 18.5523 2 18 2H6ZM7 4H17V20H7V4ZM12 5C11.4477 5 11 5.44772 11 6V13.5858L9.70711 12.2929C9.31658 11.9024 8.68342 11.9024 8.29289 12.2929C7.90237 12.6834 7.90237 13.3166 8.29289 13.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L15.7071 13.7071C16.0976 13.3166 16.0976 12.6834 15.7071 12.2929C15.3166 11.9024 14.6834 11.9024 14.2929 12.2929L13 13.5858V6C13 5.44772 12.5523 5 12 5Z"
        fill={fill}
      />
    </svg>
  );
};
