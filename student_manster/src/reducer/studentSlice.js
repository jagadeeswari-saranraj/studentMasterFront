// src/redux/slices/studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axiosInstance';

// 📌 Async Thunks
export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await axios.get('/api/student');
  return response.data;
});

export const addStudent = createAsyncThunk('students/addStudent', async (student) => {
  const response = await axios.post('/api/student', student);
  return response.data;
});

export const updateStudent = createAsyncThunk('students/updateStudent', async ({ id, student }) => {
  const response = await axios.put(`/api/student/${id}`, student);
  return response.data;
});

export const deleteStudent = createAsyncThunk('students/deleteStudent', async (id) => {
  await axios.delete(`/api/student/${id}`);
  return id;
});

// 📌 Slice
const studentSlice = createSlice({
  name: 'students',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addStudent.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.data = state.data.filter((s) => s.id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
