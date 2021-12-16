/** @jsxImportSource theme-ui */
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
}

export default function AccountSectionHeading({
  compact,
  children,
}: {
  compact?: boolean
  children: React.ReactNode
}) {
  return (
    <div sx={{...styles.headingContainer, height: compact ? 30 : 40}}>
      <div sx={styles.heading}>{children}</div>
    </div>
  )
}
