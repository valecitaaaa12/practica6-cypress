// ============================================================
// Práctica 6 - Automatización con Cypress
// Asignatura: SQA 2025-4
// Integrantes: Natalia Valda - Maximiliano Turdera
// Sitio principal (PDF "Automatizacion Cypress SQA 2025-4"):
//   http://www.testingyes.com/onlineshop/
// Casos 1 a 5 del PDF (validación de portada, registro,
// compras de ropa/accesorio/arte y cierre de sesión).
// Se genera un correo distinto en cada ejecución; el resto de datos es fijo.
const shop = 'http://testingyes.com/onlineshop';
const customer = {
  firstName: 'Testing',
  lastName: 'Cypress',
  password: 'Cypress2026!',
  email: `sqa.cypress.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`,
};

function registerCustomer() {
  cy.visit(`${shop}/login?create_account=1`);
  cy.get('#customer-form').should('be.visible');
  cy.get('#field-firstname').type(customer.firstName);
  cy.get('#field-lastname').type(customer.lastName);
  cy.get('#field-email').type(customer.email);
  cy.get('#field-password').type(customer.password);
  cy.get('#customer-form input[name="customer_privacy"]').check({ force: true });
  cy.get('#customer-form input[name="psgdpr"]').check({ force: true });
  cy.get('#customer-form button[type="submit"]').click();
  cy.get('#_desktop_user_info .account').should('contain.text', customer.firstName);
}

function chooseProduct(categoryPath, categoryName) {
  cy.visit(`${shop}/${categoryPath}`);
  cy.get('h1').should('contain.text', categoryName);
  cy.get('#js-product-list .product-title a').first().click();
  cy.get('h1').invoke('text').then((heading) => {
    const productName = heading.trim();
    if (categoryPath === '3-clothes') {
      cy.get('select[name="group[1]"]').select('M');
      cy.get('input[name="group[2]"][title="Black"]').check({ force: true });
    }
    cy.get('#add-to-cart-or-refresh .add-to-cart').should('be.enabled').click();
    cy.get('#blockcart-modal').should('be.visible').and('contain.text', 'Product successfully added');
    cy.get('#blockcart-modal .cart-content-btn a.btn-primary').click();
    cy.get('.cart-items').should('contain.text', productName);
  });
}

function finishCheckout() {
  cy.get('.cart-summary a[href*="order"], .checkout a[href*="order"]').first().click();
  cy.url().should('include', '/order');

  cy.get('body').then(($body) => {
    if ($body.find('#checkout-personal-information-step button[name="continue"]:visible').length) {
      cy.get('#checkout-personal-information-step button[name="continue"]').click();
    }
  });

  cy.get('#checkout-addresses-step').should('be.visible');
  cy.get('body').then(($body) => {
    if ($body.find('#checkout-addresses-step input[name="address1"]:visible').length) {
      cy.get('#checkout-addresses-step input[name="address1"]').type('123 Cypress Street');
      cy.get('#checkout-addresses-step input[name="city"]').type('Miami');
      cy.get('#checkout-addresses-step input[name="postcode"]').type('33101');
      cy.get('#checkout-addresses-step select[name="id_country"]').select('United States');
      cy.get('body').then(($updated) => {
        if ($updated.find('#checkout-addresses-step select[name="id_state"]:visible').length) {
          cy.get('#checkout-addresses-step select[name="id_state"]').select('Florida');
        }
      });
    }
  });
  cy.get('#checkout-addresses-step button[name="confirm-addresses"]').click();
  cy.get('#checkout-delivery-step').should('be.visible');
  cy.get('#checkout-delivery-step button[name="confirmDeliveryOption"]').click();
  cy.get('#checkout-payment-step').should('be.visible');
  cy.get('#checkout-payment-step input[name="payment-option"]').first().check({ force: true });
  cy.get('#conditions-to-approve input[type="checkbox"]').check({ force: true });
  cy.get('#payment-confirmation button[type="submit"]').click();
  cy.contains('h3, h1', /your order is confirmed/i).should('be.visible');
  cy.url().should('include', 'order-confirmation');
}

describe('Testing Yes / tienda online - casos del PDF', () => {
  it('Caso 1: valida al menos cinco elementos de la portada', () => {
    cy.visit(`${shop}/`);
    cy.title().should('include', 'My e-commerce');
    cy.get('#_desktop_logo').should('be.visible');
    cy.get('#category-3').should('contain.text', 'Clothes');
    cy.get('#category-6').should('contain.text', 'Accessories');
    cy.get('#category-9').should('contain.text', 'Art');
    cy.get('#search_widget input[type="text"]').should('exist');
    cy.get('footer').should('be.visible');
  });

  it('Casos 2 a 5: registra, compra ropa/accesorio/arte y cierra sesión', () => {
    registerCustomer();

    [
      ['3-clothes', 'Clothes'],
      ['6-accessories', 'Accessories'],
      ['9-art', 'Art'],
    ].forEach(([path, name]) => {
      cy.log(`Compra satisfactoria: ${name}`);
      chooseProduct(path, name);
      finishCheckout();
    });

    cy.get('#_desktop_user_info .logout').should('be.visible').click();
    cy.get('#_desktop_user_info a').should('be.visible').and('contain.text', 'Sign in');
    cy.get('#_desktop_user_info .account').should('not.exist');
  });
});
