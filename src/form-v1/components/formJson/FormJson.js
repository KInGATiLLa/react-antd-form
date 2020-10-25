import React, { forwardRef, useRef } from 'react';
import { Form } from 'antd';
import { JsonEditor } from 'jsoneditor-react';
import Ajv from 'ajv';
import 'jsoneditor-react/es/editor.min.css';
import { formLabel } from '../../utils';

/* 
JsonEditor
  value: oneOfType([object, array]),
  mode: oneOf(values),
  name: string,
  schema: object,
  schemaRefs: object,
  onChange: func,
  onError: func,
  onModeChange: func,

  ace: object,
  ajv: object,
  theme: string,
  history: bool,
  navigationBar: bool,
  statusBar: bool,
  search: bool,
  allowedModes: arrayOf(oneOf(values)),

  //  custom props
  tag: string,
  htmlElementProps: object,
  innerRef: func
*/

const FormJson = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  let editorRef = null; // html element ref
  const {
    // custom
    name,
    label,
    tooltip,
    // common
    tag,
    mode,
    search,
    schema,
    history,
    statusBar,
    schemaRefs,
    navigationBar,
    htmlElementProps,
  } = config;

  let ajv = null;

  if (!ajv) {
    ajv = new Ajv({ allErrors: true, verbose: true });
  }

  const onError = err => {
    console.log(err);
  };

  const renderJson = () => {
    return (
      <JsonEditor
        ref={ref}
        // onChange={this.handleChange}
        // mode={mode ? mode : ['form', 'tree']} //'tree' | 'view' | 'form' | 'code' | 'text'
        ajv={ajv}
        tag={tag}
        name={name}
        search={search}
        schema={schema}
        history={history}
        onError={onError}
        statusBar={statusBar}
        schemaRefs={schemaRefs}
        navigationBar={navigationBar}
        innerRef={ref => (editorRef = ref)}
        htmlElementProps={htmlElementProps}
        allowedModes={mode ? mode : ['form', 'tree']}
      />
    );
  };

  const itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item label={itemLabel} key={name} ref={ref}>
      {form.getFieldDecorator(name, fieldOption)(renderJson())}
    </Form.Item>
  );
};

export default forwardRef(FormJson);
