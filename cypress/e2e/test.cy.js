// ============================================================
// Práctica — Automatización con Cypress
// SUT: Doctor Patient Portal (JSP/Servlet + MySQL en Docker)
// URL: http://localhost:8080/Doctor-Patient-Portal/
//
// Integrantes: Natalia Valda — Adolfo Vera — Ethan Zambrana — Fabian Castro
//
// Ambiente (ver TEST_PLAN.md):
//   BD MySQL (contenedor hospital-mysql, BD hospital)
//     user: root   pwd: root
//   Admin estático: admin@gmail.com / admin
//
// Casos CP-01 a CP-10 derivados de las HU del test plan.
// Los emails se generan con Date.now() para poder re-ejecutar
// la suite sin chocar con la restricción UNIQUE de la BD.
// ============================================================
const base = 'http://localhost:8080/Doctor-Patient-Portal';

const stamp = `${Date.now()}`;
const patient = {
  fullName: 'Paciente Cypress',
  email: `paciente.${stamp}@example.com`,
  password: 'Cypress2026!',
};

const doctor = {
  fullName: `Dr. Cypress ${stamp}`,
  dateOfBirth: '1990-05-10',
  qualification: 'MD',
  specialist: `Cardiologia ${stamp}`,
  email: `doctor.${stamp}@example.com`,
  phone: '70000001',
  password: 'Cypress2026!',
};

describe('Doctor Patient Portal — CP-01 a CP-10', () => {

  // --------------------------------------------------------
  // CP-01 (HU-01): la portada carga y muestra los accesos
  // --------------------------------------------------------
  it('CP-01: la portada muestra los accesos ADMIN, DOCTOR, APPOINTMENT y USER', () => {
    cy.visit(`${base}/index.jsp`);
    cy.get('.navbar-brand').should('contain.text', 'Doctor Patient Portal');
    cy.contains('a', 'ADMIN').should('be.visible').and('have.attr', 'href', 'admin_login.jsp');
    cy.contains('a', 'DOCTOR').should('be.visible').and('have.attr', 'href', 'doctor_login.jsp');
    cy.contains('a', 'APPOINTMENT').should('be.visible').and('have.attr', 'href', 'user_appointment.jsp');
    cy.contains('a', 'USER').should('be.visible').and('have.attr', 'href', 'user_login.jsp');
  });

  // --------------------------------------------------------
  // CP-02 (HU-02): registro de paciente con datos válidos
  // --------------------------------------------------------
  it('CP-02: registra un nuevo paciente y muestra "Register Successfully"', () => {
    cy.visit(`${base}/signup.jsp`);
    cy.get('input[name="fullName"]').type(patient.fullName);
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="password"]').type(patient.password);
    cy.contains('button', 'Register').click();
    cy.contains('Register Successfully').should('be.visible');
  });

  // --------------------------------------------------------
  // CP-03 (HU-03): login válido de paciente
  // --------------------------------------------------------
  it('CP-03: el paciente inicia sesión y su nombre aparece en la navbar', () => {
    cy.visit(`${base}/user_login.jsp`);
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="password"]').type(patient.password);
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'index.jsp');
    cy.get('#dropdownMenuButton1').should('contain.text', patient.fullName);
  });

  // --------------------------------------------------------
  // CP-04 (HU-04): login inválido de paciente
  // --------------------------------------------------------
  it('CP-04: login con credenciales inválidas muestra mensaje de error', () => {
    cy.visit(`${base}/user_login.jsp`);
    cy.get('input[name="email"]').type(`no.existe.${stamp}@example.com`);
    cy.get('input[name="password"]').type('incorrecta');
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'user_login.jsp');
    cy.contains('Invalid email or password').should('be.visible');
  });

  // --------------------------------------------------------
  // CP-05 (HU-05): login de Admin
  // --------------------------------------------------------
  it('CP-05: el admin inicia sesión y llega a su dashboard', () => {
    cy.visit(`${base}/admin_login.jsp`);
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin');
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'admin/index.jsp');
    cy.contains(/admin/i).should('be.visible');
  });

  // --------------------------------------------------------
  // CP-06 (HU-06): Admin agrega especialista
  // --------------------------------------------------------
  it('CP-06: el admin agrega una especialidad nueva', () => {
    // sesión de admin
    cy.visit(`${base}/admin_login.jsp`);
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin');
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'admin/index.jsp');

    // alta de especialidad (nombre único por ejecución) — el formulario está en un modal
    cy.visit(`${base}/admin/index.jsp`);
    cy.contains('.card', 'Specialist').click();
    cy.get('#exampleModal').should('be.visible');
    cy.get('#exampleModal input[name="specialistName"]').clear().type(doctor.specialist);
    cy.get('#exampleModal button[type="submit"]').click();
    cy.contains('Specialist added Successfully.').should('be.visible');
  });

  // --------------------------------------------------------
  // CP-07 (HU-07): Admin agrega doctor
  // --------------------------------------------------------
  it('CP-07: el admin agrega un doctor nuevo asociado a la especialidad', () => {
    cy.visit(`${base}/admin_login.jsp`);
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin');
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'admin/index.jsp');

    cy.visit(`${base}/admin/doctor.jsp`);
    cy.get('input[name="fullName"]').type(doctor.fullName);
    cy.get('input[name="dateOfBirth"]').type(doctor.dateOfBirth);
    cy.get('input[name="qualification"]').type(doctor.qualification);
    // el select de especialidades se puebla desde la BD (CP-06)
    cy.get('select[name="specialist"]').select(doctor.specialist);
    cy.get('input[name="email"]').type(doctor.email);
    cy.get('input[name="phone"]').type(doctor.phone);
    cy.get('input[name="password"]').type(doctor.password);
    cy.contains('button', 'Register').click();
    cy.contains('Doctor added Successfully').should('be.visible');
    // la lista de doctores se muestra en view_doctor.jsp
    cy.visit(`${base}/admin/view_doctor.jsp`);
    cy.contains(doctor.fullName).should('be.visible');
  });

  // --------------------------------------------------------
  // CP-08 (HU-08): paciente agenda una cita
  // Requiere: paciente registrado (CP-02) y doctor dado de alta (CP-07)
  // --------------------------------------------------------
  it('CP-08: el paciente agenda una cita con el doctor recién creado', () => {
    // login de paciente
    cy.visit(`${base}/user_login.jsp`);
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="password"]').type(patient.password);
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'index.jsp');

    // formulario de cita
    cy.visit(`${base}/user_appointment.jsp`);
    cy.get('input[name="fullName"]').type(patient.fullName);
    cy.get('select[name="gender"]').select('male');
    cy.get('input[name="age"]').type('30');
    cy.get('input[name="appointmentDate"]').type('2026-11-10');
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="phone"]').type('70000002');
    cy.get('input[name="diseases"]').type('Dolor de pecho');
    // el <option> muestra "Nombre (Especialidad)" y su value es el id del doctor;
    // se localiza por texto parcial y se selecciona por value
    cy.get('select[name="doctorNameSelect"] option')
      .contains(doctor.fullName)
      .then(($opt) => {
        cy.get('select[name="doctorNameSelect"]').select($opt.val());
      });
    cy.get('textarea[name="address"]').type('Av. Siempre Viva 742');
    cy.contains('button', 'Submit').click();

    // la cita queda registrada y visible para el paciente
    cy.url().should('include', 'user_appointment.jsp');
    cy.contains('Appointment is recorded Successfully.').should('be.visible');
    cy.visit(`${base}/view_appointment.jsp`);
    cy.contains('Dolor de pecho').should('be.visible');
  });

  // --------------------------------------------------------
  // CP-09 (HU-09): cambio de contraseña del paciente
  // --------------------------------------------------------
  it('CP-09: el paciente cambia su contraseña y vuelve a ingresar', () => {
    const newPassword = `New${stamp}`;

    // login con la contraseña actual
    cy.visit(`${base}/user_login.jsp`);
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="password"]').type(patient.password);
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'index.jsp');

    // cambio de contraseña
    cy.visit(`${base}/change_password.jsp`);
    cy.get('input[name="oldPassword"]').type(patient.password);
    cy.get('input[name="newPassword"]').type(newPassword);
    cy.contains('button', 'Change Password').click();
    cy.contains('Password Change Successfully.').should('be.visible');

    // logout y re-login con la contraseña nueva
    cy.visit(`${base}/userLogout`);
    cy.visit(`${base}/user_login.jsp`);
    cy.get('input[name="email"]').type(patient.email);
    cy.get('input[name="password"]').type(newPassword);
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'index.jsp');
    cy.get('#dropdownMenuButton1').should('contain.text', patient.fullName);

    // se restaura la contraseña original para no afectar otros casos
    cy.visit(`${base}/change_password.jsp`);
    cy.get('input[name="oldPassword"]').type(newPassword);
    cy.get('input[name="newPassword"]').type(patient.password);
    cy.contains('button', 'Change Password').click();
  });

  // --------------------------------------------------------
  // CP-10 (HU-10): login de Doctor (usa el doctor del CP-07)
  // --------------------------------------------------------
  it('CP-10: el doctor inicia sesión y ve su dashboard', () => {
    cy.visit(`${base}/doctor_login.jsp`);
    cy.get('input[name="email"]').type(doctor.email);
    cy.get('input[name="password"]').type(doctor.password);
    cy.contains('button', 'Submit').click();
    cy.url().should('include', 'doctor/index.jsp');
    cy.contains(doctor.fullName).should('be.visible');
  });

});
