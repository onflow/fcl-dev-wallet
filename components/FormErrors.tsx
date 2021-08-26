/** @jsxImportSource theme-ui */
import {Box} from "theme-ui"

export const FieldError = ({children}: {children: React.ReactNode}) => {
  const style = {
    border: "1px solid",
    borderColor: "red.200",
    backgroundColor: "red.100",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    color: "red.200",
    marginTop: "-1px",
    px: "20px",
    py: 3,
    "> a": {
      color: "red.200",
    },
  }

  return <div sx={style}>{children}</div>
}

export default function FormErrors({errors}: {errors: string[]}) {
  return (
    <Box mt={3} mb={4}>
      <FieldError>{errors.join(". ")}</FieldError>
    </Box>
  )
}
