const appConfig = require('../../Config/appConfig');
const userController = require('./../controllers/userController');
const auth = require('./../middlewares/authMiddleware');



let baseUrl = `${appConfig.apiVersion}/users`;
module.exports.setRouter = (app) => {
    app.get(`${baseUrl}/getAllUser`,auth.isAuthorized,userController.getAllUser);
    /**
	 * @api {get} /api/v1/users/getAllUSer Get all users
	 * @apiVersion 1.0.0
	 * @apiGroup User Management
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "users found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
						title: "string",
						description: "string",
						bodyHtml: "string",
						views: number,
						isPublished: boolean,
						category: "string",
						author: "string",
						tags: object(type = array),
						created: "date",
						lastModified: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find Blog Details",
	    "status": 500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/signUp`, userController.signUp);
    app.post(`${baseUrl}/login`, userController.login);
    app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);
    //resetPassword
    app.get(`${baseUrl}/resetPassword/:email/:token`, userController.resetPassword);
    //enternew pass
    app.post(`${baseUrl}/newPass`, userController.newPassword);
    //logout
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

}

