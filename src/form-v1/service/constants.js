export { ICONS } from '../constants';

export const HTTPOPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const VALIDATION_TYPES = {
  required: {
    label: 'Заавал бөглөнө',
    value: 'required',
  },
  registerNumber: {
    label: 'Регистрийн дугаар',
    value: 'registerNumber',
  },
  email: {
    label: 'И-Мэйл хаяг',
    value: 'email',
  },
  number: {
    label: 'Тоо',
    value: 'number',
  },
  url: {
    label: 'Холбоос (URL)',
    value: 'url',
  },
  date: {
    label: 'Он сар',
    value: 'date',
  },
  array: {
    label: 'Массив (Array)',
    value: 'Array',
  },
  json: {
    label: 'JSON обьект',
    value: 'json',
  },
};

export const API_TYPES = {
  library: {
    context: 'library/list',
    includeToken: true,
  },
  location: {
    context: 'location/list',
    includeToken: true,
  },
  dms: {
    context: 'location/dms',
    includeToken: true,
  },
  file: {
    context: 'upload',
    includeToken: true,
  },
};

export const SPECIFIC_TYPES = {
  options: [
    { value: 'static', label: 'Статик' },
    { value: 'library', label: 'Лавлах сан' },
  ],
  date: [
    { value: 'date', label: 'Огноо (YYYY-MM-DD)' },
    { value: 'daterange', label: 'Хугацаа (YYYY-MM-DD / YYYY-MM-DD)' },
  ],
  file: [
    { value: 'text', label: 'Бичиг баримт' },
    { value: 'picture', label: 'Зураг' },
  ],
};

export const CONTAINER_TYPES = [
  {
    title: 'Маягт',
    id: 'formGroup',
    icon: 'layout',
    name: 'form',
  },
];

export const BUTTON_TYPES = [
  {
    type: 'button',
    title: 'Илгээх',
    id: 'send',
    icon: 'enter',
    name: 'Илгээх',
  },
  {
    type: 'button',
    title: 'Үргэлжлүүлэх',
    id: 'continue',
    icon: 'right',
    name: 'Үргэлжлүүлэх',
  },
  {
    type: 'button',
    title: 'Хадгалах',
    id: 'save',
    icon: 'save',
    name: 'Хадгалах',
  },
];

export const FIELD_TYPES = [
  {
    value: 'map',
    icon: 'global',
    name: 'Map',
  },
  {
    value: 'input',
    name: 'Input',
    icon: 'file-text',
    specificTypes: [
      { value: 'text', label: 'Текст' },
      { value: 'currency', label: 'Үнийн дүн' },
      { value: 'password', label: 'Нууц үг' },
      { value: 'number', label: 'Тоо' },
    ],
    validations: [
      VALIDATION_TYPES.registerNumber,
      VALIDATION_TYPES.email,
      VALIDATION_TYPES.url,
      VALIDATION_TYPES.number,
    ],
  },
  {
    value: 'location',
    icon: 'global',
    name: 'Location',
    apiOptions: API_TYPES.location,
    specificTypes: SPECIFIC_TYPES.options,
  },
  {
    value: 'select',
    icon: 'select',
    name: 'Select',
    apiOptions: API_TYPES.library,
    specificTypes: SPECIFIC_TYPES.options,
  },
  {
    value: 'checkbox',
    name: 'Checkbox',
    icon: 'check',
    apiOptions: API_TYPES.library,
    specificTypes: SPECIFIC_TYPES.options,
  },
  {
    value: 'radio',
    name: 'Radio',
    icon: 'select',
    apiOptions: API_TYPES.library,
    specificTypes: SPECIFIC_TYPES.options,
  },
  {
    value: 'datepicker',
    icon: 'calendar',
    name: 'Date',
    specificTypes: SPECIFIC_TYPES.date,
    validations: [VALIDATION_TYPES.date, VALIDATION_TYPES.array],
  },
  {
    value: 'json',
    name: 'JSON',
    icon: 'database',
    validations: [VALIDATION_TYPES.json, VALIDATION_TYPES.array],
  },
  {
    value: 'textarea',
    name: 'TextArea',
    icon: 'file-word',
  },
  {
    value: 'paragraph',
    name: 'Paragraph',
    icon: 'file-text',
  },
  {
    value: 'anchor',
    name: 'Anchor',
    icon: 'link',
    validations: [VALIDATION_TYPES.required, VALIDATION_TYPES.url],
  }, // routerLink or link
  {
    value: 'toggle',
    name: 'Toggle',
    icon: 'check-square',
  },
  {
    value: 'file',
    icon: 'file-pdf',
    name: 'File',
    apiOptions: API_TYPES.file,
    specificTypes: SPECIFIC_TYPES.file,
  },
];

export const RELATION = {
  action: [
    { value: 'INCLUDE', label: 'Хамруулах' },
    { value: 'EXCLUDE', label: 'Хамруулахгүй байх' },
    { value: 'DISABLE', label: 'Идэвхтэй болгох' },
    { value: 'ENABLE', label: 'Идэвхгүй болгох' },
  ],
  connective: [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
  ],
  condition: [
    { value: 'EQUAL', label: 'EQUAL' },
    { value: 'NOTEQUAL', label: 'NOTEQUAL' },
  ],
  when: [],
};

export const ARITHMETIC = {
  action: [
    { value: 'VALUE', label: 'Үр дүнд тооцогдох утга' },
    { value: 'OPERATION', label: 'Үр дүн харуулах утга' },
  ],
};
