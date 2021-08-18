/** @jsxImportSource theme-ui */
import useAuthzContext from "hooks/useAuthzContext"
import {Flex} from "theme-ui"
import Button from "./Button"

export default function ExpandCollapseButton({onClick}: {onClick: () => void}) {
  const {isExpanded} = useAuthzContext()

  return (
    <Button
      variant="link"
      size="xs"
      onClick={onClick}
      data-test="expand-collapse-button"
    >
      {isExpanded ? "collapse" : "expand"}
      <Flex ml={2} sx={{alignItems: "center", justifyContent: "center"}}>
        <img src={`/${isExpanded ? "collapse" : "expand"}.svg`} />
      </Flex>
    </Button>
  )
}
