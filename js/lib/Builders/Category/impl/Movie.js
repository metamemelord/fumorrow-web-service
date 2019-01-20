const helpers = require("../../../HelperFunctions");
const isNotEmpty = helpers.isNotEmpty;
const generateSalt = helpers.generateSalt;
const checkDate = helpers.checkDate;
const md5 = require("md5");
const moment = require("moment");

var MovieBuilder = (function () {
	function Movie(movieData) {
		if (isNotEmpty(movieData)) this.movieData = movieData;
		else this.movieData = {};
	}


	Movie.prototype.setOverrideUidCheck = function (override_uid_check) {
		this.movieData.override_uid_check = override_uid_check;
		return this;
	};

	Movie.prototype.setId = function (_id) {
		this.movieData._id = _id + generateSalt(12 - _id.length);
		return this;
	};

	/* Direct calling is not recommended */
	Movie.prototype.setUid = function (uid) {
		this.movieData.uid = uid;
		return this;
	};

	Movie.prototype.setTitle = function (title) {
		this.movieData.title = title;
		return this;
	};

	Movie.prototype.setDay = function (day) {
		this.movieData.day = day;
		return this;
	};

	Movie.prototype.setMonth = function (month) {
		this.movieData.month = month;
		return this;
	};

	Movie.prototype.setYear = function (year) {
		this.movieData.year = year;
		return this;
	};

	Movie.prototype.setHour = function (hour) {
		this.movieData.hour = hour;
		return this;
	};

	Movie.prototype.setMinute = function (minute) {
		this.movieData.minute = minute;
		return this;
	};

	/* Direct calling is not recommended */
	Movie.prototype.setReleaseDate = function (release_date) {
		this.movieData.release_date = release_date;
		return this;
	};

	Movie.prototype.setCast = function (cast) {
		this.movieData.cast = cast;
		return this;
	};

	Movie.prototype.setCrew = function (crew) {
		this.movieData.crew = crew;
		return this;
	};

	Movie.prototype.setGenres = function (genres) {
		if (isNotEmpty(genres))
			genres.sort();
		this.movieData.genres = genres;
		return this;
	};

	Movie.prototype.setRuntime = function (runtime) {
		this.movieData.runtime = runtime;
		return this;
	};

	Movie.prototype.setLanguage = function (language) {
		this.movieData.language = language;
		return this;
	};

	Movie.prototype.setImages = function (images) {
		this.movieData.images = images;
		return this;
	};

	Movie.prototype.setVideos = function (videos) {
		this.movieData.videos = videos;
		return this;
	};

	Movie.prototype.setTexts = function (texts) {
		this.movieData.texts = texts;
		return this;
	};

	Movie.prototype.setPartners = function (partners) {
		this.movieData.partners = partners;
		return this;
	};

	Movie.prototype.setShowingAt = function (showing_at) {
		this.movieData.showing_at = showing_at;
		return this;
	};

	Movie.prototype.setVideos = function (videos) {
		this.movieData.videos = videos;
		return this;
	};

	Movie.prototype.setIsSponsored = function (is_sponsored) {
		this.movieData.videos = is_sponsored;
		return this;
	};

	/* Direct calling is not recommended */
	Movie.prototype.setIsReleased = function (is_released) {
		this.movieData.videos = is_released;
		return this;
	};

	Movie.prototype.setIsLive = function (is_live) {
		this.movieData.is_live = is_live;
		return this;
	};

	Movie.prototype.setClickCounter = function (click_counter) {
		this.movieData.click_counter = click_counter;
		return this;
	};

	Movie.prototype.setMpaaRating = function (mpaa_rating) {
		this.movieData.mpaa_rating = mpaa_rating;
		return this;
	};

	Movie.prototype.setBudget = function (budget) {
		this.movieData.budget = budget;
		return this;
	};

	Movie.prototype.setExternalRatings = function (external_ratings) {
		this.movieData.external_ratings = external_ratings;
		return this;
	};

	Movie.prototype.setPredictedRatings = function (predicted_ratings) {
		this.movieData.predicted_ratings = predicted_ratings;
		return this;
	};

	Movie.prototype.setFavoritedBy = function (favorited_by) {
		this.movieData.favorited_by = favorited_by;
		return this;
	};

	Movie.prototype.setUserVisitInfo = function (user_visit_info) {
		this.movieData.user_visit_info = user_visit_info;
		return this;
	};

	Movie.prototype.setRecheckNeeded = function (recheck_needed) {
		this.movieData.recheck_needed = recheck_needed;
		return this;
	};

	Movie.prototype.setIsApproved = function (is_approved) {
		this.movieData.is_approved = is_approved;
		return this;
	};

	Movie.prototype.build = function () {
		if (isNotEmpty(this.release_date)) {
			this.setReleaseDate(new Date(moment(this.movieData.release_date).format("MMM DD, YYYY HH:mm")));
		} else {
			this.setReleaseDate(new Date(moment()
				.hour(this.movieData.hour)
				.minute(this.movieData.minute)
				.date(this.movieData.day)
				.month(this.movieData.month)
				.year(this.movieData.year)
				.format("MMM DD, YYYY HH:mm")
			));
		}

		if (this.movieData.override_uid_check) {
			this.setUid(this.movieData.uid);
		} else {
			var uniqueId = this.movieData.title + this.movieData.release_date.toString();
			this.setUid(md5(uniqueId.replace(/\s/g, "")));
		}

		this.setIsReleased(checkDate(this.movieData.release_date));
		return this.movieData;
	};
	return Movie;
}());

module.exports = MovieBuilder;