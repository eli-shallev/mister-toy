import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { toyService } from "../services/toy.service"
import { saveToy } from "../store/toy.action"

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
    price: Yup.string()
        .required('Required'),
    labels: Yup.array()
    ,
    inStock: Yup.string()
        .required('Required'),
});


export function ToyEdit() {
    const [toyToEdit, setToyToEdit] = useState(null)
    const { toyId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (toyId) {
            toyService.getById(toyId)
                .then(toy => {
                    setToyToEdit(toy)
                })
        } else {
            setToyToEdit(toyService.getEmptyToy())
        }
    }, [])

    const onSubmit = (values) => {
        toyToEdit.name = values.name
        toyToEdit.price = values.price
        toyToEdit.inStock = values.inStock === 'true'
        toyToEdit.labels = values.labels ? values.labels : toyToEdit.labels
        saveToy(toyToEdit)
            .then(() => {
                showSuccessMsg(`Toy ${toyId ? 'updated' : 'added'}`)
                navigate('/toy')
            })
            .catch(err => {
                showErrorMsg(`Cannot ${toyId ? 'update' : 'add'} toy`)
            })
    }

    return (
        <section className="toy-edit">
            <h2>{toyId ? 'Update toy' : 'Add toy'}</h2>
            {toyToEdit && <Formik
                initialValues={{
                    name: toyToEdit.name,
                    price: toyToEdit.price,
                    inStock: toyToEdit.inStock ? 'true' : 'false',
                }}
                validationSchema={SignupSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form className='formik'>
                        <Field name="name" placeholder='Name' />
                        {errors.name && touched.name ? (
                            <span>{errors.name}</span>
                        ) : null}

                        <Field name="price" type="number" placeholder='Price' />
                        {errors.price && touched.price ? (
                            <span>{errors.price}</span>
                        ) : null}

                        <Field name="inStock" as="select" className="my-select">
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                        </Field>

                        <Autocomplete
                            multiple
                            id="labels"
                            name="labels"
                            options={toyService.getLabels()}
                            getOptionLabel={(option) => option}
                            defaultValue={toyToEdit.labels}
                            filterSelectedOptions
                            disableCloseOnSelect
                            onChange={(e, value) => {
                                console.log(value);
                                setFieldValue(
                                    "labels",
                                    value !== null ? value : ''
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Labels"
                                    placeholder="Labels"
                                    name="labels"
                                />
                            )}
                        />
                        {errors.labels && touched.labels ? (
                            <div>{errors.labels}</div>
                        ) : null}

                        <button type="submit" className="btn-sub">{toyId ? 'Update toy' : 'Add toy'}</button>
                    </Form>

                )}
            </Formik>}
            <Link className="btn-back" to='/toy'><i className="fa-solid fa-arrow-rotate-left"></i></Link>
        </section>
    )
}