import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/core';


export const BuildReportAlert = ( color: 'info' | 'success' | 'warning' | 'error' | undefined, message:string, title:string) => {

    return (
        <Alert
            variant='outlined'
            color={color}
        >
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    )

}