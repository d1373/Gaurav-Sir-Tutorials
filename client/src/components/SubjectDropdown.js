import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './SubjectDropdown.css';

const SubjectDropdown = () => {
  const [subjects, setSubjects] = useState([]);
  const username = Cookies.get('username');
  const userType = Cookies.get('type');
  const batchCode = Cookies.get('batchCode');
  const standard = Cookies.get('standard');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`/api/subjects/${standard}/${batchCode}`);
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (userType === 'Student') {
      fetchSubjects();
    }
  }, [standard, batchCode, userType]);

  const studentSubjects = subjects.filter(subject => {
    const userBatchCodes = batchCode.split(',');
    return userBatchCodes.includes(subject.batchCode);
  });

  const allSubjects = [
    { name: 'Physics', batchCode: 'Science-maths' },
    { name: 'Chemistry', batchCode: 'Science-maths' },
    { name: 'Biology', batchCode: 'Science-maths' },
    { name: 'Maths', batchCode: 'Science-maths' },
    { name: 'Hindi', batchCode: 'Hindi' },
    { name: 'English Literature', batchCode: 'English' },
    { name: 'English Grammar', batchCode: 'English' },
    { name: 'History', batchCode: 'Social Studies' },
    { name: 'Civics', batchCode: 'Social Studies' },
    { name: 'Geography', batchCode: 'Social Studies' },
  ];

  const subjectsToShow = userType === 'Student' ? studentSubjects : allSubjects;

  return (
    <div className="subject-dropdown">
      {userType === 'Teacher' ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        subjectsToShow.map(subject => (
          <Link key={subject._id || subject.name} to={`/subject/${subject._id || subject.name}`}>
            {subject.subjectName || subject.name}
          </Link>
        ))
      )}
    </div>
  );
};

export default SubjectDropdown;
