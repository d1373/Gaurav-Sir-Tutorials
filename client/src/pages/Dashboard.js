import React, { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Dashboard.css';

const Dashboard = () => {
  const [standards] = useState(['VIII', 'IX', 'X']);
  const [subjects] = useState([
    { name: 'Physics' },
    { name: 'Chemistry' },
    { name: 'Biology' },
    { name: 'Maths' },
    { name: 'Hindi' },
    { name: 'English Literature' },
    { name: 'English Grammar' },
    { name: 'History' },
    { name: 'Civics' },
    { name: 'Geography' },
  ]);
  const [setSubjects] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');


  const userType = Cookies.get('type');

  const handleFetchChapters = async () => {
    console.log(`Fetching chapters for standard: ${selectedStandard}, subject: ${selectedSubject}, userType: ${userType}`);
    if (selectedStandard && selectedSubject) {
      try {
        const response = await axios.get(`/api/subjects/details/${selectedSubject}`, {
          params: { userType, standard: selectedStandard },
        });
        console.log('Fetched data:', response.data);
        const subjectData = response.data;
        const chaptersData = subjectData.chapters || [];
        console.log('Parsed chapters:', chaptersData);
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChapters([]); // Set chapters to an empty array if there's an error
      }
    }
  };

  const handleAddChapter = async () => {
    try {
      const response = await axios.post(`/api/subjects/${selectedSubject}/chapter`, {
        title: newChapterTitle,
        pdfs: [{ title: newPdfTitle, url: newPdfUrl }],
      }, {
        params: { standard: selectedStandard },
      });
      setChapters(response.data.chapters);
      setNewChapterTitle('');
      setNewPdfTitle('');
      setNewPdfUrl('');
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };


  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="filter-section">
        <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)}>
          <option value="">Select Standard</option>
          <option value="VIII">VIII</option>
          <option value="IX">IX</option>
          <option value="X">X</option>
        </select>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map(subject => (
            <option key={subject.name} value={subject.name}>{subject.name}</option>
          ))}
        </select>
        <button onClick={handleFetchChapters}>Submit</button>
      </div>
      <div className="chapters-section">
        {chapters.length > 0 ? (
          chapters.map(chapter => (
            <div key={chapter._id} className="chapter">
              <h3>{chapter.title}</h3>
              <div className="pdfs">
                {chapter.pdfs.map(pdf => (
                  <div key={pdf._id} className="pdf">
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">{pdf.title}</a>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No chapters available. Please select a standard and subject.</p>
        )}
      </div>
      {userType === 'Teacher' && selectedStandard && selectedSubject && (
        <div className="add-chapter-form">
          <h2>Add New Chapter</h2>
          <input
            type="text"
            placeholder="Chapter Title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
          />
          <h3>Add PDFs for New Chapter</h3>
          <input
            type="text"
            placeholder="PDF Title"
            value={newPdfTitle}
            onChange={(e) => setNewPdfTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="PDF URL"
            value={newPdfUrl}
            onChange={(e) => setNewPdfUrl(e.target.value)}
          />
          <button onClick={handleAddChapter}>Add Chapter</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
