import React, { useState, useMemo, useEffect}  from 'react';
import { useNavigate } from 'react-router';
import {useForm} from "react-hook-form"
import "../styles/create-account.css"

export default function CreateAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create Account"
  })

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()
  
  const postUser = async (data) => {
    const postURL = `http://localhost:3000/addUser`
    const requestBody = {
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.firstname,
      last_name: data.lastname,
      dob: data.dob,
      user_role: data.role
    }
    const requestParams = {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify(requestBody)
    }
    try {
      const response = await fetch(postURL, requestParams)
      if(response.status === 200 || response.status === 201) {
        setTimeout(() => {
          navigate('/login'); //redirect to login on successful account creation
        }, 1500)
      } else {
        alert("An error occurred.")
      }
    } catch {
      alert("An error occurred.")
    }
  
  }
  
  return (
    <div className="CreateAccount">
      <section className='add-user'>
        <h4>Create Account</h4>
        <form className = "login" onSubmit={handleSubmit(postUser)}>
          <span className='user-form-question' id="username">
            Username: <input type='text' name='username' className='user-input' {...register("username", {required: true})}/>
            {errors.username && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="email">
            Email: <input type='email' name='email' className='user-input' {...register("email", {required: true})}/>
            {errors.email && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="password">
            Password: <input type='password' name='password' className='password-input' {...register("password", {required: true})}/>
            {errors.password && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="first-name">
            First name: <input type='name' name='firstname' className='user-input' {...register("firstname", {required: true})}/>
            {errors.firstname && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="last-name">
            Last name: <input type='name' name='lastname' className='user-input' {...register("lastname", {required: true})}/>
            {errors.lastname && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="date-of-birth">
            Date of Birth: <input type='date' name='dob' className='date-input' min="1970-01-01" max="2024-12-31" {...register("dob", {required: true})}/>
            {errors.dob && <span className='required-note'>This field is required</span>}
          </span>
          <span className='user-form-question' id="user-role">
            Type of User: 
            <select name='role' className='user-input' {...register("role", {required: true})}>
              <option>Select User Type</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <span className='required-note'>This field is required</span>}
          </span>
          <button type='submit'>Submit</button>
        </form>
      </section>
      
    </div>
  );
}