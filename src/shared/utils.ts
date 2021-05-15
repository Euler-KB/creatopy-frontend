import _ from 'lodash';

export const withData = (response,thunkAPI,field) => {

    if(!_.isNil(response.data)){
        return _.isNil(field) ? response.data : response.data[field];
    }

    return thunkAPI.rejectWithValue(response.errors);
}
