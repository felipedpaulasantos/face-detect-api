import { PersonGroupDao } from '../infra';
import { PersonGroup } from '../models';
import { faceDetectApi } from '../api';
import { ApiResponseError } from '../custom-errors';

class PersonGroupController {

    // tslint:disable-next-line: no-empty
    constructor() {}

    async createPersonGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let group: PersonGroup = req.body;
        group.id = personGroupId;

        faceDetectApi.createPersonGroup(personGroupId, group)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonGroupDao(req.db).addPersonGroup(group);
                console.info(`Grupo "${group.id}" adicionado com sucesso.`);
                res.status(200).json(apiResponse);
            })
            .catch((err: any) => res.status(err.status).json({erro: err.message}));
    }

    async getPersonGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;

        faceDetectApi.getPersonGroup(personGroupId)
            .then( async (apiResponse: PersonGroup | any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                console.info(`Grupo "${personGroupId}" consultado com sucesso.`);
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json({erro: err.message}));
    }

    async updatePersonGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let personGroup: PersonGroup = req.body;

        faceDetectApi.updatePersonGroup(personGroupId, personGroup)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonGroupDao(req.db).updatePersonGroup(personGroupId, personGroup);
                console.info(`Grupo "${personGroupId}" atualizado com sucesso.`);
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json({erro: err.message}));
    }

    async removePersonGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;

        faceDetectApi.removePersonGroup(personGroupId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonGroupDao(req.db).removePersonGroup(personGroupId);
                console.info(`Grupo "${personGroupId}" removido com sucesso.`);
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json({erro: err.message}));
    }

    async trainPersonGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;

        faceDetectApi.trainPersonGroup(personGroupId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                console.info(`Grupo "${personGroupId}" enviado para treinamento. Aguardar finalização.`);
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json({erro: err.message}));
    }

    async getTrainingStatus(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;

        faceDetectApi.getTrainingStatus(personGroupId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                console.info(`Status de treinamento do grupo "${personGroupId}" consultado com sucesso.`);
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json({erro: err.message}));
    }

    async listAllGroups(req: any, res: any) {

        await new PersonGroupDao(req.db).listAll()
            .then((personGroups: PersonGroup[]) => res.status(200).json(personGroups))
            .catch(err => res.status(err.status).json(err.toJson() ));
    }

}

const personGroupController = new PersonGroupController();
export { personGroupController };
