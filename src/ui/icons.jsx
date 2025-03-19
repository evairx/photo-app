export const CloseSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} style={{marginTop:'.300rem'}} fill="none">
    <path
      fill="#fff"
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
    />
  </svg>
)

export const TrashSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
)

export const TrashSvgActive = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <g fill="#fff" clipPath="url(#a)">
      <path d="M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6h16ZM14 2a2 2 0 0 1 2 2 1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2h4Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const VideoSvg = ({colorSvg}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
    <g
      stroke={colorSvg}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="m12.5 8.333 3.794-1.896a.833.833 0 0 1 1.206.745v5.636a.833.833 0 0 1-1.206.745L12.5 11.667V8.333Z" />
      <path d="M2.5 6.667A1.667 1.667 0 0 1 4.167 5h6.666A1.666 1.666 0 0 1 12.5 6.667v6.666A1.666 1.666 0 0 1 10.833 15H4.167A1.667 1.667 0 0 1 2.5 13.333V6.667Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const PhotoSvgUpload = ({colorSvg}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
    <g
      stroke={colorSvg}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M12.5 6.667h.008M2.5 5A2.5 2.5 0 0 1 5 2.5h10A2.5 2.5 0 0 1 17.5 5v10a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 15V5Z" />
      <path d="m2.5 13.333 4.167-4.166c.773-.744 1.726-.744 2.5 0l4.166 4.166" />
      <path d="m11.667 11.667.833-.834c.773-.744 1.727-.744 2.5 0l2.5 2.5" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const HiddenSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <path
      fill="#fff"
      d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.647 9.647 0 0 1-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6Zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14ZM2.01 3.87l2.68 2.68A11.738 11.738 0 0 0 1 11.5C2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87Zm7.5 7.5 2.61 2.61c-.04.01-.08.02-.12.02a2.5 2.5 0 0 1-2.5-2.5c0-.05.01-.08.01-.13Zm-3.4-3.4 1.75 1.75a4.6 4.6 0 0 0-.36 1.78 4.507 4.507 0 0 0 6.27 4.14l.98.98c-.88.24-1.8.38-2.75.38a9.77 9.77 0 0 1-8.82-5.5c.7-1.43 1.72-2.61 2.93-3.53Z"
    />
  </svg>
)

export const DownloadSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-download"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12" />
  </svg>
)

export const FavoriteSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-heart"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
  </svg>
)

export const PhotoSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
    <path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5" />
    <path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3" />
  </svg>
)

export const PhotoActiveSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <g clipPath="url(#a)">
      <path
        fill="#fff"
        d="M8.813 11.612c.457-.38.918-.38 1.386.011l.108.098 4.986 4.986.094.083a1 1 0 0 0 1.403-1.403l-.083-.094L15.415 14l.292-.293.106-.095c.457-.38.918-.38 1.386.011l.108.098 4.674 4.675a4 4 0 0 1-3.775 3.599L18 22H6a4 4 0 0 1-3.98-3.603l6.687-6.69.106-.095ZM18 2a4 4 0 0 1 3.995 3.8L22 6v9.585l-3.293-3.292-.15-.137c-1.256-1.095-2.85-1.097-4.096-.017l-.154.14-.307.306-2.293-2.292-.15-.137c-1.256-1.095-2.85-1.097-4.096-.017l-.154.14L2 15.585V6a4 4 0 0 1 3.8-3.995L6 2h12Zm-2.99 5-.127.007a1 1 0 0 0 0 1.986L15 9l.127-.007a1 1 0 0 0 0-1.986L15.01 7Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const AlbumSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-library-photo"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M7 5.667A2.667 2.667 0 0 1 9.667 3h8.666A2.667 2.667 0 0 1 21 5.667v8.666A2.667 2.667 0 0 1 18.333 17H9.667A2.667 2.667 0 0 1 7 14.333z" />
    <path d="M4.012 7.26A2.005 2.005 0 0 0 3 8.997v10c0 1.1.9 2 2 2h10c.75 0 1.158-.385 1.5-1M17 7h.01" />
    <path d="m7 13 3.644-3.644a1.21 1.21 0 0 1 1.712 0L16 13" />
    <path d="m15 12 1.644-1.644a1.21 1.21 0 0 1 1.712 0L21 13" />
  </svg>
)

export const AlbumActiveSvg  = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <g clipPath="url(#a)">
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.012 7.26A2.005 2.005 0 0 0 3 8.997v10c0 1.1.9 2 2 2h10c.75 0 1.158-.385 1.5-1M17 7h.01"
      />
      <path
        fill="#fff"
        d="M11.11 10.209c.343-.285.688-.285 1.04.008l.08.074 3.74 3.74.07.061a.75.75 0 0 0 1.053-1.052l-.063-.07-.969-.97.22-.22.079-.071c.343-.285.688-.285 1.04.008l.08.074 3.506 3.506a3 3 0 0 1-2.832 2.7L18 18H9a3 3 0 0 1-2.985-2.702l5.015-5.018.08-.071ZM18 3a3 3 0 0 1 2.996 2.85L21 6v7.189l-2.47-2.47-.112-.102c-.942-.821-2.138-.823-3.072-.013l-.116.105-.23.23-1.72-1.72-.112-.102c-.942-.821-2.138-.823-3.072-.013l-.116.105L6 13.19V6a3 3 0 0 1 2.85-2.996L9 3h9Zm-2.242 3.75-.096.005a.75.75 0 0 0 0 1.49l.088.005.095-.005a.75.75 0 0 0 0-1.49l-.088-.005Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const OcultSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-lock"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z" />
    <path d="M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4" />
  </svg>
)

export const OcultSvgActive = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="#fff"
    className="icon icon-tabler icons-tabler-filled icon-tabler-lock"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3V7a5 5 0 0 1 5-5m0 12a2 2 0 0 0-1.995 1.85L10 16a2 2 0 1 0 2-2m0-10a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3" />
  </svg>
)


export const CloudSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M6.657 18C4.085 18 2 15.993 2 13.517c0-2.475 2.085-4.482 4.657-4.482.393-1.762 1.794-3.2 3.675-3.773 1.88-.572 3.956-.193 5.444 1 1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486 0 1.927-1.551 3.487-3.465 3.487H6.657" />
  </svg>
)

export const SearchSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
    <g
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.43}
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <path d="M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0ZM21 21l-6-6" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const UserSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} fill="none" opacity={0.73}>
    <path
      fill="#fff"
      d="M17.567 35.135c9.61 0 17.568-7.975 17.568-17.568C35.135 7.957 27.16 0 17.55 0 7.957 0 0 7.957 0 17.567c0 9.593 7.974 17.568 17.567 17.568Zm0-11.712c-5.184 0-9.162 1.86-10.919 3.927a14.651 14.651 0 0 1-3.703-9.783c0-8.129 6.476-14.64 14.605-14.64 8.13 0 14.64 6.511 14.657 14.64a14.466 14.466 0 0 1-3.72 9.783c-1.74-2.067-5.736-3.927-10.92-3.927Zm0-2.928c3.324.035 5.908-2.79 5.908-6.493 0-3.479-2.601-6.355-5.908-6.355-3.306 0-5.924 2.876-5.907 6.355.017 3.703 2.6 6.459 5.907 6.493Z"
    />
  </svg>
)

export const SelectAll = () => (
  <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-select-all"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 8m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" /><path d="M12 20v.01" /><path d="M16 20v.01" /><path d="M8 20v.01" /><path d="M4 20v.01" /><path d="M4 16v.01" /><path d="M4 12v.01" /><path d="M4 8v.01" /><path d="M4 4v.01" /><path d="M8 4v.01" /><path d="M12 4v.01" /><path d="M16 4v.01" /><path d="M20 4v.01" /><path d="M20 8v.01" /><path d="M20 12v.01" /><path d="M20 16v.01" /><path d="M20 20v.01" /></svg>
)

export const DeselectAll = () => (
  <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-deselect"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 8h3a1 1 0 0 1 1 1v3" /><path d="M16 16h-7a1 1 0 0 1 -1 -1v-7" /><path d="M12 20v.01" /><path d="M16 20v.01" /><path d="M8 20v.01" /><path d="M4 20v.01" /><path d="M4 16v.01" /><path d="M4 12v.01" /><path d="M4 8v.01" /><path d="M8 4v.01" /><path d="M12 4v.01" /><path d="M16 4v.01" /><path d="M20 4v.01" /><path d="M20 8v.01" /><path d="M20 12v.01" /><path d="M20 16v.01" /><path d="M3 3l18 18" /></svg>
)