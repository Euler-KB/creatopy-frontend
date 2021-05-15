import React, {useEffect} from 'react';
import DocumentTitle from "../../Components/DocumentTitle";
import * as yup from 'yup';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Form, Formik, FormikHelpers} from "formik";
import useStyles from '../../shared/styles';
import {FormInput} from "../../Components/FormInput";
import {useDispatch, useSelector} from "react-redux";
import {clearState, loginAsync, selectAuth} from "../../redux/features/authSlice";
import LinearProgress from "@material-ui/core/LinearProgress";
import _ from 'lodash';
import {useHistory} from "react-router-dom";
import {HistoryLink} from "../../Components/HistoryLink";

type LoginFormValues = {
    username: string,
    password: string
}

const initialValues: LoginFormValues = {
    username: '',
    password: ''
};

const loginForm = yup.object({
    username: yup.string().label("Username").required(),
    password: yup.string().label("Password").required()
});

const Login = (): React.ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(selectAuth);
    const {status, user, error} = auth;

    const onSubmit = (values: LoginFormValues, {setSubmitting}: FormikHelpers<LoginFormValues>) => {
        dispatch(loginAsync({username: values.username, password: values.password}));
        setSubmitting(false);
    }

    useEffect(() => {
        dispatch(clearState());
    }, []);

    //  route to login
    useEffect(() => {

        if (status === 'complete' && !_.isNil(user))
            return history.push('/dashboard');

    }, [user, status]);


    return <DocumentTitle title={"Login"}>
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Creatopy Demo - Login
                </Typography>

                <Formik initialValues={initialValues}
                        validationSchema={loginForm}
                        onSubmit={onSubmit}>
                    {({values, errors, setFieldValue}) => (<Form>

                        <FormInput name={"username"}
                                   type={"text"}
                                   label={"Username"}
                                   autoFocus
                                   autoComplete="username"/>

                        <FormInput name={"password"}
                                   type={"password"}
                                   label={"Password"}
                                   autoComplete="current-password"/>

                        {status === 'loading' && <LinearProgress/>}
                        {status === 'failed' &&
                        <Typography color={'error'} variant={"body2"} gutterBottom>{error}</Typography>}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={status === 'loading'}
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" component={HistoryLink} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" component={HistoryLink} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Form>)}
                </Formik>

            </div>
        </Container>
    </DocumentTitle>;
};

export default Login;
