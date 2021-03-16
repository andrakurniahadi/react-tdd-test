import { screen, waitFor, fireEvent } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'

import { SurveyList } from '@/presentation/pages'
import { AccountModel } from '@/domain/models'
import { LoadSurveyListSpy } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'
import { UnexpectedError, AccessDeniedError } from '@/domain/errors'

type SutTypes = {
  history: MemoryHistory
  loadSurveyListSpy: LoadSurveyListSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => null
  })

  return {
    history,
    loadSurveyListSpy,
    setCurrentAccountMock
  }
}

describe('SurveyList Component', () => {
  it('should present 4 empty items on start', async () => {
    const surveyList = screen.getByTestId('survey-list')

    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)

    await waitFor(() => surveyList)
  })

  it('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()

    expect(loadSurveyListSpy.callsCount).toBe(1)

    await waitFor(() => screen.getByRole('heading'))
  })

  it('should render SurveyItems on success', async () => {
    makeSut()

    const surveyList = null
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(4)
  })

  it('should render error on UnexpectedError', async () => {
    const error = new UnexpectedError()

    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
  })

  it('should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()

    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
