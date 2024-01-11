import "FCL"

access(all) fun main(): &[FCL.FCLAccount] {
  return FCL.accounts().values
}
