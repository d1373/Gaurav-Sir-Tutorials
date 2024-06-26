const Subject = require('../models/Subject');


const addChapter = async (req, res) => {
  const { subjectName } = req.params;
  const { standard } = req.query;
  const { title, pdfs } = req.body;

  try {
    const subject = await Subject.findOne({ subjectName, standard });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    subject.chapters.push({ title, pdfs });
    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error('Error adding chapter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addPdf = async (req, res) => {
  const { subjectId, chapterId } = req.params;
  const { title, url } = req.body;
  try {
    const subject = await Subject.findById(subjectId);
    const chapter = subject.chapters.id(chapterId);
    chapter.pdfs.push({ title, url });
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePdf = async (req, res) => {
  const { subjectId, chapterId, pdfId } = req.params;
  const { title, url } = req.body;
  try {
    const subject = await Subject.findById(subjectId);
    const chapter = subject.chapters.id(chapterId);
    const pdf = chapter.pdfs.id(pdfId);
    pdf.title = title;
    pdf.url = url;
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePdf = async (req, res) => {
  const { subjectId, chapterId, pdfId } = req.params;
  try {
    const subject = await Subject.findById(subjectId);
    const chapter = subject.chapters.id(chapterId);
    chapter.pdfs.id(pdfId).remove();
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getSubjects = async (req, res) => {
  const { standard, batchCode } = req.params;
  const batchCodesArray = batchCode.split(',');

  try {
    const subjects = await Subject.find({
      standard,
      batchCode: { $in: batchCodesArray }
    });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjectDetails = async (req, res) => {
  const { subjectId } = req.params;
  const { subjectName } = req.params;
  const { userType, standard } = req.query;

  console.log(`Fetching subject details for subjectId: ${subjectId}, userType: ${userType}, standard: ${standard}`);

  try {
    let subject;
    if (userType === 'Teacher') {
      // Fetch all chapters for the specific standard
      subject = await Subject.findOne({ subjectName, standard });
    } else {
      // Fetch only the chapters for the specific standard if the user is a student
      subject = await Subject.findOne({ _id: subjectId, standard });
    }

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { addChapter, addPdf, updatePdf, deletePdf, getSubjects, getSubjectDetails };
