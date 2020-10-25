import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { isString, isObject } from '../../../utils';
import { Button, Row, Col } from 'antd';
import { formError, getElementLayout } from '../../utils';
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
  icon: string
  loading: boolean | { delay: number }(false)
  shape: string
  size: string(default)
  target: string
  type: string(default)
  onClick: (event) => void
  block: boolean(false)
  -----------Custom--------------
  button: string|object
  routerLink: string|object
  label: string
  link: string
*/

const FormAnchor = ({ config, layout }) => {
  let element;
  const { button, routerLink, label, link, className, style } = config;

  const renderLink = (routerLink, label) => {
    const route = isObject(routerLink) ? { ...routerLink } : routerLink;
    return (
      <Link to={route} {...config}>
        {button && isObject(button) ? <Button {...button}>{label}</Button> : label}
      </Link>
    );
  };

  const renderAnchor = (link, label) => {
    return (
      <a href={link} {...config} type={null}>
        {button && isObject(button) ? <Button {...button}>{label}</Button> : label}
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

export default memo(FormAnchor);
