declare namespace Cypress {
  interface Chainable {
    getIngredientCardSelector(id: string): Chainable<JQuery<HTMLElement>>;
    findIngredientsListItemSelector(
      get: string,
      id: string
    ): Chainable<JQuery<HTMLElement>>;
    getIngredientsBunSelector(
      id: string,
      type: 'top' | 'bottom'
    ): Chainable<JQuery<HTMLElement>>;
    fillOrderConstructor(
      bunId: string,
      ingredientsIds: string[]
    ): Chainable<JQuery<HTMLElement>>;
  }
}
