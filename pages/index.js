export default function Page() {
  return <div>...</div>
}

export async function getServerSideProps(ctx) {
  return {
    redirect: {
      destination: "/accounts",
      permanent: false,
    },
  }
}
