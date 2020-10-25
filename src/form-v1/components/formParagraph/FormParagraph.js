import React, { memo } from 'react';
import _ from 'lodash';
/* 
Paragraph
  wrapperClass: string|string[]
  wrapperStyle: object
  pstyle: object
  pclass: string|string[]
  value: string|string[]
*/

const FormParagraph = ({ config, layout }) => {
  const { wrapperClass, wrapperStyle, pclass, pstyle, value } = config;
  const wrapperClazz =
    wrapperClass && Array.isArray(wrapperClass) ? wrapperClass.join(' ') : wrapperClass;
  const pclazz = pclass && Array.isArray(pclass) ? pclass.join(' ') : pclass;

  const element = val => (
    <p className={pclazz} style={pstyle}>
      {val}
    </p>
  );

  return (
    <div className={wrapperClazz} style={wrapperStyle}>
      {Array.isArray(value)
        ? value.map(val => (
            <p className={pclazz} style={pstyle}>
              {element(val)}
            </p>
          ))
        : element(value)}
    </div>
  );
};

function areEqual(prevProps, nextProps) {
  return _.isEqual(prevProps.config, nextProps.config);
}

export default memo(FormParagraph, areEqual);
