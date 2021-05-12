import React from 'react';
import { Helmet } from 'react-helmet';

const DocumentTitle = ({ title , children }) => {

    return <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
        {children}
    </>
};

export default DocumentTitle;
