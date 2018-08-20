import React from "react";
import xssFilters from "xss-filters";

export const traverseChildren = (el, cb) => {
  const filterChildren = (c) => React.Children.map(c,
    child => traverseChildren(child, cb)
  );
  let newProps = null;
  let newElement = null;
  if(el.children) {
    newElement = {
      ...el,
      children: filterChildren(el.children)
    };
  } else if (el.props && el.props.children) {
    newProps = {
      ...el.props,
      children: filterChildren(el.props.children)
    };
    newElement = React.cloneElement(el, newProps);
  }
  return newElement ? cb(newElement) : cb(el);
};

export const handleFilterXss = (el) => {
  if (typeof(el) === "string") {
    return xssFilters.inHTMLData(el);
  }
  const props = el.props;
  if(!props) {
    return el;
  }
  const newProps = {
    ...props
  };
  if (newProps.src) {
    newProps.src = xssFilters.uriInDoubleQuotedAttr(props.src);
  }
  return React.cloneElement(el, newProps);
};

export const customRenderers = (filterXss) => ({
  image: ({ src, alt }) => {
    return <a rel="nofollow" href={src}>{alt}</a>;
  },
  link: ({ href, children }) => {
    return <a rel="nofollow" href={href}>{children[0]}</a>;
  },
  root: (el) => {
    if(filterXss) {
      el = traverseChildren(el, handleFilterXss);
    }
    const {
      children,
      ...props
    } = el;
    return <div {...props} >{children}</div>;
  }
});
