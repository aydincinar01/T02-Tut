import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {  
  let navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/users", data).then((response) => {
      console.log("User is created...");
      navigate("/");
    });
    console.log("Register form submitted...");
  };
  return (
    <div className="RegisterForm">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="RegisterFormContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="username"
            name="username"
            placeholder="username..."
          />
          <label>Passwoed: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            id="password"
            name="password"
            type="password"
            placeholder="password"
          />
          <button type="submit"> Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
