import "cypress-iframe"

Cypress.Commands.add("fclIframeLoaded", () => cy.frameLoaded("#FCL_IFRAME"))
Cypress.Commands.add("wallet", () =>
  cy.iframe("#FCL_IFRAME").find("[data-test='dev-wallet']")
)
