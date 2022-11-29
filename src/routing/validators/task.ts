import * as yup from "yup";

export const taskVal = yup.object({
    listTitle: yup.string().required(),
    taskTitle:  yup.string().required(),
    description: yup.string().required(),
    duration: yup.number()
})

export const taskCompleteness = yup.object({
    value: yup.number().min(0).max(100).required(),
    listTitle: yup.string().required(),
    taskTitle: yup.string().required()
})


export const taskDescription = yup.object({
    value: yup.string().required(),
    listTitle: yup.string().required(),
    taskTitle: yup.string().required()
})

export const taskOne = yup.object({
    listTitle: yup.string().required(),
    taskTitle: yup.string().required()
})

export const taskAll = yup.object({
    listTitle: yup.string().required()
})