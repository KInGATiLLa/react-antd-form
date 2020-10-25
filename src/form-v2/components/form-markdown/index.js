import React, { memo, forwardRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import {
  formLabel,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
// import { linkify } from 'remarkable/linkify';
import { Form, Row, Col, Input } from 'antd';

/* 
Remarkable - Options
  html?: boolean; //Enable HTML tags in source.
  xhtmlOut?: boolean; // Use "/" to close single tags (<br />).
  breaks?: boolean; // Convert "\n" in paragraphs into <br>.
  langPrefix?: string; // CSS language prefix for fenced blocks.
  linkify?: boolean; // Autoconvert URL-like text to links.
  linkTarget?: string; // Set target to open link in
  typographer?: boolean; // Enable some language-neutral replacement + quotes beautification.
  quotes?: string; // Double + single quotes replacement pairs, when typographer enabled, and smartquotes on. Set doubles to "«»" for Russian, "„“" for German.
  highlight?(str: string, lang: string): string; // Highlighter function. Should return escaped HTML, or "" if the source string is not changed.
*/
/*
  preset: "commonmark" | "full" | "remarkable"
  md.use(linkify);
  md.inline.ruler.enable([ 'ins', 'mark' ]);
  md.block.ruler.disable([ 'table', 'footnote' ]);
  md.core.ruler.enable([
    'abbr'
  ]);
  md.block.ruler.enable([
    'footnote',
    'deflist'
  ]);
  md.inline.ruler.enable([
    'footnote_inline',
    'ins',
    'mark',
    'sub',
    'sup'
  ]); 
*/

const { TextArea } = Input;

const textAreaStyle = { border: '1px solid #ECECEC', padding: '1em' };

const MarkDown = ({ ref, config, value, onChange }) => {
  const {
    // custom
    option,
    showResult,
    // common
    preset,
    autoSize,
    disabled,
    placeholder,
  } = config;
  const [data, setData] = useState(value); // 'Hello, **world**!'

  const mdoption = option ? option : { html: true, typographer: true };
  let md = new Remarkable(preset || 'full', mdoption);

  const htmlChange = e => setData(e.target.value);

  const html = md.render(data);

  onChange(html);

  return (
    <Row type="flex" justify="start">
      <Col span={12}>
        <TextArea
          ref={ref}
          autoSize={autoSize ? autoSize : { minRows: 4, maxRows: 8 }}
          disabled={disabled}
          onChange={htmlChange}
          placeholder={placeholder || 'Markdown-аар бичнэ үү.'}
          defaultValue={value}
        />
        {showResult && (
          <Fragment>
            <p>
              <b>Гаралтын утга</b>
            </p>
            <div style={textAreaStyle} dangerouslySetInnerHTML={{ __html: html }}></div>
          </Fragment>
        )}
      </Col>
    </Row>
  );
};

const FormMarkDown = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const { name, label, tooltip, extra, rules } = config;

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
      {form.getFieldDecorator(name, fieldOption)(<MarkDown config={config} />)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormMarkDown));
