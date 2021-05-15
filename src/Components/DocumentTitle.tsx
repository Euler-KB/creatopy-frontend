import React, {FC} from 'react';
import {Helmet} from 'react-helmet';

type DocumentTitleProps = {
    title: string
    children: any
}

const DocumentTitle: FC<DocumentTitleProps> = ({title, children}: DocumentTitleProps) => {

    return <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
        {children}
    </>
};

export default DocumentTitle;
