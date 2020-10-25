import React, { memo, forwardRef } from 'react';
import { Checkbox, Row, Col, Form } from 'antd';
import { isHasProp } from '../../../utils';
import PropTypes from 'prop-types';
import { createFormItemLabel, withLang, formLabel } from '../../utils';
import { VALIDATE } from '../../constants';

/* 
Checkbox
  -autoFocus : boolean (false)
  -checked : boolean (false)
  -defaultChecked : boolean (false)
  -disabled : boolean (false)
  -indeterminate : boolean (false)
  -onChange : Function(e:Event)

Checkbox.Group
  -defaultValue :	string[]|([])
  -disabled : boolean|(false)
  -name : string
  -options : string[]|([])
  -value : string[]|([])
  -onChange : Function(checkedValue)

  blur()
  focus()
*/
const FormCheckBox = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom------------>
    row,
    col,
    name,
    label,
    extra,
    content,
    tooltip,
    options,
    // common------------>
    disabled,
    autoFocus,
    indeterminate,
  } = config;

  const renderCheckBoxGroup = () => {
    let groupElement,
      element = null;
    if (row && col) {
      groupElement = options.map(option => (
        <Col {...col} key={option.value}>
          <Checkbox {...option}>{option.label}</Checkbox>
        </Col>
      ));
      element = (
        <Checkbox.Group ref={ref} name={name} disabled={disabled}>
          <Row {...row}>{groupElement}</Row>
        </Checkbox.Group>
      );
    } else {
      element = <Checkbox.Group ref={ref} name={name} disabled={disabled} options={options} />;
    }
    return element;
  };

  let element = null;

  if (options) {
    element = renderCheckBoxGroup();
  } else {
    element = (
      <Checkbox ref={ref} autoFocus={autoFocus} disabled={disabled} indeterminate={indeterminate}>
        {withLang(content, lang)}
      </Checkbox>
    );
  }

  let itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item ref={ref} key={name} label={itemLabel} extra={extra}>
      {form.getFieldDecorator(name, fieldOption)(element)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormCheckBox));
