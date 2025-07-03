// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

export const INGREDIENT_IDS = {
  id1: '643d69a5c3f7b9001cfa0949',
  id2: '643d69a5c3f7b9001cfa0943',
  id3: '643d69a5c3f7b9001cfa093c'
};

export const SELECTORS = {
  ingredientsList: `[data-cy='ingredients-list']`,
  modalContainer: '[data-cy="modalContainer"]',
  modal: `[data-cy='modal']`,
  modalCloseButton: `[data-cy='modal-close-button']`,
  modalOverlay: `[data-cy='modal-overlay']`,
  typeButton: 'button[type="button"]',
  makeOrderButton: `[data-cy='make-order-button']`
};

export const AUTH_DATA = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: '25662f89-75e6-4e73-9391-757f0f14f4f6'
};
