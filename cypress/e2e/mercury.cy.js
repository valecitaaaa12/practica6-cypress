// ============================================================
// Práctica 6 - Automatización con Cypress
// Sitio alternativo 2 (plan de pruebas light "NetWork Tours"):
//   https://demo.guru99.com/test/newtours/
// 11 casos del plan.
// Integrantes: Natalia Valda - Maximiliano Turdera
const site = 'https://demo.guru99.com/test/newtours';

function searchFlight(roundTrip) {
  cy.visit(`${site}/reservation.php`);
  cy.title().should('include', 'Find a Flight');
  cy.get(`input[name="tripType"][value="${roundTrip ? 'roundtrip' : 'oneway'}"]`).check();
  cy.get('select[name="passCount"]').select('1');
  cy.get('select[name="fromPort"]').select('London');
  cy.get('select[name="toPort"]').select('New York');
  cy.get('select[name="fromMonth"]').select('May');
  cy.get('select[name="fromDay"]').select('10');
  cy.get('select[name="toMonth"]').select('May');
  cy.get('select[name="toDay"]').select('20');
  cy.get('input[name="servClass"][value="Coach"]').check();
  cy.get('select[name="airline"]').select('No Preference');
  cy.get('input[name="findFlights"]').click();
  cy.url().should('include', 'reservation2.php');
  cy.contains(/select a flight|flight/i).should('be.visible');
}

describe('Mercury Tours - 11 casos del plan', () => {
  it('Caso 1: valida la portada y sus accesos principales', () => {
    cy.visit(`${site}/`);
    cy.title().should('eq', 'Welcome: Mercury Tours');
    cy.contains('a', 'Home').should('be.visible');
    cy.contains('a', 'Flights').should('be.visible');
    cy.contains('a', 'REGISTER').should('be.visible');
    cy.get('input[name="userName"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('Caso 2: registra un nuevo usuario', () => {
    const user = `pepito123${Date.now()}`;
    cy.visit(`${site}/register.php`);
    cy.get('input[name="firstName"]').type('Pepito');
    cy.get('input[name="lastName"]').type('Pruebas');
    cy.get('input[name="phone"]').type('3055550101');
    cy.get('input[name="userName"]').type(`${user}@example.com`);
    cy.get('input[name="address1"]').type('123 Cypress Street');
    cy.get('input[name="city"]').type('Miami');
    cy.get('input[name="state"]').type('Florida');
    cy.get('input[name="postalCode"]').type('33101');
    cy.get('select[name="country"]').select('UNITED STATES');
    cy.get('input[name="email"]').type(user);
    cy.get('input[name="password"]').type('Cypress2026!');
    cy.get('input[name="confirmPassword"]').type('Cypress2026!');
    cy.get('input[name="submit"]').click();
    cy.contains('Dear Pepito Pruebas').should('be.visible');
    cy.contains(user).should('be.visible');
  });

  it('Caso 3: registra vuelo de ida', () => searchFlight(false));
  it('Caso 4: registra vuelo de ida y vuelta', () => searchFlight(true));

  [
    ['Caso 5', 'Hotels', 'support.php', 'Under Construction'],
    ['Caso 6', 'Car Rentals', 'support.php', 'Under Construction'],
    ['Caso 7', 'Cruises', 'index.php', 'Welcome: Mercury Tours'],
    ['Caso 8', 'Destinations', 'support.php', 'Under Construction'],
    ['Caso 9', 'Vacations', 'support.php', 'Under Construction'],
    ['Caso 10', 'SUPPORT', 'support.php', 'Under Construction'],
    ['Caso 11', 'CONTACT', 'support.php', 'Under Construction'],
  ].forEach(([number, label, path, title]) => {
    it(`${number}: valida la navegación de ${label}`, () => {
      cy.visit(`${site}/`);
      cy.contains('a', new RegExp(`^${label}$`, 'i')).first().click();
      cy.url().should('include', path);
      cy.title().should('include', title);
      if (path === 'support.php') {
        cy.contains('This section of our web site is currently under construction').should('be.visible');
      }
    });
  });
});
