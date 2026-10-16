# Automatización funcional con Cypress

**Integrantes:** Natalia Valda — Adolfo Vera — Ethan Zambrana — Fabian Castro
**Correo del equipo (git):** vvalda549@gmail.com

Este proyecto cubre los cuatro documentos entregados:

| Sitio / SUT | Archivo | Cobertura |
| --- | --- | --- |
| Doctor Patient Portal (local) | `cypress/e2e/test.cy.js` | **CP-01 a CP-10**: portada, registro/login de paciente, login admin y doctor, especialista y doctor desde el admin, agenda de cita, cambio de contraseña. **10/10 aprobados.** |
| Testing Yes | `cypress/e2e/testingyes.cy.js` | Portada (7 aserciones), registro, compras confirmadas de ropa, accesorio y arte, cierre de sesión. |
| Automation Exercise | `cypress/e2e/automationexercise.cy.js` | BD001 registro, BD002 usuario autenticado en Home, BD003 compra, BD004 carrito, BD005 catálogo y búsqueda. |
| Mercury Tours | `cypress/e2e/mercury.cy.js` | Los 11 casos del plan: portada, registro, ida, ida y vuelta y siete enlaces de navegación. |

Entregables adicionales de esta práctica: **`TEST_PLAN.md`** (plan con HU → casos CP-01..CP-10, riesgos y ambiente) y **`hospital.sql`** (script de la BD del SUT). Evidencia de la ejecución: `Evidencia_test_portal.txt`.

## Ambiente del Doctor Patient Portal (SUT local)

El portal es una app Java (JSP/Servlet) que se despliega en **Tomcat 9** y usa **MySQL 8 en Docker**:

```powershell
# 1. Base de datos (una sola vez: crearla con el script hospital.sql)
docker run -d --name hospital-mysql --network hospital-net -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hospital -p 3306:3306 mysql:8.0

# 2. Portal (WAR compilado con Maven)
docker start hospital-mysql hospital-tomcat
```

| Dato | Valor |
| --- | --- |
| URL del SUT | `http://localhost:8080/Doctor-Patient-Portal/` |
| BD | `hospital` — user `root` / pwd `root` |
| Admin estático | `admin@gmail.com` / `admin` |

## Ejecutar

Desde PowerShell en esta carpeta:

```powershell
npm install
npm test                 # los 3 sitios externos
npm run test:portal      # suite del Doctor Patient Portal (requiere el ambiente levantado)
```

Para ejecutar un solo sitio:

```powershell
npm run test:testingyes
npm run test:automationexercise
npm run test:mercury
```

Para abrir el panel interactivo que ya utilizas:

```powershell
npm run cy:open
```

En el panel elige **E2E Testing**, **Chrome** y el archivo `.cy.js` deseado. No se necesitan credenciales previas: las pruebas de registro generan un correo o nombre de usuario nuevo en cada ejecución. Los pagos usan datos de prueba del sitio de demostración. El flujo de Testing Yes crea tres pedidos reales dentro de esa tienda de prácticas; su inventario puede variar y la suite verifica que la variante elegida se pueda añadir al carrito.

## Límites del sitio de prácticas

- BD002 menciona “Actualizar Perfil De Usuario Home”. Automation Exercise no muestra una pantalla pública de edición de perfil. La suite valida el usuario autenticado en Home y sus datos de dirección en el checkout; no simula una actualización inexistente.
- En Mercury Tours, Hotels, Car Rentals, Destinations, Vacations, Support y Contacts llevan a la misma página **Under Construction**. Cruises vuelve a la portada. Las aserciones comprueban ese comportamiento real.
- Los sitios son externos. Si cambian el contenido, stock o rutas, puede ser necesario actualizar los selectores o elegir otra variante de producto.
