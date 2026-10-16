// ============================================================
// Práctica 6 - Automatización con Cypress
// Sitio alternativo 1 (plan de pruebas light "Automation Exercise"):
//   https://automationexercise.com/
// Historias BD001 - BD005.
// Integrantes: Natalia Valda - Maximiliano Turdera
const site = 'https://automationexercise.com';
const email = `sqa.cypress.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
const fullName = 'Testing Cypress';

describe('Automation Exercise - historias BD001 a BD005', () => {
  it('BD005: muestra el catálogo y permite buscar un artículo', () => {
    cy.visit(`${site}/products`);
    cy.get('.features_items').should('be.visible').and('contain.text', 'All Products');
    cy.get('.features_items .product-image-wrapper').its('length').should('be.greaterThan', 0);
    cy.get('#search_product').type('Blue Top');
    cy.get('#submit_search').click();
    cy.get('.features_items').should('contain.text', 'Searched Products');
    cy.get('.features_items .product-image-wrapper').should('contain.text', 'Blue Top');
  });

  it('BD001-BD004: registra usuario, valida Home, compra y comprueba el carrito', () => {
    cy.visit(`${site}/login`);
    cy.get('[data-qa="signup-name"]').type(fullName);
    cy.get('[data-qa="signup-email"]').type(email);
    cy.get('[data-qa="signup-button"]').click();
    cy.contains('h2', 'Enter Account Information').should('be.visible');
    cy.get('[data-qa="password"]').type('Cypress2026!');
    cy.get('[data-qa="days"]').select('10');
    cy.get('[data-qa="months"]').select('May');
    cy.get('[data-qa="years"]').select('1995');
    cy.get('[data-qa="first_name"]').type('Testing');
    cy.get('[data-qa="last_name"]').type('Cypress');
    cy.get('[data-qa="address"]').type('123 Cypress Street');
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Florida');
    cy.get('[data-qa="city"]').type('Miami');
    cy.get('[data-qa="zipcode"]').type('33101');
    cy.get('[data-qa="mobile_number"]').type('3055550101');
    cy.get('[data-qa="create-account"]').click();
    cy.contains('h2', 'Account Created!').should('be.visible');
    cy.get('[data-qa="continue-button"]').click();

    // BD002: el sitio muestra el usuario autenticado en Home. No publica
    // una pantalla de edición de perfil; se verifica la información visible.
    cy.contains('a', 'Logged in as').should('contain.text', fullName);
    cy.get('a[href="/"]').first().click();
    cy.contains('a', 'Logged in as').should('contain.text', fullName);

    cy.visit(`${site}/product_details/1`);
    cy.get('.product-information h2').invoke('text').then((productName) => {
      cy.get('#quantity').clear().type('2');
      cy.get('.product-information button.cart').click();
      cy.get('#cartModal').should('be.visible').and('contain.text', 'Added!');
      cy.get('#cartModal a[href="/view_cart"]').click();
      cy.get('#cart_info').should('contain.text', productName.trim());
      cy.get('#cart_info .cart_quantity').should('contain.text', '2');
      cy.get('#cart_info .cart_total').should('contain.text', 'Rs.');
    });

    cy.contains('a', 'Proceed To Checkout').click();
    cy.get('#address_delivery').should('contain.text', 'Testing Cypress');
    cy.get('#cart_info').should('contain.text', 'Blue Top');
    cy.contains('a', 'Place Order').click();
    cy.get('[data-qa="name-on-card"]').type(fullName);
    cy.get('[data-qa="card-number"]').type('4111111111111111');
    cy.get('[data-qa="cvc"]').type('123');
    cy.get('[data-qa="expiry-month"]').type('12');
    cy.get('[data-qa="expiry-year"]').type('2030');
    cy.get('[data-qa="pay-button"]').click();
    cy.contains('h2', 'Order Placed!').should('be.visible');
  });
});
