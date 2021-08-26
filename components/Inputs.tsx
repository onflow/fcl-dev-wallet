/** @jsxImportSource theme-ui */
import {FieldError} from "components/FormErrors"
import Label from "components/Label"
import {FieldProps} from "formik"
import {Input, ThemeUICSSObject, Theme} from "theme-ui"

type CustomFieldProps = FieldProps & {
  inputLabel: string
  disabled?: boolean
  required?: boolean
  sx?: ThemeUICSSObject
}

const errorInputStyles = {
  border: "1px solid",
  borderColor: "red.200",
  color: "red.200",
  outlineColor: "red.200",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  "&:focus, &:focus-visible": {
    outline: "none",
    boxShadow: (theme: Theme) =>
      `inset 0 0 0 1pt ${theme.colors?.red ? ["200"] : ""}`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}

export const CustomInputComponent = ({
  field,
  form: {touched, errors},
  inputLabel,
  required = false,
  sx = {},
  ...props
}: CustomFieldProps) => {
  const showError = touched[field.name] && errors[field.name]

  return (
    <>
      <Label required={required}>{inputLabel}</Label>
      <Input
        width="100%"
        {...field}
        {...props}
        sx={showError ? {...sx, ...errorInputStyles} : sx}
      />
      {showError && <FieldError>{errors[field.name]}</FieldError>}
    </>
  )
}
