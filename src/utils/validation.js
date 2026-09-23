const EMAIL_MAX_LENGTH = 320;
const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateEmail(value, field = 'email') {
  const errors = [];
  if (!isNonEmptyString(value)) {
    errors.push({ field, message: 'Email is required' });
    return errors;
  }
  const trimmed = value.trim();
  if (trimmed.length > EMAIL_MAX_LENGTH) {
    errors.push({ field, message: `Email must be at most ${EMAIL_MAX_LENGTH} characters` });
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    errors.push({ field, message: 'Email format is invalid' });
  }
  return errors;
}

function parseScheduledAt(value) {
  if (value === undefined || value === null || value === '') {
    return { errors: [{ field: 'scheduledAt', message: 'Scheduled date and time is required' }] };
  }
  if (typeof value !== 'string' && !(value instanceof Date)) {
    return { errors: [{ field: 'scheduledAt', message: 'Scheduled date and time must be an ISO 8601 string' }] };
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { errors: [{ field: 'scheduledAt', message: 'Scheduled date and time is invalid' }] };
  }

  return { date };
}

function validateCreateCampaignBody(body) {
  const errors = [];
  const payload = body && typeof body === 'object' && !Array.isArray(body) ? body : null;

  if (!payload) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a JSON object' }],
    };
  }

  if (!isNonEmptyString(payload.name)) {
    errors.push({ field: 'name', message: 'Campaign name is required' });
  } else if (payload.name.trim().length > 255) {
    errors.push({ field: 'name', message: 'Campaign name must be at most 255 characters' });
  }

  if (!isNonEmptyString(payload.subject)) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  } else if (payload.subject.trim().length > 500) {
    errors.push({ field: 'subject', message: 'Subject must be at most 500 characters' });
  }

  errors.push(...validateEmail(payload.senderEmail, 'senderEmail'));

  if (!isNonEmptyString(payload.emailContent)) {
    errors.push({ field: 'emailContent', message: 'Email content is required' });
  }

  const scheduled = parseScheduledAt(payload.scheduledAt);
  if (scheduled.errors) {
    errors.push(...scheduled.errors);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: payload.name.trim(),
      subject: payload.subject.trim(),
      senderEmail: payload.senderEmail.trim().toLowerCase(),
      emailContent: payload.emailContent.trim(),
      scheduledAt: scheduled.date,
    },
  };
}

function validateCreateRecipientBody(body) {
  const errors = [];
  const payload = body && typeof body === 'object' && !Array.isArray(body) ? body : null;

  if (!payload) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a JSON object' }],
    };
  }

  if (!isNonEmptyString(payload.name)) {
    errors.push({ field: 'name', message: 'Recipient name is required' });
  } else if (payload.name.trim().length > 255) {
    errors.push({ field: 'name', message: 'Recipient name must be at most 255 characters' });
  }

  errors.push(...validateEmail(payload.email, 'email'));

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
    },
  };
}

module.exports = {
  validateCreateCampaignBody,
  validateCreateRecipientBody,
  validateEmail,
  isNonEmptyString,
};
