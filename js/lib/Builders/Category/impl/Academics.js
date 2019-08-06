const helpers = require("../../../HelperFunctions");
const isNotEmpty = helpers.isNotEmpty;
const md5 = require("md5");

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

	Academic.prototype.setDeadline = function (deadline) {
		this.academicData.deadline = new Date(deadline);
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

	Academic.prototype.setEligibilities = function (eligibilities) {
		this.academicData.eligibilities = eligibilities;
		return this;
	};

	Academic.prototype.setBenefits = function (benefits) {
		this.academicData.benefits = benefits;
		return this;
	};

	Academic.prototype.setAdditionalInfo = function (additional_info) {
		this.academicData.additional_info = additional_info;
		return this;
	};

	Academic.prototype.setFundingStatus = function (funding_status) {
		this.academicData.funding_status = isNotEmpty(funding_status) ? funding_status : "Unknown";
		return this;
	};

	Academic.prototype.setImages = function (images) {
		this.academicData.images = images;
		return this;
	};

	Academic.prototype.setVideos = function (videos) {
		this.academicData.videos = videos;
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
		this.academicData.is_sponsored = is_sponsored;
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
			coordinates: [coordinates.lon, coordinates.lat]
		};
		return this;
	};

	Academic.prototype.build = function () {
		if (this.academicData.addresses && this.academicData.addresses.hasOwnProperty("length"))
			this.academicData.multiple_locations = this.academicData.addresses.length > 1;
		else
			this.academicData.multiple_locations = false;
		if (this.academicData.override_uid_check) {
			this.setUid(this.academicData.uid);
		} else {
			var uniqueId = this.academicData.title + this.academicData.deadline.toString();
			this.setUid(md5(uniqueId.replace(/\s/g, "")));
		}
		return this.academicData;
	};
	return Academic;
}());

module.exports = AcademicBuilder;