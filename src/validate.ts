import * as yup from "yup"
import {LABEL_MISSING_ERROR} from "./constants"

const updateAccountSchemaClientShape = {
  label: yup.string().required(LABEL_MISSING_ERROR),
}

export const updateAccountSchemaClient = yup
  .object()
  .shape(updateAccountSchemaClientShape)
