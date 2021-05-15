import React, {useEffect, useMemo} from 'react';
import DocumentTitle from "../../Components/DocumentTitle";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {Form, Formik, FormikHelpers} from "formik";
import {FormInput} from "../../Components/FormInput";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useStyles from '../../shared/styles';
import * as yup from 'yup';
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import {
    beginPasswordReset,
    clearState,
    completePasswordReset,
    selectForgotPassword
} from "../../redux/features/forgotPasswordSlice";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useHistory} from "react-router";
import CheckIcon from '@material-ui/icons/Check'
import {HistoryLink} from "../../Components/HistoryLink";

type ForgotPasswordFormValues = {
    username: string
}

type ResetPasswordFormValues = {
    code: string
    newPassword: string
    confirmPassword: string
}

const forgotInitValues: ForgotPasswordFormValues = {
    username: ''
};

const forgotPassword = yup.object({
    username: yup.string().required().label("Username")
});

const resetPassword = yup.object({
    code: yup.string().label("Code").required(),
    newPassword: yup.string().label("New password"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords do not match')
        .label("Confirm password")
})

const ForgotPassword = (): React.ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const {status, error, confirmUsername, code, id} = useSelector(selectForgotPassword);
    const resetInitValues = useMemo(() => ({
        code: code || '',
        newPassword: '',
        confirmPassword: ''
    } as ResetPasswordFormValues), [code]);

    useEffect(() => {
        dispatch(clearState());
    }, []);

    useEffect(() => {

        if (status === 'complete') {
            window.alert('Password changed successfully!');
            return history.push('/login');
        }

    }, [status]);

    const onSubmitForgotPassword = (values: ForgotPasswordFormValues, {setSubmitting}: FormikHelpers<ForgotPasswordFormValues>) => {
        dispatch(beginPasswordReset({username: values.username}));
        setSubmitting(false);
    };

    const onSubmitResetPassword = (values: ResetPasswordFormValues, {setSubmitting}: FormikHelpers<ResetPasswordFormValues>) => {
        dispatch(completePasswordReset({id, ...values}));
        setSubmitting(false);
    };

    return <DocumentTitle title={"Forgot Password"}>
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>

                <Typography component={"h6"} variant={"body2"} align={"center"}>
                    Recover your lost password by entering your current username
                </Typography>

                <Box mb={4}/>

                {!confirmUsername ? <Formik initialValues={forgotInitValues}
                                            validationSchema={forgotPassword}
                                            onSubmit={onSubmitForgotPassword}>
                        {() => (<Form>

                            <FormInput name={"username"}
                                       type={"text"}
                                       label={"Enter your username"}
                                       autoFocus
                                       autoComplete="username"/>

                            {status === 'loading' && <LinearProgress/>}
                            {status === 'failed' &&
                            <Typography color={'error'} variant={"body2"} gutterBottom>{error}</Typography>}


                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Reset Password
                            </Button>


                        </Form>)}
                    </Formik> :
                    <Formik initialValues={resetInitValues}
                            validationSchema={resetPassword}
                            enableReinitialize
                            onSubmit={onSubmitResetPassword}>
                        {() => (<Form>

                            <FormInput name={"code"}
                                       label={'Password reset code'}
                                       disabled={true}
                                       type={"text"}
                                       autoFocus/>

                            <FormInput name={"newPassword"}
                                       type={"password"}
                                       label={"New password"}/>

                            <FormInput name={"confirmPassword"}
                                       type={"password"}
                                       label={"Confirm password"}/>

                            {status === 'loading' && <LinearProgress/>}
                            {status === 'failed' &&
                            <Typography color={'error'} variant={"body2"} gutterBottom>{error}</Typography>}


                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<CheckIcon/>}
                                className={classes.submit}
                            >
                                Complete
                            </Button>
                        </Form>)}
                    </Formik>}

                <Grid container>
                    <Grid item xs>
                        <Link href="/login" component={HistoryLink} variant="body2">
                            Back to Login
                        </Link>
                    </Grid>
                </Grid>

            </div>
        </Container>
    </DocumentTitle>;
};

export default ForgotPassword;
