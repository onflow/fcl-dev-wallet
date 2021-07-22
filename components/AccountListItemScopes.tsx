/** @jsxImportSource theme-ui */
import Button from "components/Button"
import Switch from "components/Switch"
import useAppContext from "hooks/useAppContext"
import {Label, Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  headingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
}

export default function AccountsListItemScopes({
  scopes,
  setScopes,
  onEditAccount,
  showManageAccount = true,
  compact = false,
}: {
  scopes: Set<string>
  setScopes: (newScopes: Set<string>) => void
  onEditAccount: () => void
  showManageAccount?: boolean
  compact?: boolean
}) {
  const {appScopes} = useAppContext()

  const toggleScope = (scope: string) => {
    scopes.has(scope) ? scopes.delete(scope) : scopes.add(scope)
    setScopes(scopes)
  }

  return (
    <div id="scopes">
      <div sx={{...styles.headingContainer, height: compact ? 30 : 40}}>
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
      <Themed.hr sx={{mt: 0, mb: compact ? 1 : 3}} />
      {appScopes.map(scope => (
        <div key={scope}>
          <div sx={{...styles.scope, paddingBottom: compact ? 1 : 3}}>
            <Label htmlFor={`scope-${scope}`} sx={styles.label}>
              {scope}
            </Label>
            <div sx={{display: "inline-flex"}}>
              <Switch
                size="lg"
                id={`scope-${scope}`}
                defaultChecked={scopes.has(scope)}
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
