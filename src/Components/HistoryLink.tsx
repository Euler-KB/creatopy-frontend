import React, {forwardRef} from 'react';
import {useHistory} from 'react-router-dom';

type HistoryLinkProps = {
    href: string
}

export const HistoryLink = forwardRef<any, HistoryLinkProps>(({href, children, ...props}, ref) => {

    const history = useHistory();
    return <a href={href}
              ref={ref}
              onClick={evt => {
                  evt.preventDefault();
                  history.push(href)
              }}
              {...props}>
        {children}
    </a>
});
