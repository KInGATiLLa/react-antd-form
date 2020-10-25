import React from 'react';
import { isString, isEmptyObject } from '../../utils';
import { Errors } from './errors';
import { VALIDATE, LAYOUT } from '../constants';
import {
  FormAlert,
  FormAnchor,
  FormArray,
  FormAutoComplete,
  FormButton,
  FormCheckBox,
  FormDate,
  FormEditor,
  FormFile,
  FormInput,
  FormInputGroup,
  FormJson,
  FormCascader,
  FormMap,
  FormMarkDown,
  FormMentions,
  FormParagraph,
  FormRadio,
  FormRate,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormTag,
  FormTransfer,
  FormTreeSelect,
} from '../components';

const ICON_URL = '@ant-design/icons/';

export const supportedFields = [
  'alert', // done
  'anchor',
  'array',
  'autocomplete',
  'button',
  'checkbox',
  'date',
  'editor',
  'file',
  'input',
  'inputgroup',
  'json',
  'cascader',
  'map',
  'markdown',
  'mentions',
  'paragraph',
  'radio',
  'rate',
  'select',
  'slider',
  'switch',
  'tag',
  'transfer',
  'treeselect',
];

export const components = {
  alert: FormAlert, // done
  anchor: FormAnchor, // done
  array: FormArray,
  autocomplete: FormAutoComplete,
  button: FormButton,
  cascader: FormCascader,
  checkbox: FormCheckBox,
  date: FormDate,
  editor: FormEditor,
  file: FormFile,
  input: FormInput,
  inputgroup: FormInputGroup,
  json: FormJson,
  map: FormMap,
  markdown: FormMarkDown,
  mentions: FormMentions,
  paragraph: FormParagraph,
  radio: FormRadio,
  rate: FormRate,
  select: FormSelect,
  slider: FormSlider,
  switch: FormSwitch,
  tag: FormTag,
  transfer: FormTransfer,
  treeselect: FormTreeSelect,
};
const fields = supportedFields.join(', ');

/*  */
function FormElement(props) {
  const { config, ref } = props;
  checkField(config.field);
  let Component = components[config.field];
  return <Component ref={ref} {...props} />;
}
/*  */
function checkField(field) {
  if (supportedFields.indexOf(field) === -1) {
    // throw new TypeError(`Trying to use an unsupported type (${field}). Supported types: ${fields}`);
    throw new TypeError(`Та дэмжидэггүй формын элементийг хэрэглэхийг оролдсон байна (${field}). 
      Дараах формын элементүүдийг дэмжих боломжтой: ${fields}`);
    //
  }
}

/*
Icon props
  className: string
  style: CSSProperties
  spin: boolean (false)
  rotate: number
  twoToneColor: string (hex color)
*/
async function renderIcon(type) {
  // TODO implement svg icon render
  if (type) {
    const icon = isString(type) ? type : type['name'];
    const props = isString(type) ? {} : type;
    const IconComponent = await import(ICON_URL + icon);
    return <IconComponent {...props} />;
  }
  return null;
}

/* Get form specific element error with value */
function formError(type, key, value = null, replacer = null) {
  if (value && replacer) {
    throw new TypeError([type][key].replace(replacer, value));
  } else {
    throw new TypeError(Errors[type][key]);
  }
}

/*  */
function fieldHasValue(form, name) {
  const value = form.getFieldValue(name),
    touched = form.isFieldTouched(name),
    error = form.getFieldError(name);
  return value && (touched || !error);
}
/*  */
function fieldHasError(form, name) {
  const value = form.getFieldValue(name),
    touched = form.isFieldTouched(name),
    error = form.getFieldError(name);
  return error && (!value || touched);
}
/*  */
function fieldHasFeedback(error, hasValue, rules) {
  return (!isEmptyObject(rules) && error) || hasValue ? true : false;
}
/*  */
function fieldValidateStatus(error, hasValue, rules) {
  return !isEmptyObject(rules) && error ? VALIDATE.e : hasValue ? VALIDATE.s : null;
}
/*  */
function getElementLayout(layout) {
  let col = { span: 24 };
  const { labelCol, wrapperCol } = layout;
  if (layout.layout === LAYOUT.h) {
    col = { span: wrapperCol.span, offset: labelCol.span };
  }
  return col;
}

export {
  formError,
  renderIcon,
  fieldHasValue,
  fieldHasError,
  getElementLayout,
  fieldHasFeedback,
  fieldValidateStatus,
};
