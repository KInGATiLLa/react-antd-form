import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
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
  FormMention,
  FormParagraph,
  FormRadio,
  FormRate,
  FormSelect,
  FormSlider,
  FormTag,
  FormToggle,
  FormTransfer,
  FormTreeSelect,
} from '../components';
import { Errors } from './errors';
import { isString, isEmptyObject, isHasProp } from '../../utils';
import { VALIDATE, LAYOUT } from '../constants';

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
  'mention',
  'paragraph',
  'radio',
  'rate',
  'select',
  'slider',
  'tag',
  'toggle',
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
  mention: FormMention,
  paragraph: FormParagraph,
  radio: FormRadio,
  rate: FormRate,
  select: FormSelect,
  slider: FormSlider,
  tag: FormTag,
  toggle: FormToggle,
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
/*  */
function withLang(type, lang) {
  return lang && type[lang] ? type[lang] : type;
}
/*  */
function createFormItemLabel(label, tooltip, lang) {
  const { iconType, iconTheme } = tooltip;
  return (
    <span>
      {withLang(label, lang)}&nbsp;
      <Tooltip title={withLang(tooltip, lang)}>
        {/* <Icon
          type={iconType ? iconType : 'question-circle-o'}
          theme={iconTheme ? iconTheme : 'outlined'}
        /> */}
      </Tooltip>
    </span>
  );
}
/*  */
function renderIcons(type) {
  if (type) {
    // return isString(type) ? <Icon type={type} /> : <Icon {...type} />;
  }
  return null;
}
/*  */
function formLabel(label, tooltip, lang) {
  return tooltip ? createFormItemLabel(label, tooltip, lang) : withLang(label, lang);
}
/*  */
function formError(type, key, value = null, replacer = null) {
  if (value && replacer) {
    throw new TypeError(Errors[type][key].replace(replacer, value));
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
/*  */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
/*  */
function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
}
/*  */
function getServePath(original, token) {
  const path = original;
  const fname = path.substring(path.lastIndexOf('/') + 1, path.length);
  const fpath = path.substring(path.lastIndexOf('/authorized/') + 1, path.indexOf(fname));
  const furl = original.replace('/' + fpath + fname, '/authorized');
  const rdata = { path: fpath + fname, token };
  return furl + '?r=' + btoa(unescape(encodeURIComponent(JSON.stringify(rdata))));
}
/*  */
function generateId(len) {
  const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < len; i++) {
    text += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return text;
}
/*  */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}
/*  */
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}
/*  */
function isSSR() {
  return window === undefined && document === undefined;
}
/*  */
function isClient() {
  return window !== undefined && document !== undefined;
}
/*  */
function compareObjectValue(prevObj, nextObj) {
  const v1 = [],
    v2 = [];
  Object.keys(prevObj)
    .sort()
    .forEach(key => {
      v1.push(prevObj[key]);
      v2.push(nextObj[key]);
    });
  return JSON.stringify(v1) === JSON.stringify(v2);
}
/*  */
function compareArrayValue(prevArr, nextArr) {
  return JSON.stringify(prevArr) === JSON.stringify(nextArr);
}
/*  */
function hasRules(validate) {
  if (validate) {
    return validate.some(item => {
      return item.rules && item.rules.length;
    });
  }
  return false;
}
/*  */
function isEqual(prevProps, nextProps, type) {
  return prevProps[type] === nextProps[type];
}

export {
  isSSR,
  isEqual,
  isClient,
  withLang,
  hasRules,
  formLabel,
  formError,
  getBase64,
  generateId,
  renderIcons,
  FormElement,
  getFileName,
  getServePath,
  fieldHasError,
  fieldHasValue,
  getElementLayout,
  fieldHasFeedback,
  compareArrayValue,
  compareObjectValue,
  fieldValidateStatus,
  createFormItemLabel,
  useWindowDimensions,
};
