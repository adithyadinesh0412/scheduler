/**
 * name : agendaServices.js
 * author : Vishnudas
 * created-date : 19-may-2022
 * Description : agenda services.
 */

//Dependencies
const configuration = require('@root/config')
const needle = require('needle')
const responseMessage = require('@constants/responseMessage')
const httpResponse = require('@constants/httpResponse')
const common = require('@constants/common')
const { sendErrorMail } = require('@generics/utils')
const log = require('@models/log')
const { elevateLog } = require('elevate-logger')
const logger = elevateLog.init()
//restart agenda instances when server restarts
const jobsReady = agenda._ready.then(async () => {
	const jobDefCollection = agenda._mdb.collection(configuration.definition)
	jobDefCollection.toArray = () => {
		const jobsCursor = jobDefCollection.find()
		return jobsCursor.toArray.bind(jobsCursor)()
	}
	await jobDefCollection
		.toArray()
		.then((jobsArray) => Promise.all(jobsArray.map((job) => defineJob(job, jobDefCollection, agenda))))
	await agenda.start()
	return jobDefCollection
})

//Defining agenda job . job details are added to the collection.
const defineJob = async (job, jobs, agenda) => {
	let jobDef = job
	const { name, request, email } = job
	agenda.define(name, async (job) => {
		//needle is being implemented here
		//adding header details
		const options = {
			headers: request.header ? request.header : {},
		}

		needle(request.method, request.url, options)
			.then(function (response) {
				logger.info('job executed successfully')
				addExicutionLog(jobDef, common.SUCCESS, { response: common.SUCCESS }, job.attrs.lastRunAt)
				return 'good'
			})
			.catch(function (err) {
				addExicutionLog(jobDef, common.FAILED, err, job.attrs.lastRunAt)
				//send mail notification in case of an error
				sendErrorMail(email, jobDef, err)
			})
	})
	let data = await jobs
		.countDocuments({ name })
		.then((count) => (count < 1 ? jobs.insertOne(job) : jobs.updateOne({ name }, { $set: job })))

	return {
		success: true,
	}
}

//scheduling job for every given interval
const scheduleEvery = async (scheduleData, agenda) => {
	try {
		const name = scheduleData.name
		const interval = scheduleData.interval
		const schedule = await agenda.every(interval, name)

		return common.successResponse({
			message: responseMessage.SHEDULE_ONCE_SUCCESS,
			success: true,
			status: httpResponse.OK,
		})
	} catch (err) {
		return common.failureResponse({
			message: responseMessage.SHEDULING_FAILED + err,
			success: false,
			status: httpResponse.BAD_REQUEST,
		})
	}
}

//shedule job for immediate exicution
const scheduleNow = async (jobName, agenda) => {
	try {
		const schedule = await agenda.now(jobName)

		return common.successResponse({
			message: responseMessage.SHEDULE_ONCE_SUCCESS,
			success: true,
			status: httpResponse.OK,
		})
	} catch (err) {
		return common.failureResponse({
			message: responseMessage.SHEDULING_FAILED + err,
			success: false,
			status: httpResponse.BAD_REQUEST,
		})
	}
}

//schedule job for once
const scheduleOnce = async (scheduleData, agenda) => {
	try {
		const name = scheduleData.name
		const interval = scheduleData.interval
		const schedule = await agenda.schedule(interval, name)

		return common.successResponse({
			message: responseMessage.SHEDULE_ONCE_SUCCESS,
			success: true,
			status: httpResponse.OK,
		})
	} catch (err) {
		return commom.failureResponse({
			message: responseMessage.SHEDULING_FAILED + err,
			success: false,
			status: httpResponse.BAD_REQUEST,
		})
	}
}

//Add execution log
const addExicutionLog = async (job, status, resp, time) => {
	let report = new log({
		jobDetails: job,
		runAt: time,
		response: resp,
		exicutionStatus: status,
	})
	await report.save()
}

module.exports = {
	defineJob,
	jobsReady,
	scheduleEvery,
	scheduleNow,
	scheduleOnce,
}
