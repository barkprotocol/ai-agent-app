import type { FC } from "react"

interface LogoProps {
  className?: string
}

export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="16" fill="#DBCFC7" />
      <path
        d="M9 11.5C9 10.6716 9.67157 10 10.5 10H21.5C22.3284 10 23 10.6716 23 11.5V20.5C23 21.3284 22.3284 22 21.5 22H10.5C9.67157 22 9 21.3284 9 20.5V11.5Z"
        fill="black"
      />
      <path
        d="M13 14.5C13 13.6716 13.6716 13 14.5 13H17.5C18.3284 13 19 13.6716 19 14.5V17.5C19 18.3284 18.3284 19 17.5 19H14.5C13.6716 19 13 18.3284 13 17.5V14.5Z"
        fill="#DBCFC7"
      />
    </svg>
  )
}

