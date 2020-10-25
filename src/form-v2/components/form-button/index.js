import React, { memo, forwardRef, useCallback } from 'react';
import { isObject, isString } from '../../../utils';
import { Button, Icon, Form } from 'antd';
import { withLang, formError } from '../../utils';

/* 
Button
  disabled: boolean(false)
  ghost: boolean(false)
  href: string
  htmlType: string(button)
  icon: ReactNode
  loading: boolean | { delay: number }(false)
  shape: string [	circle, round or omitted ]
  size: large | middle | small
  target: string
  type: string(default)
  onClick: (event) => void
  block: boolean(false)
  danger: boolean(false)
*/

const FormButton = (props, ref) => {
  const { form, lang, layout, config } = props;
  const { name, group } = config;
  const renderGroup = useCallback(() => {
    const { group, size } = config;
    if (isObject(group)) {
      let groupElement;
      // eslint-disable-next-line no-unused-vars
      for (const prop in group) {
        const buttonConfig = group[prop];
        const { label } = buttonConfig;
        groupElement += (
          <Button {...buttonConfig} ref={ref}>
            {withLang(label, lang)}
          </Button>
        );
      }
      return <Button.Group size={size}>{groupElement}</Button.Group>;
    } else {
      formError('button', 0);
    }
  }, [config, lang, ref]);

  const renderNonGroup = useCallback(() => {
    const { label, icon, onClick } = config;
    if (isObject(icon)) {
      const { position } = icon;
      return (
        <Button ref={ref} {...config} icon={null}>
          {position === 'left' ? <Icon {...icon} /> : null}
          {withLang(label, lang)}
          {position === 'right' ? <Icon {...icon} /> : null}
        </Button>
      );
    } else {
      return (
        <Button {...config} ref={ref} onClick={onClick}>
          {withLang(label, lang)}
        </Button>
      );
    }
  }, [lang, config, ref]);

  return (
    <Form.Item key={name} wrapperCol={layout} ref={ref}>
      {group ? renderGroup() : renderNonGroup()}
    </Form.Item>
  );
};

export default memo(forwardRef(FormButton));
