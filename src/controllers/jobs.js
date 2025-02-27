/**
 * name : jobs.js
 * author : Vishnudas
 * created-date : 19-may-2022
 * Description : jobs helper.
 */

// Dependencies

const responseMessage = require('@constants/responseMessage')
const httpResponse = require('@constants/httpResponse')
const { jobsReady, defineJob } = require('@services/agendaServices')
const jobsHelper = require('@services/jobs')
const utils = require('@generics/utils')
const common = require('@constants/common')

module.exports = class Jobs {
	/**
	 * @api {post} /scheduler/create
	 * Define And Schedule Job
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/create
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Response:
	*   {
			"message": "Successfully scheduled job at given time.",
			"success": true,
			"status": "200"
		}
	*/

	/**
	 * Define and schedule job
	 * @method
	 * @name create
	 * @returns {JSON} schedule status message.
	 */
	//make it create
	async create(req, res) {
		try {
			let newJob = await jobsHelper.createJobDefinition(req.body)
			return newJob
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {get} /scheduler/jobs/list
	 * Jobs List
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/list
	 * @apiUse successBody
	 * @apiUse errorBody
	* @apiParamExample {json} Response:
	* {
	"message": "Sucessfully fetched job list",
	"status": "200",
	"result": {
		"data": [{
				"_id": "627df0e88f801acf12a636cf",
				"name": "job one",
				"url": "http://localhost:5000/jobEvery",
				"method": "post",
				"owner": "vishnu",
				"email": "vishnu@tunerlabs.com"
			}]
		}
	}
	*/

	/**
	 * Lists of all jobs defined.
	 * @method
	 * @name list
	 * @returns {JSON} List of jobs.
	 */

	async list(req, res) {
		try {
			const jobList = await jobsHelper.listJobs()
			return jobList
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {post} /scheduler/every
	 * Define And Schedule Job
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/every
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Response:
	*   {
			"message": "Successfully scheduled job at given time.",
			"success": true,
			"status": "200"
		}
	*/

	/**
	 * Define job intance which repeat exicute at given interval.
	 * @method
	 * @name every
	 * @returns {JSON} schedule status message.
	 */

	async every(req, res) {
		try {
			//need to add request validation
			const newInstance = await jobsHelper.createJobInstanceForEvery(req.body.name, req.body.interval)
			return newInstance
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {post} /scheduler/run
	 * Define And Schedule Job
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/run
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Response:
	*   {
			"message": "Successfully scheduled job at given time.",
			"success": true,
			"status": "200"
		}
	*/

	/**
	 * Define job intance which exicute immediately.
	 * @method
	 * @name run
	 * @returns {JSON} schedule status message.
	 */

	async run(req, res) {
		try {
			const newInstance = await jobsHelper.createJobInstanceForNow(req.body.name)
			return newInstance
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {post} /scheduler/once
	 * Define And Schedule Job
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/once
	 * @apiUse successBody
	 * @apiUse errorBody
	* @apiParamExample {json} Response:
	*   {
			"message": "Successfully scheduled job at given time.",
			"success": true,
			"status": "200"
		}
	*/

	/**
	 * Define job intance which exicute once.
	 * @method
	 * @name once
	 * @returns {JSON} schedule status message.
	 */

	async once(req, res) {
		try {
			//need to add request validation
			const newInstance = await jobsHelper.createJobInstanceForOnce(req.body.name, req.body.interval)
			return newInstance
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {post} /scheduler/cancel
	 * cancel all instances in DB running on a job.
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/cancel
	 * @apiUse successBody
	 * @apiUse errorBody
	* @apiParamExample {json} Response:
	*   {
			"message": "1- job instance cancelled",
			"success": true,
			"status": 200,
			"result": {}
		}
	*/

	/**
	 * Delete all job instances those are registered under a job.
	 * @method
	 * @name cancel
	 * @returns {JSON} cancel status message.
	 */

	async cancel(req, res) {
		try {
			const cancelJob = await jobsHelper.cancelJobs(req.body.name)
			return cancelJob
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {delete} /scheduler/jobs/delete
	 * delete job data.
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/delete
	 * @apiUse successBody
	 * @apiUse errorBody
	* @apiParamExample {json} Response:
	*   {
			"message": "Successfully deleted job data",
			"success": true,
			"status": 200,
			"result": {}
		}
	*/

	/**
	 * Delete job data of specified job.
	 * @method
	 * @name delete
	 * @returns {JSON} deletion status message.
	 */

	async delete(req, res) {
		try {
			//add validation for param job name
			const deleteJob = await jobsHelper.deleteJobs(req.body.jobname)
			return deleteJob
		} catch (err) {
			return err
		}
	}

	/**
	 * @api {put} /scheduler/jobs/update
	 * update job data.
	 * @apiVersion 1.0.0
	 * @apiGroup jobs
	 * @apiSampleRequest {base URL}/scheduler/jobs/update
	 * @apiUse successBody
	 * @apiUse errorBody
	* @apiParamExample {json} Response:
	*   {
			"message": "Successfully updated job",
			"success": true,
			"status": 200,
			"result": {}
		}
	*/

	/**
	 * update job data of specified job.
	 * @method
	 * @name update
	 * @returns {JSON} updation status message.
	 */

	async update(req, res) {
		try {
			const updateJob = await jobsHelper.updateJobs(req)
			return updateJob
		} catch (err) {
			return err
		}
	}
}
