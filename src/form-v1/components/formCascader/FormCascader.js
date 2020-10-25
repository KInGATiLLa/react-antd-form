import React, { memo, forwardRef, useState, useCallback } from 'react';
import {
  formLabel,
  renderIcons,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { Form, Cascader } from 'antd';
import { isBoolean } from '../../../utils';
import { VALIDATE } from '../../constants';
import Axios from 'axios';
/* 
Cascader
  allowClear: boolean(true)
  autoFocus: boolean(false)
  changeOnSelect: boolean(false)
  className: string
  defaultValue: string[]([])
  disabled: boolean(false)
  displayRender: (label, selectedOptions) => ReactNode(label => label.join(' / '))
  expandTrigger: string('click')
  fieldNames: object({ label: 'label', value: 'value', children: 'children' })
  getPopupContainer: Function(triggerNode)(() => document.body)
  loadData: (selectedOptions) => void
  notFoundContent: string('Not Found')
  options: Option[]
  placeholder: string('Please select')
  popupClassName: string()
  popupPlacement: string{bottomLeft bottomRight topLeft topRight}(bottomLeft)
  popupVisible: boolean
  showSearch: boolean|object(false)
  size: string{large default small}(default)
  style: string
  suffixIcon: ReactNode
  value: string[]
  onChange: (value, selectedOptions) => void
  onPopupVisibleChange: (value) => void

showSearch
  filter: function(inputValue, path): boolean
  limit: number | false(50)
  matchInputWidth: boolean
  render: function(inputValue, path): ReactNode
  sort: function(a, b, inputValue)
Option
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
Custom
  api: object
*/
const CASCADER_FIELD = {};

const FormCascader = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  /* 
    allowClear
    autoFocus
    changeOnSelect
    className
    disabled
    expandTrigger
    fieldNames
    notFoundContent
    options
    placeholder
    popupClassName
    popupPlacement
    popupVisible
    showSearch
    size
    style
    suffixIcon
  */
  const {
    name,
    label,
    tooltip,
    extra,
    showSearch,
    api,
    notFoundContent,
    suffixIcon,
    rules,
  } = config;
  const [data, setData] = useState();

  const getData = (url, data = null) =>
    new Promise((resolve, reject) => {
      //
    });

  const loadData = useCallback(
    selectedOptions => {
      if (api) {
        const { url, data } = api;
        // selectedOptions[data];
        // const children = getData(url, data);
      } else {
        throw new TypeError('Api must be provided');
      }
      const target = selectedOptions;
      console.log(target);
    },
    [api],
  );

  const filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  const render = (inputValue, path) => {};

  // const displayRender = (label, selectedOptions) => false;
  // const getPopupContainer = (triggerNode) => document.body;
  // const onPopupVisibleChange = (value) => false;

  let cascaderProps = {
    ...config,
    loadData,
    notFoundContent: notFoundContent || 'Өгөгдөл байхгүй',
    suffixIcon: renderIcons(suffixIcon),
    showSearch: isBoolean(showSearch) ? showSearch : { ...showSearch, filter },
  };

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);

  let itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item
      ref={ref}
      key={name}
      label={itemLabel}
      extra={extra}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(name, fieldOption)(<Cascader {...cascaderProps} />)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormCascader));
