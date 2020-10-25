import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { formLabel } from '../../utils';
/* const handleEditorChange = e => {
  console.log('Content was updated:', e.target.getContent());
};
return (
  <Editor
    initialValue="<p>This is the initial content of the editor</p>"
    init={{
      plugins: 'link image code table anchor',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
    }}
    onChange={e => handleEditorChange(e)}
  />
); */

/* 
Editor
  apiKey: string;
  id: string(Automatically generated UUID.);
  inline: boolean;
  initialValue: string;
  onEditorChange: EventHandler<any>;
  value: string;
  init: Record<string, any>({{
    selector: 'textarea#myTextArea',
    plugins: [
     'lists link image paste help wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help'
  }});
  tagName: string;
  cloudChannel: string;
  plugins: string | string[](
    'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    'save table directionality emoticons template paste'
  );
  toolbar: string | string[];
    (newdocument	bold	italic	underline	strikethrough
    alignleft	aligncenter	alignright	alignjustify	styleselect
    formatselect	fontselect	fontsizeselect	cut	copy
    paste	bullist	numlist	outdent	indent
    blockquote	undo	redo	removeformat	subscript
    superscript)
  disabled: boolean(false);
  textareaName: string;
*/
const defaultPlugins = ['lists link image paste help wordcount'];
const defaultToolbar = ['undo redo | styleselect | bold italic | link image'];
const FormEditor = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom
    name,
    label,
    tooltip,
    // common
    plugins,
    toolbar,
    init,
  } = config;

  const editorChange = () => {};

  const itemLabel = formLabel(label, tooltip, lang);
  const editorPlugins = plugins ? [...defaultPlugins, plugins] : defaultPlugins;
  const editorToolbar = toolbar ? [...defaultToolbar, toolbar] : defaultToolbar;

  return (
    <Form.Item label={itemLabel} key={name} ref={ref}>
      {form.getFieldDecorator(
        name,
        fieldOption,
      )(
        <Editor
          ref={ref}
          {...config}
          init={{
            ...init,
            plugins: editorPlugins,
            toolbar: editorToolbar,
            language: 'mn_MN',
          }}
          plugins={editorPlugins}
          toolbar={editorToolbar}
          onEditorChange={editorChange}
        />,
      )}
    </Form.Item>
  );
};

export default memo(forwardRef(FormEditor));
