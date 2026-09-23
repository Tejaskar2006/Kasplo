const {
  validateEmail,
  validateCreateCampaignBody,
  validateCreateRecipientBody,
  isNonEmptyString,
} = require('../src/utils/validation');

describe('Validation Utilities', () => {
  describe('isNonEmptyString', () => {
    it('returns true for a valid string', () => {
      expect(isNonEmptyString('hello')).toBe(true);
    });

    it('returns false for an empty string', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('returns no errors for a valid email', () => {
      expect(validateEmail('test@example.com')).toEqual([]);
    });

    it('returns an error for an invalid email format', () => {
      const result = validateEmail('not-an-email');
      expect(result.length).toBe(1);
      expect(result[0].message).toBe('Email format is invalid');
    });

    it('returns an error for missing email', () => {
      const result = validateEmail('');
      expect(result.length).toBe(1);
      expect(result[0].message).toBe('Email is required');
    });

    it('returns an error if email exceeds max length', () => {
      const longEmail = 'a'.repeat(310) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].message).toMatch(/Email must be at most 320 characters/);
    });
  });

  describe('validateCreateCampaignBody', () => {
    it('returns valid true with parsed data for a valid payload', () => {
      const payload = {
        name: 'My Campaign',
        subject: 'Discount Inside!',
        senderEmail: 'marketing@store.com',
        emailContent: '<p>Click here for 50% off</p>',
        scheduledAt: '2026-12-01T10:00:00.000Z',
      };
      const result = validateCreateCampaignBody(payload);
      expect(result.valid).toBe(true);
      expect(result.data.name).toBe('My Campaign');
      expect(result.data.senderEmail).toBe('marketing@store.com');
      expect(result.data.scheduledAt).toBeInstanceOf(Date);
    });

    it('trims string inputs and lowers senderEmail', () => {
      const payload = {
        name: '  My Campaign  ',
        subject: '  Discount Inside!  ',
        senderEmail: '  Marketing@STORE.com  ',
        emailContent: '  <p>Click here</p>  ',
        scheduledAt: '2026-12-01T10:00:00.000Z',
      };
      const result = validateCreateCampaignBody(payload);
      expect(result.valid).toBe(true);
      expect(result.data.name).toBe('My Campaign');
      expect(result.data.subject).toBe('Discount Inside!');
      expect(result.data.senderEmail).toBe('marketing@store.com');
      expect(result.data.emailContent).toBe('<p>Click here</p>');
    });

    it('returns errors for missing required fields', () => {
      const result = validateCreateCampaignBody({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const fields = result.errors.map((e) => e.field);
      expect(fields).toContain('name');
      expect(fields).toContain('subject');
      expect(fields).toContain('senderEmail');
      expect(fields).toContain('emailContent');
      expect(fields).toContain('scheduledAt');
    });

    it('returns an error if body is not an object', () => {
      const result = validateCreateCampaignBody(null);
      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe('body');
    });
  });

  describe('validateCreateRecipientBody', () => {
    it('returns valid true for a valid payload', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const result = validateCreateRecipientBody(payload);
      expect(result.valid).toBe(true);
      expect(result.data.name).toBe('John Doe');
      expect(result.data.email).toBe('john@example.com');
    });

    it('returns errors for missing name or email', () => {
      const result = validateCreateRecipientBody({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
      const fields = result.errors.map((e) => e.field);
      expect(fields).toContain('name');
      expect(fields).toContain('email');
    });
  });
});
