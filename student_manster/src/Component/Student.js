import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, deleteStudent, addStudent, updateStudent } from '../reducer/studentSlice';
import Form from 'react-bootstrap/Form';


const Student = () => {

    const dispatch = useDispatch();
    const students = useSelector((state) => state.students.data);
    const studentLoading = useSelector((state) => state.students.loading);
    const studentError = useSelector((state) => state.students.error);
    const [isNew, setIsNew] = useState(true)
    const [formData, setFormData] = useState({
        id: 0,
        stud_name: "",
        stud_department: "",
        stud_age: 0
    })

    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);

    // change the form data value in input form
    const onChangeFormData = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // copy the student data to form data when edit the value
    const editStudent = async (student) => {
        setIsNew(false)
        setFormData({
            id: student.id,
            stud_name: student.stud_name,
            stud_department: student.stud_department,
            stud_age: student.stud_age
        })
    }

    const Submit = async () => {
        if(isNew) {
            await dispatch(addStudent({
                stud_name: formData.stud_name,
                stud_department: formData.stud_department,
                stud_age: formData.stud_age
            }))
        } else {
            setIsNew(true)
            await dispatch(updateStudent({
                id: formData.id,
                student: {
                    stud_name: formData.stud_name,
                    stud_department: formData.stud_department,
                    stud_age: formData.stud_age
                }                
            }))
            setFormData({
                id: 0,
                stud_name: "",
                stud_department: "",
                stud_age: 0
            })
        }
        
    }

    return (
        <div className='container'>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Student Name"
                        name="stud_name"
                        value={formData.stud_name}
                        onChange={(e) => onChangeFormData(e)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Student Department</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Student Department"
                        name="stud_department"
                        value={formData.stud_department}
                        onChange={(e) => onChangeFormData(e)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Student Age</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Student Age"
                        name="stud_age"
                        value={formData.stud_age}
                        onChange={(e) => onChangeFormData(e)} />
                </Form.Group>
            </Form>
                <button onClick={Submit}> Submit </button>
            <br />
            <br />
            <h2>Student List</h2>
            {studentLoading && <p>Loading...</p>}
            {studentError && <p>Error: {studentError}</p>}
            <ul>
                {students.map((student) => (
                <li key={student.id}>
                    {student.stud_name} | {student.stud_department} | {student.stud_age}<span> </span>
                    <button onClick={() => editStudent(student)}> Edit </button> <span> </span>
                    <button onClick={() => dispatch(deleteStudent(student.id))}>Delete</button>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default Student;
