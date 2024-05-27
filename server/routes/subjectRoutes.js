const express = require('express');
const { getSubjects, getSubjectDetails, addChapter, addPdf, updatePdf, deletePdf } = require('../controllers/subjectController');
const router = express.Router();

router.get('/:subjectId', getSubjectDetails);
router.get('/:standard/:batchCode', getSubjects);
router.post('/:subjectId/chapter', addChapter);
router.post('/:subjectId/chapter/:chapterId/pdf', addPdf);
router.put('/:subjectId/chapter/:chapterId/pdf/:pdfId', updatePdf);
router.delete('/:subjectId/chapter/:chapterId/pdf/:pdfId', deletePdf);

module.exports = router;
