/// <reference types="cypress" />

import { SELECTORS } from './e2e';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('getIngredientCardSelector', (id: string) =>
  cy.get(`[data-ingredient-card-cy='${id}']`)
);
Cypress.Commands.add(
  'findIngredientsListItemSelector',
  (get: string, id: string) =>
    cy.get(get).find(`[data-ingredients-list-item-cy='${id}']`)
);
Cypress.Commands.add(
  'getIngredientsBunSelector',
  (id: string, type: 'top' | 'bottom') =>
    cy.get(
      `[data-ingredients-bun-${type === 'bottom' ? 'bottom' : 'top'}-cy='${id}']`
    )
);
Cypress.Commands.add(
  'fillOrderConstructor',
  (bunId: string, ingredientsIds: string[]) => {
    cy.getIngredientCardSelector(bunId)
      .should('exist')
      .as('ingredientCardBun')
      .find(SELECTORS.typeButton)
      .click();

    ingredientsIds.forEach((ingredientsId, index) => {
      cy.getIngredientCardSelector(ingredientsId)
        .should('exist')
        .as(`ingredientCard${index + 1}`)
        .find(SELECTORS.typeButton)
        .click();
    });
  }
);
