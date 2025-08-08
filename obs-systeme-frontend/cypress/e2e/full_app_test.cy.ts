describe('OBS SYSTEME Full Application Test Suite', () => {
  before(() => {
    cy.visit('/');
  });

  it('Loads the main page and checks header', () => {
    cy.contains('OBS SYSTEME');
    cy.get('header').should('exist');
  });

  it('Tests user authentication flow', () => {
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.contains('Dashboard');
  });

  it('Navigates to POS and creates a sale', () => {
    cy.contains('Point de Vente').click();
    cy.url().should('include', '/pos');
    cy.get('button').contains('Ajouter un produit').click();
    cy.get('input[name="productSearch"]').type('Produit Test');
    cy.get('.product-list-item').first().click();
    cy.get('button').contains('Valider la vente').click();
    cy.contains('Vente créée avec succès');
  });

  it('Checks stock management', () => {
    cy.contains('Stock').click();
    cy.url().should('include', '/stock');
    cy.get('.stock-item').should('have.length.greaterThan', 0);
  });

  it('Tests multi-tenant selector', () => {
    cy.contains('Sélecteur de secteurs').click();
    cy.get('.tenant-selector').should('exist');
    cy.get('.tenant-selector option').should('have.length.greaterThan', 1);
  });

  it('Tests API endpoints with error handling', () => {
    cy.request({
      method: 'POST',
      url: '/api/sales',
      failOnStatusCode: false,
      body: { invalid: 'data' },
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 422]);
    });
  });

  it('Logs out user', () => {
    cy.contains('Déconnexion').click();
    cy.url().should('include', '/login');
  });
});
