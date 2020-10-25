import React, { memo, forwardRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Form, Rate } from 'antd';
import { ICONS } from '../../constants';
import { isHasProp } from '../../../utils';
import { formLabel } from '../../utils';

/* 
Rate
  allowClear: boolean(true)
  allowHalf: boolean(false)
  autoFocus: boolean(false)
  character: ReactNode(<Icon type="star" />)
  className: string
  count: number(5)
  defaultValue: number(0)
  disabled: boolean(false)
  style: object
  tooltips: string[]
  value: number
  onBlur: Function()
  onChange:	Function(value: number)
  onFocus: Function()
  onHoverChange: 	Function(value: number)
  onKeyDown: Function(event)
*/

const DESCRIPTIONS = {
  en: ['Worst', 'Bad', 'Normal', 'Good', 'Best'],
  mn: ['Маш муу', 'Муу', 'Дунд', 'Сайн', 'Маш сайн'],
};

const COLOR = ['#E74C3C', '#EC7063', '#424949', '#2ECC71', '#27AE60'];

const FormRate = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    initialValue,
    tooltipTxt,
    name,
    label,
    extra,
    tooltip,
    character,
    /* 
    style,
    count,
    disabled,
    allowHalf,
    autoFocus,
    className,
    allowClear, 
    */
  } = config;

  const [value, setValue] = useState(initialValue);

  const onChange = value => setValue(value);

  const renderCharacter = () => {
    if (character) {
      if (character.length >= 2) {
        // return ICONS.includes(character) ? <Icon type={character} /> : <Icon type="star" />;
      }
      if (character.length === 1) {
        return character;
      }
    }
    // return <Icon type="star" />;
  };

  const tooltipText = (
    <span className="ant-rate-text" style={{ color: COLOR[value - 1] }}>
      {DESCRIPTIONS[lang][value - 1]}
    </span>
  );

  const itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item ref={ref} key={name} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(
        name,
        fieldOption,
      )(
        <Rate
          ref={ref}
          {...config}
          onChange={onChange}
          character={renderCharacter()}
          tooltips={tooltipTxt ? DESCRIPTIONS[lang] : null}
        />,
      )}
      {tooltipTxt ? tooltipText : null}
    </Form.Item>
  );
};
/*
  
*/

export default memo(forwardRef(FormRate));
