import * as React from 'react';
import MuiLink from '@mui/material/Link';
import { Link as GatsbyLink } from 'gatsby';

const Link = React.forwardRef(function Link(props: any, ref: any) {
  return <MuiLink component={GatsbyLink} ref={ref} {...props} />;
});

export default Link;
