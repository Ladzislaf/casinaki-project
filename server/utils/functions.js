const jwt = require('jsonwebtoken')
const { Rank } = require('../models/models')

const generateToken = (id, username, role, balance, winnings, rank) => {
	return jwt.sign(
		{ id, username, role, balance, winnings, rank },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}

const getRand = (min, max) => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

const getCardValue = (card) => {
	return Math.floor(card / 4) + 1
}

const getCoefficients = (cardValue) => {
	let higherCoefficient, lowerCoefficient
	if (cardValue === 13) {
		higherCoefficient = 12.61
		lowerCoefficient = 1.05
	} else if (cardValue === 1) {
		higherCoefficient = 1.05
		lowerCoefficient = 12.61
	} else {
		higherCoefficient = calculateCoefficient(14 - cardValue, 13)
		lowerCoefficient = calculateCoefficient(cardValue, 13)
	}

	return ({ hCoefficient: higherCoefficient, lCoefficient: lowerCoefficient })
}

const getBombs = (bombsCount) => {
	let bombsArr = []
	while (bombsCount !== 0) {
		let bomb = getRand(1, 25)
		if (!bombsArr.includes(bomb)) {
			bombsArr.push(bomb)
			bombsCount--
		}
	}
	return bombsArr
}

const calculateCoefficient = (a, b) => {
	return 0.97 / (a / b)
}

const updateRank = async (profile) => {
	const ranks = await Rank.findAll()
	let rankId = 1
	for (let i = 0; i < ranks.length; i++) {
		if (profile.winnings_sum >= ranks[i].dataValues.value_to_achieve)
			rankId = i + 1
	}
	if (profile.rankId !== rankId) await profile.update({ rankId: rankId })
}

const getBlackJackCardValue = (cardIndex) => {
	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
	let cards = Array(52)

	for (let i = 0; i < cards.length; i++) {
		cards[i] = values[Math.floor((i / 4))]
	}

	return cards[cardIndex]
}

module.exports = { generateToken, getRand, getCardValue, getCoefficients, getBombs, calculateCoefficient, updateRank, getBlackJackCardValue }