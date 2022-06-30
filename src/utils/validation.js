export const isRequired = field => ({
  required: true,
  message: `${field || 'Field'} is required`,
  trigger: 'blur',
});

export const hasLength = (min, max) => ({
  validator: (rule, value, callback) => {
    if (min && String(value).length < min) {
      callback(new Error(`Field should be at least ${min} characters long`));
    } else if (max && String(value).length > max) {
      callback(new Error(`Field should not be more than ${max} characters`));
    } else {
      callback();
    }
  },
  trigger: 'blur',
});

export const FullName = () => ({
  validator: (rule, value, callback) => {
    if (!/[^a-zA-Z ]/.test(value)) {
      callback();
    } else {
      callback(new Error('No numbers or special chracters allowed'));
    }
  },
  trigger: 'blur',
});

export const isEmail = () => ({
  validator: (rule, value, callback) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)){1,2}$/;
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('Must be a valid email'));
    }
  },
  trigger: 'blur',
});

export const emailPolicy = [isRequired(), isEmail()];
export const fullNamePolicy = [isRequired(), hasLength(3, 70), FullName()];
export const passwordPolicy = [isRequired(), hasLength(6, 15)];
