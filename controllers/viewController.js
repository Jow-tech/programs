// Controlador para renderizar as views do frontend

const renderDashboard = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Dashboard - Sistema de Reservas',
    content: '../pages/dashboard'
  });
};

const renderUsers = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Gerenciar Usuários - Sistema de Reservas',
    content: '../pages/users'
  });
};

const renderSpaces = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Gerenciar Espaços - Sistema de Reservas',
    content: '../pages/spaces'
  });
};

const renderReservations = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Gerenciar Reservas - Sistema de Reservas',
    content: '../pages/reservations'
  });
};

const renderCleaning = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Controle de Limpeza - Sistema de Reservas',
    content: '../pages/cleaning'
  });
};

const renderEmployees = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Gerenciar Funcionários - Sistema de Reservas',
    content: '../pages/employees'
  });
};

module.exports = {
  renderDashboard,
  renderUsers,
  renderSpaces,
  renderReservations,
  renderCleaning,
  renderEmployees
};
