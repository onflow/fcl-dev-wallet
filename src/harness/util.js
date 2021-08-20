export const yup = tag => d => {
  // eslint-disable-next-line no-console
  console.log(`${tag}`, d)
  return d
}

export const nope = tag => d => {
  // eslint-disable-next-line no-console
  console.error(`Oh No!! [${tag}]`, d)
  return d
}
