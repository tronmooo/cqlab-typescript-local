import '@4tw/cypress-drag-drop';

it('should navigate to CQFlow, create a new flow, and add a Start node', () => {
  cy.visit('http://localhost:4201');

  // Click on the CQFlow link
  cy.get('a[href="/flow"]').contains('CQFlow').click();

  // Click on the breast-cancer-screening element
  cy.contains('div', 'breast-cancer-screening', { timeout: 10000 }).click();

  // Wait for the React Flow canvas to be visible
  cy.get('[data-testid="rf__wrapper"]', { timeout: 20000 }).should('be.visible');

  // Drag the Start node into the React Flow wrapper using data transfer
  cy.contains('Start').trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.get('[data-testid="rf__wrapper"]').trigger('drop', { dataTransfer: new DataTransfer() });

  // Drag the True/False node into the React Flow wrapper
  cy.contains('True/False').trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.get('[data-testid="rf__wrapper"]').trigger('drop', { dataTransfer: new DataTransfer() });

  // Click on the Start node to open options
  cy.get('.react-flow__node').contains('Start').click({force: true});

  // Click "Next" in the options that appear
  cy.contains('Next').click({force: true});

  // Connect the Start node to the True/False node
  cy.get('.react-flow__pane').trigger('mousedown', { which: 1, pageX: 400, pageY: 300, force: true })
    .trigger('mousemove', { pageX: 600, pageY: 500, force: true })
    .trigger('mouseup', { force: true });

  // Ensure the node is successfully added to the canvas
  cy.get('#root > div > div.MuiBox-root.css-ncsrsf > div > div.MuiBox-root.css-i9gxme > div:nth-child(1) > div > div.split-view.split-view-horizontal.split-view-separator-border.allotment-module_splitView__L-yRc.allotment-module_horizontal__7doS8.allotment-module_separatorBorder__x-rDS > div.split-view-container.allotment-module_splitViewContainer__rQnVa > div:nth-child(3) > div > div > div.MuiBox-root.css-e9d708 > div:nth-child(4) > div > button > span').click({force: true});

  cy.get('input[type="text"]').should('be.visible').type('This is a test input');

  cy.get('#root > div > div.MuiBox-root.css-ncsrsf > div > div.MuiBox-root.css-i9gxme > div:nth-child(1) > div > div.split-view.split-view-horizontal.split-view-separator-border.allotment-module_splitView__L-yRc.allotment-module_horizontal__7doS8.allotment-module_separatorBorder__x-rDS > div.split-view-container.allotment-module_splitViewContainer__rQnVa > div:nth-child(3) > div > div > div.MuiBox-root.css-e9d708 > div:nth-child(4) > div > div.MuiBox-root.css-1qpu1hc > button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-2azu4n > svg > path').click({force: true});
});