import { FormControl, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from 'yup';
import Page from "../../components/Page";

export default function ExamCreate() {
    const validSchema = yup.object({
        name: yup
            .string()
            .required("Name must not be null"),
        type: yup
            .string()
            .required(),
        dateOpen: yup
            .date()
            .required(),
        dateClose: yup
            .date()
            .required(),
        dateStart: yup
            .date()
            .required(),
        dateEnd: yup
            .date()
            .required(),
        maxMember: yup
            .number()
            .required(),
        rules: yup
            .string()
            .required(),
        price: yup
            .number()
            .required(),
    });
    const formik = useFormik({
        initialValues: {
            name: null,
            type: null,
            dateOpen: new Date(),
            dateClose: new Date(),
            dateStart: new Date(),
            dateEnd: new Date(),
            maxMember: null,
            rules: null,
            price: null,
        },
        validationSchema: validSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        }
    })
    return (
        // @ts-ignore
        <Page>
            <FormControl>
                <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth
                    name="type"
                    label="Type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                />
                <TextField
                    fullWidth
                    name="maxMember"
                    label="Max Member"
                    value={formik.values.maxMember}
                    onChange={formik.handleChange}
                    error={formik.touched.maxMember && Boolean(formik.errors.maxMember)}
                    helperText={formik.touched.maxMember && formik.errors.maxMember}
                />
                <TextField
                    fullWidth
                    name="rules"
                    label="Description"
                    value={formik.values.rules}
                    onChange={formik.handleChange}
                    error={formik.touched.rules && Boolean(formik.errors.rules)}
                    helperText={formik.touched.rules && formik.errors.rules}
                />
                <TextField
                    fullWidth
                    name="price"
                    label="Price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                />
            </FormControl>
        </Page>
    );
}