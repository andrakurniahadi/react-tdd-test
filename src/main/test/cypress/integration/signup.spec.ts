import faker from 'faker'

import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'
import * as FormHelper from '../utils/form-helpers'

const PATH = /signup/

const mockSuccess = (): void => Http.mockOk(PATH, 'POST', 'fx:account')
const mockUnexpectedError = (): void => Http.mockServerError(PATH, 'POST')
const mockEmailInUseError = (): void => Http.mockForbiddenError(PATH, 'POST')

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(8)

  cy.getByTestId('name-input').focus().type(faker.name.findName())
  cy.getByTestId('email-input').focus().type(faker.internet.email())
  cy.getByTestId('password-input').focus().type(password)
  cy.getByTestId('passwordConfirmation-input').focus().type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit-button').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Required field')

    FormHelper.testInputStatus('email', 'Required field')

    FormHelper.testInputStatus('password', 'Required field')

    FormHelper.testInputStatus('passwordConfirmation', 'Required field')
  })

  it('should present error if form is invalid', () => {
    FormHelper.testInputStatus('name', 'Invalid field')

    FormHelper.testInputStatus('email', 'Invalid field')

    FormHelper.testInputStatus('password', 'Invalid field')

    FormHelper.testInputStatus('passwordConfirmation', 'Invalid field')
  })

  it('should present valid if form is valid', () => {
    FormHelper.testInputStatus('name')

    FormHelper.testInputStatus('email')

    const password = faker.random.alphaNumeric(5)

    FormHelper.testInputStatus('password')

    FormHelper.testInputStatus('passwordConfirmation')
  })

  it('should present EmailInUseError on 403', () => {
    FormHelper.testMainError('This e-mail is already in use')
    Helper.testUrl('/signup')
  })

  it('should present UnexpectedError on 400', () => {
    FormHelper.testMainError('Something went wrong. Please try again later.')
    Helper.testUrl('/signup')
  })

  it('should save account if credentials are provided', () => {
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should prevent multiple submits', () => {
    Helper.testHttpCallsCount(1)
  })

  it('should not call submit if form is invalid', () => {
    Helper.testHttpCallsCount(0)
  })
})
