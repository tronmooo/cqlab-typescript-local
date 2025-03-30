import '@4tw/cypress-drag-drop';

it('should navigate to CQFlow, create a new flow, and add a Start node', () => {
  cy.visit('http://localhost:4201');
/* 
  // Click on the CQFlow link
  cy.get('a[href="/flow"]').contains('CQFlow').click();

  // Click on the breast-cancer-screening element
  cy.contains('div', 'breast-cancer-screening', { timeout: 10000 }).click();

  // Click on the breast-cancer-screening element
  cy.contains('div', 'Flow Implementation', { timeout: 10000 }).click()
  cy.get('button[role="tab"]').contains('Launch').click();
  cy.get('.MuiToggleButtonGroup-lastButton').click();
  cy.get('button[aria-pressed="false"]').contains('Yes').click();
  cy.get('button.MuiButton-containedInfo').contains('Reset').click();

*/
 // Click on the CQFlow link
 /*
 cy.get('a[href="/define"]').contains('CQDefine').click();
 cy.contains('div', 'Is Female').click();
 cy.get('div[role="combobox"]').contains('Choose Patient').click();
 cy.get('li[data-value="needs_breast_cancer_screening"]').click();
 cy.get('div.MuiBox-root.css-69snf1').find('button').click();
 cy.contains('div', 'Is over 18 years old').click();
 cy.get('div.MuiBox-root.css-69snf1').find('button').click();
 cy.contains('div', 'Get cholesterol reading').click();
 cy.get('div[role="combobox"]').click();
 cy.get('li[data-value="high_cholesterol"]').click();
 cy.get('div.MuiBox-root.css-69snf1').find('button').click();


cy.contains('div', 'CQVocabulary').click();
cy.get('button[role="tab"]').contains('Codes').click();
*/
cy.contains('div', 'CQMockData').click();
cy.get('div.MuiBox-root').contains('needs_breast_cancer_screening').click();
cy.get('button.MuiButton-textSecondary').contains('Done').click();

})