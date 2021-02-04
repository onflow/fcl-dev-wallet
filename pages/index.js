export default function Page() {
  return <div>...</div>
}

export async function getStaticProps(ctx) {
  return {
    redirect: {
      destination: "/accounts",
      permanent: false,
    },
  }
}
