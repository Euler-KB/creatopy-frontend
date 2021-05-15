import _ from 'lodash';
import {FetchResult} from "@apollo/client";

export const withData = <T>(response: FetchResult, thunkAPI: any, field: string): T => {

    if (!_.isNil(response.data)) {
        return _.isNil(field) ? response.data : response.data[field];
    }

    return thunkAPI.rejectWithValue(response.errors);
}
