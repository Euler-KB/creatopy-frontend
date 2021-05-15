import React from 'react';
import {Field, FieldAttributes} from "formik";
import TextField from "@material-ui/core/TextField";

type FormInputProps = {
    name: string
    label?: string
    type: string
    fullWidth?: boolean
    variant?: "outlined" | "standard" | "filled",
    [key: string]: any
};

export const FormInput: React.FC<FormInputProps> = ({name, label, type, fullWidth = true, variant = "outlined", ...props}: FormInputProps) => {

    return <Field name={name}>
        {({field: {value}, form: {setFieldValue, validateField, setFieldTouched, errors}}: FieldAttributes<any>) => {
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
                    setFieldTouched(name, true, false);
                    validateField(name);
                }}
                onChange={e => setFieldValue(name, e.target.value, false)}
                {...props}
            />
        }}
    </Field>
};


