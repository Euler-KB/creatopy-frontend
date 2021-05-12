import React, {useEffect, useState} from 'react';
import DocumentTitle from "../../Components/DocumentTitle";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {Form, Formik} from "formik";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import useStyles from '../../shared/styles';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from "react-redux";
import {createItemAsync, fetchAllItems, selectItems} from '../../redux/features/itemsSlice';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Divider from "@material-ui/core/Divider";
import {logout, selectUser} from "../../redux/features/authSlice";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LinearProgress from "@material-ui/core/LinearProgress";

const Dashboard = () => {

    const dispatch = useDispatch();
    const [title,setTitle] = useState('');
    const { data , status , error } = useSelector(selectItems);
    const user = useSelector(selectUser);

    const addItem = () => {
        if(title.trim().length === 0)return window.alert('Please enter a valid title');
        dispatch( createItemAsync({ title }) );
        setTitle('');
    };

    const handleLogout = () => {
        if(window.confirm('Are you sure you want to logout')){
            dispatch(logout());
        }
    };

    useEffect(() => {
        dispatch( fetchAllItems({}) );
    },[]);

    return <DocumentTitle title={"Dashboard"}>

        <Container component="main" maxWidth="md">

            <Box mt={8}>

                <Box display={"flex"} mb={2}>
                    <Typography component="h1" variant="h6">
                        Welcome to the dashboard, {user.name}!
                    </Typography>
                </Box>

                <Box display={"flex"} flexDirection={"row"}>

                    <Box flexGrow={1} mr={2}>

                        <TextField value={title}
                                   fullWidth
                                   name={"title"}
                                   id={'title'}
                                   onChange={evt => setTitle(evt.target.value)} placeholder={"Enter title"}/>
                    </Box>

                    <Button variant="contained"
                            color="primary"
                            onClick={addItem}>
                        Add Item
                    </Button>

                    <Button startIcon={<ExitToAppIcon/>}
                            variant={"text"}
                            onClick={handleLogout}/>

                </Box>


                <Box mt={2}/>

                <Paper>

                    {status === 'loading' && <LinearProgress/>}

                    {data.length > 0 ? <List>
                        {data.map((item, index) => (<ListItem key={index} button>

                            <ListItemText
                                primary={item.title}
                                secondary={moment(item.created_at).format('l h:mm')}
                            />

                            <Divider/>
                        </ListItem>))}
                    </List> : <Box p={4}>
                        <Typography variant={'body1'} align={'center'}>There are no items available yet. Add items to show here</Typography>
                    </Box>}
                </Paper>

            </Box>


        </Container>
    </DocumentTitle>;
};

export default Dashboard;
