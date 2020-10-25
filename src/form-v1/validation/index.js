import validator from 'validator';
import { VALIDATION_MSG } from '../constants';
import { isString, isBoolean } from '../../utils';
import { withLang } from '../utils';

class FormValidation {
  validations = [
    // custom validators
    'register',
    'json',
    'equal',
    'notEqual',
    'base64',
    'arrayInput',
    // ant design in common
    'required',
    'whiteSpace',
    'max',
    'min',
    'len',
    // async validator in common
    'email',
    'string',
    'boolean',
    'method',
    'regexp',
    'integer',
    'float',
    'array',
    'object',
    'enum',
    'date',
    'url',
    'hex',
    'any',
    // transforms
    'uppercase',
    'lowercase',
    'capitalize',
  ];
  lang = 'mn';
  transforms = ['uppercase', 'lowercase', 'capitalize'];
  callbackMessage = ['register', 'json', 'equal', 'notEqual', 'base64', 'arrayInput'];
  comparisonRules = ['equal', 'notEqual'];
  regnumLetterScope = 'ЧАБВДГЕЖЗРИЙКЛМНОПСТУФЦХЩЫЬЭЯЮШ';
  regnumNumberScope = '24010203050406070817091011121314151618192021232226272829313025';
  digit = '1234567890';

  constructor(form) {
    this.form = form;
    this.validator = validator;
  }

  message(errorType, field, lang, validValue = null) {
    let error = null;
    const { label, specificType } = field;
    switch (errorType) {
      case 'required':
        error = this.getRequiredMsg(label, lang);
        break;
      case 'min':
      case 'max':
        error = VALIDATION_MSG[errorType][lang].replace(`[${errorType}]`, validValue);
        break;
      case 'len':
        error = VALIDATION_MSG.len[specificType][lang].replace(errorType, validValue);
        break;
      default:
        error = VALIDATION_MSG[errorType][lang];
        break;
    }
    return error;
  }

  getRequiredMsg(label, lang) {
    const type = label ? 'label' : 'default';
    let msg = VALIDATION_MSG.required[type][lang];
    if (label) {
      const lbl = label[lang] ? label[lang] : label;
      return msg.replace('lbl', lbl);
    }
    return msg;
  }

  getFormRules(config, field, lng) {
    const formValidations = [];
    const { rules } = field;
    const lang = lng ? lng : this.lang;
    Object.keys(rules).forEach(validation => {
      let rule = {};
      if (this.validations.indexOf(validation) > -1) {
        const msg = this.getCustomMessage(validation, lang);
        const ruleField = this.getCompareField(config, lang, rules, validation);
        switch (validation) {
          case 'register':
            rule = { validator: (rule, val, cb) => this.registerNumber(rule, val, cb, msg) };
            break;
          case 'json':
            rule = { validator: (rule, val, cb) => this.isJSON(rule, val, cb, msg) };
            break;
          case 'equal':
            rule = { validator: (rule, val, cb) => this.equalTo(rule, val, cb, ruleField, msg) };
            break;
          case 'notEqual':
            rule = { validator: (rule, val, cb) => this.notEqualTo(rule, val, cb, ruleField, msg) };
            break;
          case 'base64':
            rule = { validator: (rule, val, cb) => this.isBase64(rule, val, cb, msg) };
            break;
          case 'arrayInput':
            rule = { validator: (rule, val, cb) => this.validateArrayInput(rule, val, cb, msg) };
            break;
          case 'required':
          case 'whiteSpace':
            rule = { [validation]: true, message: this.message(validation, field, lang) };
            break;
          case 'len':
          case 'min':
          case 'max':
          case 'enum':
          case 'pattern':
            rule = {
              [validation]: rules[validation],
              message: this.message(validation, field, lang, rules[validation]),
            };
            break;
          default:
            if (this.transforms.indexOf(validation) === -1) {
              rule = { type: validation, message: this.message(validation, field, lang) };
            }
            break;
        }
        formValidations.push(rule);
      } else {
        throw new TypeError(
          `Wrong rules provided. Supported rules is: ${this.validations.join(
            ', ',
          )}. Check your rules!`,
        );
      }
    });
    return formValidations;
  }

  getCustomMessage(v, lang) {
    return this.callbackMessage.indexOf(v) > -1 ? VALIDATION_MSG[v][lang] : null;
  }

  getCompareField(config, lang, rules, v) {
    if (this.comparisonRules.indexOf(v) > -1) {
      let field = config.find(cfg => cfg.name === rules[v]);
      if (field) {
        return { name: field.name, label: withLang(field.label, lang) };
      } else {
        throw new TypeError(`${v} rule must have correct config name!`);
      }
    }
  }

  getFieldHelp = rules => {
    if (isBoolean(rules.help)) {
    }
    if (isString(rules.help)) {
    }
    return null;
  };

  textCapitalize = value => value.replace(/(?:^|\s)\S/g, m => m.toUpperCase());

  transformValue = (transform, value) => {
    switch (transform) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return this.textCapitalize(value);
      default:
        return value;
    }
  };

  registerNumber(rule, value, callback, message) {
    if (value) {
      value = value.trim().toUpperCase();
      if (value.length === 10) {
        const regNumLetterScope = this.regnumLetterScope;
        const regNumNumberScope = this.regnumNumberScope;
        const a = '5678987';
        let checkInt = 0,
          k,
          s1 = 0,
          j,
          s = 0;
        if (
          regNumLetterScope.indexOf(value[0]) !== -1 &&
          regNumLetterScope.indexOf(value[1]) !== -1
        ) {
          for (let numIndex = 2; numIndex < 10; numIndex++) {
            if (this.digit.indexOf(value[numIndex]) !== -1) {
              numIndex = 10;
              const day = value[6].toString() + value[7].toString();
              const dayInt = parseInt(day, 10);
              if (dayInt < 32 && dayInt > 0) {
                checkInt = 1;
              } else {
                return callback(message);
              }
            }
          }
          if (checkInt === 1) {
            for (let ii = 0; ii < 7; ii++) {
              s = s + parseInt(value[ii + 2].toString(), 10) * parseInt(a[ii].toString(), 10);
            }
            for (let ii = 0; ii < 2; ii++) {
              j = regNumLetterScope.indexOf(value[ii]);
              if (ii === 0) {
                s1 =
                  parseInt(regNumNumberScope.substr(j * 2, 1), 10) +
                  2 * parseInt(regNumNumberScope.substr(j * 2 + 1, 1), 10);
              } else {
                s1 =
                  s1 +
                  3 * parseInt(regNumNumberScope.substr(j * 2, 1), 10) +
                  4 * parseInt(regNumNumberScope.substr(j * 2 + 1, 1), 10);
              }
            }
            k = (s1 % 11) + (s % 11);
            if (k === 10) {
              k = 1;
            }
            if (k > 10) {
              k = k - 11;
            }
            if (parseInt(value[9].toString(), 10) !== k) {
              return callback(message);
            }
            return callback();
          } else {
            return callback(message);
          }
        } else {
          return callback(message);
        }
      } else {
        if (value.length === 0) {
          return callback();
        }
        return callback(message);
      }
    } else {
      return callback();
    }
  }

  isJSON(rule, value, callback, message) {
    if (this.validator.isJSON(value)) {
      callback();
    } else {
      callback(message);
    }
  }
  isBase64(rule, value, callback, message) {
    if (this.validator.isBase64(value)) {
      callback();
    } else {
      callback(message);
    }
  }

  equalTo(rule, value, callback, field, message) {
    const { name, label } = field;
    if (value && value !== this.form.getFieldValue(name)) {
      callback(message.replace('lbl', label));
    } else {
      callback();
    }
  }

  notEqualTo(rule, value, callback, field, message) {
    const { name, label } = field;
    if (value && value === this.form.getFieldValue(name)) {
      callback(message.replace('lbl', label));
    } else {
      callback();
    }
  }

  validateTo = (rule, value, callback, field) => {
    const { name, dirty } = field;
    if (value && dirty) {
      this.form.validateFields([name], { force: true });
    } else {
      callback();
    }
  };

  validateArrayInput = (rule, value, callback, message) => {
    if (value !== undefined && Array.isArray(value)) {
      const nullOrEmpty = value.filter(
        v => v.label !== null && v.value !== null && v.value !== '' && v.label !== '',
      );
      if (value.length === nullOrEmpty.length) {
        callback();
      } else {
        callback(message);
      }
    } else {
      callback(message);
    }
  };

  customValidation = () => {};
}

export default FormValidation;
