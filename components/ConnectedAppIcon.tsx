/** @jsxImportSource theme-ui */

const styles = {
  image: {
    borderRadius: 65,
    width: 65,
  },
}

export default function ConnectedAppIcon({icon}: {icon?: string}) {
  const appIcon = icon || "/missing-app-icon.svg"
  return (
    <img
      src={appIcon}
      sx={styles.image}
      title={icon ? undefined : "Missing app icon"}
    />
  )
}
