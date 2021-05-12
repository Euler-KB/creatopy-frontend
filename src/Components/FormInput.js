import React from 'react';
import  { Field } from "formik";
import TextField from "@material-ui/core/TextField";

export const FormInput = ({ name , label , type , fullWidth = true , variant = "outlined" , ...props }) =>{

    return <Field name={name}>
        {({ field: { value } , form: { setFieldValue , validateField , setFieldTouched ,  errors }}) => {
            return <TextField
                variant={variant}
                margin="normal"
                required
                fullWidth={fullWidth}
                id={name}
                label={label}
                name={name}
                type={type}
                error={!!errors[name]}
                helperText={errors[name]}
                value={value}
                onBlur={e => {
                    setFieldTouched(name,true,false);
                    validateField(name);
                }}
                onChange={e => setFieldValue(name,e.target.value,false)}
                {...props}
            />
        }}
    </Field>
};


