export default function Page() {
  return <div></div>
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/accounts",
      permanent: false,
    },
  }
}
