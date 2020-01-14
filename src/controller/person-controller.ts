import { PersonDao, utils } from '../infra';
import { Person, Face, ImageFile } from '../models'
import { faceDetectApi } from '../api';
import { FileError, ApiResponseError } from '../custom-errors';

class PersonController {

    constructor(){}

    async createPerson(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let person: Person = req.body;
    
        faceDetectApi.createPerson(personGroupId, person)
            .then( async (apiResponse: any) => {

                if (!apiResponse.error) { 
                    person.id = apiResponse.personId;
                    await new PersonDao(req.db).addPerson(person, personGroupId);                    
                    console.info(`Pessoa "${person.name}" adicionada ao Grupo '${personGroupId}' com sucesso.`);                                            
                    res.status(200).json(apiResponse);      
                } else {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }
            })
            .catch(err => res.status(err.status).json(err.toJson()));       
    }
    
    async getPerson(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;
    
        faceDetectApi.getPerson(personGroupId, personId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }
                 
                console.info(`Pessoa ${personId} do grupo '${personGroupId}' consultada com sucesso.`);                                            
                res.status(200).json(apiResponse);      
            })
            .catch(err => res.status(err.status).json(err.toJson()));          
    }

    async updatePerson(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;
        let person: Person = req.body;
    
        faceDetectApi.updatePerson(personGroupId, personId, person)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonDao(req.db).updatePerson(personId, person);                    
                console.info(`Pessoa "${person.name}" atualizada com sucesso.`);                                            
                res.status(200).json(apiResponse);      
                
            })
            .catch(err => res.status(err.status).json(err.toJson()));   
    }

    async removePerson(req: any, res: any) {
    
        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;

        faceDetectApi.removePerson(personGroupId, personId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonDao(req.db).removePerson(personId);                  
                console.info(`Pessoa ${personId} removida do Grupo '${personGroupId}' com sucesso.`);                 
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json(err.toJson()));       
    }

    async addPersonFace(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;
        let userData: string = req.params.userData;
        let faceTarget: string = req.params.faceTarget;

        let imageFile: ImageFile = await utils.extractImageFromRequest(req)
                                .catch(err => res.status(err.status).json(err.toJson()));

        if (!imageFile.imageSrc) {
            throw new FileError("Arquivo ou url inválida")
        }
        
        faceDetectApi.addPersonFace(personGroupId, personId, <ImageFile>imageFile)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                let face: Face = {
                    id: apiResponse.persistedFaceId,
                    createDate: new Date(),
                    userData: userData,
                    target: faceTarget
                };
                await new PersonDao(req.db).addFace(face, personId);                  
                console.info(`Face ${face.id} adicionada à pessoa ${personId}, no Grupo '${personGroupId}' com sucesso.`);  
                res.status(200).json(apiResponse);                    
            })
            .catch(err => res.status(err.status).json(err.toJson())); 
    }

    async getPersonFace(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;
        let faceId: string = req.params.persistedFaceId;
    
        faceDetectApi.getPersonFace(personGroupId, personId, faceId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }
          
                console.info(`Face ${faceId} da pessoa ${personId}, no Grupo '${personGroupId}' consultada com sucesso.`);                                                  
                res.status(200).json(apiResponse);      
            })
            .catch(err => res.status(err.status).json(err.toJson()));             
    }

    async removePersonFace(req: any, res: any) {
    
        let personGroupId: string = req.params.personGroupId;
        let personId: string = req.params.personId;
        let faceId: string = req.params.persistedFaceId;

        faceDetectApi.removePersonFace(personGroupId, personId, faceId)
            .then( async (apiResponse: any) => {

                if (apiResponse.error) {
                    throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
                }

                await new PersonDao(req.db).removePersonFace(personId);                  
                console.info(`Face da pessoa ${personId} removida com sucesso.`);  
                res.status(200).json(apiResponse);
            })
            .catch(err => res.status(err.status).json(err.toJson()));         
    }

    async listAllPersonsFromGroup(req: any, res: any) {

        let personGroupId: string = req.params.personGroupId;

        await new PersonDao(req.db).listAllFromGroup(personGroupId, 1)
            .then((persons: Person[]) => res.status(200).json(persons))
            .catch((err: any) => res.status(err.status).json( err.toJson() ));    
    } 

}

const personController = new PersonController();
export {personController};