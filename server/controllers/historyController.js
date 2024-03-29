const ApiError = require('../error/ApiError')
const HistoryService = require('../services/historyService')

class HistoryController {
	async getHistory(req, res, next) {
		try {
			return res.json({ history: await HistoryService.getHistory() })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new HistoryController()
