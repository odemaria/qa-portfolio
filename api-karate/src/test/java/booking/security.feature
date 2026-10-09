Feature: Seguridad y casos negativos

  Background:
    * url baseUrl
    * configure headers = { Accept: 'application/json' }

  Scenario: el servicio está disponible
    Given path 'ping'
    When method get
    Then status 201

  Scenario Outline: <method> sin un token válido está prohibido (<caso>)
    * def created = call read('classpath:common/create-booking.feature')
    * def body = call read('classpath:common/new-booking.js')
    Given path 'booking', created.id
    And header Cookie = 'token=<token>'
    And request body
    When method <method>
    Then status 403

    # la reserva sigue intacta (header y request se limpian después de cada llamada)
    Given path 'booking', created.id
    When method get
    Then status 200
    And match response == created.booking

    Examples:
      | method | caso           | token         |
      | put    | sin token      |               |
      | put    | token inválido | abc123        |
      | patch  | token inválido | abc123        |
      | delete | token inválido | abc123        |

  Scenario: una reserva inexistente responde 404
    Given path 'booking', 999999999
    When method get
    Then status 404
