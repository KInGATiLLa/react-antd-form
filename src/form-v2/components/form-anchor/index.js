import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { isString, isObject } from '../../../utils';
import { Button, Row, Col } from 'antd';
import { formError, getElementLayout, renderIcon } from '../../utils';
import { LAYOUT } from '../../constants';

/* 
Link
  -----------Common--------------
  -to: string | object | function
    =pathname: string
    =search: string
    =hash: string
    =state: object -> location
  -replace: boolean
  -innerRef: functoin | RefObject

HTML a (anchor element)
  -----------Common--------------
  -download: filename
  -href: URL	
  -hreflang: language_code	
  -media: media_query
  -ping: list_of_URLs
  -referrerpolicy:
    =no-referrer
    =no-referrer-when-downgrade
    =origin
    =origin-when-cross-origin
    =unsafe-url
  -rel
    =alternate
    =author
    =bookmark
    =external
    =help
    =license
    =next
    =nofollow
    =noreferrer
    =noopener
    =prev
    =search
    =tag
  -target
    =	_blank
    = _parent
    = _self
    = _top
    = framename
  -type: media_type

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
-----------Custom--------------
  button: string|object
  routerLink: string|object -> React router
  label: string
  link: string -> a tag
*/

const FormAnchor = ({ config, layout }) => {
  let element;
  const { button, routerLink, label, link, className, style } = config;

  const getContent = async label => {
    let content = label;
    if (button && isObject(button)) {
      const { icon } = button;
      content = (
        <Button {...button} icon={renderIcon(icon)}>
          {label}
        </Button>
      );
    }
    return content;
  };

  const renderLink = (routerLink, label) => {
    const route = isObject(routerLink) ? { ...routerLink } : routerLink;
    const content = getContent(label);
    return (
      <Link to={route} {...config}>
        {content}
      </Link>
    );
  };

  const renderAnchor = (link, label) => {
    const content = getContent(label);
    return (
      <a href={link} {...config} type={null}>
        {content}
      </a>
    );
  };

  if (routerLink) {
    if (isString(routerLink)) {
      element = renderLink(routerLink, label);
    } else if (isObject(routerLink)) {
      element = renderLink({ ...routerLink }, label);
    } else {
      formError('anchor', 0, routerLink, '{routerLink}');
    }
  } else {
    if (link && isString(link)) {
      element = renderAnchor(link, label);
    } else {
      formError('anchor', 1, link, '{link}');
    }
  }

  let col = getElementLayout(layout);

  return (
    <Row>
      <Col {...col}>
        <div className={className} style={style}>
          {element}
        </div>
      </Col>
    </Row>
  );
};

export default FormAnchor;
