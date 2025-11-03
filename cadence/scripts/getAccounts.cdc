import FCL from 0xFCL

access(all) fun main(): &[FCL.FCLAccount] {
  return FCL.accounts().values
}
