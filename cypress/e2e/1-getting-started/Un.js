import '@4tw/cypress-drag-drop';

it('should navigate to CQFlow, create a new flow, and add a Start node', () => {
  cy.visit('http://localhost:4201');

  // Click on the CQFlow link
  cy.get('a[href="/flow"]').contains('CQFlow').click();

  // Click on the breast-cancer-screening element
  cy.contains('div', 'breast-cancer-screening', { timeout: 10000 }).click();

  // Wait for the React Flow canvas to be visible
  cy.get('[data-testid="rf__wrapper"]', { timeout: 20000 }).should('be.visible');
