describe('Order', function () {
  it('making an order', () => {
    cy.fixture('user.json').then((data) => {
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
        user: data,
        success: true
      });
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
        user: data,
        success: true
      });
    });
    cy.fixture('order.json').then((data) => {
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
        success: true,
        ...data
      });
    });
    cy.setCookie(
      'accessToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
    cy.window().then((win) => {
      win.localStorage.setItem(
        'refreshToken',
        '25662f89-75e6-4e73-9391-757f0f14f4f6'
      );
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

    cy.get(`[data-cy='make-order-button']`).click();

    cy.get(`[data-cy='make-order-button']`).click();

    cy.get('#modals').find(`[data-cy='modal']`);

    cy.get('#modals').find('h2').should('have.text', '83301');

    cy.get('#modals').find(`[data-cy='modal-close-button']`).click();
    cy.get('#modals').find('div').should('have.length', 0);

    cy.get(`[data-ingredients-bun-top-cy='empty']`);
    cy.get(`[data-ingredients-bun-top-cy='empty']`);
    cy.get(`[data-cy='ingredients-list-empty']`);

    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });
});
