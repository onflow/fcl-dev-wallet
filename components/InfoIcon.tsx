import useThemeUI from "hooks/useThemeUI"
import React from "react"

function InfoIcon({active}: {active: boolean}) {
  const {theme} = useThemeUI()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
    >
      <path
        stroke={active ? theme.colors.green : theme.colors.gray[500]}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10zM11 15v-4M11 7v-.5"
      ></path>
    </svg>
  )
}

export default InfoIcon
