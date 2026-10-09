Feature: Ciclo de vida de una reserva

  Background:
    * url baseUrl
    * configure headers = { Accept: 'application/json' }
    * def auth = callonce read('classpath:common/auth.feature')
    * def schema = read('classpath:common/booking-schema.json')
    * def newBooking = call read('classpath:common/new-booking.js')

  Scenario: crear, leer, actualizar, modificar parcialmente y eliminar
    # crear
    Given path 'booking'
    And request newBooking
    When method post
    Then status 200
    And match response == { bookingid: '#number', booking: '#(newBooking)' }
    * def id = response.bookingid

    # leer: cumple el esquema y devuelve lo mismo que se envió
    Given path 'booking', id
    When method get
    Then status 200
    And match response == schema
    And match response == newBooking

    # actualizar completo (PUT)
    * def updated = karate.merge(newBooking, { totalprice: 320, additionalneeds: 'Late checkout' })
    Given path 'booking', id
    And cookie token = auth.token
    And request updated
    When method put
    Then status 200
    And match response == updated

    # modificar parcialmente (PATCH): solo cambia el campo enviado
    Given path 'booking', id
    And cookie token = auth.token
    And request { depositpaid: false }
    When method patch
    Then status 200
    * def patched = karate.merge(updated, { depositpaid: false })
    And match response == patched

    # eliminar: la API responde 201 en vez de 204, se prueba el comportamiento actual
    Given path 'booking', id
    And cookie token = auth.token
    When method delete
    Then status 201

    Given path 'booking', id
    When method get
    Then status 404

  # HALLAZGO: la API trunca los decimales del precio sin avisar (99.5 se guarda como 99).
  # En un sistema real se reportaría como defecto; acá se fija el comportamiento actual
  # para que la prueba avise si cambia.
  @defecto-conocido
  Scenario: un precio con decimales se guarda truncado
    * set newBooking.totalprice = 99.5
    Given path 'booking'
    And request newBooking
    When method post
    Then status 200
    And match response.booking == schema
    And match response.booking.totalprice == 99
