import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import client from "../../shared/api";
import {gql} from '@apollo/client'
import {ITEM_FRAGMENT} from "../../shared/fragments";
import {withData} from "../../shared/utils";
import {RootState} from "../store";


export type ItemType = {
    id: number
    title: string
    user_id: string
    created_at: string
    last_updated: string
}

export type ItemStateType = {
    status: string
    error: string | null
    data: ItemType []
};

export type FetchAllItemsOptions = {
    page?: number
    limit?: number
}

export type CreateItemInput = {
    title: string
}


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

export const fetchAllItems = createAsyncThunk<ItemType[], FetchAllItemsOptions>('items/getAll', async ({page, limit}, thunkAPI) => {

    const response = await client.query({
        query: schema.Query.items,
        variables: {
            page: page || null,
            limit: limit || null
        }
    });

    return withData<ItemType[]>(response, thunkAPI, 'items');
});

export const createItemAsync = createAsyncThunk<ItemType, CreateItemInput>('items/create', async ({title}, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.createItem,
        variables: {
            input: {
                title
            }
        }
    });

    return withData<ItemType>(response, thunkAPI, 'createItem');
});

export const removeItemById = createAsyncThunk<boolean, number>('items/removeById', async (id, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.removeItem,
        variables: {
            id
        }
    });

    return withData<boolean>(response, thunkAPI, 'removeItem');
});

export const selectItems = (x: RootState): ItemStateType => x.items;

const initialState: ItemStateType = {
    status: '',
    error: null,
    data: [],
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {

        createItem: (state, action) => {
            state.data.push(action.payload);
        },

        clearState: state => {
            state.status = '';
            state.data = [];
            state.error = null;
        },
        removeItem: (state, action) => {

            const index = state.data.findIndex(x => x.id === action.payload.id);
            if (index >= 0) {
                state.data.splice(index, 1);
            }
        }

    },
    extraReducers: builder => {
        builder.addCase(fetchAllItems.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
            console.log(action);
        });

        builder.addCase(fetchAllItems.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message as string;
        });

        builder.addCase(fetchAllItems.pending, (state, action) => {
            state.status = 'loading';
        });

        builder.addCase(createItemAsync.fulfilled, (state, action) => {
            state.data.push(action.payload);
            state.status = 'added';
        });
        builder.addCase(createItemAsync.rejected, (state, action) => {
            state.error = action.error.message as string;
            state.status = 'failed';
        });
        builder.addCase(createItemAsync.pending, (state, action) => {
            state.status = 'adding';
        });
    }
})

export const {createItem, removeItem,clearState} = itemsSlice.actions;

export default itemsSlice.reducer;
