import {paths} from "src/constants"
import {accountA, ACCOUNTS_RESPONSE} from "./authn.spec"

const appLogOutButton = () => cy.get("button").contains("Log Out")
const appMutateButton = () => cy.get("button").contains("Mutate 2 (args)")
const logInButton = () => cy.wallet().find("[data-test='log-in-button']")
const expandCollapseButton = () =>
  cy.wallet().find("[data-test='expand-collapse-button']")
const approveTransactionButton = () =>
  cy.wallet().find("[data-test='approve-transaction-button']")

describe("Authz", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.intercept("POST", paths.apiIsInit, {
      body: true,
      delay: 50,
    })

    cy.intercept("GET", paths.apiAccounts, {
      body: ACCOUNTS_RESPONSE,
      delay: 50,
    })

    cy.intercept("POST", paths.apiAccountUpdate("0x179b6b1cb6755e31"), {
      body: {},
      delay: 50,
    })

    cy.intercept("POST", paths.apiAccountsNew, {
      body: {},
      delay: 50,
    })
  })

  it("Authorizes a transaction", () => {
    cy.intercept("GET", paths.apiAccounts, {
      body: ACCOUNTS_RESPONSE,
      delay: 50,
    })
    appLogOutButton().click()
    appMutateButton().click()
    cy.fclIframeLoaded()

    cy.wallet().should("contain", "FCL Dev Wallet")
    logInButton().last().click()
    cy.wallet().should("contain", "Authorize Transaction")
    cy.wallet().should("contain", accountA.address)

    cy.wallet().should("contain", "expand")
    expandCollapseButton().first().click()
    cy.wallet().should("contain", "collapse")
    expandCollapseButton().click()
    cy.wallet().should("contain", "expand")

    approveTransactionButton().click()

    cy.get("iframe").should("not.exist")
  })
})
