import useThemeUI from "hooks/useThemeUI"
import React from "react"

function CaretIcon({up, active}: {up: boolean; active: boolean}) {
  const {theme} = useThemeUI()
  const d = up
    ? "M8.825 6.842L5 3.025 1.175 6.842 0 5.667l5-5 5 5-1.175 1.175z"
    : "M8.825.158L5 3.975 1.175.158 0 1.333l5 5 5-5L8.825.158z"
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="7"
      fill="none"
      viewBox="0 0 10 7"
    >
      <path
        fill={active ? theme.colors.blue : theme.colors.black}
        fillRule="evenodd"
        d={d}
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export default CaretIcon
