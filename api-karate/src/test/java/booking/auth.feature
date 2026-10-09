Feature: Autenticación

  Background:
    * url baseUrl
    * path 'auth'

  Scenario: credenciales válidas entregan un token
    Given request { username: 'admin', password: 'password123' }
    When method post
    Then status 200
    And match response == { token: '#string' }
    And assert response.token.length > 0

  # La API responde 200 con un "reason" en vez de 401: se prueba el comportamiento actual
  Scenario Outline: credenciales inválidas no entregan token (<caso>)
    Given request { username: '<username>', password: '<password>' }
    When method post
    Then status 200
    And match response == { reason: 'Bad credentials' }

    Examples:
      | caso                 | username | password    |
      | contraseña errónea   | admin    | incorrecta  |
      | usuario inexistente  | nadie    | password123 |
      | campos vacíos        |          |             |
