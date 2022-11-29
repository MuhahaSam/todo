import * as yup from "yup";

export const listTitleVal = yup.object().shape({
    title: yup.string().required(),
})

export const listPermission = yup.object().shape({
    personName: yup.string().required(),
    listTitle: yup.string().required(),
    permission: yup.array().of(yup.mixed().oneOf(['create', 'read', 'update','delete'])).required(),
    action: yup.mixed().oneOf(['give', 'take'])
})