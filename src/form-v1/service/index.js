import {
  ICONS,
  RELATION,
  API_TYPES,
  ARITHMETIC,
  HTTPOPTIONS,
  FIELD_TYPES,
  BUTTON_TYPES,
  CONTAINER_TYPES,
} from './constants';

class FormService {
  static get containers() {
    return CONTAINER_TYPES;
  }

  static get buttons() {
    return BUTTON_TYPES;
  }

  static get fields() {
    return FIELD_TYPES;
  }

  static get icons() {
    return ICONS;
  }

  static get relation() {
    return RELATION;
  }

  static get arithmetic() {
    return ARITHMETIC;
  }

  libraries = [];
  locations = [];
  dateFormat = 'YYYY-MM-DD';

  constructor(config) {
    this.config = config;
  }

  fromJSON = (inputJson, buttons = []) => {
    if (inputJson) {
      const formData = {
        submitOnEnter: inputJson.submitOnEnter || false,
        groups: [],
      };
      if (Array.isArray(inputJson)) {
        inputJson.forEach(group => {
          formData.groups.push(this.fromGroupJson(group));
        });
      } else {
        formData.groups.push(this.fromGroupJson(inputJson));
        if (inputJson.button) {
          formData['button'] = inputJson.button;
          delete inputJson.button;
        }
      }
      return formData;
    }
  };

  fromGroupJson = group => {
    const inputRows = [];
    if (Array.isArray(group.data)) {
      group.data.forEach(row => {
        inputRows.push(row);
      });
    } else {
      Object.keys(group.data).forEach(key => {
        const row = this.clone(group.data[key]);
        row['name'] = key;
        inputRows.push(row);
      });
    }
    return {
      layout: group.layout,
      toggle: group.toggle,
      toggled: group.toggled,
      legend: group.legend,
      button: group.button || [],
      rows: inputRows,
    };
  };

  map = (values, hasIcon = false) => {
    const datas = [];
    values.forEach(element => {
      if (typeof element === 'string') {
        const item = {
          value: element,
          label: element,
        };
        if (hasIcon) {
          item['icon'] = element;
        }
        datas.push(item);
      } else {
        const data = {};
        if (hasIcon) {
          data['icon'] = element.icon;
        }
        data['label'] = element.name || element.label;
        data['value'] = element.code || element.value;
        datas.push(data);
      }
    });
    return datas;
  };

  clone = data => (data ? JSON.parse(JSON.stringify(data)) : null);

  isValidField = (form, fieldName) => {
    return form && fieldName;
  };

  isTouchedField = (form, fieldName) => {};

  getFieldErrors = (form, fieldName) => {};

  getTrimmedValue = value => {
    if (typeof value === 'string' || value instanceof String) {
      return value ? value.trim() : value;
    }
    return value;
  };

  getDateFormat = () => this.dateFormat;

  getConfigField = (config, name) => {
    let result = null;
    config.groups.forEach(group => {
      group.rows.forEach(row => {
        if (row.name === name) {
          result = row;
        }
      });
    });
    return result;
  };

  getConfigFieldBy = (config, name, field) => {
    let result = null;
    config.groups.forEach(group => {
      group.rows.forEach(row => {
        if (row.name === name && row.field === field) {
          result = row;
        }
      });
    });
    return result;
  };

  getConfigArithmetic = (config, element) => {
    let result = null;
    config.groups.forEach(group => {
      group.rows.forEach(row => {
        if (row.name === element && row.arithmetic) {
          result = row.arithmetic;
        }
      });
    });
    return result;
  };

  getConfigRelation = (config, element) => {
    let result = null;
    config.groups.forEach(group => {
      group.rows.forEach(row => {
        if (row.name === element && row.relation) {
          result = row.relation;
        }
      });
    });
    return result;
  };

  library = name =>
    new Promise((resolve, reject) => {
      const cached = this.libraries.find(l => l.library === name);
      if (cached) {
        resolve(cached);
      } else {
        const { context, includeToken } = API_TYPES.library;
        this.post(context + `/${name}`, includeToken)
          .then(library => {
            this.libraries.push(library);
            resolve(library);
          })
          .catch(err => reject(err));
      }
    });

  location = parentId =>
    new Promise((resolve, reject) => {
      const cached = this.locations.find(location => {
        const cachedLocation = [];
        location.forEach(loc => {
          if (loc.parentId === parentId) {
            cachedLocation.push(loc);
          }
        });
        return cachedLocation.length > 0;
      });
      if (cached) {
        resolve(cached);
      } else {
        const { context, includeToken } = API_TYPES.location;
        this.post(context, parentId, includeToken)
          .then(location => {
            this.locations.push(location);
            resolve(location);
          })
          .catch(err => reject(err));
      }
    });

  getRequestUrl = cdn => (cdn ? this.config.CDN_URL : this.config.API_URL);

  upload = (options, data) => {
    return this.post(options.context, data, options.includeToken, true);
  };

  get = (url, token = false, cdn = false) =>
    new Promise((resolve, reject) => {
      const headers = this.getHeader(token, cdn);
      const options = {
        ...headers,
      };
      const initUrl = this.getRequestUrl(cdn);
      fetch(initUrl + url, options)
        .then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });

  post = (url, data, token = false, cdn = false) =>
    new Promise((resolve, reject) => {
      const headers = this.getHeader(token, cdn);
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        ...headers,
      };
      const initUrl = this.getRequestUrl(cdn);
      fetch(initUrl + url, options)
        .then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });

  getToken = (token = 'api') => {
    if (token === 'cdn') {
      return localStorage.getItem(this.config.CDN_TOKEN);
    }
    return localStorage.getItem(this.config.API_TOKEN);
  };

  getHeader = (token = false, cdn = false) => {
    let headers = HTTPOPTIONS;

    if (token) {
      const token = cdn ? this.getToken('cdn') : this.getToken();
      const authHeader = {
        Authorization: `${this.config.HEADER_PREFIX} ${token}`,
      };
      return {
        headers: {
          ...HTTPOPTIONS.headers,
          ...authHeader,
        },
      };
    }
    return headers;
  };

  getHeaderPrefix = () => this.config.HEADER_PREFIX;
}

export default FormService;
