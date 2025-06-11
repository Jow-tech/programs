// Utilitários para a interface

// Mostrar mensagens de feedback para o usuário
function showMessage(message, type = 'info') {
  const messageContainer = document.getElementById('message-container');
  if (!messageContainer) return;

  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="message-close">&times;</button>
  `;

  messageContainer.appendChild(messageElement);

  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (messageElement.parentElement) {
      messageElement.remove();
    }
  }, 5000);
}

// Mostrar loading
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading">Carregando...</div>';
  }
}

// Esconder loading
function hideLoading() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(el => el.remove());
}

// Formatar data para exibição
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Formatar data e hora para exibição
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

// Formatar data para input HTML
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Formatar datetime para input HTML
function formatDateTimeForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar telefone (formato brasileiro)
function isValidPhone(phone) {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
  return phoneRegex.test(phone);
}

// Limpar formulário
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

// Confirmar ação
function confirmAction(message) {
  return confirm(message);
}

// Capitalizar primeira letra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Traduzir status para português
function translateStatus(status) {
  const translations = {
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'cancelled': 'Cancelado',
    'completed': 'Concluído',
    'in_progress': 'Em Andamento'
  };
  return translations[status] || status;
}

// Obter classe CSS para status
function getStatusClass(status) {
  const classes = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'cancelled': 'status-cancelled',
    'completed': 'status-completed',
    'in_progress': 'status-progress'
  };
  return classes[status] || 'status-default';
}

// Validar formulário genérico
function validateForm(formData, requiredFields) {
  const errors = [];

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors.push(`O campo ${field} é obrigatório`);
    }
  });

  if (formData.email && !isValidEmail(formData.email)) {
    errors.push('Email inválido');
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.push('Telefone inválido');
  }

  return errors;
}

// Debounce para pesquisa
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
