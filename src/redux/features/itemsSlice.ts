import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../shared/api";
import { gql } from '@apollo/client'
import {ITEM_FRAGMENT} from "../../shared/fragments";
import {withData} from "../../shared/utils";

const schema = {
    Query: {
        itemById: gql`
            ${ITEM_FRAGMENT}
            query GetItemById($id: ID!){
                itemById(id: $id){
                    ...itemPayload
                }
            }
        `,
        items: gql`
            ${ITEM_FRAGMENT}
            query Items($page: Int,$limit: Int){
                items(page: $page,limit: $limit){
                    ...itemPayload
                }
            }
        `,
    },

    Mutation: {

        createItem: gql`
            ${ITEM_FRAGMENT}
            mutation CreateItem($input: CreateItemInput!){
                createItem(input: $input){
                    ...itemPayload
                }
            }
        `,

        removeItem: gql`
            mutation RemoveItem($id: ID!){
                removeItem(id: $id)
            }
        `
    }
};

export const fetchAllItems = createAsyncThunk('items/getAll' , async ({ page , limit },  thunkAPI) => {

    const response = await client.query({
        query: schema.Query.items,
        variables: {
            page: page || null,
            limit: limit || null
        }
    });

    return withData(response,thunkAPI,'items');
});

export const createItemAsync = createAsyncThunk('items/create',async ({ title },thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.createItem,
        variables: {
            input: {
                title
            }
        }
    });

    return withData(response,thunkAPI,'createItem');
});

export const removeItemById = createAsyncThunk('items/removeById' , async (id,thunkAPI) =>{

    const response = await client.mutate({
        mutation: schema.Mutation.removeItem,
        variables: {
            id
        }
    });

    return withData(response,thunkAPI,'removeItem');
});

export const selectItems = x => x.items;

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        status: '',
        error: null,
        data: [],
    },
    reducers: {

        createItem: (state,action) => {
            state.data.push(action.payload);
        },

        removeItem: (state,action) => {

            const index = state.data.findIndex(x => x.id === action.payload.id);
            if(index >=0 ){
                state.data.splice(index,1);
            }
        }

    },
    extraReducers: {

        [fetchAllItems.fulfilled]: (state,action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchAllItems.rejected]: (state,action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [fetchAllItems.pending]: (state,action) => {
            state.status = 'loading';
        },

        //  todo add other actions here
        [createItemAsync.fulfilled]: (state,action) => {
            state.data.push(action.payload);
            state.status = 'added';
        },
        [createItemAsync.rejected]: (state,action) => {
            state.error = action.error.message;
            state.status = 'failed';
        },
        [createItemAsync.pending]: (state,action) => {
            state.status = 'adding';
        }
    }
})

export  const { createItem , removeItem } = itemsSlice.actions;

export default itemsSlice.reducer;
