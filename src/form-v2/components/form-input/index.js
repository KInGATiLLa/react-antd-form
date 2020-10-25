import React, { memo, forwardRef, useMemo, useCallback } from 'react';
import { Input, Icon, Tooltip, InputNumber, Button, Select, Form } from 'antd';
import { isObject, isString, isEmptyObject } from '../../../utils';
import { VALIDATE } from '../../constants';
import InputMask from 'react-input-mask';
import {
  withLang,
  formLabel,
  formError,
  renderIcon,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
/* 
Input 
  -addonAfter : string|ReactNode	
  -addonBefore : string|ReactNode
  -defaultValue : string
  -disabled : boolean(false)
  -id : string
  -maxLength : number
  -prefix : string|ReactNode
  -size : string(large | middle | small)
  -suffix : string|ReactNode
  -type : string(text)
  -value : string	
  -onChange : function(e)
  -onPressEnter : function(e)
  -allowClear : boolean
Input.TextArea
  -autoSize : boolean|object(false)
  -defaultValue : string
  -value : string
  -onPressEnter : function(e)
  -allowClear: boolean
  -onResize: function({ width, height })
Input.Search
  -enterButton : boolean|ReactNode(false)
  -onSearch : function(value, event)
  -loading: boolean
Input.Group
  -compact : boolean(false)
  -size : string(default)
Input.Password
  -visibilityToggle : boolean(true)
Input.Mask
  mask: string | Array<(string | RegExp)>;
  maskChar?: string | null;
  formatChars?: { [key: string]: string };
  alwaysShowMask?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  beforeMaskedValueChange?(
    newState: InputState,
    oldState: InputState,
    userInput: string,
    maskOptions: MaskOptions,
  ): InputState;
  
  InputState: 
    value: string;
    selection: Selection | null;
  Selection:
    start: number;
    end: number;
  MaskOptions:
    mask: string | Array<(string | RegExp)>;
    maskChar: string;
    alwaysShowMask: boolean;
    formatChars: Record<string, string>;
    permanents: number[];
*/

const { Search, TextArea, Password } = Input;
const { Option } = Select;

const components = {
  text: Input,
  search: Search,
  password: Password,
  textarea: TextArea,
  number: InputNumber,
  mask: InputMask,
};

const FormInput = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const { name, label, extra, tooltip, specificType, rules } = config;

  const renderInputAddOn = type => {
    let content;
    const { button, text, icon, select, options } = type;
    if (isString(type)) {
      return type;
    } else {
      if (button) {
        content = <Button {...button}>{text}</Button>;
      } else if (icon) {
        content = renderIcon(icon);
      } else if (select) {
        if (options) {
          const selectOptions = options.map((option, i) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ));
          content = <Select {...select}>{selectOptions}</Select>;
        } else {
          formError('input', 2, type, 'type');
        }
      }
    }
    return content;
  };

  const renderExtras = type => {
    const { tooltip, icon } = type;
    if (isString(type)) {
      return type;
    } else if (isObject(type)) {
      if (tooltip && icon) {
        return <Tooltip {...tooltip}>{renderIcon(icon)}</Tooltip>;
      }
      if (!tooltip && icon) {
        const { icon } = type;
        return renderIcon(icon);
      }
    } else {
      formError('input', 3, type, 'type');
    }
  };

  const getProps = useCallback(() => {
    const {
      percent,
      currency,
      specificType,
      // common-------->
      min,
      max,
      size,
      step,
      style,
      prefix,
      suffix,
      hidden,
      loading,
      disabled,
      autoSize,
      maxLength,
      className,
      autoFocus,
      precision,
      allowClear,
      visibility,
      enterButton,
      placeholder,
      addOnBefore,
      addOnAfter,
      separator,
      // for mask
      mask,
      maskChar,
      alwaysShowMask,
      formatChars,
    } = config;
    const numberFormatter = value => {
      if (currency) {
        return `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else if (percent) {
        return `${value}%`;
      }
      return value;
    };

    const numberParser = value => {
      if (currency) {
        const reg = new RegExp(`\\${currency}\\s?|(,*)`, 'g');
        return value.replace(reg, '');
      } else if (percent) {
        return value.replace('%', '');
      }
      return value;
    };
    const inputPrefix = prefix ? renderExtras(prefix) : null;
    const inputSuffix = suffix ? renderExtras(suffix) : null;
    const inputAddOnBefore = addOnBefore ? renderInputAddOn(addOnBefore) : null;
    const inputAddOnAfter = addOnAfter ? renderInputAddOn(addOnAfter) : null;
    let props = {
      size,
      // style,
      hidden,
      disabled,
      className,
      allowClear,
      placeholder: withLang(placeholder, lang),
    };
    switch (specificType) {
      case 'search':
        props = { ...props, loading, enterButton };
        break;
      case 'password':
        props = { ...props, visibilityToggle: visibility };
        break;
      case 'textarea':
        const auto = autoSize ? autoSize : { minRows: 4, maxRows: 6 };
        props = { ...props, autoSize: auto };
        break;
      case 'number':
        props = {
          ...props,
          max,
          min,
          step,
          autoFocus,
          precision,
          parser: numberParser,
          formatter: numberFormatter,
          decimalSeparator: separator,
        };
        break;
      case 'mask':
        props = {
          ...props,
          mask,
          maskChar,
          formatChars,
          alwaysShowMask,
          suffix: inputSuffix,
          prefix: inputPrefix,
          addonAfter: inputAddOnAfter,
          addonBefore: inputAddOnBefore,
        };
        break;
      default:
        props = {
          ...props,
          maxLength,
          suffix: inputSuffix,
          prefix: inputPrefix,
          addonAfter: inputAddOnAfter,
          addonBefore: inputAddOnBefore,
        };
        break;
    }
    return props;
  }, [config, lang]);

  const renderInput = useMemo(() => {
    if (specificType && isString(specificType)) {
      const types = Object.keys(components);
      if (types.includes(specificType)) {
        let Component = components[specificType];
        const props = getProps();
        if (specificType === 'mask') {
          return (
            <Component ref={ref} {...props}>
              {inputProps => {
                return <Input {...inputProps} />;
              }}
            </Component>
          );
        }
        return <Component ref={ref} {...props} />;
      } else {
        formError('input', 0);
      }
    } else {
      formError('input', 1);
    }
  }, [specificType, getProps, ref]);
  const itemLabel = formLabel(label, tooltip, lang);

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);
  return (
    <Form.Item
      ref={ref}
      key={name}
      extra={extra}
      label={itemLabel}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(name, fieldOption)(renderInput)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormInput));
