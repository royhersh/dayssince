describe('Dayssince', () => {
    beforeEach(() => {
        cy.visit('/');
    })

    it('Add new todo by clicking the overlay', () => {
        cy.get('[data-cy=add-button]')
            .click();
        cy.focused().type('new todo');
        cy.get('[data-cy=overlay]')
            .should('exist')
            .click()
            .should('not.exist');
    })

    it('Add new todo by pressing enter the overlay', () => {
        cy.get('[data-cy=add-button]')
            .click();
        cy.focused().type('new todo{enter}');
        cy.get('[data-cy=overlay]')
            .should('not.exist');
    })


})