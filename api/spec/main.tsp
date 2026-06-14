import "@typespec/http";

using TypeSpec.Http;

// ============================================================
// TimeSpot API — TypeSpec Specification
// ============================================================

@service(#{
  title: "TimeSpot API",
})
@server("/api", "TimeSpot public & admin HTTP API")
namespace TimeSpot;

// ============================================================
// Aliases & Helpers
// ============================================================

alias DateTime = utcDateTime;
alias DateOnly = plainDate;
alias TimeOnly = plainTime;
alias UUID = string;

// ============================================================
// Enums
// ============================================================

enum BookingStatus {
  confirmed,
  cancelled,
}

enum DayOfWeek {
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
}

// ============================================================
// Models — Event Type
// ============================================================

model Availability {
  dayOfWeek: DayOfWeek;
  startTime: TimeOnly;
  endTime: TimeOnly;
}

model EventType {
  id: string;
  name: string;
  description: string;
  duration: int32; // minutes
  availability: Availability[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

model EventTypeCreate {
  id: string;
  name: string;
  description: string;
  duration: int32;
  availability: Availability[];
}

model EventTypeUpdate {
  name?: string;
  description?: string;
  duration?: int32;
  availability?: Availability[];
}

// ============================================================
// Models — Slot (virtual)
// ============================================================

model Slot {
  startTime: DateTime;
  endTime: DateTime;
  eventTypeId: string;
}

// ============================================================
// Models — Booking
// ============================================================

model Booking {
  id: UUID;
  eventTypeId: string;
  startTime: DateTime;
  endTime: DateTime;
  guestName: string;
  guestEmail: string;
  comment?: string;
  status: BookingStatus;
  cancellationToken: UUID;
  createdAt: DateTime;
  updatedAt: DateTime;
}

model BookingCreate {
  eventTypeId: string;
  startTime: DateTime;
  guestName: string;
  guestEmail: string;
  comment?: string;
}

model BookingAdminView {
  id: UUID;
  eventTypeId: string;
  startTime: DateTime;
  endTime: DateTime;
  guestName: string;
  guestEmail: string;
  comment?: string;
  status: BookingStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
}

// ============================================================
// Models — Blocked Interval
// ============================================================

model BlockedInterval {
  id: UUID;
  startTime: DateTime;
  endTime: DateTime;
  reason?: string;
  createdAt: DateTime;
}

model BlockedIntervalCreate {
  startTime: DateTime;
  endTime: DateTime;
  reason?: string;
}

// ============================================================
// Models — Errors
// ============================================================

model ConflictError {
  @statusCode statusCode: 409;
  code: "SLOT_CONFLICT";
  message: string;
}

model NotFoundError {
  @statusCode statusCode: 404;
  code: "NOT_FOUND";
  message: string;
}

model ValidationError {
  @statusCode statusCode: 422;
  code: "VALIDATION_ERROR";
  message: string;
}

model UnauthorizedError {
  @statusCode statusCode: 401;
  code: "UNAUTHORIZED";
  message: string;
}

model CancelResult {
  status: BookingStatus;
  message: string;
}

// ============================================================
// Public endpoints (no auth)
// ============================================================

@route("/event-types")
namespace PublicEventTypes {
  @summary("Список всех типов событий")
  @doc("Возвращает все типы событий, доступные для бронирования")
  @get
  op list(): EventType[];

  @summary("Детали типа события")
  @doc("Возвращает тип события по ID")
  @get
  op get(@path eventTypeId: string): EventType | NotFoundError;
}

@route("/slots")
namespace PublicSlots {
  @summary("Свободные слоты на дату")
  @doc("""
    Возвращает список свободных слотов для указанного типа события на дату.
    Учитывает рабочие часы, блокировки и существующие бронирования.
    Шаг сетки равен длительности типа события.
  """)
  @get
  op list(
    @query eventTypeId: string,
    @query date: DateOnly,
    @query timezone: string,
  ): Slot[];
}

@route("/bookings")
namespace PublicBookings {
  @summary("Создать бронирование")
  @doc("Гость бронирует свободный слот. Если слот занят — возвращает 409 Conflict.")
  @post
  op create(@body body: BookingCreate): Booking | ConflictError | ValidationError;

  @summary("Отменить бронирование")
  @doc("Гость отменяет своё бронирование по токену из письма-подтверждения")
  @route("{bookingId}/cancel")
  @post
  op cancel(
    @path bookingId: UUID,
    @query token: UUID,
  ): CancelResult | NotFoundError;
}

// ============================================================
// Admin endpoints (Basic Auth)
// ============================================================

@route("/admin")
@doc("Все админ-эндпоинты защищены Basic Auth")
namespace Admin {
  // ---- Event Types CRUD ----

  @route("/event-types")
  namespace EventTypes {
    @summary("Список типов событий")
    @get
    op list(): EventType[];

    @summary("Создать тип события")
    @post
    op create(@body body: EventTypeCreate): EventType | ValidationError;

    @summary("Обновить тип события")
    @route("{eventTypeId}")
    @patch
    op update(
      @path eventTypeId: string,
      @body body: EventTypeUpdate,
    ): EventType | NotFoundError | ValidationError;

    @summary("Удалить тип события")
    @route("{eventTypeId}")
    @delete
    op delete(@path eventTypeId: string): void | NotFoundError;
  }

  // ---- Admin Bookings ----

  @route("/bookings")
  namespace Bookings {
    @summary("Список всех предстоящих бронирований")
    @doc("Возвращает бронирования всех типов событий в одном списке")
    @get
    op list(
      @query status?: BookingStatus,
      @query from?: DateTime,
      @query to?: DateTime,
    ): BookingAdminView[];

    @summary("Детали бронирования")
    @route("{bookingId}")
    @get
    op get(@path bookingId: UUID): BookingAdminView | NotFoundError;

    @summary("Отменить бронирование (админ)")
    @route("{bookingId}/cancel")
    @post
    op cancel(@path bookingId: UUID): BookingAdminView | NotFoundError;
  }

  // ---- Blocked Intervals ----

  @route("/blocked-intervals")
  namespace BlockedIntervals {
    @summary("Список заблокированных интервалов")
    @get
    op list(
      @query from?: DateTime,
      @query to?: DateTime,
    ): BlockedInterval[];

    @summary("Заблокировать интервал")
    @post
    op create(@body body: BlockedIntervalCreate): BlockedInterval | ValidationError;

    @summary("Удалить блокировку")
    @route("{intervalId}")
    @delete
    op delete(@path intervalId: UUID): void | NotFoundError;
  }
}

// ============================================================
// Error shared — applied via a trait
// ============================================================

@error
model Error {
  @statusCode statusCode: int32;
  code: string;
  message: string;
}
