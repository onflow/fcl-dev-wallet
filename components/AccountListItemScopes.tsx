/** @jsxImportSource theme-ui */
import Button from "components/Button"
import Switch from "components/Switch"
import React, {SetStateAction} from "react"
import {ScopesObj} from "src/accountAuth"
import {Label, Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  headingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  heading: {
    textTransform: "uppercase",
    color: "gray.400",
    fontWeight: "normal",
    fontSize: 0,
    letterSpacing: "0.05em",
  },
  editAccountButton: {margin: 0, padding: 0},
  label: {textTransform: "capitalize", margin: 0},
  scope: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 3,
  },
}

export default function AccountsListItemScopes({
  scopesObj,
  setScopesObj,
  onEditAccount,
  showManageAccount = true,
}: {
  scopesObj: ScopesObj
  setScopesObj: React.Dispatch<SetStateAction<ScopesObj>>
  onEditAccount: () => void
  showManageAccount?: boolean
}) {
  const toggleScope = (scope: string) =>
    setScopesObj(prev => ({...prev, [scope]: !prev[scope]}))

  return (
    <div id="scopes">
      <div sx={styles.headingContainer}>
        <div sx={styles.heading}>Scopes</div>
        {showManageAccount && (
          <Button
            variant="link"
            size="xs"
            onClick={onEditAccount}
            sx={styles.editAccountButton}
          >
            Manage Account
          </Button>
        )}
      </div>
      <Themed.hr sx={{mt: 0, mb: 3}} />
      {Object.keys(scopesObj).map(scope => (
        <div key={scope}>
          <div sx={styles.scope}>
            <Label htmlFor={`scope-${scope}`} sx={styles.label}>
              {scope}
            </Label>
            <div sx={{display: "inline-flex"}}>
              <Switch
                size="lg"
                id={`scope-${scope}`}
                defaultChecked={scopesObj[scope]}
                onClick={() => toggleScope(scope)}
                aria-checked="true"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
