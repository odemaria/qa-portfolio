@ignore
Feature: Helper - obtener un token de administrador

  Scenario:
    Given url baseUrl
    And path 'auth'
    And request { username: 'admin', password: 'password123' }
    When method post
    Then status 200
    And match response == { token: '#string' }
    * def token = response.token
