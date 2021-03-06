import { AddAppointmentRepository, LoadAppointmentsByDayRepository, LoadAppointmentsByHourRepository } from '.'
import { DbAddAppointment } from './db-add-appointment'
import { mockAddAppointmentParams, mockAppointmentModel, mockAppointmentResponseModel, mockListOfEditAppointmentParamsWithDifferentHours, mockListOfEditAppointmentParamsWithSameHours, throwError } from '@/domain/test'
import { mockAddAppointmentRepository, mockLoadAppointmentsByDayRepository, mockLoadAppointmentsByHourRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddAppointment
  addAppointmentRepositoryStub: AddAppointmentRepository
  loadAppointmentsByDayStub: LoadAppointmentsByDayRepository
  loadAppointmentsByHourStub: LoadAppointmentsByHourRepository
}

const makeSut = (): SutTypes => {
  const addAppointmentRepositoryStub = mockAddAppointmentRepository()
  const loadAppointmentsByDayStub = mockLoadAppointmentsByDayRepository()
  const loadAppointmentsByHourStub = mockLoadAppointmentsByHourRepository()
  const sut = new DbAddAppointment(addAppointmentRepositoryStub, loadAppointmentsByDayStub, loadAppointmentsByHourStub)
  return {
    sut,
    addAppointmentRepositoryStub,
    loadAppointmentsByDayStub,
    loadAppointmentsByHourStub
  }
}

describe('DbAddAppointment Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddAppointmentRepository with correct values', async () => {
    const { sut, addAppointmentRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAppointmentRepositoryStub, 'add')
    await sut.add(mockAddAppointmentParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
      appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      status: 'NOT VACCINED',
      status_comment: ''
    })
  })

  test('Should throw if AddAppointmentRepository throws', async () => {
    const { sut, addAppointmentRepositoryStub } = makeSut()
    jest.spyOn(addAppointmentRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAppointmentParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an appointment id on success', async () => {
    const { sut } = makeSut()
    const appointment = await sut.add(mockAddAppointmentParams())
    expect(appointment).toEqual(mockAppointmentResponseModel())
  })

  test('Should call addAppointmentRepositoryStub with birthday and appointment_date on ISOString format', async () => {
    const { sut, addAppointmentRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAppointmentRepositoryStub, 'add')
    const requestWithoutISOString = {
      name: 'any_name',
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)) as unknown as string,
      appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)) as unknown as string
    }
    await sut.add(requestWithoutISOString)
    const appointmentModelWithoutId: any = mockAppointmentModel()
    delete appointmentModelWithoutId.id
    expect(addSpy).toHaveBeenCalledWith(appointmentModelWithoutId)
  })

  test('Should throw if LoadAppointmentsByDayRepository throws', async () => {
    const { sut, loadAppointmentsByDayStub } = makeSut()
    jest.spyOn(loadAppointmentsByDayStub, 'loadByDay').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAppointmentParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAppointmentsByHourRepository throws', async () => {
    const { sut, loadAppointmentsByHourStub } = makeSut()
    jest.spyOn(loadAppointmentsByHourStub, 'loadByHour').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAppointmentParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if appointment_date day is not available', async () => {
    const { sut, loadAppointmentsByDayStub } = makeSut()
    jest.spyOn(loadAppointmentsByDayStub, 'loadByDay').mockReturnValueOnce(Promise.resolve(mockListOfEditAppointmentParamsWithDifferentHours(20)))
    const promise = sut.add(mockAddAppointmentParams())
    await expect(promise).resolves.toThrow()
  })

  test('Should throw if appointment_date hour is not available', async () => {
    const { sut, loadAppointmentsByHourStub } = makeSut()
    jest.spyOn(loadAppointmentsByHourStub, 'loadByHour').mockReturnValueOnce(Promise.resolve(mockListOfEditAppointmentParamsWithSameHours(2)))
    const promise = sut.add(mockAddAppointmentParams())
    await expect(promise).resolves.toThrow()
  })
})
