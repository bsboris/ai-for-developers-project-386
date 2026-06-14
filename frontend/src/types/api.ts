export const BookingStatus = {
  confirmed: "confirmed",
  cancelled: "cancelled",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const DayOfWeek = {
  sunday: "sunday",
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
} as const;
export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export interface Availability {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  duration: number;
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

export interface EventTypeCreate {
  id: string;
  name: string;
  description: string;
  duration: number;
  availability: Availability[];
}

export interface EventTypeUpdate {
  name?: string;
  description?: string;
  duration?: number;
  availability?: Availability[];
}

export interface Slot {
  startTime: string;
  endTime: string;
  eventTypeId: string;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string;
  endTime: string;
  guestName: string;
  guestEmail: string;
  comment?: string;
  status: BookingStatus;
  cancellationToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreate {
  eventTypeId: string;
  startTime: string;
  guestName: string;
  guestEmail: string;
  comment?: string;
}

export interface BookingAdminView {
  id: string;
  eventTypeId: string;
  startTime: string;
  endTime: string;
  guestName: string;
  guestEmail: string;
  comment?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedInterval {
  id: string;
  startTime: string;
  endTime: string;
  reason?: string;
  createdAt: string;
}

export interface BlockedIntervalCreate {
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface CancelResult {
  status: BookingStatus;
  message: string;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
}
