import { AUTH_DATA, INGREDIENT_IDS, SELECTORS } from 'cypress/support/e2e';

describe('Order', function () {
  before(() => {
    cy.fixture('ingredients.json')
      .then((ingredientsFixture) => {
        cy.intercept('GET', 'api/ingredients', {
          data: ingredientsFixture,
          success: true
        });
      })
      .as('fetchIngredients');
    cy.fixture('user.json').then((userData) => {
      cy.intercept('POST', 'api/auth/login', {
        user: userData,
        success: true
      });

      cy.intercept('GET', 'api/auth/user', {
        user: userData,
        success: true
      });
    });

    cy.intercept('POST', 'api/auth/token', {
      accessToken: AUTH_DATA.accessToken,
      refreshToken: AUTH_DATA.refreshToken,
      success: true
    });

    cy.fixture('order.json').then((orderData) => {
      cy.intercept('POST', 'api/orders', {
        success: true,
        ...orderData
      }).as('postOrder');
    });
  });

  beforeEach(() => {
    cy.setCookie('accessToken', AUTH_DATA.accessToken);
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', AUTH_DATA.refreshToken);
    });
  });

  after(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('making an order', () => {
    cy.visit(Cypress.env('testUrl'));

    cy.wait('@fetchIngredients');

    cy.fillOrderConstructor(INGREDIENT_IDS.id3, [
      INGREDIENT_IDS.id1,
      INGREDIENT_IDS.id2
    ]);

    cy.get(SELECTORS.ingredientsList).should('exist').as('ingredientsList');
    cy.findIngredientsListItemSelector(
      '@ingredientsList',
      INGREDIENT_IDS.id1
    ).should('exist');
    cy.findIngredientsListItemSelector(
      '@ingredientsList',
      INGREDIENT_IDS.id2
    ).should('exist');

    cy.getIngredientsBunSelector(INGREDIENT_IDS.id3, 'top').should('exist');
    cy.getIngredientsBunSelector(INGREDIENT_IDS.id3, 'bottom').should('exist');

    cy.get(SELECTORS.makeOrderButton).should('exist').click({ force: true });

    cy.wait('@postOrder');

    cy.get(SELECTORS.modal).should('be.visible').as('modal1');
    cy.get('@modal1').find('h3').should('contain', 'Оформляем заказ...');
    cy.get('@modal1').should('not.exist');

    cy.get(SELECTORS.modal).should('be.visible').as('modal2');
    cy.get('@modal2').find('h2').should('contain', '83301');

    cy.get('@modal2').find(SELECTORS.modalCloseButton).click();
    cy.get('@modal2')
      .should('not.exist')
      .then(() => {
        cy.get(`[data-ingredients-bun-top-cy='empty']`).should('exist');
        cy.get(`[data-ingredients-bun-bottom-cy='empty']`).should('exist');
        cy.get(`[data-cy='ingredients-list-empty']`).should('exist');
      });
  });
});
