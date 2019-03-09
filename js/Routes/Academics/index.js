const express = require("express");
const academicIndexRouter = express.Router();

// Getting routes

const returnAcademics = require("./ReturnAcademics");
const addAcademic = require("./AddAcademic");
const deleteAcademic = require("./DeleteAcademic");
const modifyAcademic = require("./ModifyAcademic");
const miscRoutes = require("./Misc");
const returnAllUnchecked = require("./ReturnAllUncheckedAcademics");
const returnAllRecheckNeeded = require("./ReturnAllAcademicsRecheckNeeded");
const approveById = require("./ApproveAcademicById");
const markForRecheckById = require("./MarkAcademicForRecheckById");
const returnAcademicById = require("./ReturnAcademicById");
const returnAcademicByLocation = require('./ReturnAcademicsByLocation');

// CRUD OPERATIONS

academicIndexRouter.use(returnAcademics);
academicIndexRouter.use(returnAcademicByLocation);
academicIndexRouter.use(addAcademic);
academicIndexRouter.use(deleteAcademic);
academicIndexRouter.use(modifyAcademic);
academicIndexRouter.use(miscRoutes);
academicIndexRouter.use(returnAllUnchecked);
academicIndexRouter.use(returnAllRecheckNeeded);
academicIndexRouter.use(approveById);
academicIndexRouter.use(markForRecheckById);
academicIndexRouter.use(returnAcademicById);

module.exports = academicIndexRouter;
