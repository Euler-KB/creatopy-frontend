import React, {useEffect} from 'react';
import DocumentTitle from "../../Components/DocumentTitle";
import * as yup from 'yup';
import Avatar from "@material-ui/core/Avatar";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from "@material-ui/core/Typography";
import {Form, Formik, FormikHelpers} from "formik";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import useStyles from '../../shared/styles';
import {FormInput} from "../../Components/FormInput";
import {useDispatch, useSelector} from "react-redux";
import {clearState, selectAuth, signUpAsync, SignUpInput} from "../../redux/features/authSlice";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useHistory} from "react-router";
import _ from 'lodash';
import Box from "@material-ui/core/Box";
import {HistoryLink} from "../../Components/HistoryLink";

type SignUpFormValues = {
    username: string
    name: string
    phone: string
    email: string
    password: string
    confirmPassword: string
}

const initialValues: SignUpFormValues = {
    username: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const signUpForm = yup.object({
    username: yup.string().label("Username").required(),
    name: yup.string().label("Name").required(),
    phone: yup.string().label("Phone no."),
    email: yup.string().email().label('Email'),
    password: yup.string().label("Password").required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
        .label("Confirm password")
});

const SignUp = (): React.ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const {status, error, user} = useSelector(selectAuth);

    const onSubmit = (values: SignUpFormValues, {setSubmitting}: FormikHelpers<SignUpFormValues>) => {
        dispatch(signUpAsync(values as SignUpInput));
        setSubmitting(false);
    };

    useEffect(() => {
        dispatch(clearState());
    }, []);


    //  route to login
    useEffect(() => {

        if (status === 'complete' && !_.isNil(user))
            return history.push('/dashboard');

    }, [user, status]);

    return <DocumentTitle title={"Sign Up"}>
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <PersonAddIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>

                <Formik initialValues={initialValues}
                        validationSchema={signUpForm}
                        onSubmit={onSubmit}>
                    {({values, errors, setFieldValue}) => (<Form>

                        <FormInput name={"username"}
                                   type={"text"}
                                   label={"Username"}
                                   autoFocus
                                   autoComplete="username"/>

                        <FormInput name={"name"}
                                   type={"text"}
                                   label={"Full Name"}
                                   autoComplete="name"/>

                        <FormInput name={"email"}
                                   type={"email"}
                                   label={"Email"}
                                   autoComplete="email"/>

                        <FormInput name={"phone"}
                                   type={"tel"}
                                   label={"Phone"}
                                   autoComplete="phone"/>

                        <FormInput name={"password"}
                                   type={"password"}
                                   label={"Password"}
                                   autoComplete="current-password"/>

                        <FormInput name={"confirmPassword"}
                                   type={"password"}
                                   label={"Confirm password"}
                                   autoComplete="current-password"/>

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
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/login" component={HistoryLink} variant="body2">
                                    Back to Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Form>)}
                </Formik>

                <Box mb={8}/>
            </div>
        </Container>
    </DocumentTitle>;
};

export default SignUp;
