# Test Plan — Doctor Patient Portal (Hospital)

| Campo | Valor |
|---|---|
| **Proyecto** | Doctor Patient Portal (Advance Java Web Project) |
| **Asignatura** | SQA — Práctica: automatización con Cypress |
| **Integrantes** | Natalia Valda — Adolfo Vera — Ethan Zambrana — Fabian Castro |
| **Fecha** | Octubre 2026 |
| **Versión doc** | 1.0 |

---

## 1. Objeto

Validar el correcto funcionamiento del portal web **Doctor Patient Portal** (JSP/Servlet + MySQL) cubriendo los tres roles del sistema (Admin, Doctor, Paciente) mediante una suite de pruebas manuales (smoke test) y su automatización con **Cypress**.

## 2. Alcance

### En alcance
- Portada (`index.jsp`) y navegación principal.
- Registro e ingreso de Paciente (User).
- Login de Admin (estático) y login de Doctor (BD).
- Gestión de especialistas y doctores por parte del Admin.
- Solicitud y visualización de citas médicas por el Paciente.
- Cambio de contraseña.

### Fuera de alcance
- Rendimiento, seguridad ofensiva y pruebas de carga.
- Compatibilidad entre navegadores (se usa Edge/Chromium).
- Capa de correo electrónico (no existe en el SUT).

## 3. Ambiente de pruebas (Amb Pr)

| Componente | Detalle |
|---|---|
| **SUT** | Doctor Patient Portal (WAR desplegado en **Tomcat 9**) |
| **URL base** | `http://localhost:8080/Doctor-Patient-Portal/` |
| **BD** | MySQL 8 en contenedor Docker `hospital-mysql`, BD `hospital` |
| **Credenciales BD** | user: `root` — pwd: `root` |
| **Red Docker** | `hospital-net` (Tomcat ↔ MySQL) |
| **IDE de pruebas** | Cypress 16 (navegador Edge/Chromium) |
| **SO** | Windows 11 |
| **Datos de prueba** | Admin estático `admin@gmail.com`/`admin`; usuarios y doctores de prueba creados por la propia suite (emails con timestamp para evitar duplicados) |

## 4. Estrategia

1. **Smoke test (manual):** verificación rápida de que las páginas principales responden 200 y los tres logins funcionan antes de ejecutar la suite completa.
2. **Automatización (Cypress):** `test.cy.js` cubre los casos HU-01 a HU-10 con datos dinámicos.
3. **Nivel:** funcional (caja negra, dirigida por HU).

## 5. Historias de Usuario → Casos de prueba

| HU | Caso | Descripción | Prioridad | Resultado |
|---|---|---|---|---|
| HU-01 | CP-01 | La portada carga y muestra los accesos ADMIN / DOCTOR / APPOINTMENT / USER | Alta | ✅ Aprobado |
| HU-02 | CP-02 | Registro de un nuevo paciente con datos válidos → mensaje "Register Successfully" | Alta | ✅ Aprobado |
| HU-03 | CP-03 | Login de paciente con credenciales válidas → muestra nombre en navbar | Alta | ✅ Aprobado |
| HU-04 | CP-04 | Login de paciente con credenciales inválidas → mensaje "Invalid email or password" | Alta | ✅ Aprobado |
| HU-05 | CP-05 | Login de Admin válido → dashboard Admin | Alta | ✅ Aprobado |
| HU-06 | CP-06 | Admin agrega un especialista → aparece en la lista | Media | ✅ Aprobado |
| HU-07 | CP-07 | Admin agrega un doctor (con especialidad) → aparece en la lista de doctores | Alta | ✅ Aprobado |
| HU-08 | CP-08 | Paciente autenticado agenda una cita → se guarda y aparece en "View Appointment" | Alta | ✅ Aprobado |
| HU-09 | CP-09 | Paciente cambia su contraseña y puede volver a ingresar con la nueva | Media | ✅ Aprobado |
| HU-10 | CP-10 | Login de Doctor válido → dashboard Doctor | Media | ✅ Aprobado |

**Resultado última ejecución:** 10/10 aprobados (0 fallos) — 3m36s — evidencia en `Practica6_Cypress/Evidencia_test_portal.txt` (repo `practica6-cypress`).

## 6. Criterios de aceptación

- Todos los casos de prioridad **Alta** deben quedar en estado **Aprobado**.
- La suite `test.cy.js` debe ejecutarse de extremo a extremo sin errores (`0 failed`).
- La BD debe quedar consistente: cada cita creada referencia un `userId` y `doctorId` existentes (FK).

## 7. Riesgos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | El servicio (Tomcat/MySQL en Docker) no está activo al ejecutar la suite | Alto | Smoke test previo; scripts de levantamiento (`docker start`) |
| R2 | Emails duplicados por re-ejecuciones (columna UNIQUE) | Medio | Los tests generan emails con `Date.now()` |
| R3 | La tabla `doctor` debe tener registros para poder agendar cita (select dinámico) | Alto | El CP-07 se ejecuta antes que el CP-08; el test de citas crea su doctor propio |
| R4 | Contenedor Docker inestable / archivos bloqueados en Windows al recompilar | Medio | Recrear contenedores; limpiar carpeta `target` antes del build |
| R5 | Cambios no versionados del código fuente (DBConnection) | Medio | Todo el trabajo se versiona en Git (ver sección 8) |

## 8. Entregables

1. **Test Plan** (este documento).
2. **Casos de prueba** (sección 5, vinculados a HU).
3. **Suite automatizada** `cypress/e2e/test.cy.js`.
4. **Evidencias** de ejecución y organización en **Git**.

## 9. Cronograma / avance

| Fase | Estado |
|---|---|
| Ambiente (BD hospital + Tomcat) | ✅ |
| Test Plan | ✅ |
| Casos de prueba | ✅ |
| Automatización Cypress | ✅ 10/10 aprobados |
| Ejecución y evidencias | ✅ `Evidencia_test_portal.txt` |
| Organización en Git / Expo | ✅ |
