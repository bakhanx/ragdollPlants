interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Water Icon
export const WaterIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M12 22C7.58172 22 4 18.4183 4 14C4 10.4979 6.70977 7.69717 9.09279 5.13085L12 2L14.9072 5.13085C17.2902 7.69717 20 10.4979 20 14C20 18.4183 16.4183 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Water2 Icon
export const Water2Icon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      fill="currentColor"
      d="M256,499.2c-98.807,0-179.2-80.393-179.2-179.2c0-84.369,50.304-147.115,103.552-213.555
      c22.4-27.947,45.568-56.858,64.794-87.629h21.717c19.226,30.763,42.394,59.674,64.794,87.629
      C384.896,172.885,435.2,235.631,435.2,320C435.2,418.807,354.807,499.2,256,499.2z"
    />
    <path
      fill="#ffffff"
      d="M341.641,98.432c-22.17-27.665-45.099-56.269-63.932-86.4C273.033,4.548,264.823,0,256,0
      c-8.823,0-17.033,4.548-21.709,12.032c-18.833,30.14-41.762,58.743-63.932,86.4C118.067,163.678,64,231.142,64,320
      c0,105.865,86.135,192,192,192s192-86.135,192-192C448,231.142,393.933,163.678,341.641,98.432z M256,486.4
      c-91.904,0-166.4-74.496-166.4-166.4C89.6,204.8,192,128,256,25.6C320,128,422.4,204.8,422.4,320
      C422.4,411.904,347.904,486.4,256,486.4z"
    />
    <path
      fill="#ffffff"
      d="M384,309.564c-7.074,0-12.8,5.726-12.8,12.8c0,63.522-51.678,115.2-115.2,115.2
      c-7.074,0-12.8,5.726-12.8,12.8s5.726,12.8,12.8,12.8c77.628,0,140.8-63.172,140.8-140.8C396.8,315.29,391.074,309.564,384,309.564z"
    />
  </svg>
);

// Nutrient Icon
export const NutrientIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M8.42896 8.57104L15.5 15.6421M8.42896 8.57104L4.89342 12.1066C2.9408 14.0592 2.9408 17.225 4.89342 19.1776C6.84604 21.1303 10.0119 21.1303 11.9645 19.1776L15.5 15.6421M8.42896 8.57104L11.9645 5.03551C13.9171 3.08289 17.0829 3.08289 19.0356 5.03551C20.9882 6.98813 20.9882 10.154 19.0356 12.1066L15.5 15.6421"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Nutrient2 Icon (same as Nutrient)
export const Nutrient2Icon = NutrientIcon;

// Pin Icon
export const PinIcon = ({ size = 16, className = '', style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 22"
    xmlns="http://www.w3.org/2000/svg"
    transform="rotate(-45)"
    className={className}
    style={style}>
    <path
      fill="#F05A28"
      d="M20.995,15.479c0.024-0.712-0.452-1.438-1.488-1.978v-1.321c1.201-0.619,1.548-1.395,1.488-2.054 V8.606c-0.004-0.668-0.442-1.337-1.315-1.839c-1.767-1.018-4.623-1.023-6.379-0.012c-1.426,0.821-1.295,1.835-1.295,1.835v1.535 c-0.045,0.645,0.3,1.414,1.488,2.033c0,0,0,1.431,0,1.321c-1.038,0.535-1.513,1.259-1.488,1.971v1.489 c-0.049,0.702,0.381,1.414,1.315,1.952c1.767,1.018,4.623,1.023,6.379,0.012c0.935-0.539,1.36-1.256,1.295-1.964V15.479z"
    />
    <path
      fill="#BE1E2D"
      d="M20.995,15.421v1.519c0.065,0.707-0.36,1.425-1.295,1.964c-1.756,1.011-4.612,1.006-6.379-0.012 c-0.934-0.538-1.364-1.25-1.315-1.952v-1.535c0.004,0.665,0.432,1.331,1.315,1.839c1.767,1.018,4.623,1.023,6.379,0.012 C20.578,16.75,20.998,16.086,20.995,15.421z M20.995,8.606c0.013,2.387-5.004,3.362-7.675,1.823 c-0.883-0.509-1.311-1.175-1.315-1.839v1.535l0,0c-0.045,0.645,0.3,1.414,1.488,2.033v1.782h0.006 c-0.015,0.456,0.275,0.916,0.881,1.265c1.178,0.679,3.082,0.682,4.253,0.008c0.607-0.35,0.891-0.813,0.866-1.273h0.009v-1.761 c1.201-0.619,1.548-1.395,1.488-2.054l0,0V8.606z"
    />
    <path
      fill="#72C0AB"
      d="M15.5,19.583v2.15h0.002c0,0,0.997,0.117,0.998,0.117c0.001-0.001,0.999-0.117,1-0.117v-2.15 c-0.389-0.005-0.881-0.005-1.463-0.005C15.857,19.58,15.678,19.58,15.5,19.583z"
    />
    <path
      fill="#569080"
      d="M16.037,19.631c0.582,0.005,1.074,0.006,1.463,0.006v-0.05 C17.019,19.59,16.527,19.6,16.037,19.631z"
    />
  </svg>
);

// Edit Icon
export const EditIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M16.4745 5.40801L18.5917 7.52524M17.8358 3.54289L12.1086 9.27005C11.8131 9.56562 11.6116 9.94206 11.5296 10.3519L11 13L13.6481 12.4704C14.0579 12.3884 14.4344 12.1869 14.7299 11.8914L20.4571 6.16423C21.181 5.44037 21.181 4.26676 20.4571 3.5429C19.7332 2.81904 18.5596 2.81903 17.8358 3.54289Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 15V18C19 19.1046 18.1046 20 17 20H6C4.89543 20 4 19.1046 4 18V7C4 5.89543 4.89543 5 6 5H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ChevronLeft Icon
export const ChevronLeftIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M15 4L7 12L15 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Back Icon (same as ChevronLeft)
export const BackIcon = ChevronLeftIcon;

// ChevronRight Icon
export const ChevronRightIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M8 4L16 12L8 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Close Icon
export const CloseIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M20 20L4 4.00003M20 4L4.00002 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Menu Icon
export const MenuIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <circle
      cx="12"
      cy="4"
      r="1"
      transform="rotate(90 12 4)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="1"
      transform="rotate(90 12 12)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="20"
      r="1"
      transform="rotate(90 12 20)"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// Hamburger Icon
export const HamburgerIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Bell Icon
export const BellIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Share Icon
export const ShareIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

// ArrowUp Icon
export const ArrowUpIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M4 15L12 7L20 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Schedule Icon
export const ScheduleIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M9 20H6C3.79086 20 2 18.2091 2 16V7C2 4.79086 3.79086 3 6 3H17C19.2091 3 21 4.79086 21 7V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 2V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 8H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 15.6429L17 17.1429"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="17"
      cy="17"
      r="5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Image Icon
export const ImageIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="8.5"
      cy="8.5"
      r="2.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5262 12.6211L6 22H18.1328C20.2686 22 22 20.2686 22 18.1328V18C22 17.5335 21.8251 17.3547 21.5099 17.0108L17.4804 12.615C16.6855 11.7479 15.3176 11.7507 14.5262 12.6211Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Search Icon
export const SearchIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M21 21L16.5143 16.5065M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// LogIn Icon
export const LogInIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);



// SignOut Icon
export const SignOutIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M13 12H22M22 12L18.6667 8M22 12L18.6667 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 7V5.1736C14 4.00352 12.9999 3.08334 11.8339 3.18051L3.83391 3.84717C2.79732 3.93356 2 4.80009 2 5.84027V18.1597C2 19.1999 2.79733 20.0664 3.83391 20.1528L11.8339 20.8195C12.9999 20.9167 14 19.9965 14 18.8264V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Heart Icon
export const HeartIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M7 3C4.23858 3 2 5.21619 2 7.95C2 10.157 2.87466 15.3947 11.4875 20.6903C11.7994 20.8821 12.2006 20.8821 12.5125 20.6903C21.1253 15.3947 22 10.157 22 7.95C22 5.21619 19.7614 3 17 3C14.2386 3 12 6 12 6C12 6 9.76142 3 7 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Article Icon
export const ArticleIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M3 6H12H21M3 12H21M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 모든 아이콘을 하나의 객체로 묶어서 export
export const Icons = {
  Water: WaterIcon,
  Water2: Water2Icon,
  Nutrient: NutrientIcon,
  Nutrient2: Nutrient2Icon,
  Pin: PinIcon,
  Edit: EditIcon,
  Back: BackIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Close: CloseIcon,
  Menu: MenuIcon,
  Hamburger: HamburgerIcon,
  Bell: BellIcon,
  Share: ShareIcon,
  ArrowUp: ArrowUpIcon,
  Schedule: ScheduleIcon,
  Image: ImageIcon,
  Search: SearchIcon,
  login: LogInIcon,
  SignOut: SignOutIcon,
  Heart: HeartIcon,
  Article: ArticleIcon
};
