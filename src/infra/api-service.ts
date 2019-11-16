import request from 'request-promise';

import { ApiResponseError } from '../custom-errors';
import { utils } from '../infra';

class ApiService {

    constructor(){}

    async doRequest(options: any){

        let response = request(options)
            .then((body: any) => {                        
                return utils.formatResponseBodyToJson(body);
            })
            .catch((errorMessageObj: any) => {
                errorMessageObj = utils.formatResponseBodyToJson(errorMessageObj.error);
                return errorMessageObj;
            });   
         return response;
    }
}

const apiService = new ApiService();
export { apiService };