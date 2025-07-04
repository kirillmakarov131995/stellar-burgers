import { INGREDIENT_IDS, SELECTORS } from 'cypress/support/e2e';

describe('constructor', function () {
  this.beforeAll(() => {
    cy.fixture('ingredients.json').then((ingredientsFixture) => {
      cy.intercept('GET', 'api/ingredients', {
        data: ingredientsFixture,
        success: true
      });
    });
  });

  it('Adding and moving Ingredients', function () {
    cy.visit(Cypress.env('testUrl')).then(() => {
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
      cy.getIngredientsBunSelector(INGREDIENT_IDS.id3, 'bottom').should(
        'exist'
      );

      cy.get('@ingredientCard1')
        .find('a')
        .should('exist')
        .as('ingredientCard1Link');

      // open modal win
      cy.get('@ingredientCard1Link').click();
      cy.get(SELECTORS.modalContainer).should('exist').as('modalContainer');

      cy.get('@modalContainer')
        .find(SELECTORS.modal)
        .should('exist')
        .as('modal');

      // // checking whether modal is correct
      cy.get('@modalContainer')
        .find('h3')
        .should('have.text', 'Мини-салат Экзо-Плантаго');
      cy.get('@modalContainer').find(SELECTORS.modalCloseButton).click();
      cy.get('@modal').should('not.exist');

      // // checking modal close by clicking the overlay
      cy.get('@ingredientCard1').should('exist').click();
      cy.get('@modalContainer')
        .find(SELECTORS.modalOverlay)
        .click({ force: true });
      cy.get('@modal').should('not.exist');
    });
  });
});
