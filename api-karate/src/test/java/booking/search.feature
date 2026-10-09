Feature: Búsqueda de reservas

  Background:
    * url baseUrl
    * configure headers = { Accept: 'application/json' }

  Scenario: filtra por nombre y apellido
    * def booking = call read('classpath:common/new-booking.js')
    Given path 'booking'
    And request booking
    When method post
    Then status 200
    * def id = response.bookingid

    Given path 'booking'
    And param firstname = booking.firstname
    And param lastname = booking.lastname
    When method get
    Then status 200
    And match each response == { bookingid: '#number' }
    And match response contains { bookingid: '#(id)' }

  Scenario: un filtro sin coincidencias devuelve una lista vacía
    * def nombre = 'no-existe-' + java.util.UUID.randomUUID()
    Given path 'booking'
    And param firstname = nombre
    When method get
    Then status 200
    And match response == []

  Scenario: el listado general devuelve ids numéricos
    Given path 'booking'
    When method get
    Then status 200
    And match response == '#[_ > 0]'
    And match each response == { bookingid: '#number' }
