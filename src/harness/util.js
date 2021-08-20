export const yup = tag => d => (console.log(`${tag}`, d), d)
export const nope = tag => d => (console.error(`Oh No!! [${tag}]`, d), d)
