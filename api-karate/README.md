# API · Karate

Pruebas de la API REST de [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html), un servicio de reservas hecho para practicar testing de APIs.

## Qué cubre

| Feature | Casos |
|---------|-------|
| `auth.feature` | Token con credenciales válidas; sin token con contraseña errónea, usuario inexistente o campos vacíos |
| `crud.feature` | Ciclo completo crear → leer → PUT → PATCH → eliminar → 404, con validación de esquema |
| `search.feature` | Filtro por nombre y apellido, filtro sin coincidencias, formato del listado |
| `security.feature` | PUT, PATCH y DELETE sin token o con token inválido dan 403 y la reserva queda intacta; 404 para ids inexistentes; health check |

## Hallazgos

Las pruebas fijan el comportamiento actual de la API y dejan anotadas sus rarezas, como se haría en un proyecto real:

| Hallazgo | Esperado | Actual |
|----------|----------|--------|
| El precio con decimales se trunca sin avisar (`@defecto-conocido`) | Guardar 99.5 o rechazarlo con 400 | Guarda 99 |
| Credenciales inválidas | 401 Unauthorized | 200 con `{"reason": "Bad credentials"}` |
| Eliminar una reserva | 204 No Content | 201 Created |

## Diseño

- **Helpers reutilizables** (`common/`): token de administrador con `callonce`, creación de reservas y datos únicos por ejecución, porque la API es pública y compartida.
- **Validación de esquema** con los *fuzzy matchers* de Karate (`booking-schema.json`).
- **Scenario Outline** para los casos que solo cambian en los datos.
- **Ejecución en paralelo** desde JUnit 5 (`BookingTest.java`), con reporte HTML de Karate como artefacto en CI.

## Cómo correrlo

Requiere Java 17 y Maven.

```bash
mvn test
mvn test -DbaseUrl=http://localhost:3001   # otra instancia, por ejemplo en Docker
```

El reporte queda en `target/karate-reports/karate-summary.html`.
