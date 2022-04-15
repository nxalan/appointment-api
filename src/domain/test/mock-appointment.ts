import { AppointmentModel, RestrictedDatesModel } from '@/domain/models/appointment'
import { AddAppointmentParams } from '@/domain/usecases/appointment/add-appointment'
import { EditAppointmentParams } from '@/domain/usecases/appointment/edit-appointment'
import { randomUUID } from 'crypto'
import { startOfDay } from 'date-fns'

export const mockAppointmentModel = (): AppointmentModel => ({
  id: 'any_id',
  name: 'any_name',
  birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
  appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  status: 'NOT VACCINED',
  status_comment: ''
})

export const mockAppointmentModels = (): AppointmentModel[] => ([{
  id: 'any_id',
  name: 'any_name',
  birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
  appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  status: 'NOT VACCINED',
  status_comment: ''
}, {
  id: 'other_id',
  name: 'other_name',
  birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
  appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  status: 'VACCINED',
  status_comment: 'sample comment'
}])

export const mockAddAppointmentParams = (): AddAppointmentParams => ({
  name: 'any_name',
  birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
  appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
})

export const mockEditAppointmentParams = (): EditAppointmentParams => ({
  id: 'any_id',
  name: 'any_name',
  birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(),
  appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  status: 'any_status',
  status_comment: 'any_status_comment'
})

export const mockListOfAddAppointmentParamsWithSameHours = (numberOfAppointments: number): AddAppointmentParams[] => {
  let listOfAppointments = new Array(numberOfAppointments).fill(mockAddAppointmentParams())
  listOfAppointments = listOfAppointments.map((cb) => ({ ...cb, name: randomUUID().substring(0, 5) }))
  return listOfAppointments
}

export const mockListOfEditAppointmentParamsWithSameHours = (numberOfAppointments: number): AppointmentModel[] => {
  let listOfAppointments = new Array(numberOfAppointments).fill(mockEditAppointmentParams())
  listOfAppointments = listOfAppointments.map((cb) => ({ ...cb, name: randomUUID().substring(0, 5) }))
  return listOfAppointments
}

export const mockListOfAddAppointmentParamsWithDifferentHours = (numberOfAppointments: number): AddAppointmentParams[] => {
  let listOfAppointments = new Array(numberOfAppointments).fill(mockAddAppointmentParams())
  listOfAppointments = listOfAppointments.map((cb) => ({ ...cb, name: randomUUID().substring(0, 5) }))
  let hour = 0
  listOfAppointments = listOfAppointments.map((cb) => {
    const todayDate = startOfDay(new Date(cb.appointment_date))
    const todayDatePlusHour = new Date(todayDate.setHours(todayDate.getHours() + hour))
    const appointmentPlus1Hour = { ...cb, appointment_date: todayDatePlusHour.toISOString() }
    hour++
    return appointmentPlus1Hour
  })
  return listOfAppointments
}

export const mockListOfEditAppointmentParamsWithDifferentHours = (numberOfAppointments: number): AppointmentModel[] => {
  let listOfAppointments = new Array(numberOfAppointments).fill(mockEditAppointmentParams())
  listOfAppointments = listOfAppointments.map((cb) => ({ ...cb, name: randomUUID().substring(0, 5) }))
  let hour = 0
  listOfAppointments = listOfAppointments.map((cb) => {
    const todayDate = startOfDay(new Date(cb.appointment_date))
    const todayDatePlusHour = new Date(todayDate.setHours(todayDate.getHours() + hour))
    const appointmentPlus1Hour = { ...cb, appointment_date: todayDatePlusHour.toISOString() }
    hour++
    return appointmentPlus1Hour
  })
  return listOfAppointments
}

export const mockRestrictedDatesModel = (): RestrictedDatesModel => ({
  restrictedDays: [
    new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
  ],
  restrictedHours: [
    new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    new Date(new Date().setHours(new Date().getHours() + 2)).toISOString()
  ]
})
