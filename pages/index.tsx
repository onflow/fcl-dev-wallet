export default function Page() {
  return <div>...</div>
}

export async function getStaticProps() {
  return {
    redirect: {
      destination: "/accounts",
      permanent: false,
    },
  }
}
