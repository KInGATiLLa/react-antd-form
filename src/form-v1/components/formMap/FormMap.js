import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { formLabel } from '../../utils';

const FormMap = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom
    name,
    label,
    tooltip,
    // common
  } = config;

  const renderMap = () => {};

  const itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item label={itemLabel} key={name} ref={ref}>
      {form.getFieldDecorator(name, fieldOption)(renderMap())}
    </Form.Item>
  );
};

FormMap.defaultProps = {};

export default memo(forwardRef(FormMap));
