describe('constructor', function () {
  it('Adding and moving Ingredients', function () {
    cy.fixture('ingredients.json').then((ingredientsFixture) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        data: ingredientsFixture,
        success: true
      });
    });

    cy.visit('http://localhost:4000');

    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa0949]`)
      .find('button[type="button"]')
      .click();

    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa0943]`)
      .find('button[type="button"]')
      .click();

    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa093c]`)
      .find('button[type="button"]')
      .click();

    cy.get(`[data-cy='ingredients-list']`).find(
      `[data-ingredients-list-item-cy='643d69a5c3f7b9001cfa0949']`
    );
    cy.get(`[data-cy='ingredients-list']`).find(
      `[data-ingredients-list-item-cy='643d69a5c3f7b9001cfa0943']`
    );
    cy.get(`[data-ingredients-bun-top-cy='643d69a5c3f7b9001cfa093c']`);
    cy.get(`[data-ingredients-bun-bottom-cy='643d69a5c3f7b9001cfa093c']`);

    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa0949]`).find('a');

    // modal
    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa0949]`).click();

    cy.get('#modals').find(`[data-cy='modal']`);

    cy.get('#modals')
      .find('h3')
      .should('have.text', 'Мини-салат Экзо-Плантаго');
    cy.get('#modals').find(`[data-cy='modal-close-button']`).click();
    cy.get('#modals').find('div').should('have.length', 0);

    cy.get(`[data-ingredient-card-cy=643d69a5c3f7b9001cfa0949]`).click();
    cy.get('#modals').find(`[data-cy='modal-overlay']`).click({ force: true });
  });
});
