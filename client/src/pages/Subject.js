
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const SubjectPage = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState({ chapters: [] });
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');
  const userType = Cookies.get('type');
  const standard = Cookies.get('standard');

  useEffect(() => {
    const fetchSubject = async () => {
      console.log(`Fetching subject with ID: ${subjectId}, userType: ${userType}, standard: ${standard}`);
      try {
        const response = await axios.get(`/api/subjects/${subjectId}`, {
          params: { userType, standard },
        });
        setSubject(response.data || { chapters: [] });
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    };

    fetchSubject();
  }, [subjectId, userType, standard]);

  const handleAddChapter = async (standard) => {
    try {
      const response = await axios.post(`/api/subjects/${subjectId}/chapter`, { title: newChapterTitle, standard });
      setSubject(response.data);
      setNewChapterTitle('');
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleAddPdf = async (chapterId) => {
    try {
      const response = await axios.post(`/api/subjects/${subjectId}/chapter/${chapterId}/pdf`, { title: newPdfTitle, url: newPdfUrl });
      setSubject(response.data);
      setNewPdfTitle('');
      setNewPdfUrl('');
    } catch (error) {
      console.error('Error adding PDF:', error);
    }
  };

  const handleUpdatePdf = async (chapterId, pdfId) => {
    try {
      const response = await axios.put(`/api/subjects/${subjectId}/chapter/${chapterId}/pdf/${pdfId}`, { title: newPdfTitle, url: newPdfUrl });
      setSubject(response.data);
      setNewPdfTitle('');
      setNewPdfUrl('');
    } catch (error) {
      console.error('Error updating PDF:', error);
    }
  };

  const handleDeletePdf = async (chapterId, pdfId) => {
    try {
      const response = await axios.delete(`/api/subjects/${subjectId}/chapter/${chapterId}/pdf/${pdfId}`);
      setSubject(response.data);
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  if (!subject || !subject.chapters) {
    return <div>Loading...</div>;
  }

  // Group chapters by standard
  const chaptersByStandard = subject.chapters.reduce((acc, chapter) => {
    if (!acc[chapter.standard]) {
      acc[chapter.standard] = [];
    }
    acc[chapter.standard].push(chapter);
    return acc;
  }, {});

  return (
    <div className="subject-page">
      <h2>{subject.subjectName}</h2>
      {Object.keys(chaptersByStandard).map((standard) => (
        <div key={standard} className="standard-section">
          {userType === 'Teacher' && (
            <div>
              <input
                type="text"
                placeholder="New Chapter Title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <button onClick={() => handleAddChapter(standard)}>Add Chapter</button>
            </div>
          )}
          <div className="chapters">
            {chaptersByStandard[standard].map((chapter) => (
              <div key={chapter._id} className="chapter">
                <h3>{chapter.title}</h3>
                {userType === 'Teacher' && (
                  <div>
                    <input
                      type="text"
                      placeholder="New PDF Title"
                      value={newPdfTitle}
                      onChange={(e) => setNewPdfTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="New PDF URL"
                      value={newPdfUrl}
                      onChange={(e) => setNewPdfUrl(e.target.value)}
                    />
                    <button onClick={() => handleAddPdf(chapter._id)}>Add PDF</button>
                  </div>
                )}
                <div className="pdfs">
                  {chapter.pdfs.map((pdf) => (
                    <div key={pdf._id} className="pdf">
                      <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                        {pdf.title}
                      </a>
                      {userType === 'Teacher' && (
                        <div>
                          <button onClick={() => handleUpdatePdf(chapter._id, pdf._id)}>Update</button>
                          <button onClick={() => handleDeletePdf(chapter._id, pdf._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectPage;
