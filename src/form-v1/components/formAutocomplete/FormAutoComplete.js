import React, { memo, forwardRef, useState, useCallback } from 'react';
import { AutoComplete, Form } from 'antd';
import { isBoolean } from '../../../utils';
import { VALIDATE } from '../../constants';
import {
  withLang,
  formLabel,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { useMemo } from 'react';

/* 
Customized
Customized Input component
Non-case-sensitive AutoComplete
Lookup-Patterns - Certain Category
Lookup-Patterns - Uncertain Category
AutoComplete
  ----Common------
  allowClear:boolean(false)
  autoFocus:boolean
  backfill:boolean
  children(for customize input element):	HTMLInputElement|HTMLTextAreaElement|React.ReactElement<InputProps>(<Input />)
  children(for dataSource):React.ReactElement<OptionProps>|Array<React.ReactElement<OptionProps>>
  dataSource:DataSourceItemType[]{string|value: string; text: string;}
  dropdownMenuStyle:object
  defaultActiveFirstOption:boolean(true)
  defaultValue:string|string[]
  disabled:	boolean(false)
  filterOption:boolean or function(inputValue, option)(true)
  optionLabelProp:string(children)
  placeholder:string
  value:string|string[]|{ key: string, label: string|ReactNode }|Array<{ key: string, label: string|ReactNode }>
  onBlur:function()
  onChange:function(value)
  onFocus:function()
  onSearch:function(value)
  onSelect:function(value, option)
  defaultOpen:boolean
  open:boolean
  onDropdownVisibleChange:function(open)
  ----Custom-------
  name
  label
*/

const { OptGroup, Option } = AutoComplete;

const FormAutoComplete = (props, ref) => {
  const { form, lang, config, fieldOption, rules } = props;
  const {
    // Custom
    name,
    label, // for children(option)
    filterPattern, // regex, string
    // specificType, // default, textarea
    tooltip,
    // input, textarea instead of specificType
    // Common
    // children, // (Input)
    // children,(Option)
    dataSource,
  } = config;

  const [source, setSource] = useState([]);

  const onSearch = useCallback(
    text => {
      setSource(!text ? [] : dataSource);
    },
    [dataSource],
  );

  const filter = useCallback(
    (inputValue, option) => {
      if (
        filterPattern &&
        (filterPattern instanceof RegExp || filterPattern.constructor === RegExp)
      ) {
        const re = new RegExp(filterPattern, 'gi');
        return option.props.children.filter(val => val.match(re));
      }
      return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    },
    [filterPattern],
  );

  const autoComplete = useMemo(() => {
    const { backfill, dataSource, options, placeholder } = config;
    let props = {
      ...config,
      backfill: backfill || false,
      onSearch,
      filterOption: filter,
      placeholder: withLang(placeholder, lang),
    };
    let element = <AutoComplete ref={ref} {...props} dataSource={source} />;
    if (!dataSource && options) {
      const children = options.map(option => <Option key={option}>{option}</Option>);
      element = (
        <AutoComplete ref={ref} {...props}>
          {children}
        </AutoComplete>
      );
    }
    return element;
  }, [onSearch, filter, config, lang, ref, source]);

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
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(name, fieldOption)(autoComplete)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormAutoComplete));
