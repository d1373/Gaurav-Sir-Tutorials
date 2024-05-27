const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
  title: String,
  url: String,
});

const ChapterSchema = new Schema({
  title: String,
  pdfs: [PdfSchema],
});

const SubjectSchema = new Schema({
  standard: String,
  batchCode: String,
  subjectName: String,
  chapters: [ChapterSchema],
});

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;
