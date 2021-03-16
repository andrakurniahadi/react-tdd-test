import faker from 'faker'

import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'
import * as FormHelper from '../utils/form-helpers'

const PATH = /login/

const mockSuccess = (): void => Http.mockOk(PATH, 'POST', 'fx:account')
const mockUnexpectedError = (): void => Http.mockServerError(PATH, 'POST')
const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(PATH)

const populateFields = (): void => {

}

const simulateValidSubmit = (): void => {

}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Required field')

    FormHelper.testInputStatus('password', 'Required field')
  })

  it('should present error if form is invalid', () => {
    FormHelper.testInputStatus('email', 'Invalid field')

    FormHelper.testInputStatus('password', 'Invalid field')
  })

  it('should present valid if form is valid', () => {
    FormHelper.testInputStatus('email')

    FormHelper.testInputStatus('password')
  })

  it('should present InvalidCredentialsError on 401', () => {
    FormHelper.testMainError('Invalid credentials')
    Helper.testUrl('/login')
  })

  it('should present UnexpectedError on 400', () => {
    FormHelper.testMainError('Something went wrong. Please try again later.')
    Helper.testUrl('/login')
  })

  it('should save account if credentials are provided', () => {
    cy.getByTestId('error-wrap').should('not.have.descendants')

    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should prevent multiple submits', () => {
    cy.getByTestId('submit-button').dblclick()
    cy.wait('@request')
    Helper.testHttpCallsCount(1)
  })

  it('should not call submit if form is invalid', () => {
    Helper.testHttpCallsCount(0)
  })
})
