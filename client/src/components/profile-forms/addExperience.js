import React, { use } from 'react';
import { useState } from 'react';
import { addExperience } from '../../actions/profileAction';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const AddExperience = () => {  
  
  const navigate = useNavigate();
  const dispatch= useDispatch();

  const[formData,setFormData] = useState({
    company:'',
    title:'',
    location:'',
    from:'',
    to:'',
    current:false,
    description:''
  })

  const [isCurrentJob,setCurrentJob] = useState(false);

  const {company,title,location,from,to,current,description} = formData;

  const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});

    return  <section class="container">
    <h1 class="large text-primary">
     Add The Experience
    </h1>
    <p class="lead">
      <i class="fas fa-code-branch"></i> Add any developer/programming
      positions that you have had in the past
    </p>
    <small>* = required field</small>
    <form class="form" onSubmit={ e => {
      e.preventDefault();
      dispatch(addExperience(formData));
      navigate('/dashboard');
      }}> 
      <div class="form-group">
        <input type="text" placeholder="* Job Title" name="title" value={title} onChange={e => onChange(e)} required />
      </div>
      <div class="form-group">
        <input type="text" placeholder="* Company" name="company" value={company} onChange={e => onChange(e)} required />
      </div>
      <div class="form-group">
        <input type="text" placeholder="Location" value={location} onChange={e => onChange(e)} name="location" />
      </div>
      <div class="form-group">
        <h4>From Date</h4>
        <input type="date" value={from} onChange={e => onChange(e)} name="from" />
      </div>
       <div class="form-group">
        <p><input type="checkbox" name="current" checked={current} onChange={e => {
          setFormData({...formData,current:!isCurrentJob});
          setCurrentJob(!isCurrentJob);
        }} /> Current Job</p>
      </div>
      <div class="form-group">
        <h4>To Date</h4>
        <input type="date" name="to" value={to} disabled={isCurrentJob ? 'disabled' : "" }/>
      </div>
      <div class="form-group">
        <textarea
          name="description"
          value={description}
          onChange={e => onChange(e)}
          cols="30"
          rows="5"
          placeholder="Job Description"
        ></textarea>
      </div>
      <input type="submit" class="btn btn-primary my-1" />
      <a class="btn btn-light my-1" href="dashboard.html">Go Back</a>
    </form>
  </section>
}

export default AddExperience;