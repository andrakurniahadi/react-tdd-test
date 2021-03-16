import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'

const PATH = /surveys/

const mockSuccess = (): void => Http.mockOk(PATH, 'GET', 'fx:survey-list')
const mockUnexpectedError = (): void => Http.mockServerError(PATH, 'GET')
const mockAccessDeniedError = (): void => Http.mockForbiddenError(PATH, 'GET')

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.setLocalStorageItem('account', account)
    })
  })

  it('should present on UnexpectedError', () => {
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again later.')
  })

  it('should logout on AccessDeniedError', () => {
    cy.visit('')
    Helper.testUrl('/login')
  })

  it('should present correct username', () => {
    const { name } = Helper.getLocalStorageItem('account')

    cy.visit('')
    cy.getByTestId('username').should('contain.text', name)
  })

  it('should logout on logout link click', () => {
    cy.visit('')
    cy.getByTestId('logout').click()

    Helper.testUrl('/login')
  })

  it('should reload on button click', () => {
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again later.')

    cy.get('li:not(:empty)').should('have.length', 2)
  })
})
