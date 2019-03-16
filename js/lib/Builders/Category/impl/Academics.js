const helpers = require("../../../HelperFunctions");
const isNotEmpty = helpers.isNotEmpty;
const generateSalt = helpers.generateSalt;
const md5 = require("md5");
const moment = require("moment");

var AcademicBuilder = (function () {
	function Academic(academicData) {
		if (isNotEmpty(academicData)) this.academicData = academicData;
		else this.academicData = {};
	}

	Academic.prototype.setOverrideUidCheck = function (override_uid_check) {
		this.academicData.override_uid_check = override_uid_check;
		return this;
	};

	Academic.prototype.setId = function (_id) {
		this.academicData._id = _id;
		return this;
	};

	/* Direct calling is not recommended */
	Academic.prototype.setUid = function (uid) {
		this.academicData.uid = uid;
		return this;
	};

	Academic.prototype.setTitle = function (title) {
		this.academicData.title = title;
		return this;
	};

	Academic.prototype.setDay = function (day) {
		this.academicData.day = day;
		return this;
	};

	Academic.prototype.setMonth = function (month) {
		this.academicData.month = month;
		return this;
	};

	Academic.prototype.setYear = function (year) {
		this.academicData.year = year;
		return this;
	};

	Academic.prototype.setHour = function (hour) {
		this.academicData.hour = hour;
		return this;
	};

	Academic.prototype.setMinute = function (minute) {
		this.academicData.minute = minute;
		return this;
	};

	/* Direct calling is not recommended */
	Academic.prototype.setReleaseDate = function (release_date) {
		this.academicData.release_date = release_date;
		return this;
	};

	Academic.prototype.setCategory = function (category) {
		this.academicData.category = category;
		return this;
	};

	Academic.prototype.setType = function (type) {
		this.academicData.type = type;
		return this;
	};

	Academic.prototype.setAddresses = function (addresses) {
		this.academicData.addresses = addresses;
		return this;
	};

	Academic.prototype.setQualification = function (qualification) {
		this.academicData.qualification = qualification;
		return this;
	};

	Academic.prototype.setFundingStatus = function (funding_status) {
		this.academicData.funding_status = funding_status;
		return this;
	};

	Academic.prototype.setImages = function (images) {
		this.academicData.images = images;
		return this;
	};

	Academic.prototype.setTexts = function (texts) {
		this.academicData.texts = texts;
		return this;
	};

	Academic.prototype.setPartners = function (partners) {
		this.academicData.partners = partners;
		return this;
	};

	Academic.prototype.setIsSponsored = function (is_sponsored) {
		this.academicData.videos = is_sponsored;
		return this;
	};

	Academic.prototype.setIsLive = function (is_live) {
		this.academicData.is_live = is_live;
		return this;
	};

	Academic.prototype.setClickCounter = function (click_counter) {
		this.academicData.click_counter = click_counter;
		return this;
	};

	Academic.prototype.setFavoritedBy = function (favorited_by) {
		this.academicData.favorited_by = favorited_by;
		return this;
	};

	Academic.prototype.setUserVisitInfo = function (user_visit_info) {
		this.academicData.user_visit_info = user_visit_info;
		return this;
	};

	Academic.prototype.setRecheckNeeded = function (recheck_needed) {
		this.academicData.recheck_needed = recheck_needed;
		return this;
	};

	Academic.prototype.setIsApproved = function (is_approved) {
		this.academicData.is_approved = is_approved;
		return this;
	};

	Academic.prototype.setCoordinates = function (coordinates) {
		this.academicData.geometery = {
			type: "Point",
			coordinates: [coordinates.lat, coordinates.lon]
		};
		return this;
	};

	Academic.prototype.build = function () {
		if (this.academicData.addresses && this.academicData.addresses.hasOwnProperty("length"))
			this.academicData.multiple_locations = this.academicData.addresses.length > 1;
		else
			this.academicData.multiple_locations = false;
		if (isNotEmpty(this.release_date)) {
			this.setReleaseDate(new Date(moment(this.academicData.release_date).format("MMM DD, YYYY HH:mm")));
		} else {
			this.setReleaseDate(new Date(moment()
				.hour(this.academicData.hour)
				.minute(this.academicData.minute)
				.date(this.academicData.day)
				.month(this.academicData.month)
				.year(this.academicData.year)
				.format("MMM DD, YYYY HH:mm")
			));
		}
		if (this.academicData.override_uid_check) {
			this.setUid(this.academicData.uid);
		} else {
			var uniqueId = this.academicData.title + this.academicData.release_date.toString();
			this.setUid(md5(uniqueId.replace(/\s/g, "")));
		}
		return this.academicData;
	};
	return Academic;
}());

module.exports = AcademicBuilder;