@ignore
Feature: Helper - crear una reserva nueva y devolver su id

  Scenario:
    * def booking = call read('classpath:common/new-booking.js')
    Given url baseUrl
    And path 'booking'
    And header Accept = 'application/json'
    And request booking
    When method post
    Then status 200
    * def id = response.bookingid
