import faker from 'faker'
import { createMemoryHistory } from 'history'
import { fireEvent, waitFor, screen } from '@testing-library/react'

import { SignUp } from '@/presentation/pages'
import { AddAccount } from '@/domain/usecases'
import { AddAccountSpy } from '@/domain/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { Helper, renderWithHistory, ValidationStub } from '@/presentation/test'

type SutTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccount.Model) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const addAccountSpy = null
  const validationStub = null

  validationStub.errorMessage = params?.validationError

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => null
  })

  return {
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (name = faker.name.firstName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)

  const form = null
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  it('should start with initial state', () => {
    const validationError = null

    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })

  it('should show email error if validation fails', () => {
    const validationError = null

    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
  })

  it('should show email error if validation fails', () => {
    const validationError = null

    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  it('should show password error if validation fails', () => {
    const validationError = null

    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  it('should show password error if validation fails', () => {
    const validationError = null

    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  it('should show valid name state if validation succeeds', () => {
    Helper.populateField('name')
    Helper.testStatusForField('name')
  })

  it('should show valid email state if validation succeeds', () => {
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  it('should show valid password state if validation succeeds', () => {
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  it('should show valid passwordConfirmation state if validation succeeds', () => {
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  it('should enable submit button if form is valid', () => {
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')

    expect(screen.getByTestId('submit-button')).toBeEnabled()
  })

  it('should show spinner on submit', async () => {
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  it('should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()

    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  it('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut()
    expect(addAccountSpy.callsCount).toBe(1)
  })

  it('should not call AddAccount form is invalid', async () => {
    const validationError = faker.random.words()

    const { addAccountSpy } = makeSut({ validationError })

    expect(addAccountSpy.callsCount).toBe(0)
  })

  it('should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new InvalidCredentialsError()

    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
  })

  it('should call UpdateCurrentAccount on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('should go to login page', () => {
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/login')
  })
})
