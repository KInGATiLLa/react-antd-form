import { ICONS } from './icons';
const VALIDATION_MSG = {
  required: {
    default: {
      en: 'Please enter the required information!',
      mn: 'Заавал мэдээлэл оруулна уу!',
    },
    label: {
      en: 'Please enter a lbl!',
      mn: 'lbl оруулна уу!',
    },
  },
  len: {
    text: {
      en: 'Enter only len characters in a field!',
      mn: 'Тэмдэгтийн уртыг len байхаар оруулна уу!',
    },
    // search: 'Хайх утгыг {len} байхаар оруулна уу!',
    password: {
      en: 'Enter only len characters in password field!',
      mn: 'Пасспортын утгыг len байхаар оруулна уу!',
    },
    textarea: {
      en: 'Enter only len characters in a field!',
      mn: 'Тэмдэгтийн уртыг len байхаар оруулна уу!',
    },
    number: {
      en: 'Enter only len characters in number field!',
      mn: 'Тоон утгыг len байхаар оруулна уу!',
    },
  },
  // custom
  register: {
    en: 'Please enter a valid register number!',
    mn: 'Зөв регистерийн дугаар оруулна уу!',
  },
  json: {
    en: 'Please enter a valid json string!',
    mn: 'Зөв "json" тэмдэгт оруулна уу!',
  },
  equal: {
    en: 'Must be equal to lbl!',
    mn: 'lbl-ын утгатай ижил байх ёстой!',
  },
  notequal: {
    en: 'Must be not equal to lbl!',
    mn: 'lbl-ын утгатай ижил байж болохгүй!',
  },
  base64: {
    en: 'Please enter a valid base64 string!',
    mn: 'Зөв "base64" тэмдэгт оруулна уу!',
  },
  // ant async-validator
  email: {
    en: 'Please enter a valid email address!',
    mn: 'Зөв и-мэйл хаяг оруулна уу!',
  },
  min: {
    en: 'Please enter minimum [min] of characters!',
    mn: 'Хамгийн багадаа [min]-н тэмдэгт оруулна уу!',
  },
  max: {
    en: 'Please enter maximum [max] of characters!',
    mn: 'Хамгийн ихдээ [max]-н тэмдэгт оруулна уу!',
  },
  whitespace: {
    en: 'Blank space are not allowed this field!',
    mn: 'Хоосон зай авахгүй бичнэ үү!',
  },
  string: {
    en: 'Please enter a valid string value!',
    mn: 'Зөв тэмдэгт утга оруулна уу!',
  },
  boolean: {
    en: 'Please enter a valid boolean value!',
    mn: 'Зөв логик утга оруулна уу!',
  },
  method: {
    en: 'Please enter a valid method!',
    mn: 'Зөв функцэн илэрхийлэл оруулна уу!',
  },
  regexp: {
    en: 'Please enter a valid regexp expression!',
    mn: 'Зөв regexp илэрхийлэл оруулна уу!',
  },
  integer: {
    en: 'Please enter a valid integer value!',
    mn: 'Зөв тоон төрлийн утга оруулна уу!',
  },
  float: {
    en: 'Please enter a valid float value!',
    mn: 'Зөв бутархай тоон төрлийн утга оруулна уу!',
  },
  array: {
    en: 'Please enter a valid array!',
    mn: 'Зөв массив төрлийн утга оруулна уу!',
  },
  object: {
    en: 'Please enter a valid object!',
    mn: 'Зөв обьект төрлийн утга оруулна уу!',
  },
  enum: {
    en: 'Please enter a valid enum!',
    mn: 'Зөв enum төрлийн утга оруулна уу!',
  },
  date: {
    en: 'Please enter a valid date!',
    mn: 'Зөв огноо оруулна уу!',
  },
  url: {
    en: 'Please enter a valid url!',
    mn: 'Зөв линк оруулна уу!',
  },
  hex: {
    en: 'Please enter a valid hex value!',
    mn: 'Зөв 16-тын тоон утга оруулна уу!',
  },
  any: {
    en: 'Please enter any value!',
    mn: 'Юу ч хамаагүй оруулна уу!',
  },
  sizeExceeded: {
    en: 'Please choose valid file type!',
    mn: 'Зөв файлын төрөл сонгоно уу!',
  },
  invalidExtention: {
    en: 'Please enter the file size less than fs MB!',
    mn: 'Файлын хэмжээг fs MB байхаар оруулна уу!',
  },
  arrayInput: {
    en: 'Please fill in all fields!',
    mn: 'Бүх талбарыг бөглөнө үү!',
  },
};

const LAYOUT = {
  h: 'horizontal',
  v: 'vertical',
  i: 'inline',
};

const VALIDATE = {
  e: 'error',
  v: 'validating',
  s: 'success',
};

const ALERT_POS = {
  t: 'top',
  b: 'bottom',
};

export { VALIDATION_MSG, LAYOUT, VALIDATE, ALERT_POS, ICONS };
