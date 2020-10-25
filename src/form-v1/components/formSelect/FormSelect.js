import React, { memo, forwardRef, useCallback } from 'react';
import { Form, Select, Icon } from 'antd';
import { VALIDATE } from '../../constants';
import { isString } from '../../../utils';
import {
  withLang,
  formLabel,
  renderIcons,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { useMemo } from 'react';

/* 
Select
  ---------------Common----------------
  allowClear: boolean(false)
  autoClearSearchValue: boolean(true)
  autoFocus: boolean(false)
  defaultActiveFirstOption: boolean(true)
  defaultValue: string|string[]|number|number[]|LabeledValue|LabeledValue[]
  disabled: boolean(false)
  dropdownClassName: string
  dropdownMatchSelectWidth: boolean(true)
  dropdownRender: (menuNode: ReactNode, props) => ReactNode
  dropdownStyle: object
  dropdownMenuStyle: object
  filterOption: boolean or function(inputValue, option)(true)
  firstActiveValue: string|string[]
  getPopupContainer: function(triggerNode)(() => document.body)
  labelInValue: boolean(false)
  maxTagCount: number
  maxTagTextLength: number
  maxTagPlaceholder: ReactNode/function(omittedValues)
  mode: 'default' | 'multiple' | 'tags'('default')
  notFoundContent: string('Not Found')
  optionFilterProp: string(value)
  optionLabelProp: string(value for combobox, children for other modes)
  placeholder: string|ReactNode
  showArrow: boolean(true)
  showSearch: boolean(false)
  size: string(default)
  suffixIcon: ReactNode
  removeIcon: ReactNode
  clearIcon: ReactNode
  menuItemSelectedIcon: ReactNode
  tokenSeparators: string[]
  value: string|string[]|number|number[]|LabeledValue|LabeledValue[]
  onBlur: function
  onChange: function(value, option:Option/Array<Option>)
  onDeselect: function(string|number|LabeledValue)
  onFocus: function
  onInputKeyDown: function
  onMouseEnter: function
  onMouseLeave: function
  onPopupScroll: function
  onSearch: function(value: string)
  onSelect: function(string|number|LabeledValue, option:Option)
  defaultOpen: boolean
  open: boolean
  onDropdownVisibleChange: function(open)
  loading: Boolean(false)

Option
  disabled: boolean
  key: string
  title: string
  value: string|number
  className: string
OptGroup
  key: string
  label: string|React.Element

  -------------Custom------------
*/

const { Option, OptGroup } = Select;

const FormSelect = (props, ref) => {
  const { form, lang, config, fieldOption, rules } = props;
  const {
    name,
    label,
    extra,
    group,
    // style,
    options,
    tooltip,
    // className,
    // common------->
    filterPattern,
    /* 
    getPopupContainer,
    maxTagPlaceholder,
    notFoundContent,
    placeholder,
    suffixIcon,
    removeIcon,
    clearIcon,
    onBlur,
    onDeselect,
    onFocus,
    onInputKeyDown,
    onMouseEnter,
    onMouseLeave,
    onPopupScroll,
    onSearch,
    onSelect,
    onDropdownVisibleChange, 
    */
  } = config;

  const renderOption = useCallback(() => {
    let option = options.map(o => (
      <Option key={o.value} {...o}>
        {o.label}
      </Option>
    ));
    if (options && isString(options[0])) {
      option = options.map(o => (
        <Option key={o.value} value={o.value}>
          {o.value}
        </Option>
      ));
    }
    if (Array.isArray(group) && group) {
      option = group.map(g => {
        const opt = g.options.map(o => (
          <Option key={o.value} {...o}>
            {o.label}
          </Option>
        ));
        return <OptGroup label={g.label}>{opt}</OptGroup>;
      });
    }
    return option;
  }, [group, options]);

  const filter = useCallback(
    (inputValue, option) => {
      if (
        filterPattern &&
        isString(filterPattern) &&
        (filterPattern instanceof RegExp || filterPattern.constructor === RegExp)
      ) {
        const re = new RegExp(filterPattern, 'gi');
        return option.props.children.match(re);
      }
      return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    },
    [filterPattern],
  );

  const renderSelect = useMemo(() => {
    const { placeholder, clearIcon, removeIcon, suffixIcon, notFoundContent } = config;
    return (
      <Select
        {...config}
        ref={ref}
        placeholder={withLang(placeholder, lang)}
        filterOption={filter}
        clearIcon={renderIcons(clearIcon)}
        removeIcon={renderIcons(removeIcon)}
        suffixIcon={renderIcons(suffixIcon)}
        notFoundContent={notFoundContent || 'Өгөгдөл байхгүй'}
      >
        {renderOption()}
      </Select>
    );
  }, [ref, filter, config, lang, renderOption]);

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);

  const itemLabel = formLabel(label, tooltip, lang);
  return (
    <Form.Item
      ref={ref}
      key={name}
      extra={extra}
      label={itemLabel}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(name, fieldOption)(renderSelect)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormSelect));
