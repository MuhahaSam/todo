import * as yup from "yup";

export const personVal = yup.object().shape({
    personName: yup.string().required(),
    password: yup.string().required()
})

export const personNameVal = yup.object().shape({
    personName: yup.string().required(),
})
