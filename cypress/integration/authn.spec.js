import {paths} from "src/constants"

export const accountA = {
  type: "ACCOUNT",
  address: "0x179b6b1cb6755e31",
  keyId: 0,
  label: "Account A",
  scopes: [],
}

export const ACCOUNTS_RESPONSE = [
  {
    type: "ACCOUNT",
    address: "0xf8d6e0586b0a20c7",
    keyId: 0,
    label: "Service Account",
    scopes: ["email"],
  },
  accountA,
]
const newLabel = "New Account Label"
const EDITED_ACCOUNTS_RESPONSE = [
  {
    type: "ACCOUNT",
    address: "0xf8d6e0586b0a20c7",
    keyId: 0,
    label: "Service Account",
    scopes: [],
  },
  {
    type: "ACCOUNT",
    address: "0x179b6b1cb6755e31",
    keyId: 0,
    label: newLabel,
    scopes: ["email"],
  },
]

const loggedInText = '"loggedIn": true'
const loggedInEmailText = "@example.com"
const appLogInButton = () => cy.get("button").contains("Log In")
const appLogOutButton = () => cy.get("button").contains("Log Out")
const createAccountButton = () => cy.wallet().find("[data-test='plus-button']")
const logInButton = () => cy.wallet().find("[data-test='log-in-button']")
const expandAccountButtons = () =>
  cy.wallet().find("[data-test='expand-account-button']")
const accountScopeSwitch = () =>
  cy.wallet().find("[data-test='account-scope-switch']")
const accountScopeSwitchInput = () => cy.wallet().find("input#scope-email")

describe("Authn", () => {
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

  it("Creates an account", () => {
    appLogInButton().click()
    cy.fclIframeLoaded()

    cy.wallet().should("contain", "FCL Dev Wallet")
    cy.wallet().should("not.contain", newLabel)

    createAccountButton().click()

    cy.intercept("GET", paths.apiAccounts, {
      body: ACCOUNTS_RESPONSE,
      delay: 50,
    })

    cy.intercept("GET", paths.apiAccounts, {
      body: EDITED_ACCOUNTS_RESPONSE,
      delay: 50,
    })

    cy.wallet().find("input[name='label']").clear().type(newLabel)
    accountScopeSwitch().click()

    cy.wallet().find("button[type='submit']").click()
    cy.wallet().should("contain", newLabel)

    expandAccountButtons().last().click()
    accountScopeSwitchInput().should("be.checked")
  })

  it("Updates an account", () => {
    appLogInButton().click()
    cy.fclIframeLoaded()

    cy.wallet().should("contain", "FCL Dev Wallet")
    cy.wallet().should("not.contain", newLabel)

    cy.wallet()
      .find("[data-test='log-in-button']")
      .should("contain", "Account A")

    expandAccountButtons().first().click()
    accountScopeSwitchInput().should("be.checked")
    expandAccountButtons().first().click()

    cy.wallet().find("[data-test='manage-account-button']").last().click()

    cy.intercept("GET", paths.apiAccounts, {
      body: ACCOUNTS_RESPONSE,
      delay: 50,
    })

    cy.intercept("GET", paths.apiAccounts, {
      body: EDITED_ACCOUNTS_RESPONSE,
      delay: 50,
    })

    cy.wallet().find("input[name='label']").clear().type(newLabel)
    accountScopeSwitch().click()

    cy.wallet().find("button[type='submit']").click()
    cy.wallet().should("contain", newLabel)

    expandAccountButtons().last().click()
    accountScopeSwitchInput().should("be.checked")
  })

  it("Logs in and out", () => {
    cy.get("body").should("not.contain", loggedInText)

    appLogInButton().click()
    cy.fclIframeLoaded()

    logInButton().last().click()
    cy.get("body").should("contain", loggedInText)
    cy.get("body").should("not.contain", loggedInEmailText)

    appLogOutButton().click()
    cy.get("body").should("not.contain", loggedInText)
  })

  it("Logs in with email scope", () => {
    cy.get("body").should("not.contain", loggedInEmailText)

    appLogInButton().click()
    cy.fclIframeLoaded()

    logInButton().last().click()
    cy.get("body").should("not.contain", loggedInEmailText)

    appLogInButton().click()
    cy.fclIframeLoaded()

    expandAccountButtons().last().click()
    accountScopeSwitch().click()
    logInButton().last().click()

    cy.get("body").should("contain", loggedInEmailText)
  })
})
