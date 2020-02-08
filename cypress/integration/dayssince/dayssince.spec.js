describe('Dayssince', () => {
    beforeEach(() => {
        cy.visit('/');
    })

    it('Add new todo by clicking the overlay', () => {
        cy.get('.add-button')
            .click();
        cy.focused().type('new todo');
        cy.get('#overlay')
            .should('exist')
            .click()
            .should('not.exist');
    })

    it('Add new todo by pressing enter the overlay', () => {
        cy.get('.add-button')
            .click();
        cy.focused().type('new todo{enter}');
        cy.get('#overlay')
            .should('not.exist');
    })


})